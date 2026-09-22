# Notion 프로젝트 일괄 이전

2026-09-22에 [Notion 프로젝트 데이터베이스](https://hon454.notion.site/e771d2fafc704072a94d6d86fc74bbd0)에서 15개 프로젝트를 가져왔다. CINEVStudio와 Shotloom은 대상에서 제외했다. Notion 원본은 수정하지 않았다.

## 이전 기준

- 기간·소속·역할·기술을 본문 상단의 공통 표로 표시한다. 원문에서 소속이 비어 있던 항목은 `—`로 표시한다.
- 본문의 순서, 담당 업무, 수상·출시 이력, 외부 다운로드 링크와 날짜가 있는 만료 안내를 보존한다. Notion 다단 이미지는 단일 열로, 콜아웃은 인용문으로 변환한다.
- 사용자 확인에 따라 Vapor World의 “인풋, 이동, 전 시스템 개발”만 “인풋, 이동, 전투 시스템 개발”로 수정한다. 카드 설명은 원문에 있는 내용으로 요약한다.
- `published`는 프로젝트 참여 시작 월을 기준으로 한다. 원문에 일자가 없으므로 해당 월의 1일을 표시·정렬 기준으로 사용하며, 실제 시작 일자를 뜻하지 않는다. 원문의 참여 기간은 월 단위 그대로 표에 남긴다. CINEVStudio와 Shotloom의 날짜는 변경하지 않는다.
- 기술 태그는 모두 유지하면서 소문자 kebab-case로 정규화한다. 예: `Unreal → unreal-engine`, `C++ → cpp`, `C# → csharp`, `TCP/IP → tcp-ip`, `HTC VIVE → htc-vive`, `Perception Nueron → perception-neuron`. 본문 기술 표의 원문 표기는 유지한다.
- 본문 이미지 38장과 표지 15장을 프로젝트별 `src/content/projects/images/<slug>/`에 저장한다. 기존 WebP는 그대로 복사하고 그 외 형식은 해상도를 유지한 무손실 WebP로 변환한다. 만료되는 Notion 서명 URL은 게시 파일에 넣지 않는다.
- YouTube 영상 16개를 임베드로 변환한다. 원문에 만료 안내가 있는 Brutal League 영상 1개는 원래 주소와 안내를 링크 형태로 보존한다. 외부 서비스의 지속적인 접근 가능성이나 모든 영상의 재생을 보장하지는 않는다.
- `draft: false`인 게시 준비 파일을 PR에서 검토하며, 사용자 검토 전에는 병합하지 않는다.

## 원본 대응표

파일 위치: `src/content/projects/`.

| 원본 | 참여 기간 | 파일 |
| --- | --- | --- |
| [RythM_Eister](https://hon454.notion.site/1393ba935abb4b0aa740407080de7b20) | 2011.10 - 2011.12 | `rythm-eister.md` |
| [ELOPE](https://hon454.notion.site/a323c54678234b6492054aca40f04232) | 2012.10 - 2012.12 | `elope.md` |
| [CSIA 2014 웹사이트 개발 외주](https://hon454.notion.site/15ec6e30b8db411fb1ab54d72b8d3550) | 2014.02 - 2014.03 | `csia-2014.md` |
| [新승람도](https://hon454.notion.site/ff0db8c1cb784344b32226726a52f58f) | 2014.05 - 2014.06 | `sin-seungnamdo.md` |
| [PUZZLE HERO](https://hon454.notion.site/3090e6c2aa2141f5a6d388b72c3dfea4) | 2014.07 - 2014.08 | `puzzle-hero.md` |
| [해녀와 바다](https://hon454.notion.site/1ffe5082c42e493b9594b36dcb1d533e) | 2015.12 - 2016.01 | `haenyeo-and-the-sea.md` |
| [#BeFearless - Fear of Heights](https://hon454.notion.site/efdfd67ef2a141f3b08a6745f6827155) | 2016.06 - 2016.12 | `be-fearless.md` |
| [onAirVR Client 2.0](https://hon454.notion.site/3bbf30cab0ae4ad79c6c4d2a27c45793) | 2017.01 - 2017.05 | `onairvr-client-2.md` |
| [학도병의 편지](https://hon454.notion.site/6401ba907ac2463eb1f25e17597e4880) | 2017.05 - 2017.06 | `student-soldiers-letter.md` |
| [Space Walker](https://hon454.notion.site/2c8035399b464756b7004e16e24ca4e2) | 2017.05 - 2017.06 | `space-walker.md` |
| [CircleVR](https://hon454.notion.site/ad5c007f7af74ea0b4f2080cc8db4f54) | 2017.06 - 2018.02 | `circle-vr.md` |
| [Vapor World](https://hon454.notion.site/d30da02bcdcd457f913b2d7c4453a6d5) | 2019.06 - 2020.04 | `vapor-world.md` |
| [Brutal League](https://hon454.notion.site/1972e4a6eb4545b19893a1cbaa84fbad) | 2020.07 - 2020.08 | `brutal-league.md` |
| [Night of the Dead](https://hon454.notion.site/d820babada404cddb0c999105ffad49e) | 2021.01 - 2024.06 | `night-of-the-dead.md` |
| [길고양이 이야기 2](https://hon454.notion.site/81ee3914aa6d4bbf8bbbebb5c6c6e47e) | 2021.10 - 2023.12 | `a-street-cats-tale-2.md` |

## Notion 도구에서 누락된 자료 복원

Notion 데스크톱의 실제 페이지에서 링크 목적지를 확인해 원래 본문 위치에 복원했다.

- Night of the Dead: Steam 상점 1개와 개발 업데이트 #19~#03의 17개 링크.
- 길고양이 이야기 2: 텀블벅, 스토브, 스마일게이트 동물보호 캠페인, Steam 상점의 4개 링크.
- Night of the Dead의 `NOTD_News_20240415 (1).webp`는 Notion UI에서 직접 다운로드했다. 180,374바이트인 원본을 `images/night-of-the-dead/image-03.webp`로 보존했다.

## 검증

- 15개 프로젝트의 원문 텍스트 160개 항목을 대조하고 로컬 이미지 53개를 디코딩했다.
- `pnpm check`: 오류·경고·힌트 0개.
- `pnpm type-check`: 통과. 최초 실행은 Astro 생성 타입이 없는 상태에서 실패했으며, 콘텐츠 타입 생성 후 재실행은 통과했다.
- `pnpm build`: 전체 파이프라인 통과. 기존 비활성 경로 등에 대한 Pagefind HTML 안내와 한국어 stemming 미지원 안내는 남는다.
- 로컬 production preview에서 프로젝트 19개(기존 4개 + 신규 15개), 검색, Night of the Dead 본문 이미지·북마크, 모바일 공통 정보표·영상 배치를 확인했다.
- Swup 페이지 이동 후 비어 있던 영상 프레임을 활성 문서에서 다시 생성하도록 수정했다. Space Walker의 목록 진입·캐시 재방문에서 두 YouTube 플레이어와 썸네일 표시를 확인했고, 모바일 390px에서 가로 넘침이 없음을 확인했다. 영상의 `loading="lazy"`는 유지한다.
- 가져온 15개 프로젝트의 날짜를 시작 월 기준으로 변경하고, 프로젝트 목록의 날짜와 정렬을 확인했다.
