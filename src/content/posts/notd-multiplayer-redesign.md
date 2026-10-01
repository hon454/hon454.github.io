---
title: "Night of the Dead 멀티플레이를 지금 다시 설계한다면"
image: ./images/notd-multiplayer-optimization/notd-multiplayer-redesign-cover.webp
published: 2026-10-02
description: "Night of the Dead의 멀티플레이 최적화를 새 프로젝트에서 처음부터 설계한다면 바꿀 부분을 좀비의 Mass 전환, Push Model과 Fast Array와 연결별 서브오브젝트 필터를 쓰는 복제, 애플리케이션 계층의 전송 흐름 제어로 나눠 기존 코드와 비교한다."
tags:
  - unreal-engine
  - networking
  - dedicated-server
  - performance
category: Unreal Engine
series: Night of the Dead 멀티플레이 최적화
seriesOrder: 6
draft: false
lang: ko
---

앞의 글들은 [Night of the Dead](/projects/night-of-the-dead/)에서 실제로 적용한 최적화를 정리했다. 대부분은 엔진의 기본 구조를 그대로 두고 그 위에 덧붙인 것이다. 좀비는 `ACharacter`로 두고 거리 순위로 비용을 깎았고, 복제는 Replication Graph와 휴면으로 대상을 줄였고, 대용량 전송은 액터 채널의 Reliable 버퍼를 보면서 나눠 보냈다.

같은 게임을 지금 새 프로젝트로 시작한다면 덧붙이는 대신 처음부터 구조로 가져갈 부분이 있다. 말 그대로 제로부터다.

![](./images/notd-multiplayer-optimization/from-zero-meme.webp)

다만 전부를 제로부터 다시 만들자는 이야기는 아니다. 바꿀 부분은 다음과 같고, 그대로 가져갈 것은 글 끝에 따로 적었다.

| 대상 | 프로젝트에서 한 것 | 다시 설계한다면 |
| --- | --- | --- |
| 좀비 | `ACharacter`에 거리 순위 LOD를 덧붙임 | Mass 엔티티로 두고 가까운 것만 액터 |
| 복제 시스템 | 기존 복제 시스템과 Replication Graph | Iris |
| 프로퍼티 복제 | 값을 바꾼 곳마다 `ForceNetUpdate()` | Push Model |
| 인벤토리 | 매 틱 복제용 배열 전체를 다시 채움 | Fast Array |
| 보관함 내용물 | 공유 배열을 거리로 채우고 비움 | 연결별 서브오브젝트 필터 |
| 대용량 전송 | 액터 채널의 `NumOutRec`으로 흐름 제어 | 수신 확인과 바이트 예산 |

## 좀비: 액터에서 Mass 엔티티로

### 손으로 만든 것

좀비 한 마리는 `ACharacter`를 상속한 액터이고 `UCharacterMovementComponent`, Behavior Tree와 위치 동기화 컴포넌트가 붙는다. 웨이브의 수백 마리를 감당하기 위해 그 위에 다음을 만들었다.

- 가장 가까운 플레이어와의 거리로 정하는 LOD와 전체 좀비의 거리 순위
- 거리 계산을 프레임당 정해진 수만 처리하는 매니저
- 스포너의 좀비를 정수, 구조체, 풀링 액터로 오가게 하는 단계
- 스켈레탈 메시를 버텍스 애니메이션 스태틱 메시로 바꿔 그리는 컴포넌트

마지막 항목은 [좀비 글](/posts/notd-zombie-horde-cost/)에서 다루지 않았다. 좀비에는 스켈레탈 메시와 별도로 버텍스 애니메이션용 스태틱 메시 컴포넌트가 있고, 조건이 맞으면 스켈레탈 메시를 숨기고 이쪽을 보인다. 공격 중이거나 죽었거나 피격 애니메이션을 재생 중이거나 랙돌 상태면 전환하지 않는다.

### Mass

Mass는 다수의 개체를 다루기 위한 엔진의 데이터 지향 프레임워크다. 개체는 액터가 아니라 엔티티이고 엔티티 자체는 ID일 뿐이다. 데이터는 프래그먼트라는 구조체에 담는다. 같은 프래그먼트 조합을 가진 엔티티는 한 아키타입으로 묶여 청크 단위의 연속된 메모리에 저장된다. 로직은 프로세서에 있다. 프로세서는 필요한 프래그먼트를 쿼리로 선언하고 조건에 맞는 청크를 순회하며 한꺼번에 처리한다.

액터는 한 마리마다 컴포넌트와 틱 함수, 복제 채널을 가진다. 좀비 300마리 중 플레이어와 싸우는 것은 일부이고, 나머지는 위치와 목적지 정도만 있으면 되는데도 같은 비용을 낸다. 프로젝트에서는 그 비용을 거리에 따라 하나씩 껐다. Mass에서는 먼 좀비에 처음부터 그 비용이 없다.

위에서 만든 네 가지도 Mass가 기본으로 다루는 문제와 겹친다. 가장 가까운 뷰어와의 거리로 LOD를 정하고 LOD에 따라 표현을 액터와 메시 인스턴스 사이에서 바꾼다. UE 5.8 소스의 `EMassRepresentationType`에는 `HighResSpawnedActor`, `LowResSpawnedActor`, `SkinnedMeshInstance`, `StaticMeshInstance`가 있다. 프로젝트에서는 이미 액터로 만든 좀비의 비용을 단계적으로 낮췄다. Mass에서는 모든 좀비가 엔티티로 있고 필요한 것만 액터로 올린다. 방향이 반대다.

### 기존: 매니저가 거리를 계산해 좀비에 넣어 준다

좀비는 틱에서 매니저에 갱신을 요청하고, 매니저는 프레임당 정해진 수만큼 모든 플레이어와의 거리를 계산한다. 한 바퀴가 끝나면 정렬해서 순위를 좀비의 컴포넌트에 기록한다. 컴포넌트는 그 값으로 이동 동기화의 전송 등급을 정한다.

```cpp
void UZombieOptimizeManager::UpdateDistanceRanks()
{
	const int32 NumZombies = Zombies.Num();
	// 프레임당 정해진 수만큼만 거리를 계산한다
	const int32 NumToProcess = FMath::Min(MaxDistanceUpdatesPerFrame, NumZombies - Cursor);

	for (int32 Step = 0; Step < NumToProcess; ++Step)
	{
		FZombieEntry& Entry = Zombies[Cursor++];
		Entry.DistSq = GetMinDistSqToViewers(Entry.Location);
	}

	// 한 바퀴가 끝났을 때만 정렬하고 순위를 기록한다
	if (Cursor >= NumZombies)
	{
		Zombies.Sort([](const FZombieEntry& A, const FZombieEntry& B) { return A.DistSq < B.DistSq; });
		for (int32 Rank = 0; Rank < NumZombies; ++Rank)
		{
			Zombies[Rank].Component->SetDistanceRank(Rank);
		}
		Cursor = 0;
	}
}

int32 UZombieLODComponent::CalcSendRateGrade() const
{
	int32 Grade = static_cast<int32>(LOD);
	// 가까운 30마리는 등급 값을 2 낮춘다
	if (DistanceRank <= 30)
	{
		Grade = FMath::Max(Grade - 2, 0);
	}
	return Grade;
}
```

좀비 목록, 커서, 등록과 해제, 풀 반환 시의 정리를 모두 매니저가 직접 관리한다. 좀비마다 컴포넌트가 하나씩 더 붙고 값은 매니저에서 컴포넌트로 복사된다.

### 변경: 프로세서가 프래그먼트를 읽는다

Mass의 LOD 수집 프로세서는 `FMassViewerInfoFragment`에 가장 가까운 뷰어와의 거리를 채운다. 전송 등급을 정하는 프로세서는 그 값을 읽기만 하면 된다.

```cpp
USTRUCT()
struct FZombieSyncFragment : public FMassFragment
{
	GENERATED_BODY()

	uint8 SendRateGrade = 0;
};

UZombieSyncGradeProcessor::UZombieSyncGradeProcessor()
	: EntityQuery(*this)
{
	// 서버에서만 실행한다
	ExecutionFlags = static_cast<int32>(EProcessorExecutionFlags::Server);
}

void UZombieSyncGradeProcessor::ConfigureQueries(const TSharedRef<FMassEntityManager>& EntityManager)
{
	// LOD 수집 프로세서가 채운 값을 읽기만 한다
	EntityQuery.AddRequirement<FMassViewerInfoFragment>(EMassFragmentAccess::ReadOnly);
	EntityQuery.AddRequirement<FZombieSyncFragment>(EMassFragmentAccess::ReadWrite);
}

void UZombieSyncGradeProcessor::Execute(FMassEntityManager& EntityManager, FMassExecutionContext& Context)
{
	// 요구 조건에 맞는 엔티티를 청크 단위로 받는다
	EntityQuery.ForEachEntityChunk(Context, [this](FMassExecutionContext& Context)
	{
		const TConstArrayView<FMassViewerInfoFragment> ViewerInfos = Context.GetFragmentView<FMassViewerInfoFragment>();
		const TArrayView<FZombieSyncFragment> Syncs = Context.GetMutableFragmentView<FZombieSyncFragment>();

		for (FMassExecutionContext::FEntityIterator EntityIt = Context.CreateEntityIterator(); EntityIt; ++EntityIt)
		{
			Syncs[EntityIt].SendRateGrade = CalcGradeByDistanceSq(ViewerInfos[EntityIt].ClosestViewerDistanceSq);
		}
	});
}
```

목록과 커서가 없어진다. 어떤 엔티티를 순회할지는 쿼리의 요구 조건이 정하고, 좀비가 생기고 사라질 때 따로 등록하거나 해제하지 않는다.

거리 순위는 이 예시에 없다. 프로젝트에서 순위를 쓴 이유는 웨이브가 기지 앞에 몰리면 거리만으로는 대부분이 최고 단계가 되기 때문이었다. `TMassLODCalculator`는 LOD마다 최대 수(`LODMaxCount`)를 받는다.

### 액터로 남아야 하는 좀비

전부를 엔티티로만 둘 수는 없다. 프로젝트의 좀비에는 액터에 묶인 처리가 있다.

- 근접 공격은 서버가 애니메이션 포즈에 맞춰 판정한다. 공격 범위에 들어온 좀비는 스켈레탈 메시와 포즈 갱신이 필요하다.
- 피격 반응, 부위 파괴와 랙돌은 스켈레탈 메시를 전제로 한다. 버텍스 애니메이션 전환을 막던 조건과 같다.
- 건물을 공격할 대상을 고르는 EQS와 내비메시 길찾기는 액터와 AI 컨트롤러 위에서 돈다.

그래서 경계는 "플레이어나 기지와 전투할 수 있는 거리"가 된다. 그 안의 좀비는 지금처럼 액터이고 밖의 좀비는 엔티티로 웨이브 경로를 따라 움직인다. 프로젝트에서도 웨이브 좀비는 웨이포인트를 따라 이동했으므로 먼 좀비는 내비메시 없이 경로 데이터만으로 옮길 수 있을 것으로 보인다. 엔티티가 액터로 바뀔 때 위치와 체력 같은 상태를 넘겨야 하는데, 스포너에서 구조체를 액터로 되돌릴 때는 클래스와 트랜스폼만 보존했다. 전투 중인 좀비가 경계를 넘나드는 경우에는 넘길 상태가 더 많다.

복제도 따로 설계해야 한다. Mass 엔티티는 액터가 아니므로 액터 복제 경로를 타지 않는다. 엔진에 MassReplication 모듈이 있지만, 프로젝트에서 쓰던 위치 동기화 컴포넌트와 연결별 피격 전파는 그 위에 새로 만들어야 한다.

## 복제 시스템: Iris

프로젝트의 복제는 엔진의 기존 복제 시스템 위에서 돌았다. 이 시스템은 연결마다 액터 채널을 열고 채널이 액터의 복제 프로퍼티를 그 연결에 마지막으로 보낸 값과 비교해 바뀐 것을 보낸다. 어떤 액터를 어느 연결에서 검토할지는 Replication Graph로 정했다.

Iris는 UE5에서 추가된 새 복제 시스템이다. 복제할 오브젝트의 상태를 프레임마다 한 번 복사해 두고 여러 연결이 그 복사본을 함께 쓴다. 누구에게 보낼지를 정하는 필터링과 무엇을 먼저 보낼지를 정하는 우선순위는 별도의 단계로 분리돼 있고, 오브젝트를 그룹으로 묶어 연결별로 허용 여부를 바꿀 수 있다.

새 프로젝트에서 Iris를 고르는 이유는 두 가지다. 프로젝트의 서버는 플레이어 수보다 오브젝트 수가 많은 구조였고, 변경을 찾는 작업을 연결마다 반복하지 않는 쪽이 이 구조에 맞다. 그리고 Replication Graph에서는 "이 연결에는 보내고 저 연결에는 보내지 않는다"를 노드를 직접 작성해 해결했다. Iris에서는 이를 필터와 그룹으로 표현할 수 있다. 프로젝트의 2D 그리드, Always Relevant, 빈도 제한과 Dependent Actor 구성을 Iris의 필터와 그룹, 우선순위로 옮기는 작업은 여기서 다루지 않는다.

아래의 Push Model, Fast Array, 서브오브젝트 조건은 Iris 전용이 아니다. 기존 복제 시스템에서도 쓸 수 있고 프로젝트에서 쓰지 않았던 것들이다. Iris로 옮길 때도 그대로 유지된다.

## 프로퍼티 복제: 호출 대신 표시

### 기존: 값을 바꾼 곳마다 ForceNetUpdate

`ForceNetUpdate()`는 액터를 다음 복제 시점에 바로 검토하게 하는 호출이다. 프로젝트에서는 값을 바꾼 곳마다 이 호출을 넣었다. 소스에는 76개 파일에 270곳가량 나오고, 아이템, 전기 설비, 트랩과 인벤토리 쪽에 몰려 있다. Push Model은 쓰지 않았다. `MARK_PROPERTY_DIRTY` 계열 호출이 소스에 없다.

건물의 충돌 프로파일을 바꾸는 코드가 전형적인 형태다.

```cpp
void APlayerBuilding::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);

	// 액터를 검토할 때마다 이 프로퍼티를 이전에 보낸 값과 비교한다
	DOREPLIFETIME(APlayerBuilding, CollisionProfile);
}

void APlayerBuilding::ServerSetCollisionProfile_Implementation(const FName& NewProfileName)
{
	CollisionProfile = NewProfileName;
	ApplyCollisionProfile();
	// 무엇이 바뀌었는지는 알리지 않고 액터를 바로 검토하게만 한다
	ForceNetUpdate();
}
```

값을 바꾼 함수가 "이 액터를 지금 검토하라"고 직접 호출한다. 무엇이 바뀌었는지는 전달하지 않으므로 엔진은 그 액터의 복제 프로퍼티를 이전 값과 비교해서 찾는다. 호출을 빠뜨리면 휴면 중인 건물에서는 변경이 전달되지 않는다.

### 변경: Push Model

기본 복제는 액터를 검토할 때마다 모든 복제 프로퍼티를 이전에 보낸 값과 비교한다. 바뀐 것이 없어도 비교는 한다. Push Model은 이 관계를 뒤집는다. 프로퍼티를 Push 기반으로 등록해 두면 엔진은 코드가 변경을 표시한 프로퍼티만 비교한다.

건물과 설비는 수가 많고 상태는 드물게 바뀐다. 검토될 때마다 전체를 비교하는 비용이 가장 아까운 대상이다. 그리고 Push Model 없이도 프로젝트는 이미 값을 바꾼 곳마다 호출을 넣고 있었다. 같은 자리에 "지금 검토하라" 대신 "이 프로퍼티가 바뀌었다"를 넣는 것이므로 코드를 쓰는 부담은 비슷하고 전달하는 정보는 더 많다.

새 프로젝트라면 복제 프로퍼티를 처음부터 Push Model로 등록한다.

```cpp
void APlayerBuilding::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);

	FDoRepLifetimeParams Params;
	// 변경을 표시한 프로퍼티만 비교한다
	Params.bIsPushBased = true;
	DOREPLIFETIME_WITH_PARAMS_FAST(APlayerBuilding, CollisionProfile, Params);
}

void APlayerBuilding::SetCollisionProfile(const FName& NewProfileName)
{
	if (CollisionProfile != NewProfileName)
	{
		// 값을 수정하기 전에 휴면을 해제한다
		FlushNetDormancy();

		CollisionProfile = NewProfileName;
		// 이 프로퍼티가 바뀌었다고 엔진에 알린다
		MARK_PROPERTY_DIRTY_FROM_NAME(APlayerBuilding, CollisionProfile, this);
		ApplyCollisionProfile();
	}
}
```

Push Model로 등록한 프로퍼티는 표시가 없으면 비교하지 않는다. 휴면을 해제하거나 갱신 시점을 앞당기는 호출까지 없어지는 것은 아니다. 그 호출이 놓이는 위치가 달라진다. 값을 바꾸는 경로가 setter 하나로 모이면 휴면 해제도 그 안에서 값을 수정하기 전에 한 번만 하면 된다. [오브젝트 글](/posts/notd-world-objects-as-data/)에는 복제용 배열을 수정한 뒤에 휴면을 해제하던 순서 문제를 적었다. 이 문제는 호출이 여러 곳에 흩어져 있어서 생겼다.

이 제약은 처음부터 지키는 편이 낫다. 270곳의 호출을 나중에 setter로 모으기는 어렵다.

## 인벤토리: 배열 전체 대신 항목 단위로

### 기존: 매 틱 복제용 배열을 다시 채운다

인벤토리는 원본 배열과 복제용 배열을 따로 둔다. 원본의 원소에는 데이터 테이블 행이 통째로 들어 있고 복제용 구조체는 ID와 수량만 가진다. 서버는 컴포넌트의 틱에서 원본을 복제용 배열로 옮긴다.

```cpp
void UInventoryComponent::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
	Super::TickComponent(DeltaTime, TickType, ThisTickFunction);

	if (GetOwner()->HasAuthority())
	{
		// 바뀐 것이 없어도 매 틱 서버에서 배열 전체를 복사한다
		ReplicatedItems.SetNum(Items.Num());
		for (int32 Index = 0; Index < Items.Num(); ++Index)
		{
			ReplicatedItems[Index] = FReplicatedItem(Items[Index]);
		}
	}
}

void UInventoryComponent::OnRep_ReplicatedItems()
{
	// 어느 칸이 바뀌었는지 전달되지 않아 원본과 수량 집계를 전부 다시 만든다
	Items.Reset(ReplicatedItems.Num());
	for (const FReplicatedItem& Replicated : ReplicatedItems)
	{
		Items.Add(FInventoryItem(FindEntityData(Replicated.EntityId), Replicated.Amount, Replicated.ItemId));
	}

	RebuildAmountView();
}
```

아이템이 바뀌지 않은 프레임에도 서버는 플레이어마다 배열 전체를 복사한다. 클라이언트는 한 칸이 바뀌어도 `OnRep`에서 원본 배열과 종류별 수량 집계를 처음부터 다시 만든다. 어느 칸이 바뀌었는지는 `OnRep`에 전달되지 않기 때문이다.

### 변경: Fast Array

Fast Array(`FFastArraySerializer`)는 구조체 배열을 항목 단위로 복제하는 엔진의 직렬화 방식이다. 일반 `TArray` 복제는 배열을 인덱스 순서로 비교한다. Fast Array는 항목마다 복제 ID와 변경 키를 두고 코드가 변경을 표시한 항목만 보낸다. 클라이언트에서는 추가, 변경, 삭제된 항목마다 콜백이 불린다.

인벤토리는 이 방식에 맞는 데이터다. 한 번에 한두 칸이 바뀌고, 클라이언트는 바뀐 칸의 UI와 수량 집계만 고치면 된다. 기존 구조는 서버와 클라이언트 양쪽에서 이 정보를 버리고 전체를 다시 만들었다. 프로젝트 소스에서 Fast Array를 쓴 곳은 예제 컴포넌트 하나뿐이었다.

```cpp
struct FInventoryList;

USTRUCT()
struct FInventoryEntry : public FFastArraySerializerItem
{
	GENERATED_BODY()

	UPROPERTY()
	// 클라이언트에서 항목 순서가 보장되지 않으므로 칸 번호를 항목에 둔다
	int32 SlotIndex = INDEX_NONE;

	UPROPERTY()
	int32 EntityId = 0;

	UPROPERTY()
	int32 Amount = 0;

	UPROPERTY()
	FGuid ItemId;

	// 추가, 변경, 삭제된 항목마다 불리는 콜백
	void PostReplicatedAdd(const FInventoryList& List);
	void PostReplicatedChange(const FInventoryList& List);
	void PreReplicatedRemove(const FInventoryList& List);
};

USTRUCT()
struct FInventoryList : public FFastArraySerializer
{
	GENERATED_BODY()

	UPROPERTY()
	TArray<FInventoryEntry> Entries;

	// 콜백에서 쓰는 참조이며 복제하지 않는다
	UPROPERTY(NotReplicated)
	TObjectPtr<UInventoryComponent> Owner = nullptr;

	bool NetDeltaSerialize(FNetDeltaSerializeInfo& DeltaParams)
	{
		// 항목 단위 델타 직렬화에 맡긴다
		return FFastArraySerializer::FastArrayDeltaSerialize<FInventoryEntry, FInventoryList>(Entries, DeltaParams, *this);
	}
};

template<>
struct TStructOpsTypeTraits<FInventoryList> : public TStructOpsTypeTraitsBase2<FInventoryList>
{
	enum
	{
		// 이 구조체가 NetDeltaSerialize를 쓴다고 엔진에 알린다
		WithNetDeltaSerializer = true,
	};
};
```

서버는 틱에서 복사하지 않고 수량을 바꾼 곳에서 그 항목만 표시한다.

```cpp
void UInventoryComponent::SetAmount(int32 EntryIndex, int32 NewAmount)
{
	FInventoryEntry& Entry = Inventory.Entries[EntryIndex];
	if (Entry.Amount != NewAmount)
	{
		Entry.Amount = NewAmount;
		// 바뀐 항목만 복제 대상으로 표시한다
		Inventory.MarkItemDirty(Entry);
	}
}

void FInventoryEntry::PostReplicatedChange(const FInventoryList& List)
{
	List.Owner->OnSlotChanged(SlotIndex, EntityId, Amount);
}
```

클라이언트의 `OnSlotChanged()`는 해당 칸의 위젯과 그 종류의 수량 집계만 갱신한다.

Fast Array는 클라이언트에서 항목의 순서를 보장하지 않는다. 기존 배열은 인덱스가 곧 인벤토리 칸이었으므로 칸 번호를 `SlotIndex`로 항목에 넣어야 한다. 항목을 지울 때는 `MarkArrayDirty()`를 호출해야 한다.

ID만 보내고 클라이언트가 테이블을 조회하는 규칙은 그대로다. 이제는 배열 전체 대신 항목이 복제와 통지의 단위가 된다.

## 보관함 내용물: 가까운 연결에만

### 기존: 공유 배열을 채우고 비운다

보관함도 같은 복제용 배열을 쓴다. 다만 근처에 플레이어가 없으면 서버가 배열을 비운다.

```cpp
void FItemContainer::RefreshReplicatedItems(const AActor* Owner)
{
	const IDistanceGatedReplication* Gate = Cast<IDistanceGatedReplication>(Owner);
	if (Gate && IsAnyPlayerWithin(Owner->GetActorLocation(), Gate->GetReplicationDistance()) == false)
	{
		// 근처에 아무도 없으면 비운다. 이 배열은 액터를 복제받는 모든 연결이 공유한다
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

배열은 액터가 공유하는 상태다. 판정은 "누구든 가까이 있는가"이고, 한 명이 다가가면 그 건물이 복제되는 모든 연결에 내용물이 간다.

### 변경: 서브오브젝트와 COND_NetGroup

서브오브젝트는 액터에 딸려 함께 복제되는 `UObject`다. 액터의 서브오브젝트 목록에 등록하며 등록할 때 복제 조건을 줄 수 있다. 프로퍼티의 `COND_OwnerOnly`처럼 서브오브젝트 단위로 "어느 연결에 보낼지"를 정하는 것이다. `COND_NetGroup`은 그중 하나로, 서브오브젝트를 이름이 있는 그룹에 넣고 그 그룹에 속한 PlayerController의 연결에만 복제한다.

기존 방식이 연결별로 거르지 못한 이유는 걸러야 할 대상이 액터의 프로퍼티였기 때문이다. 프로퍼티 조건에는 "가까이 있는 연결"을 표현할 방법이 없어서 배열 자체를 비웠다. 내용물을 서브오브젝트로 분리하면 액터는 그대로 모두에게 복제하고 내용물만 연결마다 따로 정할 수 있다. 서브오브젝트 안의 내용물은 위의 Fast Array로 둔다.

```cpp
void AStorageBuilding::BeginPlay()
{
	Super::BeginPlay();

	if (HasAuthority())
	{
		Contents = NewObject<UStorageContents>(this);
		// 그룹에 속한 PlayerController의 연결에만 복제한다
		AddReplicatedSubObject(Contents, COND_NetGroup);

		UNetworkSubsystem* NetSubsystem = GetWorld()->GetSubsystem<UNetworkSubsystem>();
		NetSubsystem->GetNetConditionGroupManager().RegisterSubObjectInGroup(Contents, ContentsGroupName);
	}
}

void AStorageBuilding::RefreshViewers()
{
	for (FConstPlayerControllerIterator It = GetWorld()->GetPlayerControllerIterator(); It; ++It)
	{
		APlayerController* PlayerController = It->Get();
		if (PlayerController == nullptr)
		{
			continue;
		}

		// 가까워지면 그룹에 넣고 멀어지면 뺀다. 내용물 데이터는 건드리지 않는다
		const bool bIsNear = IsWithinContentsDistance(PlayerController->GetPawn());
		const bool bIsMember = PlayerController->IsMemberOfNetConditionGroup(ContentsGroupName);

		if (bIsNear && bIsMember == false)
		{
			PlayerController->IncludeInNetConditionGroup(ContentsGroupName);
		}
		else if (bIsNear == false && bIsMember)
		{
			PlayerController->RemoveFromNetConditionGroup(ContentsGroupName);
		}
	}
}
```

거리 검사는 기존과 같은 주기의 타이머로 돌린다. 검사 결과를 쓰는 곳이 달라졌다. 기존에는 서버의 배열을 바꿨고, 여기서는 연결의 그룹 소속을 바꾼다. 서버의 내용물 데이터는 건드리지 않는다.

`AddReplicatedSubObject()`는 액터의 `bReplicateUsingRegisteredSubObjectList`가 켜져 있어야 쓸 수 있다. Iris를 쓰면 이 그룹이 서브오브젝트 필터 그룹으로 만들어지고 연결마다 허용 여부가 설정된다.

그룹 수에는 한도가 있다. `UReplicationSystem`의 `MaxNetObjectGroupCount` 기본값은 2048이다. 보관함마다 그룹을 하나씩 만들면 건물이 많은 서버에서 한도에 닿을 수 있다. 기지나 구역 단위로 그룹을 묶거나 한도를 올려야 한다. 묶는 단위가 커질수록 필요 없는 연결에 가는 내용물이 다시 늘어난다.

## 대용량 전송: 엔진의 버퍼 대신 직접 확인한다

### 기존: NumOutRec을 보고 다음 조각을 보낸다

[스트리밍 라우터](/posts/notd-reliable-rpc-data-streaming/)는 레코드를 100개씩 묶어 Reliable RPC로 보내고, 액터 채널에서 수신 확인을 받지 못한 번치 수가 한도 아래일 때만 다음 조각을 보냈다.

```cpp
void UStreamRouterComponent::SendPendingChunks(const UActorChannel* Channel)
{
	const int32 ChunkSize = 100;
	// 수신 확인을 받지 못한 번치가 이 수보다 적을 때만 다음 조각을 보낸다
	const int32 OutRecLimit = RELIABLE_BUFFER / 4;

	for (FStreamRequest& Request : Requests)
	{
		const int32 NumChunks = Request.GetNumChunks(ChunkSize);
		while (Request.ChunksSent < NumChunks && Channel->NumOutRec < OutRecLimit)
		{
			const int32 Start = Request.ChunksSent * ChunkSize;
			const int32 Count = FMath::Min(ChunkSize, Request.Records.Num() - Start);

			ClientReceiveChunk(Request.Tag, TArray<FStreamRecord>(Request.Records.GetData() + Start, Count));
			++Request.ChunksSent;
		}
	}
}
```

별도의 ack 없이 엔진이 이미 아는 값을 쓴다는 것이 장점이었다. 이전 글에 적은 제약은 다음과 같다.

- 조각의 크기를 레코드 수로만 정한다. 큰 레코드가 섞이면 조각 하나가 버퍼를 채울 수 있다.
- `NumOutRec`은 네트워크 ACK만 반영한다. 클라이언트가 조각을 처리했는지는 알 수 없다.
- 클라이언트는 태그에 등록된 소켓이 없으면 조각과 완료 알림을 버린다.

### Iris에서는 기준으로 삼던 값이 달라진다

Iris에서는 RPC가 액터 채널의 이 경로로 나가지 않는다. UE 5.8 소스를 보면 `UReplicationSystem::SendRPC()`가 RPC를 오브젝트별 attachment 큐에 넣는다. Reliable 쪽은 수신 확인 전의 블롭을 1024개까지 담는 전송 창이 있고 창이 차면 그 앞의 대기 큐에 쌓는다. 대기 큐의 기본 한도는 `net.ReliableRPCQueueSize`의 4096개이고, 넘으면 `ensure`가 발생하며 그 RPC는 큐에 들어가지 않는다. 따라서 Iris로 가면 `NumOutRec`은 스트리밍의 밀린 정도를 알려 주지 않을 것으로 보인다.

복제 방식을 바꾸면 흐름 제어의 기준도 함께 바꿔야 한다. 엔진 내부의 큐 상태에 기대는 대신 라우터가 직접 수신 확인을 받는 편이 복제 시스템과 무관하게 유지된다.

### 변경: 바이트 예산과 수신 확인

조각을 레코드 수가 아니라 바이트로 자르고 확인받지 못한 조각의 수로 전송을 멈춘다.

```cpp
void UStreamRouterComponent::SendPendingChunks()
{
	// 확인받지 못한 조각이 한도에 닿으면 멈춘다
	while (Requests.IsEmpty() == false && NextChunkId - LastAckedChunkId < MaxUnackedChunks)
	{
		FStreamRequest& Request = Requests[0];

		TArray<FStreamRecord> Chunk;
		int32 ChunkBytes = 0;
		while (Request.NextRecord < Request.Records.Num())
		{
			const FStreamRecord& Record = Request.Records[Request.NextRecord];
			// 바이트 한도를 넘기기 직전까지 담는다. 첫 레코드는 한도를 넘어도 담는다
			if (Chunk.Num() > 0 && ChunkBytes + Record.Bytes.Num() > MaxChunkBytes)
			{
				break;
			}

			ChunkBytes += Record.Bytes.Num();
			Chunk.Add(Record);
			++Request.NextRecord;
		}

		const bool bIsLastChunk = Request.NextRecord >= Request.Records.Num();
		ClientReceiveChunk(NextChunkId++, Request.Tag, Chunk, bIsLastChunk);

		if (bIsLastChunk)
		{
			Requests.RemoveAt(0);
		}
	}
}

void UStreamRouterComponent::ServerAckChunk_Implementation(uint32 ChunkId)
{
	// 클라이언트가 조각을 처리한 뒤 호출한다
	LastAckedChunkId = FMath::Max(LastAckedChunkId, ChunkId);
}
```

`NextChunkId`는 다음에 보낼 조각의 번호이고 `LastAckedChunkId`는 클라이언트가 확인한 마지막 번호다. 채널을 인자로 받지 않는다. 클라이언트는 조각을 소켓에 넘긴 뒤에 `ServerAckChunk()`를 호출하므로 이 수신 확인은 클라이언트가 조각을 실제로 처리했다는 뜻이 된다.

레코드 하나가 `MaxChunkBytes`보다 크면 그 레코드만으로 조각 하나를 만든다. 큰 레코드를 다시 쪼개는 처리는 이 예시에 없다.

클라이언트 쪽에서는 두 가지를 바꾼다.

- 태그에 등록된 소켓이 없으면 조각을 버리지 않고 보관했다가 소켓이 등록될 때 넘긴다. 수신 확인은 넘긴 뒤에 보낸다.
- 완료 알림을 별도 RPC로 두지 않고 마지막 조각의 플래그로 보낸다.

개수만 비교하던 검증은 항목 ID의 해시를 비교하도록 바꿀 수 있다. 다만 수신 확인이 처리 완료를 뜻하게 되면 검증이 잡아야 할 경우가 줄어든다. 검증을 남길지는 그 뒤에 정해도 된다.

수신 확인 RPC가 조각마다 하나씩 추가된다. 접속 시의 일괄 전송에서는 조각 수만큼 클라이언트에서 서버로 가는 Reliable RPC가 늘어난다.

피격 전파의 신뢰성 선택도 `NumOutRec`에 기대고 있었다. 이쪽은 대체할 기준이 따로 필요하다.

## 그대로 가져갈 것

구조를 바꿔도 방법은 남는다. [개요 글](/posts/notd-multiplayer-optimization-overview/)의 공통 방법 중 다음은 새 설계에서도 그대로 쓴다.

- 서버와 클라이언트가 같은 데이터를 가지고 있으면 그것을 가리키는 값만 보낸다. 데이터 테이블 ID, 레벨 코드가 여기에 해당한다.
- 자연물은 인스턴스로 두고 타격받은 것만 액터로 바꾼다. 파괴 이력은 구조체 목록으로 유지한다.
- 한 프레임에 처리하는 수를 정해 두고 나눠 처리한다. Mass로 옮긴 부분은 프로세서가 이 역할을 맡지만, 리스폰 검사와 폴리지 정리는 그대로다.

"엔진이 이미 알고 있는 값을 기준으로 삼는다"는 방법은 조건이 붙는다. `NumOutRec`처럼 특정 복제 구현의 내부 상태는 그 구현을 바꾸면 쓸 수 없다.

## 참고 자료

- [Iris Replication System in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/iris-replication-system-in-unreal-engine)
- [Mass Entity in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/mass-entity-in-unreal-engine)
- [Replicating UObjects in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/replicating-uobjects-in-unreal-engine)
