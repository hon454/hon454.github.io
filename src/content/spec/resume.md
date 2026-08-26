[hon454@naver.com](mailto:hon454@naver.com) · [LinkedIn](https://www.linkedin.com/in/jihoon-jeon-b7ab83116) · [GitHub](https://github.com/hon454)

## 프로필

Unreal Engine·C++로 오픈월드 멀티플레이와 대규모 AI·애니메이션 시스템을, Rust·Bevy·React로 브라우저 기반 3D 제작 도구를 개발해 온 게임 클라이언트·시스템 프로그래머입니다. 엔진·편집기·AI 서비스 사이의 계약을 정리하고, 모호한 요구사항을 실행 가능한 작업으로 구조화해 배포·검증 가능한 상태까지 연결하는 데 강점이 있습니다. 코드 리뷰·개발 도구·문서화로 반복되는 문제 해결을 팀이 재사용할 수 있는 흐름으로 전환해 왔습니다.

## 핵심 역량

- **게임 클라이언트** — C++·Unreal Engine 4/5로 오픈월드 멀티플레이, 대규모 AI·애니메이션과 제작 도구를 개발하고 C#·Unity 기반 PC 게임과 VR 콘텐츠를 제작
- **실시간 런타임·편집기** — Rust·Bevy WebAssembly/WebGPU 런타임과 React·TypeScript·Tauri 편집기를 명시적인 데이터·명령 경계로 연결
- **재현 가능한 파이프라인** — REST·WebSocket 비동기 연동, VRM·glTF·ONNX 데이터 검증·변환, CI/CD·계약/회귀 테스트·ADR로 실패와 변경을 추적
- **AI 에이전트 기반 개발** — 개인화한 커스텀 에이전트 하네스를 운용하고 명세·계획·ADR과 테스트 주도 개발을 AI가 추적할 수 있는 하나의 개발 맥락으로 연결하며, 실제 작업에서 드러난 제약과 개선점을 지침에 축적해 작업 정확도와 재현성을 향상

## 경력

### 시나몬(Cinamon) — 클라이언트 프로그래머

2024.06 — 현재 · 정규직

**역할:** CINEVStudio의 Action·Prop 제작 흐름에서 시작해 Shotloom 초기 개발의 Rust core·Bevy runtime·React/Tauri editor·외부 AI 서비스 통합으로 범위를 확장했습니다. 기획·아트·TA·QA·서비스 팀의 요구를 구현 단위와 데이터 계약으로 정리하고, 코드 리뷰·기술면접·문서·개발 도구로 팀 실행을 지원했습니다.

#### Shotloom

2026.04 — 현재

**환경:** Rust, Bevy, WebAssembly, WebGPU, Tauri, React, TypeScript, VRM, glTF

Unreal Engine·Pixel Streaming 기반 제작 도구를 브라우저 우선의 샷 제어 시스템으로 전환하는 초기 개발에 참여했습니다. 캐릭터·모션·카메라·타임라인을 브라우저에서 편집하고, 같은 프로젝트를 Native 렌더링과 자동화로 연결하는 제품 기반을 구축했습니다.

- **웹 우선 제품 전환** — 브라우저에서 샷을 열고 캐릭터·모션·카메라·타임라인을 편집하는 골든 패스를 구축해, 사용자별 서버 GPU 세션에 의존하던 신규 Unreal·Pixel Streaming 경로를 단계적으로 대체할 기반을 마련했습니다.
- **Web·Native 단일 제품 모델** — 브라우저 프리뷰, CLI와 서비스가 동일한 `.shotloom` 번들과 Rust 타임라인 코어를 사용하도록 구성해 실행 환경에 관계없이 같은 프로젝트와 프레임 결과를 재현하도록 했습니다.
- **AI 에이전트 주도 개발 체계** — CINEVStudio에서 단계적으로 구축한 에이전트 워크플로를 Shotloom에서는 저장소 초기부터 적용했습니다. 요구사항을 Linear 이슈·명세·ADR·테스트로 구조화하고 AI 에이전트가 계획부터 구현·검증·PR까지 수행하는 흐름을 구축했습니다. 본인 변경의 주간 병합 빈도는 CINEVStudio 평균 8.2건에서 Shotloom 평균 16.1건으로 약 2배 높아졌고, 추적 가능한 병합 1건당 평균 텍스트 변경량도 291줄에서 1,355줄로 약 4.7배 증가했습니다.
- **실패에 안전한 편집 구조** — React UI와 Bevy 런타임을 버전형 `command/event` 계약으로 분리하고 transaction·rollback을 적용해 명령 거절, 타임아웃과 외부 서비스 실패에도 UI·런타임·저장 상태가 어긋나지 않도록 했습니다.
- **CI 속도·신뢰성** — Rust Engine CI job의 1.84GB target archive를 684MB sccache로 교체해 캐시 크기를 약 63% 줄이고 warm CI에서 374/374 cache hit를 검증했습니다. 준비 이벤트 이후 발생한 Linux headless WebGPU 오류까지 기다리도록 테스트를 보완해 false positive도 제거했습니다.

#### CINEVStudio

2024.06 — 2026.04

**환경:** Unreal Engine 5, C++, UMG, Sequencer·MovieScene, Remote Control API, HTTP, WebSocket, ONNX, GitLab CI/CD

- **Action 도메인** — Action·MetaAction·Prop·UAGDA의 데이터 규칙과 Sequencer·MovieScene 실행 흐름을 담당하고, UMG 타임라인에서 카메라·애니메이션·Root Motion·IK를 편집·재생하도록 연결했습니다. 기획·TA·QA와 기능·데이터 경계를 조율하고 반복 오류를 공통 규칙과 검증 도구에서 해결했습니다.
- **비동기 Text-to-Motion 연동** — Story-to-Movie JSON을 성별과 설정 가능한 배치 크기로 분할해 원격 서버에 병렬 요청하고, 일부 요청이 실패해도 성공 결과를 보존했습니다. ONNX 출력을 자체 스켈레톤 형식으로 변환해 런타임 애니메이션에 적용했습니다.
- **저장 호환성** — 모션 메타데이터와 중첩 애니메이션을 JSON으로 저장·복원하고, 신규 표시 이름이 없는 이전 파일은 기존 프롬프트로 복원했습니다.
- **내보내기 추적성** — Shot ID·Character/Camera Sequence·Action 출처를 결정적으로 기록해 결과가 어느 입력과 편집 상태에서 나왔는지 추적할 수 있게 했습니다.
- **Root Motion 편집** — Root Motion을 actor-space 기준으로 베이크하고 재생 속도·loop·frame offset이 바뀔 때 키를 다시 계산해 편집 결과와 재생 이동을 맞췄습니다.
- **카메라 orbit** — Quaternion 기반 구면 이동과 충돌·pole 제한으로 orbit 반경 손실과 수직 회전 뒤집힘을 해결했습니다.
- **Headless 자동화** — S2M JSON 기반 프로젝트 생성과 Shot 편집을 지원하는 headless Commandlet 및 Unreal Remote Control API를 연동해 프로젝트 편집·렌더링 워크플로를 자동화했습니다.
- **Shipping 설정** — Unreal Shipping 빌드가 외부 `Game.ini` override를 제한하고 검증 실패 설정을 삭제하는 원인을 추적한 뒤, `Dev.ini`로 임시 `UserDir` 실행 환경을 생성하는 런처를 구현해 원본 설정을 보존했습니다.
- **개발·배포 운영** — GitLab CI에 개발 빌드 아티팩트와 다운로드 안내를 구성해 기획·QA가 develop 빌드를 직접 검증할 수 있게 했습니다. runner 종속 경로와 렌더링 후처리 병목을 제거하고, 패키징 문맥과 운영 절차를 Slack 알림과 개발자 문서에 남겼습니다.

### 팀스파르타 — 언리얼 게임 개발 코스 튜터

2024.12 — 2025.07 · 프리랜서

- 수강생 질의응답과 학습 상담, 과제·팀 프로젝트 코드 리뷰, 이력서·포트폴리오 피드백과 모의 면접을 담당했습니다.
- 담당 최종 프로젝트 팀과 수강생이 각각 최우수 팀과 최우수 수강생으로 선정됐습니다.

### 작두스튜디오 — 클라이언트 프로그래머

2021.01 — 2024.06 · 정규직

#### Night of the Dead

**환경:** Unreal Engine 4/5, C++, Epic Online Services, Steamworks, TeamCity

- **전투·AI** — 근거리·원거리·투척 무기의 장착 구조와 데이터 기반 속성·버프·디버프 연산, 보스·일반 좀비 AI, 던전과 전투 UI를 개발했습니다.
- **오픈월드 멀티플레이** — 최대 16인 서버를 기준으로 Replication Graph, Fast TArray Replication, 커스텀 `NetSerialize`와 RPC 기반 스트리밍을 적용해 상태 전송 경로를 구성하고 서버의 replication CPU 비용을 약 15% 줄였습니다. Epic Online Services 세션도 연동했습니다.
- **AI·애니메이션 성능** — 라이트·헤비 웨이브 좀비가 최대 200마리 동시에 등장하는 부하 시나리오에서 Animation Budget Allocator·Significance Manager와 AnimURO를 적용 대상별로 운용해 화면 기여도가 낮은 개체의 업데이트 빈도를 줄이고 Game Thread 비용을 약 16% 낮췄습니다. ACL로 애니메이션 데이터를 압축해 메모리 사용량도 약 12% 절감했습니다.
- **월드 상태·플랫폼** — 커스텀 Destructible Mesh와 Instanced Foliage 리스폰을 구현하고 Steamworks 업적을 연동했습니다.
- **엔진·출시 기반** — UE4에서 UE5로 마이그레이션하고 Shared DDC와 TeamCity 빌드·패키징 자동화를 구성해 2024년 5월 1.0 정식 출시를 지원했습니다. JetBrains Space·Nginx·Certbot 기반 개발 인프라도 구축했습니다.

### Ppiyo Game Studios — 인디 게임 개발자

2021.10 — 2023.12 · 프리랜서

#### [길고양이 이야기 2 (Street Cat's Tale 2)](https://store.steampowered.com/app/2356450/A_Street_Cats_Tale_2_Outside_is_Dangerous/)

**환경:** Unity, C#, Steamworks, Stove SDK, GitLab, Synology NAS

- **핵심 게임 시스템** — 환경설정, 세이브·로드, 퀘스트, 대화, 이동, 컷신과 UI 등 2D 퍼즐 어드벤처의 주요 시스템을 개발했습니다.
- **플랫폼·상점 연동** — PlayStation·Nintendo Switch·Xbox 3종 컨트롤러 입력과 Steamworks 업적, Stove SDK 구매 인증을 구현했습니다. 출시판은 Steam 업적 22개를 제공합니다.
- **출시·프로젝트 성과** — 2023년 2월 [STOVE(Windows)](https://store.onstove.com/ko/games/1654/), 같은 해 6월 Steam(Windows·macOS) 출시판 개발에 참여했습니다. 두 상점 출시판은 5개 언어를 지원하며, 프로젝트는 텀블벅에서 [후원자 222명, 7,846,024원(목표 156%)](https://tumblbug.com/astreetcatstale2)을 모금해 펀딩에 성공했습니다.
- **개발 운영** — Synology NAS에 팀용 GitLab을 구축해 소스 코드와 개발 이력을 관리했습니다.

### 누라임게임즈 — 게임 개발자 인턴

2020.07 — 2020.08 · 인턴

#### BrutalLeague

**환경:** Unity, C#, JavaScript, GameSparks, Android

- **클라이언트·백엔드 연동** — 인턴 기간에 Android 3D 방치형 대전 액션 게임의 캠페인 모드와 GameSparks 기반 보상 시스템을 구현했습니다.

### Imagine Tempest — 인디 게임 개발자

2019.06 — 2020.04 · 프리랜서

#### [Vapor World](https://store.steampowered.com/app/1996090/Vapor_World_Over_The_Mind/)

**환경:** Unity, C#, Universal Render Pipeline

- **게임 디자인·클라이언트** — 게임 디자인과 스토리·세계관을 구성하고 입력·이동·전투 등 2D 액션 어드벤처의 클라이언트 시스템을 개발했습니다. Unity 2D Light와 Universal Render Pipeline으로 9개 인물의 정신세계를 연결하는 출품 빌드 제작에 참여했습니다.
- **프로젝트 성과** — 참여 기간 중 [제11회 경기 게임오디션 공동 2위](https://gnews.gg.go.kr/news/news_detail.do?number=201909261915326127C056&s_code=C056)에 선정돼 프로젝트가 개발지원금 3,000만원을 확보했습니다. MWU Korea Awards 2019 PC & Console Top 3는 합류 직전인 2019년 5월 프로젝트가 선정된 이력입니다.

### 클릭트(Clicked, Inc.) — VR 소프트웨어 엔지니어

2016.07 — 2018.02 · 정규직

#### [CircleVR·onAirVR·CloudVR](https://www.onairvr.io/usecase/)

**환경:** Unity, C#, onAirVR, Socket networking, Gear VR, HTC Vive, Vive Tracker, Perception Neuron

- **onAirVR 실시간 스트리밍** — 스튜디오 클라이언트 프로그래밍을 리드하고, PC에서 렌더링·인코딩한 스테레오 영상·오디오를 모바일 HMD로 전송하며 HMD 자세·입력을 서버로 되돌리는 소켓 경로와 세션별 카메라 리그를 Unity·C#로 개발했습니다.
- **CircleVR 다중 사용자** — Gear VR·Galaxy S8 클라이언트를 HTC Vive Tracker의 외부 6DoF 좌표계에 매핑하고 장착 오프셋을 정합해, 2인 이상이 동시에 체험하고 각 시점을 원형 디스플레이에 공유하는 전시 시스템을 구현했습니다.
- **전신 모션캡처** — Unite 2017 Seoul의 Space Walker 시연에서 Perception Neuron 전신 모션을 Unity Humanoid 아바타에 실시간 리타기팅하고, hip 위치와 17개 핵심 bone의 로컬 좌표축 차이를 보정해 onAirVR HMD·프로젝션으로 연결했습니다.

### 웹젠 — 게임 디자이너 인턴

2015.12 — 2016.01 · 인턴

**환경:** Unity, C#, PowerPoint

- **리서치·프로토타이핑** — 국내 스낵컬처 게임 사례와 시장을 조사·분석해 교육용 게임 「해녀와 바다」를 제안하고, 인턴 기간에 Unity·C# 프로토타입을 제작하고 시장 보고서를 작성했습니다.

### 비트망고 — 게임 디자이너 인턴

2014.07 — 2014.08 · 인턴

- **레벨·콘텐츠 디자인** — 인턴 기간에 모바일 퍼즐 게임 4종(Slots·SAMURAI STEPS·Pitter Patter·DRAWLINE)의 레벨·콘텐츠 디자인, 사운드 발주와 QA를 담당했습니다.

## 기타 활동

- **아주대학교 미디어프로젝트 자문·멘토** — 2026년 2학기 · 예정
- **아주대학교 미디어프로젝트 자문·멘토** — 2026년 1학기 · 2026.03 — 2026.05
- **아주대학교 미디어프로젝트 자문·멘토** — 2025년 2학기 · 2025.10 — 2025.11
- **아주대학교 미디어프로젝트 자문·멘토** — 2025년 1학기 · 2025.03 — 2025.05
- **아주대학교 미디어프로젝트 자문·멘토** — 2024년 2학기 · 2024.10 — 2024.11
- **아주대학교 미디어프로젝트 자문·멘토** — 2023년 2학기 · 2023.10 — 2023.11
- **스파르타 게임잼 심사위원** — 2025.08.15 — 2025.08.17
- **아주대학교 VR Studio 학부생 TA** — 2020.09 — 2020.12

## 오픈소스

### [Firefly](https://github.com/CuteLeaf/Firefly)

**환경:** Astro 7, Svelte 5, TypeScript, Node.js, Merman, Mermaid

- **[GitHub 저장소 카드 정적 렌더링](https://github.com/CuteLeaf/Firefly/pull/588)** — 방문자 브라우저에서 호출하던 GitHub API를 빌드 시점 캐시로 전환했습니다. Markdown·MDX의 저장소 참조를 자동 수집하고, API 장애나 사용량 제한 시 기존 캐시를 재사용하며, 빌드 전용 토큰이 결과물에 노출되지 않도록 구성해 카드의 로딩 실패와 잘못된 수치 표시를 해결했습니다.
- **[Mermaid 렌더러 마이그레이션](https://github.com/CuteLeaf/Firefly/pull/584)** — 빌드 시 Mermaid 다이어그램을 생성하는 Merman을 WebAssembly 기반 패키지에서 Node.js 기반 최신 버전으로 전환했습니다. 변경된 렌더링 API와 옵션 구조에 맞춰 플러그인·테마 타입을 수정하고 기존 라이트·다크 테마의 배경색과 출력 형태를 유지했습니다.
- **[Astro 레이아웃 슬롯 수정](https://github.com/CuteLeaf/Firefly/pull/587)** — 페이지별 `<head>` 콘텐츠가 중간 UI 컴포넌트에서 소비되어 최상위 레이아웃으로 전달되지 않던 구조를 추적하고, 슬롯 전달 위치를 수정했습니다.
- **[한국어 문서화](https://github.com/CuteLeaf/Firefly/pull/583)** — 설치·구성·배포와 Markdown 확장 기능을 다루는 프로젝트 README의 한국어 번역본을 작성하고, 각 언어 문서에 한국어 탐색 경로를 연결했습니다.

### [Grimoire](https://github.com/hon454/grimoire)

**환경:** Python, Codex Skills, Codex Plugins, GitHub CLI, Git

- **AI 에이전트 워크플로 제품화** — 코드 리뷰·리뷰 대응·이슈 준비도 판단·작업 인계·Git 운영처럼 반복되던 개발 업무를 재사용 가능한 Codex Skill과 Plugin으로 설계하고, 설치 가능한 오픈소스 도구로 공개·유지보수하고 있습니다.
- **Human-in-the-loop 자동화** — PR 맥락 수집부터 피드백 번역·분류, 사용자 의사결정, 구현·검증, 리뷰어 후속 대응까지 하나의 흐름으로 연결했습니다. 대화와 작업이 바뀌어도 결정 상태를 이어가고, 원격 변경은 사용자 확인과 검증을 통과한 뒤에만 수행하도록 설계했습니다.
- **신뢰 가능한 에이전트 운영** — 사용자·프로젝트별 실행 맥락을 자동으로 구성하고, task handoff와 Git 정리·충돌 해결처럼 실수 비용이 큰 작업에는 대상 재검증과 fail-closed 보호 장치를 적용했습니다. 전체 패키지는 Python 표준 라이브러리 기반 105개 테스트로 검증했습니다.

### [Copy Selection Context](https://github.com/hon454/copy-selection-context)

**환경:** Kotlin, IntelliJ Platform SDK, Gradle, JUnit 5, MockK, GitHub Actions

- **AI 코드 컨텍스트 공유** — 에디터의 선택 영역이나 현재 줄을 한 번의 단축키로 파일 경로·라인 번호·코드가 포함된 `@path#Lline` 형식으로 복사하는 IntelliJ Platform 플러그인을 개발해 [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/30262-copy-selection-context)에 배포했습니다.
- **개발 흐름 확장** — 상대·절대 경로, 코드 블록과 사용자 정의 출력 템플릿, 다중 caret, 복사 이력·상태 표시줄, GitHub·GitLab permalink를 지원해 AI 어시스턴트와 코드 리뷰에 필요한 맥락을 반복 입력하지 않도록 구성했습니다.
- **검증·배포 자동화** — 경로·선택 영역 처리, 출력 템플릿, 복사 이력과 permalink 생성을 JUnit 5·MockK 테스트로 검증하고, GitHub Actions에서 플러그인 빌드·아티팩트 확인과 태그/버전 일치 검증·GitHub Release·서명된 Marketplace 배포를 자동화했습니다.

### [GitHub Pulls Show Reviewers](https://github.com/hon454/github-pulls-show-reviewers)

**환경:** TypeScript, WXT, React, Chrome Extension Manifest V3, GitHub REST API, Vitest, Playwright

- GitHub Pull Request 목록에서 요청된 사용자·팀 리뷰어와 최신 리뷰 상태를 인라인으로 보여주는 Chrome 확장 프로그램을 개발해 [Chrome Web Store](https://chromewebstore.google.com/detail/github-pulls-show-reviewe/hoocgjopdboeghdkfjlkngkkpbiljggk)에 배포했습니다.
- 공개 저장소의 비로그인 경로와 GitHub App Device Flow 기반 비공개 저장소 접근을 함께 지원하고, 최소 읽기 권한·다중 계정·설치 범위 확인·토큰 자동 갱신을 구현했습니다.
- 페이지 단위 메타데이터 배치와 행 단위 캐시·백그라운드 재검증으로 API 요청을 제어하고, GitHub의 SPA 탐색과 DOM 변경에도 리뷰어 표시가 유지되도록 구성했습니다.

### [bevy_vrm1](https://github.com/not-elm/bevy_vrm1)

**환경:** Rust, Bevy, WGSL, WebGPU

- **[WebGPU 렌더링 오류 분석·수정](https://github.com/not-elm/bevy_vrm1/pull/57)** — Chrome·WebGPU에서 MToon VRM이 표시된 직후 화면 전체가 검게 변하지만 Metal 네이티브에서는 나타나지 않는 문제를 재현하고, 조명 단계별 비교로 원인을 `apply_emissive_light`에 격리했습니다.
- MToon의 `EMISSIVE_TEXTURE` 비트가 Standard Material 플래그의 같은 비트와 충돌한 상태에서 `PbrInput.flags`의 미정의 값을 읽어 바인딩되지 않은 텍스처를 샘플링하고, NaN·Inf가 HDR 톤매핑·Bloom 경로로 전파되는 것을 확인했습니다.
- WGSL이 MToon uniform의 `material.flags`를 읽도록 수정하고, Rust의 `MtoonFlags`가 `emissive_texture` 존재 여부에 따라 `EMISSIVE_TEXTURE` 비트를 설정하도록 보완했습니다.

## 수상 및 선정

- **G-STAR 2023 Indie Awards — Games for Impact** · 길고양이 이야기 2 · 2023
- **제11회 새로운 경기 게임오디션 2위** · Vapor World · 2019
- **아주대학교 문화콘텐츠 창작 공모전 금상** · 2014.06
- **KBS 꿈의 기업 입사 프로젝트 스카우트 위메이드 게임기획자 최종 4인** · 2013.06
- **네오위즈인터넷 음악 게임·서비스 공모전 최종 6팀** · 2012.10

## 학력 및 자격

### 학력

- **아주대학교 정보통신대학 미디어학과 디지털미디어전공** · 학사 · 2014 — 2022.03 · 3.73/4.5
- **선린인터넷고등학교 웹운영과** · 2011 — 2014

### 자격

- **정보처리기사** · 2019.11
- **사무자동화산업기사** · 2019.05
- **한국사능력검정시험 1급** · 2018.11
- **정보처리산업기사** · 2016.06
- **게임기획전문가** · 2014.08
- **MOS Master** · 2014.01
- **컴퓨터활용능력 2급** · 2011.03
- **워드프로세서 1급** · 2008.11

### 교육 이수

- **POCU COMP2500 개체지향 프로그래밍 및 설계** · 2020.04 — 2020.07
- **POCU COMP1000 소프트웨어 공학용 수학** · 2020.01 — 2020.04
- **POCU COMP3200 C++ 언매니지드 프로그래밍** · 2019.09 — 2019.12
- **한국전파진흥협회 Unity VR 콘텐츠 제작과정** · 2016.03 — 2016.06
- **SBS게임아카데미 게임 기획과정** · 2015.02 — 2015.09

### 외국어

- **영어** · 중급 · OPIc IM2 (2021.12)
- **일본어** · 초급 · JLPT N4 (2011.01)
