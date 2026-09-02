---
title: "Firefly 업스트림 반영: 6.16.6"
published: 2026-09-02
description: Firefly 6.16.3 이후 6.16.6까지의 업스트림 변경을 개인 콘텐츠와 설정을 유지하면서 반영한 기록입니다.
image: ./images/firefly2.avif
tags: [firefly, astro]
category: 블로그
draft: false
series: Firefly 업스트림 반영 기록
seriesOrder: 1
---

[Firefly](https://github.com/CuteLeaf/Firefly) 업스트림 기준을 6.16.3에서 6.16.6으로 올렸다. 이번 버전에서는 내비게이션 동작, 시리즈, 미디어 목록 필터링, OG 이미지와 구조화 데이터 처리가 달라졌다. 기존 글과 Steady Spiral 설정은 그대로 유지했다.

## 화면과 탐색

내비게이션은 `dynamic` 모드로 변경했다. 아래로 스크롤하면 숨고 위로 스크롤하면 다시 나타난다. 배너와 전체 화면 배경에서 사용하는 투명 모드도 새 설정 구조에 맞췄다.

모바일 내비게이션 패널은 화면 전체를 안정적으로 덮도록 구조가 바뀌었다. 밝은 테마와 어두운 테마를 전환하는 버튼의 동작과 표시도 함께 정리됐다.

## 시리즈

여러 글을 `series`와 `seriesOrder`로 묶을 수 있게 됐다. 시리즈를 지정한 글에는 같은 묶음의 글 목록이 표시되고, `/series/`에서는 전체 시리즈를 모아 볼 수 있다.

이 글을 `Firefly 업스트림 반영 기록` 시리즈의 첫 글로 지정했다. 다음 업스트림 반영부터 같은 시리즈에 순서대로 추가할 예정이다. 설정 방법은 [Firefly 블로그 가이드](/posts/firefly-blog-guide/)에도 정리했다.

## 미디어 목록

Bangumi, VNDB, MyAnimeList의 NSFW 처리가 공통 설정을 사용하도록 바뀌었다. 현재 설정에서는 Bangumi와 MyAnimeList의 해당 항목을 숨기고, VNDB 표지는 흐리게 표시한다.

## OG 이미지와 구조화 데이터

OG 이미지 생성은 Satori 대신 Takumi를 사용한다. 이 블로그에서는 자동 생성을 계속 꺼 두었지만, 나중에 기능을 켤 때는 새 구현을 사용하게 된다.

글과 프로필에 들어가는 구조화 데이터도 추가됐다. 게시자 로고, 프로필 이미지와 글 표지가 실제 배포 주소를 사용하도록 이미지 경로 처리도 함께 반영했다.

## 기존 설정

프로필과 사이트 제목, 로고, favicon을 포함한 Steady Spiral 브랜딩은 유지했다. 기존 글과 동적 콘텐츠도 손대지 않았다. 이전에 삭제한 Firefly 예제 글은 다시 추가하지 않았다.

이번 반영 기준은 Firefly 6.16.6의 [`f7c93c932`](https://github.com/CuteLeaf/Firefly/commit/f7c93c932c3241239f6f0d330e0b5c1bc701ce45) 커밋이다.
