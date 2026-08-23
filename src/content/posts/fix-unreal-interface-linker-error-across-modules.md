---
published: 2021-07-19
updated: 2026-08-24
author: Jihoon Jeon
title: 'UE4 다른 모듈의 UInterface 캐스팅에서 LNK1120이 발생할 때'
description: UE 4.26에서 다른 모듈의 UInterface를 사용할 때 GetPrivateStaticClass 링크 오류가 발생한 원인과 두 인터페이스 타입에 모듈 API 매크로를 적용하는 방법을 정리합니다.
category: Unreal Engine
tags:
  - unreal-engine
  - ue4
  - cpp
  - uinterface
  - modules
  - linker
  - debugging
sourceLink: "https://velog.io/@hon454/캐스팅-시-LNK1120-에러-발생"
---

> 이 글은 2021년 7월, **Unreal Engine 4.26.2**에서 겪은 문제를 당시 엔진 구조를 기준으로 다시 검토해 옮긴 기록이다. 이후 엔진 버전의 동작을 소급해서 적용하지 않았다.

Rider의 Unreal 클래스 생성 기능으로 `UInterface`를 만든 뒤, 그 인터페이스를 다른 게임 모듈에서 사용했다. 헤더는 정상적으로 include되고 컴파일도 진행됐지만 링크 단계에서 다음 오류가 발생했다.

```text
unresolved external symbol
"private: static class UClass * __cdecl UDefaultAI::GetPrivateStaticClass(void)"
referenced in function ...

LNK1120: 1 unresolved externals
```

`Build.cs`의 모듈 의존성은 이미 설정되어 있었다. 오류의 핵심은 의존 모듈을 찾지 못한 것이 아니라, `UDefaultAI`가 들어 있는 DLL에서 reflection용 심볼을 외부로 내보내지 않았다는 점이었다.

## 문제가 된 선언

`UInterface`를 만들면 실제로는 두 C++ 타입이 생긴다.

- `UDefaultAI`: Unreal reflection에 등록되는 `UObject` 쪽 타입
- `IDefaultAI`: 게임플레이 인터페이스를 선언하는 native C++ 타입

문제가 된 코드는 모듈 API 매크로가 `IDefaultAI`에만 붙어 있었다.

```cpp
#pragma once

#include "CoreMinimal.h"
#include "UObject/Interface.h"
#include "DefaultAI.generated.h"

UINTERFACE()
class UDefaultAI : public UInterface
{
    GENERATED_BODY()
};

class AI_API IDefaultAI
{
    GENERATED_BODY()

public:
    virtual class AAIController* GetAIController() const = 0;
};
```

다른 모듈에서 `Cast<IDefaultAI>(Object)` 같은 reflection 기반 경로를 사용하면 `UDefaultAI::StaticClass()`와 그 내부의 `GetPrivateStaticClass()` 심볼도 필요하다. 하지만 `UDefaultAI`에는 `AI_API`가 없어서 modular build의 다른 DLL이 해당 심볼을 가져올 수 없었다.

## 두 타입 모두 export한다

`UDefaultAI`와 `IDefaultAI` 양쪽에 인터페이스가 정의된 모듈의 API 매크로를 붙인다.

```cpp
#pragma once

#include "CoreMinimal.h"
#include "UObject/Interface.h"
#include "DefaultAI.generated.h"

UINTERFACE()
class AI_API UDefaultAI : public UInterface
{
    GENERATED_BODY()
};

class AI_API IDefaultAI
{
    GENERATED_BODY()

public:
    virtual class AAIController* GetAIController() const = 0;
};
```

당시 UE4의 모듈 API 매크로는 modular build에서 다음처럼 바뀌었다.

- 타입을 정의하는 모듈을 빌드할 때: `__declspec(dllexport)`
- 타입을 사용하는 모듈을 빌드할 때: `__declspec(dllimport)`
- monolithic build일 때: 빈 매크로

따라서 Editor와 같은 DLL 구성에서만 오류가 드러나고 monolithic target에서는 우연히 통과할 수 있다. 특정 빌드에서 통과했다는 사실만으로 export 선언이 올바르다고 판단하면 안 된다.

## `Build.cs` 의존성도 별도로 필요하다

API 매크로와 모듈 의존성은 서로 대체 관계가 아니다.

```csharp
PublicDependencyModuleNames.AddRange(new[]
{
    "Core",
    "CoreUObject",
    "Engine",
    "AI",
});
```

- `Build.cs`는 어떤 모듈의 include·link 환경을 사용할지 정한다.
- `AI_API`는 그 DLL에서 어떤 클래스와 함수를 외부에 공개할지 정한다.

헤더 경로가 보이는데 `GetPrivateStaticClass`, vtable 또는 함수 구현에서 unresolved external이 발생한다면 다음 순서로 확인한다.

1. 사용하는 모듈의 `Build.cs`에 정의 모듈이 들어 있는가?
2. 외부에서 쓰는 클래스·함수에 `*_API` 매크로가 있는가?
3. `UInterface`라면 `U...` 타입과 `I...` 타입을 모두 확인했는가?
4. 선언과 구현의 함수 signature가 정확히 같은가?
5. Editor DLL build와 packaged monolithic build의 차이에 가려진 문제는 아닌가?

이 사례에서는 3번이 원인이었다. 자동 생성된 코드라도 모듈 경계를 넘는 타입이라면 export 범위를 직접 검토해야 한다.

## 참고 자료

- [Epic Games: Module API Specifiers — UE 4.27](https://dev.epicgames.com/documentation/en-us/unreal-engine/module-api-specifiers?application_version=4.27)
- [Epic Games: Programming Basics — UE 4.27](https://dev.epicgames.com/documentation/unreal-engine/programming-basics?application_version=4.27)
