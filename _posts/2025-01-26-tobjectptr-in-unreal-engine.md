---
title: TObjectPtr in Unreal Engine
date: 2025-01-26 16:21:00 +0900
categories: [Unreal, C++]
tags: [unreal, c++, cpp, TObjectPtr]
typora-root-url: .

---

# TObjectPtr

UE5는 에디터 빌드의 원시 오브젝트 포인터에 대한 선택적 대체로 템플릿 기반 64비트 포인터 시스템인 `TObjectPtr` 를 도입했다.



TObjectPtr은 언리얼 엔진 5에 새롭게 추가 된



```cpp
/**
 * TObjectPtr is a type of pointer to a UObject that is meant to function as a drop-in replacement for raw pointer
 * member properties. It is size equivalent to a 64-bit pointer and supports access tracking and optional lazy load
 * behavior in editor builds. It stores either the address to the referenced object or (in editor builds) an index in
 * the object handle table that describes a referenced object that hasn't been loaded yet. It is serialized
 * identically to a raw pointer to a UObject. When resolved, its participation in garbage collection is identical to a
 * raw pointer to a UObject.
 *
 * This is useful for automatic replacement of raw pointers to support advanced cook-time dependency tracking and
 * editor-time lazy load use cases. See UnrealObjectPtrTool for tooling to automatically replace raw pointer members
 * with FObjectPtr/TObjectPtr members instead.
 */
template <typename T>
struct TObjectPtr {...};
```

{: file="ObjectPtr.h"}



## Usage

- `UClass` / `UStruct` 내에서 선언 된 `UObject` 포인터 프로퍼티 혹은 컨테이너 클래스(TArray, TSet, TMap) 멤버 변수에 대해서 활용
- 함수의 인수(Arguments)로 `TObjectPtr` 타입을 전달하는 경우, 기본적으로 원시 포인터 타입으로 매개변수를 구성하여 묵시적 변환을 통해 전달 되도록 구현한다.
  -  `bool MyFunction(TObjectPtr<UObject> FirstParameter);` 이 방법 보다
  - `bool MyFunction(UObject* FirstParameter);` 이 방법을 권장



## Caution

- `UFUNCTION` 매크로가 지정 된 함수의 매개변수의 타입으로는 활용할 수 없다.
  - `UFunctions cannot take a TObjectPtr as a parameter.` 이 와 같은 에러가 발생 한다.
- 



## 참고자료

[Unreal Engine 5 Migration Guide - C++ Object Pointer Properties](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-migration-guide#c++objectpointerproperties)

[UFunctions cannot take a TObjectPtr as a parameter. Why?](https://forums.unrealengine.com/t/ufunctions-cannot-take-a-tobjectptr-as-a-parameter-why/241174)
