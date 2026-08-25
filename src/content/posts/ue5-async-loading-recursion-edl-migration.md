---
title: "UE4→UE5 전환 후 AsyncLoading 재귀 assertion 진단"
published: 2023-11-03
updated: 2026-08-24
description: "UE4 프로젝트를 UE5로 옮긴 뒤 패키징 빌드에서 AsyncLoadingThread RecursionNotAllowed assertion이 발생할 때 재진입 로드를 찾는 절차를 정리합니다."
image: ""
tags:
  - unreal-engine
  - async-loading
  - edl
  - migration
  - crash
category: Unreal Engine
draft: false
lang: ko
---

UE4 프로젝트를 UE5로 전환한 뒤 editor에서는 동작하지만 패키징 빌드 로드 중 다음 assertion으로 종료되는 문제가 있었다.

```text
AsyncLoadingThread.RecursionNotAllowed.Increment() == 1
```

## 문제 현상

특정 map 또는 asset 묶음을 비동기로 불러올 때 AsyncLoading thread가 처리 중이던 로드 구간에 다시 진입해 assertion이 발생했다. UE4에서 선택적으로 쓰던 Event Driven Loader 설정과 UE5의 기본 로드 경로 차이 때문에 전환 직후 드러나기도 한다.

## 적용 범위

UE4에서 UE5로 asset과 custom C++ serialization 코드를 함께 이관한 뒤 cooked build에서만 재현되는 경우를 다룬다. 원문에는 최종 offending asset이 남아 있지 않으므로 확정 해법이 아닌 진단 초안으로 유지한다.

## 가능한 원인

- `Serialize`, `PostLoad` 또는 UObject constructor에서 동기 asset load를 호출한다.
- async load completion callback이 같은 package를 다시 동기로 요청한다.
- custom archive/loader가 thread-safe하지 않은 전역 상태를 사용한다.
- 오래된 cooked output이나 redirect가 다른 package graph를 만든다.
- custom engine 수정이 UE5 AsyncLoading2 경로와 맞지 않는다.

## 재현 및 진단

1. assertion 전 전체 call stack과 마지막으로 로드한 package 이름을 수집해 둔다.
2. `LoadObject`, `StaticLoadObject`, `TryLoad`, synchronous streamable handle 호출을 검색한다.
3. 이 호출이 constructor, `Serialize`, `PostLoad`와 async callback 안에서 실행되는지 나눠 본다.
4. 문제가 되는 map의 asset dependency를 줄여 최소 재현 package를 찾아낸다.
5. stale cooked output을 배제한 clean cook에서 다시 확인해 본다.
6. custom engine이라면 exact upstream revision과 AsyncLoading 관련 diff도 비교한다.

## 해결 방법

로드 도중 다시 진입하는 동기 load를 제거하고 dependency를 soft reference와 상위 단계의 명시적 async request로 옮긴다. callback에서는 이미 완료된 object를 사용하고 같은 package graph를 다시 로드하지 않는다.

잘못된 asset reference나 redirect가 원인이라면 해당 asset을 새 버전에서 다시 저장하고 redirect를 정리한 뒤 전체 recook한다. assertion 자체를 끄거나 EDL 동작을 억지로 과거 방식으로 되돌리면 상태 손상을 숨길 우려가 있어 해결책으로 보지 않는다.

## 검증 방법

- editor, standalone과 packaged build에서 동일한 map 순서를 반복해 본다.
- cold start와 이미 asset cache가 채워진 두 상황을 시험한다.
- 여러 번의 level transition과 비동기 취소 경로를 확인해 둔다.
- package 이름을 포함한 로드 로그에서 같은 package의 재진입이 사라졌는지 살펴본다.

## 주의점

call stack만으로 “UE5에서는 EDL이 항상 켜져서 생긴다”고 단정할 수 없다. UE5의 async loading 구현도 minor version마다 바뀌므로 exact engine source를 확인하며 조사해야 한다.

## 참고 자료

- [Epic Games: Asynchronous Asset Loading](https://dev.epicgames.com/documentation/en-us/unreal-engine/asynchronous-asset-loading-in-unreal-engine)
- [Epic Games: Asynchronous Level Loading](https://dev.epicgames.com/documentation/unreal-engine/asynchronous-level-loading-in-unreal-engine?lang=en-US)
