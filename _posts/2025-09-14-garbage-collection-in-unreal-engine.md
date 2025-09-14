---
title: GC(Garbage Collection) in Unreal Engine
date: 2025-09-14 12:42:00 +0900
categories: [Unreal, C++]
tags: [unreal, c++, cpp, gc, garbage collection]
typora-root-url: .

---

## 개요

- C#과 같은 Manged 언어들과는 달리 C++은 자동 가비지 컬렉션을 네이티브로 지원하지 않음
- 따라서 프로그래머가 수동으로 힙 할당 메모리의 수명을 관리해야 하는데
  - 원시포인터나 스마트포인터를 사용
- 하지만, 언리얼 엔진에서는 UObject 클래스에서 파생된 CPU 측 게임플레이 오브젝트를 처리 할 때 GC를 지원
- 언리얼 엔진은 `Reference Graph` 를 만들어 오브젝트들의 사용 여부를 구분한다. 이 그래프 루트에는 "Root Set" 이라고 지정된 오브젝트 셋이 있으며, `Root Set` 에 포함된 객체들은 GC 대상에서 제외된다(Mark & Sweep 방식으로 추적).



## 가비지 컬렉션(GC, Garbage Collection) 이란?

- 일종의 메모리 관리 기능
- 메모리를 자동으로 스캔하고 참조되지 않은 메모리를 회수



## Mark and sweep

- 일반적인 GC 프로세스는 Mark, Sweep 두 단계로 구성 된다.

### Mark Stage

- GC는 프로그램의 모든 오브젝트들을 반복(Iterate)하여 각 오브젝트를 도달 가능(Reachable) 이나 도달 불가(Unreachable) 로 표시

### Sweep Stage

- GC는 도달 불가 오브젝트가 차지하고 있는 모든 메모리를 회수

### STW(Stop-The-World) Event

- 모든 오브젝트에 대한 분석을 실행하려면 GC가 관리하는 메모리에서 모든 연산이 중단되어야 한다
- 이를 `STW(Stop-The-World) Event`라고 하며, 눈에 띄는 버벅거림을 발생 시킬 수 있다.



## GC의 장단점

- GC는 프로그래머의 메모리 관리 부담을 덜어주고 메모리 누수를 방지
- 대신, GC를 위해 CPU 시간을 별도로 할당 필요하다.
- GC는 보통 수동 메모리 관리 시스템보다 메모리를 더 많이 사용 한다.



## Unreal Engine garbage collected types

- 언리얼 엔진의 UObject는 모든 가비지 컬렉션 타입의 베이스 클래스
- 이 타입에서는 모든 이름이 접두사 U 또는 A로 시작 한다.
- UObject에서 상속하는 모든 것은 GC가 반드시 관리 해야 한다.



## 도달 가능성(Reachability) 분석

- 언리얼 엔진의 GC는 표준적인 Mark and Sweep 컬렉터이다



## Managing UObjects in Unreal Engine

- `UObject`는 전용 함수를 통해 할당 해야 한다.
  - `NewObject`나 `CreateDefaultSubobjet`  등을 활용
  - `new` 연산자는 `UObject` 를 생성하는 데 사용해서는 안된다
  - `NewObject`는 `Outer` 매개변수를 받으며, 이는 논리적인 부모가 되므로 신중하게 선택해야 한다.
  - `CreateDefaultSubobject`는 자동으로 현재 `UObject`를 `outer`로 사용한다.



## Referencing UObjects

- UObject에 대한 참조를 저장하려면 포인터 멤버를 UPROPERTY로 선언해야 한다.
- 이는 GC에 필수 리플렉션 데이터를 제공하여 어떤 멤버를 확인 할 지 GC에게 알려준다.
- 언리얼 엔진은 추가적인 에디터 지원을 위해 `TObjectPtr`라는 템플릿 포인터 클래스를 제공한다.
  - 이 클래스에는 런타임 오버헤드가 없으므로 클래스 멤버를 선언할 때 원시포인터보다는 이를 사용해야 한다
- TArray, TSet, TMap 등의 컨테이너도 인식하나 모든 컨테이너가 지원되지는 않는다.
- `TUniquePtr`, `TSharedPtr`, `TWeakPtr` 등의 C++ 표준 스타일 스마트 포인터 들은 UObject와 함께 사용할 수 없다.
  - 언리얼 헤더 툴은 코드를 파싱하여 지원되지 않는 타입이 사용되는 경우를 방지한다.
- 대신, `TSoftObjectPtr`, `TStrongObjectPtr`, `TWeakObjectPtr` 는 UObject나 함께 사용할 수 있다.
  - `TWeakObjectPtr`
    - `TWeakPtr`과 비슷하지만, `UObject`를 허용한다
    - `TWeakPtr` 처럼 GC를 막지 않는다.
    - 포인터를 역참조 하기 전에는 반드시 `TWeakObjectPtr`가 유효한지 항상 확인해야 한다.
  - `TSoftObjectPtr`
    - 기본적으로 `TWeakObjectPtr`이며 추가로 디스크에 있는 에셋의 경로가 포함된 포인터이다.
    - 에셋을 한 번에 모두 로드하는 대신 에셋까지의 경로만 로드하고 실제 에셋이 필요한 경우에 로드하기 위해 사용 할 수 있다. 이를 통해 실제로 필요한 에셋만 로드하여 메모리를 많이 절약 할 수 있다.
    - 이때, 로드 된 에셋에 대한 레퍼런스는 약한 참조이기 때문에 GC가 수행되지 않도록 하기 위해서는 추가적으로 에셋에 대한 강한 참조를 구성해 줘야 한다.
  - `TStrongObjectPtr`
    - `UPROPERTY` 매크로 없이 강한 참조를 구성 할 수 있는 포인터이다.



## Destroying UObjects

- GC를 활용하는 시스템에서 객체를 소멸시키는 과정은 매우 복잡하다.
- 일반적으로 GC만이 메모리를 비울 수 있기에 프로그래머가 할 수 있는 것은 참조를 없애 GC에게 힌트를 주는 것 뿐이다.
- 액터나 액터컴포넌트가 아닌 `UObject`의 경우, `ConditionalBeginDestory`를 명시적으로 호출하여 힌트를 줄 수 있다.
- 액터는 `Destory` 함수를 통해 소멸 시킬 수 있다.
  - 이 함수는 월드에게 액터를 잊어버리고 액터를 가비지로 표시하라고 지시한다.
- 비슷하게 액터 컴포넌트는 `DestoryComponent` 함수를 통해 소멸 시킬 수 있다.
  - 이 함수는 액터의 컴포넌트를 등록 취소하고, `PendingKill` 상태로 표시한다.
- `Destory`, `DestoryComponent` 두 함수 모두 오브젝트를 직접 제거하지는 않는다.
- 오브젝트가 위 함수들로 인해 가비지 상태 일 수 있기에 null 포인터와 직접 비교하는 대신 항상 `IsValid` 함수를 사용해 `UObject` 포인터를 확인해야 한다.



## 가비지 컬렉션 클러스터링

- 언리얼 엔진에서 지원하는 고급 GC 옵션
- 게임에서 대부분의 `UObject`는 서로 독립적으로 존재하는 경우는 흔치 않으며, 다수의 `UObject`가 비슷한 수명을 가지고 있기 때문에 동시에 소멸이 가능하다. 이러한 특성을 이용하는 기법을 `가비지 컬렉션 클러스터링`이라 한다.
- 서브오브젝트 여부, 동일 레벨 소속 액터 여부를 통해 클러스터를 구성하고 클러스터 루트 체크만을 통해 도달 가능성을 판별하여 도달 가능성 여부 검사 시간을 절약 시킬 수 있다.



## DisregardForGC

- 대부분의 게임에는 많은 오브젝트가 게임 내내 유지된다.
- 가령 일부 코어 게임플레이 블루프린트는 항상 로드된 상태일 수 있다.
- 실질적으로 영구적인 오브젝트임을 알고 있으므로 GC는 이러한 오브젝트를 무시해도 되는데
- 이러한 기법을 `DisregardForGC`라고 한다.



## GC 오버헤드를 줄이는 궁극적인 방법

- `UObject`의 수를 줄이는 것이 가장 효과적

- 블루프린트 매크로는 블루프린트 함수보다 더 많은 `UObject`를 생성하므로 가능하다면 블루프린트 함수를 사용

- 블루프린트 함수 또한 C++ 함수 대비 더 많은 `UObject`를 생성하므로 성능이 중요한 경우 C++ 함수를 사용

- 퍼포먼스가 중요한 코드에서는 `UObject` 보다는 단순 C++ 오브젝트를 사용하는 것이 좋다.

- `UPROPERTY` 매크로 대신, 레퍼런스 카운팅 기반 [스마트 포인터](https://dev.epicgames.com/documentation/ko-kr/unreal-engine/smart-pointers-in-unreal-engine) 활용

- [점진적 가비지 컬렉션](https://dev.epicgames.com/documentation/ko-kr/unreal-engine/incremental-garbage-collection-in-unreal-engine) 활용

  



## 참고자료

[Garbage collection in Unity and Unreal Engine](https://youtu.be/Pjad5TVfWrU?si=E7mOJ_pNfSQ4hqx2)

[언리얼 가비지 컬렉터(GC) 심화 정리](https://koreanfoodie.me/1041)

[How to register disregard for GC objects](https://dev.epicgames.com/community/learning/knowledge-base/dPae/unreal-engine-how-to-register-disregard-for-gc-objects)

[[UE5] Garbage Collection](https://scahp.tistory.com/114)

