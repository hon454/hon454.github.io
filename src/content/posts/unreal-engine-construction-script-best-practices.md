---
published: 2023-01-19
author: Jihoon Jeon
title: Unreal Engine Construction Script를 안전하게 사용하는 법
description: Construction Script와 C++ OnConstruction의 정확한 호출 시점, 에디터 재실행 비용과 순환 변경 위험, 멱등하고 빠른 제작 도구로 설계하는 방법을 정리합니다.
image: https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80
category: Unreal Engine
tags:
  - unreal-engine
  - blueprint
  - construction-script
  - actor-lifecycle
  - editor-tools
  - performance
---

Blueprint Construction Script는 레벨에 배치한 Actor의 파라미터를 바꾸는 즉시 결과를 보여 주는 강력한 제작 도구다. 바닥을 추적해 메시를 고르거나, 구간 수에 맞춰 울타리를 배치하거나, spline에서 미리보기 컴포넌트를 만드는 작업에 잘 맞는다.

문제는 이것을 생성 시 한 번만 실행되는 초기화 함수로 오해할 때 생긴다. Construction Script는 에디터에서 Actor를 옮기거나 프로퍼티를 바꿀 때 반복 실행될 수 있고, 재실행 과정에서 자동 생성 컴포넌트를 파괴하고 다시 만든다. 다른 Actor까지 변경하는 스크립트가 서로를 다시 구성하면 편집기가 멈추거나 결과가 실행 순서에 따라 달라질 수도 있다.

Construction Script를 안전하게 쓰려면 잦은 호출의 성능 비용과 순환 호출을 함께 피해야 한다. 핵심은 이를 **빠르고 결정적이며 멱등인 파생 상태 생성기**로 설계하는 것이다.

## Construction Script와 `OnConstruction`의 관계

Blueprint Class에는 `UserConstructionScript`, 즉 편집기의 **Construction Script** 그래프가 있다. C++ Actor는 비슷한 목적의 virtual hook인 `OnConstruction`을 override할 수 있다.

```cpp
// MyProceduralActor.h
virtual void OnConstruction(const FTransform& Transform) override;
```

```cpp
// MyProceduralActor.cpp
void AMyProceduralActor::OnConstruction(const FTransform& Transform)
{
    Super::OnConstruction(Transform);
    // 편집 가능한 입력으로부터 파생된 컴포넌트 상태를 재구성한다.
}
```

둘을 완전히 같은 단계라고 부르면 세부 순서를 놓친다. `ExecuteConstruction`의 흐름은 대략 다음과 같다.

1. native component와 Blueprint의 Simple Construction Script 컴포넌트를 준비한다.
2. Blueprint `UserConstructionScript`를 실행한다.
3. Blueprint로 만든 컴포넌트까지 생성·등록한 뒤 virtual `OnConstruction`을 호출한다.

따라서 C++ `OnConstruction`은 Blueprint Construction Script가 끝난 뒤 실행되는 마지막 알림에 가깝다. C++로 override할 때도 `Super::OnConstruction`을 호출하고, Blueprint 파생 클래스가 추가한 컴포넌트나 값을 어느 단계에서 읽는지 실제 클래스 계층으로 검증해야 한다.

## 생성자, Construction, `BeginPlay`의 역할 분리

“Construction Script를 쓰면 생성자나 `BeginPlay`를 쓰면 안 된다”는 식의 규칙은 정확하지 않다. 세 단계는 함께 사용하되 책임을 분리해야 한다.

| 단계                                     | 적합한 책임                                                        | 피해야 할 전제                                          |
| ---------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------- |
| C++ constructor                          | 기본값, `CreateDefaultSubobject`, CDO에 안전한 설정                | 유효한 World, instance editable 값, 다른 Actor의 존재   |
| `PostLoad`                               | 디스크에서 읽은 직렬화 데이터의 버전 변환과 fixup                  | 새로 spawn된 Actor에도 호출된다는 가정                  |
| `PostActorCreated`                       | 새로 생성·spawn된 Actor의 construction 직전 처리                   | 레벨에서 load된 Actor에도 호출된다는 가정               |
| Construction Script / `OnConstruction`   | 편집 가능한 입력에서 빠르게 다시 만들 수 있는 파생 상태와 미리보기 | 한 번만 실행됨, 외부 상태가 안정적임, gameplay가 시작됨 |
| `PostInitializeComponents` / `BeginPlay` | 컴포넌트 초기화 뒤 실제 gameplay 시작과 runtime 의존성 연결        | 에디터 미리보기에서도 호출됨                            |

`PostLoad`와 `PostActorCreated`는 서로 배타적인 생성 경로다. 저장된 레벨의 Actor는 load 경로를 사용하고, `SpawnActor`로 만든 Actor는 creation 경로를 사용한다. 이 구분은 Construction Script의 런타임 동작을 이해하는 데 중요하다.

## 언제 다시 실행되는가

[Blueprint Foundations](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-foundations)는 Blueprint Actor가 생성될 때 컴포넌트를 만든 다음 Construction Script를 실행하고, 에디터에서 transform이나 프로퍼티를 바꿀 때도 즉시 결과를 갱신한다고 설명한다. 엔진에는 그 밖에도 Blueprint compile/reinstance, undo/redo, component 편집, duplicate와 paste, 일부 level·sequencer 작업처럼 construction을 재실행하는 경로가 있다.

| 상황                                    | 일반적인 동작                                 | 설계 시 의미                                                       |
| --------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------ |
| 에디터에 Actor 배치                     | instance 생성과 함께 실행                     | 저장 전부터 결과가 레벨 데이터에 반영될 수 있다                    |
| Details 프로퍼티 변경                   | `PostEditChangeProperty` 경로에서 재실행 가능 | 한 글자를 바꾸는 동안에도 무거운 작업을 반복하지 않는다            |
| 이동·회전·크기 조정                     | `PostEditMove` 경로에서 재실행 가능           | drag 중 실행 설정이 켜져 있으면 여러 번 호출된다                   |
| Blueprint compile, undo/redo, duplicate | 재구성될 수 있음                              | 호출 횟수와 순서를 계약으로 삼지 않는다                            |
| gameplay 중 동적 `SpawnActor`           | `ExecuteConstruction`을 거쳐 실행             | 월드가 시작됐다면 이어서 `BeginPlay`까지 갈 수 있다                |
| 일반적인 cooked level의 배치 Actor load | 저장·cook된 결과를 읽고 `PostLoad` 경로 사용  | 게임 시작 때 Construction Script가 다시 실행된다고 의존하지 않는다 |
| PIE의 기존 배치 Actor                   | editor world의 Actor를 복제해 초기화          | 새 spawn과 같은 construction 경로라고 가정하지 않는다              |

Blueprint의 **Run Construction Script on Drag**가 켜져 있으면 Actor를 끌어 움직이는 동안 계속 재실행될 수 있다. 끄더라도 drag가 끝날 때 한 번은 실행된다. 위치를 따라 즉시 바뀌는 미리보기가 꼭 필요하지 않다면 이 설정을 끄는 것만으로도 편집기 hitch를 크게 줄일 수 있다.

배치 Actor가 패키지 실행 시 다시 구성되지 않는다는 사실은 특히 중요하다. 에디터나 cook 과정에서 만든 결과가 레벨에 직렬화되는 일반 경로에서는, 런타임에만 존재하는 subsystem 등록, 네트워크 권한 검사, 타이머 시작 같은 동작을 Construction Script에 넣으면 실행 여부가 생성 경로에 따라 달라진다. 그런 동작은 `BeginPlay`나 적합한 gameplay 초기화 단계로 옮긴다.

동적 spawn에서 Construction 전에 값을 넣어야 한다면 일반 `SpawnActor` 반환 뒤에 값을 대입하지 말고 [`SpawnActorDeferred`와 `FinishSpawning` 사이에서 설정](/posts/unreal-engine-networking-containers-and-deferred-spawn/)한다.

## 재실행 가능한 코드의 첫 번째 조건: 멱등성

멱등인 construction은 같은 입력으로 여러 번 실행해도 같은 결과를 만든다. “이전 결과에 하나 더 추가”하는 방식이 아니라, 자신이 관리하는 파생 상태를 초기화한 뒤 현재 입력으로 다시 구성한다.

다음은 한 native `UHierarchicalInstancedStaticMeshComponent`에 울타리 미리보기를 다시 채우는 예다. 입력 수에는 상한을 두고, 재실행 때 이전 instance를 먼저 지운다.

```cpp
// ProceduralFence.h
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "ProceduralFence.generated.h"

class UHierarchicalInstancedStaticMeshComponent;
class UStaticMesh;

UCLASS()
class YOURGAME_API AProceduralFence : public AActor
{
    GENERATED_BODY()

public:
    AProceduralFence();
    virtual void OnConstruction(const FTransform& Transform) override;

private:
    UPROPERTY(VisibleAnywhere, Category = "Fence")
    UHierarchicalInstancedStaticMeshComponent* PreviewInstances = nullptr;

    UPROPERTY(EditAnywhere, Category = "Fence")
    UStaticMesh* SegmentMesh = nullptr;

    UPROPERTY(EditAnywhere, Category = "Fence", meta = (ClampMin = "0", ClampMax = "1000"))
    int32 SegmentCount = 4;

    UPROPERTY(EditAnywhere, Category = "Fence", meta = (ClampMin = "1.0"))
    float SegmentSpacing = 100.0f;
};
```

```cpp
// ProceduralFence.cpp
#include "ProceduralFence.h"
#include "Components/HierarchicalInstancedStaticMeshComponent.h"

AProceduralFence::AProceduralFence()
{
    PreviewInstances =
        CreateDefaultSubobject<UHierarchicalInstancedStaticMeshComponent>(
            TEXT("PreviewInstances"));
    SetRootComponent(PreviewInstances);
}

void AProceduralFence::OnConstruction(const FTransform& Transform)
{
    Super::OnConstruction(Transform);

    PreviewInstances->ClearInstances();
    PreviewInstances->SetStaticMesh(SegmentMesh);

    if (!SegmentMesh)
    {
        return;
    }

    const int32 SafeCount = FMath::Clamp(SegmentCount, 0, 1000);
    const float SafeSpacing = FMath::Max(SegmentSpacing, 1.0f);

    for (int32 Index = 0; Index < SafeCount; ++Index)
    {
        const FVector LocalLocation(Index * SafeSpacing, 0.0f, 0.0f);
        PreviewInstances->AddInstance(FTransform(LocalLocation));
    }
}
```

이 패턴에는 의도적인 경계가 있다.

- 생성자에서는 native default subobject만 만든다.
- `OnConstruction`은 instance editable 입력만 읽고 자기 컴포넌트만 갱신한다.
- 실행 횟수에 관계없이 같은 입력은 같은 instance 집합을 만든다.
- 수천 개의 별도 component나 Actor 대신 instancing을 사용한다.
- 잘못된 수치가 에디터를 멈추지 않도록 상한을 둔다.

실제 도구에서는 메시의 bounds와 spline 길이 등을 사용할 수 있지만 원칙은 같다. 파일 I/O, 전체 World 검색, asset 저장, blocking load, 복잡한 pathfinding처럼 비용과 부작용이 큰 작업은 자동 construction 경로에서 분리한다.

## 재실행은 컴포넌트의 수명도 바꾼다

`RerunConstructionScripts`는 construction에서 자동 생성한 컴포넌트를 파괴하고 다시 만든 뒤, 보존 가능한 instance data를 복원하려 한다. 따라서 Construction Script에서 추가한 component의 raw pointer나 외부 Actor가 보관한 참조가 다음 재실행 뒤에도 같은 객체를 가리킨다고 가정하면 안 된다.

안전한 선택은 다음과 같다.

- 고정된 핵심 컴포넌트는 가능하면 C++ constructor 또는 Blueprint Components 패널에서 만든다.
- 가변적인 다수 요소는 ISM/HISM, spline mesh처럼 한 owner가 명확히 관리하는 표현을 사용한다.
- 다시 찾아도 되는 컴포넌트는 안정적인 이름, tag, 명시적 `UPROPERTY`와 소유 관계로 식별한다.
- async 결과가 돌아올 때는 대상의 weak reference와 construction revision을 확인한다. 가능하면 async 작업 자체를 explicit editor command로 옮긴다.

Construction Script 안에서 다른 Actor를 spawn해 영구 배치하거나 asset을 저장하는 동작은 재실행과 transaction 경계 때문에 특히 위험하다. Actor가 관리하는 자식이 필요하면 Child Actor Component 등 수명이 owner의 reconstruction과 결합된 기능을 우선 검토하고, 대규모 생성·베이크는 별도 도구로 만든다.

## 다른 Actor를 변경하면 순환 재구성이 생긴다

대표적인 사례는 A Actor의 Construction Script가 B의 editable property를 바꾸고, B의 Construction Script가 다시 A를 바꾸는 구조다.

```text
A Construction → B property 변경 → B reconstruction
       ↑                              ↓
       └──────── A property 변경 ─────┘
```

엔진에 같은 Actor의 construction 재진입을 막는 처리와 Child Actor 재구성을 다루는 경로가 있어도, 서로 다른 Actor 사이의 모든 ping-pong과 간접 부작용까지 안전하게 해결해 주는 것은 아니다. 반복 재실행, 비결정적인 최종값, 심한 hitch, ensure나 stack overflow, crash로 이어질 수 있다.

다른 Actor와 협력해야 한다면 양방향 mutation을 없앤다.

1. 두 Actor가 읽기만 하는 하나의 Data Asset이나 설정 객체를 둔다.
2. 한쪽만 owner가 되어 자식의 입력을 단방향으로 계산한다.
3. 여러 Actor를 함께 변경하는 작업은 explicit `CallInEditor` 함수나 Editor Utility로 옮긴다.
4. 변경 전에 값이 실제로 달라졌는지 비교하더라도, 그것만으로 잘못된 순환 설계가 안전해진다고 보지 않는다.

특히 construction에서 무작위 값을 만들 때는 비시드 random을 피한다. 디자이너가 편집할 수 있는 seed와 `Random Stream`을 사용해 같은 입력이 같은 결과를 만들게 하거나, 확정된 결과를 명시적으로 bake한다.

## 무거운 작업은 명시적 에디터 명령으로 바꾸기

프로퍼티를 바꿀 때마다 자동으로 실행할 필요가 없는 작업이라면 Details 패널 버튼으로 실행 시점을 사용자에게 돌려줄 수 있다.

```cpp
UFUNCTION(CallInEditor, Category = "Fence")
void RebuildBakedFence();
```

[UFunction 문서](https://dev.epicgames.com/documentation/en-us/unreal-engine/ufunctions-in-unreal-engine)는 `CallInEditor` 함수를 선택한 instance의 Details 패널에서 호출할 수 있다고 설명한다. 여러 asset이나 Actor를 일괄 처리하거나 별도 UI와 진행률, 취소가 필요하다면 [Editor Utility Blueprint와 Scripted Action](https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-blueprints)이 더 적합하다.

에디터 전용 API를 C++에서 사용할 때는 모듈 경계와 전처리 조건도 구분한다.

- `#if WITH_EDITOR`: `PostEditChangeProperty`, `PostEditMove`와 editor-only 실행 코드를 감싼다.
- `#if WITH_EDITORONLY_DATA`: cooked build에서 제거할 수 있는 editor-only 데이터 멤버에 사용한다.
- runtime에서 spawn되는 Actor에도 필요한 `OnConstruction` 전체를 `WITH_EDITOR`로 감싸지 않는다.
- asset 편집과 저장을 하는 코드는 가능하면 runtime 모듈이 아닌 Editor 모듈에 둔다.

## 멀티플레이에서 Construction Script를 상태 복제로 쓰지 않기

Construction Script는 네트워크 동기화 메커니즘이 아니다. 서버에서 실행한 Construction Script의 부작용이 클라이언트에 그대로 재생되거나 복제된다고 보장되지 않는다. 클라이언트에 복제로 생성된 Actor는 초기 replicated property를 받기 전에 construction 단계를 지날 수 있다.

따라서 다음처럼 책임을 나눈다.

- 서버가 authoritative gameplay 값을 정한다.
- 동기화할 값은 `Replicated` 또는 `ReplicatedUsing`으로 선언한다.
- 클라이언트의 표시 상태는 `OnRep`에서 적용하고 필요하면 `BeginPlay`에서 최종 상태를 확인한다.
- Construction Script는 그 값의 editor preview나 서버/로컬 spawn 시 파생 구성에만 사용한다.

Construction Script가 빠르고 결정적이어야 하는 이유는 성능만이 아니다. editor, standalone, listen server, dedicated server, client proxy처럼 실행 환경이 달라도 gameplay 정본은 replication 계약으로 수렴해야 한다.

## 실전 점검표

### 이 작업이 Construction Script에 맞는가

- instance editable 입력에 따라 Actor 자신의 시각적·구조적 파생 상태를 보여 주는가?
- editor에서 즉시 미리보는 가치가 있는가?
- 동일한 입력으로 여러 번 실행해도 결과가 같은가?
- 짧은 시간에 수십 번 호출돼도 편집기를 멈추지 않는가?
- 자동 생성 요소의 소유자와 정리 책임이 이 Actor 하나로 명확한가?

### 다음 중 하나라면 다른 단계가 낫다

- gameplay subsystem 등록, timer, AI, 입력, 네트워크 권한이 필요함 → `BeginPlay` 또는 gameplay 초기화
- 저장 데이터의 버전 변환이 필요함 → `PostLoad`
- 값비싼 asset 생성·저장이나 대규모 일괄 변경 → `CallInEditor` 또는 Editor Utility
- 여러 Actor의 상태를 양방향으로 바꿈 → 단방향 owner나 별도 coordinator
- 호출마다 누적되는 spawn, append, random, 외부 I/O → 명시적인 reset/rebuild 또는 별도 명령

Construction Script의 장점은 “아무 초기화나 넣을 수 있다”는 데 있지 않다. **편집 가능한 입력을 즉시 확인 가능한 파생 결과로 바꾸고, 필요할 때 얼마든지 버리고 다시 만들 수 있다는 것**이 핵심이다. 이 계약을 지키면 Construction Script는 에디터를 불안정하게 만드는 숨은 이벤트가 아니라, 디자이너가 신뢰할 수 있는 작은 절차적 제작 도구가 된다.

## 참고 자료

- [Epic Games: Construction Script](https://dev.epicgames.com/documentation/en-us/unreal-engine/construction-script-in-unreal-engine)
- [Epic Games: Blueprint Foundations](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-foundations)
- [Epic Games: Actor Lifecycle](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-actor-lifecycle)
- [Epic Games: `AActor` initialization order](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/AActor)
- [Epic Games: UFunctions and `CallInEditor`](https://dev.epicgames.com/documentation/en-us/unreal-engine/ufunctions-in-unreal-engine)
- [Epic Games: Scripting the Editor using Blueprints](https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-blueprints)
- [UE4 – Be careful with the Construction Script](https://isaratech.com/ue4-be-careful-with-the-construction-script/)
