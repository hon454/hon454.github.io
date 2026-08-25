---
published: 2023-01-15
author: Jihoon Jeon
title: Unreal Engine 멀티프로세스 디버깅에서 중단점이 비활성화될 때
description: 실행 중인 Unreal Editor나 멀티플레이 클라이언트에 디버거를 연결했지만 중단점이 활성화되지 않을 때, 심볼 상태를 진단하고 Windows의 attach 시 모듈 제한을 안전하게 조정하는 방법을 정리합니다.
category: 언리얼 엔진
tags:
  - debugging
  - rider
  - visual-studio
---

Unreal Engine 프로젝트에서 PIE 멀티플레이나 별도 클라이언트를 실행한 뒤 IDE의 **Attach to Process**로 새 프로세스에 연결하면, 디버거 연결은 성공했는데 프로젝트 코드의 중단점은 비활성 상태로 남을 때가 있다. 특히 프로세스가 시작된 직후에는 정상이고 시간이 지난 뒤 연결할 때만 실패한다면 Windows의 attach 시 모듈 제한을 의심한다.

이 문제는 아래 환경에서 확인했다.

| 항목      | 확인한 환경                                                              |
| --------- | ------------------------------------------------------------------------ |
| 운영체제  | Windows 11 22H2                                                          |
| 엔진      | Unreal Engine 4.27.2                                                     |
| IDE       | JetBrains Rider 2022.3.1, Visual Studio                                  |
| 빌드 구성 | DebugGame Editor                                                         |
| 상황      | Listen Server와 Client 등 여러 프로세스를 실행한 뒤 추가 프로세스에 연결 |

Windows의 attach 모듈 제한과 `DebuggerMaxModuleMsgs` 설정은 [Epic Games 포럼의 안내](https://forums.unrealengine.com/t/increase-the-number-of-modules-loaded-when-attaching-the-debugger/661624)에도 정리돼 있다. 다만 비활성 중단점의 원인이 항상 이 제한인 것은 아니다. 레지스트리를 바꾸기 전에 아래 순서로 심볼 문제인지부터 확인해야 한다.

## 증상 재현

1. Rider 또는 Visual Studio에서 `DebugGame Editor` 구성으로 프로젝트를 빌드하고 Unreal Editor를 실행한다.
2. Listen Server와 별도 Client처럼 추가 프로세스가 생기는 멀티플레이 환경을 실행한다.
3. 프로젝트 모듈의 실제 실행 경로에 중단점을 둔다.
4. 새 프로세스의 PID와 명령줄을 확인하고 네이티브 디버거로 연결한다.
5. IDE는 연결됐지만 중단점에 “심볼이 로드되지 않았다”는 안내가 나타나는지 확인한다.

여러 프로세스의 이름이 같다면 PID만 보지 말고 실행 명령줄이나 창 제목도 확인한다. [Visual Studio의 Attach to Process 문서](https://learn.microsoft.com/en-us/visualstudio/debugger/attach-to-running-processes-with-the-visual-studio-debugger?view=visualstudio)는 코드 유형이 맞는지 확인하고, 동일한 이름의 프로세스는 Command Line 열로 구분하도록 안내한다. Rider에서도 Attach to Process 창의 트리 보기와 디버거 선택기를 이용할 수 있다.

## 레지스트리를 바꾸기 전에 심볼부터 확인하기

중단점은 소스 파일만 있다고 활성화되지 않는다. 실행 중인 DLL과 정확히 일치하는 PDB가 로드되어야 한다. 다음 항목을 먼저 확인한다.

### Visual Studio

디버깅을 일시 중지한 뒤 **Debug > Windows > Modules**를 연다. 프로젝트나 플러그인 DLL을 찾아 `Symbol Status`를 확인한다. [Microsoft의 Modules 창 문서](https://learn.microsoft.com/en-us/visualstudio/debugger/how-to-use-the-modules-window?view=visualstudio)는 다음 기능을 제공한다.

- `Symbol Load Information`: PDB 검색 경로와 실패 이유 확인
- `Load Symbols`: 특정 모듈의 PDB를 직접 선택
- `Symbol Settings`: 심볼 서버와 자동 로드 포함·제외 규칙 확인

### Rider

Debug 창의 Modules 보기에서 대상 DLL과 Symbols 열을 확인한다. [Rider의 loaded modules 문서](https://www.jetbrains.com/help/rider/Modules_view.html)에 따르면 `Load Symbols`로 DLL 옆이나 설정된 심볼 서버의 PDB를 찾고, 필요하면 파일 위치를 직접 지정할 수 있다.

다음 조건이 모두 맞을수록 500개 모듈 제한일 가능성이 높다.

- IDE에서 프로세스를 처음부터 디버그 실행하면 같은 중단점이 동작한다.
- 프로세스가 시작된 직후 연결하면 동작하지만, 플러그인과 DLL이 더 로드된 뒤에는 실패한다.
- 실행 중인 프로젝트 또는 플러그인 DLL이 Modules 목록에서 누락되거나 해당 PDB를 로드할 기회 자체가 없다.
- PDB와 DLL은 같은 빌드 결과이고, 올바른 프로세스와 네이티브 코드 유형을 선택했다.

반대로 DLL은 보이지만 PDB 경로가 틀리거나 PDB가 DLL과 일치하지 않는다면 레지스트리보다 빌드 산출물과 심볼 설정을 고쳐야 한다.

## 늦게 연결할 때만 실패하는 이유

JetBrains와 Epic의 지식 문서는 Windows에서 실행 중인 프로세스에 디버거를 붙일 때 기본적으로 처리할 수 있는 모듈 수가 500개로 제한된다고 설명한다. Unreal Engine은 엔진, 프로젝트, 플러그인 모듈을 다수 로드하므로 이 경계를 넘을 수 있다. 제한 뒤에 로드된 프로젝트 DLL의 정보가 attach 과정에서 디버거에 전달되지 않으면 IDE는 대응하는 PDB를 찾지 못하고 중단점을 활성화하지 못한다.

프로세스를 IDE에서 처음부터 디버그 실행하거나 아주 일찍 연결할 때 정상인 것도 이 차이로 설명된다. 디버거가 처음부터 붙어 있으면 이후 모듈 로드를 계속 관찰하지만, 이미 많은 모듈이 로드된 프로세스에 뒤늦게 연결할 때는 attach 시 열거 제한의 영향을 받을 수 있다.

## `DebuggerMaxModuleMsgs` 설정하기

이 설정은 `HKEY_LOCAL_MACHINE` 아래의 시스템 전체 값이며 관리자 권한과 재부팅이 필요하다. 잘못된 레지스트리 변경은 Windows 동작에 영향을 줄 수 있으므로 먼저 [Microsoft의 레지스트리 백업 절차](https://support.microsoft.com/en-us/windows/experience/backup-recovery/how-to-back-up-and-restore-the-registry-in-windows)에 따라 `Session Manager` 키를 내보낸다.

1. 모든 작업을 저장하고 관리자 권한으로 **Registry Editor**를 실행한다.
2. 다음 키로 이동한다.

   ```text
   HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager
   ```

3. 오른쪽 영역에서 **New > DWORD (32-bit) Value**를 선택한다. 64비트 Windows에서도 값 형식은 `DWORD (32-bit)`이다.
4. 이름을 정확히 `DebuggerMaxModuleMsgs`로 지정한다.
5. 값을 편집할 때 **Decimal**을 선택하고 `2048`을 입력한다.
6. Registry Editor를 닫고 Windows를 재부팅한다.

이 환경에서는 2048로 해결됐지만 모든 프로젝트에 같은 값이 충분하다는 뜻은 아니다. 처음부터 무작정 큰 수를 정하기보다 프로젝트가 실제로 로드하는 모듈 수를 감당할 값으로 시작한다.

## 변경 결과 확인하기

재부팅 뒤 같은 조건으로 다시 테스트한다.

1. Unreal Editor와 추가 클라이언트를 이전과 같은 구성으로 실행한다.
2. 문제가 발생하던 시점까지 기다린 뒤 올바른 프로세스에 연결한다.
3. Modules 보기에서 프로젝트 DLL과 그 DLL에 일치하는 PDB가 로드됐는지 확인한다.
4. 중단점이 활성화되고 실제 코드 경로에서 멈추는지 확인한다.

값을 높여도 대상 DLL이 목록에 없거나 PDB가 로드되지 않는다면 변경을 더 키우기 전에 다른 원인을 조사한다. 되돌릴 때는 백업한 키를 복원하거나 새로 만든 `DebuggerMaxModuleMsgs` 값만 제거한 뒤 다시 재부팅한다.

## 이 방법으로 해결되지 않는 경우

| 증상                                        | 먼저 확인할 항목                                                 |
| ------------------------------------------- | ---------------------------------------------------------------- |
| 프로젝트 DLL은 보이지만 PDB가 로드되지 않음 | DLL과 PDB가 같은 빌드인지, PDB 검색 경로가 맞는지 확인           |
| 일부 줄만 중단점으로 잡히지 않음            | 최적화로 코드가 제거·병합됐는지, 실제 실행 가능한 줄인지 확인    |
| 연결했지만 프로젝트 코드 전체가 보이지 않음 | 올바른 Client/Server PID와 Native 코드 디버거를 선택했는지 확인  |
| 모듈이 아직 목록에 없음                     | 해당 플러그인이나 게임 기능이 실제로 모듈을 로드했는지 확인      |
| IDE에서 직접 실행할 때도 동일하게 실패      | 모듈 제한보다 빌드 구성, 오래된 바이너리, PDB 불일치를 먼저 조사 |
| 엔진 코드만 디버깅되지 않음                 | Launcher 설치 옵션의 엔진 디버깅 심볼 유무를 별도로 확인         |

비활성 중단점을 곧바로 레지스트리 문제로 단정하지 않는 것이 핵심이다. 실행 중인 DLL, PDB, 소스, 프로세스와 코드 유형이 일치하는지 확인한 뒤, **늦게 attach할 때 특정 후반 모듈이 누락되는 패턴**이 확인될 때만 `DebuggerMaxModuleMsgs`를 적용한다. 이 순서를 지키면 시스템 전체 설정을 불필요하게 바꾸지 않으면서 Unreal 프로젝트의 많은 모듈 때문에 생기는 실제 attach 문제를 구분할 수 있다.

## 참고 자료

- [Epic Developer Community: Increase the Number of Modules Loaded When Attaching the Debugger](https://forums.unrealengine.com/t/increase-the-number-of-modules-loaded-when-attaching-the-debugger/661624)
- [Microsoft: View DLLs and executables in the Modules window](https://learn.microsoft.com/en-us/visualstudio/debugger/how-to-use-the-modules-window?view=visualstudio)
- [Microsoft: Attach to running processes with the Visual Studio debugger](https://learn.microsoft.com/en-us/visualstudio/debugger/attach-to-running-processes-with-the-visual-studio-debugger?view=visualstudio)
- [JetBrains: View loaded modules](https://www.jetbrains.com/help/rider/Modules_view.html)
- [Microsoft: How to back up and restore the registry in Windows](https://support.microsoft.com/en-us/windows/experience/backup-recovery/how-to-back-up-and-restore-the-registry-in-windows)
