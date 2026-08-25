---
published: 2026-08-20T09:00:00+09:00
updated: 2026-08-22T03:14:04+09:00
author: Jihoon Jeon
title: '이직 준비: 2026.08 Unreal·Unity 클라이언트와 개발 PM 채용 분석'
description: 2026년 8월 22일 게임잡의 Unreal·Unity 클라이언트 및 엔진 개발, 개발 PM 공고를 다시 조사하고 반복 요구사항을 공개 이력서와 비교해 지원 트랙과 준비 우선순위를 정리합니다.
image: ./images/gamejob-logo-square-safe.avif
category: 커리어
tags:
  - unreal-engine
  - unity
  - job-market
---

이직 준비를 시작하면서 내가 해 온 일을 늘어놓기 전에, 지금 채용 시장이 무엇을 증거로 보는지부터 확인했다. 2026년 8월 22일 게임잡에서 Unreal·Unity 클라이언트 및 엔진 개발, 개발 PM 공고를 다시 찾았다. 상세 업무와 자격 요건은 [공개 이력서](/resume)에 하나씩 대조했다.

클라이언트 개발에서 눈에 띈 것은 엔진 사용 기간보다 출시된 제품에서 맡은 시스템과 해결한 문제였다. Unreal 공고는 전투·온라인·엔진 전문성에 따라 갈렸고 Dedicated Server, 프로파일링, Low Level 경험을 구체적으로 물었다. Unity 공고의 공통분모는 C#·객체지향, 상용 출시, 콘텐츠·UI·툴, 성능 분석이었다. 모바일 포지션으로 갈수록 네이티브 SDK·빌드·라이브 경험을 한층 깊게 확인했다.

개발 PM은 보는 지점이 달랐다. 일정과 마일스톤, 부서 간 의존성, 위험과 이슈, 개발 프로세스를 실제로 운영해 봤는지가 기준이었다. 내 경력에서 이에 가까운 대목은 모호한 요구를 구현 단위로 바꾸고 기획·아트·TA·QA·서비스 사이를 조율한 경험이다. 빌드·배포·QA 흐름을 기술적으로 지원한 일도 옮겨 쓸 만하다. 하지만 프로젝트 일정·우선순위·예산·인력을 직접 소유했다는 공개 근거는 없다. 지금은 경력 개발 PM보다 기술 이해도가 높은 개발 PM 전환 후보라고 보는 쪽이 정확하다.

## 조사 범위와 방법

조사는 8월 22일 오전에 했다. 게임잡 검색 결과를 모은 다음 각 상세 페이지를 다시 열었다. Unreal 쪽에서는 [‘언리얼’ 66건](https://www.gamejob.co.kr/Recruit/joblist?menucode=searchtot&searchtype=all&searchstring=%EC%96%B8%EB%A6%AC%EC%96%BC), [‘Unreal’ 88건](https://www.gamejob.co.kr/Recruit/joblist?menucode=searchtot&searchtype=all&searchstring=Unreal), [‘UE5’ 33건](https://www.gamejob.co.kr/Recruit/joblist?menucode=searchtot&searchtype=all&searchstring=UE5)이 잡혔다. 같은 공고 번호를 빼고 남은 결과는 141건이다. Unity 쪽은 [‘유니티’ 30건](https://www.gamejob.co.kr/Recruit/joblist?menucode=searchtot&searchtype=all&searchstring=%EC%9C%A0%EB%8B%88%ED%8B%B0)과 [‘Unity’ 79건](https://www.gamejob.co.kr/Recruit/joblist?menucode=searchtot&searchtype=all&searchstring=Unity)을 합친 뒤 중복을 빼 92건으로 좁혔다.

개발 PM은 붙여 쓴 [‘개발PM’ 검색 결과 20건](https://www.gamejob.co.kr/Recruit/joblist?menucode=searchtot&searchtype=all&searchstring=%EA%B0%9C%EB%B0%9CPM)을 출발점으로 삼았다. ‘개발 PM’처럼 띄어 쓰면 177건이 나오지만 두 단어가 넓게 매칭돼 사업·서비스 PM과 다른 직군까지 끼어든다. 제목과 본문이 개발 PM 업무를 직접 가리키는지 살펴본 뒤 묶음 채용, 헤드헌터 중복을 제외했다.

| 조사 축 | 중복 제거 원시 결과 | 조건을 통과한 직접 공고 | 회사 수 | 이번 글에서 상세 코딩한 표본 |
| --- | ---: | ---: | ---: | ---: |
| Unreal 클라이언트·엔진 | 141건 | 29건 | 13곳 | 12건 |
| Unity 클라이언트·엔진 | 92건 | 31건 | 22곳 | 12건 |
| 개발 PM | 20건 | 17건 | 14곳 | 14건 |

클라이언트 개발 공고에는 다음 조건을 똑같이 적용했다.

- 조사 시점에 지원 가능하며 정규직 지원 경로가 있는 공고
- Unreal Engine 또는 Unity 기반 게임 클라이언트·엔진 프로그래밍 역할
- 담당 업무와 자격·우대 요건이 구체적으로 공개된 공고
- 전투·콘텐츠·온라인·플랫폼·엔진 가운데 책임 범위가 드러나는 직무

전체 규모를 센 뒤에는 역할을 자세히 비교하기 좋은 Unreal 12건과 Unity 12건을 목적 표본으로 골랐다. Unity 표본에는 이력서와 잘 맞는 공고만 담지 않았다. 콘텐츠·모바일 라이브·플랫폼 SDK·엔진 최적화가 고르게 보이도록 구성했다. 개발 PM 전용 공고 17건은 모두 목록에 넣었고 요구 신호는 상세 업무를 텍스트로 충분히 읽은 14건에서만 셌다.

숫자를 읽을 때 주의할 점이 있다. 게임 업계 전체 통계가 아니라 검색어와 조사 시점, 상세 페이지의 공개 범위에 따라 달라지는 결과다. 같은 프로젝트의 세부 직무가 여러 건 들어갈 수도 있다. 모집 인원도 대부분 `O명`이라 실제 채용 좌석 대신 서로 다른 역할 공고 수를 셌다. 게임잡과 회사 원문이 다를 때는 회사 원문을 따랐다. 지원 직전에는 공고가 바뀌거나 끝났는지 다시 확인한다.

## Unreal Engine 클라이언트·엔진 공고

엄격 조건을 통과한 공고는 13개 회사 29건이다. 경력직 28건에 신입은 1건뿐이었다. 지역도 서울 16건·성남 13건으로 모두 수도권에 몰렸다. 게임플레이·콘텐츠·일반 클라이언트가 17건, 엔진·그래픽스·물리가 12건이었다.

### 상세 비교 표본 12건

| 회사·포지션 | <span class="whitespace-nowrap">경력</span> | 공고에서 확인한 핵심 요구 | <span class="whitespace-nowrap">마감</span> |
| --- | ---: | --- | --- |
| NX3GAMES · [OUTANT 클라이언트 전투](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283693) ([회사 상세](https://nx3games.career.greetinghr.com/ko/o/232535)) | <span class="whitespace-nowrap">5년 이상</span> | UE5 멀티플레이 ARPG 전투, Unreal 클라이언트, C++·객체지향, 협업. Unreal 출시와 Dedicated Server 멀티플레이 경험 우대 | <span class="whitespace-nowrap">상시</span> |
| NX3GAMES · [OUTANT 클라이언트 콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283691) ([회사 상세](https://nx3games.career.greetinghr.com/ko/o/232531)) | <span class="whitespace-nowrap">5년 이상</span> | 액션·RPG 시스템 콘텐츠, Unreal 클라이언트, C++·객체지향, 협업. Unreal 출시와 Dedicated Server 멀티플레이 경험 우대 | <span class="whitespace-nowrap">상시</span> |
| 스마일게이트 · [LOST ARK Mobile 전투 콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283315) ([회사 상세](https://careers.smilegate.com/apply/announce/view?seq=3354)) | <span class="whitespace-nowrap">3년 이상</span> | 모바일 전투·연출, UE5, C++·객체지향과 협업. 액션 전투·카메라 연출 경험 우대 | <span class="whitespace-nowrap">8월 31일</span> |
| 스마일게이트 · [LOST ARK Mobile 콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283318) ([회사 상세](https://careers.smilegate.com/apply/announce/view?seq=3179)) | <span class="whitespace-nowrap">5년 이상</span> | 게임 콘텐츠·UI·서버 연동·개발 도구, 모바일 개발과 라이브. UE4/5, C++와 Unreal Slate UI 이해 우대 | <span class="whitespace-nowrap">8월 31일</span> |
| 스마일게이트 · [LOST ARK Mobile 레벨 콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282521) ([회사 상세](https://careers.smilegate.com/apply/announce/view?seq=6136)) | <span class="whitespace-nowrap">3년 이상</span> | 퀘스트·카메라·시퀀스, C/C++, UE5, 객체지향과 협업. 모바일 라이브·MMORPG 경험 우대, 포트폴리오 필수 | <span class="whitespace-nowrap">8월 31일</span> |
| 스마일게이트 · [차세대 게임 UE5 엔진 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283239) ([회사 상세](https://careers.smilegate.com/apply/announce/view?seq=5912)) | <span class="whitespace-nowrap">5년 이상</span> | 오픈월드 멀티플레이, UE5 Dedicated Server 개발·최적화, 네트워크 동기화와 TCP/UDP. 다중 플랫폼 프로파일링·출시 경험 우대 | <span class="whitespace-nowrap">8월 31일</span> |
| 크로노스튜디오 · [Chrono Odyssey 전투](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282341) ([회사 상세](https://chronostudio.career.greetinghr.com/ko/o/226429)) | <span class="whitespace-nowrap">6년 이상</span> | MMORPG 전투, 상태 동기화·지연 보정·대규모 전투, Unreal 애니메이션·멀티스레딩·최적화. PC·콘솔 경험 우대 | <span class="whitespace-nowrap">채용시</span> |
| 크로노스튜디오 · [Chrono Odyssey 콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281910) ([회사 상세](https://chronostudio.career.greetinghr.com/ko/o/159545)) | <span class="whitespace-nowrap">3년 이상</span> | 비전투 콘텐츠, UI/UX, Blueprint와 C++, 커스텀 에디터·파이프라인, 변경에 유연한 구조와 협업 | <span class="whitespace-nowrap">채용시</span> |
| 크로노스튜디오 · [Chrono Odyssey 엔진](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282976) ([회사 상세](https://chronostudio.career.greetinghr.com/ko/o/213431)) | <span class="whitespace-nowrap">3년 이상</span> | UE4/5 엔진 수정, 그래픽 API, CPU/GPU 하드웨어 이해, Deep Profiling, RHI Thread·RDG. 콘솔·셰이더·DCC 자동화 우대 | <span class="whitespace-nowrap">9월 20일</span> |
| 빅파이어게임즈 · [클라이언트 프로그래머](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=280913) ([회사 상세](https://bigfiregames.career.greetinghr.com/ko/o/148319)) | <span class="whitespace-nowrap">2년 이상</span> | C/C++, 3D 그래픽스·선형대수, Unreal 시스템·콘텐츠·UI와 유지보수. FPS/TPS·Unreal 출시·UMG 우대 | <span class="whitespace-nowrap">채용시</span> |
| 크래프톤 PUBG STUDIOS · [Sr. Engine Engineer](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281930) | <span class="whitespace-nowrap">게임잡 7년 이상</span> | UE4/5 Core·Memory Allocator·File System, 로딩·메모리·런타임 최적화, C++와 H/W·OS. 엔진 소스·콘솔·PIX·RenderDoc·VTune 우대 | <span class="whitespace-nowrap">채용시</span> |
| 넥슨게임즈 · [Woochi the Wayfarer 엔진 프로그래머](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281193) | <span class="whitespace-nowrap">10년 이상</span> | UE5 엔진·플러그인·툴, PC·콘솔 최적화, 요구 분석·설계·구현과 협업. 엔진 소스·렌더링 파이프라인·상용화 경험 우대 | <span class="whitespace-nowrap">채용시</span> |

> 크래프톤 공고는 게임잡 상단에 경력 7년 이상으로 표시되지만 상세 본문은 엔진 개발 또는 상용 엔진 사용 5년 이상을 요구한다.
>
> 마감 상태는 2026년 8월 22일 확인 기준이다. 스마일게이트 네 공고는 회사 채용 페이지의 8월 31일을 따랐다.

표본 밖에서는 8월 21일 등록된 니오스트림의 [Little Devil Inside 그래픽스 엔지니어](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=284075)가 새로 눈에 들어왔다. UE5·C++·HLSL과 Nanite·Lumen·Ray Tracing, 최적화·프로파일링을 함께 요구하는 자리다. 표본 수를 유지하려고 기존 공고와 바꾸지는 않았다. 다만 엔진·그래픽스가 별도 전문 트랙이라는 흐름은 여기서도 확인된다.

## Unity 클라이언트·엔진 공고

검색 결과 안에서 엄격 조건을 통과한 공고는 22개 회사 31건이다. 경력 하한을 둔 자리가 22건, 경력 무관이 9건이었으며 신입 전용 공고는 없었다. 29/31이 수도권에 있었다. 서울 22건, 경기 6건, 수도권 복수 지역 1건이고 대구와 대전은 각각 1건이다. 일반 클라이언트·게임 로직·콘텐츠가 26건으로 대부분을 차지했다. 엔진·엔진 인터페이스는 3건, 빌드·툴·시스템·SDK는 2건이다.

검색 합집합에서 빠진 활성 공고도 있었다. 아래 표본에 든 네오플·에피드게임즈·시프트업 공고는 검색 결과에 나타나지 않았지만 상세 페이지가 열려 있었고 정규직 지원도 가능했다. 31건은 이 검색 조건에서 재현되는 활성 역할 수다. Unity 시장의 완전한 총량으로 읽을 수는 없다.

### 상세 비교 표본 12건

| 회사·포지션 | <span class="whitespace-nowrap">경력</span> | 공고에서 확인한 핵심 요구 | <span class="whitespace-nowrap">마감</span> |
| --- | ---: | --- | --- |
| 네오플 · [[프로젝트 DL] UI 콘텐츠 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282745) | <span class="whitespace-nowrap">3년 이상</span> | Unity·C#·UGUI, 이벤트·상점·보상 UI, 리소스·애니메이션·인터랙션, 유지보수와 최적화. 모바일 출시·라이브 경험 우대 | <span class="whitespace-nowrap">채용시</span> |
| 네오위즈 ASTRA9 Studio · [내러티브 중심 RPG 신작 클라이언트](https://jobs.lever.co/neowiz/c3704f2e-5921-49f2-a9c2-8857696d846f) | <span class="whitespace-nowrap">5년 이상</span> | 글로벌 PC·콘솔 RPG의 Unity 기능·콘텐츠, Unity 3D·Git, 분석적 문제 해결과 협업. Unity 3D 상용 출시 경험 우대, 포트폴리오 필수 | <span class="whitespace-nowrap">채용시</span> |
| 기어세컨드 · [[프린세스 메이커] 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283215) ([회사 상세](https://gear2.recruit.roundhr.com/c/HSfYtc6rRQ)) | <span class="whitespace-nowrap">1~5년</span> | Steam Unity 클라이언트의 UI·콘텐츠·툴과 타 플랫폼 포팅, C#·UGUI, 자료구조·알고리즘·객체지향, Steam 개발·라이브와 협업 | <span class="whitespace-nowrap">상시</span> |
| 베이글코드 · [[Platform] 게임 플랫폼 클라이언트 SDK](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=269652) ([회사 상세](https://career.bagelcode.com/ko/career)) | <span class="whitespace-nowrap">5년 이상</span> | Unity·Android·iOS SDK와 네이티브 연동, 아키텍처, 통합 빌드·스토어 배포, 샘플·검증 자동화. SDK 라이브 적용과 팀 리딩·협업 | <span class="whitespace-nowrap">상시</span> |
| 111퍼센트 · [게임 엔진 개발자—Unity & Interface](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283957) ([회사 상세](https://111percent.career.greetinghr.com/ko/o/233499)) | <span class="whitespace-nowrap">5년 이상</span> | C++ 코어와 C#·Unity Bridge/SDK/API, 멀티플레이 동기화, GC·CPU·frame-time 프로파일링, Editor·디버깅 툴과 문서화. DOTS·Burst·네이티브 플러그인 우대 | <span class="whitespace-nowrap">채용시</span> |
| 겜프스엔 · [[브라운더스트2] Unity 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283723) | <span class="whitespace-nowrap">10년 이상</span> | Unity·C#·UGUI, 모바일 최적화, 클라이언트-서버 구조·네트워크 동기화, Addressables와 협업. Timeline·URP·셰이더·비동기 프로그래밍 우대 | <span class="whitespace-nowrap">채용시</span> |
| 위메이드커넥트 · [신규 프로젝트 Unity 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283104) | <span class="whitespace-nowrap">3~5년</span> | Cocos2d→Unity 포팅·구조 개선, 시스템·콘텐츠·라이브 이슈, Unity·C# 출시, 자료구조·알고리즘·객체지향과 협업. 모바일 SDK·빌드·최적화와 Steam 경험 우대 | <span class="whitespace-nowrap">채용시</span> |
| 에피드게임즈 · [[트릭컬 파티마] 콘텐츠 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281993) | <span class="whitespace-nowrap">5년 이상</span> | Unity 6.3 콘텐츠·UI·내부 툴, 상용 Unity 출시, C#·객체지향·소켓·UGUI. AssetBundle·SRP·Profiler·빌드 파이프라인과 모바일 네이티브 플러그인 | <span class="whitespace-nowrap">채용시</span> |
| 신지게임즈 · [Unity 클라이언트 시니어](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282496) | <span class="whitespace-nowrap">7년 이상</span> | 모바일·멀티플랫폼 RPG의 시니어 Unity 클라이언트, C#·C++, iOS·Android 대응과 팀 리딩. 이력서·경력기술서·포트폴리오 제출 | <span class="whitespace-nowrap">채용시</span> |
| 슈퍼센트 · [클라이언트 개발자](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282501) ([상세 요건](https://career.rememberapp.co.kr/job/posting/327045)) | <span class="whitespace-nowrap">5년 이상</span> | 글로벌 모바일 게임의 핵심 시스템·플레이 로직·확장 가능한 구조, Unity·C#, 성능 최적화·디버깅과 AI 도구 활용. 대형 모바일·라이브와 아키텍처 경험 우대 | <span class="whitespace-nowrap">채용시</span> |
| 시프트업 · [[승리의 여신: 니케] 엔진 최적화](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282062) ([회사 상세](https://career.shiftup.co.kr/ko/o/155988)) | <span class="whitespace-nowrap">5년 이상</span> | 런타임 애셋 로딩·메모리·성능 분석, 엔진 툴·플랫폼·빌드 개선, Unity·C#, 렌더링·셰이더·멀티스레딩. C/C++·모바일 네이티브·Unreal 우대 | <span class="whitespace-nowrap">채용시</span> |
| 에이시티게임즈 · [헬로키티 마이 드림 스토어 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283792) | <span class="whitespace-nowrap">5년 이상</span> | 모바일 캐주얼·SNG 클라이언트, Unity 실무, UGUI·Spine·외부 SDK·Git. 이력서·경력기술서와 포트폴리오 제출 | <span class="whitespace-nowrap">채용시</span> |

> 12건 모두 2026년 8월 22일에 지원 가능한 상태를 다시 확인했다. 네오위즈 공고는 기존 ROUND8 표기가 아니라 현재 회사 원문의 ASTRA9 Studio 명칭을 반영했다.

## 개발 PM 공고

‘개발PM’ 검색 결과 20건에서 묶음 공고와 헤드헌터·중복 게시물을 빼자 14개 회사의 전용 공고 17건이 남았다. 13건은 경력을 요구했고 4건은 경력 하한이 없었다. 그중 3건에는 신입 지원이 명시돼 있었다. 최소 경력의 분포는 1년 이상 2건, 2년 이상 1건, 3년 이상 6건, 4년 이상 2건, 5년 이상 2건이다. 지역은 서울 10건과 성남 7건으로 전부 수도권이었다. 15건은 정규직만 뽑았고 나머지 2건은 계약직 또는 인턴도 열어 뒀다. 8월 신규 등록은 3건, 나머지는 5~7월부터 이어진 재고다.

### 확인한 전용 공고 17건

| 회사·포지션 | <span class="whitespace-nowrap">경력</span> | 공고에서 확인한 핵심 업무·신호 | <span class="whitespace-nowrap">마감·고용</span> |
| --- | ---: | --- | --- |
| 에이블게임즈 · [크레센트 개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283164) | <span class="whitespace-nowrap">3년 이상</span> | WBS·세부 일정, 마일스톤 진행, 협업, 프로세스 개선, 위험 식별·대응 | <span class="whitespace-nowrap">채용시·정규직</span> |
| 기어세컨드 · [개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282107) | <span class="whitespace-nowrap">1년 이상</span> | 프로젝트 일정·이슈와 협업 운영 | <span class="whitespace-nowrap">채용시·정규직</span> |
| 엔씨소프트 · [AION2 개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=284001) | <span class="whitespace-nowrap">3년 이상</span> | 일정·프로세스·리소스, 빌드 스펙과 산출물 관리 | <span class="whitespace-nowrap">9월 17일·정규직</span> |
| 에이버튼 · [Project EA 개발 프로젝트 매니저](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283864) | <span class="whitespace-nowrap">3년 이상</span> | PC·콘솔 Unreal 프로젝트 일정·진척·위험, 외부 파트너, Jira·Confluence | <span class="whitespace-nowrap">채용시·정규직</span> |
| 크래프톤 PUBG STUDIOS · [PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283773) | <span class="whitespace-nowrap">5년 이상</span> | Unreal 프로젝트의 제작 일정·품질·위험, 협업 도구와 영어 | <span class="whitespace-nowrap">채용시·정규직</span> |
| 넷마블네오 · [개발 3본부 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281427) | <span class="whitespace-nowrap">3년 이상</span> | 개발 PM 실무와 포트폴리오 제출 | <span class="whitespace-nowrap">채용시·정규직</span> |
| 스마일게이트 슈퍼크리에이티브 · [카오스 제로 나이트메어 개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283203) | <span class="whitespace-nowrap">5년 이상</span> | 개발 일정·위험·프로세스, 중국 퍼블리셔와 협업 | <span class="whitespace-nowrap">채용시·정규직</span> |
| 웹젠 · [개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282345) | <span class="whitespace-nowrap">2년 이상</span> | PC 라이브·신규 프로젝트 이슈와 위험, 일정·프로세스 개선 | <span class="whitespace-nowrap">채용시·정규직</span> |
| 시프트업 · [스텔라 블레이드 차기작 개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281666) | <span class="whitespace-nowrap">신입 또는 5년 이하</span> | 킥오프부터 마일스톤까지 일정, 결정·액션·우선순위, 부서 간 이슈와 AI 자동화 | <span class="whitespace-nowrap">채용시·정규직</span> |
| 시프트업 · [프로젝트 스피릿 개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281606) | <span class="whitespace-nowrap">4년 이상</span> | 로드맵·일정·리소스·병목, 마일스톤과 위험, 협업 도구·AI 활용 | <span class="whitespace-nowrap">채용시·정규직</span> |
| 스마일게이트 · [LOST ARK Mobile 개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281298) | <span class="whitespace-nowrap">4년 이상</span> | 일정, 부서와 해외 파트너 조율, MMORPG·대규모 조직·개발 프로세스 | <span class="whitespace-nowrap">채용시·정규직</span> |
| 스마일게이트 · [LOST ARK 개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281325) | <span class="whitespace-nowrap">3년 이상</span> | 콘텐츠·라이브 통합 일정, 이슈와 외부 협업, Jira·Confluence, 빌드·브랜치·배포 | <span class="whitespace-nowrap">채용시·정규직</span> |
| 시프트업 · [승리의 여신: 니케 개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=280653) | <span class="whitespace-nowrap">신입 또는 2년 이하</span> | 일정·프로세스, 부서 간 문제 해결·정보 공유, 버전·이슈·협업 도구 | <span class="whitespace-nowrap">채용시·정규직</span> |
| 엑소게임즈 · [개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282930) | <span class="whitespace-nowrap">3년 이상</span> | 스프린트·마일스톤, 빌드 QA·배포 검토, 위험과 우선순위, 문서·프로세스 | <span class="whitespace-nowrap">9월 21일·계약 후 전환 검토</span> |
| 티쓰리엔터테인먼트 · [글로벌 개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281830) | <span class="whitespace-nowrap">경력 무관</span> | 글로벌 PC 게임 마일스톤, 개발 프로세스·일정·테이블·테스트 | <span class="whitespace-nowrap">채용시·정규직</span> |
| 프로젝트클라우드게임즈 · [스튜디오 매니저·개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282012) | <span class="whitespace-nowrap">신입 가능</span> | 일정·마일스톤·업무, 이슈·버그·위험, 퍼블리셔·외부 협업과 스튜디오 운영 | <span class="whitespace-nowrap">채용시·고용형태 혼합</span> |
| 블루포션게임즈 · [에오스 블랙 개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=280715) | <span class="whitespace-nowrap">1년 이상</span> | 라이브 이슈·위험, 개발 프로세스와 일정, 문서, Redmine·Git·Jenkins | <span class="whitespace-nowrap">채용시·정규직</span> |

에이블게임즈와 기어세컨드는 핵심 요건을 이미지로 올렸다. 넷마블네오의 공개 텍스트는 포트폴리오 안내가 중심이었다. 세 공고를 빼고 업무·자격 요건을 충분히 읽을 수 있었던 14건만 아래 빈도표의 분모로 삼았다.

| 개발 PM 요구 신호 | 확인 빈도 | 읽히는 업무 |
| --- | ---: | --- |
| 일정·마일스톤 관리 | 14/14 | 로드맵에서 WBS·스프린트·릴리스까지 작업 순서와 진척을 이어서 본다. |
| 부서·외부 파트너 협업 | 14/14 | 기획·개발·아트·QA·퍼블리셔의 의존성을 풀고 필요한 결정을 잇는 일이다. |
| 프로세스·파이프라인 개선 | 13/14 | 반복되는 병목이나 전달 누락을 찾아 작업 방식을 손본다. |
| 위험·이슈 관리 | 11/14 | 일정 충돌과 품질·개발 위험을 일찍 꺼내 놓고 대응이 끝날 때까지 쫓는다. |
| Jira·Confluence·Slack·Redmine·Notion 등 도구 | 11/14 | 업무와 결정, 문서를 나중에도 팀이 찾을 수 있게 남긴다. |
| 빌드·버전 관리·CI/CD·배포 | 8/14 | 직접 코드를 짜기보다는 빌드 상태와 브랜치·버전·QA·릴리스 흐름을 맞춘다. |
| Unreal·UE5 직접 언급 | 3/14 | 기술 프로젝트에서는 엔진 이해가 유리하지만 모든 공고가 요구하지는 않았다. |

## 세 직무군에서 반복된 신호

### 클라이언트 개발은 역할 전문성으로 갈린다

클라이언트 표본은 담당 업무·필수·우대에 신호가 명시된 경우만 공고당 한 번 셌다. 엔진을 쓴다는 이유만으로 당연히 알 것이라 추론한 기술은 제외했다. 한 공고가 여러 항목에 들어가는 것은 허용했다.

| 공통 요구 신호 | Unreal 표본 | Unity 표본 | 해석 |
| --- | ---: | ---: | --- |
| 경력 하한 3년 이상 | 11/12 | 11/12 | 튜토리얼을 끝냈다는 말로는 부족하다. 실제 프로젝트에서 맡은 책임과 해결 사례를 전제로 한다. |
| 경력 하한 5년 이상 | 7/12 | 9/12 | 이번 Unity 표본에는 시니어·리드와 엔진·SDK 역할이 특히 많이 들어갔다. |
| 협업·커뮤니케이션·문서화 | 10/12 | 11/12 | 기획·아트·서버·플랫폼 팀의 요구를 어떻게 맞췄는지도 기술 증거로 취급한다. |
| 출시·상용화·라이브 경험 | 9/12 | 9/12 | 구현에 그치지 않고 최적화·장애·빌드·플랫폼 문제까지 마무리한 경험을 찾는다. |
| 성능·메모리·프로파일링·최적화 | 5/12 | 9/12 | Unreal 엔진 전담 직무와 이번 Unity 표본의 모바일·SDK·엔진 직무에서 자주 나왔다. |
| 툴·에디터·SDK·빌드·자동화 | 6/12 | 8/12 | 콘텐츠를 만드는 과정과 배포 생산성도 개발자의 책임 범위에 들어간다. |
| 멀티플랫폼·콘솔·포팅·기기 대응 | 6/12 | 7/12 | PC 한 환경에서 기능을 만든 경험만으로 시니어 플랫폼 역할을 설명하기는 어렵다. |
| 서버·네트워크·멀티플레이·동기화 | 5/12 | 4/12 | 구현법은 엔진마다 달라도 상태 소유권과 동기화 비용을 설명해야 하는 독립 트랙이다. |
| UI 프레임워크·UI 콘텐츠 | 3/12 | 5/12 | 콘텐츠 직무는 엔진 언어뿐 아니라 UMG·Slate 또는 UGUI 실무를 구체적으로 묻는다. |

Unreal 실무가 핵심인 공고는 Unreal 표본의 9/12였고 C/C++·객체지향을 필수 또는 핵심으로 둔 공고는 8/12였다. Dedicated Server·Replication과 엔진 소스·RHI·RDG가 역할을 가르는 신호였다. Unity 표본에서는 9/12가 C#을 본문에 명시했다. 구조 설계·자료구조·알고리즘·객체지향 또는 엔진 내부 구조를 적은 공고는 9/12였다. UGUI만 보는 것도 아니었다. Addressables·AssetBundle·URP, 모바일 네이티브 연동, SDK·스토어 배포, DOTS·Burst가 역할에 따라 따로 등장했다.

이 차이에는 표본 구성도 한몫했다. Unreal 쪽에는 한 대형 프로젝트의 전투·콘텐츠·레벨 직무를 나눠 담은 반면, Unity 쪽에는 모바일 라이브, PC·Steam, 플랫폼 SDK와 엔진 최적화 역할을 넓게 배치했다. 그래서 `9/12 대 5/12` 같은 차이를 엔진의 시장점유율이나 절대 수요로 해석해서는 안 된다.

역할로 다시 묶으면 클라이언트 개발은 네 갈래다.

1. **게임플레이·콘텐츠·UI**: 전투, 퀘스트, 플레이 로직, 카메라·시퀀스, UI와 제작 도구를 맡는다. 경험은 Unreal의 C++·Blueprint·UMG, Unity의 C#·UGUI와 데이터·에셋 흐름으로 드러난다.
2. **온라인·네트워크**: 서버 권한, 상태 동기화, 지연과 대규모 부하가 주된 문제다. Unreal의 Dedicated Server·Replication과 Unity의 소켓·멀티플레이 SDK는 기술 이름만 다를 뿐 같은 시스템 질문으로 이어진다.
3. **플랫폼·출시·SDK**: 빌드, 스토어, 네이티브 연동, 포팅과 자동화를 다룬다. 이번 Unity 표본에서는 모바일 SDK와 Steam·다중 플랫폼 경험이 별도 역할로 또렷하게 나타났다.
4. **엔진·성능**: 메모리·로딩·렌더링, 프로파일링, 엔진 소스 또는 Bridge/API의 영역이다. 몇 개의 기능을 만들었는지보다 원인을 어떻게 분석했고 여러 팀이 재사용할 해결책을 남겼는지가 중요하다.

직무명은 모두 클라이언트 프로그래머에 가깝다. 그래도 면접에서 확인하는 증거는 서로 다르다. 모든 기술을 한 장에 같은 비중으로 늘어놓지 말고 지원 트랙에 맞춰 대표 사례의 순서를 바꾸는 편이 낫다.

### 개발 PM은 기술보다 소유 범위를 묻는다

개발 PM 공고에서 엔진 이름이 직접 나온 경우는 3/14에 그쳤다. 일정과 협업은 14/14, 프로세스는 13/14였다. 개발 지식이 있으면 회의에서 기술 제약을 알아듣고 빌드·QA·배포 흐름을 파악하기 좋다. 그렇다고 코딩 경력이 그대로 PM 경력이 되지는 않는다. 일정 충돌을 누가 드러냈는지, 의존성을 어떻게 정리했는지, 판단을 어디에 기록하고 끝까지 추적했는지가 핵심이다.

신입 가능 공고가 3건이어서 전환 경로가 완전히 닫힌 것은 아니다. 다만 17건 중 13건이 경력을 요구했고 8월 신규 등록도 3건뿐이었다. 개발 PM을 개발자의 우회 지원처로 여길 수 없는 이유다. 지금까지 맡은 조율과 운영 범위를 먼저 검증한 뒤 별도 이력서로 접근해야 한다.

### 출시 경험은 결과보다 문제의 범위를 보여 준다

Unreal·Unity 표본에서 출시·라이브 경험은 각각 9/12에 등장했다. 단순히 출시작이 있는지를 묻는다기보다 어떤 범위의 문제를 풀어 봤는지 확인하는 신호에 가깝다. 개발 막바지에는 메모리와 프레임타임, 패키징, 플랫폼 SDK, 데이터 호환성, 콘텐츠 회귀와 일정 사이의 선택이 한꺼번에 생긴다. 같은 구간을 개발 PM은 마일스톤, 부서 간 의존성, 위험과 배포 판단의 문제로 다룬다.

개발 포트폴리오는 기능 목록 대신 문제 → 제약 → 분석 → 구현 → 측정 → 결과의 흐름으로 쓰는 편이 낫다. PM 전환 사례는 요청 → 의존성 → 일정·위험 → 결정 → QA·배포 순서가 알맞다. 어느 쪽이든 실제로 맡지 않은 소유권을 보태면 안 된다.

## 내 이력서와 시장 요구의 비교

현재 [이력서](/resume)에서 확인되는 UE4/5·C++ 경력은 2021년 1월부터 2026년 4월까지 5년 이상이다. 실시간 클라이언트 개발은 2016년에 시작했다. Unity 역시 학습 이력만 있는 것이 아니라 VR 정규직 프로젝트와 출시된 PC·macOS 게임이 근거로 남아 있다. PM 적합도를 볼 때는 개발 경력을 직함으로 바꾸지 않고 공개된 업무 증거만 비교했다.

| 시장 요구 | 현재 이력서의 근거 | 판단과 보완점 |
| --- | --- | --- |
| UE4/5·C++ | Night of the Dead와 CINEVStudio, UE4→UE5 마이그레이션 | **강함.** Unreal 게임플레이·온라인에 바로 가져갈 수 있는 근거다. |
| Unity·C# | Clicked VR, Vapor World, 길고양이 이야기 2의 Unity·C# 개발 | **강함.** 다만 이력서에 적힌 마지막 Unity 프로젝트가 2023년에 끝나 최신 버전의 최근성은 보완 대상이다. |
| 게임플레이·콘텐츠·UI | UE 전투·AI·던전·UMG, Unity 입력·이동·전투·퀘스트·대화·컷신·UI | **강함.** 양쪽 엔진의 콘텐츠 직무에 곧바로 연결된다. |
| 멀티플레이·실시간·XR | UE 최대 16인과 Replication Graph·Fast TArray·RPC·EOS, Unity VR 소켓 스트리밍·6DoF 정합·Humanoid 리타기팅 | **강함.** 별도 근거가 약한 부분은 Dedicated Server 운영, 지연 보정·예측, 치팅 대응이다. |
| 최적화·프로파일링·툴 | replication 비용 개선, 200개체 AI·애니메이션 최적화, Sequencer·MovieScene·Commandlet·Remote Control API | **강함.** 측정 도구와 하드웨어·부하 시나리오까지 붙이면 다른 엔진에도 옮겨 갈 증거가 된다. |
| 출시·빌드·상점·플랫폼 | Night of the Dead 1.0, 길고양이 이야기 2의 Windows·macOS 출시, Steamworks·Stove·EOS, TeamCity·GitLab CI/CD와 패키징 해결 | **강함.** 세 종류 컨트롤러 대응은 분명한 강점이다. 콘솔 출시 경험으로 표현해서는 안 된다. |
| 모바일·라이브·네이티브 SDK | 짧은 Android 프로젝트와 GameSparks 보상 시스템 | **중간 이하.** 최근 iOS·Android 빌드와 장기 라이브 운영, 네이티브 플러그인 리딩이 핵심인 Unity 공고와는 간극이 크다. |
| 엔진 Low Level·최신 Unity 전문기술 | UE 마이그레이션·빌드·성능 문제 해결 | **보완 필요.** RHI·엔진 메모리/파일/로딩·콘솔, Unity 6·Addressables·DOTS/Burst·네이티브 플러그인은 공개 근거가 부족하다. |
| 요구 구조화·직군 간 조율 | 모호한 요구를 구현 단위와 데이터 계약으로 바꾸고 기획·아트·TA·QA·서비스 사이의 기능·데이터 경계를 조율 | **강함.** 개발 PM 전환과 가장 가까운 근거다. 충돌한 요구와 결정 기준, 후속 결과를 한 사례로 묶을 수 있다. |
| 문서·개발 프로세스 | Linear 이슈·명세·ADR·테스트·PR, 절차와 인수인계 문서 | **강함.** 문서의 양보다는 누가 어떤 결정을 내렸고 다음 행동으로 어떻게 이어졌는지를 보여 줘야 한다. |
| 일정·마일스톤·의존성·리소스 | 공개 이력서에 직접 소유했다는 사례 없음 | **핵심 간극.** 협업과 기술 리딩을 프로젝트 일정·인력 운영 경험으로 바꿔 적어서는 안 된다. |
| 위험·이슈 관리 | 빌드·배포·QA 문제 추적과 기술적 해결 | **전이 가능.** 일정 영향 평가부터 위험 등록부, 에스컬레이션, 종료까지 PM으로 소유한 근거는 부족하다. |
| 글로벌 이해관계자 협업 | 5개 언어 출시 참여, OPIc IM2·JLPT N4 | **보완 필요.** 공개 이력서에서는 해외 퍼블리셔·스튜디오와 직접 합의하고 전달한 사례가 보이지 않는다. |
| 최근성·공개 증거 | 2026년의 최신 공개 프로젝트는 Rust·Bevy·WebGPU 기반 Shotloom | **보완 필요.** 먼저 기존 출시작 사례를 공개 가능한 형태로 정리한다. 작은 최신 엔진 샘플은 지원 트랙에 필요할 때만 추가한다. |

### 가장 가까운 지원 트랙

1. **Unreal 게임플레이·온라인**: UE5·C++, 전투·AI·UI, 16인 replication과 최적화가 직접 근거로 쓰인다. Dedicated Server·예측이 필수라면 지원 전에 간극부터 확인한다.
2. **Unity PC·2D 게임플레이·콘텐츠·플랫폼**: 가장 가까운 경험은 출시된 Unity 게임의 핵심 시스템·UI다. Steamworks·Stove, Windows·macOS와 컨트롤러 대응도 바로 이어진다.
3. **Unity XR·실시간·애니메이션**: VR 네트워크 스트리밍과 다중 사용자 좌표 정합을 직접 다뤘다. 트래커와 Humanoid 리타기팅은 흔치 않은 경험이기도 하다.
4. **개발 PM 전환**: 요구 구조화와 다직군 조율, 문서화, 빌드·QA 흐름이 출발점이다. 일정·마일스톤·의존성·위험을 소유한 증거가 없으므로 경력 PM이 아닌 전환형 공고로 범위를 좁힌다.
5. **Unity 모바일·라이브·SDK**: Unity·C#과 출시 경험은 옮겨 쓸 수 있다. 최근 모바일 스택의 증거가 얕아서 필수요건이 낮은 공고부터 골라야 한다.
6. **Unreal 엔진 Low Level·Unity 렌더링/DOTS**: 성능 문제를 해결한 경험이 출발점이다. 현재 이력서만으로는 전문 역할의 핵심 증거가 부족해 도전 트랙으로 남긴다.

## 이력서 기준 지원 추천

아래 추천은 시장 표본을 먼저 고른 다음 이력서의 직접 근거와 간극을 대조해 정했다. 기술 적합도만 반영했으므로 직급·보상·근무 조건은 따로 확인해야 한다.

| 우선순위 | 공고 | 맞는 근거 | 지원 전 확인할 점 |
| --- | --- | --- | --- |
| 우선 | LOST ARK Mobile [전투](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283315)·[콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283318)·[레벨](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282521), Chrono Odyssey [콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281910), [빅파이어게임즈](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=280913) | UE5·C++, 전투·AI·UI·카메라·시퀀스, 서버 연동과 제작 도구 | MMORPG·모바일 라이브가 필수인지 우대인지 공고별로 구분해 이력서 순서를 조정한다. |
| 우선 | NX3 OUTANT [전투](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283693)·[콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283691), 스마일게이트 [차세대 게임 UE5 엔진 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283239) | 16인 멀티플레이, replication 구조와 비용 개선, C++ 게임플레이·최적화 | Dedicated Server 운영·부하 테스트·지연 대응을 어디까지 직접 소유했는지 분명히 한다. |
| 우선 | 네오위즈 ASTRA9 Studio [내러티브 RPG 신작](https://jobs.lever.co/neowiz/c3704f2e-5921-49f2-a9c2-8857696d846f), 네오플 [프로젝트 DL UI 콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282745) | Unity·C# 상용 프로젝트, 게임 시스템·UI·툴, PC 출시와 다직군 협업 | 최신 Unity 최근성, 네오위즈의 PC·콘솔 타깃과 Unity 상용 출시 우대를 어떤 증거로 보완할지 정한다. |
| 우선·직급 확인 | 기어세컨드 [프린세스 메이커 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283215) | Unity PC·Steam 출시, UI·콘텐츠·툴·포팅과 C#·객체지향이 이력서에 가장 직접적으로 겹친다. | 공고 경력 범위가 1~5년이므로 전체 경력에 맞는 직급·역할·보상인지 먼저 확인한다. |
| 조건 확인 | 표본 밖의 Devs United Games [Client Developer](https://www.devsunitedgames.com/en/career-client-developer) | Unity VR/XR, 네트워크, Quest·Rift·SteamVR 등 멀티플랫폼 요구가 과거 VR 실무와 강하게 맞는다. | 현재 회사 페이지에 경력 연차·고용형태·마감이 명시되지 않아 지원 전에 조건을 확인한다. |
| 조건부 | 111퍼센트 [Unity & Interface](https://111percent.career.greetinghr.com/ko/o/233499), 베이글코드 [플랫폼 클라이언트 SDK](https://career.bagelcode.com/ko/career) | Unity·C#과 C++, 실시간 네트워크, 프로파일링·툴·API, 빌드·CI 경험이 교차한다. | DOTS·Burst, Unity Package·네이티브 플러그인, 모바일 SDK를 제품 수준에서 소유한 증거는 약하다. |
| 조건부 | 에피드게임즈 [트릭컬 파티마](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281993), 위메이드커넥트 [신규 프로젝트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283104) | Unity 콘텐츠·UI·툴·출시와 C# 구조 설계, Steam·PC 경험 | Unity 6·AssetBundle·SRP·모바일 네이티브, 최근 라이브와 Cocos2d 포팅 간극을 솔직히 분리한다. |
| 전환 조건부 | 시프트업 [스텔라 블레이드 차기작](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281666)·[승리의 여신: 니케 개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=280653), 기어세컨드 [개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282107), 블루포션게임즈 [개발 PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=280715) | 요구 구조화, 다직군 조율, 문서, 빌드·QA·배포의 기술적 이해 | 신입·저연차 범위가 전체 경력과 맞는지 확인하고 일정·위험 소유 경험이 없다는 간극을 숨기지 않는다. |
| 도전 | 에이버튼 [Project EA](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283864), 엔씨소프트 [AION2](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=284001), 크래프톤 [PUBG STUDIOS PM](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283773) | Unreal·PC·콘솔 개발 제약, 빌드·QA 흐름을 빠르게 이해할 기술 배경 | 모두 직접적인 개발 PM 경력을 요구한다. 엔진 경력을 PM 경력처럼 포장하지 말고 전환 가능성을 먼저 문의하는 편이 안전하다. |
| 도전 | 겜프스엔 [브라운더스트2](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283723), [슈퍼센트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282501), [신지게임즈](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282496), 시프트업 [엔진 최적화](https://career.shiftup.co.kr/ko/o/155988), [에이시티게임즈](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283792) | 전체 클라이언트 연차와 Unity·C#, 네트워크·최적화·리딩의 전이 가능성 | 최근 모바일 대형 라이브, Addressables·네이티브·렌더링 전문성처럼 공고 핵심과 겹치지 않는 부분이 더 크다. |

## 이직 준비 우선순위

### P0 — 지원 전에 바로 정리할 것

1. **이력서 첫 화면을 세 벌로 나눈다.** Unreal 버전은 UE5·C++, replication·AI 최적화, UE4→UE5와 Night of the Dead 1.0으로 시작한다. Unity 버전의 첫 사례는 C#·Unity로 만든 PC·macOS 게임의 핵심 시스템·UI다. 개발 PM 전환 버전에는 요구 구조화, 부서 간 결정, 문서, 빌드·QA 흐름을 앞세운다.
2. **PM 이력서에는 맡았던 범위까지만 쓴다.** 기술 리딩과 조율을 일정·예산·인력 관리로 바꾸지 않는다. 내가 내린 결정과 참여자, 충돌한 제약, 후속 행동과 결과를 한 사례로 엮는다.
3. **새 대형 샘플을 만들기 전에 기존 출시·VR 사례부터 정리한다.** 문제 → 제약 → 설계 → 구현 → 측정 → 결과 순서로 다시 쓰되 회사 코드·데이터는 뺀다. 화면·다이어그램·수치도 공개 가능한 것만 쓴다.
4. **성능 수치에는 측정 문맥을 붙인다.** 실제로 사용한 도구와 테스트 맵·개체 수·하드웨어·빌드 설정을 함께 기록한다. 정확성과 공개 가능성을 확인한 범위까지만 적는다.
5. **공통 면접 기반도 보강한다.** C++의 수명·소유권·멀티스레딩, C#의 GC·비동기·객체 설계, 자료구조·알고리즘을 암기 항목으로 두지 말고 프로젝트의 결정과 연결해 설명한다. PM 전환 면접에서는 같은 프로젝트의 의존성·위험·우선순위 질문까지 준비한다.

### P1 — 필요한 증거만 작게 보강할 것

- Unreal 온라인 역할에 집중할 때는 작은 UE5 Dedicated Server 샘플 하나면 된다. 상태 소유권, relevancy·dormancy, 지연·부하 테스트, Unreal Insights와 Automation Test를 한데 묶는다.
- Unity 공고에서 최근성이 계속 걸리면 작은 Unity 6 샘플을 만든다. Addressables, Profiler·Memory Profiler, Edit/Play Mode Test와 한 플랫폼 빌드까지 보여 준다.
- 개발 PM 전환에는 새 앱보다 공개 가능한 운영 사례가 먼저다. 실제 프로젝트 하나를 요청 → 의존성 → 마일스톤·위험 → 결정 기록 → QA·배포 순으로 정리한다. 직접 소유한 범위와 지원한 범위는 분명히 가른다.

세 가지를 한꺼번에 만들 필요는 없다. 실제 지원 목록의 필수요건에서 반복되며 면접에서 바로 검증될 증거 하나부터 끝낸다.

### P2 — 지원 트랙별로 선택할 것

- 게임플레이·콘텐츠: Blueprint와 C++의 책임 경계, UMG·Slate, 에디터 확장과 데이터 검증
- 온라인·네트워크: prediction·lag compensation, 네트워크 프로파일링, 보안·치팅 대응
- Unity 콘텐츠·플랫폼: UGUI·UI Toolkit, Addressables, IL2CPP·네이티브 플러그인, 모바일·스토어 빌드
- 엔진·플랫폼: UObject·GC·Asset Manager·비동기 로딩, Unreal RHI·엔진 소스 분석, DOTS·Burst·Jobs, PIX·RenderDoc·VTune
- 개발 PM: WBS·마일스톤·의존성·위험 기록, Jira·Confluence·Notion, 빌드·브랜치·QA·배포 흐름
- 대형 스튜디오 개발 환경: 보유한 GitLab·TeamCity·Linear 경험을 Perforce·Jira·Jenkins 흐름에 어떻게 옮길지 설명

공백을 한 번에 전부 채우지 않는다. 실제 지원 공고의 필수요건에서 두 번 이상 반복되는 항목부터 고른다.

## 주변 신호로서의 AI 개발 도구

AI 코딩 도구는 아직 게임 클라이언트나 개발 PM 시장의 공통 필수요건이 아니다. Unity 표본에서는 베이글코드·위메이드커넥트·신지게임즈·슈퍼센트 4/12가 AI 보조 개발이나 업무 효율화를 명시했다. Unreal 쪽에서는 Chrono Odyssey 엔진 공고가 AI를 활용한 개발 효율화를 우대했다. 개발 PM 공고 중에는 시프트업의 두 자리와 엑소게임즈 등이 자동화나 AI 도구 활용을 언급했다.

내 이력서의 AI 에이전트 워크플로와 오픈소스 경험은 분석·검증·문서화, 반복 작업의 품질을 높였다는 보조 증거로 쓸 수 있다. 다만 UE5·C++와 게임 시스템 전문성도, 일정과 위험을 소유한 PM 경험도 대신할 수 없다.

## 결론

8월 22일에 다시 살펴본 시장은 세 갈래로 나뉘었다. Unreal·Unity 클라이언트 개발은 출시된 제품에서 시스템과 문제를 끝까지 맡은 증거를 요구한다. 같은 제작 현장을 보는 개발 PM 공고는 일정·의존성·위험·프로세스를 누가 소유했는지 묻는다.

내 경력에서 바로 지원권에 가까운 축은 Unreal 게임플레이·온라인과 Unity PC·콘텐츠·XR이다. Unity 모바일·SDK와 두 엔진의 Low Level 전문 역할은 최근 스택의 직접 증거가 약하므로 선별해서 지원하는 편이 맞다. 개발 PM 쪽에는 요구 구조화와 다직군 조율, 빌드·QA를 이해하는 강점이 있다. 빈칸은 일정·마일스톤을 소유한 근거다. 이 간극을 숨기지 않고 전환형 공고만 따로 보는 편이 낫다.

세 직무를 한 이력서에 우겨 넣을 생각은 없다. 지원 트랙마다 첫 화면을 바꾸고 기존 출시·VR·최적화·협업 사례에 공개 가능한 측정과 결정의 문맥을 되살린다. 그런 다음 실제 필수요건에 필요한 증거 하나만 보강한다.
