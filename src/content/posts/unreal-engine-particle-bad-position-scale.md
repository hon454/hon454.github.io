---
title: "FParticleSystemSceneProxy의 잘못된 위치·스케일 로그 진단"
published: 2023-11-15
description: "ParticleSystemSceneProxy에서 projection W가 0이거나 NDC 값이 무한대로 기록될 때 transform과 MacroUV 설정을 점검하는 방법을 정리합니다."
image: ""
tags:
  - unreal-engine
  - particles
  - rendering
  - projection
  - debugging
category: Unreal Engine
draft: true
lang: ko
---

파티클을 렌더링할 때 다음과 같이 projection 결과가 유효하지 않다는 로그가 반복됐다.

```text
ObjectPostProjectionPositionWithW ... W: 0
ObjectNDCPosition ... inf
FParticleSystemSceneProxy::GetObjectPositionAndScale
```

## 문제 현상

scene proxy가 particle system 위치를 view projection에 통과시킨 뒤 perspective divide에 사용할 `W`가 0이 됐다. 이어지는 normalized device coordinate가 `inf`가 되어 MacroUV 위치와 scale 계산이 유효하지 않았다.

## 적용 범위

Cascade particle system과 MacroUV 또는 object position/scale 계산 경로에서 동일한 로그가 나타나는 UE 프로젝트에 해당한다. 원문에는 exact engine version과 최소 재현 asset이 없어 원인을 확정하지 않은 초안이다.

## 가능한 원인

- component transform에 NaN, Inf 또는 비정상적인 scale이 들어간다.
- parent attachment가 파괴되거나 갱신되는 frame에 잘못된 world transform을 사용한다.
- view/projection의 경계 조건에서 object position의 clip-space `W`가 0에 가까워진다.
- MacroUV position 또는 radius가 effect 크기와 맞지 않는다.
- engine version별 particle proxy 계산 버그가 있다.

원문 프로젝트에서는 component의 world Z가 정확히 0일 때 재현됐고 작은 non-zero offset을 주자 로그가 사라졌다. 하지만 이는 상관관계이자 진단용 workaround일 뿐, 모든 파티클에서 Z=0이 잘못이라는 뜻은 아니다.

## 재현 및 진단

1. 로그 직전 component location, rotation, scale과 parent transform을 기록한다.
2. 각 float에 `FMath::IsFinite` 검사를 넣어 최초 invalid 값이 생기는 지점을 찾는다.
3. world origin, Z=0, camera near plane과 큰 좌표에서 각각 비교한다.
4. MacroUV를 끄거나 position/radius를 바꿔 해당 경로와의 관련성을 확인한다.
5. 같은 asset을 새 level의 독립 component로 재현한다.

## 해결 방법

invalid transform이 발견되면 값을 만드는 gameplay/attachment 코드를 고친다. MacroUV 설정이 실제 effect와 맞지 않으면 position과 radius를 유효한 범위로 조정한다. 작은 Z offset으로만 회피할 수 있다면 workaround에 근거와 적용 범위를 주석으로 남기고, exact engine revision에서 `GetObjectPositionAndScale` 구현과 관련 issue를 계속 확인한다.

## 검증 방법

- 원점과 원점 밖, 여러 camera angle과 FOV에서 로그를 확인한다.
- component attach/detach, pooling과 level transition을 반복한다.
- Development와 Shipping에 가까운 render 설정에서 시각 결과를 비교한다.
- 로그가 없어졌을 뿐 아니라 particle의 크기·MacroUV가 올바른지 확인한다.

## 주의점

좌표에 임의의 epsilon을 더하는 방식은 잘못된 transform이나 projection 문제를 숨길 수 있다. `W == 0` 검사를 제거하거나 무조건 1로 바꾸면 화면 위치와 크기가 왜곡되므로 엔진 수정을 하기 전에 입력값을 추적한다.

## 참고 자료

- [Epic Games: Particle System Class](https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-system-class?application_version=4.27)
