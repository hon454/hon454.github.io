---
title: "Firefly 업스트림 반영: 6.16.8 (cd920b035)"
published: 2026-10-22
image: ./images/firefly2.avif
description: Firefly 6.16.8 이후 cd920b035까지의 GitHub Actions Node.js 24 전환, Dependabot 설정과 KaTeX 등 의존성 업데이트.
tags: [firefly, astro, github-actions]
category: 블로그
draft: false
---

Firefly 6.16.8 이후 `cd920b035`까지의 업스트림 변경을 반영했다. [지난 반영](/posts/firefly-upstream-sync-6-16-8/) 기준인 `6d82554bf` 이후 2개 커밋이며, 테마 버전은 6.16.8 그대로다. 화면이나 설정 변경은 없고 CI 워크플로와 의존성만 바뀌었다.

## GitHub Actions

GitHub Actions 러너에서 Node.js 20 기반 액션이 deprecated되면서 워크플로마다 경고가 나오던 것을 각 액션의 Node.js 24 릴리스로 올렸다. 이 변경은 직접 업스트림에 보낸 [CuteLeaf/Firefly#676](https://github.com/CuteLeaf/Firefly/pull/676)이다.

| 액션 | 이전 | 이후 |
| --- | --- | --- |
| `actions/checkout` | v4 / v4.2.2 | v7 / v7.0.1 |
| `actions/setup-node` | v4 / v4.3.0 | v7 / v7.1.0 |
| `pnpm/action-setup` | v4 / v4.1.0 | v6 / v6.1.0 |
| `biomejs/setup-biome` | v2.5.0 | v2.7.1 |
| `actions/upload-pages-artifact` | v3 | v5 |
| `actions/deploy-pages` | v4 | v5 |

- SHA로 고정된 액션은 SHA와 버전 주석을 함께 갱신하고, 태그로 참조하던 액션은 태그를 유지했다.
- `upload-pages-artifact`는 v4부터 숨김 파일을 기본으로 제외한다. `deploy.yml`에 `include-hidden-files: true`를 추가해 `dist/.nojekyll`이 계속 업로드되도록 했다.
- `dependabot.yml`에 주 단위로 액션 업데이트를 묶어 올리는 `github-actions` 항목을 추가했다. 기존 npm 항목은 그대로다.

이 블로그도 GitHub Pages 배포에 같은 `deploy.yml`을 사용한다.

## 의존성

- `katex`: 0.18.7 → 0.19.0. 폰트에 문자 메트릭이 없는 경우를 `strict` 옵션으로 보고하도록 바뀌었고(`symbolNotInFont`), `strict` 콜백이 `undefined`나 `null`을 반환하면 무시하지 않고 경고한다.
- `marked`: 18.0.12 → 18.1.0
- `sanitize-html`: 2.17.7 → 2.18.0, `@types/sanitize-html`: 2.16.1 → 2.16.2
- `takumi-js`: 2.13.7 → 2.14.0
- `wrangler`: 4.127.1 → 4.147.0
- `subset-font`: 2.7.0 → 2.9.0

## 검증

- `pnpm check`: 265개 파일, 오류·경고·힌트 0개.
- `pnpm type-check`, `pnpm build`: 통과. 정적 페이지 119개를 생성하고 Pagefind에 91개 페이지를 인덱싱했다.
- 수식이 들어간 [블로그 가이드](/posts/firefly-blog-guide/)가 KaTeX 0.19.0에서 `katex-error` 없이 렌더링되는 것을 확인했다.

[업스트림 변경 비교](https://github.com/CuteLeaf/Firefly/compare/6d82554bfe1cb3d4b43adb0969dad1d43ac6dee3...cd920b035b475fe9a6cd3a88afb42cf9440bb8a9)
