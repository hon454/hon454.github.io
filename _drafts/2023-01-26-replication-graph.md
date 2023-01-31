# 리플리케이션 그래프 분석

## 기타 네트워크 최적화

- DefaultGameplayTags.ini의 `[/Script/GamePlayTags.GameplayTagsSettings]`섹션에 `FastReplication=True`를 설정하기 (단, 이 경우 GameplayTag가 Server/Clinet 모두에서 동일해야 한다)
- 움직이지 않는 Actor의 bReplicateMovement 플래그를 비활성 하기



## 리플리케이션 그래프 (ReplicationGraph.h 파일에 적혀있는 내용)

**Replication Driver**의 구현이다. `UReplicationGraph`의 하위클래스를 구현함으로써 커스터마이즈가 가능하다. 기본 구현(UreplicationGraph)는 완전하게 작동하지않으며, 재정의를 하기 위한 것이다.

- BasicReplicationGrpah.h에서 최소 기능으로 즉시 작동하는 구현을 확인 할 수 있다. 
- ShooterGame/UShooterReplicationGraph를 통해 더 발전된 구현을 확인 할 수 있다.



#### High level 리플리케이션 그래프 개요

- 그래프는 각 연결에 대한 리플리케이션 목록을 생성하는 노드의 모음이다. 그래프는 기본적으로 리플리케이트 할 액터들의 목록들을 지속적으로 유지 관리하고 해당 목록들을 연결들에 공급한다.
- 이를 통해 더 분배되어야 할 더 많은 작업들을 한번에 수행 할 수 있으며, (액터의 수 * 연결 수)에 관련하여 시스템의 확장성을 크게 향상시킨다.
- 여기서 주요 영향은 `IsNetRelativeFor`및 `GetNetPriority`와 같은 가상 함수들이 리플리케이션 그래프에서 사용되지 않는다는 것이다.
- 대신 게임 코드가 리플리케이션에 영향을 주는 방법은 기본적으로 3가지가 있다.
  - 그래프 그 자체. 새로운 `UReplicationNodes`를 추가하거나 그래프에 액터를 배치하는 방법을 변경한다.
  - FGlobalActorReplicationInfo: 리플리케이션 그래프가 각 액터들에 대해 전역적으로 유지하는 연관 데이터이다.
  - FConnectionReplicationActorInfo: 각 액터에 대해 연결 별로 리플리케이션이 유지되는 연관데이터
- 예를 들어, 그래프의 한 노드는 공간화(spatialization) 노드이다. 기본적으로 거리 기반 관련성(relevancy)를 사용하는 액터들이 이 노드에 해당한다. 또 다른 노드로는 Always Relevant 노드들이다.

- 그래프로부터 반환된 액터 목록들은  추가적으로 거리와 주파수에 의하여 제한되고 이후 병합되고 우선 순위가 지정된다.  최종 결과는 액터 채널을 만들거나 갱신하기 위한 로직을 수행하려는 정렬된 리플리케이트 할 액터 목록이다.



#### 하위 클래스가 구현해야 할 함수들

- **UReplicationGraph::InitGlobalActorClassSettings**

  `UReplicationGraph::GlobalActorReplicationInfoMap`을 초기화 한다.

- **UReplicationGraph::InitGlobalGraphNodes**

  `UReplicationGraph::CreateNewNode`를 통해 새로운 `UGraphNodes`를 추가한다. 전역 노드인 경우 (모든 연결에 대하여) `UReplicationGraph::AddGlobalGraphNode`를 사용한다.

- **UReplicationGraph::RouteAddNetworkActorToNodes / UReplicationGraph::RouteRemoveNetworkActorToNodes**

  스폰/디스폰 된 액터를 올바른 노드로 지정한다. (또는 노드들이 스스로 액터들을 모을 수 도 있다)

- **UReplicationGraph::InitConnectionGraphNodes**

  각 연결에 대한 노드를 초기화 한다. (또는 `UReplicationGraph::AddConnectionGraphNode`를 통해 공유 노드를 연관 시킨다)



## 리플리케이션 그래프 핵심 구성 요소

#### InitGlobalActorClassSettings

- Fills GlobalActorReplicationInfoMap with classes to replicate and their net update frequencies
- 기본적으로 리플리케이션될 모든 클래스를 미리 수집하자는 것

#### InitGlobalGraphNodes

- Creates nodes that may replicate actors to all connections
- 어떠한 Connection에도 연관성을 가지는 노드 
  - 모든 Client에 리플리케이션 되는 GameState와 같은 Actor들이 여기에 속한다.

#### InitConnectionGraphNodes

- Creates nodes that may replicate actors to a specific connection.
- 서버에 새로운 Connection이 생길 때마다 호출 되며 각 연결에 관련된 액터를 결정하는데 사용된다. 
  - PlayerController가 여기에 연결되는 대표적인 actor이다.

#### RouteAddNetworkActorToNodes

- Inserts a new actor into specific node for replication
- 개별 노드 혹은 리플리케이션 목록에서 액터를 추가하는 기능을 담당

#### RouteRemoveNetworkActorToNodes

- Removes an actor from its node to stop replicating
- 개별 노드 혹은 리플리케이션 목록에서 액터를 제거하는 기능을 담당

#### ServerReplicateActors

- Actually replicates actors. Claaed every server tick.s
- 액터를 실제로 복제하는 작업.



### 리플리케이션 그래프 노드 구성

#### GatherActorListsForConnection

- Builds a list of actors to replicate to the specified connection.
- 실제로 반환할 항목을 결정하기 위해 각 그래프 노드에 대해 호출 되는 함수



## 포트나이트의 리플리케이션 그래프

#### 리플리케이션 액터가 추가/삭제 되는 등 상태 변화가 발생 할 때 리플리케이션 그래프를 수정하는 것으로 보임

<img src="C:\Users\Jihun Jeon\AppData\Roaming\Typora\typora-user-images\image-20230127152303098.png" alt="image-20230127152303098" style="width:100%;" />



#### 다음과 같이 액터의 리플리케이션 룰을 설정

<img src="C:\Users\Jihun Jeon\AppData\Roaming\Typora\typora-user-images\image-20230127152659414.png" alt="image-20230127152659414" style="width:100%;" />



## MazyModz - Replication Graph (Tutorial & Overview)

#### 리플리케이션 그래프란?

- 네트워크 게임을 위한 고 수준(High-Level)의 서버 최적화
- C++ 전용 기능
- 처음에는 포트나이트의 자체 기능을 위해 개발 됨.
- 특정 연결(Connection)에 대해 빠르고 효율적으로 리플리케이트 해야 할 것을 결정한다.
- 각기 다른 액터들을 그들이 처리 되는 **노드(ReplicationGraphNode)**로 전송한다.



#### 리플리케이션 그래프의 최적화 개념

- 위치에 기반하여 액터들을 그룹으로 분류한다 (Grid Spatialization)
  - 일부 사전 정의된 위치의 액터들을 특정 연결에 대하여 업데이트를 송신하지 않음으로써 성능을 향상시킨다.
- 네트워크 업데이트를 조절한다 (Static, Dynamic or Dormant actor routes)
  - 액터의 역할에 따라 업데이트 빈도를 설정하여 대역폭을 줄인다.
- 액터의 Owner가 업데이트 될 때 업데이트를 수행한다 (DependantActorList)
  - 캐릭터가 무기를 가지고 있다고 할 때, 무기를 따로 업데이트하지 않고, 캐릭터가 업데이트 되면 무기를 업데이트 한다. 
- 모든 연결에 대하여 항상 알려진 액터 목록을 구성한다 (AlwaysRelevant Node)
- 특정 연결에 대하여 항상 알려진 액터 목록을 구성한다 (AlwaysRelevantForConnection Node)



#### 리플리케이션 그래프 노드

- 'Nodes'라고 불리기는 하지만 그냥 클래스. 블루프린트 노드와 혼동하지 말 것
- 액터들을 고유의 특별한 방법으로 다룬다
- **Grid Spatialization Node** (UReplicationGraphNode_GridSpatailization2D)
  - 월드를 격자로 나눈다
  - 액터가 소속한 셀에 의존하여 연결이(Connection) 네트워크 업데이트를 수신해야 하는지를 결정한다.
  - 몇 가지 방법들로 리플리케이션을 다룰 수 있다. (Static, Dynamic, Dormant)
- **Always Relevant Node** (UReplicationGraphNode_AlwaysRelevant)
  - 모든 연결에 대하여 항상 네트워크 업데이트를 송신 하는 액터들을 처리한다.
- **Always Relevant For Connection Node** (UReplicationGraphNode_AlwaysRelevant_ForConnection)
  - 특정 연결에 대하여 항상 네트워크 업데이트를 송신 하는 액터들을 처리한다.

#### 

#### 참고 자료 및 가이드

- [Wiki Docs](https://docs.unrealengine.com/en-US/replication-graph-in-unreal-engine/)
- [Epic Games Livestream](https://www.youtube.com/live/CDnNAAzgltw?feature=share)
- BasicReplicationGraph.h (엔진에 내장 됨, 기초 설정)
- ShooterReplicationGraph.h (ShooterGame 예제, 고급 설정)



#### 리플리케이션 그래프 활성화

```ini
[/Script/OnlineSubsystemUtils.IpNetDriver]
ReplicationDriverClassName="/Script/ProjectName.ClassName"

;If you are using steam uncomment bellow
;[/Script/OnlineSubsystemSteam.SteamNetDriver]
;ReplicationDriverClassName="/Script/ProjectName.ClassName"
```

```csharp
// Copyright Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;

public class ProjectName : ModuleRules
{
	public ProjectName(ReadOnlyTargetRules Target) : base(Target)
	{
        PrivateDependencyModuleNames.AddRange(new string[] { "ReplicationGraph" });
    }
}
```



## The ReplicationGraph Grid Spatialization

### Legacy Unreal Engine Replication System

- 월드의 모든 액터를 가져온다.
- 액터 및 연결에 대한 액터의 위치를 가져온다.
- 액터가 Cull Distance 및 다른 플래그들에 의해 연관성이 있는지 확인한다.
- 몇 천개의 액터가 있는 월드에서는 정상 작동한다
- 매우 큰 오픈월드/MMO에서는 매우 느리다.



### ReplicationGraph Grid Spatialization

- 맵을 'Cell'이라 불리는 격자로 나눈다.
- 이 'Cell'들은 각 연결별로 처리해야할 액터들의 목록을 가지고 있다.
- 주어진 셀의 연결은 셀의 액터 목록에 대한 관련성만 처리한다
- 결과적으로 연결당 처리할 작업자 수가 **훨씬 줄어듭니다**
- 서버에서 전반적으로 **향상된 CPU 성능** 제공
- 복제 작업자 근처의 셀에도 해당 작업자가 목록에 포함됩니다. 이 값은 배우의 컬 거리 설정에 의해 정의됩니다



### Cell Frequency Buckets

- 스트리밍 되지 않는 액터 목록을 다수의 **버킷**들로 분할하여 성능 향상
- 프레임 마다 번갈아가며 버킷들의 리플리케이션을 수행
- 리플리케이션 교대 프레임의 각 "버킷"에서 가져옵니다
- 부하를 다른 프레임에 균등하게 분산합니다
- 그리드 공간화에 저장된 각 그리드 셀에서 기본적으로 찾을 수 있습니다



## ShooterReplicationGraph Replication

### Overview

이것은 액터의 관련성의 작동 방식을 변경합니다. AActor::IsNetRelativeFor는 이 시스템에서 사용되지 않습니다!

대신에, UShooterReplicationGraph는 UReplicationGraphNodes를 포함하고 있습니다. 이 노드들은 각 연결에 대해 리플리케이트 할 액터 목록을 생성하는 역할을 합니다. 이러한 목록의 대부분의 프레임간에 영구적입니다. 이를 통해 수집 작업("리플리케이트를 위해 고려해야 하는 액터들")의 대부분을 공유/재사용 할 수 있습니다. 노드는 글로벌(모든 연결에서 사용됨), 연결별(각 연결마다 고유한 노드가 있음) 또는 공유(e.g, 팀: 동일한 팀 간의 모든 연결)일 수 있습니다. 액터들은 여러 노드에 속할 수 있습니다! 예를들어 폰은 spatialization 노드에 속 하면서 always-relevant-for-team 노드에도 동시에 속할 수 있습니다. 그것은 팀원들에게 투번 반환 될 것입니다. 가능하면 최소화 해야 하지만 이정도는 괜찮습니다.

UShooterReplicationGraph는 게임 코드에 의해 직접 사용되지 않도록 고안되었습니다. 즉, 다른 어느곳에도 ShooterReplicationGraph.h를 포함할 필요가 없습니다.

오히려 UShooterReplicationGraph가 게임 코드에 의존하며 게임 코드가 방송하는 이벤트(예. 팀에 가입/탈퇴하는 플레이어를 위한 이벤트 등)에 등록합니다.

이런 결과는 UShooterReplicationGraph가 액터 리플리케이션에 대한 완전한 전체적인 뷰를 제공하기 때문에 만들어졌습니다. 게임 코드의 어떤 장소에서도 호출 할 수 있는 일반적인 공공 기능을 노출하는 대신, 모든 알림은 `ShooterReplicationGraph::InitGlobalActorClassSettings`에서 명시적으로 등록됩니다.



### ShooterGame Nodes

### Dependent Actors (AShooterWeapon)



### 참고자료

[Replication Graph | Unreal Engine Documentation](https://docs.unrealengine.com/5.1/en-US/replication-graph-in-unreal-engine/)

[Replication Graph overview and proper replication methods](https://www.unrealengine.com/en-US/tech-blog/replication-graph-overview-and-proper-replication-methods)

https://github.com/DaedalicEntertainment/ue4-replication-graph

https://github.com/locus84/LocusReplicationGraph

[Replication Graph For Optimizing Real-Time Strategy Games](https://www.youtube.com/watch?v=VusAHXoHF3Y)

[UE4-DAReplicationGraphExample](https://github.com/MazyModz/UE4-DAReplicationGraphExample)

[[UE4] Replication Graph](https://qiita.com/donbutsu17/items/71aa94d2aa539e96db40)

[Replication Graph 从入门到入土](https://bokjan.com/2022/10/unreal-replication-graph.html)