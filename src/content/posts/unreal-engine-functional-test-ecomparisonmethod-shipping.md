---
title: "Shipping 빌드에서 EComparisonMethod를 사용하지 않는 이유"
published: 2023-09-22
description: "FunctionalTesting 모듈의 EComparisonMethod를 런타임 코드에서 사용해 Shipping 빌드가 깨질 때 프로젝트 전용 enum으로 의존성을 분리하는 방법을 설명합니다."
image: ""
tags:
  - unreal-engine
  - shipping-build
  - functional-testing
  - build-configuration
  - cpp
category: Unreal Engine
draft: true
lang: ko
---

개발 빌드에서는 정상인 코드가 Shipping target에서 `EComparisonMethod`를 찾지 못하거나 `FunctionalTesting` 모듈 의존성 때문에 컴파일·링크에 실패하는 문제가 있었다.

## 문제 현상

게임 런타임 로직이 `FunctionalTest.h`에 선언된 비교 enum을 편의상 재사용했다. Editor나 Development 구성에는 FunctionalTesting 모듈이 들어와 문제가 없었지만, Shipping 구성에서는 developer용 테스트 코드가 제외되면서 의존성이 드러났다.

## 적용 범위

`FunctionalTesting` 모듈의 타입을 게임의 Runtime 모듈 또는 Shipping에 포함되는 public header에서 참조하는 프로젝트에 해당한다. 정확한 모듈 포함 여부는 사용 중인 엔진 버전과 target rules를 기준으로 확인해야 한다.

## 원인

`EComparisonMethod`는 일반 수학 유틸리티가 아니라 `FunctionalTesting` developer 모듈의 API다. 런타임 게임 규칙이 테스트 framework 타입에 의존하면 Shipping target이 불필요한 developer 모듈을 끌어오거나, 해당 모듈이 없는 구성에서 빌드가 실패한다.

## 재현 및 진단

1. Shipping target의 첫 컴파일 오류에서 포함 경로와 참조 타입을 확인한다.
2. `.Build.cs`에서 `FunctionalTesting`을 Runtime 모듈이 public dependency로 요구하는지 찾는다.
3. public header가 `FunctionalTest.h`를 include하는지 검색한다.
4. Editor target에서 우연히 transitive dependency로 해결된 것은 아닌지 clean build로 확인한다.

## 해결 방법

게임 실행 중 필요한 의미만 프로젝트 소유의 runtime enum으로 정의한다.

```cpp
UENUM(BlueprintType)
enum class EGameComparisonMethod : uint8
{
    Equal,
    NotEqual,
    Less,
    LessOrEqual,
    Greater,
    GreaterOrEqual,
};
```

테스트 코드에서 두 enum을 연결해야 한다면 FunctionalTesting에 의존해도 되는 별도 test/editor 모듈에 변환 함수를 둔다. 테스트 기능 자체가 Shipping에 필요 없다면 target/configuration gate로 관련 코드 전체를 제외하는 편이 낫다.

## 검증 방법

- Development Editor, Development Client/Server, Shipping target을 각각 clean build한다.
- Runtime 모듈의 dependency graph에서 `FunctionalTesting`이 제거됐는지 확인한다.
- 비교 연산별 경계값과 부동소수점 tolerance 동작을 테스트한다.
- Blueprint에 노출된 기존 자산이 있다면 enum 교체 후 redirect 또는 재저장 필요성을 확인한다.

## 주의점

이름과 항목을 복사했다고 두 enum이 같은 ABI나 직렬화 값을 영구히 보장하는 것은 아니다. 저장 데이터나 network protocol에 enum 값을 기록한다면 명시적인 숫자와 versioning을 설계한다. 부동소수점 `Equal` 비교는 enum 분리와 별개로 tolerance가 필요할 수 있다.

## 참고 자료

- [Epic Games: FunctionalTesting module](https://dev.epicgames.com/documentation/unreal-engine/API/Developer/FunctionalTesting?lang=en-US)
- [Epic Games: EComparisonMethod](https://dev.epicgames.com/documentation/unreal-engine/API/Developer/FunctionalTesting/EComparisonMethod)
