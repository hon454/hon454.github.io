---
title: "Firefly 업스트림 반영: 6.16.6"
published: 2026-09-02
description: Firefly 6.16.3 이후 6.16.6까지의 업스트림 변경을 개인 콘텐츠와 설정을 유지하면서 반영한 기록입니다.
image: ./images/firefly2.avif
tags: [firefly, astro]
category: 블로그
draft: true
series: Firefly 업스트림 반영 기록
seriesOrder: 1
---

Firefly 업스트림을 6.16.3에서 6.16.6 기준으로 반영했다. 개인 콘텐츠와 설정은 유지하고, 충돌한 기능은 새 업스트림 방향에 맞춰 통합했다.

이 블로그는 Firefly에서 파생했지만 Git 이력을 직접 공유하지 않는다. 따라서 업스트림 브랜치를 병합하지 않고, 이전에 반영한 커밋부터 새 대상 커밋까지의 변경분만 가져오는 방식으로 관리한다.

## 반영 범위

- 업스트림 저장소: [CuteLeaf/Firefly](https://github.com/CuteLeaf/Firefly)
- 이전 기준: [`c17fea3e9`](https://github.com/CuteLeaf/Firefly/commit/c17fea3e9f2caa4108c1832b8b47552e509b45b4), Firefly 6.16.3
- 새 기준: [`f7c93c932`](https://github.com/CuteLeaf/Firefly/commit/f7c93c932c3241239f6f0d330e0b5c1bc701ce45), Firefly 6.16.6
- 반영 PR: [hon454.github.io #90](https://github.com/hon454/hon454.github.io/pull/90)

## 주요 변경

- 내비게이션을 아래로 스크롤할 때 숨고 위로 스크롤할 때 나타나는 `dynamic` 모드로 변경했다.
- 배너와 전체 화면 배경의 내비게이션 투명 모드를 새 설정 구조에 맞추고 흐림 값을 12로 조정했다.
- 글의 `series`와 `seriesOrder`, 글 안의 시리즈 탐색, `/series/` 인덱스를 추가했다.
- Bangumi, VNDB, MyAnimeList의 NSFW 처리를 공통 설정으로 정리했다.
- OG 이미지 생성을 Satori에서 Takumi 기반으로 교체했다. 이 블로그에서는 `generateOgImages: false` 설정을 유지한다.
- 구조화 데이터와 이미지 경로 처리, 모바일 내비게이션 패널, Pagefind 실행 스크립트 변경을 반영했다.

## 로컬에서 유지한 항목

- 프로필, 사이트 제목, 로고와 favicon을 포함한 Steady Spiral 브랜딩
- 기존 글과 동적 콘텐츠
- 이미 삭제한 Firefly 예제 글 13개
- 글 페이지의 데스크톱·태블릿 `siteInfo` 숨김과 모바일 하단 표시 설정
- 로컬에서 사용 중인 Satteri 의존성과 OG 이미지 생성 비활성화 설정

삭제한 예제 글은 다시 가져오지 않았다. 새로 추가된 시리즈 사용법은 [Firefly 블로그 가이드](/posts/firefly-blog-guide/)에 옮겼다.

## 검증

다음 검사를 통과한 뒤 하나의 업스트림 반영 커밋으로 `main`에 병합했다.

```text
pnpm check
pnpm type-check
pnpm build
pnpm exec biome check ./src ./scripts
```

GitHub Actions에서도 Node.js 22와 23의 Astro 검사와 빌드, 코드 품질 검사가 모두 통과했다.
