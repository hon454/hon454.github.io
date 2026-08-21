---
published: 2026-08-20T09:00:00+09:00
updated: 2026-08-21T09:00:00+09:00
author: Jihoon Jeon
title: '이직 준비: 2026.08 Unreal·Unity 클라이언트·엔진 채용 분석'
description: Unreal Engine과 Unity 클라이언트·엔진 공고 표본을 조사하고, 반복해서 요구되는 역량을 내 이력서와 비교해 지원 트랙과 준비 우선순위를 정리합니다.
image: ./images/gamejob-logo.avif
category: Engineering
tags:
  - unreal-engine
  - unity
  - client-programmer
  - career
---

이직을 준비할 때 가장 먼저 확인해야 할 것은 내가 잘해 온 일의 목록이 아니라 **현재 채용 시장이 어떤 증거를 원하는가**다. 이 글은 2026년 8월 20일에 조사한 Unreal Engine 경력직 공고에, 8월 21일 기준 Unity 공고를 더해 반복 요구사항과 내 [공개 이력서](/resume)의 적합도를 비교한 기록이다.

먼저 결론을 요약하면, 두 엔진 모두 언어와 에디터 사용법보다 **출시된 제품에서 어떤 시스템과 문제를 맡았는지**를 요구했다. Unreal 표본은 전투·온라인·엔진 전문성, Dedicated Server, 프로파일링과 Low Level 경험으로 갈라졌다. Unity 표본은 C#·객체지향, 상용 출시, 콘텐츠·UI·툴, 성능 분석을 공통으로 보고, 모바일 포지션일수록 네이티브 SDK·빌드와 라이브 경험을 더 깊게 확인했다.

내 경력은 UE4/5·C++ 게임플레이·네트워크·최적화·제작 도구와 Night of the Dead 1.0 출시에서 Unreal 요구와 강하게 맞는다. Unity에서는 C#으로 PC·macOS에 출시한 2D 게임의 핵심 시스템·UI·상점 연동, 그리고 VR 스트리밍·트래킹·아바타 애니메이션 경험이 직접적인 근거다. 반면 Dedicated Server와 Unreal 엔진 Low Level·콘솔 출시, 최근 Unity 버전과 모바일 네이티브·라이브 스택을 보여 줄 공개 증거는 약하다. 목적은 두 엔진을 모두 공부 목록에 넣는 것이 아니라, **지금 지원할 수 있는 역할과 지원 전에 닫아야 할 간극을 구분하는 것**이다.

## 조사 범위와 방법

Unreal 쪽은 게임잡의 [‘언리얼’ 검색 결과](https://www.gamejob.co.kr/Recruit/joblist?menucode=searchtot&searchtype=all&searchstring=%EC%96%B8%EB%A6%AC%EC%96%BC) 65건, ‘Unreal’ 84건, [‘UE5’ 검색 결과](https://www.gamejob.co.kr/Recruit/joblist?menucode=searchtot&searchtype=all&searchstring=UE5) 33건을 합쳐 공고 번호 기준 137건으로 중복을 제거했다. Unity 쪽도 [‘유니티’ 30건](https://www.gamejob.co.kr/Recruit/joblist?menucode=searchtot&searchtype=all&searchstring=%EC%9C%A0%EB%8B%88%ED%8B%B0)과 [‘Unity’ 81건](https://www.gamejob.co.kr/Recruit/joblist?menucode=searchtot&searchtype=all&searchstring=Unity)을 합쳐 94건으로 중복을 제거했다. 이 원시 결과에는 아트·기획·교육 직군과 본문에 키워드만 언급된 공고도 섞여 있다. 각 상세 페이지와 연결된 회사 채용 페이지를 열어 양쪽 모두 다음 조건을 적용했다.

- 조사 시점에 지원 가능한 정규직 경력 공고
- Unreal Engine 또는 Unity 기반 게임 클라이언트·엔진 프로그래밍 역할
- 담당 업무와 자격·우대 요건을 구체적으로 확인할 수 있는 공고
- 전투·콘텐츠·온라인·플랫폼·엔진 중 구체적인 책임 범위를 확인할 수 있는 직무

조건을 통과한 공고 중 역할 범위를 구체적으로 비교할 수 있는 Unreal 12건과 Unity 12건을 남겼다. 어느 쪽도 게임 업계 전체를 대표하는 통계는 아니며, **두 엔진의 활성 경력직 공고를 비교하기 위한 목적 표본**이다. Unity 표본은 내 이력서와의 적합도가 아니라 콘텐츠·모바일 라이브·플랫폼 SDK·엔진 최적화처럼 시장의 역할 범위를 먼저 보고 골랐고, 지원 추천은 표본을 확정한 뒤 별도로 평가했다. 검색어·조사 시점과 선정 판단의 영향을 받고, 같은 프로젝트의 세부 직무가 여러 건 포함될 수 있다. 두 표본의 빈도는 분모를 나눠 계산했으며, 게임잡과 회사 원문이 다르면 회사 원문을 우선했다. 지원 직전에는 변경되거나 종료될 수 있는 원문을 다시 확인해야 한다.

## 참고한 Unreal Engine 공고 12건

| 회사·포지션                                                                                                                                                                             |            <span class="whitespace-nowrap">경력</span> | 공고에서 확인한 핵심 요구                                                                                                 | <span class="whitespace-nowrap">마감</span>     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| NX3GAMES · [OUTANT 클라이언트 전투](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283693) ([회사 상세](https://nx3games.career.greetinghr.com/ko/o/232535))                      |        <span class="whitespace-nowrap">5년 이상</span> | UE5 멀티플레이 ARPG 전투, Unreal 클라이언트, C++·객체지향, 협업. Unreal 출시와 Dedicated Server 멀티플레이 경험 우대      | <span class="whitespace-nowrap">상시</span>     |
| NX3GAMES · [OUTANT 클라이언트 콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283691) ([회사 상세](https://nx3games.career.greetinghr.com/ko/o/232531))                    |        <span class="whitespace-nowrap">5년 이상</span> | 액션·RPG 시스템 콘텐츠, Unreal 클라이언트, C++·객체지향, 협업. Unreal 출시와 Dedicated Server 멀티플레이 경험 우대        | <span class="whitespace-nowrap">상시</span>     |
| 스마일게이트 · [LOST ARK Mobile 전투 콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283315) ([회사 상세](https://careers.smilegate.com/apply/announce/view?seq=3354))     |        <span class="whitespace-nowrap">3년 이상</span> | 모바일 전투·연출, UE5, C++·객체지향과 협업. 액션 전투·카메라 연출 경험 우대                                               | <span class="whitespace-nowrap">8월 31일</span> |
| 스마일게이트 · [LOST ARK Mobile 콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283318) ([회사 상세](https://careers.smilegate.com/apply/announce/view?seq=3179))          |        <span class="whitespace-nowrap">5년 이상</span> | 게임 콘텐츠·UI·서버 연동·개발 도구, 모바일 개발과 라이브. UE4/5, C++와 Unreal Slate UI 이해 우대                          | <span class="whitespace-nowrap">8월 31일</span> |
| 스마일게이트 · [LOST ARK Mobile 레벨 콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282521) ([회사 상세](https://careers.smilegate.com/apply/announce/view?seq=6136))     |        <span class="whitespace-nowrap">3년 이상</span> | 퀘스트·카메라·시퀀스, C/C++, UE5, 객체지향과 협업. 모바일 라이브·MMORPG 경험 우대, 포트폴리오 필수                        | <span class="whitespace-nowrap">8월 31일</span> |
| 스마일게이트 · [차세대 게임 UE5 엔진 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283239) ([회사 상세](https://careers.smilegate.com/apply/announce/view?seq=5912)) |        <span class="whitespace-nowrap">5년 이상</span> | 오픈월드 멀티플레이, UE5 Dedicated Server 개발·최적화, 네트워크 동기화와 TCP/UDP. 다중 플랫폼 프로파일링·출시 경험 우대   | <span class="whitespace-nowrap">8월 31일</span> |
| 크로노스튜디오 · [Chrono Odyssey 전투](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282341) ([회사 상세](https://chronostudio.career.greetinghr.com/ko/o/226429))               |        <span class="whitespace-nowrap">6년 이상</span> | MMORPG 전투, 상태 동기화·지연 보정·대규모 전투, Unreal 애니메이션·멀티스레딩·최적화. PC·콘솔 경험 우대                    | <span class="whitespace-nowrap">채용시</span>   |
| 크로노스튜디오 · [Chrono Odyssey 콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281910) ([회사 상세](https://chronostudio.career.greetinghr.com/ko/o/159545))             |        <span class="whitespace-nowrap">3년 이상</span> | 비전투 콘텐츠, UI/UX, Blueprint와 C++, 커스텀 에디터·파이프라인, 변경에 유연한 구조와 협업                                | <span class="whitespace-nowrap">채용시</span>   |
| 크로노스튜디오 · [Chrono Odyssey 엔진](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282976) ([회사 상세](https://chronostudio.career.greetinghr.com/ko/o/213431))               |        <span class="whitespace-nowrap">3년 이상</span> | UE4/5 엔진 수정, 그래픽 API, CPU/GPU 하드웨어 이해, Deep Profiling, RHI Thread·RDG. 콘솔·셰이더·DCC 자동화 우대           | <span class="whitespace-nowrap">9월 20일</span> |
| 빅파이어게임즈 · [클라이언트 프로그래머](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=280913) ([회사 상세](https://bigfiregames.career.greetinghr.com/ko/o/148319))             |        <span class="whitespace-nowrap">2년 이상</span> | C/C++, 3D 그래픽스·선형대수, Unreal 시스템·콘텐츠·UI와 유지보수. FPS/TPS·Unreal 출시·UMG 우대                             | <span class="whitespace-nowrap">채용시</span>   |
| 크래프톤 PUBG STUDIOS · [Sr. Engine Engineer](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281930)                                                                              | <span class="whitespace-nowrap">게임잡 7년 이상</span> | UE4/5 Core·Memory Allocator·File System, 로딩·메모리·런타임 최적화, C++와 H/W·OS. 엔진 소스·콘솔·PIX·RenderDoc·VTune 우대 | <span class="whitespace-nowrap">채용시</span>   |
| 넥슨게임즈 · [Woochi the Wayfarer 엔진 프로그래머](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281193)                                                                         |       <span class="whitespace-nowrap">10년 이상</span> | UE5 엔진·플러그인·툴, PC·콘솔 최적화, 요구 분석·설계·구현과 협업. 엔진 소스·렌더링 파이프라인·상용화 경험 우대            | <span class="whitespace-nowrap">채용시</span>   |

> 크래프톤 공고는 게임잡 상단에 경력 7년 이상으로 표시되지만 상세 본문은 엔진 개발 또는 상용 엔진 사용 5년 이상을 요구한다.
>
> 마감 상태는 2026년 8월 21일 확인 기준이다. 게임잡과 회사 원문이 다르면 회사 원문의 마감일을 적었다.

## 참고한 Unity 공고 12건

| 회사·포지션                                                                                                                                                                       |      <span class="whitespace-nowrap">경력</span> | 공고에서 확인한 핵심 요구                                                                                                                           | <span class="whitespace-nowrap">마감</span>   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----------------------------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| 네오플 · [[프로젝트 DL] UI 콘텐츠 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282745)                                                                        |  <span class="whitespace-nowrap">3년 이상</span> | Unity·C#·UGUI, 이벤트·상점·보상 UI, 리소스·애니메이션·인터랙션, 유지보수와 최적화. 모바일 출시·라이브 경험 우대                                     | <span class="whitespace-nowrap">채용시</span> |
| 네오위즈 ROUND8 · [내러티브 RPG 신작 클라이언트](https://jobs.lever.co/neowiz/c3704f2e-5921-49f2-a9c2-8857696d846f)                                                               |  <span class="whitespace-nowrap">5년 이상</span> | 글로벌 PC·콘솔 RPG의 Unity 기능·콘텐츠, Unity 3D·Git, 분석적 문제 해결과 협업. Unity 3D 상용 출시 경험 우대, 포트폴리오 필수                        | <span class="whitespace-nowrap">채용시</span> |
| 기어세컨드 · [[프린세스 메이커] 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283215) ([회사 상세](https://gear2.recruit.roundhr.com/c/HSfYtc6rRQ))            |     <span class="whitespace-nowrap">1~5년</span> | Steam Unity 클라이언트의 UI·콘텐츠·툴과 타 플랫폼 포팅, C#·UGUI, 자료구조·알고리즘·객체지향, Steam 개발·라이브와 협업                               | <span class="whitespace-nowrap">상시</span>   |
| 베이글코드 · [[Platform] 게임 플랫폼 클라이언트 SDK](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=269652) ([회사 상세](https://career.bagelcode.com/ko/career))           |  <span class="whitespace-nowrap">5년 이상</span> | Unity·Android·iOS SDK와 네이티브 연동, 아키텍처, 통합 빌드·스토어 배포, 샘플·검증 자동화. SDK 라이브 적용과 팀 리딩·협업                            | <span class="whitespace-nowrap">상시</span>   |
| 111퍼센트 · [게임 엔진 개발자—Unity & Interface](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283957) ([회사 상세](https://111percent.career.greetinghr.com/ko/o/233499)) |  <span class="whitespace-nowrap">5년 이상</span> | C++ 코어와 C#·Unity Bridge/SDK/API, 멀티플레이 동기화, GC·CPU·frame-time 프로파일링, Editor·디버깅 툴과 문서화. DOTS·Burst·네이티브 플러그인 우대   | <span class="whitespace-nowrap">채용시</span> |
| 겜프스엔 · [[브라운더스트2] Unity 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283723)                                                                        | <span class="whitespace-nowrap">10년 이상</span> | Unity·C#·UGUI, 모바일 최적화, 클라이언트-서버 구조·네트워크 동기화, Addressables와 협업. Timeline·URP·셰이더·비동기 프로그래밍 우대                 | <span class="whitespace-nowrap">채용시</span> |
| 위메이드커넥트 · [신규 프로젝트 Unity 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283104)                                                                    |     <span class="whitespace-nowrap">3~5년</span> | Cocos2d→Unity 포팅·구조 개선, 시스템·콘텐츠·라이브 이슈, Unity·C# 출시, 자료구조·알고리즘·객체지향과 협업. 모바일 SDK·빌드·최적화와 Steam 경험 우대 | <span class="whitespace-nowrap">채용시</span> |
| 에피드게임즈 · [[트릭컬 파티마] 콘텐츠 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281993)                                                                   |  <span class="whitespace-nowrap">5년 이상</span> | Unity 6.3 콘텐츠·UI·내부 툴, 상용 Unity 출시, C#·객체지향·소켓·UGUI. AssetBundle·SRP·Profiler·빌드 파이프라인과 모바일 네이티브 플러그인            | <span class="whitespace-nowrap">채용시</span> |
| 신지게임즈 · [Unity 클라이언트 시니어](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282496)                                                                               |  <span class="whitespace-nowrap">7년 이상</span> | 모바일·멀티플랫폼 RPG의 시니어 Unity 클라이언트, C#·C++, iOS·Android 대응과 팀 리딩. 이력서·경력기술서·포트폴리오 제출                              | <span class="whitespace-nowrap">채용시</span> |
| 슈퍼센트 · [클라이언트 개발자](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282501) ([상세 요건](https://career.rememberapp.co.kr/job/posting/327045))                    |  <span class="whitespace-nowrap">5년 이상</span> | 글로벌 모바일 게임의 핵심 시스템·플레이 로직·확장 가능한 구조, Unity·C#, 성능 최적화·디버깅과 AI 도구 활용. 대형 모바일·라이브와 아키텍처 경험 우대 | <span class="whitespace-nowrap">채용시</span> |
| 시프트업 · [[승리의 여신: 니케] 엔진 최적화](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282062) ([회사 상세](https://career.shiftup.co.kr/ko/o/155988))                 |  <span class="whitespace-nowrap">5년 이상</span> | 런타임 애셋 로딩·메모리·성능 분석, 엔진 툴·플랫폼·빌드 개선, Unity·C#, 렌더링·셰이더·멀티스레딩. C/C++·모바일 네이티브·Unreal 우대                  | <span class="whitespace-nowrap">채용시</span> |
| 에이시티게임즈 · [헬로키티 마이 드림 스토어 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283792)                                                              |  <span class="whitespace-nowrap">5년 이상</span> | 모바일 캐주얼·SNG 클라이언트, Unity 실무, UGUI·Spine·외부 SDK·Git. 이력서·경력기술서와 포트폴리오 제출                                              | <span class="whitespace-nowrap">채용시</span> |

> Unity 표본도 2026년 8월 21일에 게임잡의 지원 상태와 연결된 회사 채용 페이지를 다시 확인했다. 111퍼센트는 종료된 이전 공고가 아니라 당일 게시된 신규 공고를 사용했다.

## 반복해서 등장한 요구사항

공고의 담당 업무·필수·우대에 신호가 명시되면 공고당 한 번으로 집계했다. 엔진을 사용하면 당연히 쓸 것이라고 추론되는 기술은 세지 않았고, 한 공고는 여러 항목에 들어갈 수 있다. 따라서 다음 수치는 모집단 통계가 아니라 **같은 기준으로 코딩한 두 목적 표본의 방향성 비교**다.

| 공통 요구 신호                         | Unreal 표본 | Unity 표본 | 해석                                                                                 |
| -------------------------------------- | ----------: | ---------: | ------------------------------------------------------------------------------------ |
| 경력 하한 3년 이상                     |       11/12 |      11/12 | 두 표본 모두 튜토리얼보다 실제 프로젝트의 책임과 문제 해결 사례를 전제로 한다.       |
| 경력 하한 5년 이상                     |        7/12 |       9/12 | 이번 Unity 표본은 시니어·리드와 엔진·SDK 역할의 비중이 특히 높다.                    |
| 협업·커뮤니케이션·문서화               |       10/12 |      11/12 | 기획·아트·서버·플랫폼 팀과 요구를 조율한 과정도 기술 증거에 가깝다.                  |
| 출시·상용화·라이브 경험                |        9/12 |       9/12 | 구현 이후 최적화·장애·빌드·플랫폼 문제까지 끝낸 경험을 선호한다.                     |
| 성능·메모리·프로파일링·최적화          |        5/12 |       9/12 | Unreal 엔진 전담뿐 아니라 Unity 모바일·SDK·콘텐츠 역할에서도 측정과 개선이 반복된다. |
| 툴·에디터·SDK·플러그인·빌드 파이프라인 |        6/12 |       8/12 | 런타임 기능과 함께 팀의 제작·통합 효율을 책임지는 역할이 적지 않다.                  |
| 멀티플랫폼·콘솔·포팅·기기 대응         |        6/12 |       7/12 | PC 한 환경의 기능 구현만으로는 시니어 플랫폼 역할을 설명하기 어렵다.                 |
| 서버·네트워크·멀티플레이·동기화        |        5/12 |       4/12 | 엔진별 구현 방식은 달라도 상태 소유권·동기화·비용을 설명해야 하는 별도 트랙이다.     |
| UI 프레임워크·UI 콘텐츠                |        3/12 |       5/12 | 콘텐츠 직무에서는 엔진 언어와 함께 UMG·Slate 또는 UGUI 실무가 구체적으로 등장한다.   |

엔진별 표현에는 차이가 있었다. Unreal 표본에서는 Unreal 실무가 핵심인 공고가 9/12, C/C++·객체지향이 필수 또는 핵심인 공고가 8/12였고, Dedicated Server·Replication과 엔진 소스·RHI·RDG가 역할을 가르는 신호였다. Unity 표본에서는 C#을 본문에 명시한 공고가 8/12, 구조 설계·자료구조·알고리즘·객체지향 또는 엔진 내부 구조를 명시한 공고가 9/12였다. UGUI 외에도 Addressables·AssetBundle·URP, 모바일 네이티브 연동, SDK·스토어 배포, DOTS·Burst가 역할별로 나뉘어 등장했다. AI 보조 개발도 Unity 4/12에 명시됐지만 아직 핵심 공통 요건으로 볼 정도는 아니다.

표본 구성 자체의 영향도 있다. Unreal 표본은 한 대형 프로젝트의 전투·콘텐츠·레벨 직무를 나눠 본 반면 Unity 표본은 모바일 라이브, PC·Steam, 플랫폼 SDK와 엔진 최적화 역할을 넓게 분산했다. 따라서 `9/12 대 5/12` 같은 차이를 엔진의 시장점유율이나 절대 수요로 해석해서는 안 된다.

### 엔진 이름보다 역할 전문성이 먼저다

두 표본은 크게 네 갈래로 나뉜다.

1. **게임플레이·콘텐츠·UI**는 전투, 퀘스트, 플레이 로직, 카메라·시퀀스, UI와 제작 도구를 다룬다. Unreal에서는 C++·Blueprint·UMG, Unity에서는 C#·UGUI와 데이터·에셋 흐름으로 증거가 구체화된다.
2. **온라인·네트워크**는 서버 권한, 상태 동기화, 지연과 대규모 부하를 다룬다. Unreal의 Dedicated Server·Replication과 Unity의 소켓·멀티플레이 SDK는 기술명이 달라도 같은 시스템 질문으로 이어진다.
3. **플랫폼·출시·SDK**는 빌드, 스토어, 네이티브 연동, 포팅과 자동화를 다룬다. Unity 표본에서 모바일 SDK와 Steam·다중 플랫폼 경험이 별도 역할로 더 선명하게 나타났다.
4. **엔진·성능**은 메모리·로딩·렌더링, 프로파일링, 엔진 소스 또는 Bridge/API를 다룬다. 기능 개발보다 원인 분석과 여러 팀이 재사용할 해결책이 중심이다.

직무명이 모두 클라이언트 프로그래머에 가깝더라도 면접에서 확인하려는 증거는 다르다. 하나의 이력서에 모든 기술을 같은 비중으로 나열하기보다 지원 트랙에 맞춰 대표 사례의 순서를 바꾸는 편이 낫다.

### 출시 경험은 결과가 아니라 문제의 범위를 뜻한다

두 표본에서 각각 9/12에 등장한 출시·라이브 경험을 나는 출시 이력 자체보다 문제의 범위를 보여 달라는 신호로 읽었다. 개발 막바지에는 메모리와 프레임타임, 패키징, 플랫폼 SDK, 데이터 호환성, 기존 콘텐츠 회귀와 일정 사이의 선택이 한꺼번에 발생한다. 따라서 이 제약 속에서 무엇을 측정하고, 어떤 선택을 했으며, 실제 사용자에게 전달 가능한 상태까지 어떻게 끝냈는지를 준비해야 한다.

포트폴리오도 기능 목록보다 **문제 → 제약 → 분석 → 구현 → 측정 → 결과**의 구조가 적합하다. 최적화라면 평균 FPS만 적는 대신 재현 맵, 개체 수, 하드웨어, 측정 도구와 전후 Game Thread·메모리·네트워크 비용을 함께 보여 주는 편이 설득력이 높다.

## 내 이력서와 시장 요구의 비교

현재 [이력서](/resume)에는 2021년 1월부터 2026년 4월까지 5년 이상의 UE4/5·C++ 경력이 있으며, 실시간 클라이언트 개발 경험은 2016년부터 쌓아 왔다. Unity도 학습 이력이 아니라 VR 정규직 프로젝트와 출시된 PC·macOS 게임의 근거가 있다. 핵심 경험을 표본과 맞춰 보면 다음과 같다.

| 시장 요구                          | 현재 이력서의 근거                                                                                                       | 판단과 보완점                                                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| UE4/5·C++                          | Night of the Dead와 CINEVStudio, UE4→UE5 마이그레이션                                                                    | **강함.** Unreal 게임플레이·온라인 포지션의 직접 근거다.                                                                                    |
| Unity·C#                           | Clicked VR, Vapor World, 길고양이 이야기 2의 Unity·C# 개발                                                               | **강함.** 다만 마지막 명시적 Unity 프로젝트가 2023년에 끝나 최신 버전의 최근성은 보완해야 한다.                                             |
| 게임플레이·콘텐츠·UI               | UE 전투·AI·던전·UMG, Unity 입력·이동·전투·퀘스트·대화·컷신·UI                                                            | **강함.** 두 엔진의 콘텐츠 직무에 모두 연결된다.                                                                                            |
| 멀티플레이·실시간·XR               | UE 최대 16인과 Replication Graph·Fast TArray·RPC·EOS, Unity VR 소켓 스트리밍·6DoF 정합·Humanoid 리타기팅                 | **강함.** Dedicated Server 운영과 지연 보정·예측·치팅 대응은 별도 근거가 약하다.                                                            |
| 최적화·프로파일링·툴               | replication 비용 개선, 200개체 AI·애니메이션 최적화, Sequencer·MovieScene·Commandlet·Remote Control API                  | **강함.** 측정 도구·하드웨어·부하 시나리오까지 붙이면 엔진을 넘어 전이 가능한 증거가 된다.                                                  |
| 출시·빌드·상점·플랫폼              | Night of the Dead 1.0, 길고양이 이야기 2의 Windows·macOS 출시, Steamworks·Stove·EOS, TeamCity·GitLab CI/CD와 패키징 해결 | **강함.** 세 종류 컨트롤러 대응은 강점이지만 콘솔 출시 경험으로 표현해서는 안 된다.                                                         |
| 모바일·라이브·네이티브 SDK         | 짧은 Android 프로젝트와 GameSparks 보상 시스템                                                                           | **중간 이하.** 최근 iOS·Android 빌드, 장기 라이브 운영, 네이티브 플러그인 리딩을 요구하는 Unity 공고에는 간극이 크다.                       |
| 엔진 Low Level·최신 Unity 전문기술 | UE 마이그레이션·빌드·성능 문제 해결                                                                                      | **보완 필요.** RHI·엔진 메모리/파일/로딩·콘솔과 Unity 6·Addressables·DOTS/Burst·네이티브 플러그인의 공개 근거는 부족하다.                   |
| 협업·리더십                        | 기획·아트·TA·QA 조율, 코드 리뷰·기술면접·멘토링, Unity VR 클라이언트 리드                                                | **강함.** “소통이 좋다” 대신 충돌한 요구와 결정 기준, 결과를 사례로 제시해야 한다.                                                          |
| 최근성·공개 증거                   | 2026년의 최신 공개 프로젝트는 Rust·Bevy·WebGPU 기반 Shotloom                                                             | **보완 필요.** 기존 출시작 사례를 먼저 공개 가능한 형태로 정리하고, 지원 트랙에 필요할 때만 작은 최신 엔진 샘플을 추가하는 편이 효율적이다. |

### 가장 가까운 지원 트랙

1. **Unreal 게임플레이·온라인**: UE5·C++, 전투·AI·UI, 16인 replication과 최적화가 직접 근거다. Dedicated Server·예측이 필수인 역할만 간극을 확인하면 된다.
2. **Unity PC·2D 게임플레이·콘텐츠·플랫폼**: 출시된 Unity 게임의 핵심 시스템·UI, Steamworks·Stove, Windows·macOS와 컨트롤러 대응이 바로 연결된다.
3. **Unity XR·실시간·애니메이션**: VR 네트워크 스트리밍, 다중 사용자 좌표 정합, 트래커와 Humanoid 리타기팅은 흔하지 않은 직접 경험이다.
4. **Unity 모바일·라이브·SDK**: Unity·C#과 출시 경험은 전이되지만 최근 모바일 스택의 증거가 얕아 필수요건이 낮은 공고부터 선별해야 한다.
5. **Unreal 엔진 Low Level·Unity 렌더링/DOTS**: 성능 문제 해결은 출발점이지만 현재 이력서만으로는 전문 역할의 핵심 증거가 부족한 도전 트랙이다.

## 이력서 기준 지원 추천

다음 평가는 시장 표본을 고른 뒤 이력서의 직접 근거와 간극을 대조한 것이다. 기술 적합도만 본 것이므로 직급·보상·근무 조건은 별도로 확인해야 한다.

| 우선순위       | 공고                                                                                                                                                                                                                                                                                                                                                                                               | 맞는 근거                                                                                    | 지원 전 확인할 점                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 우선           | LOST ARK Mobile [전투](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283315)·[콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283318)·[레벨](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282521), Chrono Odyssey [콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281910), [빅파이어게임즈](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=280913) | UE5·C++, 전투·AI·UI·카메라·시퀀스, 서버 연동과 제작 도구                                     | MMORPG·모바일 라이브가 필수인지 우대인지 공고별로 구분해 이력서 순서를 조정한다.                         |
| 우선           | NX3 OUTANT [전투](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283693)·[콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283691), 스마일게이트 [차세대 게임 UE5 엔진 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283239)                                                                                                                                  | 16인 멀티플레이, replication 구조와 비용 개선, C++ 게임플레이·최적화                         | Dedicated Server 운영·부하 테스트·지연 대응을 어디까지 직접 소유했는지 분명히 한다.                      |
| 우선           | 네오위즈 ROUND8 [내러티브 RPG 신작](https://jobs.lever.co/neowiz/c3704f2e-5921-49f2-a9c2-8857696d846f), 네오플 [프로젝트 DL UI 콘텐츠](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282745)                                                                                                                                                                                                | Unity·C# 상용 프로젝트, 게임 시스템·UI·툴, PC 출시와 다직군 협업                             | 최신 Unity 최근성, 네오위즈의 PC·콘솔 타깃과 Unity 상용 출시 우대를 어떤 증거로 보완할지 정한다.         |
| 우선·직급 확인 | 기어세컨드 [프린세스 메이커 클라이언트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283215)                                                                                                                                                                                                                                                                                               | Unity PC·Steam 출시, UI·콘텐츠·툴·포팅과 C#·객체지향이 이력서에 가장 직접적으로 겹친다.      | 공고 경력 범위가 1~5년이므로 전체 경력에 맞는 직급·역할·보상인지 먼저 확인한다.                          |
| 조건 확인      | 표본 밖의 Devs United Games [Client Developer](https://www.devsunitedgames.com/en/career-client-developer)                                                                                                                                                                                                                                                                                         | Unity VR/XR, 네트워크, Quest·Rift·SteamVR 등 멀티플랫폼 요구가 과거 VR 실무와 강하게 맞는다. | 현재 회사 페이지에 경력 연차·고용형태·마감이 명시되지 않아 지원 전에 조건을 확인한다.                    |
| 조건부         | 111퍼센트 [Unity & Interface](https://111percent.career.greetinghr.com/ko/o/233499), 베이글코드 [플랫폼 클라이언트 SDK](https://career.bagelcode.com/ko/career)                                                                                                                                                                                                                                    | Unity·C#과 C++, 실시간 네트워크, 프로파일링·툴·API, 빌드·CI 경험이 교차한다.                 | DOTS·Burst, Unity Package·네이티브 플러그인, 모바일 SDK를 제품 수준에서 소유한 증거는 약하다.            |
| 조건부         | 에피드게임즈 [트릭컬 파티마](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=281993), 위메이드커넥트 [신규 프로젝트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283104)                                                                                                                                                                                                             | Unity 콘텐츠·UI·툴·출시와 C# 구조 설계, Steam·PC 경험                                        | Unity 6·AssetBundle·SRP·모바일 네이티브, 최근 라이브와 Cocos2d 포팅 간극을 솔직히 분리한다.              |
| 도전           | 겜프스엔 [브라운더스트2](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283723), [슈퍼센트](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282501), [신지게임즈](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=282496), 시프트업 [엔진 최적화](https://career.shiftup.co.kr/ko/o/155988), [에이시티게임즈](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283792)         | 전체 클라이언트 연차와 Unity·C#, 네트워크·최적화·리딩의 전이 가능성                          | 최근 모바일 대형 라이브, Addressables·네이티브·렌더링 전문성처럼 공고 핵심과 겹치지 않는 부분이 더 크다. |

## 이직 준비 우선순위

### P0 — 지원 전에 바로 정리할 것

1. **이력서 첫 화면을 엔진별로 두 벌 만든다.** Unreal 버전은 UE5·C++, replication·AI 최적화, UE4→UE5와 Night of the Dead 1.0을 앞에 둔다. Unity 버전은 C#·Unity, 출시된 PC·macOS 게임의 핵심 시스템·UI, Steamworks·Stove와 VR 네트워크·트래킹을 앞에 둔다.
2. **새 대형 샘플보다 기존 출시·VR 사례를 먼저 정리한다.** 각각을 문제 → 제약 → 설계 → 구현 → 측정 → 결과로 쓰고, 회사 코드·데이터 없이 공개 가능한 화면·다이어그램·수치만 사용한다.
3. **성능 수치의 측정 문맥을 복원한다.** 실제 도구, 테스트 맵·개체 수·하드웨어·빌드 설정을 기록하고 정확성과 공개 가능성이 확인된 범위만 쓴다.
4. **공통 면접 기반을 보강한다.** C++의 수명·소유권·멀티스레딩과 C#의 GC·비동기·객체 설계, 자료구조·알고리즘을 실제 프로젝트 결정에 연결한다.

### P1 — 지원 공고가 요구할 때만 최신 샘플을 더할 것

- Unreal 온라인 역할을 집중 지원한다면 작은 UE5 Dedicated Server 샘플에 상태 소유권, relevancy·dormancy, 지연·부하 테스트, Unreal Insights와 Automation Test를 묶는다.
- Unity 공고에서 최근성이 반복해서 걸린다면 작은 최신 Unity 6 샘플에 Addressables, Profiler·Memory Profiler, Edit/Play Mode Test와 한 플랫폼 빌드를 묶는다.

둘 다 만드는 것보다 실제 지원 목록의 필수요건에 맞는 하나를 먼저 끝내는 편이 낫다. 기능 수가 아니라 변경 전후를 재현하고 설명할 수 있는지가 완료 기준이다.

### P2 — 지원 트랙별로 선택할 것

- 게임플레이·콘텐츠: Blueprint와 C++의 책임 경계, UMG·Slate, 에디터 확장과 데이터 검증
- 온라인·네트워크: prediction·lag compensation, 네트워크 프로파일링, 보안·치팅 대응
- Unity 콘텐츠·플랫폼: UGUI·UI Toolkit, Addressables, IL2CPP·네이티브 플러그인, 모바일·스토어 빌드
- 엔진·플랫폼: UObject·GC·Asset Manager·비동기 로딩, Unreal RHI·엔진 소스 분석, DOTS·Burst·Jobs, PIX·RenderDoc·VTune
- 대형 스튜디오 개발 환경: 보유한 GitLab·TeamCity·Linear 경험을 Perforce·Jira·Jenkins 흐름에 어떻게 전이할지 설명

모든 공백을 한 번에 채울 필요는 없다. 실제 지원 공고의 필수요건에서 두 번 이상 반복되는 항목과 면접에서 즉시 검증될 항목부터 선택해야 한다.

## 주변 신호로서의 AI 개발 도구

AI 코딩 도구를 게임 클라이언트 시장의 공통 필수요건이라고 말할 수는 없다. 그래도 Unity 표본에서는 베이글코드·위메이드커넥트·신지게임즈·슈퍼센트 4/12가 AI 보조 개발이나 업무 효율화를 명시했다. Unreal 쪽에서도 Chrono Odyssey 엔진 공고가 AI를 통한 개발 효율화를 우대하고, 인접한 버추얼 라이브 분야의 [브이레코드 언리얼 시니어 개발자](https://www.gamejob.co.kr/Recruit/GI_Read/View?GI_No=283418)는 Claude Code·Codex·Cursor 활용 경험을 필수로 적었다.

내 이력서의 AI 에이전트 워크플로와 오픈소스 경험은 이 흐름에서 차별점이 될 수 있다. 그러나 이는 UE5·C++와 게임 시스템 전문성을 대체하는 조건이 아니라, 분석·검증·문서화와 반복 작업의 품질을 높이는 보조 증거로 제시하는 편이 적절하다.

## 결론

두 엔진의 표본이 공통으로 요구한 것은 화려한 기술 목록보다 **출시된 제품에서 문제를 끝까지 해결한 증거**였다. 언어와 엔진은 출발점이고, 그 위에 콘텐츠·온라인·플랫폼·엔진 중 하나의 전문성, 측정 가능한 최적화와 협업 과정이 쌓여야 한다.

내 경력에서 바로 지원권에 가까운 두 축은 **Unreal 게임플레이·온라인**과 **Unity PC·콘텐츠·XR**이다. Unity 모바일·SDK와 양쪽 엔진의 Low Level 전문 역할은 전이 가능한 경험은 있지만 최근 스택의 직접 증거가 약해 선별 지원이 맞다. 다음 단계는 두 엔진의 공부 목록을 모두 늘리는 것이 아니라, 엔진별 이력서의 첫 화면을 바꾸고 기존 출시·VR·최적화 사례를 공개 가능한 측정 문맥으로 복원한 뒤 실제 필수요건에 필요한 작은 샘플 하나만 더하는 일이다.
