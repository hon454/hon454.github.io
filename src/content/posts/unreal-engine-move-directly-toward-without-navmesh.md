---
title: "MoveDirectlyToward가 NavMesh 없이 멈출 때 확인할 것"
published: 2023-05-30
description: "Unreal Engine의 MoveDirectlyToward는 내비게이션을 우회하도록 설계됐지만 이동하지 않을 때가 있습니다. API 계약과 pawn·path following 설정을 기준으로 진단합니다."
image: ""
tags:
  - unreal-engine
  - ai
  - behavior-tree
  - path-following
  - navigation
category: Unreal Engine
draft: true
lang: ko
---

Behavior Tree의 `MoveDirectlyToward`를 사용했는데 NavMesh가 없는 level에서 pawn이 움직이지 않는 현상을 겪었다. 당시에는 “이 task도 NavMesh가 필요하다”고 결론 내렸지만, 현재 공식 API 설명과는 맞지 않는다.

## 확인된 계약

Epic의 `UBTTask_MoveDirectlyToward` 문서는 이 task가 navigation system을 고려하지 않고 goal로 직접 이동한다고 명시한다. 따라서 NavMesh를 추가했더니 우연히 동작했다는 관찰만으로 NavMesh가 필수라고 일반화할 수 없다.

## 적용 범위

`AIController`, Behavior Tree와 path following을 통해 `Character` 또는 custom pawn을 움직이는 UE 프로젝트에 해당한다. 엔진 버전별 task 구현 차이는 exact source revision에서 확인한다.

## 가능한 원인

- AIController가 pawn을 possess하지 않았거나 Behavior Tree가 실행되지 않는다.
- blackboard key가 actor/vector 기대 타입과 다르거나 값이 유효하지 않다.
- pawn의 movement component가 path following 요청을 지원하지 않는다.
- 이동 mode, max speed 또는 input/acceleration 설정이 0이다.
- acceptance radius와 reach test 때문에 시작 즉시 성공 처리된다.
- collision이나 movement constraint가 직선 이동을 막는다.
- 특정 엔진 버전에서 task 또는 custom movement component가 navigation data 존재를 간접 전제로 삼는다.

## 재현 및 진단

1. Behavior Tree debugger에서 task 진입·종료 상태와 blackboard 값을 살펴본다.
2. AIController, pawn, movement component와 path following component의 유효성은 로그로 남겨 둔다.
3. `MoveTo`와 `MoveDirectlyToward`를 같은 goal로 놓고 비교한다.
4. NavMesh 유무만 바꾸고 나머지 actor·collision 설정은 고정해 둔다.
5. task source에서 실제 이동 요청과 failure 조건을 직접 확인해 본다.

## 해결 방법

먼저 possess, blackboard key와 movement component 계약을 고친다. custom pawn이라면 path following이 요구하는 이동 interface를 구현하거나, navigation/path following을 전혀 쓰지 않을 설계라면 custom BT task에서 방향을 계산해 pawn의 movement/input API를 명시적으로 호출한다.

NavMesh를 추가하는 것은 일반 `MoveTo`도 함께 필요하거나 level의 AI 이동 공간을 실제로 정의해야 할 때 선택한다. `MoveDirectlyToward` 하나를 살리기 위한 필수 조건으로 취급하지 않는다.

## 검증 방법

- 빈 level과 NavMesh level에서 같은 pawn을 시험해 본다.
- actor goal과 vector goal, 가까운 거리와 먼 거리를 비교한다.
- success, failure, abort 결과와 실제 이동 거리는 함께 기록해 둔다.
- dedicated server에서 authoritative movement도 확인해 본다.

## 주의점

직선 이동은 obstacle을 우회하지 않는다. NavMesh를 사용하지 않는다는 것은 collision이나 낙하 위험을 자동으로 처리한다는 뜻이 아니다. 현재 초안은 과거 관찰을 바로잡은 진단 가이드이며, 당시 프로젝트의 정확한 custom movement 구현이 없어 하나의 확정 원인으로 좁히지는 않았다.

## 참고 자료

- [Epic Games: UBTTask_MoveDirectlyToward](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/AIModule/UBTTask_MoveDirectlyToward)
