---
title: "Firefly 업스트림 반영: 6.16.9"
published: 2026-11-06
description: Firefly 6.16.9와 이후 af8e98f까지의 모바일 메뉴 드로어, 날짜 타임존 처리, 음악 플레이어, MDX 이미지 그리드 변경과 의존성 업데이트.
image: ./images/firefly3.avif
tags: [firefly, astro]
category: 블로그
draft: false
---

Firefly 6.16.9와 이후 `af8e98f`까지의 업스트림 변경을 반영했다. [지난 반영](/posts/firefly-upstream-sync-6-16-8-cd920b0/) 기준은 `cd920b035`이며 10개 커밋, 17개 파일이 바뀌었다. 6.16.9 릴리스 이후 커밋은 아래에서 따로 표시했다.

## 모바일 메뉴 드로어

- 모바일 드로어를 열면 배경이 회색으로 어두워지던 문제와 오버레이 계층 문제를 고쳤다.
- 드로어와 오버레이를 `fixed` 대신 `absolute` 기준으로 옮기고, 열 때의 문서 위치와 높이를 CSS 변수(`--mobile-menu-document-top`, `--mobile-menu-paint-height`)로 잡는다. Safari의 하단 툴바 애니메이션으로 그리기 영역이 바뀌는 것을 막으려는 변경이다.
- 검은 `scrim` 대신 드로어와 같은 유리 질감 배경을 사용하고, 닫힐 때는 슬라이드가 끝난 뒤(0.3초) 숨겨 화면 가장자리에 그림자가 남지 않게 했다.
- `BrowserChrome.astro`를 추가해 브라우저 UI 색(`theme-color`)을 현재 라이트·다크 테마 배경에 맞춘다. `viewport-fit=cover`도 함께 설정된다.

## 날짜 처리

릴리스 이후 변경(#700)이다. 날짜 포맷과 아카이브 그룹핑이 `siteConfig.timezone`을 따르도록 바뀌었다.

- `formatDateToYYYYMMDD`가 `toISOString()` 대신 설정된 타임존으로 날짜를 만든다.
- `2026-11-06`처럼 시간 없이 적은 날짜(UTC 자정으로 해석되는 값)는 입력한 날짜를 그대로 유지한다.
- `allPostMeta.json`에 `publishedDate`가 추가되고, 추천 글 위젯이 이 값을 사용한다.

이 블로그의 `published` 중 시간이 들어간 값은 `+09:00` 기준 오전 9시, 오후 2시, 오후 5시대라서 `siteConfig.timezone`(`Asia/Shanghai`)으로 바꿔도 날짜가 달라지지 않는다.

## 음악 플레이어

릴리스 이후 변경(#697)이다.

- 키보드 미디어 키와 시스템 재생 컨트롤을 플레이어 상태와 동기화한다.
- 진행 슬라이더를 드래그할 수 있다.
- 접근성 포커스 링이 잘리던 문제를 고쳤다.

## 갤러리와 MDX

- 릴리스 이후 변경(#699): 모바일 앨범 상세에서 뒤로가기 버튼이 제목에 가려져 눌리지 않던 문제를 고쳤다.
- 릴리스 이후 변경(#672): `remark-image-grid`가 MDX 컴포넌트(`<TimelineItem>`, `<StepItem>`) 안의 `[grid]` 블록을 처리한다. `[grid]` 앞뒤 줄에 본문이 붙어 있어도 문단을 분리해 마커를 인식한다. 이 블로그에는 `.mdx` 글이 없어 영향받는 글은 없다.

## 빌드와 도구

- 빌드 스크립트의 `astro build`가 `astro build --force`로 바뀌었다(#679).
- Biome을 2.5.12에서 2.6.3으로 올렸고 `biome.json`에서 Markdown 콘텐츠 파일을 제외했다(#680).
- `biome.yml` 워크플로의 `biomejs/setup-biome`에서 `version` 고정을 제거했다. 이 저장소가 고정해 두었던 `2.5.7`도 함께 사라지므로 `package.json`의 Biome 버전을 따른다.

## 의존성

패치 업데이트 23개(#696) 중 주요 항목이다.

- `katex`: 0.19.0 → 0.19.1
- `marked`: 18.1.0 → 18.1.1
- `sanitize-html`: 2.18.0 → 2.18.1
- `sharp`: 0.35.4 → 0.35.5
- `svelte`: 5.57.0 → 5.57.2
- `@astrojs/check`: 0.9.10 → 0.9.12
- `@astrojs/markdown-remark`: 7.3.1 → 7.3.4

## 검증

- `pnpm check`: 266개 파일, 오류·경고·힌트 0개.
- `pnpm type-check`, `pnpm build`: 통과. 정적 페이지 124개를 생성하고 Pagefind에 95개 페이지를 인덱싱했다.
- `biome ci ./src`: 323개 파일 검사, 수정 사항 없음.

[업스트림 변경 비교](https://github.com/CuteLeaf/Firefly/compare/cd920b035b475fe9a6cd3a88afb42cf9440bb8a9...af8e98fd6a622441b19239bf2f5ea6416af309c2)
