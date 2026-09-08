---
title: "Firefly 업스트림 반영: 프로젝트 페이지와 몰입 읽기"
published: 2026-09-08
description: Firefly 6.16.7 이후 083603e4c까지의 변경을 반영하고 프로젝트 예제, 몰입 읽기와 글 하단 설정을 확인한 기록이다.
image: ./images/firefly3.avif
tags: [firefly, astro]
category: 블로그
draft: false
---

Firefly 업스트림에 프로젝트 페이지와 몰입 읽기가 추가됐다. [지난 반영](/posts/firefly-upstream-sync-6-16-6/)의 `0f2fab602`부터 `083603e4c`까지 변경을 가져왔다. 테마 버전은 6.16.7, Astro는 7.2.10이다.

이 저장소는 템플릿에서 만들어 upstream과 Git 이력을 공유하지 않는다. 이번에도 `origin/main`에서 브랜치를 만들고 두 upstream 커밋 사이의 차이만 적용했다. 기존 글과 Steady Spiral 브랜딩, 개인 배경 설정은 유지했다.

## 프로젝트 페이지

[프로젝트 목록](/projects/)을 활성화했다. 내비게이션의 ‘내 공간’에서도 들어갈 수 있다. 프로젝트는 블로그 글과 별도 컬렉션이며, 이름·설명·태그로 검색하거나 상태로 필터링한다.

upstream 반영 당시에는 Firefly 테마 예제와 작성 가이드 예제를 함께 두었다. 글을 발행하면서 작성 가이드 내용은 [Firefly 블로그 가이드의 프로젝트 작성하기](/posts/firefly-blog-guide/#프로젝트-작성하기)에 한국어로 옮겨 통합했다. 기존 작성 가이드 주소도 해당 절로 연결된다.

프로젝트 목록에는 upstream의 [Firefly 테마 예제](/projects/firefly/)를 남겼다. 개인 프로젝트 소개로 바꾸기 전이라 본문은 중국어 원문이고, 화면의 상태와 검색 안내는 사이트 언어인 한국어로 표시된다.

나중에 내용을 바꿀 파일은 다음과 같다.

- `src/content/projects/firefly.md`: Firefly 소개, 상태, 태그와 외부 링크
- `src/content/posts/firefly-blog-guide.md`: 프로젝트 Frontmatter 필드와 상태 값 사용 가이드
- `src/content/projects/images/firefly.avif`: Firefly 예제 표지

목록 카드와 상세 상단은 frontmatter를 사용하고, 상세 본문은 Markdown을 렌더링한다. `order`가 클수록 먼저 나오며 같은 값이면 `published`가 최신인 순서로 정렬된다.

## 몰입 읽기

데스크톱 상세 페이지 오른쪽 아래에 몰입 읽기 버튼이 생겼다. 켜면 본문과 전용 목차가 남는다. 목차를 접거나 다시 펼칠 수 있고, `Esc`로 빠져나오면 진입 전 스크롤 위치로 돌아간다.

`src/config/siteConfig.ts`의 `post.immersiveReading`에서 설정한다. 이 블로그는 기능을 켜되 기본 진입 상태는 꺼 두었다. 목차는 왼쪽에 표시한다. 프로젝트 상세에서도 같은 읽기 모드를 사용한다.

## 글 하단 설정과 메타데이터

기존 `post.sharePoster`는 `post.share`로 바뀌었다. 이전·다음 글 이동은 `postNavigation`, 관련 글은 `relatedPosts`, 무작위 글은 `randomPosts`로 각각 표시 여부를 정한다. 현재는 모두 켜 두었다.

OG 이미지 자동 생성은 계속 `false`다. 자동 생성 대신 글 표지를 쓰는 경우와 사이트 로고로 대체하는 경우의 메타데이터가 보완됐고, OG 언어와 이미지 설명도 추가됐다. 아카이브와 검색 페이지의 canonical에서 필터 쿼리를 제거하는 처리도 포함됐다.

## 배경과 페이지 이동

upstream에서 배경 모드 전환 처리와 텍스트 잔상 관련 CSS를 수정했다. 페이지 전환 중 본문 전체에 지속적으로 적용하던 `will-change: transform`을 제거하는 변경도 가져왔다. 모바일 메뉴는 이동할 링크를 누르면 닫히도록 바뀌었다.

기존 스크롤 성능 제약은 유지했다. 전체 화면 블러는 2px 단위로 쓰고 최대값을 캐시한다. 사이드바 높이는 초기화와 페이지 이동 시 갱신하며 스크롤마다 읽지 않는다. `fullscreen.blurRamp.enable`의 데스크톱·모바일 설정도 그대로다.

## 확인한 범위

`pnpm check`, `pnpm type-check`, `pnpm build`를 통과했다. upstream 반영 당시 프로덕션 미리보기에서 프로젝트 두 예제와 표지를 확인했고, 상태 필터와 검색도 동작했다. 모바일에서는 메뉴 링크를 누른 뒤 패널이 닫히고 프로젝트 상세로 이동하는 것을 확인했다.

개발 서버에서 표시 설정을 일시적으로 켜 배너·전체 화면·오버레이·배경 없음 전환을 확인했다. 새 글의 표지는 목록형과 격자형에서 확인했으며, 몰입 읽기 진입·목차 이동·접기·종료도 확인했다. 별도 성능 벤치마크를 실행한 것은 아니다.

## 반영 기준

이번 변경 범위는 [`0f2fab602…083603e4c`](https://github.com/CuteLeaf/Firefly/compare/0f2fab602407eb577cdcca066049fe947563ae0f...083603e4cbbb456198797ce36d5a10e8c3b21066)다. upstream 반영은 하나의 vendor 커밋으로 기록하고 이 글은 별도 커밋으로 분리한다.
