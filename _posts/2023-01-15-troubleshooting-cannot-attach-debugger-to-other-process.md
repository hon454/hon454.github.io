---
title: 다른 프로세스에 디버거를 붙일 수 없는 문제 해결하기
date: 2023-01-15 22:40:00 +0900
categories: [Unreal, Troubleshooting]
tags: [unreal, debug]
typora-root-url: ./..
---

## 문제

언리얼 에디터에서 멀티 플레이 환경 실행 후 IDE(Visual Studio / Rider)를 통해 `Attach to Process`를 수행할 때 중단점이 정상적으로 활성화 될 때도 있고 안될 때도 있는 현상 발생.



## 환경

- Windows 11 22H2
- Unreal Engine 4.27.2
- JetBrains Rider 2022.3.1



## 재현 단계

1. Visual Studio / Rider를 통해 DebugGameEditor 환경으로 에디터 실행 빌드 및 실행
2. 멀티 플레이 환경을 구성 및 실행 (Listen Server, Client 등)
3. 멀티플레이 관련 코드에 중단점 추가
4. 새로 실행되는 프로세스에 `Attach to Process` 수행
5. 디버거가 새롭게 붙은 프로세스에서는 중단점이 비활성화 되는 것을 확인 가능



## 해결 방법

윈도우에서는 기본적으로 디버거가 실행 중인 프로세스에 연결 할 때 500 개의 모듈에 대한 심볼을 로드 하는 것으로 제한된다고 한다. 

하지만, 언리얼 기반 프로젝트는 버전과 플러그인의 구성에 따라 그 이상의 모듈을 로드 할 수 있기 때문에 해당 제한을 늘려 주어야 한다.

![add-registry-key](/assets/images/2023-01-15-troubleshooting-cannot-attach-debugger-to-other-process/add-registry-key.png)

레지스트리 편집기를 이용하여 `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager`  경로에 `DWORD` 타입의 `DebuggerMaxModuleMsgs` 값을 높게 설정하여 추가. (ex. 2048)



이후 재부팅을 하면 해결된다.



## 출처

[Increase the Number of Modules Loaded When Attaching the Debugger](https://forums.unrealengine.com/t/increase-the-number-of-modules-loaded-when-attaching-the-debugger/661624)
