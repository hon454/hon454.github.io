---
title: "TeamCity 환경 변수와 buildAgent.properties 우선순위"
published: 2023-03-31
updated: 2026-08-24
description: "TeamCity 프로젝트에 같은 이름의 환경 변수가 있을 때 agent의 buildAgent.properties 값이 무시되는 이유와 안전한 설정 분리 방법을 설명합니다."
image: ""
tags:
  - teamcity
  - ci-cd
  - environment-variables
category: 개발 인프라
draft: false
lang: ko
---

TeamCity agent마다 다른 값을 넣으려고 `buildAgent.properties`를 수정했다. 그런데 빌드에서는 모든 agent가 같은 값을 받았다.

## 문제 현상

agent 설정에는 machine별 값이 있었다.

```properties
env.TOOLCHAIN_ROOT=/opt/toolchains/agent-specific
```

build step에서 `%env.TOOLCHAIN_ROOT%` 값을 출력했다. 결과는 TeamCity Web UI의 프로젝트 수준에 등록된 값으로 고정돼 있었다.

## 적용 범위

agent configuration parameter와 project/build configuration parameter를 함께 쓰는 TeamCity 구성에 해당한다. `env.` parameter를 섞어 쓸 때도 같은 우선순위를 확인해야 한다.

## 원인

같은 이름의 parameter가 여러 수준에 정의돼 있었다. TeamCity는 빌드 구성에 더 가까운 project/build parameter를 agent의 값보다 우선 적용했다. `buildAgent.properties`를 읽었지만 higher-priority definition이 그 값을 가렸다.

## 재현 및 진단

1. 실패한 build의 Parameters 탭에서 최종 resolved value와 source를 확인한다.
2. build configuration, template, project와 parent project에서 같은 이름을 찾아본다.
3. agent의 `buildAgent.properties`에서 `env.`와 `system.` 접두사가 올바른지 살핀다.
4. agent 재시작 또는 configuration reload 뒤 agent Parameters 화면에 값이 보이는지 점검한다.

## 해결 방법

agent마다 달라야 하는 값은 project에 정의된 같은 이름의 parameter를 지운 뒤 agent 값을 쓴다. 프로젝트에서 논리적 이름을 유지하려면 agent마다 고유한 configuration parameter를 두고 build parameter가 이를 참조하도록 매핑한다.

```properties
# buildAgent.properties
agent.toolchain.root=/opt/toolchains/agent-specific
```

```text
# TeamCity build parameter
env.TOOLCHAIN_ROOT = %agent.toolchain.root%
```

agent requirement도 함께 설정한다. 필요한 capability나 값이 없는 agent에는 build가 배정되지 않도록 한다.

## 검증 방법

- 서로 다른 두 agent에서 parameter source와 최종 환경 변수를 나란히 비교한다.
- build log에는 secret이 아닌 값만 골라 출력한다.
- template을 상속하는 build configuration도 동일하게 해석되는지 살핀다.
- agent requirement가 값이 없는 agent를 실제로 제외하는지 별도로 시험한다.

## 주의점

TeamCity의 password parameter나 token은 일반 환경 변수로 출력해서 검증하지 않는다. 운영체제 환경 변수, Java system property와 TeamCity configuration parameter는 이름이 비슷해도 주입 경로가 다르다. 접두사와 최종 build parameter 화면을 기준으로 구분한다.

## 참고 자료

- [JetBrains: Configure Agent Installation](https://www.jetbrains.com/help/teamcity/configure-agent-installation.html)
- [JetBrains: Configuring Build Parameters](https://www.jetbrains.com/help/teamcity/configuring-build-parameters.html)
