---
title: "Firefly 업스트림 반영: 6.16.8"
published: 2026-09-22
description: Firefly 6.16.8과 이후 6d82554bf까지의 구독 기능, 프로젝트 표시, 사이드바와 페이지 스타일 변경 사항.
tags: [firefly, astro]
category: 블로그
draft: true
---

Firefly 6.16.8과 이후 `6d82554bf`까지의 업스트림 변경을 반영했다. [지난 반영](/posts/firefly-upstream-sync-6-16-7/) 기준인 `083603e4c` 이후 17개 커밋이며, Astro는 7.3.2로 올렸다.

## 구독과 사이트 안내

- 기존 RSS와 함께 [Atom 피드](/atom.xml)를 제공한다. 푸터에 Atom 링크를 추가하고, [구독 안내 페이지](/atom/)에서 피드 주소를 복사할 수 있다.
- RSS와 Atom의 본문 생성 로직을 통합했다. `siteConfig.feed.contentMode`를 `full` 또는 `summary`로 지정할 수 있으며, 이 블로그는 전문을 제공하는 `full`을 사용한다.
- [llms.txt](/llms.txt)에 사이트 설명, 활성화한 주요 페이지, 최근 글 20개의 링크와 설명을 제공한다.

## 프로젝트와 페이지 표시

- 프로젝트 카드의 상태 배지를 표지 오른쪽 위로 옮기고 날짜·태그 표시를 조정했다.
- 글 메타데이터의 태그 줄바꿈과 아이콘 정렬을 보완했다.
- 앨범 목록 카드 스타일을 변경했다.
- 페이지별 스타일을 분리하고 프로젝트·갤러리 등 주요 페이지의 머리글 스타일을 통일했다.

## 사이드바와 푸터

- 실제 표시할 위젯이 있는지에 따라 사이드바 열과 본문 너비를 계산하도록 메인 그리드를 변경했다.
- `showBothSidebarsOnPostPage` 옵션을 제거했다. 사이드바가 없는 페이지의 본문 너비는 새 옵션 `noSidebarContentWidth`로 설정한다.
- 푸터를 새 레이아웃 구조에 맞춰 배치했다. `footerConfig.enable` 옵션을 제거했으며, 추가 내용은 `src/config/FooterConfig.html`을 직접 편집한다.

## 화면 동작과 의존성

- 태블릿에서 떠 있는 목차의 하단 항목이 잘리는 문제를 수정했다.
- 전체화면 레이아웃 전환을 허용하지 않을 때는 저장된 캐시 대신 사이트 설정을 사용하도록 수정했다.
- Waline의 이모지 패널 잘림과 분류 전환 시 흔들림 수정 사항을 포함했다. 이 블로그의 댓글은 Giscus를 사용한다.
- Astro를 7.2.10에서 7.3.2로, `@astrojs/mdx`를 7.0.8에서 8.0.1로 올렸다.
- OG 이미지 생성 시 Google Fonts를 요청하는 대신 패키지에 포함된 로컬 폰트를 읽도록 변경했다. 이 블로그의 OG 이미지 자동 생성은 비활성화 상태다.

## 검증과 반영 범위

- `pnpm check`: 261개 파일, 오류·경고·힌트 0개.
- `pnpm type-check`, `pnpm build`: 통과. 정적 페이지 98개를 생성하고 Pagefind에 72개 페이지를 인덱싱했다.
- RSS와 Atom이 각각 글 50개를 포함하는 유효한 XML인지 확인했다.
- 프로젝트 검색·상세 이동, 모바일 상세와 Atom 링크 복사, 태블릿 목차, 데스크톱 몰입 읽기 진입·종료를 확인했다.

[업스트림 변경 비교](https://github.com/CuteLeaf/Firefly/compare/083603e4cbbb456198797ce36d5a10e8c3b21066...6d82554bfe1cb3d4b43adb0969dad1d43ac6dee3)
