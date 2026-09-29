회사와 프로젝트별 담당 범위, 기술적 판단과 문제 해결 과정을 상세히 설명하는 경력기술서(CV)입니다. 게임과 제작 도구 개발부터 군 복무, 교육, 외부활동과 오픈소스 기여, 학력과 자격까지 전체 이력을 이 문서에서 관리합니다.

주요 경력과 핵심 역량을 빠르게 살펴보려면 [이력서](/resume/)를, 대표 작업의 화면과 영상, 공개 코드와 기여 내용을 보려면 [포트폴리오](/portfolio/)를 참고해 주세요.

## 시나몬

2024.06 - 2026.08 / 정규직 / 클라이언트 프로그래머

AI 애니메이션 제작 서비스 CineV의 3D 제작 도구를 개발했습니다. Unreal Engine 5 기반 CINEVStudio에서 액션 데이터와 AI 결과 해석, 편집 UI와 Shot 모델을 담당한 뒤, 후속 제품 Shotloom에서 Rust와 Bevy 기반 브라우저 편집기의 편집과 저장 구조, 생성 서비스 연동을 개발했습니다.

### Shotloom

2026.04 - 2026.08 / Rust, Bevy, WebAssembly, WebGPU, React, TypeScript, Tauri

CINEVStudio 후속 개발의 속도를 높이기 위해 AI 에이전트를 개발 과정 전반에 활용하는 AI Native 방식으로 전환한 프로젝트입니다. 사용자별 서버 GPU 세션에 의존하던 Unreal Engine과 Pixel Streaming 경로를 브라우저 우선 편집기로 대체하는 것이 목표였습니다. 브라우저에서 캐릭터의 동작과 카메라를 편집하고, 결과를 CineV와 SceneGen의 제작 과정으로 연결하는 초기 개발에 참여했습니다.

기술 스택 선정과 초기 저장소, 문서 구성은 팀이 담당했습니다. 저는 캐릭터와 카메라 편집, 문서 모델, 저장과 복원, 생성 서비스 연동을 개발했습니다.

#### 문서 모델과 편집 트랜잭션

캐릭터 자산을 가리키는 참조와 장면에 배치된 편집 대상의 ID를 구분했습니다. React는 버전을 가진 명령과 이벤트 계약으로 편집 의도를 주고받고, Rust 코어는 문서와 검증을, Bevy는 실행과 렌더링을 담당하도록 연결했습니다. 명령이 거절되거나 시간 초과, 외부 서비스 실패가 발생해도 UI와 런타임, 저장 상태가 어긋나지 않도록 트랜잭션과 롤백을 적용했습니다.

드래그 중 지나가는 모든 값을 되돌리기 이력에 넣지 않고, 시작 상태와 확정 결과를 한 번의 트랜잭션으로 기록했습니다. 자산 등록과 편집 대상 생성도 같은 트랜잭션에 묶었습니다. 스냅샷은 변경하지 않은 데이터를 공유하는 영속 자료구조로 구성해 문서 전체를 매번 복사하는 비용을 줄였습니다.

파일 저장과 OPFS 복구 데이터의 결과 및 오류를 구분하고, 선택한 대상이나 패널 상태를 문서 본문과 분리했습니다. 캐릭터, 포즈 후보, 클립과 카메라 키를 저장한 뒤 다시 열어 편집 상태가 복원되는 것을 확인했습니다.

#### 생성 데이터와 서비스 통합

S2M 입력을 파싱하고 장면 기본 구조와 카메라 템플릿, 자산을 연결하는 공유 Rust 번들 컴파일러를 구현했습니다. 브라우저 프리뷰와 CLI, 서비스가 같은 `.shotloom` 번들과 Rust 타임라인 코어를 사용해 동일한 장면 구성 및 검증 정책으로 동작하도록 하고, 네트워크와 파일 접근은 환경별 어댑터로 나눴습니다.

Text2Pose 결과를 후보 조회, 선택, 클립 적용과 저장으로 연결했습니다. 카메라와 포즈의 키프레임 모델, 평가기, 편집 UI와 저장 형식을 함께 전환했습니다. 카메라는 회전 횟수를 보존하는 오일러 각을, 관절 포즈는 방향 사이를 보간하는 Quaternion을 사용했습니다.

CineV에서 장면을 열어 편집하고 SceneGen 생성 결과의 마지막 프레임 이미지를 스토리보드로 보내는 흐름을 구현했습니다. 생성과 결과 저장을 별도 작업으로 다뤄 저장 실패 시 같은 결과를 다시 전송하도록 했습니다. 이 통합에서 CineV로 반환하는 대상은 결과 이미지입니다.

#### AI 에이전트 활용과 검증

개인 오픈소스 Grimoire를 포함한 에이전트 개발 환경을 저장소 초기부터 운용하며 요구사항을 Linear 이슈, 명세, ADR과 테스트로 구조화하고 계획, 구현, 검증과 PR을 하나의 흐름으로 연결했습니다. 여러 계층을 바꾸는 작업은 의존 관계와 완료 기준으로 나눠 구현과 독립 검토를 진행하고, 단위 테스트와 브라우저 실행을 각각 확인했습니다. 개인 변경 기준 주간 병합 빈도는 평균 16.1건으로, CINEVStudio 기간 평균 8.2건의 약 2배였습니다.

Rust 엔진 CI 작업이 보관하던 1.84GB의 target 아카이브를 684MB의 sccache로 교체해 캐시 크기를 약 63% 줄였고, warm CI에서 374건의 컴파일이 모두 캐시에 적중하는 것을 확인했습니다. Linux headless WebGPU 테스트가 준비 이벤트 이후의 오류까지 확인하도록 보완해 거짓 통과를 제거했습니다. 타임라인 스크럽은 진행 중인 요청 하나와 최신 대기 입력 하나만 유지하도록 바꿔 오래된 입력이 쌓이지 않게 했습니다.

브라우저 편집기의 화면이 검게 변하는 문제는 VRM 렌더링 라이브러리 bevy_vrm1의 셰이더 결함으로 추적해 수정했고, 해당 수정을 [라이브러리에 기여](https://github.com/not-elm/bevy_vrm1/pull/57)한 뒤 동료와 함께 편집기에 반영했습니다.

[저장 복원, 제작 과정과 검증 범위](/projects/shotloom/)

<a id="cinev-studio"></a>

### CINEVStudio

2024.06 - 2026.04 / Unreal Engine 5, C++, UMG, Sequencer, MovieScene, HTTP, ONNX

CINEVStudio는 AI가 구성한 장면을 사용자가 편집하고 영상으로 출력하는 UE5 기반 제작 도구입니다. 콘텐츠팀의 액션 데이터 작성부터 AI 결과 해석, 타임라인 편집, 저장과 재생까지 연결하는 클라이언트 개발을 담당했습니다.

#### 액션 데이터 작성과 실행 구조

기존에는 DataTable의 애니메이션 ID와 구간, Notify의 상호작용 설정을 타입과 인덱스로 맞추고 문자열 파라미터를 별도 설계 문서와 대조해야 했습니다. 액션에 필요한 조건을 타입별로 추가하고 해당 필드를 입력할 수 있도록 데이터 구조를 바꿨습니다.

액션 정의를 `UDataAsset`으로 분리하고 요구조건을 `TInstancedStruct` 배열로 구성했습니다. `Notify`와 `NotifyState`에는 Instanced `UObject`인 Modifier를 두어 이벤트 시점과 동작 설정을 함께 편집하도록 했습니다. 애니메이션 구간과 이벤트는 `AnimComposite`에서 작성하고 실행 데이터를 에셋으로 생성했습니다.

저는 데이터 타입과 실행 경로 전환, 변환기 및 전환 절차 문서화를 담당하고 동료와 도구 작업을 분담했습니다. 제작자가 기억하고 맞추던 조건 관계를 입력 구조에 반영했으며, `Unit Action Data Validator`로 데이터 정합성을 검사하고 오류 내역을 보고서로 출력하도록 했습니다. FBX 원본에서 Root Motion 시작 Transform을 자동으로 추출하는 절차를 만들어 수동 입력을 대체하고, 사용하지 않는 로직과 데이터 구조를 조사해 제거했습니다.

#### AI 행동 해석과 모션 생성 연동

외부 서비스가 지정한 행동과 대상을 현재 월드에서 실행할 수 있는 액션으로 바꾸는 해석 계층을 설계하고 구현했습니다. Actor와 Component 문맥, 캐릭터의 자세, 소품 점유 상태, NavMesh 경로를 바탕으로 후보를 검사하고 점수를 계산한 뒤 Executor와 시퀀스 생성으로 연결했습니다.

시작 위치 검증과 경로 점수 계산을 한 경로로 모아 중복 순회를 제거했습니다. 후보 탈락 사유와 점수 기여도를 기록해 어떤 조건 때문에 액션이 선택되거나 제외됐는지 확인하도록 했습니다.

Text-to-Motion 연동에서는 요청을 배치로 나눠 병렬 처리하고 일부 요청이 실패해도 성공 결과를 보존했습니다. ONNX 본 데이터를 자체 스켈레톤 표현으로 변환하고, 약한 UObject 참조와 Delegate로 살아 있는 편집 객체에 결과를 전달했습니다. 생성된 모션을 선택해 타임라인에 적용하고 Undo/Redo와 저장, 복원까지 이어지는 경로를 구현했습니다.

#### Shot 상태와 편집 결과의 재현

샷의 초기 상태를 독립 Shot 모델이 관리하도록 저장과 조회 구조를 정리했습니다. 실행 중 객체는 `TWeakObjectPtr`로 참조하고 저장할 때는 `FGuid`로 기록해, 로드할 때 실제 객체 참조로 복원했습니다. 프레임 문맥과 영향 범위의 재계산을 샷 단위로 연결하고 기존 저장 데이터의 이관을 진행했습니다.

Root Motion을 actor-space 기준으로 베이크하고 재생 속도, loop, frame offset이 바뀌면 키를 다시 계산했습니다. 카메라 orbit에는 Quaternion 기반 구면 이동과 충돌, pole 제한을 적용해 반경 손실과 수직 회전 뒤집힘을 해결했습니다.

#### 편집 UI와 공통 서비스

일반 상태에서 뷰포트를 클릭하면 캐릭터를 선택하지만 액션 대상 지정 중에는 상호작용 대상을 선택해야 하는 것처럼, 같은 입력이 편집 상태에 따라 다르게 동작해야 했습니다. UI Controller와 편집 State로 화면 구성과 상태 전환 책임을 나누고, 이전 State를 종료한 뒤 새 State가 레이아웃과 선택 모드, 입력 전략을 설정하도록 했습니다. 새 편집 기능은 큰 위젯의 분기 대신 State 단위로 추가했습니다.

UI 공유 상태는 자체 Blackboard의 변경 알림으로 전달해 컴포넌트 간 직접 참조를 줄였습니다. Common Button, Common Modal, Common Context Menu와 Toast 메시지를 공통 모듈로 개발했습니다. 저장과 로드 요청, 샷 변경 이벤트는 `UGameInstanceSubsystem` 기반 메시지 서비스로 전달하고, 구독 등록과 해제를 UI Controller의 수명에 맞춰 중복 구독을 막았습니다.

#### 빌드 환경, 엔진 이전과 자동화

GitLab Runner 기반 빌드와 패키징 환경을 구축해 Artifact와 Shared DDC, Symbol Store와 Sentry 크래시 수집, Slack 알림을 구성했습니다. 개발 빌드를 기획과 QA가 직접 내려받아 검증할 수 있도록 배포 안내를 제공했습니다. Unreal Engine 5.3에서 5.7로의 마이그레이션에서 API 변경과 서드파티 플러그인 호환성 문제를 해결했습니다.

Shipping 빌드에서 외부 `Game.ini` override가 제한되고 설정이 삭제되는 원인을 추적했습니다. `Dev.ini`를 바탕으로 임시 `UserDir` 실행 환경을 만드는 런처를 구현해 원본 설정을 보존했습니다. Headless Commandlet과 Remote Control API로 편집과 렌더링을 자동화했습니다.

기획, 애니메이션, TA, QA와 데이터 규칙과 전환 절차를 공유했습니다. JetBrains Rider와 AI 보조 개발 도구의 활용 방식을 팀에 공유해 팀 대부분이 Visual Studio에서 Rider로 전환했고, 연말 타운홀에서 GitLab 개발왕으로 선정됐습니다.

[데이터 구조, 도식과 구현 예시](/projects/cinev-studio/)

<a id="teamsparta"></a>

## 팀스파르타

2024.12 - 2025.07 / 프리랜서, 정규직과 병행 / 튜터

### 언리얼 게임 개발 코스

Unreal Engine, C++

내일배움캠프 언리얼 게임 개발 코스에서 수강생의 학습과 프로젝트 개발을 지원했습니다. ZEP 온라인 학습 공간에서 질의응답과 학습 상담을 진행하고, 과제와 팀 프로젝트의 코드를 리뷰했습니다.

취업 준비 단계에서는 이력서와 포트폴리오에 피드백을 제공하고 모의 면접을 진행했습니다. 담당 최종 프로젝트 팀과 수강생이 각각 최우수 팀과 최우수 수강생으로 선정됐습니다.

## 작두스튜디오

2021.01 - 2024.06 / 정규직 / 클라이언트 프로그래머

### Night of the Dead

Unreal Engine 4/5, C++, Windows Server, Unreal Insights, EOS, Steamworks, TeamCity

오픈월드 생존 게임의 전투, 장비, 좀비 AI와 멀티플레이 동기화, 런타임 최적화를 담당했습니다. 얼리 액세스 기간의 업데이트부터 2024년 5월 1.0 정식 출시까지 참여했습니다.

#### 복제 대상과 전송 데이터 최적화

Windows Server 기반 Dedicated Server에서 Unreal Insights로 분석하며 복제 대상 선정, 배열 변경분 전송과 직렬화를 최적화했습니다. 공간상 가까운 액터 외에도 소유 관계에 따라 전달해야 하는 상태가 있어 복제 조건을 나눴습니다.

Replication Graph에서 공간과 거리로 연결별 후보를 수집하고, 오너와 팀, 그룹에 종속된 액터는 해당 연결에 거리와 무관하게 포함했습니다. 장착 장비, 탑승 대상과 무기 부속품은 부모 액터가 복제될 때 함께 검토하도록 구성했습니다. 전역 매니저는 Always Relevant 노드에, 휴면 액터는 별도 노드에 두어 상태에 맞게 처리했습니다.

플레이어 인벤토리, 버프와 디버프, 퀘스트 진행도는 배열이 크고 지속적으로 갱신되는 데이터였습니다. Fast TArray Replication으로 항목의 추가, 변경과 삭제를 델타 동기화하고, 커스텀 NetSerialize로 조건에 맞는 데이터 표현을 사용했습니다. 대상 선정과 변경분 전송을 구분해 반복 검사와 전송 비용을 줄였습니다.

RPC 기반 대용량 데이터 스트리밍을 구현하고, Epic Online Services 세션을 게임의 멀티플레이 개설 및 접속 과정에 연결했습니다.

#### 게임플레이와 다수 개체 처리

근거리, 원거리, 투척 무기의 장착 구조와 능력치, 버프 및 디버프를 구현했습니다. 장비의 티어, 희귀도, 내구도, 파츠 개조와 재조립, 고유 장비, 코스튬과 형상변환 DLC, 보스 및 일반 좀비 AI, 던전과 전투 UI를 개발했습니다.

다수 좀비의 애니메이션 부하에는 Animation Budget Allocator, Significance Manager와 AnimURO를 적용 대상별로 운용해 업데이트 비용을 줄였습니다. ACL로 애니메이션 데이터를 압축하고, Tick과 네비게이션 인보커 비용을 줄이며 에셋 사전 로딩과 위젯 풀링을 구현했습니다. 커스텀 Destructible Mesh와 Instanced Foliage 리스폰, 월드 상호작용을 구현했습니다.

#### 엔진 이전과 개발 인프라

UE4에서 UE5로의 마이그레이션과 PhysX에서 Chaos로의 전환에 참여했습니다. Chaos Destructible의 성능 제약을 분석하고 커스텀 Destructible 시스템을 구현해 다수 오브젝트의 파괴 연출을 처리했습니다.

Jira, Confluence, Slack을 대체하기 위해 JetBrains Space On-Premise 서버를 구축해 운영하고, TeamCity On-Premise로 빌드와 패키징 자동화를 구성했습니다. Nginx와 Certbot으로 회사 서버에 공개 도메인과 인증서를 관리하고 Shared DDC를 운영했습니다. Steamworks 업적을 연동했습니다.

[업데이트별 담당 업무와 공개 출시 기록](/projects/night-of-the-dead/)

## 삐요 스튜디오

2021.10 - 2023.12 / 비고용 팀 활동, 정규직과 병행 / 인디 게임 개발자

<a id="other-experience"></a>
<a id="a-street-cats-tale-2"></a>

### 길고양이 이야기 2

Unity, C#, Steamworks, STOVE SDK

2D 퍼즐 어드벤처의 클라이언트 개발에 참여했습니다. 세이브와 로드, 퀘스트, 대화, 이동, 컷신, 환경설정과 UI 등 주요 시스템을 개발했습니다. PlayStation, Nintendo Switch, Xbox 컨트롤러 입력과 Steamworks 업적, STOVE 구매 인증을 연동했습니다.

Synology NAS에 GitLab 저장소 서버를 구축했습니다. 다국어 빌드 준비와 출시 빌드 검수, 대응에 참여해 2023년 2월 STOVE Windows 얼리 액세스와 6월 Steam Windows, macOS 정식 출시를 경험했습니다. 프로젝트는 텀블벅 펀딩 목표를 초과 달성하고 도쿄 게임쇼 2023에 참가했으며, G-STAR 2023 Indie Awards의 Games for Impact를 수상했습니다.

[PC 출시와 전시, 수상 자료](/projects/a-street-cats-tale-2/)

<a id="nurhyme"></a>

## 누라임게임즈

2020.07 - 2020.08 / 인턴 / 게임 개발자

### Brutal League

Unity, C#, GameSparks

Android용 격투 테마 방치형 게임 Brutal League의 클라이언트 개발을 전담했습니다. 캠페인 모드를 구현하고 GameSparks를 활용해 보상 시스템과 서버 연동을 개발했습니다.

[담당 기능과 개발 기록](/projects/brutal-league/)

## 이메진 템페스트 스튜디오

2019.06 - 2020.04 / 비고용 팀 활동 / 인디 게임 개발자

### Vapor World

Unity, C#, Spine, URP

2D 사이드 스크롤 액션 어드벤처 팀에서 기획과 클라이언트 개발을 맡았습니다. 환자들의 내면 세계를 탐험하는 게임의 스토리와 세계관을 구성하고, 입력, 이동과 전투 시스템을 구현했습니다. Unity 2D Light와 URP를 활용한 출품 빌드 제작에 참여했습니다.

참여 기간 중 프로젝트가 제11회 새로운 경기 게임오디션 공동 2위에 선정됐고, MWU Korea Awards 2019 PC & Console 분야 Top 3에 올랐습니다.

[출품 영상과 개발 기록](/projects/vapor-world/)

<a id="army-software"></a>

## 육군

2018.03 - 2019.10 / 군 복무 / SW개발병

### 프로그램 개발과 시스템 운영

C#, WPF, VBA

전문특기병인 SW개발병으로 지원 및 복무하며 기존 프로그램을 C#과 WPF 기반으로 이식 개발하고, VBA로 엑셀 데이터를 정리하는 프로그램을 만들었습니다.

육군 지휘통제시스템의 장애 대응과 운영을 담당했으며, 응용체계관리반 분대장으로 임명되어 분대장 임무를 수행했습니다. SW 및 회의 지원으로 우수상을, 을지태극훈련 지원으로 표창을 받았습니다.

<a id="clicked"></a>

## 클릭트

2016.07 - 2018.02 / 정규직 / VR 소프트웨어 엔지니어

Unity 기반 VR 콘텐츠와 클라이언트/서버 기능을 개발했습니다. HTC Vive 트래커의 정보를 소켓 통신으로 수신하는 기능을 구현하고, 장치 간 위치와 자세 데이터를 VR 체험에 연결했습니다.

### CircleVR

2017.06 - 2018.02 / Unity, C#, Gear VR, HTC Vive Tracker

여러 사용자가 동시에 체험하고 각 시점을 22대의 곡면 디스플레이에 공유하는 무선 VR 전시 시스템입니다. Gear VR 클라이언트를 외부 Vive Tracker의 6DoF 좌표계에 맞추고 장착 오프셋을 보정했습니다. 4개의 내부 콘텐츠를 제작해 홍익대학교 VR 뮤지엄 전시관에 설치했습니다.

[전시 영상과 개발 기록](/projects/circle-vr/)

### Space Walker

2017.05 - 2017.06 / Unity, C#, Perception Neuron, GPU 파티클, onAirVR

홍익대학교 영상대학원과 산학협력으로 개발한 VR 공연 콘텐츠의 3D 배경 인터랙션을 구현했습니다. 다수의 파티클을 실시간으로 처리해야 하는 상황에서 성능 부담을 줄이기 위해 GPU 파티클 시스템을 적용했습니다.

Perception Neuron의 전신 모션을 Unity Humanoid 아바타에 실시간으로 적용하고 좌표축 차이를 보정했습니다. onAirVR로 VR 서버의 렌더링 결과를 무선 전송하는 팀의 콘텐츠는 Unite ’17 Seoul 키노트 오프닝 공연으로 시연됐습니다.

[공연 영상과 개발 기록](/projects/space-walker/)

### 학도병의 편지

2017.05 - 2017.06 / Unity, C#, HTC Vive

HTC Vive 기반 인터랙티브 무비 VR 콘텐츠를 제작해 충남보훈관 VR 코너에 전시했습니다.

[전시 화면](/projects/student-soldiers-letter/)

### onAirVR

Unity, C#, OVR API, GoogleVR API

PC 렌더링 결과와 모바일 HMD의 자세 및 입력을 연결하는 스튜디오 클라이언트와 세션별 카메라 리그를 구현했습니다. 2017년 1월부터 5월까지 진행한 Client 2.0에서는 UI 개선, OVR API 대응과 Daydream용 GoogleVR API 연동을 담당하고 사내 콘텐츠 3개를 데모로 제작했습니다.

[onAirVR Client 2.0 시연과 개발 기록](/projects/onairvr-client-2/)

### #BeFearless - Fear of Heights

2016.06 - 2016.12 / Unity, C#, Gear VR, Oculus Go, Gear S2

삼성 #BeFearless 캠페인의 고소공포증 훈련 VR 앱을 외주로 개발했습니다. Landscapes와 Cityscapes 두 빌드를 제작하고, Gear S2 스마트워치의 심박수 데이터 연동과 다국어 시스템을 개발했습니다. Gear VR과 Oculus Go를 지원해 Oculus Store에 두 앱을 등록했습니다.

[캠페인 영상과 개발 기록](/projects/be-fearless/)

<a id="webzen"></a>

## 웹젠

2015.12 - 2016.01 / 인턴 / 게임 디자이너

### 해녀와 바다

Unity, C#

국내 스낵컬처 게임 시장을 조사하고 분석 보고서를 작성했습니다. 교육용 게임 '해녀와 바다'의 제안서와 Unity 프로토타입을 제작하며 시장 조사에서 게임 제안과 시연용 구현까지 진행했습니다.

[시연 영상과 제안서](/projects/haenyeo-and-the-sea/)

<a id="bitmango"></a>

## 비트망고

2014.07 - 2014.08 / 인턴 / 게임 디자이너

### 모바일 게임 4종

모바일 게임 Slots, SAMURAI STEPS, Pitter Patter, DRAWLINE의 제작에 참여했습니다. 레벨과 콘텐츠 디자인, 사운드 발주와 QA를 담당했습니다.

## 외부활동

### 아주대학교 미디어프로젝트 자문 및 멘토

2023 - 2026 / 5개 학기 참여

미디어프로젝트 수업의 자문과 멘토 활동에 참여해 학생 프로젝트에 피드백을 제공했습니다. 참여 학기는 2023년 2학기, 2024년 2학기, 2025년 1학기와 2학기, 2026년 1학기입니다.

### 스파르타 게임잼 심사위원

2025.08.15 - 2025.08.17

스파르타코딩클럽이 주최한 게임잼의 심사위원으로 참여해 출품 프로젝트를 평가했습니다.

### 아주대학교 VR Studio 학부생 TA

2020.09 - 2020.12

VR Studio 수업의 학부생 TA로 참여했습니다.

## 오픈소스와 개발 도구

반복되는 개발 작업을 도구로 만들어 공개하고 있습니다. 결과물과 화면은 [포트폴리오](/portfolio/#open-source)에, 상세 사례는 [전체 프로젝트 기록](/projects/)에 정리했습니다.

### 유지관리 프로젝트

**[Grimoire](https://github.com/hon454/grimoire)** / Python, Codex Skills, Codex Plugins, GitHub CLI, Git

코드 리뷰와 리뷰 대응, 이슈 준비도 판단, 작업 인계와 Git 운영처럼 반복되던 개발 업무를 재사용 가능한 Skill과 Plugin으로 구성했습니다. PR 맥락 수집부터 피드백 분류, 사용자 의사결정, 구현과 검증, 리뷰어 후속 대응까지 하나의 흐름으로 연결하고, 원격 변경은 사용자 확인과 검증을 통과한 뒤에만 수행하도록 했습니다. 작업 인계와 Git 정리처럼 실수 비용이 큰 작업에는 대상 재검증과 실패 시 중단하는 보호 장치를 두고 Python 표준 라이브러리 기반 테스트로 검증합니다.

**[Copy Selection Context](https://github.com/hon454/copy-selection-context)** / Kotlin, IntelliJ Platform SDK, Gradle, JUnit 5, GitHub Actions

선택한 코드의 파일 경로와 줄 번호를 함께 복사하고 여러 파일의 문맥을 모아 전달하는 JetBrains 플러그인입니다. 다중 caret, 사용자 정의 템플릿, 복사 이력과 GitHub, GitLab permalink를 지원합니다. GitHub Actions에서 빌드와 호환성 검증, 릴리스와 서명된 Marketplace 배포를 자동화해 [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/30262-copy-selection-context)에 배포했습니다.

**[GitHub Pulls Show Reviewers](https://github.com/hon454/github-pulls-show-reviewers)** / TypeScript, WXT, React, GitHub REST API, Vitest, Playwright

GitHub PR 목록에 요청된 리뷰어와 팀, 최신 리뷰 상태를 표시하는 Chrome 확장 프로그램입니다. 공개 저장소의 익명 조회와 GitHub App 기반 비공개 저장소 접근을 지원하고, 페이지 단위 API 배치와 행 단위 캐시로 GitHub의 화면 갱신 중에도 표시를 유지합니다. [Chrome Web Store](https://chromewebstore.google.com/detail/github-pulls-show-reviewe/hoocgjopdboeghdkfjlkngkkpbiljggk)에 배포했습니다.

### 외부 기여

**[Firefly](https://github.com/CuteLeaf/Firefly)** / Astro, Svelte, TypeScript

이 블로그가 사용하는 정적 블로그 테마입니다. [GitHub 저장소 카드](https://github.com/CuteLeaf/Firefly/pull/588)를 빌드 시점 캐시로 전환해 API 장애와 사용량 제한에 대응하고, [Mermaid 렌더러](https://github.com/CuteLeaf/Firefly/pull/584)를 Node.js 기반 최신 버전으로 이전하며 기존 테마의 출력 형태를 유지했습니다. [카테고리 바 휠 스크롤](https://github.com/CuteLeaf/Firefly/pull/613)의 누적 이동 손실과 입력 지연을 제거하고, 페이지별 `<head>` 콘텐츠가 최상위 레이아웃으로 전달되지 않던 [슬롯 구조](https://github.com/CuteLeaf/Firefly/pull/587)를 수정했습니다. 설치와 구성, 배포와 Markdown 확장 기능을 다룬 [한국어 문서](https://github.com/CuteLeaf/Firefly/pull/583)를 작성했습니다.

**[bevy_vrm1](https://github.com/not-elm/bevy_vrm1)** / Rust, Bevy, WGSL, WebGPU

Chrome WebGPU에서 MToon VRM이 표시된 직후 화면 전체가 검게 변하지만 Metal 네이티브에서는 나타나지 않는 문제를 재현하고, 조명 단계별 비교로 원인을 emissive 처리에 격리했습니다. MToon의 `EMISSIVE_TEXTURE` 비트가 Standard Material 플래그와 충돌해 미정의 값을 읽고 바인딩되지 않은 텍스처를 샘플링하면서 NaN이 톤매핑과 Bloom으로 전파되는 것을 확인했고, WGSL이 MToon uniform의 플래그를 읽도록 [수정](https://github.com/not-elm/bevy_vrm1/pull/57)했습니다.

## 수상 및 선정

- **G-STAR 2023 Indie Awards - Games for Impact** / 길고양이 이야기 2 / 2023.11
- **제11회 새로운 경기 게임오디션 공동 2위** / Vapor World / 2019.09
- **MWU Korea Awards 2019 PC & Console 분야 Top 3** / Vapor World / 2019
- **육군 SW 및 회의 지원 우수상, 을지태극훈련 지원 표창** / 2019.06
- **아주대학교 문화콘텐츠 창작 공모전 금상** / 新승람도 / 2014.06
- **KBS 꿈의 기업 입사 프로젝트 스카우트 위메이드 게임기획자 최종 4인** / 2013.06
- **선린인터넷고등학교 디지털 콘텐츠 경진대회 응용소프트웨어 부문 은상** / ELOPE / 2012.12
- **네오위즈인터넷 음악 게임, 서비스 공모전 최종 6팀** / 2012.10
- **선린인터넷고등학교 디지털 콘텐츠 경진대회 응용소프트웨어 부문 동상** / RythM_Eister / 2011.12

## 학력

- **아주대학교 정보통신대학 미디어학과 디지털미디어전공** / 학사 / 2014.03 - 2022.02 / 3.73/4.5
- **선린인터넷고등학교 웹운영과** / 2011.03 - 2014.02

## 자격

- **정보처리기사** / 한국산업인력공단 / 2019.11
- **사무자동화산업기사** / 한국산업인력공단 / 2019.05
- **한국사능력검정시험 1급** / 국사편찬위원회 / 2018.11
- **정보처리산업기사** / 한국산업인력공단 / 2016.06
- **게임기획전문가** / 한국콘텐츠진흥원 / 2014.08
- **MOS Master** / Microsoft / 2014.01
- **컴퓨터활용능력 2급** / 대한상공회의소 / 2011.03
- **워드프로세서 1급** / 대한상공회의소 / 2008.11

## 교육 이수

- **POCU COMP2500 개체지향 프로그래밍 및 설계** / 2020.04 - 2020.07
- **POCU COMP1000 소프트웨어 공학용 수학** / 2020.01 - 2020.04
- **POCU COMP3200 C++ 언매니지드 프로그래밍** / 2019.09 - 2019.12
- **한국전파진흥협회 Unity VR 콘텐츠 제작과정** / 2016.03 - 2016.06
- **SBS게임아카데미 게임 기획과정** / 2015.02 - 2015.09

## 외국어

- **영어** / 중급 / OPIc IM2 / ACTFL / 2021.12
- **일본어** / 초급 / JLPT N4 / 일본국제교류기금, 일본국제교육지원협회 / 2011.01
