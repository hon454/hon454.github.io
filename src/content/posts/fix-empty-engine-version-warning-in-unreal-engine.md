---
published: 2023-10-20
author: Jihoon Jeon
title: 'Unreal Engine “Asset has been saved with empty engine version” 경고 안전하게 해결하기'
description: Asset package의 SavedByEngineVersion changelist가 0일 때 발생하는 경고의 정확한 의미와, nonzero-CL 엔진에서 ResavePackages로 metadata를 복구하고 결과를 검증하는 안전 절차를 설명합니다.
image: https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80
category: Unreal Engine
tags:
  - unreal-engine
  - asset
  - package
  - migration
  - commandlet
  - troubleshooting
---

UE 4.27-Plus 사내 project를 UE 5.3.1로 옮길 때 많은 Asset에서 다음 경고가 나타났다.

```text
<ASSET_PATH>: Asset has been saved with empty engine version.
The asset will be loaded but may be incompatible.
```

`ResavePackages -OnlyUnversioned`를 실행하는 것과 `ZeroEngineVersionWarning`을 끄는 것은 결과가 전혀 다르다.

- target engine에서 package를 다시 저장하면 `SavedByEngineVersion` metadata를 **복구**할 수 있다.
- `ZeroEngineVersionWarning=0`은 log를 **숨길 뿐** package를 바꾸지 않는다.

대량 resave는 `.uasset`과 `.umap`을 실제로 load/save하고 migration conversion까지 적용할 수 있다. 그래서 명령 한 줄을 바로 실행하기보다 경고의 조건, UE 5.3.1 build의 changelist, source-control 범위, 결과 검증을 먼저 준비해야 한다.

## `empty engine version`의 정확한 뜻

경고 문구만 보면 major, minor, patch가 모두 비어 있다고 생각하기 쉽다. 실제 engine 분기는 `SavedByEngineVersion`이 유효한 **changelist**를 가지고 있는지에 초점을 둔다. 동작을 단순화하면 다음 조건이다.

```cpp
NeedsEngineVersionChecks
    && !FPlatformProperties::RequiresCookedData()
    && !Summary.SavedByEngineVersion.HasChangelist()
    && FEngineVersion::Current().HasChangelist()
```

즉 일반적인 uncooked/editor package load에서 다음이 모두 맞을 때 경고한다.

1. 이 loader가 engine-version 검사를 수행하는 경로다.
2. package summary의 `SavedByEngineVersion` changelist가 없거나 0이다.
3. target Editor build에는 nonzero changelist가 있다.

Asset이 즉시 손상됐다는 판정은 아니다. Engine은 package를 load하되 저장 engine의 정확한 호환성을 판단할 근거가 부족하므로 경고한다.

## Package summary에 저장되는 버전 정보

`.uasset`과 `.umap` 앞부분의 [`FPackageFileSummary`](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/CoreUObject/FPackageFileSummary)는 package 내용을 읽기 위한 목차와 여러 version field를 가진다.

| field                         | 의미                                                              |
| ----------------------------- | ----------------------------------------------------------------- |
| `SavedByEngineVersion`        | 이 source package를 마지막으로 저장한 engine version              |
| `CompatibleWithEngineVersion` | binary compatibility를 유지한다고 기록한 가장 이른 engine version |
| Object/File version           | serialization format 변화 판정                                    |
| Custom versions               | project, plugin, engine system별 serialization 변화 판정          |

`FEngineVersion`에는 major, minor, patch, changelist, branch가 포함된다. 이 경고의 핵심은 `SavedByEngineVersion.GetChangelist() == 0`이다.

CL0 package는 engine-version 호환성 비교에서 매우 관대하게 취급될 수 있다. 그렇다고 Object Version과 Custom Version 검사까지 모두 사라지는 것은 아니다. “문제없이 load됐으니 완전히 호환된다”도, “경고가 있으니 파일이 깨졌다”도 정확한 해석이 아니다.

## 왜 changelist 0으로 저장되는가

흔한 원인은 다음과 같다.

- `Engine/Build/Build.version`의 `Changelist`가 0인 source build로 source Asset을 저장했다.
- 오래된 package가 완전한 engine-version field를 갖기 전에 만들어졌다.
- 별도 branch나 custom fork에서 version metadata를 만들지 않은 build를 사용했다.
- CL0 build에서 저장한 콘텐츠를 나중에 Launcher 또는 promoted build로 열었다.

따라서 “UE 5.3.1 migration이 경고를 만들었다”고 바로 결론 내리면 안 된다. 4.27-Plus build가 이미 CL0 package를 만들었고, nonzero-CL UE 5.3.1이 이를 처음 경고했을 가능성도 있다.

먼저 warning log의 package를 하나 골라 이전 build와 target build의 `Build.version`, source control history, package 저장 시점을 확인한다.

## 두 방법은 같은 해결책이 아니다

| 방법                                   | package metadata 변경 | 경고 제거 가능 | 호환성 근거 복구 | 적합한 경우                                                    |
| -------------------------------------- | --------------------- | -------------- | ---------------- | -------------------------------------------------------------- |
| target Editor로 package 직접 열고 Save | 예                    | 예             | 예               | 먼저 canary Asset 한두 개로 원인과 결과 확인                   |
| `ResavePackages -OnlyUnversioned`      | 예                    | 예             | 예               | 검증된 target build에서 project의 많은 CL0 package를 일괄 처리 |
| `ZeroEngineVersionWarning=0`           | 아니요                | log만 숨김     | 아니요           | 의도적인 CL0 pipeline의 위험을 별도로 승인한 특수한 경우       |
| 아무 처리 없이 계속 사용               | 아니요                | 아니요         | 아니요           | 제3자 read-only content 등을 조사하는 동안의 임시 상태         |

일반적인 migration의 목표는 경고 문구를 없애는 것이 아니라 **실제 배포에 사용할 target engine으로 package를 다시 저장하고 결과를 검증하는 것**이다.

## 대량 resave 전에 확인할 것

### 1. 원본과 분리된 복사본 또는 깨끗한 source-control 상태

새 engine에서 저장한 Asset은 이전 engine에서 다시 열 수 있다고 기대하면 안 된다. Epic의 [project update 안내](https://dev.epicgames.com/documentation/unreal-engine/updating-projects-to-newer-versions-of-unreal-engine)는 새 version으로 변환할 때 원본의 복사본을 만들 것을 권장한다.

- 별도 branch, Perforce changelist 또는 완전한 project 복사본을 만든다.
- 작업 전 uncommitted Asset 변경이 없어야 한다.
- binary diff를 되돌릴 수 있는 source control 또는 backup을 준비한다.
- Editor와 commandlet이 같은 파일을 동시에 저장하지 않도록 Editor를 닫는다.

### 2. target build의 changelist가 nonzero인지 확인

CL0 Editor로 다시 저장하면 새 package에도 CL0가 기록되므로 수리가 되지 않는다. Launcher build, promoted internal build 또는 조직의 versioning 정책에 따라 올바르게 생성된 nonzero-CL build를 사용한다. 숫자만 임의로 바꿔 호환성을 가장하지 않는다.

```powershell
$ueRoot = 'C:\Program Files\Epic Games\UE_5.3'
$buildVersionFile = Join-Path $ueRoot 'Engine\Build\Build.version'
$buildVersion = Get-Content -LiteralPath $buildVersionFile -Raw |
    ConvertFrom-Json

$buildVersion |
    Select-Object MajorVersion, MinorVersion, PatchVersion,
                  Changelist, CompatibleChangelist,
                  IsLicenseeVersion, IsPromotedBuild

if ([int64]$buildVersion.Changelist -eq 0) {
    throw 'Target engine changelist is 0. Resaving will not repair the metadata.'
}
```

### 3. Asset 하나로 canary test

warning에 나온 Asset 하나를 target Editor에서 열고 저장한다. Editor를 다시 시작하거나 package를 unload/reload한 뒤 warning이 사라지는지 확인한다. source-control diff의 범위와 Asset 동작이 예상과 같을 때만 일괄 작업으로 넓힌다.

## 안전한 `ResavePackages` 명령

다음 PowerShell 예시는 실행 파일과 project가 실제로 존재하는지, target changelist가 nonzero인지 확인한 뒤 project 범위의 CL0 package만 다시 저장한다.

```powershell
$ueRoot = 'C:\Program Files\Epic Games\UE_5.3'
$projectFile = 'D:\Projects\MyGame\MyGame.uproject'
$editorCmd = Join-Path $ueRoot 'Engine\Binaries\Win64\UnrealEditor-Cmd.exe'
$buildVersionFile = Join-Path $ueRoot 'Engine\Build\Build.version'

if (-not (Test-Path -LiteralPath $editorCmd)) {
    throw "UnrealEditor-Cmd.exe not found: $editorCmd"
}

if (-not (Test-Path -LiteralPath $projectFile)) {
    throw "uproject not found: $projectFile"
}

$buildVersion = Get-Content -LiteralPath $buildVersionFile -Raw |
    ConvertFrom-Json

if ([int64]$buildVersion.Changelist -eq 0) {
    throw 'Target engine changelist is 0. Resaving will not repair the metadata.'
}

& $editorCmd $projectFile `
    -run=ResavePackages `
    -OnlyUnversioned `
    -ProjectOnly `
    -Unattended `
    -UTF8Output

if ($LASTEXITCODE -ne 0) {
    throw "ResavePackages failed with exit code $LASTEXITCODE"
}
```

실행 파일과 `.uproject` 경로는 PowerShell argument로 전달하므로 공백이 있어도 안전하다. `cmd.exe`나 batch file로 옮긴다면 각각을 명시적으로 quote해야 한다.

UE 4.27에서는 실행 파일 이름만 다르다.

```powershell
$editorCmd = Join-Path $ueRoot 'Engine\Binaries\Win64\UE4Editor-Cmd.exe'
```

### 각 flag의 의미

| flag                  | 이 작업에서의 역할                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `-run=ResavePackages` | package를 순회해 load/save하는 commandlet 실행                                                   |
| `-OnlyUnversioned`    | `SavedByEngineVersion.GetChangelist() == 0`인 package만 저장 후보로 선택                         |
| `-ProjectOnly`        | Engine directory package를 제외하고 project 범위로 제한. project plugin content는 포함될 수 있음 |
| `-Unattended`         | dialog가 필요한 상태에서 automation이 멈추는 위험 감소                                           |
| `-UTF8Output`         | redirected log의 encoding을 일관되게 유지                                                        |

`-OnlyUnversioned`는 “version이라는 이름이 붙은 모든 상태가 없는 Asset”이라는 뜻이 아니다. 정확히 이 commandlet에서 SavedBy changelist가 0인 package를 고르는 filter다.

Perforce에서 Asset이 read-only라면 팀과 대상 범위를 합의한 뒤 `-AutoCheckOut`을 추가할 수 있다. 자동 제출 옵션인 `-AutoCheckIn` 또는 `-AutoSubmit`은 이 migration에 넣지 않는다. commandlet이 끝나도 사람이 binary 변경과 test 결과를 검토한 뒤 별도로 제출한다.

## Cook의 `-UnVersioned`와 혼동하지 않기

이름이 비슷한 기능은 목적이 다르다.

| 이름                                   | 대상                  | 의미                                                                           |
| -------------------------------------- | --------------------- | ------------------------------------------------------------------------------ |
| `ResavePackages -OnlyUnversioned`      | editor source package | SavedBy changelist가 0인 기존 package만 골라 target Editor로 다시 저장         |
| Cook `-UnVersioned`                    | cooked output         | 배포용 cooked package의 version 정보를 의도적으로 생략하는 cook option         |
| `FPackageFileSummary::bUnversioned` 등 | serialization 내부    | property/object versioning의 다른 경로이며 이 경고 filter와 동일한 이름이 아님 |

[Cooking Content](https://dev.epicgames.com/documentation/unreal-engine/cooking-content-in-unreal-engine)은 cook option의 별도 목적을 설명한다. source Asset 경고를 고치려고 cook의 `-UnVersioned`를 바꾸지 않는다.

## 실행 뒤 반드시 검증하기

commandlet exit code 0만으로 migration이 끝난 것은 아니다.

1. `Saved/Logs`에서 `LogLinker`, `LogContentCommandlet`, `Skipping`, `Warning`, `Error`, `[REPORT]`를 확인한다.
2. source control에서 예상한 `.uasset`과 `.umap`만 바뀌었는지 본다.
3. 예상보다 많은 binary가 바뀌었다면 target engine conversion, redirector, custom version이 함께 적용됐는지 조사한다.
4. 같은 명령을 한 번 더 실행해 추가 resave 대상이 남지 않는지 확인한다.
5. 주요 map을 열고 Blueprint compile, Asset validation, gameplay smoke test를 수행한다.
6. clean cook와 package build를 실행한다.
7. 원래 warning이 사라졌는지, 새 serialization·load warning이 생기지 않았는지 비교한다.
8. 결과를 engine migration 전용 commit 또는 changelist로 분리한다.

`ResavePackages`는 header byte 몇 개만 patch하는 도구가 아니다. 각 package를 실제로 load하고 저장하므로 target engine의 serialization conversion과 editor-side save 동작이 적용된다. binary diff가 넓을 수 있는 이유다.

## `ZeroEngineVersionWarning`은 언제 쓰는가

`False`와 `0`은 bool parser에서 같은 warning toggle 값으로 동작한다.

```ini
; Config/DefaultEngine.ini
[Core.System]
ZeroEngineVersionWarning=False
```

어느 표기를 쓰든 다음은 변하지 않는다.

- package의 `SavedByEngineVersion`을 수정하지 않는다.
- 호환성을 검증하거나 복구하지 않는다.
- cook output과 source Asset을 고치지 않는다.
- process의 log message만 억제한다.

값은 process에서 일찍 읽힐 수 있으므로 설정을 바꾼 뒤 Editor와 commandlet을 다시 시작한다. PC 재부팅은 필요 없다.

조직이 의도적으로 CL0 source build를 사용하고, 별도 Object/Custom Version과 test matrix로 위험을 관리하며, 이 warning이 예상된 noise라는 결정을 내린 경우에는 억제를 고려할 수 있다. 일반 project migration에서 log를 깨끗하게 보이게 하려고 사용하는 해결책은 아니다.

## Cook과 compatibility에 미치는 영향

warning은 기본적으로 warning이므로 항상 cook을 중단시키지는 않는다. CI가 warning을 error로 승격하면 project policy 때문에 실패할 수 있다. 더 중요한 위험은 package가 어느 nonzero changelist build에서 저장됐는지 근거가 없어 engine-version compatibility 검사가 관대해진다는 점이다.

- warning을 숨겨도 compatibility risk는 그대로다.
- target UE5에서 resave한 Asset이 이전 UE4.27에서 다시 열린다고 기대하지 않는다.
- standard UE4.27→UE5 forward migration 가능성과 4.27-Plus custom fork의 serializer 호환성은 별개다.
- plugin의 Custom Version이 있다면 target version의 upgrade path를 따로 test한다.
- third-party content를 수정할 권한이 없으면 vendor update나 별도 migration copy를 검토한다.

UE5의 [Migration Guide](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-migration-guide)는 UE4.27 project를 UE5로 가져올 수 있지만 새 engine에서 저장한 Asset을 이전 engine으로 되돌리는 workflow를 보장하지 않는다고 경고한다.

## 흔한 실수

- 경로에 공백이 있는데 실행 파일과 `.uproject`를 하나의 문자열 명령으로 조립함
- `-ProjectOnly` 없이 mounted Engine content까지 넓게 순회함
- Editor를 열어 둔 채 external commandlet로 같은 package를 저장함
- target `Build.version`의 changelist가 0인데 resave를 반복함
- dirty working tree에서 실행해 기존 Asset 변경과 migration diff를 섞음
- Perforce 자동 checkout과 자동 submit을 검토 없이 켬
- `ZeroEngineVersionWarning=0`을 metadata repair로 오해함
- Cook `-UnVersioned`를 source Asset 경고의 반대 option으로 오해함
- UE5에서 저장한 Asset을 UE4 branch에 다시 복사함
- warning 수만 줄고 새 load/cook error가 생겼는지 확인하지 않음

## 결론

`Asset has been saved with empty engine version`은 대개 source package의 `SavedByEngineVersion` changelist가 0인데 target Editor는 nonzero changelist를 가진 상황을 뜻한다. Asset은 load되지만 정확한 저장 engine을 근거로 한 compatibility 판단이 느슨해진다.

안전한 해결은 target engine의 changelist를 먼저 확인하고, canary Asset을 수동 저장해 원인을 검증한 뒤, 깨끗한 복사본이나 source-control changelist에서 `ResavePackages -OnlyUnversioned -ProjectOnly`를 실행하는 것이다. 그 후 binary diff, log, map load, Blueprint compile, clean cook와 package를 모두 확인한다.

`ZeroEngineVersionWarning=0`은 의도적인 CL0 pipeline에서 noise를 억제하는 설정일 뿐이다. package metadata를 복구하지 않으므로 일반 migration의 두 번째 해결책으로 나열해서는 안 된다.

## 참고 자료

- [Epic Games: Versioning of Assets and Packages](https://dev.epicgames.com/documentation/en-us/unreal-engine/versioning-of-assets-and-packages-in-unreal-engine)
- [Epic Games UE 4.27: Versioning of Assets and Packages](https://dev.epicgames.com/documentation/ko-kr/unreal-engine/versioning-of-assets-and-packages?application_version=4.27)
- [Epic Games: `FPackageFileSummary`](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/CoreUObject/FPackageFileSummary)
- [Epic Games: `FEngineVersionBase`](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Core/FEngineVersionBase)
- [Epic Games: `FBuildVersion`](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Core/FBuildVersion)
- [Epic Games: `UResavePackagesCommandlet`](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Editor/UnrealEd/UResavePackagesCommandlet)
- [Epic Games: Updating projects to newer versions](https://dev.epicgames.com/documentation/unreal-engine/updating-projects-to-newer-versions-of-unreal-engine)
- [Epic Games: Content Cooking](https://dev.epicgames.com/documentation/unreal-engine/cooking-content-in-unreal-engine)
- [Epic Developer Community: empty engine version forum answer](https://forums.unrealengine.com/t/asset-has-been-saved-with-empty-engine-version/323372)
