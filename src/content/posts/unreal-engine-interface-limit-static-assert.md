---
title: "Unreal C++ Interface 64개 제한과 C2607 진단"
published: 2023-12-19
updated: 2026-08-24
description: "UnrealHeaderTool 생성 코드에서 interface 배열 개수 제한 static_assert와 C2607이 발생할 때 상속된 interface까지 포함해 원인을 찾는 방법을 정리합니다."
image: ""
tags:
  - unreal-engine
  - cpp
  - uinterface
  - unreal-header-tool
  - compiler-error
category: Unreal Engine
draft: false
lang: ko
---

많은 Unreal Interface를 구현한 클래스에서는 generated code를 컴파일할 때 아래와 비슷한 오류가 발생하기도 한다.

```text
error C2607: static assertion failed
UE_ARRAY_COUNT(Z_Construct_UClass_..._Statics::InterfaceParams) < 64
```

## 문제 현상

오류는 직접 작성한 `.cpp`가 아니라 `.gen.cpp`의 `FImplementedInterfaceParams` 배열과 `FClassParams` 초기화 부근에서 난다. 처음에는 UHT 생성 오류처럼 보이지만 실제 입력은 클래스가 구현한다고 선언한 reflected interface 집합이다.

## 적용 범위

이 제한은 오류를 만든 정확한 엔진 버전의 생성 코드와 `FClassParams` 표현에 종속된다. 원문 사례에서는 구현 interface 개수를 담는 필드가 6비트로 표현됐고 generated code가 64 미만을 요구했다. 최신 버전에서도 같은 숫자라고 가정해서는 안 된다. 설치한 엔진의 generated code와 `Class.h`를 확인해야 한다.

## 원인

하나의 `UCLASS`가 직접 또는 부모 클래스를 통해 구현하는 reflected Unreal Interface의 총수가 해당 버전의 표현 한계를 넘었다. C++ 다중 상속 목록만 세면 부족하다. 부모 클래스가 구현한 interface와 Blueprint 계층에서 추가된 interface도 최종 class metadata에 포함되기도 한다.

## 재현 및 진단

1. 오류가 난 `.gen.cpp`에서 `InterfaceParams` 배열 항목을 센다.
2. 직접 구현한 interface와 상속받은 interface를 분리해 목록화한다.
3. Blueprint 자식이 아니라 native class 생성 중 실패했는지 확인한다.
4. 설치한 엔진 source에서 static assertion과 개수 필드의 정의를 확인한다.
5. 최근 추가한 interface를 제거했을 때 경계 아래로 내려가는지 최소 재현한다.

## 해결 방법

가장 안전하게 해결하려면 한 클래스가 구현하는 interface 수를 줄인다.

- 기능별로 component를 두고 interface 구현을 component로 이동한다.
- 매우 작은 interface 여러 개가 항상 함께 쓰인다면 응집도 높은 하나의 계약으로 합친다.
- 단순 질의는 gameplay tag, capability registry 또는 명시적 component 조회로 대체한다.
- 상속 계층의 중복 interface 선언을 제거한다.

엔진의 bit field나 assertion을 넓히려면 engine fork 전체에서 reflection ABI와 serialization에 미치는 영향을 검토해야 한다. 프로젝트 코드만 컴파일되게 숫자를 바꾸는 임시 수정으로 취급해서는 안 된다.

## 검증 방법

- clean UHT/build에서 generated code가 다시 생성되는지 확인한다.
- C++와 Blueprint 양쪽에서 `ImplementsInterface`와 interface call이 정상인지 검사한다.
- cooked build에서 class load와 Blueprint compile을 확인한다.
- interface를 component로 옮겼다면 복제·저장·수명 주기 동작도 회귀 테스트한다.

## 주의점

이 문제는 “C++는 최대 64개만 상속할 수 있다”는 일반 언어 제한이 아니다. Unreal reflection metadata에 구현 interface 목록을 저장하는 특정 엔진 구현의 제한이다. 정확한 버전의 근거를 확보하기 전에는 제한값을 보편 규칙처럼 문서화하지 않는 편이 안전하다.

## 참고 자료

- [Epic Games: Interfaces in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/interfaces-in-unreal-engine)
