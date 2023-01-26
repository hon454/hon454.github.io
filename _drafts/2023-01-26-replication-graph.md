# 리플리케이션 그래프 분석

C:\Users\Jihun Jeon\Downloads\[English (auto-generated)] Networking in 4.20_ The Replication Graph _ Feature Highlight _ Unreal Engine Livestream [DownSub.com].txt

### 기타 네트워크 최적화

- DefaultGameplayTags.ini의 `[/Script/GamePlayTags.GameplayTagsSettings]`섹션에 `FastReplication=True`를 설정하기 (단, 이 경우 GameplayTag가 Server/Clinet 모두에서 동일해야 한다)
- 움직이지 않는 Actor의 bReplicateMovement 플래그를 비활성 하기



### 리플리케이션 그래프 핵심 구성 요소

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

- Actually replicates actors. Claaed every server tick.
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