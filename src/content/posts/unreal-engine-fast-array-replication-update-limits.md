---
title: "FastArraySerializer 변경·삭제 개수 제한 경고 다루기"
published: 2023-06-21
description: "FFastArraySerializer가 한 번의 업데이트에서 허용된 변경·삭제 개수를 넘었다고 경고할 때 dirty 표시와 대량 변경 설계를 점검하는 방법을 정리합니다."
image: ""
tags:
  - unreal-engine
  - networking
  - replication
  - fast-array
  - debugging
category: Unreal Engine
draft: true
lang: ko
---

`FFastArraySerializer`를 사용한 배열에서 한 frame에 많은 원소를 바꾸거나 지우면 다음 계열의 경고가 나타날 수 있다.

```text
NumDeletes > GetMaxNumberOfAllowedDeletionsPerUpdate()
Header.NumChanged > GetMaxNumberOfAllowedChangesPerUpdate()
```

## 문제 현상

서버의 배열 최종 상태는 맞지만 client가 일부 변경을 받지 못하거나, replication 중 제한 초과 경고가 반복된다. inventory 초기화, 대규모 reset, reconnect snapshot처럼 많은 원소를 한꺼번에 처리하는 경로에서 주로 드러난다.

## 적용 범위

`FFastArraySerializer` 또는 Iris의 fast array 지원을 사용하는 Unreal 프로젝트에 해당한다. 기본 허용 개수와 조정 방법은 엔진 버전에 따라 달라질 수 있으므로 설치한 source의 `GetMaxNumberOfAllowedChangesPerUpdate`와 `GetMaxNumberOfAllowedDeletionsPerUpdate` 구현을 확인한다.

## 원인

Fast Array delta는 한 update에 무제한 변경을 싣지 않는다. 지나치게 큰 packet, 잘못된 ID 또는 악의적인 payload를 막기 위한 제한이 있다. 다음 설계 문제가 제한을 빠르게 소진한다.

- 배열 전체를 지우고 같은 내용을 다시 추가한다.
- 매 tick 같은 원소를 불필요하게 `MarkItemDirty`한다.
- 원소 추가·수정 후 dirty 표시를 빠뜨렸다가 한 번에 몰아서 처리한다.
- 대량 snapshot과 작은 gameplay delta를 같은 replication 경로에 싣는다.

## 재현 및 진단

1. update 직전 추가·수정·삭제 개수와 배열 길이를 로그로 남긴다.
2. `ReplicationID`가 안정적으로 유지되는지 확인한다.
3. 추가·수정에는 `MarkItemDirty`, 구조 변경에는 필요한 `MarkArrayDirty`가 정확히 호출되는지 검사한다.
4. clear-and-rebuild가 실제 delta update로 바뀔 수 있는지 비교한다.
5. 제한값을 exact engine revision의 source와 console variable에서 확인한다.

## 해결 방법

대량 변경을 여러 update로 나누고, 실제로 바뀐 원소만 표시한다. gameplay상 원자적으로 보여야 한다면 client는 batch ID와 완료 표시를 받아 마지막 조각까지 임시 상태에 모은 뒤 한 번에 적용할 수 있다.

초기 전체 snapshot이 일반 delta와 성격이 다르다면 chunked RPC, 별도 replicated object 또는 versioned snapshot 전송도 고려한다. 먼저 전송량과 재전송·late join 요구사항을 측정한 뒤 선택한다.

## 검증 방법

- 제한값 바로 아래와 위의 batch 크기를 시험한다.
- packet loss와 latency를 켠 dedicated server/client에서 최종 배열을 비교한다.
- 추가, 수정, 삭제, 전체 초기화, late join을 각각 테스트한다.
- 경고가 없어졌는지만 보지 말고 server/client의 item ID와 payload checksum을 비교한다.

## 주의점

제한값을 크게 올리는 것은 마지막 수단이다. 전송 크기와 CPU 비용을 늘리고 근본적인 dirty 처리 오류를 숨길 수 있다. Fast Array callback의 순서만으로 gameplay event의 정확한 전역 순서를 보장한다고 가정해서도 안 된다.

## 참고 자료

- [Epic Games: FFastArraySerializer](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/NetCore/FFastArraySerializer?lang=en-US)
- [Epic Games: TFastArrayTypeHelper](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/NetCore/TFastArrayTypeHelper)
