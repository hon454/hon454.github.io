---
title: "TeamCity 환경 변수와 buildAgent.properties 우선순위"
published: 2023-03-31
description: "TeamCity 프로젝트에 같은 이름의 환경 변수가 있을 때 agent의 buildAgent.properties 값이 무시되는 이유와 안전한 설정 분리 방법을 설명합니다."
image: ""
tags:
  - teamcity
  - ci
  - environment-variables
  - build-agent
  - configuration
category: TeamCity
draft: true
lang: ko
---

TeamCity agent마다 다른 값을 쓰려고 `buildAgent.properties`를 수정했지만 빌드에서는 모든 agent가 같은 값을 받는 문제가 있었다.

## 문제 현상

agent 설정에는 다음처럼 machine별 값이 있었다.

```properties
env.TOOLCHAIN_ROOT=/opt/toolchains/agent-specific
```

하지만 build step에서 출력한 `%env.TOOLCHAIN_ROOT%`는 TeamCity Web UI의 프로젝트 수준에 등록된 값으로 고정됐다.

## 적용 범위

TeamCity의 agent configuration parameter, project/build configuration parameter와 `env.` parameter를 함께 사용하는 구성에 해당한다.

## 원인

같은 이름의 parameter가 여러 수준에 정의됐고, 빌드 구성에 더 가까운 project/build parameter가 agent의 값보다 우선 적용됐다. `buildAgent.properties`가 읽히지 않은 것이 아니라 higher-priority definition에 가려진 것이다.

## 재현 및 진단

1. 실패한 build의 Parameters 탭에서 최종 resolved value와 source를 확인한다.
2. build configuration, template, project와 parent project에서 같은 이름을 검색한다.
3. agent의 `buildAgent.properties`에서 `env.`와 `system.` 접두사가 올바른지 확인한다.
4. agent 재시작 또는 configuration reload 뒤 agent Parameters 화면에서 값이 보이는지 확인한다.

## 해결 방법

agent마다 달라야 하는 값이라면 project에 정의된 같은 이름의 parameter를 제거하고 agent 값을 사용한다. 프로젝트가 논리적 이름을 유지해야 한다면 agent별 고유 configuration parameter를 두고 build parameter가 이를 참조하도록 매핑한다.

```properties
# buildAgent.properties
agent.toolchain.root=/opt/toolchains/agent-specific
```

```text
# TeamCity build parameter
env.TOOLCHAIN_ROOT = %agent.toolchain.root%
```

필요한 capability를 가진 agent에서만 실행되도록 agent requirement도 함께 설정하면 값이 없는 agent로 build가 배정되는 일을 막을 수 있다.

## 검증 방법

- 서로 다른 두 agent에서 parameter source와 최종 환경 변수를 비교한다.
- build log에는 secret이 아닌 값만 출력한다.
- template을 상속하는 build configuration까지 동일하게 해석되는지 확인한다.
- agent requirement가 값이 없는 agent를 실제로 제외하는지 시험한다.

## 주의점

TeamCity의 password parameter나 token을 일반 환경 변수로 출력해 검증하지 않는다. 운영체제 환경 변수, Java system property와 TeamCity configuration parameter는 이름이 비슷해도 주입 경로가 다르므로 접두사와 최종 build parameter 화면을 기준으로 판단한다.

## 참고 자료

- [JetBrains: Configure Agent Installation](https://www.jetbrains.com/help/teamcity/configure-agent-installation.html)
- [JetBrains: Configuring Build Parameters](https://www.jetbrains.com/help/teamcity/configuring-build-parameters.html)
