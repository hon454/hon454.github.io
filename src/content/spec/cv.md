게임 클라이언트와 실시간 3D 제작 도구를 개발해 온 클라이언트 프로그래머의 경력기술서입니다. 재직 경력별 주요 업무의 과제와 판단, 결과를 정리했습니다.

전체 이력은 [이력서](/resume/)에서, 작업 화면과 영상, 공개 코드는 [포트폴리오](/portfolio/)에서 확인할 수 있습니다. 구현 과정과 도식은 각 프로젝트 글로 연결했습니다.

## 경력 요약

- **3D 제작 도구 (시나몬, 2024 - 2026):** Unreal Engine 5와 Rust, Bevy 기반 AI 애니메이션 제작 도구의 액션 데이터 구조, AI 결과 해석, 편집 UI와 저장 구조 설계
- **게임 클라이언트 (작두 스튜디오, 2021 - 2024):** Unreal Engine 오픈월드 멀티플레이 게임의 전투, 장비, 좀비 AI와 Dedicated Server 동기화, 다수 개체 최적화, 1.0 정식 출시
- **VR 소프트웨어 (클릭트, 2016 - 2018):** Unity 기반 VR 클라이언트와 트래커, 모션 캡처 장치 연동, 전시와 공연 콘텐츠 개발
- **개발 환경:** GitLab CI와 TeamCity 기반 빌드 자동화, Sentry 크래시 수집, 엔진 버전 이전, AI 에이전트 개발 체계 운용
- **대표 성과:** AI 에이전트 개발 체계 도입 후 개인 주간 병합 빈도 약 2배, Rust CI 캐시 크기 약 63% 감소, 사내 GitLab 개발왕 선정, Night of the Dead 1.0 정식 출시

## 시나몬

2024.06 - 2026.08 / 정규직 / 클라이언트 프로그래머

AI 애니메이션 제작 서비스 CineV의 3D 제작 도구 개발. Unreal Engine 5 기반 CINEVStudio의 액션 데이터, AI 결과 해석, 편집 UI와 Shot 모델을 담당한 뒤, 후속 제품인 브라우저 편집기 Shotloom의 편집과 저장 구조, 생성 서비스 연동 개발

### Shotloom

2026.04 - 2026.08 / Rust, Bevy, WebAssembly, WebGPU, React, TypeScript, Tauri

- **개요:** 사용자별 서버 GPU 세션에 의존하던 Unreal Engine과 Pixel Streaming 경로를 대체하는 브라우저 3D 편집기. 캐릭터 동작과 카메라를 편집하고 결과를 CineV의 제작 흐름으로 연결
- **담당 범위:** 캐릭터와 카메라 편집, 문서 모델, 저장과 복원, 생성 서비스 연동. 기술 스택 선정과 초기 저장소 구성은 팀 담당

#### 편집 트랜잭션과 저장 구조

- **과제:** React UI, Rust 문서 모델, Bevy 런타임으로 나뉜 구조에서 명령 거절이나 외부 서비스 실패 시 세 계층의 상태가 어긋날 위험
- **판단:** 버전을 가진 명령과 이벤트 계약으로 계층을 연결하고, 드래그 중간값 대신 사용자의 조작 단위로 변경을 확정하는 트랜잭션 구조 선택
- **수행:** 트랜잭션과 롤백, 변경하지 않은 데이터를 공유하는 스냅샷, 파일 저장과 브라우저 복구 데이터의 오류 구분 구현
- **결과:** 캐릭터, 포즈 후보, 클립과 카메라 키를 저장한 뒤 다시 열어 편집 상태 복원 확인

#### 생성 서비스 통합

- **과제:** 스토리보드의 장면 구성 입력(S2M)과 포즈 생성 서비스(Text2Pose)의 결과를 편집 가능한 장면으로 변환하고, 편집 결과를 CineV로 반환
- **판단:** 브라우저, CLI와 서비스가 같은 규칙으로 입력을 해석하도록 장면 구성과 검증 정책을 공유 Rust 코드로 통합
- **수행:**
  - S2M 입력을 장면과 자산으로 변환하는 번들 컴파일러, Text2Pose 후보의 선택과 클립 적용 구현
  - 카메라와 포즈의 키프레임 모델, 편집 UI와 저장 형식 전환
  - 생성과 결과 저장을 분리해 저장 실패 시 같은 결과 재전송
- **결과:** 개발 배포 환경에서 CineV 진입 시 인물 2명, 소품 4개와 카메라의 자동 구성, 영상 생성 결과 이미지의 스토리보드 반영 확인

#### AI 에이전트 개발 체계와 품질 개선

- **과제:** CINEVStudio 후속 개발의 속도를 높이기 위해 AI 에이전트를 개발 과정 전반에 활용하는 방식으로 전환
- **판단:** 요구사항을 Linear 이슈, 명세, ADR과 테스트로 구조화하고, 여러 계층을 바꾸는 작업은 의존 관계와 완료 기준으로 나눠 구현과 독립 검토를 분리
- **수행:**
  - 개인 오픈소스 Grimoire를 포함한 에이전트 개발 환경을 저장소 초기부터 운용
  - Rust CI의 target 아카이브를 sccache로 교체하고 headless WebGPU 테스트의 거짓 통과 제거
  - 편집기 화면이 검게 변하는 문제를 VRM 렌더링 라이브러리의 셰이더 결함으로 추적해 [bevy_vrm1에 수정 기여](https://github.com/not-elm/bevy_vrm1/pull/57)
- **결과:**
  - 개인 변경 기준 주간 병합 빈도 평균 16.1건, CINEVStudio 기간 평균 8.2건의 약 2배
  - CI 캐시 크기 1.84GB에서 684MB로 약 63% 감소, warm CI에서 374건의 컴파일 전체 캐시 적중

[저장 복원, 제작 과정과 검증 범위](/projects/shotloom/)

<a id="cinev-studio"></a>

### CINEVStudio

2024.06 - 2026.04 / Unreal Engine 5, C++, UMG, Sequencer, MovieScene, HTTP, ONNX

- **개요:** AI가 구성한 장면을 사용자가 편집하고 영상으로 출력하는 Unreal Engine 5 기반 제작 도구
- **담당 범위:** 콘텐츠팀의 액션 데이터 작성부터 AI 결과 해석, 타임라인 편집, 저장과 재생까지 잇는 클라이언트 개발

#### 액션 데이터 작성 구조 전환

- **과제:** 애니메이션 구간과 상호작용 설정을 DataTable과 Notify에 타입과 인덱스로 맞추고, 문자열 파라미터를 별도 설계 문서와 대조해야 하는 입력 구조
- **판단:** 액션 정의를 DataAsset으로 분리하고 요구조건을 타입별 구조체로 구성해, 필요한 조건만 추가해 입력하는 구조 선택
- **수행:**
  - 데이터 타입과 실행 경로 전환, 변환기와 전환 절차 문서화. 입력 도구 작업은 동료와 분담
  - 데이터 검증기와 오류 보고서, FBX 원본의 Root Motion 시작 Transform 자동 추출 구현
  - 기획, 애니메이션, TA, QA와 데이터 규칙 및 전환 절차 공유
- **결과:** 제작자가 기억해 맞추던 조건 관계를 입력 구조와 검증기로 대체

#### AI 행동 해석과 모션 생성 연동

- **과제:** 외부 AI 서비스가 지정한 행동과 대상을 현재 월드에서 실행 가능한 액션으로 변환하고, 생성 모션을 타임라인 편집에 연결
- **수행:**
  - 캐릭터 자세, 소품 점유 상태와 NavMesh 경로로 후보를 검사하고 점수를 매기는 해석 계층 설계, 후보 탈락 사유와 점수 기여도 기록
  - Text-to-Motion 요청의 배치 병렬 처리와 일부 실패 시 성공 결과 보존
  - 생성 모션의 선택, 타임라인 적용, Undo/Redo, 저장과 복원 경로 구현
- **결과:** AI 결과를 일반 편집 데이터와 같은 편집, 저장 경로로 통합하고, 액션의 선택과 제외 원인을 기록으로 추적 가능

#### 편집 UI와 Shot 상태 모델

- **과제:** 같은 뷰포트 입력이 편집 상태에 따라 다르게 동작해야 하는 UI, 샷 초기 상태가 샷 객체와 타임라인 섹션에 나뉘어 저장과 복원이 복잡한 구조
- **판단:** 큰 위젯의 분기 대신 UI Controller와 편집 State로 책임을 나누고, 독립 Shot 모델이 샷 초기 상태를 관리하는 구조 선택
- **수행:**
  - State별 레이아웃, 선택 모드와 입력 전략 설정, Blackboard 기반 공유 상태와 공통 UI 컴포넌트 개발
  - Subsystem 기반 메시지 서비스의 구독을 UI Controller 수명에 맞춰 중복 구독 방지
  - 팀과 진행한 Shot 모델 전환에서 상태 저장과 조회, 프레임 문맥과 재계산 담당, 기존 저장 데이터 이관
  - Root Motion 키 재계산, 카메라 orbit의 반경 손실과 수직 회전 뒤집힘 해결
- **결과:** 새 편집 기능을 State 단위로 추가하는 구조 확립, 기존 프로젝트를 새 상태 모델로 이관

#### 빌드 환경과 협업

- **과제:** 기획과 QA가 검증할 개발 빌드 배포, 크래시 수집 체계와 엔진 버전 이전
- **수행:**
  - GitLab Runner 기반 빌드와 패키징, Shared DDC, Symbol Store와 Sentry 크래시 수집 구성
  - Unreal Engine 5.3에서 5.7로의 마이그레이션에서 API와 서드파티 플러그인 호환성 문제 해결
  - Shipping 빌드의 설정 삭제 원인을 추적해 원본 설정을 보존하는 실행 런처 구현, Headless Commandlet과 Remote Control API로 편집과 렌더링 자동화
  - JetBrains Rider와 AI 보조 개발 도구의 활용 방식 공유
- **결과:**
  - 기획과 QA가 개발 빌드를 직접 내려받아 검증하는 배포 체계 운영
  - 팀 대부분이 Visual Studio에서 Rider로 전환, 연말 타운홀에서 GitLab 개발왕 선정

[데이터 구조, 도식과 구현 예시](/projects/cinev-studio/)

<a id="teamsparta"></a>

## 팀스파르타

2024.12 - 2025.07 / 프리랜서, 정규직과 병행 / 튜터

### 언리얼 게임 개발 코스

Unreal Engine, C++

- 내일배움캠프 언리얼 게임 개발 코스 수강생의 학습과 프로젝트 개발 지원, ZEP 온라인 학습 공간에서 질의응답과 학습 상담 진행
- 과제와 팀 프로젝트 코드 리뷰, 취업 준비 단계의 이력서와 포트폴리오 피드백, 모의 면접 진행
- 담당 최종 프로젝트 팀과 수강생이 각각 최우수 팀과 최우수 수강생으로 선정

## 작두 스튜디오

2021.01 - 2024.06 / 정규직 / 클라이언트 프로그래머

### Night of the Dead

Unreal Engine 4/5, C++, Windows Server, Unreal Insights, EOS, Steamworks, TeamCity

- **개요:** 밤마다 몰려오는 좀비에 대비해 방어 시설을 짓고 생존하는 오픈월드 멀티플레이 게임. Windows Server 기반 Dedicated Server 지원
- **담당 범위:** 전투, 장비, 좀비 AI와 멀티플레이 동기화, 런타임 최적화, 엔진 이전과 개발 인프라. 얼리 액세스 업데이트부터 2024년 5월 1.0 정식 출시까지 참여

#### 멀티플레이 동기화 최적화

- **과제:** 거리와 무관하게 소유 관계로 전달해야 하는 상태와, 인벤토리, 버프와 디버프, 퀘스트 진행도처럼 크고 자주 갱신되는 배열 데이터의 전송
- **판단:** Unreal Insights 분석을 바탕으로 복제 대상 선정과 변경분 전송을 나눠 최적화
- **수행:**
  - Replication Graph로 거리 기반 후보에 오너, 팀, 그룹에 종속된 액터와 부모 액터에 딸린 장착 장비, 탑승 대상을 더하는 연결별 복제 대상 선정 구성
  - Fast TArray Replication 기반 델타 동기화와 커스텀 NetSerialize 적용
  - RPC 기반 대용량 데이터 스트리밍 구현, Epic Online Services 세션을 멀티플레이 개설과 접속 과정에 연결
- **결과:** 복제 대상의 반복 검사와 전송 비용 절감

#### 다수 좀비 처리와 게임플레이

- **과제:** 다수 좀비가 동시에 움직이는 전투의 애니메이션, Tick과 네비게이션 비용
- **수행:**
  - Animation Budget Allocator, Significance Manager와 AnimURO를 적용 대상별로 운용하고 ACL로 애니메이션 데이터 압축
  - Tick과 네비게이션 인보커 비용 절감, 에셋 사전 로딩과 위젯 풀링 구현
  - 무기와 능력치, 버프와 디버프, 장비의 티어, 내구도, 파츠 개조, 보스와 일반 좀비 AI, 코스튬과 형상변환 DLC 구현
- **결과:** 얼리 액세스 기간의 개발 업데이트 #03부터 #19까지 담당 기능 반영, 2024년 5월 1.0 정식 출시

#### 엔진 이전과 개발 인프라

- **과제:** UE4에서 UE5로의 이전과 PhysX에서 Chaos로의 전환 과정에서 Chaos Destructible의 성능 제약으로 다수 오브젝트의 파괴 연출 처리가 어려운 상황
- **판단:** Chaos Destructible의 성능 제약 분석 결과에 따라 커스텀 Destructible 시스템 구현
- **수행:**
  - PhysX에서 Chaos로의 전환을 포함한 UE4에서 UE5로의 마이그레이션 주도, 일부 영역은 팀원과 분담
  - Jira, Confluence, Slack을 대체하는 JetBrains Space On-Premise 서버와 TeamCity 빌드, 패키징 자동화 구축, Shared DDC 운영
- **결과:** 다수 오브젝트의 파괴 연출 처리, 협업 도구와 빌드 자동화의 사내 서버 운영

[동기화 설계와 업데이트별 담당 업무](/projects/night-of-the-dead/)

## 삐요 스튜디오

2021.10 - 2023.12 / 비고용 팀 활동, 정규직과 병행 / 클라이언트 프로그래머

<a id="other-experience"></a>
<a id="a-street-cats-tale-2"></a>

### 길고양이 이야기 2

Unity, C#, Steamworks, STOVE SDK

- 2D 퍼즐 어드벤처의 세이브와 로드, 퀘스트, 대화, 이동, 컷신, 환경설정과 UI 등 주요 시스템 개발
- PlayStation, Nintendo Switch, Xbox 컨트롤러 입력과 Steamworks 업적, STOVE 구매 인증 연동, Synology NAS에 GitLab 저장소 서버 구축
- 스토어 등록부터 다국어 빌드 준비, 출시 빌드 검수와 업로드, 대응까지 출시 작업 전담, 2023년 2월 STOVE Windows 얼리 액세스, 6월 Steam Windows, macOS 정식 출시
- 프로젝트의 텀블벅 펀딩 목표 156% 달성, 도쿄 게임쇼 2023 참가, G-STAR 2023 Indie Awards Games for Impact 수상

[PC 출시와 전시, 수상 자료](/projects/a-street-cats-tale-2/)

<a id="nurhyme"></a>

## 누라임게임즈

2020.07 - 2020.08 / 인턴 / 게임 개발자

### Brutal League

Unity, C#, GameSparks

- Android용 격투 테마 방치형 게임의 클라이언트 개발 전담
- 캠페인 모드 구현, GameSparks 기반 보상 시스템과 서버 연동 개발

[담당 기능과 개발 기록](/projects/brutal-league/)

## 이메진템페스트 스튜디오

2019.06 - 2020.04 / 비고용 팀 활동 / 기획 및 클라이언트 프로그래머

### Vapor World

Unity, C#, Spine, URP

- 환자들의 내면 세계를 탐험하는 2D 사이드 스크롤 액션 어드벤처의 스토리와 세계관 구성
- 입력, 이동과 전투 시스템 구현, Unity 2D Light와 URP 기반 출품 빌드 제작 참여
- 참여 기간 중 프로젝트의 제11회 새로운 경기 게임오디션 공동 2위, MWU Korea Awards 2019 PC & Console 분야 Top 3 선정

[출품 영상과 개발 기록](/projects/vapor-world/)

<a id="army-software"></a>

## 육군

2018.03 - 2019.10 / 군 복무 / SW개발병

### 프로그램 개발과 시스템 운영

C#, WPF, VBA

- 전문특기병인 SW개발병으로 지원 복무, 기존 프로그램의 C#과 WPF 기반 이식 개발, VBA 기반 엑셀 데이터 정리 프로그램 개발
- 육군 지휘통제시스템의 장애 대응과 운영, 응용체계관리반 분대장 임무 수행

<a id="clicked"></a>

## 클릭트

2016.07 - 2018.02 / 정규직 / VR 소프트웨어 엔지니어

Unity 기반 VR 콘텐츠와 클라이언트, 서버 기능 개발. HTC Vive 트래커 정보를 소켓 통신으로 수신해 장치 간 위치와 자세 데이터를 VR 체험에 연결

### CircleVR

2017.06 - 2018.02 / Unity, C#, Gear VR, HTC Vive Tracker

- 여러 사용자가 동시에 체험하고 각 시점을 22대의 곡면 디스플레이에 공유하는 무선 VR 전시 시스템에서 장치 간 좌표계 보정과 체험자 시점의 외부 출력 연결 담당
- Gear VR 클라이언트를 외부 Vive Tracker의 6DoF 좌표계에 맞추고 장착 오프셋 보정
- 팀이 제작한 내부 콘텐츠 4개와 함께 홍익대학교 VR 뮤지엄 전시관에 설치

[전시 영상과 개발 기록](/projects/circle-vr/)

### Space Walker

2017.05 - 2017.06 / Unity, C#, Perception Neuron, GPU 파티클, onAirVR

- 홍익대학교 영상대학원과 산학협력으로 개발한 VR 공연 콘텐츠의 3D 배경 인터랙션 구현, 다수 파티클의 성능 부담을 줄이기 위해 GPU 파티클 시스템 적용
- Perception Neuron의 전신 모션을 Unity Humanoid 아바타에 실시간 적용하고 좌표축 차이 보정
- onAirVR로 VR 서버의 렌더링 결과를 무선 전송하는 팀 콘텐츠를 Unite ’17 Seoul 키노트 오프닝 공연으로 시연

[공연 영상과 개발 기록](/projects/space-walker/)

### 학도병의 편지

2017.05 - 2017.06 / Unity, C#, HTC Vive

- HTC Vive 기반 인터랙티브 무비 VR 콘텐츠 제작, 충남보훈관 VR 코너 전시

[전시 화면](/projects/student-soldiers-letter/)

### onAirVR

Unity, C#, OVR API, GoogleVR API

- PC 렌더링 결과와 모바일 HMD의 자세, 입력을 연결하는 스튜디오 클라이언트와 세션별 카메라 리그 구현
- Client 2.0(2017.01 - 2017.05)의 UI 개선, OVR API 대응과 Daydream용 GoogleVR API 연동, 사내 콘텐츠 3개의 데모 제작

[onAirVR Client 2.0 시연과 개발 기록](/projects/onairvr-client-2/)

### #BeFearless - Fear of Heights

2016.07 - 2016.12 / Unity, C#, Gear VR, Oculus Go, Gear S2

- 삼성 #BeFearless 캠페인의 고소공포증 훈련 VR 앱 외주 개발, Landscapes와 Cityscapes 두 빌드 제작
- Gear S2 스마트워치의 심박수 데이터 연동과 다국어 시스템 개발
- Gear VR과 Oculus Go 대응, Oculus Store에 두 앱 등록

[캠페인 영상과 개발 기록](/projects/be-fearless/)

<a id="webzen"></a>

## 웹젠

2015.12 - 2016.01 / 인턴 / 게임 디자이너

### 해녀와 바다

Unity, C#

- 국내 스낵컬처 게임 시장 조사와 분석 보고서 작성
- 교육용 게임 '해녀와 바다'의 제안서와 Unity 프로토타입 제작

[시연 영상과 제안서](/projects/haenyeo-and-the-sea/)

<a id="bitmango"></a>

## 비트망고

2014.07 - 2014.08 / 인턴 / 게임 디자이너

### 모바일 게임 4종

- 모바일 게임 Slots, SAMURAI STEPS, Pitter Patter, DRAWLINE 제작 참여
- 레벨과 콘텐츠 디자인, 사운드 발주와 QA 담당
