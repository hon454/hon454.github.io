---
published: 2024-01-28
author: Jihoon Jeon
title: 'C++ 캐스팅 안전하게 고르기: static_cast, dynamic_cast, const_cast, reinterpret_cast'
description: C++23 규칙을 기준으로 네 가지 named cast와 C-style cast의 실제 의미, 숫자·상속·cv·비트 변환의 실패 조건과 undefined behavior, Unreal Engine의 RTTI 경계를 정리합니다.
category: C++
tags:
  - cpp
  - casting
  - rtti
  - undefined-behavior
  - unreal-engine
---

C++의 cast는 “값의 type을 바꾼다”는 한 문장으로 묶기 어렵다. 숫자 값을 변환할 수도 있고, 상속 계층 안에서 pointer를 조정할 수도 있으며, cv qualification만 바꾸거나 같은 storage를 다른 type처럼 해석하려 할 수도 있다. 목적과 전제가 전혀 다르다.

cast를 고를 때는 몇 가지 오해를 자주 접한다.

- C-style cast는 `dynamic_cast`를 선택할 수 있다.
- RTTI를 끄면 `dynamic_cast`가 `static_cast`처럼 동작한다.
- `reinterpret_cast`는 bit representation을 그대로 유지한다.
- 64-bit pointer는 `unsigned int`에 저장할 수 있다.
- floating-point 값을 integer로 바꾸면 단순히 반올림 오차만 생긴다.

이 명제들은 일반 C++ 규칙이 아니다. 공개된 C++23 working draft를 기준으로 허용 조건, runtime 검사, 실패 결과, undefined behavior를 분리하고, Unreal Engine의 `Cast<T>`와 native RTTI 경계도 따로 정리한다.

`static_cast`, `dynamic_cast`, `const_cast`, `reinterpret_cast` 네 named cast는 모두 최초 ISO C++ 표준인 C++98부터 함께 존재한다. `dynamic_cast`만 나중에 덧붙은 기능은 아니다.

## 먼저 고르는 표

| 의도                                                 | 선택                                                          | 반드시 확인할 전제                                            | 실패하거나 잘못됐을 때                                |
| ---------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| 명시적 숫자 변환                                     | `static_cast`                                                 | 범위, 유한성, 정밀도 정책                                     | 손실 가능, 일부 범위 밖 변환은 UB                     |
| `Derived*` → `Base*`                                 | 보통 implicit conversion                                      | 접근 가능하고 모호하지 않은 base                              | 잘못된 계층이면 compile error                         |
| 실제 dynamic type이 확실한 `Base*` → `Derived*`      | `static_cast`                                                 | accessible·unambiguous·non-virtual base, 실제 객체 보장       | 전제가 틀리면 cast 자체가 UB                          |
| 실제 dynamic type이 불확실한 class pointer/reference | `dynamic_cast`                                                | polymorphic source와 RTTI 지원                                | pointer는 null, reference는 `std::bad_cast`           |
| cv access path만 조정                                | `const_cast`                                                  | underlying type이 similar하고 실제 const 객체를 수정하지 않음 | 실제 const 수정 또는 volatile 우회는 UB               |
| 같은 크기의 trivially-copyable 값 bit 복사           | `std::bit_cast`                                               | 두 type의 크기가 같고 trivially copyable                      | 목적 type의 유효 representation 조건 확인             |
| object representation의 byte 관찰                    | `std::as_bytes`, `memcpy`, `char`·`unsigned char`·`std::byte` | object lifetime이 유효함                                      | unrelated typed lvalue로 읽으면 aliasing UB           |
| pointer를 같은 process의 임시 integer token으로 왕복 | `reinterpret_cast<std::uintptr_t>`                            | `uintptr_t`가 존재하고 같은 pointer type으로 복원             | mapping은 implementation-defined, 영속 ID로 사용 불가 |
| unrelated pointer로 저수준 ABI 연결                  | 가능하면 typed wrapper                                        | alignment, lifetime, type accessibility를 모두 증명           | cast 성공과 유효한 access는 별개                      |
| 새 C++ 코드의 `(T)value`                             | 사용하지 않음                                                 | C ABI나 macro 경계처럼 피할 수 없는 경우만                    | 어떤 위험한 변환이 선택됐는지 숨김                    |
| Unreal `UObject` 계층                                | `Cast<T>`                                                     | UE reflection 대상 type                                       | 불일치하면 null                                       |
| Unreal이 아닌 native C++ 계층                        | RTTI 설정에 맞는 표준 cast                                    | module·target의 RTTI와 ABI 검토                               | RTTI off가 unchecked cast로 바뀌지 않음               |

cast를 쓰기 전에 implicit conversion, 생성자, virtual dispatch, variant, visitor, type-safe wrapper처럼 cast 자체를 없앨 수 있는지도 먼저 본다.

## 암시적 변환도 항상 안전하지 않다

compiler가 자동으로 수행한다고 값이 보존되는 것은 아니다.

```cpp
double Ratio = 1.75;
int Count = Ratio; // 허용되지만 1로 변환된다.
```

brace initialization은 일부 narrowing을 compile time에 거부한다.

```cpp
// int Count{Ratio}; // compile error: narrowing conversion
```

상속 계층의 안전한 upcast에는 cast 표기조차 필요하지 않다.

```cpp
struct Animal
{
    virtual ~Animal() = default;
};

struct Cat final : Animal
{
};

Cat* CatPointer = nullptr;
Animal* AnimalPointer = CatPointer;
```

명시적 cast는 의도를 드러낼 때 유용하지만, compiler가 이미 안전하게 표현할 수 있는 변환에 습관적으로 붙일 필요는 없다.

## `static_cast`: compile-time에 허용되는 명시적 변환

[`static_cast` 규칙](https://timsong-cpp.github.io/cppwp/n4950/expr.static.cast)은 숫자 변환 외에도 explicit constructor·conversion function을 쓰는 direct initialization, 상속 계층 변환, `void*`에서 object pointer로의 변환, enum 변환, value를 `void`로 버리기 등 여러 범주를 다룬다. 가장 자주 마주치는 숫자와 downcast를 따로 보자.

### 숫자 변환은 조합마다 규칙이 다르다

| source → destination | C++23의 핵심 규칙                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------- |
| floating → integer   | 소수부를 버려 0 방향으로 절삭. 절삭 결과가 표현 범위 밖이면 UB                                |
| integer → integer    | destination width에 맞는 합동 값. signedness와 width가 바뀌면 원래 값이 보존되지 않을 수 있음 |
| integer → floating   | 정확히 표현하지 못하면 인접 값 중 하나. 범위 밖이면 UB                                        |
| floating → floating  | 정확하지 않으면 허용된 인접 값 중 하나. destination 범위 밖이면 UB                            |

특히 `NaN`, `+∞`, `-∞`는 integer로 표현할 수 없으므로 floating→integer cast의 안전한 입력이 아니다. 사용자 입력이나 network 값을 바로 cast하지 말고 먼저 유한성과 범위를 검사한다.

```cpp
#include <cmath>
#include <cstdint>
#include <limits>
#include <optional>

std::optional<std::int32_t> ToInt32(double Value)
{
    if (!std::isfinite(Value))
    {
        return std::nullopt;
    }

    const double Truncated = std::trunc(Value);
    const double Minimum = static_cast<double>(
        std::numeric_limits<std::int32_t>::min());
    const double Maximum = static_cast<double>(
        std::numeric_limits<std::int32_t>::max());

    if (Truncated < Minimum || Truncated > Maximum)
    {
        return std::nullopt;
    }

    return static_cast<std::int32_t>(Truncated);
}
```

이 함수는 “소수부를 0 방향으로 버린다”는 정책을 이름과 구현으로 고정한다. 반올림이 목적이라면 `std::round`, banker's rounding, saturation 등 원하는 정책을 별도로 정한 뒤 범위를 검사해야 한다.

### `static_cast` downcast는 runtime type check가 아니다

```cpp
struct Animal
{
    virtual ~Animal() = default;
};

struct Cat final : Animal
{
    void Meow();
};

Cat* AssumeCat(Animal* Value)
{
    return static_cast<Cat*>(Value);
}
```

이 코드는 `Animal`과 `Cat`의 문법적 관계는 검사하지만 `Value`가 실제로 `Cat` object의 `Animal` subobject를 가리키는지는 검사하지 않는다. 실제 object가 `Cat`이 아니면 [규칙상 변환 자체의 behavior가 undefined](https://timsong-cpp.github.io/cppwp/n4950/expr.static.cast)다.

null pointer 입력은 null `Cat*`로 유지된다. non-null pointer가 실제로 어떤 object를 가리키는지가 위험의 핵심이다.

이 downcast가 허용되려면 destination class가 complete type이고 base가 accessible, unambiguous, non-virtual이어야 한다. virtual base에서 이 방식으로 내려가는 것은 ill-formed다. 외부 입력이나 변할 수 있는 상태라면 `dynamic_cast` 같은 checked path를 사용한다.

`static_cast<T*>(VoidPointer)`도 object를 새로 만들거나 lifetime을 시작하지 않는다. 주소 alignment와 실제 object type이 맞는 storage라는 별도 증거가 필요하다.

## `dynamic_cast`: polymorphic 계층의 runtime 검사

[`dynamic_cast` 규칙](https://timsong-cpp.github.io/cppwp/n4950/expr.dynamic.cast)은 class pointer/reference와 `pointer to cv void`에 적용된다. checked downcast와 cross-cast의 source는 polymorphic class여야 한다. polymorphic이란 virtual member function이 하나라도 있는 class다.

```cpp
struct Animal
{
    virtual ~Animal() = default;
};

struct Cat final : Animal
{
    void Meow();
};

void TryMeow(Animal* Value)
{
    if (Cat* CatValue = dynamic_cast<Cat*>(Value))
    {
        CatValue->Meow();
    }
}
```

실패 결과는 destination 형태에 따라 다르다.

- pointer cast 실패: null
- reference cast 실패: `std::bad_cast`
- null pointer 입력: null
- `dynamic_cast<void*>(Pointer)`: polymorphic object의 most-derived object 주소

virtual destructor 자체가 `dynamic_cast`만의 특별한 요건은 아니다. 어떤 virtual function이든 polymorphic 조건을 만든다. 다만 base pointer로 object를 `delete`할 설계라면 별개의 lifetime 이유로 virtual destructor가 필요하다.

RTTI를 끈 것은 ISO C++에서 새로운 cast 의미를 정의하지 않는다. compiler가 일부 형태를 거부하거나 제한적으로 지원할 수 있지만 checked downcast를 `static_cast`로 바꾸어 주지 않는다. 실패할 수 있는 type 검사를 unchecked cast로 대체하고 싶다면 source code에서 직접 위험을 선택해야 하며, build flag가 조용히 대신해 주는 규칙은 없다.

## `const_cast`: cv qualification만 조정

[`const_cast` 규칙](https://timsong-cpp.github.io/cppwp/n4950/expr.const.cast)은 similar underlying type 사이에서 `const`와 `volatile` qualification을 조정한다. unrelated type을 바꾸는 도구가 아니며, cv를 제거할 수 있는 유일한 named cast다.

중요한 구분은 **access path가 const인가**와 **실제 object가 const로 정의됐는가**이다.

```cpp
int MutableValue = 1;
const int* ReadView = &MutableValue;

*const_cast<int*>(ReadView) = 2; // defined: 실제 object는 non-const

const int FixedValue = 1;
// *const_cast<int*>(&FixedValue) = 2; // UB: 실제 object가 const
```

실제 const complete object나 subobject를 수정하면 UB다. 실제 volatile object를 non-volatile glvalue를 통해 access하는 것도 UB다. cast 표현이 compile됐다는 사실은 object의 원래 선언을 바꾸지 않는다.

pointer뿐 아니라 object reference, rvalue reference, data-member pointer 관련 형태에도 사용할 수 있다. 반대로 function pointer나 member-function pointer에서 임의의 qualification을 바꾸는 도구는 아니다.

잘못 설계된 C API가 mutable pointer를 요구하지만 계약상 읽기만 하고 보관하지 않는다는 사실이 검증된 경우, 좁은 adapter boundary에서 사용할 수 있다. “외부 library라서 괜찮다”가 아니라 **실제 object가 non-const이고 호출 계약이 수정하지 않는다는 증거**가 기준이다.

## `reinterpret_cast`: cast와 유효한 access는 다르다

[`reinterpret_cast` 규칙](https://timsong-cpp.github.io/cppwp/n4950/expr.reinterpret.cast)은 저수준 pointer·integer·reference 변환을 허용하지만 “bit를 그대로 둔 채 type 이름만 바꾼다”는 일반 보장은 하지 않는다. 표준은 mapping이 representation을 바꿀 수도, 바꾸지 않을 수도 있게 둔다.

### Pointer와 integer

pointer는 그 pointer type의 모든 값을 담을 만큼 큰 integer type으로 명시적으로 변환할 수 있고 mapping은 implementation-defined다. 64-bit pointer를 32-bit인 경우가 많은 `unsigned int`에 넣는 예제는 이 조건을 만족하지 않는다.

`std::uintptr_t`가 implementation에 존재한다면 pointer 값을 담을 수 있는 unsigned integer type이다. 그래도 용도는 같은 process에서 object lifetime이 유지되는 동안 같은 pointer type으로 왕복하는 임시 token 정도로 제한한다.

```cpp
#include <cstdint>

struct Widget;

std::uintptr_t ToTransientToken(Widget* Pointer)
{
    return reinterpret_cast<std::uintptr_t>(Pointer);
}

Widget* FromTransientToken(std::uintptr_t Token)
{
    return reinterpret_cast<Widget*>(Token);
}
```

`std::uintptr_t`는 표준에서 optional이다. 지원되지 않는 implementation에는 이 code 자체를 제공하지 않아야 한다. 지원되더라도 token을 file, database, save game, network packet에 저장하면 안 된다. process 재시작, ASLR, object destruction, allocator 재사용 뒤에는 의미 있는 identity가 아니다.

충분히 큰 integer로 갔다가 **같은 pointer type**으로 돌아오는 round trip은 원래 pointer value를 보장한다. 모든 integer가 유효한 pointer가 되는 것, integer→pointer→integer의 일반적인 역변환, object가 계속 살아 있는 것은 보장하지 않는다.

### Unrelated object pointer

```cpp
float Value = 1.0f;

// 다음 pointer cast 자체가 목적 object를 만들지는 않는다.
const std::uint32_t* Bits =
    reinterpret_cast<const std::uint32_t*>(&Value);

// const std::uint32_t BadRead = *Bits; // aliasing/type-access UB
```

pointer를 얻었다고 dereference가 합법이 되는 것은 아니다. 최소 세 조건을 각각 증명해야 한다.

1. 주소가 destination type의 alignment를 만족한다.
2. 그 위치에서 destination type object의 lifetime이 시작되어 있다.
3. 해당 glvalue type을 통한 access가 type-accessible하다.

object representation을 읽는 예외는 `char`, `unsigned char`, `std::byte`다. `signed char`까지 같은 예외라고 일반화하지 않는다. unrelated numeric pointer를 만들어 dereference하는 전통적인 type punning은 이 규칙을 위반할 수 있다.

### 값의 bit pattern이 필요하면 `std::bit_cast`

같은 크기의 trivially-copyable type 사이에서 value representation을 복사하려면 C++20의 [`std::bit_cast`](https://timsong-cpp.github.io/cppwp/n4950/bit.cast)를 사용한다.

```cpp
#include <bit>
#include <cstdint>

static_assert(sizeof(float) == sizeof(std::uint32_t));

float Value = 1.0f;
const std::uint32_t Bits = std::bit_cast<std::uint32_t>(Value);
```

byte sequence를 복사하려면 `std::memcpy`, 읽기 전용 byte view가 필요하면 `std::as_bytes`를 사용한다. raw storage에 object를 만들려면 alignment를 보장하고 placement new나 `std::construct_at`으로 lifetime을 시작한다. `reinterpret_cast` 하나가 이 세 작업을 대신하지 않는다.

function pointer를 다른 function pointer type으로 바꿨다가 원래 type으로 돌리는 round trip과, 다른 signature로 실제 호출하는 것은 별개다. 정의와 호환되지 않는 function type으로 호출하면 UB다. object pointer와 function pointer 사이의 지원 여부도 implementation 조건에 따라 확인한다.

## C-style cast는 `dynamic_cast`를 하지 않는다

C++의 `(T)Expression`과 `T(Expression)` explicit conversion은 문맥에 따라 다음 해석을 순서대로 시도하고 처음 허용되는 것을 선택한다.

1. `const_cast`
2. `static_cast`
3. `static_cast` 후 `const_cast`
4. `reinterpret_cast`
5. `reinterpret_cast` 후 `const_cast`

[`explicit cast notation` 규칙](https://timsong-cpp.github.io/cppwp/n4950/expr.cast)에 `dynamic_cast`는 없다. 그래서 C-style cast는 runtime type check를 자동으로 골라 주지 않는다. 오히려 cv 제거와 위험한 pointer 변환을 한 표기 안에 숨길 수 있고, 일부 base conversion에서는 named `static_cast`보다 access control을 우회하는 예외도 있다.

```cpp
const Animal* Value = nullptr;

// 무엇을 결합했는지 한눈에 드러나지 않는다.
Cat* Hidden = (Cat*)Value;

// 위험하더라도 의도가 분리되어 review할 수 있다.
Animal* Mutable = const_cast<Animal*>(Value);
Cat* Assumed = static_cast<Cat*>(Mutable);
```

두 표현이 우연히 같은 semantics를 선택하고 compiler가 같은 machine code를 만들 수는 있다. 그러나 ISO C++가 모든 build에서 동일 code generation이나 성능을 보장하는 것은 아니며, C-style cast가 checked cast의 비용을 대신 지불하는 일도 없다.

## Unreal Engine에서는 두 type system을 구분한다

### `UObject` 계층: `Cast<T>`

`UObject`, `AActor`, `UActorComponent`, Unreal interface 같은 reflection type에는 Unreal의 `Cast<T>`를 사용한다.

```cpp
UObject* Object = GetCandidateObject();

if (AMyActor* Actor = Cast<AMyActor>(Object))
{
    Actor->ActivateFeature();
}
```

[`Unreal Object Handling`](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-object-handling-in-unreal-engine)은 UObject가 자신의 `UClass` 정보를 가지고 있으며, `Cast`가 실패하면 null을 반환한다고 설명한다. 이 path는 native C++ RTTI가 아니라 Unreal reflection을 사용하므로 Blueprint-generated subclass도 class 관계에 포함된다.

불일치가 정상적으로 가능한 입력은 `Cast`와 null 검사로 처리한다. `CastChecked`는 성공이 programmer invariant인 곳의 assertion 용도이지, 외부 입력을 항상 안전하게 검증하는 대체 API가 아니다. Unreal `Cast`의 내부 분기와 `ExactCast`, interface, Blueprint 경계는 다음 글에서 별도로 다룬다.

### Plain native C++ 계층: RTTI 설정 확인

UObject가 아닌 일반 polymorphic C++ class에는 Unreal reflection이 없다. checked `dynamic_cast`가 필요하면 build가 native RTTI를 지원하도록 설정해야 한다.

```csharp
public MyModule(ReadOnlyTargetRules Target) : base(Target)
{
    bUseRTTI = true;
}
```

Unreal Build Tool은 module별 `bUseRTTI` 설정을 제공한다. Unreal module의 기본과 일반 Visual C++ project의 기본을 섞지 않는다. Microsoft의 [`/GR` 문서](https://learn.microsoft.com/en-us/cpp/build/reference/gr-enable-run-time-type-information?view=msvc-170)는 일반 MSVC project에서 RTTI가 기본 활성이라고 설명하지만, Unreal Build Tool은 자체 규칙으로 compiler flag를 결정한다.

RTTI가 필요한 third-party ABI나 native hierarchy가 있다면 한 module에서 flag만 켜기 전에 platform, linked object의 flag, exception/ABI 정책을 함께 검토한다. Epic의 [third-party library integration 안내](https://dev.epicgames.com/documentation/en-us/unreal-engine/integrating-third-party-libraries-into-unreal-engine)는 RTTI 설정이 다른 binary를 섞을 때의 platform 제약을 별도로 설명한다.

RTTI를 켜기 어렵다면 `static_cast`로 type check를 없애는 것이 자동 해법은 아니다. virtual interface, tagged union, visitor, explicit type identifier처럼 type 관계를 설계에 표현하거나, 실제 dynamic type이 외부 invariant로 보장되는 매우 좁은 boundary에서만 unchecked cast를 사용한다.

## 검토 체크리스트

- implicit conversion이나 typed API로 cast를 제거할 수 있는가?
- 숫자 변환 전에 유한성·범위·절삭/반올림 정책을 검사했는가?
- downcast의 실제 dynamic type을 누가 보장하는가?
- mismatch가 정상 흐름이면 null 또는 exception을 처리하는 checked cast인가?
- `const_cast` 뒤에 실제 const object를 수정하거나 volatile access를 우회하지 않는가?
- `reinterpret_cast` 뒤 alignment, object lifetime, type accessibility가 모두 성립하는가?
- bit copy라면 `std::bit_cast`나 `memcpy`가 더 정확한가?
- pointer integer를 영속 ID나 network 값으로 오해하지 않는가?
- C-style cast가 cv 제거와 pointer 변환을 한 번에 숨기지 않는가?
- UE code라면 UObject reflection 대상과 plain native C++ type을 구분했는가?
- native `dynamic_cast`가 필요하다면 module·target RTTI와 platform ABI를 검증했는가?

좋은 cast 선택은 “가장 빠른 연산자”를 외우는 일이 아니다. compile-time 관계, runtime type, object의 원래 cv 상태, storage lifetime과 representation 중 무엇을 바꾸려는지부터 밝힌 뒤 그 전제를 코드와 검사로 남겨야 한다.

## 참고 자료

- [C++23 working draft: explicit type conversion](https://timsong-cpp.github.io/cppwp/n4950/expr.type.conv)
- [C++23 working draft: explicit cast notation](https://timsong-cpp.github.io/cppwp/n4950/expr.cast)
- [C++23 working draft: `static_cast`](https://timsong-cpp.github.io/cppwp/n4950/expr.static.cast)
- [C++23 working draft: `dynamic_cast`](https://timsong-cpp.github.io/cppwp/n4950/expr.dynamic.cast)
- [C++23 working draft: `const_cast`](https://timsong-cpp.github.io/cppwp/n4950/expr.const.cast)
- [C++23 working draft: `reinterpret_cast`](https://timsong-cpp.github.io/cppwp/n4950/expr.reinterpret.cast)
- [C++23 working draft: floating-integral conversions](https://timsong-cpp.github.io/cppwp/n4950/conv.fpint)
- [C++23 working draft: integral conversions](https://timsong-cpp.github.io/cppwp/n4950/conv.integral)
- [C++23 working draft: type accessibility](https://timsong-cpp.github.io/cppwp/n4950/basic.lval)
- [C++23 working draft: `std::bit_cast`](https://timsong-cpp.github.io/cppwp/n4950/bit.cast)
- [Epic Games: Unreal Object Handling](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-object-handling-in-unreal-engine)
- [Epic Games: Module Properties](https://dev.epicgames.com/documentation/en-us/unreal-engine/module-properties-in-unreal-engine)
- [Epic Games: Integrating Third-Party Libraries](https://dev.epicgames.com/documentation/en-us/unreal-engine/integrating-third-party-libraries-into-unreal-engine)
- [Microsoft: `/GR` runtime type information](https://learn.microsoft.com/en-us/cpp/build/reference/gr-enable-run-time-type-information?view=msvc-170)
