---
published: 2023-01-31
author: Jihoon Jeon
title: '효율적으로 Blueprint 만들기: Unreal Fest 2022 세션 요약'
description: Unreal Fest 2022의 Making Better Blueprints 세션에서 다룬 그래프 정리, Pure 함수, Tick, 참조, 제작 도구, 재사용과 Actor 통신 원칙을 정리합니다.
category: 언리얼 엔진
tags:
  - blueprint
  - performance
  - architecture
---

Unreal Fest 2022의 [Making Better Blueprints](https://www.youtube.com/watch?v=Od8rzSWv-iE) 세션은 Blueprint 작업을 **Cleanliness, Creation, Classes & Sharing, Communication**이라는 네 가지 관점으로 정리했다.

그래프 정리, Pure 함수의 반복 평가, Tick 남용, hard reference, editor tooling, 통신 결합도를 점검하는 것이 핵심이다. 다만 Tick과 cast를 무조건 피하라는 식의 규칙보다 각 도구의 비용과 책임을 구분해야 한다.

발표 내용을 **4C 순서**로 정리하되, 이를 Epic의 공식 코딩 표준처럼 취급하지는 않는다.

## 발표 요점과 적용 시 주의점

| 주제                               | 적용 범위·주의점                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------- |
| Pure 반환값 caching                | 자동 memoization을 기대하지 말고 비싼 계산은 한 번 실행해 변수에 저장                       |
| Pure 함수와 `For Each`             | 비싼 Pure 결과를 loop에 직접 물리지 말고 **loop 전에** 계산해 저장                          |
| Tick 사용                          | event로 표현할 수 있는 polling은 줄이되 연속 motion·보간은 Tick이 자연스러울 수 있음        |
| Actor Tick 활성화 API              | API 이름은 `SetActorTickEnabled`                                                            |
| `SetTickWhenOffscreen`의 적용 범위 | `UWidgetComponent`의 기능이며 모든 Actor에 적용되는 설정이 아님                             |
| Timeline 비용                      | 활성 Timeline도 update 작업을 하므로 측정 없이 “무료 대안”으로 볼 수 없음                   |
| 큰 Data Table의 reference          | 선택적으로 늦게 읽을 큰 asset에는 적합하지만 항상 필요한 작은 asset은 hard reference도 정당 |
| Blueprint Header View              | 당시 새 editor 도구이며 `.cpp` 구현을 자동 생성하는 기능은 아님                             |
| Construction Script 재실행         | runtime Tick이 아니라 editor transform/property 변화 과정에서 반복 재실행될 수 있음         |
| Actor Tag와 Interface              | Tag는 분류, Interface는 호출 계약이며 Interface가 target을 찾아 주지는 않음                 |

## 1. Cleanliness: 읽기 쉬운 그래프보다 예측 가능한 그래프

### 정리의 목적은 장식이 아니라 변경 비용 줄이기

색상, comment box, node comment, Blueprint bookmark, reroute node는 큰 그래프의 지역과 의도를 빠르게 찾게 해 준다. 팀에서는 색상 자체보다 **같은 의미에 같은 규칙을 쓰는가**가 중요하다.

- variable과 function 이름에 단위와 책임을 드러낸다. `Speed`보다 `WalkSpeedCmPerSec`가 의도를 잘 전달한다.
- comment는 node가 무엇을 하는지 번역하기보다 왜 그 규칙이 필요한지 기록한다.
- 멀리 뻗는 execution wire와 data wire를 줄이고 흐름이 한 방향으로 읽히게 배치한다.
- 자주 돌아오거나 debug할 영역은 bookmark로 남긴다.
- 선택한 node를 무작정 collapse하지 말고 function, macro, collapsed graph 중 의미에 맞는 경계를 고른다.

Math Expression node는 짧은 수식을 한 덩어리로 표현할 때 유용하지만, 복잡한 gameplay 규칙을 숨기는 용도로 쓰면 debug가 어려워진다. 계산의 이름이 필요하거나 여러 곳에서 재사용한다면 function으로 빼는 편이 낫다.

### Function, Macro, Collapsed Graph 고르기

| 도구             | 적합한 경우                                                                     | 제한과 주의                                                                           |
| ---------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Function         | 명확한 입력·출력, 재사용, local variable, override, 작은 단위 test              | 일반 Blueprint function은 latent node를 담지 못함                                     |
| Macro            | 여러 execution 출구, wildcard pin, latent flow처럼 function으로 표현하기 어려움 | compile 때 graph가 확장되므로 큰 macro를 많이 쓰면 generated graph와 debug가 복잡해짐 |
| Collapsed Graph  | 현재 graph만 읽기 좋게 묶고 외부 재사용이 필요 없을 때                          | 진짜 API 경계가 아니므로 이름만 보고 책임을 과대평가하지 않기                         |
| Function Library | instance state가 필요 없는 공용 계산                                            | static 성격이므로 World·owner state를 숨은 global처럼 찾지 않기                       |
| Macro Library    | 여러 Blueprint에서 반복되는 graph pattern                                       | parent class 범위와 expansion 비용을 이해하고 작은 패턴에 한정                        |

[Blueprint Functions](https://dev.epicgames.com/documentation/en-us/unreal-engine/functions-in-unreal-engine)와 [Blueprint Macros](https://dev.epicgames.com/documentation/en-us/unreal-engine/macros-in-unreal-engine)의 차이를 먼저 보고 선택한다.

### Pure 함수는 값이 아니라 계산이다

Pure node에는 execution pin이 없고, 소비하는 impure node가 input을 필요로 할 때 평가된다. 이것을 “한 번 계산된 상수”나 자동 cache처럼 취급하면 안 된다. 같은 결과가 여러 소비자에 연결되거나 loop macro가 매 iteration에 값을 요구하면 비싼 Pure 함수가 반복 호출될 수 있다.

다음 패턴이 특히 위험하다.

```text
비싼 Pure 함수 ──> For Each Loop의 Array
                     └─ loop 내부에서도 같은 Pure 결과를 다시 참조
```

배열 생성, component 검색, 복잡한 query처럼 비용 있는 계산은 loop 전에 한 번 실행해 local variable에 저장한다.

```text
비싼 계산 ──> Local Array 변수 ──> For Each Loop
                        └─────────> 다른 소비자
```

반대로 단순 getter와 작은 수학 연산까지 모두 impure로 만들 필요는 없다. Pure 함수는 side effect가 없고 호출 비용이 작다는 계약을 지킬 때 그래프를 읽기 좋게 한다. 공식 [UFunctions 문서](https://dev.epicgames.com/documentation/unreal-engine/ufunctions-in-unreal-engine)는 Pure 함수의 결과가 cache되지 않으며 연결에 따라 여러 번 호출될 수 있음을 경고한다.

**Validated Get**은 object reference getter와 validity branch를 한 node로 합쳐 null 검사 흐름을 줄여 준다. 그러나 reference가 왜 유효해야 하는지, 누가 lifetime을 소유하는지, network에서 언제 도착하는지까지 해결해 주는 기능은 아니다. 필수 dependency라면 초기화 시점에 검증하고, 선택적 reference라면 invalid 경로가 정상 상태가 되도록 처리한다.

## Tick: 없애는 것이 아니라 책임을 고르기

Tick이 문제인 이유는 호출 자체가 금지돼서가 아니다. 많은 instance가 매 frame 불필요한 polling, search, allocation을 수행하면 총비용이 커지고, 순서 dependency까지 숨기기 쉽기 때문이다.

| 요구                                      | 우선 검토할 수단                                     |
| ----------------------------------------- | ---------------------------------------------------- |
| 매 frame 연속 이동·카메라 보간            | Tick 또는 적절한 movement/component update           |
| 상태가 바뀌었을 때 한 번 반응             | event, delegate, dispatcher                          |
| 일정 간격으로 반복                        | Timer                                                |
| 짧은 시간 동안 curve 기반 보간            | Timeline. 활성 중 update 비용은 여전히 존재          |
| animation·physics 앞뒤의 정확한 실행 순서 | Tick group과 prerequisite                            |
| 일정 시간 뒤 Actor 제거                   | `SetLifeSpan`. Tick 제어가 아니라 lifetime 관리      |
| UI가 화면 밖일 때 update 여부             | Widget Component의 `SetTickWhenOffscreen` 범위에서만 |

Actor Tick을 runtime에 켜고 끌 때 API 이름은 `SetActorTickEnabled`다. `SetActorTickInterval`은 매 frame보다 느린 주기가 충분할 때 쓸 수 있지만 정밀한 scheduler나 wall-clock timer를 대신하지 않는다. `SetTickGroup`, `AddTickPrerequisiteActor`, `RemoveTickPrerequisiteActor`는 순서를 명시할 때 유용하지만 dependency cycle과 지나친 직렬화를 만들지 않게 제한한다.

```text
dumpticks
```

console의 `dumpticks`는 현재 tick 중인 object와 설정을 파악하는 출발점이다. Unreal Insights, `stat game`, Blueprint profiler와 함께 실제 instance 수와 함수 비용을 측정한다. “Actor가 많으니 Tick을 모두 금지”하거나 “간격을 늘렸으니 최적화 완료”라고 결론 내리지 않는다.

Delay를 다시 호출하는 무한 loop는 Timer보다 수명·취소·오류 처리가 불명확해지기 쉽다. 발표에서도 가능한 선택지로 언급했지만 권장 패턴은 아니다. [Gameplay Timers](https://dev.epicgames.com/documentation/unreal-engine/gameplay-timers-in-unreal-engine)와 [Actor Ticking](https://dev.epicgames.com/documentation/unreal-engine/actor-ticking-in-unreal-engine)을 기준으로 선택한다.

### Blueprint lifetime은 `SetLifeSpan`으로 명시할 수 있다

투사체나 일시적 effect Actor는 spawn할 때 수명을 설정해 별도 polling 없이 제거할 수 있다. `SetLifeSpan(0)`은 기존 timer를 지우며 무한 수명으로 돌아간다는 점, destruction은 authority와 replication 수명주기의 영향을 받는다는 점을 함께 고려한다. gameplay state를 가진 Actor를 단순 시간 초과로 없애기 전에는 owner, component, delegate binding 정리 계약을 확인한다.

## Hard reference와 Soft reference는 로딩 정책이다

Blueprint가 다른 Blueprint class, texture, mesh, sound를 hard reference하면 owner를 load할 때 dependency도 함께 load될 수 있다. 참조가 이어지면 작은 gameplay Blueprint 하나가 예상보다 큰 asset tree를 끌어올 수 있다.

Soft object/class reference는 asset을 즉시 가리키는 object pointer 대신 경로를 보관한다. 실제 사용 시 동기 또는 async load를 명시하고, 완료 전·실패·취소·해제 시점을 처리해야 한다.

| 질문                                                  | Hard reference가 자연스러운 경우          | Soft reference가 자연스러운 경우                      |
| ----------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------- |
| owner와 함께 항상 필요한가?                           | 기본 mesh, 필수 animation, 작은 공통 data | 선택 skin, 먼 단계 content, 대형 variation            |
| load 지연을 허용할 수 있는가?                         | 허용할 수 없고 크기가 작음                | loading UI나 async 준비 단계를 둘 수 있음             |
| 참조 선택지가 매우 많은가?                            | 작은 고정 집합                            | 큰 Data Table이나 catalog가 선택적으로 asset을 가리킴 |
| Asset Manager의 bundle·Primary Asset 정책이 필요한가? | 반드시 필요하지 않음                      | `PrimaryAssetId`와 bundle 기반 load가 적합            |

“큰 Data Table이면 무조건 soft reference”가 아니라, table을 load할 때 어떤 dependency가 함께 들어오는지 [Reference Viewer](https://dev.epicgames.com/documentation/en-us/unreal-engine/reference-viewer-in-unreal-engine), Size Map, Asset Audit과 trace로 확인한다. 항상 필요한 작은 icon까지 async로 나누면 코드와 loading state만 복잡해질 수 있다. [Referencing Assets](https://dev.epicgames.com/documentation/en-us/unreal-engine/referencing-assets-in-unreal-engine)와 [Asynchronous Asset Loading](https://dev.epicgames.com/documentation/en-us/unreal-engine/asynchronous-asset-loading-in-unreal-engine)의 lifetime 책임도 함께 적용한다.

## Debugger와 Header View를 실제 작업 흐름에 넣기

Print String만으로 상태를 추적하면 여러 instance와 latent flow에서 호출 순서를 놓치기 쉽다. Blueprint Debugger는 다음 기능을 제공한다.

- breakpoint와 조건부 중단
- variable watch
- Blueprint call stack
- execution trace와 현재 실행 node 표시
- debug 대상 instance 선택

PIE에서 올바른 instance를 선택했는지 먼저 확인하고, breakpoint에서 input, owner, authority, latent state를 본다. network PIE라면 server와 client instance를 구분한다. 공식 [Blueprint Debugger](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-debugger-in-unreal-engine) 문서에서 각 기능을 확인할 수 있다.

Blueprint Header View는 선택한 Blueprint를 동등한 C++ 선언 형태로 보여 주어 class, property, function signature와 metadata를 학습하는 데 유용하다. 하지만 graph body를 production-ready `.cpp`로 자동 변환하거나 성능을 개선하는 nativizer가 아니다. generated declaration을 출발점으로 사용하되 ownership, include, module API, implementation을 C++ 설계에 맞게 다시 작성한다.

## 2. Creation: 반복 가능한 제작 도구 만들기

### Construction Script는 빠르고 멱등하게

Construction Script는 runtime Tick이 아니다. 다만 editor에서 instance property와 transform을 바꾸거나 Blueprint를 compile하고 reconstruction할 때 반복 실행될 수 있다. **Run Construction Script on Drag**가 켜져 있으면 이동 중 여러 번 실행될 수 있다.

같은 입력으로 다시 실행해도 같은 결과가 나오도록 만들고 아래 동작은 피한다.

- 이전 결과를 정리하지 않는 누적 spawn·append
- asset 저장, 파일 I/O, network 요청
- World 전체 Actor 검색
- seed 없는 random
- 다른 Actor property를 양방향으로 변경
- 수백·수천 component를 편집할 때마다 파괴·재생성

Spline을 따라 fence, road, cable을 미리보는 것처럼 editor feedback이 중요한 작업에는 잘 맞는다. 무거운 bake는 `CallInEditor` function이나 Editor Utility로 명시적으로 실행한다. 자세한 lifecycle과 C++ `OnConstruction` 경계는 [Construction Script를 안전하게 사용하는 법](/posts/unreal-engine-construction-script-best-practices/)에 별도로 정리했다.

### Call in Editor, Editor Utility, Geometry Script

| 도구                     | 적합한 범위                                           | 주의사항                                                                 |
| ------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| `CallInEditor` function  | 선택한 Actor의 명시적 rebuild·validate·bake button    | Details button용 function은 input parameter 없이 명확한 transaction 필요 |
| Editor Utility Blueprint | 여러 asset·Actor의 batch 처리, custom editor workflow | packaged runtime 기능이 아니며 editor-only dependency를 분리             |
| Spline Component         | path 기반 배치·보간·미리보기                          | construction 재실행 비용과 generated component 수 측정                   |
| Geometry Script          | dynamic mesh 분석·생성·편집                           | Beta 기능이며 function과 플랫폼별 runtime/editor 지원 확인               |

Geometry Script를 쓴다고 모든 작업이 runtime-safe인 것은 아니다. 특정 함수가 editor subsystem, asset modification, platform feature에 의존하는지 API별로 확인한다. [Geometry Scripting 소개](https://dev.epicgames.com/documentation/en-us/unreal-engine/introduction-to-geometry-scripting-in-unreal-engine)가 범위와 plugin 상태를 설명한다.

## 3. Classes & Sharing: 상속 전에 수명과 소유권 정하기

### 상속은 “is-a”, Component는 재사용 가능한 행동

parent Blueprint의 상태와 virtual event를 파생 class가 특화하는 진짜 **is-a** 관계에는 상속과 override가 적합하다. 그러나 서로 다른 Actor 종류에 “체력”, “상호작용”, “inventory” 행동을 재사용하려고 깊은 상속 tree를 만들면 불필요한 state와 hard dependency가 따라온다.

Actor Component는 owner Actor의 수명 안에서 재사용 가능한 state와 behavior를 묶는다. network에서 component state를 복제하려면 owner Actor가 replicate되고 component도 replication 대상으로 설정돼야 한다. Component를 붙였다는 사실만으로 client에 state가 자동 복제되지는 않는다.

### Data Table, Data Asset, Primary Data Asset

| 데이터 형태          | 선택 기준                                                                          |
| -------------------- | ---------------------------------------------------------------------------------- |
| Data Table           | 하나의 row struct로 표현되는 많은 record, CSV/JSON·spreadsheet 기반 편집           |
| Data Asset           | 개별 이름과 type을 가진 UObject asset, editor에서 복잡한 property와 참조 편집      |
| Primary Data Asset   | Asset Manager가 Primary Asset ID, bundle, scan/load policy로 관리해야 하는 content |
| Config / SaveGame 등 | build 설정 또는 사용자 runtime 저장처럼 asset catalog와 다른 수명                  |

Data Table을 “모든 공유 데이터의 database”로 만들지 않는다. row가 서로 다른 수명과 대형 dependency를 가진다면 Data Asset과 soft reference가 더 자연스러울 수 있다. 반대로 수백 개의 단순 수치 row를 각각 UObject asset으로 만들면 관리 비용이 커진다. [Data-driven Gameplay](https://dev.epicgames.com/documentation/en-us/unreal-engine/data-driven-gameplay-elements-in-unreal-engine)와 [Data Assets](https://dev.epicgames.com/documentation/en-us/unreal-engine/data-assets-in-unreal-engine)를 기준으로 고른다.

### Subsystem은 수명 범위가 명확한 service

UE5에서 공용 service가 필요하면 무조건 GameInstance에 변수를 몰아넣기보다 Engine, Editor, GameInstance, World, LocalPlayer Subsystem의 수명을 비교한다.

- World마다 달라야 하는 runtime service는 World Subsystem 후보
- local player마다 다른 input·UI state는 LocalPlayer Subsystem 후보
- process의 game session 동안 공유하는 service는 GameInstance Subsystem 후보
- editor workflow만 담당하면 Editor Subsystem 후보

Subsystem은 global 잡동사니 보관소나 Actor별 mutable state를 대신하지 않는다. network state도 자동 복제되지 않는다. server authoritative state는 replicated Actor/Component 등 network lifetime이 있는 객체에 두고 subsystem은 조정·조회 service로 제한한다. [Programming Subsystems](https://dev.epicgames.com/documentation/en-us/unreal-engine/programming-subsystems-in-unreal-engine)가 수명 종류를 설명한다.

## 4. Communication: 대상을 찾는 방법과 대화하는 방법 분리하기

Blueprint 통신을 고를 때 먼저 두 질문을 나눈다.

1. **대상을 어떻게 발견하고 유효한 reference를 얻는가?**
2. **그 reference와 어떤 계약으로 대화하는가?**

Tag와 trace는 주로 첫 번째 질문에 답하고, direct call, cast, interface, dispatcher는 두 번째 질문에 답한다.

| 방식                | 적합한 관계                                                    | 장점                                  | 주의점                                                                       |
| ------------------- | -------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------- |
| Direct reference    | owner가 target을 알고 수명이 명확함                            | 가장 단순하고 type-safe               | concrete Blueprint reference가 불필요한 hard asset dependency를 만들 수 있음 |
| Cast                | 이미 가진 object가 특정 구체 type인지 확인하고 그 API가 필요함 | 분기와 typed API 접근이 명확          | cast가 target을 찾지는 않음. 매 frame global search 뒤 cast하는 구조를 피함  |
| Blueprint Interface | 서로 다른 class가 같은 작은 호출 계약을 구현함                 | caller가 구체 class를 몰라도 됨       | reference는 별도로 구해야 하며 state·default implementation을 담지 않음      |
| Event Dispatcher    | publisher 하나의 사건을 여러 listener가 구독                   | publisher가 listener type을 몰라도 됨 | binding owner와 unbind 시점, duplicate binding, listener lifetime 관리       |
| Actor/GamePlay Tag  | object 분류·filter·rule data                                   | data-driven grouping                  | callable API 계약이 아니며 tag 검색 자체가 reference discovery 비용을 가짐   |
| Trace/Overlap       | 공간 query로 현재 대상 발견                                    | world 상태에 맞는 명시적 query        | 무엇을 발견한 뒤 cast/interface/direct call 중 하나를 다시 선택              |

Cast는 그 자체로 나쁜 node가 아니다. 이미 overlap result나 stored reference가 있고 구체 type의 기능이 필요하다면 자연스럽다. 문제는 `Get All Actors Of Class` 같은 World scan을 자주 수행한 뒤 cast하는 구조, 또는 native parent/interface면 충분한데 concrete Blueprint class를 참조해 거대한 dependency를 만드는 구조다. [`Get All Actors Of Class`](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Actor/GetAllActorsOfClass) 문서도 느린 작업이므로 주의하라고 명시한다.

Interface 역시 target을 찾아 주지 않는다. “Tag 검색 대신 Interface”라는 비교는 잘못됐다. spawn 반환값, owner/instigator, component lookup, overlap/trace result, initialization injection, subsystem registry처럼 상황에 맞는 방식으로 reference를 얻고, 그다음 interface contract를 호출한다.

Event Dispatcher는 “무슨 일이 일어났는지” broadcast할 때 적합하다. listener가 publisher보다 먼저 사라질 수 있다면 binding의 수명과 unbind 책임을 명확히 한다. 한 번의 direct command를 보내려고 dispatcher를 쓰거나, 결과가 필요한 synchronous query를 broadcast로 표현하면 흐름이 더 어려워진다. [Actor Communication](https://dev.epicgames.com/documentation/en-us/unreal-engine/actor-communication-in-unreal-engine), [Blueprint Interface](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-interface-in-unreal-engine), [Event Dispatchers](https://dev.epicgames.com/documentation/en-us/unreal-engine/event-dispatchers-in-unreal-engine)가 각 계약을 비교한다.

### Multiplayer에서는 호출 구조와 replication을 별도로 설계하기

Blueprint Interface call이나 dispatcher broadcast가 server state를 client로 전송하지 않는다. gameplay state는 server authority에서 변경하고 replicated property 또는 RPC로 동기화한다. local reference가 client에도 존재하는지, owner connection이 누구인지, call이 어느 machine에서 실행되는지를 따로 확인한다.

- client input → 소유 Actor의 validated Server RPC
- server gameplay state 변경 → replicated property와 RepNotify
- client-only UI 갱신 → local dispatcher 또는 view model
- 모든 peer가 같은 object를 가질 것이라는 가정 → NetGUID, relevancy, spawn timing 검증

통신 node를 깔끔하게 골라도 network authority가 잘못되면 correctness는 확보되지 않는다.

## UE5에서 달라진 두 가지

### Blueprint Header View는 변환기가 아니다

UE 5.1의 Header View는 C++ 선언 학습과 전환할 class의 형태를 살피는 데 유용하지만, generated output을 복사해 build한다고 Blueprint가 자동 전환되는 것은 아니다. module dependency, export macro, include, UObject lifetime, implementation과 test를 수동으로 설계한다.

### Blueprint Nativization은 제거됐다

UE4의 Blueprint Nativization framework는 UE 5.0에서 제거됐다. Header View는 이를 대체하지 않는다. “모든 Blueprint를 자동 C++ 변환”하기보다 다음 순서로 필요한 부분을 고른다.

1. Blueprint profiler와 Unreal Insights로 hot path를 찾는다.
2. 불필요한 Tick, search, allocation, hard load를 먼저 줄인다.
3. stable API와 designer iteration이 필요한 경계를 정한다.
4. 실제 병목인 계산이나 core system만 C++로 옮긴다.
5. Blueprint child와 data asset이 사용할 작고 명확한 API를 노출한다.

[Blueprint와 C++ 비교](https://dev.epicgames.com/documentation/en-us/unreal-engine/coding-in-unreal-engine-blueprint-vs-cplusplus)는 둘을 섞어 각 장점을 쓰는 방식을 권장한다. “Blueprint라서 느리다”보다 어느 function이 얼마나 자주 무엇을 하는지 측정하는 것이 먼저다.

## 실전 점검표

### Graph와 계산

- 이름과 comment가 구현이 아니라 의도와 단위를 설명하는가?
- 비싼 Pure 함수가 여러 consumer나 loop에서 반복 평가되지 않는가?
- function, macro, collapsed graph가 실제 책임과 재사용 범위에 맞는가?
- invalid reference가 정상 분기인지 초기화 실패인지 구분했는가?

### Performance와 reference

- Tick이 연속 update에 필요한가, event·delegate·timer가 더 자연스러운가?
- `dumpticks`, profiler, Insights로 instance 수와 실제 비용을 측정했는가?
- hard dependency tree를 Reference Viewer와 Size Map으로 확인했는가?
- soft load의 loading, failure, cancellation, lifetime을 처리했는가?

### Creation과 architecture

- Construction Script가 반복 실행돼도 같은 결과를 만드는가?
- 무거운 editor 작업은 명시적 command로 분리했는가?
- 상속, Actor Component, Data Table, Data Asset, Subsystem의 소유권과 수명이 맞는가?
- Geometry Script의 Beta 상태와 function별 runtime 지원을 확인했는가?

### Communication

- target discovery와 호출 contract를 분리했는가?
- cast/interface/dispatcher/tag가 서로 다른 문제를 푸는 도구임을 구분했는가?
- World scan을 매 frame 수행하지 않는가?
- binding과 cached reference의 해제·invalid 시점을 처리했는가?
- multiplayer authority, ownership, relevancy, replication을 별도로 설계했는가?

## 결론

더 나은 Blueprint는 wire가 반듯한 Blueprint만을 뜻하지 않는다. 계산 횟수가 예측 가능하고, Tick과 loading policy가 의도적이며, construction이 반복 가능하고, 재사용 단위의 수명과 통신 계약이 명확한 Blueprint가 유지보수하기 쉽다.

Unreal Fest 2022 발표의 4C는 이 질문을 시작하기 좋은 review 틀이다. 다만 “Tick 금지”, “soft reference 필수”, “cast 대신 interface”처럼 도구 하나를 절대 규칙으로 만들지 않는다. **왜 이 object가 존재하고, 언제 load되며, 누가 reference를 가지고, 어느 machine에서 어떤 빈도로 호출하는가**를 답할 수 있어야 한다.

그래프를 정리한 다음 실제 profile을 보고, data와 behavior의 수명을 정하고, 가장 작은 결합으로 target과 통신한다. 그 순서가 Blueprint를 빠르게 만드는 것과 팀이 오래 이해할 수 있게 만드는 일을 함께 해결한다.

## 참고 자료

- [Epic Games: Making Better Blueprints, Unreal Fest 2022](https://www.youtube.com/watch?v=Od8rzSWv-iE)
- [Epic Developer Community: Making Better Blueprints](https://dev.epicgames.com/community/learning/talks-and-demos/76WD/unreal-engine-making-better-blueprints-unreal-fest-2022)
- [Epic Games: Blueprint Best Practices](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-best-practices-in-unreal-engine)
- [Epic Games: UFunctions](https://dev.epicgames.com/documentation/unreal-engine/ufunctions-in-unreal-engine)
- [Epic Games: Actor Ticking](https://dev.epicgames.com/documentation/en-us/unreal-engine/actor-ticking-in-unreal-engine)
- [Epic Games: Gameplay Timers](https://dev.epicgames.com/documentation/unreal-engine/gameplay-timers-in-unreal-engine)
- [Epic Games: Referencing Assets](https://dev.epicgames.com/documentation/en-us/unreal-engine/referencing-assets-in-unreal-engine)
- [Epic Games: Asynchronous Asset Loading](https://dev.epicgames.com/documentation/en-us/unreal-engine/asynchronous-asset-loading-in-unreal-engine)
- [Epic Games: Blueprint Debugger](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-debugger-in-unreal-engine)
- [Epic Games: Blueprint Header View](https://dev.epicgames.com/documentation/en-us/unreal-engine/an-overview-of-the-blueprint-header-view-in-unreal-engine)
- [Epic Games: Construction Script](https://dev.epicgames.com/documentation/en-us/unreal-engine/construction-script-in-unreal-engine)
- [Epic Games: Actor Communication](https://dev.epicgames.com/documentation/en-us/unreal-engine/actor-communication-in-unreal-engine)
- [Epic Games: Data Assets](https://dev.epicgames.com/documentation/en-us/unreal-engine/data-assets-in-unreal-engine)
- [Epic Games: Programming Subsystems](https://dev.epicgames.com/documentation/en-us/unreal-engine/programming-subsystems-in-unreal-engine)
- [Epic Games: UE 5.0 release notes](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5.0-release-notes?application_version=5.0)
