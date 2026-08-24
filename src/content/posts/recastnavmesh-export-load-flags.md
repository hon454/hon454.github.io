---
title: "RecastNavMesh export/load flags 크래시 진단"
published: 2024-05-18
description: "특정 저장 데이터를 불러올 때 RecastNavMesh의 export와 load flags가 일치하지 않아 발생한 크래시를 지도 내 내비게이션 데이터 관점에서 진단합니다."
image: ""
tags:
  - unreal-engine
  - navigation
  - recast-navmesh
  - crash
  - debugging
category: Unreal Engine
draft: true
lang: ko
---

특정 저장 데이터를 불러오는 도중 다음과 같은 오류와 함께 게임이 종료되는 경우가 있었다.

```text
RecastNavMesh /Game/Maps/<MapName>.<MapName>:PersistentLevel.RecastNavMesh-Default
was found in memory and is an export but does not have all load flags.
```

## 문제 현상

모든 지도나 새 게임에서 발생하지 않고, 특정 지도를 참조하는 저장 데이터를 복원할 때만 재현됐다. 오류 문자열은 메모리에 이미 존재하는 `RecastNavMesh` 객체가 패키지 export로도 발견됐지만, 현재 로드가 요구하는 flags를 갖추지 못했다고 말한다.

## 적용 범위

이 글은 Unreal Engine에서 Recast 기반 내비게이션을 사용하고, 오류 경로에 지도 패키지의 `RecastNavMesh-Default`가 직접 나타나는 경우를 대상으로 한다. 같은 load flags 오류라도 다른 객체가 지목되면 그 객체의 생성·저장 경로부터 별도로 조사해야 한다.

## 원인

이 사례에서는 문제가 된 지도에 `Nav Mesh Bounds Volume`이 없는 상태와 저장된 내비게이션 객체가 맞물려 있었다. Unreal은 유효한 내비게이션 영역을 기준으로 Recast 내비게이션 데이터를 생성한다. 지도의 bounds를 제거하거나 내비게이션 데이터를 다시 저장하는 과정에서 패키지 안의 export와 런타임 생성 상태가 어긋난 것으로 판단했다.

다만 오류 한 줄만으로 원인을 일반화할 수는 없다. stale cooked asset, 서로 다른 엔진 버전에서 만든 저장 데이터, 지도 redirect나 패키징 결과가 섞인 경우에도 비슷한 로드 불일치가 생길 수 있다.

## 재현 및 진단

1. 오류에 표시된 지도와 객체 경로를 기록한다.
2. 해당 지도를 editor에서 열고 `Nav Mesh Bounds Volume`과 `RecastNavMesh-Default`의 존재를 확인한다.
3. `P` 키로 내비게이션 영역을 표시해 실제 이동 영역이 생성되는지 확인한다.
4. 저장 데이터 없이 지도를 직접 열 때와 저장 데이터를 복원할 때를 나눠 재현한다.
5. 패키징 빌드라면 기존 cooked output을 섞지 않은 깨끗한 빌드에서도 확인한다.

## 해결 방법

문제가 된 지도에 이동 가능한 영역을 포함하도록 `Nav Mesh Bounds Volume`을 추가한 뒤 지도를 저장하고 내비게이션 데이터를 다시 생성했다. 이후 새 빌드와 새 프로세스에서 같은 저장 데이터를 불러왔을 때 크래시가 사라졌다.

이 수정은 해당 지도에 내비게이션이 실제로 필요한 경우에만 적절하다. 내비게이션을 사용하지 않는 지도라면 bounds를 억지로 추가하기 전에 왜 저장 데이터가 그 지도의 `RecastNavMesh`를 참조하는지 먼저 확인해야 한다.

## 검증 방법

- editor와 패키징 빌드에서 각각 새 게임과 기존 저장 데이터 로드를 반복한다.
- server travel이나 level streaming을 쓴다면 최초 진입과 재진입을 모두 확인한다.
- `RecastNavMesh-Default`가 지도 저장 후 의도치 않게 다시 사라지지 않는지 source control diff로 확인한다.
- 내비게이션 경로 탐색과 AI 이동도 함께 검사한다.

## 주의점

`Nav Mesh Bounds Volume`을 다시 제거하면 생성된 내비게이션 객체도 저장 과정에서 달라질 수 있다. 오류를 숨기기 위해 load flags 검사를 우회하거나 저장 데이터를 무조건 폐기하면 패키지 상태 불일치의 원인이 남는다.

## 참고 자료

- [Epic Games: ARecastNavMesh API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/NavigationSystem/ARecastNavMesh)
- [Epic Games: Basic Navigation](https://dev.epicgames.com/documentation/unreal-engine/basic-navigation-in-unreal-engine?lang=en-US)
