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



### 참고자료

[Replication Graph | Unreal Engine Documentation](https://docs.unrealengine.com/5.1/en-US/replication-graph-in-unreal-engine/)

[Replication Graph overview and proper replication methods](https://www.unrealengine.com/en-US/tech-blog/replication-graph-overview-and-proper-replication-methods)

https://github.com/DaedalicEntertainment/ue4-replication-graph

https://github.com/locus84/LocusReplicationGraph

[Replication Graph For Optimizing Real-Time Strategy Games](https://www.youtube.com/watch?v=VusAHXoHF3Y)

[UE4-DAReplicationGraphExample](https://github.com/MazyModz/UE4-DAReplicationGraphExample)