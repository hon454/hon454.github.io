---
published: 2023-02-11
author: Jihoon Jeon
title: Rider 2022.3 New UI에서 Solution Configuration 선택기가 보이지 않을 때
description: Rider 2022.3 New UI에서 사라진 Solution Configuration 선택기를 ActiveConfiguration action으로 복원하는 방법과 Unreal 빌드 구성의 의미를 정리합니다.
image: ./images/restore-solution-configuration-in-rider-new-ui/rider-2022-3-restored-solution-configuration-selector.avif
category: 개발 도구
tags:
  - jetbrains
  - rider
  - unreal-engine
  - build-configuration
---

Rider 2022.3의 **New UI Preview**를 켜면 VS Code처럼 가벼운 텍스트 에디터에 가까운 인상을 준다. 처음에는 다소 가벼워 보였지만, 사용하다 보니 UI가 아이콘 위주로 큼직하게 배치돼 필요한 기능이 더 눈에 띄는 장점도 있었다.

문제는 New UI에서 `Development Editor | Win64`, `DebugGame Editor | Win64` 같은 **Solution Configuration 선택기**가 보이지 않는 것이었다. `Edit Configurations` 창에서 설정을 바꿔도 원하는 solution configuration은 바뀌지 않았다. 개발할 target과 state를 선택할 수 없으므로 New UI를 계속 쓰려면 선택기를 복구해야 했다.

이 현상은 [RIDER-83004](https://youtrack.jetbrains.com/issue/RIDER-83004/No-Edit-Solution-Configuration-and-Build-button-in-new-UI)로 등록된 Rider 2022.3 New UI의 문제였다.

## Run/Debug Configuration과 Solution Configuration은 다르다

New UI의 Run widget에서 여는 **Edit Configurations**와 solution build configuration 선택기는 책임이 다르다.

| 구분                         | 결정하는 것                                                                   | Unreal 예시                                                    |
| ---------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Solution build configuration | 어떤 state, target, platform 조합으로 compile할지                             | `Development Editor \| Win64`, `DebugGame Editor \| Win64`     |
| Run/Debug configuration      | 어떤 executable을 어떤 인수·환경으로 실행하고, 실행 전에 어떤 task를 수행할지 | Unreal Editor 실행, standalone game, native executable, attach |

Run/Debug Configuration의 **Before launch**에 build task를 넣을 수는 있다. 그렇다고 Run widget의 설정을 바꾸면 active solution build configuration도 자동으로 같은 값이 되는 것은 아니다.

## Rider 2022.3 New UI에서 선택기 복원하기

1. 오른쪽 위 main toolbar를 우클릭하고 **Customize Toolbar…**를 연다.
2. `ExecutionTargetsToolbarGroup`을 찾는다.
3. **Add Action**에서 Main Menu → Build의 `ActiveConfiguration` action을 추가한다.
4. 변경을 적용하고 toolbar를 확인한다.

![Rider 2022.3 New UI의 Customize Main Toolbar에서 ActiveConfiguration action을 추가하는 화면](./images/restore-solution-configuration-in-rider-new-ui/rider-2022-3-add-active-configuration-action.avif)

_`ExecutionTargetsToolbarGroup` 아래에 `ActiveConfiguration` action을 추가한다._

일부 2022.3 build에서는 build icon dropdown의 **Show Configuration on Toolbar**도 함께 켜야 했다. 적용하면 toolbar에 configuration, target, platform selector가 다시 나타난다.

![Rider 2022.3 New UI에 수동으로 복원된 Solution Configuration 선택기](./images/restore-solution-configuration-in-rider-new-ui/rider-2022-3-restored-solution-configuration-selector.avif)

_`DebugGame Editor | Win64` 같은 Unreal 조합을 다시 선택할 수 있다._

이 방법은 IDE의 누락 문제 자체를 고치는 것이 아니라 toolbar customization으로 선택기를 다시 표시하는 우회법이다.

## Unreal configuration, target, platform 읽기

Rider selector는 UnrealBuildTool이 이해하는 state, target, platform 조합을 보여 준다. 이름을 단순한 Debug/Release dropdown으로 생각하면 잘못된 binary를 만들기 쉽다.

| 예시                          | 의미                                                                                    | 일반적인 용도                                   |
| ----------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `Development Editor \| Win64` | 대부분 최적화된 Development state + Editor target + Windows 64-bit                      | Unreal Editor에서 일상적인 개발과 PIE           |
| `DebugGame Editor \| Win64`   | engine은 일반적으로 최적화 상태, game module은 debugging하기 쉬운 state + Editor target | Editor에서 project game code를 집중적으로 debug |
| `Development Game \| Win64`   | Development state + standalone Game target                                              | cooked content를 전제로 한 standalone game test |
| `Shipping Game \| Win64`      | 최대 최적화와 shipping 제한 + Game target                                               | 최종 배포 후보                                  |

`Shipping Editor`를 일반 조합처럼 찾지 않는다. Editor와 Game은 서로 다른 target이며, 사용할 수 있는 target은 project의 `.Target.cs`와 Rider project model이 결정한다. `Win64`는 산출물의 target platform이다.

## 선택기는 보이는데 target이 없을 때

이 경우는 toolbar 문제가 아니다.

1. project의 `Source/<ProjectName>.Target.cs`와 `<ProjectName>Editor.Target.cs`가 존재하고 compile되는지 확인한다.
2. Rider가 `.uproject`를 직접 연 것인지 generated `.sln`을 연 것인지 확인한다.
3. Unreal Editor와 Rider를 닫고 project files 또는 Rider project model을 다시 생성한다.
4. command line 또는 Unreal Editor에서 같은 target이 실제로 build되는지 확인한다.

UI widget을 여러 번 추가해도 project model에 없는 target은 생기지 않는다. 먼저 선택기 자체가 사라진 문제와 필요한 target만 목록에 없는 문제를 구분한다.

## Rider 2022.3에서 발생한 이유

| 시기              | 변화                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------- |
| Rider 2022.2 EAP  | solution configuration을 build icon dropdown으로 옮기고 `Show Configuration on Toolbar` 제공 |
| Rider 2022.3 EAP2 | Rider의 New UI Preview 공개                                                                  |
| Rider 2022.3      | New UI에서 Build button과 Edit Solution Configuration이 누락되는 RIDER-83004 발생            |

New UI Preview가 공개된 경계는 Rider 2022.3 EAP 계열이다. 이 글에서는 Rider 2022.3 New UI와 `ActiveConfiguration` action을 기준으로 문제를 다룬다.

## 체크리스트

- Run/Debug Configuration과 solution build configuration 중 무엇이 사라졌는가?
- main toolbar의 `ExecutionTargetsToolbarGroup`에 `ActiveConfiguration`을 추가했는가?
- 필요한 경우 **Show Configuration on Toolbar**를 켰는가?
- selector가 나타난 뒤 state, target, platform 조합이 올바른가?
- selector는 있지만 target이 없다면 `.Target.cs`와 project model을 확인했는가?

Rider 2022.3 New UI에서 Solution Configuration 선택기가 사라진 것은 사용자 설정의 의미를 잘못 이해해서가 아니라 확인된 IDE 문제였다. toolbar에 `ActiveConfiguration` action을 추가하면 기존 UI처럼 solution configuration을 다시 바꿀 수 있다.

## 참고 자료

- [JetBrains YouTrack: RIDER-83004](https://youtrack.jetbrains.com/issue/RIDER-83004/No-Edit-Solution-Configuration-and-Build-button-in-new-UI)
- [JetBrains Rider 2022.2 EAP changes](https://blog.jetbrains.com/dotnet/2022/05/19/rider-2022-2-eap/)
- [JetBrains Rider 2022.3 EAP 2 New UI](https://blog.jetbrains.com/dotnet/2022/10/07/rider-2022-3-eap-2/)
