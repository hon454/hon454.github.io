---
published: 2021-12-22
updated: 2026-08-24
author: Jihoon Jeon
title: 'UE4 BlueprintCallable 함수에 실행 핀이 보이지 않는 이유'
description: UE 4.27에서 const BlueprintCallable 함수가 자동으로 Pure 노드가 되는 조건과 BlueprintPure=false로 실행 핀을 복원하는 방법을 설명합니다.
category: 언리얼 엔진
tags:
  - ue4
  - cpp
  - blueprint
sourceLink: "https://velog.io/@hon454/BlueprintCallable-함수에-실행Exec핀이-없는-경우"
---

> 이 글은 2021년 12월의 **Unreal Engine 4.27** 동작을 기준으로 원문을 교정해 옮겼다. 당시 UHT 소스에서 실제로 실행 핀을 결정하던 조건을 기준으로 설명한다.

`BlueprintCallable`을 붙인 C++ 함수를 Blueprint에 배치했지만 흰색 실행 핀이 나타나지 않았다.

```cpp
UFUNCTION(BlueprintCallable)
UMyItem* FindItem() const;
```

`BlueprintCallable`이면 반드시 실행 핀이 생기고, `BlueprintPure`일 때만 실행 핀이 사라진다고 생각하기 쉽다. 그러나 UE 4.27에서는 `const` 함수에도 자동으로 적용되는 규칙이 하나 더 있었다.

## UE 4.27 UHT가 Pure로 판단하던 조건

당시 UnrealHeaderTool은 아래 네 조건을 모두 만족하는 함수를 자동으로 `BlueprintPure`로 표시했다.

1. 함수가 `const`다.
2. `BlueprintCallable`이다.
3. 반환값이나 output parameter가 있다.
4. `BlueprintPure = false`로 자동 변환을 막지 않았다.

엔진이 함수 본문을 분석해 실제 side effect가 있는지 판정한 것은 아니다. C++ 선언의 `const`와 Blueprint로 내보낼 output의 존재만 보고 적용한 규칙이었다.

`const`는 해당 객체의 일반 멤버를 변경하지 않는다는 C++ 계약이지만, 함수가 항상 가볍거나 외부 상태를 전혀 건드리지 않는다는 뜻은 아니다. 로그를 남기거나, 전역·subsystem 상태를 읽고 쓰거나, 비용이 큰 검색을 수행할 수도 있다.

## 실행 핀을 명시적으로 복원한다

호출 순서를 눈에 보이게 만들고 싶다면 `BlueprintPure = false`를 지정한다.

```cpp
UFUNCTION(BlueprintCallable, BlueprintPure = false)
UMyItem* FindItem() const;
```

`const`를 제거해서 해결할 수도 있다. 다만 함수가 객체 상태를 변경하지 않는다면 C++ 계약까지 약하게 만들 이유는 없다. `const`는 유지하고 Blueprint 노드의 실행 의미만 명시하는 쪽이 의도를 더 잘 드러낸다.

## 언제 Pure가 적합한가

Pure 노드는 데이터가 필요한 지점에서 Blueprint compiler가 평가한다. 실행선이 없고 한 번만 호출된다는 보장도 없다. 따라서 아래 조건을 만족하는 함수에 잘 맞는다.

- 빠르고 예측 가능한 getter다.
- 여러 번 평가되어도 결과와 상태가 달라지지 않는다.
- 호출 순서를 다른 노드와 조정할 필요가 없다.
- 외부에 관찰 가능한 side effect가 없다.

반대로 호출 순서나 횟수를 통제해야 하는 함수에는 실행 핀이 있는 편이 안전하다.

- 큰 배열이나 월드의 Actor를 검색한다.
- 호출 횟수가 성능에 직접 영향을 준다.
- cache, log, 통계나 subsystem 상태를 변경한다.
- Blueprint 작성자가 호출 순서를 명확히 제어해야 한다.

## 원문의 표현에서 교정한 부분

원문은 “side effect를 보유했느냐에 따라 엔진이 실행 핀을 정한다”고 설명했다. API 설계 기준으로는 맞는 방향이지만, **UE 4.27 UHT가 함수 본문을 분석한 것은 아니다.** 자동 Pure 처리는 `const`, output, `BlueprintCallable`, `BlueprintPure=false` 여부만 확인했다.

또한 `void` 함수에 입력만 있는 최소 예제는 당시 UHT의 자동 Pure 조건을 완전히 보여 주지 못한다. 이 글에서는 실제 조건이 드러나도록 반환값이 있는 예제로 바꿨다. 핵심 해결책인 `BlueprintPure = false`는 그대로다.

## 참고 자료

- [Epic Games: UFunctions — UE 4.27](https://dev.epicgames.com/documentation/en-us/unreal-engine/ufunctions?application_version=4.27)
- [Epic Games: Blueprint Function Libraries — UE 4.27](https://dev.epicgames.com/documentation/unreal-engine/blueprint-function-libraries?application_version=4.27)
