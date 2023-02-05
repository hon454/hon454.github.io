---
title: 효율적으로 블루프린트 만들기 세션 요약
date: 2023-01-31 11:55:00 +0900
categories: [Unreal, Blueprints]
tags: [unreal, blueprints]
typora-root-url: ./..
---

# THE 4 C's

## **C**leanliness

### De-Spaghettification

- Color Coding
- Blueprint bookmarks
- Comments + Node comments
- Collapsing nodes
  - 발표자는 자주 사용 하지 않는다고 한다.
- Math expression node
  - 수학 식을 입력하면 자동적으로 내부에 계산 로직을 구성하는 노드
- Pure vs impure
  - 순수 노드의 반환 값은 캐싱이 되지 않는다.
  - 그러므로 For Each Loop 밖에서 사용하면 안된다.
- Validated gets
  - 특정 타입 변수의 IsValid 와 getter를 결합한 형태의 노드

### Ticking. Why?

- 틱에 너무 의존하지 않는게 좋다.
- 퍼블리싱 시점에서 퍼포먼스가 굉장히 나빠져서 원인을 찾느라 골치가 아파진다.
- 대부분의 경우 오브젝트가 100억개 정도 있으면 그 중에 틱이 정말 필요한 건 5개 정도밖에 없다.



#### Useful Tick settings

- SetActorTickEnable
- SetActorTickInterval
- SetTickWhenOffscreen
- SetLifeSpan
- SetTickGroup
- AddTickPrerequisiteActor
- RemoveTickPrerequisiteActor



#### How do you replace tick?

- 딜레이를 준 루프
  - 추천하지 않으나 엄연한 선택지
- 틱을 비활성하고 타임라인 활용



#### Blueprint Life Span

- 코드 없이 소멸을 처리할 수 있다.



#### Dumpticks

- Tick 관련 디버깅에 사용되는 명령



## Soft references

- 특히 엄청난 항목 수를 갖춘 데이터 테이블을 쓴다면 하드레퍼런스 대신 반드시 소프트레퍼런스를 사용해야 한다.



## Blueprint debugging

- Breakpoints
- Blueprint watch window
- Call stack
- Execution trace



### BP Header tool

- 아직 미완성 플러그인
- BP에 변경이 일어나면 그 과정으로 어떤 헤더파일이 생성되는지 실시간으로 보여주는 툴



## Creation

### Construction Script 

- 여기서 코드를 구성하면 액터에 변경 사항이 생길 때마다 실행이 된다.
- 레벨에서 이동을 시켜보면 매 틱마다 실행이 된다.
- 이게 장단점이 있지만 필요 없을 때도 있으며 다른 함수가 필요할 때도 있다.

### Splines

### Exposed functions

- 디테일 패널에 함수를 호출 할 수 있는 버튼을 노출
- 함수를 에디터 타임에 직접적으로 호출이 가능

### Editor Utility

### Geometry script



## Classes & sharing

### Class inheritance

### Function overrides

### Data tables (strucs and enums)

### Function / Macro Libraries

- 상속을 하지 않는 블루프린트 간에 로직을 공유할 수 있다



## Communication

- Event Dispatching and Binding
- Interfaces
- Tagging
  - GetAllActorsOfClassWithTag 같은 경우에 사용 되나
  - 인터페이스 사용을 권장
- Tracing



## 출처

[효율적으로 블루프린트 만들기 | Unreal Fest 2022](https://www.youtube.com/watch?v=Od8rzSWv-iE)
