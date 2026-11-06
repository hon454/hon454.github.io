주요 경력과 핵심 역량, 대표 성과를 빠르게 살펴볼 수 있도록 정리한 이력서입니다. 경력과 기술 검증 프로젝트, 외부활동, 오픈소스, 수상, 학력과 자격을 한 문서에 정리했습니다.

회사별 주요 업무의 과제와 판단, 성과는 [경력기술서](/cv/)에서 설명합니다. 대표 작업의 화면과 영상, 공개 코드와 기여 내용은 [포트폴리오](/portfolio/)에서 확인할 수 있습니다.

[hon454@gmail.com](mailto:hon454@gmail.com) / [LinkedIn](https://www.linkedin.com/in/jihoon-jeon-b7ab83116) / [GitHub](https://github.com/hon454) / [동료 추천사](https://www.linkedin.com/in/jihoon-jeon-b7ab83116/details/recommendations/?detailScreenTabIndex=0)

## 프로필

게임 클라이언트와 실시간 3D 제작 도구를 개발하는 클라이언트 프로그래머 전지훈입니다. Unreal Engine과 C++로 오픈월드 멀티플레이 게임의 전투와 AI, 네트워크 동기화를 개발하고 AI 애니메이션 제작 도구의 데이터 구조와 편집 기능을 설계했습니다. Unity 기반 PC 게임 출시와 VR 장치 연동을 경험했고, 최근에는 Rust와 Bevy로 브라우저 3D 편집기를 만들며 AI 에이전트를 개발 과정 전반에 활용했습니다.

## 핵심 역량

- **게임 개발:** Unreal Engine과 Unity에서 전투, 장비, AI 등 게임플레이를 구현했습니다. Replication Graph, Net Dormancy와 커스텀 NetSerialize로 Dedicated Server 동기화를 최적화하고, 애니메이션 예산 관리와 압축으로 다수 개체의 실행 비용을 관리했습니다.
- **3D 제작 도구:** Unreal Engine과 Rust, Bevy 환경에서 액션 데이터 구조, 타임라인과 카메라 편집, Undo/Redo, 저장과 복원을 설계하고 생성형 AI 서비스의 결과를 편집 가능한 장면으로 연결했습니다.
- **개발 환경과 협업:** TeamCity와 GitLab CI 기반 빌드 자동화, Sentry 크래시 수집, 코드 리뷰와 AI 에이전트 개발 체계를 구성해 운용하고, 반복 작업을 오픈소스 도구로 만들어 배포했습니다.

## 경력

### 시나몬(Cinamon) / 클라이언트 프로그래머

2024.06 - 2026.09 / 정규직

**Shotloom (2026.04 - 2026.09)** / Rust, Bevy, WebAssembly, WebGPU, React, TypeScript

- Unreal Engine과 Pixel Streaming에 의존하던 제작 도구를 브라우저 우선의 3D 편집기로 전환하는 초기 개발에 참여했습니다. 기술 스택 선정과 저장소 골격은 팀이 맡았고, 캐릭터와 카메라 편집, 타임라인, 문서 모델을 구현했습니다.
- 편집 명령, Undo/Redo, 저장과 복원을 하나의 트랜잭션 경로로 연결하고, 브라우저와 CLI가 같은 Rust 코어와 번들 형식을 공유하도록 구성했습니다.
- AI 애니메이션 제작 서비스 CineV의 샷을 Shotloom에서 3D 장면으로 열고, 생성 영상의 마지막 프레임 이미지를 스토리보드로 돌려주는 흐름을 개발했습니다.
- 팀 공통 AI 에이전트 개발 체계 위에 PR 가이드라인과 훅, 가드를 추가하고 ADR 31건을 작성했습니다. 요구사항을 이슈, 명세와 테스트로 구조화하고, 여러 계층을 바꾸는 기능은 의존 작업으로 나눠 구현과 독립 검토를 분리했습니다.
- Rust 엔진 CI 캐시를 sccache로 교체해 캐시 크기를 약 1.8GB에서 684MB로 약 62% 줄였습니다.

**CINEVStudio (2024.06 - 2026.04)** / Unreal Engine 5, C++, UMG, Sequencer, ONNX

- 액션 데이터 작성 구조와 AI 행동 해석, 생성 모션 연동을 담당했습니다. 제작자가 입력한 데이터를 캐릭터의 실행과 타임라인 편집으로 연결하고, 데이터 검증기로 정합성 검사를 자동화했습니다.
- UI Controller와 편집 State, Blackboard로 편집 UI의 상태 관리를 재구성하고 공통 UI 컴포넌트를 개발했습니다. Sequencer(MovieScene) 기반 타임라인의 Shot 상태 모델 재설계를 설계·구현 주도하고 저장, 복원 구조를 만들었으며, Root Motion 재계산과 카메라 orbit 문제를 해결했습니다.
- GitLab CI 기반 빌드와 패키징, Shared DDC를 구성하고(2024년) Sentry 크래시 수집을 고도화했습니다(2025년). Unreal Engine 5.3에서 5.7로 이전할 때 엔진 API 변경에 따른 코드 이전을 담당했습니다.

### 팀스파르타(TeamSparta) / 언리얼 게임 개발 코스 튜터

2024.12 - 2025.07 / 프리랜서, 정규직과 병행

- 내일배움캠프 언리얼 게임 개발 코스에서 ZEP 온라인 학습 공간의 질의응답과 학습 상담, 과제 및 팀 프로젝트 코드 리뷰를 담당했습니다.
- 취업 준비 단계에서 이력서와 포트폴리오에 피드백을 제공하고 모의 면접을 진행했습니다.
- 담당 최종 프로젝트 팀과 수강생이 각각 최우수 팀과 최우수 수강생으로 선정됐습니다.

### 작두 스튜디오(Jackto Studios) / 클라이언트 프로그래머

2021.01 - 2024.06 / 정규직

**Night of the Dead (2021.01 - 2024.06)** / Unreal Engine 4/5, C++, Dedicated Server, Steamworks, TeamCity

- 클라이언트 2~3명 중 전투와 장비, 보스 및 일반 좀비 AI, 월드 상호작용을 개발하고 2024년 5월 1.0 정식 출시까지 참여했습니다.
- Windows Server 기반 Dedicated Server에서 Replication Graph와 Net Dormancy로 연결별 복제 대상을 고르고, 접속 시 보내는 레벨 스트리밍 상태에 커스텀 NetSerialize를 붙여 코드와 비트 플래그로 압축했습니다.
- 접속 시 한꺼번에 보내야 하는 기록 데이터는 Reliable 버퍼의 여유를 보고 레코드 단위로 나눠 보내는 RPC 스트리밍 라우터를 만들어 전송했습니다.
- 다수 좀비의 애니메이션 갱신을 Significance Manager와 Animation Budget Allocator로 조절하고, 서버의 포즈 갱신을 전투 중으로 한정했으며 ACL로 애니메이션 데이터를 압축했습니다.
- EOS가 Steam 외부 인증을 Web API 티켓으로 바꾸도록 요구하자, 이를 지원하는 Steamworks SDK 1.57 이상을 포함한 UE 5.3 커스텀 엔진으로 UE 4.27 프로젝트를 이전했습니다.
- 원인을 알 수 없는 에러가 잦던 UE4 APEX Destruction을 커스텀 Destructible 시스템으로 교체했습니다. 당시 환경을 재현한 실험 프로젝트에서 동시 파괴의 병목을 찾고, 프레임당 조각 컴포넌트 예산으로 100개 동시 파괴 스파이크를 138ms에서 25ms로 낮췄습니다(UE 4.27, 교체 전 구성인 교체형 APEX 32ms).
- Jira, Confluence, Slack을 대체하는 JetBrains Space On-Premise 서버와 TeamCity On-Premise 서버를 구축해 협업 도구와 빌드 자동화를 운영했습니다.

### 삐요 스튜디오(Ppiyo Game Studios) / 클라이언트 프로그래머(리드)

2021.10 - 2023.12 / 비고용 팀 활동, 정규직과 병행

**길고양이 이야기 2 (2021.10 - 2023.12)** / Unity, C#, Steamworks, STOVE SDK

- 프로그래머 2인 팀에서 리드를 맡아 세이브와 로드, 퀘스트, 대화, 이동, 컷신, 환경설정과 UI 등 주요 게임 시스템을 개발했습니다.
- 컨트롤러 입력, Steamworks 업적과 STOVE 구매 인증을 연동했습니다.
- 스토어 등록부터 5개 언어 지원 빌드 준비, 출시 빌드 검수와 업로드까지 출시 작업을 전담해 2023년 STOVE에서 Windows 얼리 액세스를, Steam에서 Windows와 macOS 정식 출시를 진행했습니다. 프로젝트는 G-STAR 2023 인디 어워즈 Games for Impact 부문을 수상했습니다.

### 누라임게임즈(NurhymeGames) / 클라이언트 프로그래머

2020.07 - 2020.08 / 인턴

Unity, C#과 GameSparks를 사용해 Android용 격투 테마 3D 방치형 게임 Brutal League의 클라이언트 개발을 전담하고 캠페인 모드와 보상 시스템을 구현했습니다.

### 이매진템페스트(Imagine Tempest) / 기획 및 클라이언트 프로그래머

2019.10 - 2020.04 / 비고용 팀 활동, 군 복무와 일부 병행

Vapor World의 스토리와 세계관을 기획하고, Unity 기반 입력과 이동, 전투 시스템을 개발했습니다.

### 육군 / SW개발병

2018.02 - 2019.10 / 군 복무

전문특기병인 SW개발병으로 지원해 복무했습니다. C#과 WPF로 기존 프로그램을 이식 개발하고 VBA로 엑셀 데이터 정리 프로그램을 만들었습니다. 육군 지휘통제시스템의 장애 대응과 운영을 담당했으며, 응용체계관리반 분대장으로 복무했습니다.

### 클릭트(Clicked, Inc.) / VR 소프트웨어 엔지니어

2016.07 - 2018.02 / 정규직

**onAirVR Client 2.0, CircleVR, Space Walker, 학도병의 편지, #BeFearless** / Unity, C#, 소켓 통신, HTC Vive Tracker, Gear VR

- onAirVR 스튜디오 클라이언트와 세션별 카메라 리그를 구현하고, Client 2.0의 UI 개선과 Daydream용 GoogleVR API 연동을 맡았습니다.
- CircleVR에서 HTC Vive Tracker 정보를 소켓 통신으로 수신해 체험자의 위치와 자세를 콘텐츠에 연결하고, 장치 간 좌표계와 장착 오프셋을 보정했습니다.
- Space Walker의 전신 모션 연동과 GPU 파티클 기반 3D 배경 인터랙션을 구현했습니다.
- 삼성 #BeFearless 캠페인용 고소공포증 훈련 VR 앱에서 Gear S2 심박수 연동과 다국어 시스템을 개발하고, Oculus Store 등록을 맡았습니다.

### 웹젠(WEBZEN Inc.) / 게임 기획자

2015.12 - 2016.01 / 인턴

동계 직업 연수 프로그램에서 국내 스낵컬처 게임 시장을 조사·분석하고 교육용 게임 '해녀와 바다'를 제안했습니다. 시장 보고서와 제안서를 작성하고 Unity 프로토타입을 만들었습니다.

### 비트망고(BitMango) / 게임 기획자

2014.07 - 2014.08 / 인턴

모바일 게임 Slots, SAMURAI STEPS, Pitter Patter, DRAWLINE의 레벨과 콘텐츠 디자인, 사운드 발주와 QA를 담당했습니다.

## 기술 검증 프로젝트

- **[UE5 Dedicated Server 최적화 실험실](https://github.com/hon454/ue-dedicated-server-optimization-lab):** 2026.10 - 진행 중. Unreal Engine 5.8.3 Dedicated Server의 리플리케이션 비용을 Unreal Insights로 측정하고, 최적화 기법을 하나씩 적용해 전후를 비교합니다.

## 외부활동

- **아주대학교 미디어프로젝트 자문 및 멘토:** 2023 - 2026, 5개 학기 참여. 2023년 2학기, 2024년 2학기, 2025년 1학기와 2학기, 2026년 1학기 수업에서 학생 프로젝트에 피드백 제공
- **스파르타 게임잼 심사위원:** 2025.08.15 - 2025.08.17. 스파르타코딩클럽 주최 게임잼의 출품 프로젝트 평가
- **아주대학교 VR Studio 학부생 TA:** 2020.09 - 2020.12

## 오픈소스

- **[Copy Selection Context](/projects/copy-selection-context/):** 코드와 위치 정보를 함께 전달하는 JetBrains 플러그인을 개발해 [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/30262-copy-selection-context)에 배포했습니다.
- **[GitHub Pulls Show Reviewers](/projects/github-pulls-show-reviewers/):** PR 목록에 리뷰어와 상태를 표시하는 Chrome 확장 프로그램을 개발해 [Chrome Web Store](https://chromewebstore.google.com/detail/github-pulls-show-reviewe/hoocgjopdboeghdkfjlkngkkpbiljggk)에 배포했습니다.
- **외부 기여:** [bevy_vrm1](https://github.com/not-elm/bevy_vrm1)의 MToon 셰이더가 WebGPU에서 화면을 검게 만드는 결함을 추적해 수정을 기여했습니다.
- **외부 기여:** [Firefly](https://github.com/CuteLeaf/Firefly)의 GitHub 카드 빌드 캐시, Mermaid 렌더러 이전, 레이아웃 슬롯과 휠 스크롤을 개선하고 한국어 README를 작성했습니다.

## 수상 및 선정

- **시나몬 GitLab 개발왕** / GitLab의 커밋, MR, 댓글 등 활동 점수 기준 사내 선정 / 2025.12
- **G-STAR 2023 인디 어워즈 Games for Impact 부문 수상** / 길고양이 이야기 2 / 2023.11

## 학력 및 자격

### 학력

- **아주대학교 정보통신대학 미디어학과 디지털미디어전공** / 학사 / 2014.03 - 2022.02 / 3.73/4.5
- **선린인터넷고등학교 웹운영과** / 2011.03 - 2014.02

### 자격

- **정보처리기사** / 한국산업인력공단 / 2019.11
- **사무자동화산업기사** / 한국산업인력공단 / 2019.05
- **정보처리산업기사** / 한국산업인력공단 / 2016.06
- **게임기획전문가** / 한국콘텐츠진흥원 / 2014.08
- **MOS Master** / Microsoft / 2014.01
- **컴퓨터활용능력 2급** / 대한상공회의소 / 2011.03
- **워드프로세서 1급** / 대한상공회의소 / 2008.11

### 교육 이수

- **POCU 아카데미 COMP2500 개체지향 프로그래밍 및 설계 (Java)** / 2020.04 - 2020.07
- **POCU 아카데미 COMP1000 소프트웨어 공학용 수학** / 2020.01 - 2020.04
- **POCU 아카데미 COMP3200 C++ 언매니지드 프로그래밍** / 2019.09 - 2019.12
- **한국전파진흥협회 Unity 엔진을 활용한 VR 콘텐츠 제작 교육** / 2016.03 - 2016.06
- **SBS게임아카데미 게임 기획과정** / 2015.02 - 2015.09

### 외국어

- **영어** / OPIc IM2 (ACTFL, 2021.12, 만료 2023.12)
- **일본어** / JLPT N4 (2011.01)
