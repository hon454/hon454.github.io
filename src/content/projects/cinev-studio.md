---
title: 'CINEVStudio'
published: 2024-06-25
description: 'Unreal Engine 기반 시네마틱 편집기에서 계층형 데이터 저작, AI 결과 해석·모션 연동, UI와 Subsystem, Shot 상태 모델을 설계하고 구현했다.'
image: ./images/cinev-studio/cover.webp
tags: [unreal-engine, cpp]
draft: false
status: archived
lang: ko
---

## 프로젝트와 담당 역할

**CINEVStudio**는 AI가 구성한 이야기를 3D 장면과 타임라인에서 확인하고 수정하는 **Unreal Engine** 기반 시네마틱 편집기다. 사용자는 캐릭터와 소품을 배치하고 행동·모션·카메라를 편집해 영상을 제작한다.

<iframe class="video-embed" src="https://www.youtube.com/embed/8Pq8nM0Rm-w" title="CINEV Build Storyboard 튜토리얼" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

*장면 편집과 영상 제작 흐름을 보여주는 제품 튜토리얼.*

시나몬에서 2024년 6월부터 2026년 4월까지 클라이언트 프로그래머로 참여했다. 액션 데이터 입력 구조와 AI 결과의 해석·적용, 편집 UI와 공통 서비스, Shot 상태 모델을 개발했다. 콘텐츠를 작성하는 도구와 작성한 데이터를 실행·편집하는 경로를 함께 다뤘다.

액션 데이터를 입력할 때 사람이 직접 맞춰야 했던 조건과 이벤트의 관계를 타입과 에셋 구조에 반영했다. 외부 AI의 생성 결과를 현재 장면에서 실행하고 편집하는 처리도 구현했다. **객체·구조체 인스턴싱**, **Subsystem 수명**, **MovieScene의 프레임 표현**을 각 문제에 맞게 적용했다.

![CINEVStudio의 캐릭터 뷰포트와 액션 타임라인](./images/cinev-studio/studio-editor.webp)

*중앙 뷰포트에서 장면을 확인하고 하단 타임라인에서 편집한다.*

### 실제 콘텐츠 제작 사례

<iframe class="video-embed" src="https://www.youtube.com/embed/NQJT8oN7NGg" title="CINEV Studio를 활용한 무조건 이혼한다 애니메이션 제작 과정" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

*CINEVStudio로 [『무조건 이혼한다』](https://m.comic.naver.com/webtoon/list?titleId=842623)를 애니메이션화하는 과정. [완성 영상 · 네이버 컷츠 1화](https://comic.naver.com/cuts/embed?id=KW-cuts:0-cuts_6502-1).*

### 담당 업무와 활용 기술

| 담당 영역 | 주요 변경 | 활용한 기술 |
|---|---|---|
| [액션 데이터 입력](#data-authoring) | 타입별 조건과 이벤트 설정을 계층적으로 작성 | `DataAsset`, Instanced Struct·`UObject`, `AnimComposite` |
| [AI 행동 해석](#action-interpreter) | 외부 행동 지시를 월드 문맥과 실행 가능한 액션으로 변환 | `Actor`·`Component`, `GameplayTag`, `Executor` |
| [AI 모션 연동](#motion-integration) | 비동기 생성 결과를 타임라인 편집·저장에 통합 | HTTP/JSON, `Delegate`, 약한 `UObject` 참조 |
| [UI 상태 관리](#ui-state) | 화면 구성·선택·입력 처리를 편집 상태별로 분리 | `UUserWidget`, `LayoutSpec`, 자체 `Blackboard` |
| [Subsystem](#subsystems) | 공통 서비스의 수명과 메시지 구독 계약 정리 | `UGameInstanceSubsystem`, `GameplayTag`, 리스너 핸들 |
| [Shot 모델](#shot-model) | 샷 상태의 소유권과 저장·복원 경로 재구성 | `UObject`, `TWeakObjectPtr`, `FGuid`, `FFrameNumber` |

<a id="data-authoring"></a>

## 1. DataTable 중심 입력을 계층형 액션 에셋으로 전환

액션 하나에는 재생할 애니메이션과 구간, 대상 조건, 상호작용 시점이 함께 필요했다. 기존 `DataTable`에서는 애니메이션 ID와 시작·끝 프레임을 입력하고, `Notify`와 테이블의 상호작용 설정을 타입·인덱스로 맞췄다. 문자열 배열인 Context Params에 넣을 값은 별도 소품 설계 문서와 대조해야 했다.

개편의 목표는 콘텐츠 제작자가 기억하고 맞춰야 했던 관계를 입력 구조에 반영하는 것이었다. 모든 조건을 펼쳐 두고 사용 여부를 지정하던 방식에서, 액션에 필요한 조건만 추가하는 방식으로 바꿨다.

### 조건 데이터와 동작 설정에 다른 표현 사용

액션 정의는 `UDataAsset`으로 분리하고, 대상별 요구조건은 `TInstancedStruct` 배열로 구성했다. 서로 다른 조건 타입을 한 목록에 조합하면서 각 타입에 필요한 필드를 편집하도록 했다.

`Notify`와 `NotifyState`에는 Instanced `UObject`인 `Modifier`를 두었다. `DefaultToInstanced`·`EditInlineNew`와 `UPROPERTY(Instanced)`를 사용해 이벤트의 시점과 동작별 설정을 같은 위치에서 편집하게 했다. 조건 값의 조합에는 Struct를, 객체별 동작 확장에는 `UObject`를 사용했다.

```cpp title="조건 데이터와 Notify의 Modifier 필드 발췌"
// 액션의 대상 데이터: 필요한 조건 타입을 조합
UPROPERTY(EditAnywhere, BlueprintReadWrite, NoClear, meta = (ExcludeBaseStruct))
TArray<TInstancedStruct<FCinevActionTargetRequirementBase>> TargetRequirements;

// AnimNotify: 이벤트에 속한 Modifier를 인라인으로 편집
UPROPERTY(Instanced, EditAnywhere, BlueprintReadWrite, meta = (ExposeOnSpawn))
TObjectPtr<UCinevUnitActionModifierBase_WithNotify> UnitActionModifier;
```

서로 다른 두 소유 타입에서 발췌한 필드다. 조건 데이터의 타입 조합과 이벤트 설정 객체의 소유를 구분한다.

![액션 에셋 안에서 대상과 요구조건을 계층적으로 편집하는 프로토타입](./images/cinev-studio/action-asset.webp)

*액션 → 대상 → 요구조건으로 이어지는 입력 구조. 화면의 프로토타입은 `UObject` 기반 조건이며, 이후 구현에서는 `TInstancedStruct`를 사용했다.*

### 작성한 데이터를 실행용 에셋으로 통합

애니메이션 구간과 `Notify`·Curve는 `AnimComposite`에서 편집하게 했다. 원본 `AnimSequence`는 공유하고 액션별 구간과 이벤트는 Composite에 두어, 공유 원본을 수정하지 않고 액션별 설정을 작성하도록 했다.

![AnimComposite에서 모션 구간과 Notify·Curve를 함께 편집하는 화면](./images/cinev-studio/animation-composite.webp)

*테이블에 프레임 값을 따로 기입하던 작업을 애니메이션을 보며 편집하는 위치로 옮겼다.*

| 작성 목적 | 데이터 구조 |
|---|---|
| 액션별 대상·조건 조합 | `DataAsset` + Instanced Struct |
| 이벤트의 동작 설정 | `Notify` + Instanced `UObject` `Modifier` |
| 구간·`Notify`·Curve 편집 | `AnimComposite` |
| 메타데이터 일괄 편집 | `DataTable` 유지 |

이렇게 작성한 데이터를 Generated Data Asset으로 모아 실행 경로에 연결했다. 애니메이션 메타데이터와 이벤트 시각·길이·`Modifier`를 생성 단계에서 정리해, 런타임이 해당 정보를 읽기 위해 애니메이션 에셋에 접근하던 부분을 분리했다.

<img src="/diagrams/cinev-studio/authoring.svg" width="1076" height="528" alt="액션 조건과 AnimComposite의 이벤트 설정, 테이블 메타데이터를 생성 에셋으로 통합하는 구조" loading="lazy" decoding="async" />

*작성 목적에 맞춰 데이터를 나누고 생성 단계에서 실행용 정보로 모은다.*

데이터 타입과 실행 경로 전환, 변환기 구현을 담당하고 전환 절차를 문서화했다. 동료와 도구 작업을 분담했으며, 후속 콘텐츠팀 제작 가이드에도 에셋 작성과 생성 데이터 구축 절차가 반영됐다. 필요한 조건만 조합하고 타입별 필드로 값을 입력하는 흐름을 만들었고, 소품별 값과 컴포넌트 선택에 필요한 문서 참조는 유지했다.

<a id="action-interpreter"></a>

## 2. AI 행동 지시의 해석·실행 계층

외부 AI 서비스가 행동명과 대상을 지정해도 클라이언트에서는 현재 장면에서 실행 가능한 액션을 판단해야 했다. 같은 지시라도 캐릭터의 자세, 소품과 컴포넌트, 점유 상태와 프레임 문맥에 따라 후보가 달라졌다.

팀의 **S2M(Story-to-Movie)** 파이프라인에서 액션 해석·실행 계층의 설계와 구현, 파싱 구조 개선을 담당했다. S2M에 결합된 `MetaAction` 처리를 분리하고, 액션 문맥과 `Executor`를 중심으로 처리 단계를 정리했다.

서비스의 대상 참조를 실제 `Actor`·`Component` 문맥으로 채우고, `GameplayTag`로 식별한 행동과 액션별 요구조건을 현재 월드 상태와 대조했다. 후보를 걸러내는 조건 검사와 점수 평가를 `Functor` 단위로 나눈 뒤, 선택한 액션을 `Executor`와 시퀀스 생성에 연결했다.

<img src="/diagrams/cinev-studio/interpreter.svg" width="1076" height="404" alt="외부 행동 지시를 파싱하고 월드 문맥과 요구조건을 평가해 Executor로 연결한다" loading="lazy" decoding="async" />

*행동 지시를 파싱한 뒤 대상 문맥 구성, 후보 평가, 실행으로 이어지는 처리 흐름.*

샷 JSON 파서도 초기 상태·카메라·블록·섹션 단위로 나누고 타입 검사와 `TOptional` 반환을 도입했다. 외부 입력을 읽는 처리와 월드 상태를 판단하는 처리의 책임을 구분해, 조건 평가와 실행 로직을 개별적으로 확장할 수 있도록 했다.

<a id="motion-integration"></a>

## 3. AI 모션 생성 결과를 편집기에 통합

**T2M(Text-to-Motion)** 요청은 비동기로 완료되고 여러 요청 중 일부만 성공할 수 있었다. 응답의 본 데이터는 프로젝트의 스켈레톤 표현으로 변환해야 했고, 요청이 끝나기 전에 화면이나 프로젝트가 바뀌는 경우도 다뤄야 했다.

HTTP/JSON API 연동과 배치 요청, 부분 성공 집계, 본 데이터 변환을 구현했다. 일부 요청이 실패해도 성공한 결과는 보존하고, 반환된 본 데이터를 런타임 애니메이션에 적용하는 경로를 연결했다.

생성 상태와 결과 목록을 관리하는 계층을 구성하고, 약한 `UObject` 참조 기반 콜백과 `Delegate`로 결과를 편집기에 전달했다. 결과 조회 API와 선택 UI를 연결해 사용자가 생성된 모션을 고르고 타임라인에 적용하게 했다.

<img src="/diagrams/cinev-studio/motion.svg" width="1174" height="404" alt="비동기 모션 생성 결과를 집계하고 본 변환, 선택, 편집 적용과 실패 처리를 나눈다" loading="lazy" decoding="async" />

*성공한 결과의 변환·적용과 실패 처리를 나누고 편집 흐름에 연결한다.*

결과 저장과 Undo/Redo는 프로젝트의 편집 명령 스택에 통합했다. 생성 모션도 다른 편집 작업처럼 적용을 취소하고 다시 적용할 수 있게 했다. API 응답을 받는 것부터 사용자가 선택·편집·저장하는 과정까지 담당했다.

<a id="ui-state"></a>

## 4. CommonUI를 참고한 UI 구성과 상태 관리

일반 상태에서 뷰포트를 클릭하면 캐릭터를 선택하지만, 액션 타깃을 지정하는 중에는 상호작용 대상을 선택해야 한다. 패널 표시와 선택 상태, 키보드·마우스 입력 처리가 함께 바뀌어야 했고, 초기에는 이 책임이 큰 위젯과 UI 관리 계층에 모여 있었다.

**CommonUI**의 레이어·스택 접근을 참고한 팀의 UI 기반 위에서, UI Controller와 편집 State로 화면 구성과 상태 전환 책임을 나눴다. 실제 화면 계층은 `UUserWidget` 기반으로 구현했다.

`LayoutSpec`으로 레이어별 위젯 구성을 기술하고, 위젯 레지스트리에서 `GameplayTag`로 필요한 인스턴스를 조회하게 했다. 상태 진입 처리는 뷰포트 구성, 편집 모드, 입력 전략으로 나누고 이전 상태의 종료와 새 상태의 진입을 연결했다.

<img src="/diagrams/cinev-studio/ui.svg" width="942" height="404" alt="이전 상태 종료 후 화면 구성과 편집 모드, 입력 전략을 설정하고 Blackboard 변경을 전달한다" loading="lazy" decoding="async" />

*편집 상태가 바뀔 때 화면·선택·입력을 함께 구성하고, 공유 상태의 변경을 전달한다.*

선택 관리는 `SelectionManager`로, UI 내부의 공유 상태 전달은 자체 `Blackboard`의 변경 알림으로 정리했다. 기존 동작을 유지하며 상태별 처리를 옮기는 방식으로 전환했다.

새 편집 상태를 추가할 때 필요한 화면과 조작을 상태 단위로 구성하게 됐다. 레이아웃은 화면 구성에서, 선택 동작은 편집 모드에서, 단축키는 입력 전략에서 다룰 수 있도록 처리 위치를 나눴다.

<a id="subsystems"></a>

## 5. Subsystem으로 공통 서비스와 구독 수명 정리

편집 도메인이 UI를 직접 호출하면 서로의 변경과 수명이 얽힌다. 저장·로드 요청과 샷 변경 이벤트를 전달할 공통 계약이 필요했고, 구독자가 종료될 때 등록한 리스너도 정리해야 했다.

`UGameInstanceSubsystem` 기반 메시지 서비스를 도입해 `GameplayTag` 채널과 구조체 payload로 모듈을 연결했다. 구조체 타입을 런타임에 검사하고, 리스너 핸들과 약한 `UObject` 참조를 사용하는 등록 경로를 제공했다. UI Controller의 초기화·종료에 구독의 등록·해제를 맞췄다.

<img src="/diagrams/cinev-studio/subsystems.svg" width="1119" height="528" alt="GameInstance 메시지 Subsystem의 발행, 구독 등록과 해제, 별도 토스트 서비스의 책임" loading="lazy" decoding="async" />

*메시지를 전달하는 서비스의 수명과 이를 사용하는 구독자의 수명을 구분한다.*

저장·로드 요청과 샷 이벤트를 메시지로 이관하고, 이후 토스트 설정과 요청 처리는 전용 `GameInstance` 서비스로 분리했다. `GameInstance`의 공통 서비스, `LocalPlayer`의 UI, `World`의 디버그 도구처럼 기능이 필요한 수명 범위에 맞춰 Subsystem을 활용했다.

모듈 간 직접 호출 일부를 메시지 계약으로 바꾸면서, 연결을 정리하는 시점도 사용하는 객체의 수명에 맞춰 명시했다.

<a id="shot-model"></a>

## 6. Shot 상태 모델과 저장·복원 구조 개편

샷의 초기 상태가 샷 객체와 타임라인 섹션에 나뉘어 있으면 검색·동기화·저장 복원이 복잡해진다. 타임라인의 표시 방식과 별개로 초기 Transform·Visibility·자세·참조 상태를 관리할 주체가 필요했다.

`ShotManager`와 독립 샷 모델을 도입하고 초기 상태의 저장과 조회를 재구성했다. 팀과 진행한 구조 전환에서 샷 관리, 상태 저장·조회, 프레임 문맥과 재계산 흐름을 담당했다.

실행 중 객체 참조는 `TWeakObjectPtr`로 유지하고, 저장할 때는 `FGuid`로 기록해 로드 시 객체 참조로 복원했다. `UObject`로 관리하는 샷 모델과 `MovieScene`/`Sequencer`의 타임라인 표현 사이에서 책임을 나눈 것이다.

<img src="/diagrams/cinev-studio/shot.svg" width="1098" height="528" alt="Shot 모델의 초기 상태 소유와 약한 참조, GUID 저장과 로드 복원, 프레임 범위 처리" loading="lazy" decoding="async" />

*샷 모델이 초기 상태를 관리하고 런타임 참조와 저장용 식별자를 연결한다.*

`FFrameNumber` 기반 프레임 문맥과 범위별 링크 재계산을 샷 단위로 연결하고, 기존 저장 데이터를 읽기 위한 이관 작업도 진행했다. 샷 초기 상태를 관리하는 주체와 참조의 복원 경로를 정리하면서 기존 프로젝트를 새 상태 모델에 연결했다.

## 개발 환경과 협업

GitLab CI의 개발 빌드 아티팩트와 배포 안내, Sentry 크래시 수집, Shared DDC 구성과 엔진 버전 전환에도 참여했다. FBX의 Root Motion 시작 Transform 추출과 데이터 검증·전환 도구를 개발해 반복 입력을 줄였다.

기획·애니메이션·TA·QA와 데이터 규칙과 전환 절차를 공유하고, Rider와 AI 보조 개발 도구의 활용 경험을 팀에 전파했다. 연말 타운홀에서는 ‘GitLab 개발왕’으로 선정됐다.
