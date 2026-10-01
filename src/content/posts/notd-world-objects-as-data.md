---
title: "오픈월드의 오브젝트를 액터 대신 데이터로 두기"
published: 2026-10-01
description: "Night of the Dead의 Dedicated Server에서 자연물, 스포너의 좀비, 보관함 내용물을 필요한 순간에만 액터나 복제 데이터로 만들고 평소에는 인스턴스와 구조체로 유지한 방법을 정리한다."
image: ./images/notd-multiplayer-optimization/notd-world-objects-as-data-cover.webp
tags:
  - unreal-engine
  - networking
  - dedicated-server
  - performance
category: Unreal Engine
series: Night of the Dead 멀티플레이 최적화
seriesOrder: 4
draft: false
lang: ko
---

[Night of the Dead](/projects/night-of-the-dead/)의 맵에는 캘 수 있는 나무와 바위, 곳곳의 좀비 스포너, 플레이어가 지은 보관함과 농장이 있다. 이것들을 모두 복제되는 액터로 두면 서버의 액터 수는 플레이어 수와 무관하게 맵 크기에 비례해 늘어난다. 액터마다 틱, 복제 대상 검사, 채널 비용이 붙는다.

실제로 플레이어가 상호작용하는 것은 그중 일부다. 그래서 세 종류 모두 같은 방향으로 처리했다. 평소에는 가장 싼 표현으로 두고, 플레이어가 가까이 오거나 건드릴 때만 액터나 복제 데이터로 올린다.

| 대상 | 평소 | 필요할 때 |
| --- | --- | --- |
| 자연물 | 인스턴스드 폴리지의 인스턴스 | 타격받은 것만 액터 |
| 파괴된 자연물 | 매니저 맵의 구조체 | 리스폰 시 다시 액터 |
| 스포너의 좀비 | 정수 카운터, 구조체 | 플레이어 근처에서만 풀링 액터 |
| 보관함 내용물 | 서버에만 있는 배열 | 플레이어 근처에서만 복제용 배열 |

![필요한 오브젝트만 액터나 복제 데이터로 펼친다는 개념을 카드와 모형으로 표현했다. 실제 자연물은 평소 폴리지 인스턴스로 유지되며, 카드는 구현 자료형을 뜻하지 않는다.](./images/notd-multiplayer-optimization/world-data-illustration.webp)

이 글의 코드는 구조를 설명하기 위해 새로 작성한 예시이며 프로젝트의 실제 코드와는 이름과 세부가 다르다.

## 자연물: 인스턴스, 액터, 구조체

![](./images/notd-multiplayer-optimization/forest-airdrop.avif)

### 타격받은 것만 액터로

나무와 바위는 인스턴스드 폴리지로 배치했다. 인스턴스는 액터가 아니므로 서버에 복제 비용이 없고, 클라이언트는 레벨을 로드하면서 같은 인스턴스를 이미 가지고 있다.

서버에서 인스턴스가 타격을 받으면 그 인스턴스를 제거하고 같은 트랜스폼에 파괴 가능한 액터를 스폰한다. 어떤 스태틱 메시가 어떤 액터 클래스로 바뀌는지는 데이터 테이블에서 읽어 초기화 때 맵으로 만들어 둔다.

교체된 액터는 복제되지만 틱이 없고 `DORM_DormantAll`로 시작한다. 클라이언트는 서버의 액터가 도착하기 전까지 같은 자리에 로컬 더미 액터를 세워 타격 직후의 빈틈을 메운다.

### 파괴된 것은 구조체 하나로

완전히 파괴된 액터는 리스폰 매니저에 자신을 등록하고 사라진다. 매니저에 남는 것은 구조체 하나다.

```cpp
USTRUCT()
struct FRespawnRecord
{
	GENERATED_BODY()

	UPROPERTY()
	FGuid RespawnId;

	UPROPERTY()
	TSoftClassPtr<AActor> ActorClass;

	UPROPERTY()
	FGameplayTag RespawnTag;

	UPROPERTY()
	FTransform Transform;

	UPROPERTY()
	double RequestedGameTime = 0.0;
};
```

리스폰 조건은 경과 시간과 조건 에셋이다. 조건 에셋은 난이도 옵션과, 리스폰 위치에 플레이어 건물이 겹치는지를 박스 트레이스로 확인한다. 트레이스가 들어가므로 등록된 레코드 전체를 매 프레임 검사할 수 없다. 매니저는 서버에서만 틱하고, 한 프레임에 정해진 수만 돌아가며 검사한다.

```cpp
void ARespawnManager::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);

	const int32 NumRecords = RecordIds.Num();
	const int32 NumToProcess = FMath::Min(MaxProcessPerTick, NumRecords);

	for (int32 Step = 0; Step < NumToProcess; ++Step)
	{
		Cursor = (Cursor + 1) % NumRecords;

		const FRespawnRecord& Record = Records[RecordIds[Cursor]];
		if (IsTimeElapsed(Record) && CanRespawn(Record))
		{
			PendingRespawns.Add(Record.RespawnId);
		}
	}

	FlushPendingRespawns();
}
```

이 방식은 레코드 수가 많아질수록 각 항목의 검사 주기가 길어진다. 즉시 반응해야 하는 전투 판정과 달리, 자연물의 리스폰은 검사 지연을 허용할 수 있어 작업을 나눴다. 매니저의 맵은 세이브에도 들어간다.

### 클라이언트의 인스턴스 정리

서버가 인스턴스를 제거해도 클라이언트의 인스턴스는 그대로 남아 있다. 인스턴스드 폴리지는 복제되지 않기 때문이다. 따로 알려 주지 않으면 나중에 접속했거나 그 레벨을 아직 로드하지 않았던 클라이언트는 이미 파괴된 나무를 그대로 보게 된다.

그래서 서버의 리스폰 레코드 집합을 클라이언트에 미러링했다. 클라이언트는 `(리스폰 ID, 폴리지 종류 ID, 트랜스폼)` 목록을 받아 해당 위치의 로컬 인스턴스를 제거한다. 전송은 [스트리밍 라우터](/posts/notd-reliable-rpc-data-streaming/)를 통한다. 접속 시에는 누적된 전체가, 플레이 중에는 변경분이 간다.

이 경로에는 세 가지 처리가 더 붙었다.

서버는 등록과 해제를 바로 보내지 않고 추가 버퍼와 삭제 버퍼에 모았다가 1초마다 내보낸다. 버퍼에 있는 동안 같은 레코드의 추가와 삭제가 만나면 서로 지운다.

```cpp
void UFoliageMirrorComponent::OnRecordRegistered(const FRespawnRecord& Record)
{
	if (PendingRemovals.Remove(Record.RespawnId) == 0)
	{
		PendingAdditions.Add(Record.RespawnId, MakeMirrorEntry(Record));
	}
}

void UFoliageMirrorComponent::OnRecordUnregistered(const FGuid& RespawnId)
{
	if (PendingAdditions.Remove(RespawnId) == 0)
	{
		PendingRemovals.Add(RespawnId);
	}
}
```

클라이언트는 받은 목록을 한 번에 처리하지 않는다. 인스턴스 제거는 위치로 인스턴스를 찾는 작업이라 접속 직후의 전체 목록을 한 프레임에 처리하면 끊긴다. 작업 큐에 넣고 프레임당 정해진 수만 처리한다.

폴리지가 들어 있는 레벨은 스트리밍으로 나중에 로드될 수 있다. 목록을 받은 시점에 해당 레벨이 없으면 지울 인스턴스도 없다. 클라이언트는 목록을 버리지 않고 맵으로 유지하다가, 폴리지 레벨이 추가될 때마다 그 레벨의 범위에 들어가는 항목을 다시 작업 큐에 넣는다.

이 폴리지 경로에서는 추가·삭제 전송의 완료 통지를 받으면 클라이언트가 가진 항목 수를 서버에 보고한다. 서버에 아직 보낼 변경분이 없는데도 수가 다르면 전체를 다시 받는다. 이 재전송 경로를 시험하기 위해 클라이언트가 일부러 0을 보고하게 하는 개발용 설정을 두었다. 개수 비교이므로 내용까지 같은지는 확인하지 않는다. 수신 컴포넌트가 등록되기 전에 완료 통지까지 버려진 경우에는 이 검사도 실행되지 않는다.

![클라이언트는 서버의 제거 이력을 미러 목록으로 유지하고 인스턴스 제거를 프레임별로 나눠 처리한다. 폴리지 레벨이 추가되면 그 레벨에 해당하는 항목을 다시 작업 큐에 넣는다.](./images/notd-multiplayer-optimization/foliage-mirror-queue.webp)

## 스포너의 좀비: 숫자, 구조체, 액터

맵 곳곳의 스포너는 서버에만 있다. 클라이언트에서는 `BeginPlay()`에서 스스로 파괴한다. 스포너가 관리하는 좀비는 플레이어와의 거리를 기준으로 생성 단계를 나눈다.

| 단계 | 형태 | 조건 |
| --- | --- | --- |
| 1 | 스폰해야 할 수(정수) | 스포너 활성 거리 안 |
| 2 | 클래스와 트랜스폼을 가진 구조체 | 데이터 생성 거리 안 |
| 3 | 오브젝트 풀에서 꺼낸 액터 | 액터화 거리 안 |

1단계에서는 위치조차 정하지 않는다. 2단계에서 스폰 위치를 탐색해 구조체로 확정하고, 3단계에서 풀의 액터를 사용한다. 액터화 거리가 가장 짧으므로 맵 전체의 좀비를 항상 활성 액터로 유지할 필요가 없다.

반대 방향도 있다. 다만 멀어졌다는 이유만으로 곧바로 반환하지는 않는다. 좀비의 `CanDespawn()`은 추격 중이면 반환을 막고, 기본 AI 판정은 플레이어와의 거리, 시야, 원래 위치로 복귀했는지를 확인한다. 스포너 활성 범위를 벗어난 액터를 강제로 반환하는 경로도 별도로 있다.

다음 예시는 살아 있고 일시적인 대상이 아니며 스포너 활성 범위 안에 있는 액터를 구조체로 되돌리는 경로다. 원본에서는 범위를 벗어났거나 일시적인 대상이면 위치를 남기는 대신 스폰할 수만 증가시키고, 죽은 대상은 수를 복원하지 않는다.

```cpp
void AZombieSpawner::DemoteEligibleCharacters()
{
	for (int32 Index = SpawnedCharacters.Num() - 1; Index >= 0; --Index)
	{
		ACharacter* Character = SpawnedCharacters[Index];
		ISpawnableAI* Spawnable = Cast<ISpawnableAI>(Character);
		if (Spawnable == nullptr || Spawnable->CanDespawn() == false)
		{
			continue;
		}

		if (Spawnable->IsAlive() == false || Spawnable->IsTransient()
			|| IsOutsideSpawnerActivationRange(Character))
		{
			continue;
		}

		SpawnedData.Add(FSpawnedZombieData(Character->GetClass(), Character->GetActorTransform()));
		Spawnable->OnDespawned();
		SpawnedCharacters.RemoveAtSwap(Index);
		Pool->ReturnActor(Character);
	}
}
```

이 구조체가 보존하는 것은 클래스와 트랜스폼이다. 다시 액터화할 위치는 남지만 체력이나 진행 중인 전투 상태까지 저장한 스냅샷은 아니다. 풀 반환 역시 액터의 메모리가 해제됐다는 뜻은 아니다. 반환된 객체를 풀에 유지한다면 메모리는 남으므로, 활성 액터의 AI 처리와 복제 비용을 줄이는 것과 전체 메모리 사용량을 줄이는 것은 구분해야 한다.

![스포너는 생성 단계를 숫자, 클래스와 트랜스폼, 풀링 액터로 나눈다. 반환 시에는 생존 여부와 일시적 대상 여부, 활성 범위에 따라 남기는 데이터가 달라진다.](./images/notd-multiplayer-optimization/spawner-state-transitions.webp)

비용을 한 프레임에 몰지 않기 위한 처리도 함께 있다. 아래 처리 수와 주기는 코드의 기본값이다.

- 거리 검사는 틱이 아니라 1초 타이머로 돌린다. 첫 실행을 0~2초 사이의 난수만큼 늦춰 스포너들이 같은 프레임에 깨어나지 않게 한다.
- 구조체 생성은 한 번에 5개까지만 하고 나머지는 0.1초 뒤에 이어서 처리한다. 스폰 위치 탐색이 연달아 실패하면 간격을 열 배로 늘린다.
- 스폰할 클래스는 `BeginPlay()`에서 비동기로 미리 로드해 둔다.

스포너가 속한 레벨이 스트리밍으로 언로드되면 스포너 액터도 사라진다. 이때 카운터와 구조체는 별도 매니저의 맵으로 옮겨 보관하고, 레벨이 다시 로드되면 돌려받는다. 스폰된 좀비는 스포너의 레벨이 아니라 퍼시스턴트 레벨에 속하게 해서 스포너와 수명이 엮이지 않게 했다.

## 보관함 내용물: 가까울 때만 복제

![](./images/notd-multiplayer-optimization/electric-facilities.avif)

보관함, 농장, 전기 설비 같은 건물은 액터 자체가 컬 거리 안에서 계속 복제 대상이다. 하지만 내용물 배열은 상자를 열 만큼 가까이 있을 때만 필요하다. 플레이어 기지에는 이런 건물이 많이 모이고, 기지에 들어서는 순간 모든 내용물이 한꺼번에 내려가면 그 자체로 부담이다.

### 복제용 배열을 분리

서버는 원본 배열과 복제용 배열을 따로 가진다. 복제되는 것은 복제용 배열뿐이다. 원본에서 복제용으로 옮길 때 근처에 플레이어가 있는지 확인하고, 없으면 복제용 배열을 비운다.

```cpp
void FItemContainer::RefreshReplicatedItems(const AActor* Owner)
{
	const IDistanceGatedReplication* Gate = Cast<IDistanceGatedReplication>(Owner);
	if (Gate && IsAnyPlayerWithin(Owner->GetActorLocation(), Gate->GetReplicationDistance()) == false)
	{
		ReplicatedItems.Empty();
		return;
	}

	ReplicatedItems.SetNum(Items.Num());
	for (int32 Index = 0; Index < Items.Num(); ++Index)
	{
		ReplicatedItems[Index] = FReplicatedItem(Items[Index]);
	}
}
```

코드의 기본 거리는 보관함과 농장이 10m, 상점이 50m다. 전기 설비는 조건이 하나 더 있어서, 근처의 플레이어가 전선 연결 도구를 들고 있을 때만 연결 목록을 채운다.

이 건물들은 평소 휴면 상태다. 보관함과 농장의 거리 검사 기본 주기는 1초이고, 전기 설비는 0.5초다. 농장은 복제용 배열에 내용이 있을 때 `FlushNetDormancy()`를 호출해 업데이트를 허용한다. 보관함 컴포넌트도 `FlushNetDormancy()`와 `ForceNetUpdate()`를 감싼 함수에서 배열을 갱신한다.

여기에는 원본 구현과 현재 권장 사용법의 차이가 있다. 원본은 복제용 배열을 수정한 뒤 휴면을 해제하지만, [Epic의 Dormancy 문서](https://dev.epicgames.com/documentation/en-us/unreal-engine/actor-network-dormancy-in-unreal-engine)는 복제 프로퍼티를 수정하기 전에 소유 액터에 `FlushNetDormancy()` 등을 호출하도록 안내한다. 수정 후 호출이 동작하는 것은 구현 세부에 의존하며, Fast Array에서는 변경분이 전달되지 않는 경우도 있다. 같은 구조를 적용할 때는 갱신할 필요를 먼저 판정하고, 소유 액터의 휴면을 해제한 다음 복제용 배열을 수정해야 한다.

### 행 전체 대신 ID

원본 배열의 원소는 데이터 테이블 행을 통째로 가지고 있다. 이름, 설명 텍스트, 에셋 경로가 들어 있다. 클라이언트도 같은 테이블을 가지고 있으므로 이것을 보낼 이유가 없다. 복제용 구조체에는 테이블을 조회할 ID와 수량, 개체 ID만 둔다.

```cpp
USTRUCT()
struct FReplicatedItem
{
	GENERATED_BODY()

	UPROPERTY()
	int32 EntityId = 0;

	UPROPERTY()
	int32 Amount = 0;

	UPROPERTY()
	FGuid ItemId;
};
```

클라이언트는 `OnRep`에서 ID로 테이블을 조회해 원본과 같은 형태의 배열을 다시 만든다. 이 규칙은 인벤토리뿐 아니라 퀘스트, 탄창, 전기 소켓 연결처럼 복제되는 구조체 전반에 같은 접미사를 붙여 적용했다.

### 한계

거리 판정은 연결별이 아니다. 한 명이 보관함에 다가가면 그 건물이 복제되는 모든 연결에 내용물이 전송된다. 서버 쪽 배열 자체를 비우고 채우는 방식이라 구현은 단순하지만, 같은 기지에 여러 명이 있을 때는 필요 없는 연결에도 내용물이 간다.

![근처 플레이어의 존재 여부로 서버의 공통 복제용 배열을 채운다. 한 명이 접근하면 그 건물이 복제되는 다른 연결에도 내용물이 전달될 수 있다.](./images/notd-multiplayer-optimization/container-replication-scope.webp)

원본은 복제용 배열을 비울 때 휴면을 해제하지 않는다. 다른 업데이트가 없다면 멀어진 클라이언트에는 마지막으로 받은 내용이 남는다. 하지만 다른 경로에서 액터의 휴면이 해제되면 빈 배열이 전달될 수도 있으므로, 이 캐시가 항상 유지된다고 가정할 수는 없다. 다시 가까워졌을 때 서버의 원본 배열을 기준으로 갱신해야 한다.

## 공통점

세 경우 모두 서버가 원본 상태를 가장 가벼운 형태로 쥐고 있고, 액터나 복제 데이터는 그 상태를 일시적으로 펼친 것이다. 이렇게 두면 다음이 함께 풀린다.

- 저장: 자연물과 스포너는 세이브에 넣을 것이 구조체 맵이다.
- 레벨 스트리밍: 액터가 언로드돼도 상태는 매니저에 남는다.
- 늦은 접속: 파괴된 자연물의 이력은 목록이므로 일괄 전송 경로를 그대로 쓸 수 있다.

대신 형태를 바꾸는 지점마다 비용이 생긴다. 인스턴스를 액터로 바꿀 때의 스폰, 구조체를 액터로 되돌릴 때의 풀 처리, 거리 검사를 위한 주기적인 플레이어 순회가 그것이다. 위에서 본 프레임당 처리 수 제한과 타이머 분산은 모두 이 비용을 한 프레임에 몰지 않기 위한 것이다.

## 참고 자료

- [Foliage Mode in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/foliage-mode-in-unreal-engine)
- [Actor Network Dormancy in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/actor-network-dormancy-in-unreal-engine)
