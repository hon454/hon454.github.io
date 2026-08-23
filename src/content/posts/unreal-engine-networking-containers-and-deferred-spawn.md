---
published: 2023-01-16
author: Jihoon Jeon
title: 'Unreal Engine 네트워크 코드의 두 가지 함정: 컨테이너 복제와 Deferred Spawn'
description: TMap과 TSet을 직접 복제할 수 없는 이유와 안전한 배열·Fast Array 대안, 그리고 Actor가 BeginPlay에 들어가기 전에 초기값을 전달하는 Deferred Spawn의 정확한 생명주기를 정리합니다.
image: https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80
category: Unreal Engine
tags:
  - unreal-engine
  - networking
  - replication
  - deferred-spawn
  - actor-lifecycle
  - cpp
---

Unreal Engine 네트워크 코드를 작성하다 보면 서로 다른 두 문제에서 비슷한 함정에 빠진다. 첫째, 게임 상태를 표현하기 좋은 `TMap`과 `TSet`을 그대로 복제하려 한다. 둘째, 동적으로 생성한 Actor에 필요한 값을 `BeginPlay` 전에 넣으려다가 이미 초기화가 끝난 뒤 값을 전달한다.

두 문제의 기본 해법은 “`TArray`를 복제한 뒤 `TMap`/`TSet`을 재구성한다”와 “`SpawnActorDeferred`와 `FinishSpawning` 사이에서 값을 설정한다”이다. 다만 적용 범위와 생명주기를 정확히 모르면 다음과 같은 새 문제가 생긴다.

- `TMap`을 배열로 바꿨지만 중복 키와 순서 정책이 없다.
- 큰 배열을 매번 복제해 불필요한 대역폭을 쓴다.
- 클라이언트가 서버의 정본 상태를 직접 바꾸려 한다.
- Deferred Spawn으로 받은 Actor를 완성된 객체처럼 사용한다.
- `FinishSpawning`을 빠뜨리거나, 그 호출 안에서 `BeginPlay`까지 실행될 수 있다는 사실을 놓친다.

네트워크 복제 구현은 엔진 버전과 프로젝트 설정의 영향을 크게 받으므로, 적용할 프로젝트의 최소 재현 환경에서 컴파일하고 패킷 손실 조건까지 검증해야 한다.

## 1. `TMap`과 `TSet`은 무엇이 지원되지 않는가

정확한 결론은 다음과 같다.

> 일반 `UPROPERTY(Replicated)` 또는 `ReplicatedUsing`으로 선언한 `TMap`·`TSet`, 그리고 일반 RPC의 Map/Set 인자는 지원되지 않는다. 이것은 컨테이너의 데이터를 네트워크로 표현할 방법이 전혀 없다는 뜻은 아니다.

UnrealHeaderTool은 복제 프로퍼티와 RPC에서 Map/Set을 거부한다. 런타임의 `FMapProperty::NetSerializeItem`과 `FSetProperty::NetSerializeItem`도 이름만 보고 지원한다고 판단해서는 안 된다. 해당 구현은 지원하지 않는다는 오류를 기록한다. Blueprint Map/Set 변수도 예외가 아니다.

[Epic의 UE-137102 이슈](https://issues.unrealengine.com/issue/UE-137102)는 이를 우회하려면 컨테이너를 `USTRUCT`로 감싸고 사용자 정의 `NetSerialize`를 구현해야 한다고 설명한다. 그러나 이것은 고급 사용자 정의 프로토콜이며, 아래처럼 평범한 선언이 자동으로 동작한다는 뜻이 아니다.

```cpp
// 일반 property replication에서는 지원되지 않는다.
UPROPERTY(Replicated)
TMap<FName, int32> ScoreByPlayer;

UPROPERTY(Replicated)
TSet<FName> ReadyPlayers;
```

반대로 `TArray`와 Fast Array는 복제할 수 있다. 따라서 단순한 기본 해법은 **네트워크 표현과 런타임 조회 표현을 분리**하는 것이다.

## 작은 상태: `TArray<FEntry>`를 복제하고 `OnRep`에서 재구성하기

점수표처럼 항목 수가 작고 변경 빈도가 낮다면 키와 값을 가진 구조체 배열을 복제한다. 서버는 배열을 정본으로 관리하고, 서버와 각 클라이언트는 빠른 조회를 위한 `TMap` 캐시를 로컬에서 만든다.

```cpp
// ReplicatedScoreboard.h
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "ReplicatedScoreboard.generated.h"

USTRUCT(BlueprintType)
struct FReplicatedScoreEntry
{
    GENERATED_BODY()

    UPROPERTY()
    FName PlayerId = NAME_None;

    UPROPERTY()
    int32 Score = 0;
};

UCLASS()
class YOURGAME_API AReplicatedScoreboard : public AActor
{
    GENERATED_BODY()

public:
    AReplicatedScoreboard();

    void SetScore(FName PlayerId, int32 NewScore);

    virtual void GetLifetimeReplicatedProps(
        TArray<FLifetimeProperty>& OutLifetimeProps) const override;

protected:
    UPROPERTY(ReplicatedUsing = OnRep_ScoreEntries)
    TArray<FReplicatedScoreEntry> ScoreEntries;

    UFUNCTION()
    void OnRep_ScoreEntries();

private:
    // 네트워크로 보내지 않는 로컬 조회 캐시다.
    TMap<FName, int32> ScoreByPlayer;

    void RebuildScoreCache();
};
```

```cpp
// ReplicatedScoreboard.cpp
#include "ReplicatedScoreboard.h"
#include "Net/UnrealNetwork.h"

AReplicatedScoreboard::AReplicatedScoreboard()
{
    bReplicates = true;
}

void AReplicatedScoreboard::GetLifetimeReplicatedProps(
    TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    DOREPLIFETIME(AReplicatedScoreboard, ScoreEntries);
}

void AReplicatedScoreboard::SetScore(FName PlayerId, int32 NewScore)
{
    if (!HasAuthority() || PlayerId.IsNone())
    {
        return;
    }

    FReplicatedScoreEntry* Entry = ScoreEntries.FindByPredicate(
        [PlayerId](const FReplicatedScoreEntry& Candidate)
        {
            return Candidate.PlayerId == PlayerId;
        });

    if (Entry)
    {
        Entry->Score = NewScore;
    }
    else
    {
        ScoreEntries.Add({PlayerId, NewScore});
    }

    // RepNotify는 서버에서 자동 호출되지 않으므로 서버 캐시도 직접 갱신한다.
    RebuildScoreCache();
    ForceNetUpdate();
}

void AReplicatedScoreboard::OnRep_ScoreEntries()
{
    RebuildScoreCache();
}

void AReplicatedScoreboard::RebuildScoreCache()
{
    ScoreByPlayer.Reset(ScoreEntries.Num());

    for (const FReplicatedScoreEntry& Entry : ScoreEntries)
    {
        if (!Entry.PlayerId.IsNone())
        {
            // 이 예제의 중복 정책은 last-wins다.
            ScoreByPlayer.Add(Entry.PlayerId, Entry.Score);
        }
    }
}
```

이 예제에서 중요한 것은 문법보다 데이터 계약이다.

- `ScoreEntries`만 복제되는 정본이다. `ScoreByPlayer`는 파생 캐시다.
- 서버만 정본을 변경한다. 클라이언트의 요청이 필요하면 Server RPC로 보내고 서버에서 소유권, 범위, 빈도를 검증한다.
- 같은 키가 두 번 들어왔을 때 이 예제는 마지막 값을 사용한다. 데이터에 따라 첫 값을 유지하거나 전체 업데이트를 거부할 수도 있다.
- `TMap`과 `TSet`의 순회 순서는 안정적인 표시 순서가 아니다. 순서가 의미 있으면 명시적인 정렬 키를 복제한 뒤 정렬한다.
- 프로퍼티 복제는 **최종 상태 수렴**을 위한 것이다. 모든 중간 변경이나 이벤트 순서를 보장하지 않는다.

여러 항목이 동시에 바뀌어야만 유효한 불변식이 있다면 수신 중간 상태를 그대로 적용하지 말고 revision을 함께 보내거나 하나의 항목 구조체로 묶어 검증한 뒤 캐시를 교체한다. ordered event stream이 필요하다면 상태 복제만으로 대신하지 않는다.

## 변경이 잦거나 큰 상태: Fast Array

항목이 많고 추가·수정·삭제가 자주 일어나면 일반 배열 스냅샷보다 `FFastArraySerializer`를 고려한다. Fast Array는 바뀐 항목을 추적하는 복제 패턴을 제공한다.

다만 이름만 바꾸면 자동으로 효율적이 되는 기능은 아니다.

- 항목 타입은 `FFastArraySerializerItem`을 상속하고 컬렉션은 `FFastArraySerializer`를 상속한다.
- 항목을 추가하거나 수정한 뒤 `MarkItemDirty`를 호출한다.
- 삭제처럼 배열 구조 전체의 변경을 알릴 때는 올바른 API와 `MarkArrayDirty`를 사용한다.
- 서버와 클라이언트의 배열 인덱스나 순서가 같다고 가정하지 않는다. 게임 도메인의 안정적인 키를 별도 필드로 둔다.
- 수신 콜백에서는 추가, 변경, 삭제에 따른 로컬 캐시와 UI를 명시적으로 갱신한다.

선택 기준은 다음과 같다.

| 요구 사항                    | 우선 검토할 표현           | 이유                                                    |
| ---------------------------- | -------------------------- | ------------------------------------------------------- |
| 작고 드물게 바뀌는 전체 상태 | `TArray<FEntry>` + `OnRep` | 구현과 디버깅이 가장 단순하다                           |
| 크고 항목별 변경이 잦은 상태 | Fast Array                 | 항목 단위 변경 추적과 콜백을 제공한다                   |
| 일회성 순서 이벤트           | 검증된 RPC                 | 상태가 아니라 사건의 의미와 순서를 전달한다             |
| 특수 압축·비트 프로토콜      | 사용자 정의 serializer     | 성능 이득이 복잡성과 버전 비용을 정당화할 때만 사용한다 |

사용자 정의 `NetSerialize`도 가능하지만 기본 해법으로 삼기 어렵다. 항목 수 상한, 중복 키, 잘못된 enum과 object reference, 정수 overflow를 역직렬화 전에 검증해야 하며 사용하는 엔진 버전과의 호환성도 직접 확인해야 한다.

## 2. `BeginPlay` 전에 값을 전달하는 Deferred Spawn

일반 `SpawnActor`는 생성과 Construction Script, 컴포넌트 초기화까지 한 호출 흐름에서 진행한다. 이미 플레이 중인 월드라면 호출이 반환되기 전에 `BeginPlay`까지 실행될 수 있으므로, 반환된 포인터에 초기값을 넣는 것은 늦다.

Deferred Spawn은 **생성자를 미루는 API가 아니다.** `SpawnActorDeferred`가 반환할 때 네이티브 생성자와 기본 서브오브젝트 생성, `PostSpawnInitialize`, `PostActorCreated`까지 진행됐다. 대신 Blueprint Construction Script와 `OnConstruction`, 이후 컴포넌트 초기화와 `BeginPlay`로 가는 단계를 멈춘다. 따라서 반환값은 유효하지만 아직 완성되지 않은 Actor다.

```mermaid
sequenceDiagram
  participant Code as 서버 게임플레이 코드
  participant World as UWorld
  participant Actor as Deferred Actor

  Code->>World: SpawnActorDeferred<T>()
  World->>Actor: 네이티브 생성자와 기본 서브오브젝트
  World->>Actor: PostSpawnInitialize / PostActorCreated
  World-->>Code: 유효하지만 불완전한 Actor
  Code->>Actor: Construction 입력값 설정
  Code->>Actor: FinishSpawning(Transform)
  Actor->>Actor: Construction Script / OnConstruction
  Actor->>Actor: 컴포넌트 초기화
  Actor->>Actor: BeginPlay (월드가 이미 플레이 중이면)
```

### 일반 C++에서는 타입이 있는 World API 사용하기

`UGameplayStatics::BeginDeferredActorSpawnFromClass`와 `FinishSpawningActor` 쌍도 사용할 수 있지만, 일반 C++에서는 타입 안전하고 `Owner`와 `Instigator`를 명시할 수 있는 `UWorld::SpawnActorDeferred<T>`가 더 분명하다.

```cpp
AConfiguredProjectile* SpawnConfiguredProjectile(
    UWorld* World,
    TSubclassOf<AConfiguredProjectile> ProjectileClass,
    const FTransform& SpawnTransform,
    AActor* Owner,
    APawn* Instigator,
    const FProjectileSpawnConfig& InitialConfig)
{
    // 복제되는 authoritative Actor는 서버에서만 생성한다.
    if (!World || World->GetNetMode() == NM_Client || !*ProjectileClass ||
        SpawnTransform.ContainsNaN())
    {
        return nullptr;
    }

    AConfiguredProjectile* Projectile =
        World->SpawnActorDeferred<AConfiguredProjectile>(
            ProjectileClass,
            SpawnTransform,
            Owner,
            Instigator,
            ESpawnActorCollisionHandlingMethod::AdjustIfPossibleButDontSpawnIfColliding);

    if (!Projectile)
    {
        return nullptr;
    }

    // OnConstruction과 BeginPlay가 읽어야 하는 필수 값을 여기서 넣는다.
    Projectile->SetSpawnConfigBeforeFinish(InitialConfig);

    Projectile->FinishSpawning(SpawnTransform);

    // 선택한 충돌 정책에 따라 finish 중 파괴될 가능성까지 확인한다.
    return IsValid(Projectile) ? Projectile : nullptr;
}
```

`SpawnActorDeferred`의 인자와 overload는 엔진 버전에 따라 다를 수 있다. 위 예제처럼 프로젝트가 사용하는 버전의 선언을 확인하고, begin과 finish에 같은 `SpawnTransform`을 전달한다.

### Deferred 구간에서 해도 되는 일과 피해야 할 일

| Deferred 구간에서 적합                                          | 아직 피해야 함                                               |
| --------------------------------------------------------------- | ------------------------------------------------------------ |
| 단순 데이터 검증과 필수 설정값 대입                             | Blueprint Construction Script가 만든 컴포넌트 접근           |
| `Owner`, `Instigator`, 팀·스킨·크기 같은 construction 입력 설정 | `BeginPlay`나 초기화 완료를 전제로 한 게임플레이 호출        |
| `OnConstruction`이 읽을 replicated 초기 프로퍼티 설정           | 타이머·AI·충돌 이벤트 등 완성된 Actor 동작 시작              |
| 실패 시 즉시 안전하게 정리하고 반환                             | 포인터를 장기간 보관한 채 `FinishSpawning`을 나중으로 미루기 |

모든 성공 경로에서 `FinishSpawning`은 정확히 한 번 호출해야 한다. 이 호출은 단순히 플래그 하나를 바꾸는 것이 아니라 `ExecuteConstruction`, Blueprint Construction Script, `OnConstruction`, 컴포넌트 초기화를 이어서 실행한다. 월드가 이미 플레이 중이라면 같은 호출 스택에서 `BeginPlay`까지 도달할 수 있다. 따라서 **마지막 필수 설정은 반드시 그 호출보다 앞에 있어야 한다.**

반대로 월드가 아직 BeginPlay 전이라면 Actor의 `BeginPlay`도 월드 시작까지 기다린다. 클라이언트에 복제로 생성되는 proxy Actor는 또 다른 특수 경로를 사용하며, 초기 replicated state를 역직렬화한 뒤 `PostNetInit`을 거쳐 `BeginPlay`에 들어간다.

## `ExposeOnSpawn`과 replication은 별개의 기능이다

다음 metadata는 Blueprint의 Spawn Actor 노드에 입력 핀을 만든다.

```cpp
UPROPERTY(
    EditAnywhere,
    BlueprintReadWrite,
    ReplicatedUsing = OnRep_SpawnConfig,
    meta = (ExposeOnSpawn = "true"))
FProjectileSpawnConfig SpawnConfig;
```

Blueprint의 Spawn Actor 노드는 내부적으로 Begin Deferred Spawn, 노출된 프로퍼티 대입, Finish Spawning 순으로 확장되므로 Construction Script에서 핀 값을 읽을 수 있다. 그러나 `ExposeOnSpawn`은 editor metadata일 뿐이다.

- C++ `SpawnActorDeferred`가 값을 자동으로 채워 주지 않는다.
- 프로퍼티를 자동으로 복제하지 않는다. `Replicated` 또는 `ReplicatedUsing` 선언과 `DOREPLIFETIME`이 별도로 필요하다.
- 생성자는 spawn 시 전달된 값을 볼 수 없다. 생성자는 deferred 반환 전에 이미 실행됐다.

네트워크 Actor에서는 Construction Script의 부작용 자체가 복제된다고 가정해서도 안 된다. 서버에서 deferred 구간에 값을 넣으면 서버의 `OnConstruction`은 그 값을 보지만, 클라이언트 proxy의 Construction Script는 초기 replicated property가 적용되기 전에 실행될 수 있다. 런타임 게임 상태는 `ReplicatedUsing`과 `OnRep`에서 다시 적용하고, 초기값이 CDO와 같아 알림이 생략되는 경우까지 고려한다면 `BeginPlay`에서도 최종 상태를 확인한다. 서버에서는 RepNotify가 자동 호출되지 않으므로 명시적인 적용 함수나 `OnConstruction`을 함께 사용한다.

## 네트워크와 생명주기 체크리스트

### 컨테이너 상태

- 일반 replicated `TMap`/`TSet` 대신 배열 대리 표현이나 Fast Array를 선택했는가?
- 서버가 정본을 변경하고 클라이언트 입력은 검증된 Server RPC로 전달하는가?
- 중복 키, 최대 항목 수, 잘못된 값, 정렬 정책을 명시했는가?
- 인덱스나 컨테이너 순회 순서를 네트워크 ID로 오해하지 않았는가?
- 모든 중간 변경이 도착한다는 전제 없이 최종 상태를 적용하는가?

### Deferred Spawn

- 복제 Actor를 서버에서 생성하고 생성자/CDO에서 `bReplicates = true`로 설정했는가?
- begin 반환값의 null 여부와 finish 뒤 `IsValid`를 모두 확인하는가?
- Construction Script가 만든 컴포넌트를 finish 전에 사용하지 않는가?
- 모든 필수 값을 `FinishSpawning` 전에 넣었는가?
- 모든 성공 경로에서 같은 흐름 안에 `FinishSpawning`을 정확히 한 번 호출하는가?
- `FinishSpawning` 안에서 Construction과 `BeginPlay`가 동기 실행될 수 있다고 가정했는가?
- 클라이언트의 초기 상태 적용을 Construction Script 부작용이 아니라 replication/RepNotify로 설계했는가?

두 문제의 공통 해법은 **표현과 생명주기의 경계를 명시하는 것**이다. `TMap`은 게임 코드의 조회 표현으로 남기고 네트워크에는 검증 가능한 배열 표현을 사용한다. Actor는 deferred 구간에서 필수 데이터만 받은 뒤 즉시 완성하고, 완성 이후의 게임플레이 상태는 복제로 동기화한다.

## 참고 자료

- [Epic Games: UE-137102 — TMap properties cannot be replicated](https://issues.unrealengine.com/issue/UE-137102)
- [Epic Games: Actor Lifecycle](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-actor-lifecycle)
- [Epic Games: `UWorld::SpawnActorDeferred`](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UWorld/SpawnActorDeferred)
- [Epic Games: Actor Property Metadata Specifiers](https://dev.epicgames.com/documentation/en-us/unreal-engine/metadata-specifiers-in-unreal-engine)
- [Unreal Engine 4 Network Compendium](https://cedric-neukirchen.net/Downloads/Compendium/UE4_Network_Compendium_by_Cedric_eXi_Neukirchen.pdf)
- [프로그래머를 괴롭히는 Unreal Engine 4의 함정들](https://youtu.be/o8TgvFPhUgE?si=BbKFPqcgEoVGXosG)
- [언리얼 네트워킹 아키텍처](https://sites.google.com/site/techaht/trans/unreal-net-arch?pli=1)

_Epic Games의 Unreal Engine GitHub 소스 링크는 Epic 계정과 연결된 GitHub 로그인이 필요할 수 있다._
