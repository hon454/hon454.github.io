---
published: 2023-01-21
author: Jihoon Jeon
title: Unreal Engine replicated USTRUCT 배열 assertion을 정확히 고치기
description: 반사 가능한 내부 필드가 없는 USTRUCT 배열을 복제할 때 발생한 FRepLayout assertion의 원인과, UPROPERTY·NotReplicated·custom NetSerialize의 정확한 경계를 설명합니다.
image: https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80
category: Unreal Engine
tags:
  - unreal-engine
  - networking
  - replication
  - ustruct
  - uproperty
  - debugging
---

`USTRUCT` 배열을 replicated property로 사용한 뒤 첫 원소를 추가했을 때, `FRepLayout` 내부의 다음 assertion에서 실행이 멈출 수 있다.

```cpp
check(
    ArrayNum < ShadowArrayNum ||
    SharedParams.Cmds[CmdIndex + 1].Type == ERepLayoutCmdType::DynamicArray);
```

이 문제는 구조체 내부의 전송할 멤버에 `UPROPERTY()`를 붙여 해결할 수 있다. 이를 일반 규칙으로 정리하면 다음과 같다.

> 기본 reflection 기반 복제로 클라이언트에 보낼 `USTRUCT` 내부 필드는 모두 `UPROPERTY()`로 반사되어야 한다. 로컬 전용 C++ 필드까지 무조건 `UPROPERTY`여야 하는 것은 아니며, custom serializer는 또 다른 계약을 사용한다.

또한 이 특정 assertion은 구조체 하나가 아니라 **동적 배열 비교 경로**에서 나온다. 실제 선언과 call stack이 `UPROPERTY(Replicated) TArray<FMagazine...>`처럼 빈 replication layout의 구조체 배열이 커진 상황과 일치하는지 함께 확인해야 한다.

## 문제가 된 구조체

문제가 된 구조체는 다음과 같은 형태였다.

```cpp
USTRUCT()
struct FMagazine_NetQuantize
{
    GENERATED_BODY()

    FGuid MagazineId;
    int32 AmmoId = INDEX_NONE;
    int32 AmmoAmount = 0;
};
```

`GENERATED_BODY()`가 있으므로 `FMagazine_NetQuantize`라는 script struct 타입 자체는 Unreal reflection system에 등록된다. 하지만 세 멤버는 일반 C++ 필드일 뿐 `FProperty`로 등록되지 않는다. reflection이 보는 내부 구조는 비어 있다.

이 타입이 다음처럼 Actor의 replicated array에 들어갔다고 가정해 보자.

```cpp
UPROPERTY(Replicated)
TArray<FMagazine_NetQuantize> Magazines;
```

replication은 배열 값과 shadow state를 비교하면서 내부 reflected property를 따라 change handle을 만든다. 실제 배열이 shadow보다 커졌는데 원소 내부에서 만들 수 있는 handle이 하나도 없으면, 배열 command가 기대한 형태와 맞지 않아 위 assertion에 도달할 수 있다.

즉 원인은 C++ 구조체의 byte 수가 0이어서가 아니다. C++에는 세 필드가 있지만, **기본 복제 스키마가 보는 필드 수가 0개**라는 불일치가 핵심이다.

## 기본 reflection 복제에 맞는 수정

클라이언트로 보내야 하는 필드를 모두 반사하고, Actor의 바깥 property를 replicated property로 등록한다.

```cpp
// MagazineNetQuantize.h
#pragma once

#include "CoreMinimal.h"
#include "MagazineNetQuantize.generated.h"

USTRUCT(BlueprintType)
struct FMagazine_NetQuantize
{
    GENERATED_BODY()

    UPROPERTY()
    FGuid MagazineId;

    UPROPERTY()
    int32 AmmoId = INDEX_NONE;

    UPROPERTY()
    int32 AmmoAmount = 0;
};
```

구조체 내부 필드에 다시 `Replicated`를 붙이지 않는다는 점에 주목한다. Actor의 `Magazines`가 replication 단위이고, 기본 struct serializer가 그 안의 reflected field를 순회한다.

```cpp
// MagazineOwner.h
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MagazineNetQuantize.h"
#include "MagazineOwner.generated.h"

UCLASS()
class YOURGAME_API AMagazineOwner : public AActor
{
    GENERATED_BODY()

public:
    AMagazineOwner();

    virtual void GetLifetimeReplicatedProps(
        TArray<FLifetimeProperty>& OutLifetimeProps) const override;

protected:
    UPROPERTY(ReplicatedUsing = OnRep_Magazines)
    TArray<FMagazine_NetQuantize> Magazines;

    UFUNCTION()
    void OnRep_Magazines();
};
```

```cpp
// MagazineOwner.cpp
#include "MagazineOwner.h"
#include "Net/UnrealNetwork.h"

AMagazineOwner::AMagazineOwner()
{
    bReplicates = true;
}

void AMagazineOwner::GetLifetimeReplicatedProps(
    TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    DOREPLIFETIME(AMagazineOwner, Magazines);
}

void AMagazineOwner::OnRep_Magazines()
{
    // 클라이언트 표시나 조회 캐시를 새 최종 상태로 갱신한다.
}
```

이 구성에는 네 층의 계약이 모두 필요하다.

1. `AMagazineOwner`가 실제로 복제되도록 `bReplicates = true`다.
2. 바깥 property에 `Replicated` 또는 `ReplicatedUsing`이 있다.
3. `GetLifetimeReplicatedProps`가 `Super`를 호출하고 `DOREPLIFETIME`으로 property를 등록한다.
4. 기본 serializer로 보낼 struct field에 `UPROPERTY()`가 있다.

하나라도 빠지면 assertion이 사라졌더라도 원하는 데이터가 전송된다는 보장은 없다.

## “모든 멤버”가 아니라 “보낼 멤버”

구조체 안에 서버나 클라이언트가 로컬로만 계산하는 캐시가 있을 수 있다. 그 값은 복제 스키마에서 명시적으로 제외하면 된다.

```cpp
USTRUCT(BlueprintType)
struct FMagazine_NetQuantize
{
    GENERATED_BODY()

    UPROPERTY()
    FGuid MagazineId;

    UPROPERTY()
    int32 AmmoId = INDEX_NONE;

    UPROPERTY()
    int32 AmmoAmount = 0;

    UPROPERTY(NotReplicated, Transient)
    int32 LocalDisplaySortKey = 0;
};
```

[Unreal Engine property 문서](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-uproperties)는 `NotReplicated`가 struct member의 기본 복제를 건너뛰는 specifier라고 설명한다. 이 표현은 필드가 reflection, editor tooling, 복사나 다른 serialization에는 보이되 네트워크 스키마에서는 제외된다는 의도를 드러낸다. `Transient`는 일반 asset/save serialization에서도 유지하지 않겠다는 별도 선택이다.

평범한 non-`UPROPERTY` C++ 필드를 로컬 캐시로 둘 수도 있다. 다만 다음 차이를 감수해야 한다.

- reflection 기반 복제, 저장, editor 노출과 property 비교가 그 필드를 보지 못한다.
- reflection이 수행하는 struct 복사나 초기화 경로에서 기대한 의미가 유지되는지 별도로 검증해야 한다.
- `UObject` 참조를 추적해야 하는 필드를 무심코 non-`UPROPERTY`로 두면 garbage collection과 수명 관리가 깨질 수 있다.
- 복제 상태와 로컬 캐시가 함께 복사되거나 reset되는 시점을 코드가 직접 책임져야 한다.

따라서 단순 POD 파생 캐시가 아니라 엔진 수명과 serialization에 참여해야 하는 값이라면 `UPROPERTY(NotReplicated)`로 의도를 표현하는 편이 안전하다.

## custom `NetSerialize`는 별도의 예외다

기본 reflected serializer 대신 구조체가 직접 bitstream을 정의할 수도 있다.

```cpp
bool NetSerialize(FArchive& Ar, UPackageMap* Map, bool& bOutSuccess);

template <>
struct TStructOpsTypeTraits<FCompressedMagazineSnapshot>
    : public TStructOpsTypeTraitsBase2<FCompressedMagazineSnapshot>
{
    enum
    {
        WithNetSerializer = true,
    };
};
```

`WithNetSerializer = true`가 올바르게 등록되면 `FStructProperty::NetSerializeItem`은 해당 native 함수를 호출한다. 이 경우 함수가 일반 C++ field를 직접 encoding할 수 있으므로 “모든 field는 `UPROPERTY`여야 한다”는 기본 serializer 규칙의 예외가 된다.

그러나 `WithNetSerializer`는 전송 형식만 바꾼다. non-`UPROPERTY` 상태의 **변경 감지**까지 자동으로 해결하지는 않는다. 기본 `UScriptStruct` 비교는 reflected property를 사용하므로, custom payload만 바뀌었을 때 새 값이 dirty로 잡히지 않을 수 있다. 이런 상태를 직접 직렬화한다면 정확한 `operator==`와 `WithIdenticalViaEquality`, 또는 `Identical` 구현과 `WithIdentical` trait까지 함께 설계해야 한다. 배열에 첫 원소를 추가할 때는 전송되지만 기존 원소의 native field만 바꿀 때 누락되는 식의 교묘한 버그가 될 수 있다.

하지만 custom serializer에는 더 큰 책임이 따른다.

- 송신과 수신이 정확히 같은 field 순서와 bit 수를 사용해야 한다.
- enum, index, count, string 길이와 정수 범위를 역직렬화 전에 제한한다.
- `UObject` 참조는 raw address가 아니라 `UPackageMap`을 통한 network reference로 처리한다.
- 이전 클라이언트와 protocol version 호환성을 설계한다.
- equality/change detection과 실패 시 `bOutSuccess` 의미를 검증한다.

구조체 이름에 `_NetQuantize`를 붙이는 것만으로 quantization이나 `NetSerialize`가 생기지 않는다. 엔진의 `FVector_NetQuantize` 같은 타입은 이름 때문이 아니라 실제 serializer와 traits가 구현되어 있어 동작한다.

## assertion을 만났을 때의 진단 순서

### 1. assertion 줄보다 전체 call stack을 본다

같은 `FRepLayout` 함수라도 배열 비교, shadow state, custom delta serialization 등 진입 경로가 다를 수 있다. 이 진단은 call stack이 `CompareProperties_Array_r` 계열로 이어지고, 실제 property가 `TArray<USTRUCT>`이며, inner reflected field가 0개일 때 직접 적용된다.

### 2. 최소 스키마를 적는다

다음 네 가지를 한 화면에 놓고 확인한다.

- 바깥 Actor/Component가 복제되는가?
- 바깥 property가 `UPROPERTY(Replicated...)`인가?
- `DOREPLIFETIME` 또는 해당 등록 macro가 있는가?
- 중첩 struct에서 전송할 field가 `UPROPERTY()`인가?

중첩 타입에 기본 복제가 지원되지 않는 Map/Set이나 delegate가 들어 있지 않은지도 확인한다. Map/Set은 [배열 대리 표현이나 Fast Array로 바꾸는 편](/posts/unreal-engine-networking-containers-and-deferred-spawn/)이 기본 해법이다.

### 3. reflected layout 변경 뒤 프로세스를 새로 시작한다

`USTRUCT`, `UPROPERTY`, container type을 바꾸면 UHT가 만드는 타입 정보와 이미 생성된 replication layout, Actor channel의 shadow state가 모두 영향을 받는다. Live Coding의 object reinstancing이 많은 변경을 처리하더라도, 실행 중인 멀티플레이 세션의 기존 layout까지 안전하게 교체됐다고 가정하지 않는다.

1. PIE, standalone client와 server를 모두 종료한다.
2. editor를 닫는다.
3. 정상적인 전체 target build를 수행한다.
4. 새 editor/process에서 다시 재현한다.

반사 변경 직후에만 문제가 남는다면 stale binary와 generated code도 조사한다. 무작정 `Intermediate` 전체를 지우기 전에 source control 상태와 정확한 build target을 먼저 확인한다.

### 4. 빈 배열만 보지 말고 생명주기 전체를 테스트한다

다음 순서를 dedicated server 또는 별도 server/client process에서 확인한다.

1. 초기 빈 배열로 접속한다.
2. 서버에서 첫 원소를 추가한다.
3. 기존 원소의 각 field를 하나씩 변경한다.
4. 두 번째 원소를 추가하고 첫 원소를 제거한다.
5. late join client가 최종 배열 전체를 받는지 확인한다.
6. 클라이언트 `OnRep`가 event log가 아니라 최종 상태 적용으로 동작하는지 확인한다.

이 assertion은 특히 “0개에서 1개로 증가”하는 순간에 드러날 수 있으므로 초기 값만 비교하는 테스트로는 놓치기 쉽다.

## 빠른 판별표

| 증상                                   | 우선 확인할 것                                                  |
| -------------------------------------- | --------------------------------------------------------------- |
| 첫 struct array 항목 추가 시 assertion | inner struct에 reflected field가 0개인지 확인                   |
| crash는 없지만 값이 전혀 안 옴         | 전송할 field에 `UPROPERTY`가 있는지 확인                        |
| 일부 field만 안 옴                     | 그 field의 `UPROPERTY` 또는 `NotReplicated` 여부 확인           |
| Actor property 전체가 안 옴            | `bReplicates`, outer specifier, `DOREPLIFETIME`, relevancy 확인 |
| 수정 후에만 이상한 layout crash        | PIE 종료, full rebuild, process restart 후 재현                 |
| `_NetQuantize` 이름인데 압축되지 않음  | 실제 `NetSerialize`와 traits 구현 여부 확인                     |

이 문제의 교훈은 단순히 macro를 더 붙이는 것이 아니다. C++ memory layout, Unreal reflection layout, network serialization layout은 서로 같은 것이 아니다. 기본 복제를 사용할 때는 **바깥 property와 전송할 내부 field를 모두 reflection에 명시하고**, 제외할 field는 의도적으로 표시한다. custom serializer를 선택했다면 그 순간부터 wire format과 변경 감지를 직접 책임진다.

## 참고 자료

- [Epic Games: Replicate Actor Properties](https://dev.epicgames.com/documentation/en-us/unreal-engine/replicate-actor-properties-in-unreal-engine)
- [Epic Games: Unreal Engine UProperties](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-uproperties)
- [Epic Games: `UScriptStruct::ICppStructOps::NetSerialize`](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/CoreUObject/UScriptStruct/ICppStructOps/NetSerialize)
