---
title: "Firefly 업스트림 반영: 6.17.0"
published: 2026-11-26
description: Firefly 6.17.0의 코드 그룹 리치 탭, 하단 플로팅 가사, Mermaid 엔진 교체, 스페인어 번역과 pnpm 12 전환, 의존성 업데이트.
image: ./images/firefly2.avif
tags: [firefly, astro]
category: 블로그
draft: false
---

Firefly 6.17.0(`1f8aac3`)까지의 업스트림 변경을 반영했다. [지난 반영](/posts/firefly-upstream-sync-6-16-9/) 기준인 `af8e98f` 이후 14개 커밋, 48개 파일이 바뀌었다. 6.17.0 릴리스 이후 커밋은 없다.

## 코드 그룹 리치 탭

#721이다. `rehype-code-group`이 0.3.1에서 2.0.1로 올랐고, 탭 동작을 직접 처리하던 `CodeGroupManager.astro`의 이벤트 위임 코드가 사라졌다. 이제 패키지 클라이언트가 스타일과 스크립트를 한 번만 불러오고, Swup으로 바뀐 페이지의 코드 그룹도 감지한다.

- `:::: code-group`과 `::: code-tab`으로 탭 하나에 설명 글, 목록, 코드를 함께 넣을 수 있다. 기존 `::: code-group labels=[...]` 문법은 그대로 동작한다.
- `sh npm2yarn` 펜스에 npm 설치 명령을 쓰면 npm, pnpm, Yarn, Bun 탭이 만들어진다.
- `sync`, `persist`, `orientation="vertical"`, `default` 속성을 쓸 수 있다.
- 탭 색상은 `--rcg-*` 변수로 사이트 테마에 맞췄고, 탭 줄과 코드 패널 사이에 간격(`row-gap`)을 뒀다. 인쇄할 때는 모든 패널이 보인다.
- 사용법을 정리한 `docs/code-groups.md`와 Playwright 테스트(`pnpm test:code-groups`)가 추가됐다.
- 샘플 글 `code-examples`(발행일 `1970-01-03`, 중국어)가 함께 들어왔다. 이 블로그에는 없던 글이고 업스트림과 맞추려고 그대로 추가했다. 테스트가 이 글의 `/posts/code-examples/`를 열기 때문이다.

이 블로그의 기존 글 중 `code-group` 문법을 쓰는 글은 없다.

## 하단 플로팅 가사

#725다. 음악이 재생되는 동안 화면 아래에 가사를 띄운다. 데스크톱은 3줄, 모바일은 1줄이고, X로 닫아도 다시 재생하면 나타난다.

- `musicPlayerConfig`에 `showFloatingLyrics`가 추가됐다. 기본값은 `true`다.
- i18n 키 `musicFloatingLyrics`, `musicCloseFloatingLyrics`가 추가됐다. 한국어 문구는 `플로팅 가사`, `플로팅 가사 닫기`다.

이 블로그는 `showFloatingLyrics: true`로 두었다. 로컬 재생 목록 5곡의 `lrc`는 모두 비어 있다.

## Mermaid 엔진 교체

#717, #724다. 빌드할 때 Mermaid를 SVG로 바꾸는 엔진이 `@mermanjs/web`에서 `@mermanjs/node` 0.11.0으로 바뀌었다. `@mermanjs/web`은 렌더가 아니라 SVG 검증에만 쓴다. 이 변경으로 linux-arm64에서도 빌드된다.

- 테마 이름 체계가 바뀌었다. `lightTheme`와 `darkTheme`는 프리셋만 적고, 밝은 모드와 어두운 모드는 렌더 옵션(Options JSON schema 3)에서 정한다. 기본값은 `editor-light`와 `editor-dark`에서 둘 다 `editor`가 됐다.
- 선택할 수 있는 프리셋이 늘었다. 밝은 모드는 `editor`, `gruvbox`, `ayu`, `brutalist`, `spotless`, `ghibli`, `paper-cut`, `carbon-copy`, `pop-art`이고, 어두운 모드는 `editor`, `gruvbox`, `ayu`, `one-dark`, `cyberpunk`다.

새 엔진에서는 시퀀스 다이어그램의 참여자 ID로 `Actor`를 쓸 수 없다. `unreal-engine-networking-containers-and-deferred-spawn` 글의 다이어그램이 `participant Actor as Deferred Actor`를 쓰고 있어서 렌더에 실패했다. 표시 이름은 그대로 두고 ID만 `DA`로 바꿨다.

## 다국어와 표시 수정

- 스페인어(`es`) 번역이 추가됐다(#722). `siteConfig`의 언어 코드 목록에 `es`가 들어갔다. 이 블로그의 언어는 `ko`다.
- 동적 페이지 사이드바의 시간이 동적 페이지와 같은 값으로 나온다(#726). `formatDynamicDate`가 사이트 시간대로 한 번 더 변환하지 않고 UTC로 포맷해, 시간대 없이 적은 작성 시각을 그대로 보여 준다.
- 태블릿 폭에서 `tabletSidebar`로 정한 쪽에 위젯이 없으면 반대쪽 사이드바를 보여 준다(#713). 이 블로그는 `position: both`, `tabletSidebar: left`다.
- 인라인 코드 안의 연속 공백이 유지된다(#708). 코드 블록은 영향이 없다.
- `katex`를 `^0.19.1`로 고정하는 override가 `pnpm-workspace.yaml`에 추가됐다(#718).
- Biome 스키마 버전을 2.6.3으로 맞췄다.

## 빌드와 도구

- `packageManager`가 `pnpm@11.22.0`에서 `pnpm@12.23.0`으로, `engines.node`가 `>=22.23.0`에서 `>=22.23.4`로 올랐다.
- `deploy.yml`의 Node가 22에서 24로 바뀌었고, pnpm 버전은 `package.json`의 `packageManager`를 따르도록 `version` 고정을 뺐다.
- `build.yml`의 Node 매트릭스가 `[22, 23]`에서 `[22, 24]`로 바뀌었다. Node 22 빌드 작업은 빌드 뒤 Chromium을 설치하고 `pnpm test:code-groups`를 실행한다.
- Playwright 1.65.0(`@playwright/test`)이 개발 의존성에 추가됐다.

## 의존성

16개 업데이트(#727) 중 주요 항목이다.

- `astro`: 7.3.2 → 7.4.13
- `@astrojs/cloudflare`: 14.3.1 → 14.4.9
- `@astrojs/mdx`: 8.0.1 → 8.1.6
- `@astrojs/svelte`: 9.0.1 → 9.1.6
- `svelte`: 5.57.2 → 5.59.1
- `pagefind`: 1.5.2 → 1.6.0
- `satteri`: 0.10.5 → 0.11.7
- `takumi-js`: 2.14.0 → 2.22.1
- `marked`: 18.1.1 → 18.2.1
- `wrangler`: 4.147.0 → 4.166.0
- `rehype-code-group`: 0.3.1 → 2.0.1
- `@mermanjs/web`: 0.8.0-alpha.3 → 0.11.0, `@mermanjs/node` 0.11.0 추가

## 검증

- `pnpm check`: 269개 파일, 오류·경고·힌트 0개.
- `pnpm type-check`: 통과.
- `npx biome ci ./src`: 349개 파일 검사, 수정 사항 없음. 경고 24개는 기존 `src/content/projects/images/shotloom/agent-workflow.svg`에서 나온다.
- `pnpm build`: 통과. 이 글을 포함해 정적 페이지 132개를 생성하고 Pagefind에 103개 페이지를 인덱싱했다. Mermaid 렌더 실패 로그는 위 다이어그램 ID를 고친 뒤 사라졌다.
- `pnpm test:code-groups`: 8개 중 7개 통과. `sync and local persistence survive reload and Swup navigation` 1개는 Swup으로 `/about/`에 이동한 뒤 링크를 누르는 단계에서 시간 초과로 실패했다. 이 테스트를 9번 실행해 1번 통과했다.

[업스트림 변경 비교](https://github.com/CuteLeaf/Firefly/compare/af8e98fd6a622441b19239bf2f5ea6416af309c2...1f8aac346007dda262e68a114c8b7394ae1f3e04)
