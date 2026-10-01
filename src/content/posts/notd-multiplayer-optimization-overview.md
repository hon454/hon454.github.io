---
title: "Night of the Dead 멀티플레이 최적화 돌아보기"
published: 2026-10-01
description: "Night of the Dead의 Dedicated Server 멀티플레이에서 담당한 네트워크와 실행 비용 최적화를 복제 대상, 전송 데이터, 전송 경로, 다수 개체 처리로 나눠 정리하고 각 주제의 상세 글로 연결한다."
image: ./images/notd-multiplayer-optimization/cover.avif
tags:
  - unreal-engine
  - networking
  - dedicated-server
  - performance
category: Unreal Engine
series: Night of the Dead 멀티플레이 최적화
seriesOrder: 1
draft: false
lang: ko
---

[Night of the Dead](/projects/night-of-the-dead/)는 Unreal Engine으로 만든 오픈월드 생존 게임이고 Dedicated Server 멀티플레이를 지원한다. 넓은 맵에 자연물과 건물이 많고, 밤마다 좀비 수백 마리가 플레이어 기지로 몰려온다. 서버가 다뤄야 할 오브젝트 수가 플레이어 수보다 맵과 웨이브 규모에 따라 정해지는 게임이다.

![](./images/notd-multiplayer-optimization/wave-giants-night.avif)

같은 데이터를 더 빨리 보내기 전에 어느 연결에 어떤 상태가 필요한지부터 구분했다. 서버가 유지할 상태, 클라이언트에서 복원할 데이터와 가까운 개체에 배정할 계산을 나누는 것이 공통 방향이었다. 이 프로젝트에서 담당한 멀티플레이 최적화를 네 갈래로 나눠 정리했다. 각 항목의 자세한 내용은 연결된 글에 있다.

| 갈래 | 질문 | 적용한 것 |
| --- | --- | --- |
| 복제 대상 | 누구에게 보낼 것인가 | Replication Graph, Dependent Actor, Net Dormancy, 거리 기반 내용물 복제 |
| 전송 데이터 | 무엇을 얼마나 작게 보낼 것인가 | ID 기반 복제용 구조체, 커스텀 `NetSerialize`, 보내지 않는 상태 |
| 전송 경로 | 어떻게 나눠 보낼 것인가 | RPC 스트리밍, 연결별 신뢰성 선택 |
| 다수 개체 | 서버가 얼마나 계산할 것인가 | 액터 대신 데이터, 거리 순위 LOD, 애니메이션과 길찾기 비용 조절 |

## 복제 대상

### Replication Graph

UE5로 이전하면서 Replication Graph를 Lyra 샘플의 구성에 맞춰 다시 작성했다. 위치가 있는 액터는 2D 그리드 노드에, 전역 매니저는 Always Relevant 노드에 두고, PlayerState는 프레임마다 일부만 반환하는 빈도 제한 노드로 처리했다.

거리만으로 판단하면 안 되는 관계는 Dependent Actor로 묶었다. 장착 장비는 장비를 든 캐릭터에, 추종자는 고용한 플레이어에, 탑승물 위의 건물은 탑승물에 종속시켜 부모가 복제되는 연결에서 함께 검토되게 했다.

Replication Graph의 동작 자체는 [Unreal Engine Replication Graph: 라우팅에서 전송까지](/posts/unreal-engine-replication-graph/)에 정리했다.

### Net Dormancy

상태가 드물게 바뀌는 액터는 휴면을 기본으로 하고 변화가 있을 때만 깨웠다.

- 바닥에 놓인 아이템은 휴면 상태로 두고, 던져져 움직이는 동안에만 주기적으로 갱신한다.
- 레벨에 배치된 문은 `DORM_Initial`로 시작한다. 열리거나 닫히는 동안에만 깨어 있고, 닫히면 다시 휴면한다.
- 풀링하는 좀비는 풀에 반환할 때 휴면시키고 다시 꺼낼 때 깨운다. 풀링과 휴면을 함께 쓰면 상태를 바꾸는 지점마다 휴면 여부를 확인해야 한다.

휴면 상태와 깨우는 방법은 [UE4 Net Dormancy와 서버 리플리케이션 최적화](/posts/unreal-engine-network-dormancy-and-server-optimization/)에 정리했다.

### 거리 기반 내용물 복제

보관함, 농장, 전기 설비는 액터가 복제되는 범위보다 내용물이 필요한 범위가 훨씬 좁다. 서버가 원본 배열과 복제용 배열을 따로 두고, 플레이어가 가까이 있을 때만 복제용 배열을 채웠다.

복제용 배열은 액터가 공유하는 상태다. 플레이어 한 명이 가까이 있으면 배열이 채워지고 다른 복제 대상 연결에도 전달될 수 있으므로, 연결마다 내용물을 따로 거르는 방식은 아니다.

상세: [오픈월드의 오브젝트를 액터 대신 데이터로 두기](/posts/notd-world-objects-as-data/)

## 전송 데이터

### ID만 보내고 클라이언트에서 복원

아이템, 퀘스트, 탄창, 전기 소켓 연결처럼 데이터 테이블에서 온 값을 가진 구조체는 복제용 구조체를 따로 두었다. 테이블 행 전체 대신 ID와 수량만 보내고 클라이언트가 `OnRep`에서 테이블을 조회해 복원한다.

### 커스텀 NetSerialize

접속할 때 서버가 보내는 스트리밍 레벨 상태 목록은 레벨마다 패키지 경로 문자열이 들어 있었다. 경로를 DataTable 기반의 `int16` 코드로 바꾸고 플래그를 비트로 묶었다.

상세: [접속 시 레벨 스트리밍 상태 RPC 줄이기](/posts/notd-level-streaming-status-rpc/)

### 보내지 않는 상태

기본 상태 컴포넌트에서 체력 등의 상태 프로퍼티를 소유자 전용으로 두고, 플레이어의 상태 컴포넌트에서는 복제 조건을 다시 지정했다. 좀비는 소유 연결이 없으므로 그 프로퍼티들이 전송되지 않는다. 사망 상태인 `DeathInfo`는 별도로 복제한다.

루트 모션 몽타주의 `RepRootMotion` 복제는 기본 캐릭터에서 끄고 플레이어에서만 다시 켰다. 좀비의 공격 재생 이벤트는 몽타주 에셋 참조와 속도를, 피격 재생 이벤트는 선택 정보와 난수 시드를 보낸다. 몽타주 매니저의 Gameplay Tag와 인덱스 전송은 이 공격·피격 컴포넌트와 별도의 경로다.

상세: [다수 좀비의 서버 비용과 전송량 줄이기](/posts/notd-zombie-horde-cost/)

## 전송 경로

### RPC 스트리밍

퀘스트 진행도, 지도 마커, 지도 안개처럼 플레이어마다 쌓이는 데이터는 접속 시 전체를 보내야 한다. 한 번에 Reliable RPC로 보내면 버퍼를 넘길 수 있어서, 레코드 단위로 나누고 채널의 ACK를 받지 못한 Reliable 번치 수를 보면서 다음 조각을 보냈다. 조각의 바이트 크기까지 제한하는 구조는 아니므로, 레코드 수 제한만으로 버퍼 초과를 항상 막는 것은 아니다.

### 연결별 신뢰성 선택

좀비의 피격 전파는 Multicast 대신 연결마다 거리와 버퍼 상태를 보고 Reliable, Unreliable, 생략 중에서 골랐다.

상세: [Reliable 버퍼 상태를 보고 대용량 데이터 나눠 보내기](/posts/notd-reliable-rpc-data-streaming/)

RPC와 프로퍼티 복제의 순서 문제는 [언리얼 엔진의 리플리케이션 및 RPC 순서 보장](/posts/unreal-engine-replication-rpc-ordering/)에 따로 정리했다.

## 다수 개체

![](./images/notd-multiplayer-optimization/open-world-city.avif)

### 액터 대신 데이터

자연물은 인스턴스드 폴리지로 두고 타격받은 것만 액터로 바꿨다. 파괴된 자연물은 리스폰 매니저의 구조체로만 남는다. 스포너의 좀비는 정수 카운터, 구조체, 풀링 액터 사이를 오간다. 전환할 때는 거리뿐 아니라 추적 중인지, 플레이어 시야 안에 있는지, 스폰 위치로 돌아왔는지도 확인한다. 풀에 남는 메모리와 별개로 월드에서 시뮬레이션하고 복제할 액터 수를 줄이는 방식이다.

상세: [오픈월드의 오브젝트를 액터 대신 데이터로 두기](/posts/notd-world-objects-as-data/)

### 좀비

웨이브의 좀비는 가장 가까운 플레이어와의 거리와 거리 순위로 단계를 나눠 이동 시뮬레이션의 최대 반복 수와 이동 동기화 전송률을 조절했다. 서버의 포즈 갱신은 전투와 유예 시간을 기준으로 켜고, 클라이언트에서는 Significance 값을 Animation Budget Allocator에 넘겼다. 네비게이션 인보커는 기본으로 끄고 조건에 따라 켰으며, 웨이브 좀비의 AI Perception을 제거하고 EQS 결과를 주변 좀비와 공유했다.

상세: [다수 좀비의 서버 비용과 전송량 줄이기](/posts/notd-zombie-horde-cost/)

### 접속 과정

플레이 중 처음 사용할 에셋 일부를 접속 시점에 미리 읽도록 했다. Dedicated Server는 별도의 사전 로딩 목록을 쓴다. 최초 사용 시 로딩을 기다리는 대신 접속 시 로딩 시간과 메모리 유지 비용을 부담하는 선택이다.

상세: [접속 시 레벨 스트리밍 상태 RPC 줄이기](/posts/notd-level-streaming-status-rpc/)

## 공통으로 쓴 방법

주제는 달라도 반복해서 쓴 방법이 몇 가지 있다.

- 한 프레임에 처리하는 수를 고정한다. 리스폰 검사, 좀비 거리 계산, 클라이언트의 폴리지 정리는 프레임당 처리 수를 정해 두고 나눠 처리한다. 거리 순위의 전체 정렬과 순위 기록은 한 바퀴가 끝난 프레임에 남는다. 스폰 데이터 생성은 한 번에 처리하는 수를 제한하고 타이머로 다음 작업을 이어 간다.
- 주기 검사는 틱 대신 타이머로 돌리고 첫 실행을 난수만큼 늦춘다. 같은 종류의 액터가 한 프레임에 몰려 검사하지 않게 한다.
- 서버와 클라이언트가 같은 데이터를 이미 가지고 있으면 그것을 가리키는 값만 보낸다. 데이터 테이블의 ID와 레벨 코드, 몽타주 매니저의 태그와 인덱스 전송 경로가 여기에 해당한다.
- 엔진이 이미 알고 있는 값을 기준으로 삼는다. 전송 속도 조절과 신뢰성 선택은 따로 측정값을 만들지 않고 채널의 미확인 번치 수로 판단했다.

## 참고 자료

- [Replication Graph in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/replication-graph-in-unreal-engine)
- [Networking Overview for Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/networking-overview-for-unreal-engine)
