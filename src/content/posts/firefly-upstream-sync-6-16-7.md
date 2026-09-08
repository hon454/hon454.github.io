---
title: "Firefly 업스트림 반영: 6.16.7"
published: 2026-09-08
description: Firefly 6.16.7과 이후 083603e4c까지의 프로젝트 페이지, 몰입 읽기, 메타데이터 및 화면 동작 변경 사항.
image: ./images/firefly3.avif
tags: [firefly, astro]
category: 블로그
draft: false
---

Firefly 6.16.7과 이후 `083603e4c`까지의 업스트림 변경을 반영했다. [지난 반영](/posts/firefly-upstream-sync-6-16-6/) 기준은 `0f2fab602`이며, Astro 버전은 7.2.10이다.

## 프로젝트 페이지

- 블로그 글과 별도 컬렉션인 [프로젝트 목록](/projects/)과 상세 페이지를 추가했다. 내비게이션의 ‘내 공간’에서 접근할 수 있다.
- 이름·설명·태그 검색과 상태 필터를 지원한다. `order` 내림차순으로 정렬하고, 같은 값이면 `published`가 최신인 순서로 표시한다.
- 프로젝트 작성 가이드를 한국어로 옮겨 [블로그 가이드](/posts/firefly-blog-guide/#프로젝트-작성하기)에 통합했다. 기존 작성 가이드 주소도 해당 절로 연결된다.
- [Firefly 테마 예제](https://github.com/hon454/hon454.github.io/blob/a2d9847037d0472ac617d2814028cd165b601f64/src/content/projects/firefly.md)를 포함했다. 예제 본문은 중국어이며, 상태와 검색 안내는 한국어로 표시된다.

## 몰입 읽기

- 데스크톱의 글·프로젝트 상세에 본문과 전용 목차를 표시하는 몰입 읽기를 추가했다. 오른쪽 아래 버튼으로 진입한다.
- 목차의 접기·펼치기를 지원하며, `Esc`로 종료하면 진입 전 스크롤 위치로 돌아간다.
- `src/config/siteConfig.ts`의 `post.immersiveReading`에서 설정한다. 현재 기능은 활성화했으며, 기본 진입 상태는 꺼짐, 목차 위치는 왼쪽이다.

## 글 하단 설정과 메타데이터

- 공유 설정 이름을 `post.sharePoster`에서 `post.share`로 변경했다.
- 이전·다음 글 이동(`postNavigation`), 관련 글(`relatedPosts`), 무작위 글(`randomPosts`)의 표시 여부를 개별 설정할 수 있다. 현재는 모두 활성화했다.
- 글 표지 또는 사이트 로고를 사용하는 OG 메타데이터를 보완하고, OG 언어와 이미지 설명을 추가했다. OG 이미지 자동 생성은 비활성화 상태다.
- 아카이브와 검색 페이지의 canonical에서 필터 쿼리를 제거했다.

## 배경과 페이지 이동

- 배경 모드 전환 처리와 텍스트 잔상 관련 CSS 수정 사항을 반영했다.
- 페이지 전환 중 본문 전체에 지속적으로 적용하던 `will-change: transform`을 제거했다.
- 모바일 메뉴에서 링크를 누르면 패널이 닫히도록 변경했다.

## 반영 기준과 검증

- 반영 범위: [`0f2fab602…083603e4c`](https://github.com/CuteLeaf/Firefly/compare/0f2fab602407eb577cdcca066049fe947563ae0f...083603e4cbbb456198797ce36d5a10e8c3b21066)
- 정적 검사·빌드: `pnpm check`, `pnpm type-check`, `pnpm build` 통과
- 동작 확인: 프로젝트 목록·상세·표지·검색·상태 필터, 모바일 메뉴 이동, 배경 모드 전환, 글 표지의 목록·격자 표시, 몰입 읽기 진입·목차 이동·접기·종료
- 성능 벤치마크는 별도로 실행하지 않았다.
