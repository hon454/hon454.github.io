---
title: "Root Motion 중 이동 리플리케이션이 멈춘 것처럼 보일 때"
published: 2023-08-23
description: "네트워크 Root Motion Montage가 재생되는 동안 simulated proxy의 일반 ReplicatedMovement 보정 경로가 달라지는 이유와 안전한 점검 순서를 설명합니다."
image: ""
tags:
  - unreal-engine
  - networking
  - root-motion
  - animation-montage
  - replication
category: Unreal Engine
draft: true
lang: ko
---

Root Motion Montage 재생 중 다른 client에서 character 위치가 갱신되지 않거나, montage가 끝난 뒤 갑자기 보정되는 현상이 있었다.

## 문제 현상

server와 owning client에서는 이동이 자연스럽지만 simulated proxy에서는 일반 actor transform replication이 멈춘 듯 보였다. `ACharacter::OnRep_ReplicatedMovement`를 따라가면 networked root motion montage가 활성화된 동안 일반 보정과 다른 경로를 사용하는 것을 확인할 수 있다.

## 적용 범위

`ACharacter`, `CharacterMovementComponent`, animation montage의 Root Motion을 network play에서 사용하는 프로젝트에 해당한다. custom movement나 Gameplay Ability System이 별도 prediction을 제공하면 그 계층도 함께 봐야 한다.

## 원인

Unreal의 networked Root Motion Montage는 단순히 server transform만 복제하지 않는다. montage 위치, root motion source와 server correction을 결합해 proxy를 갱신한다. montage trigger나 position이 올바르게 전달되지 않으면 proxy는 root motion 전용 경로에 들어갔지만 적용할 animation 상태가 부족해 보정이 멈춘 것처럼 보일 수 있다.

## 재현 및 진단

1. server, autonomous proxy, simulated proxy에서 `LocalRole`, montage 이름과 position을 기록한다.
2. `IsPlayingNetworkedRootMotionMontage`, `RepRootMotion`과 movement mode를 비교한다.
3. montage 시작 RPC가 server 권한을 거쳐 관련 client에 전달되는지 확인한다.
4. AnimInstance의 Root Motion Mode가 역할별로 예상한 값인지 확인한다.
5. packet loss와 latency에서 montage 시작·중단·blend out을 반복한다.

## 해결 방법

일반적인 구성에서는 montage 시작을 server가 권한 있게 결정하고 필요한 client에 동일한 montage 상태를 전달한다. animation blueprint는 network play에 권장되는 `Root Motion from Montages Only`를 사용하고, character movement의 기본 root motion replication 경로를 유지한다.

과거 사례에서는 simulated proxy의 Root Motion Mode를 `Ignore Root Motion`으로 바꾸자 server transform replication이 다시 보였다. 그러나 이는 모든 프로젝트에 적용할 수정이 아니다. server transform만을 단일 진실로 삼고 animation root delta를 절대 적용하지 않는 설계를 의도한 경우에만 역할별 설정으로 검토한다.

## 검증 방법

- listen server와 dedicated server에서 각각 두 client 이상으로 시험한다.
- montage 시작·중단·연속 재생과 late join을 확인한다.
- 높은 latency와 packet loss에서 위치 오차, montage position과 correction 횟수를 측정한다.
- root motion이 없는 montage와 같은 이동을 비교한다.

## 주의점

simulated proxy에서 root motion을 무조건 끄면 발 미끄러짐, montage 위치 불일치와 collision 결과 차이가 생길 수 있다. `OnRep_ReplicatedMovement`의 한 branch만 우회하기 전에 montage replication과 권한 구조를 먼저 고친다.

## 참고 자료

- [Epic Games: Root Motion](https://dev.epicgames.com/documentation/unreal-engine/root-motion-in-unreal-engine)
- [Epic Games: Animation Montage](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-montage-in-unreal-engine)
- [Epic Games: Understanding Networked Movement](https://dev.epicgames.com/documentation/en-us/unreal-engine/understanding-networked-movement-in-the-character-movement-component-for-unreal-engine)
- [Epic Games: Actor Role and Remote Role](https://dev.epicgames.com/documentation/en-us/unreal-engine/actor-role-and-remote-role-in-unreal-engine)
