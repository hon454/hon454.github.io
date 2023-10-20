---
title: Asset has been saved with empty engine version 경고 메시지
date: 2023-02-11 14:37:00 +0900
categories: [Unreal, Troubleshooting]
tags: [unreal]
typora-root-url: ./..
---

사내 프로젝트를 언리얼 엔진 4.27-Plus에서 5.3.1로 마이그레이션을 진행하니 다수의 에셋에 대하여 다음과 같은 경고 메시지가 발생하기 시작했다.

`<ASSET_PATH>: Asset has been saved with empty engine version. The asset will be loaded but may be incompatible.`



### 해결 방법

이 문제를 해결 할 수 있는 두 가지 방법이 존재한다.

1. 아래 명령어 수행
   `C:\<PATH_TO_LAUNCHER_INSTALLS>\UE_<VERSION>\Engine\Binaries\Win64\UnrealEditor-Cmd.exe <PROJECT_PATH>\<PROJECT_NAME>.uproject -run=ResavePackages -OnlyUnversioned` 

2. `DefaultEngine.ini`에 아래 코드 추가

   ```ini
   [Core.System]
   ZeroEngineVersionWarning=False
   ```



### 참고 자료

[Assets “saved with empty engine version” warning](https://forums.unrealengine.com/t/assets-saved-with-empty-engine-version-warning/304482)
