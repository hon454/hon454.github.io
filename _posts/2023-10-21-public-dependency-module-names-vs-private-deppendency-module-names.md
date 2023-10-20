---
title: PublicDependencyModuleNames vs PrivateDependencyModuleNames
date: 2023-10-21 02:37:00 +0900
categories: [Unreal, Troubleshooting]
tags: [unreal]
typora-root-url: .
---

언리얼 엔진에서는 다른 모듈과의 종속성을 정의하기 위해서 `[ModuleName].Build.cs` 파일의  `PublicDependencyModuleNames `,  `PrivateDependencyModuleNames` 목록을 사용한다. 이러한 목록에 아래와 같이 모듈 이름을 추가하면 현재 모듈과 다른 모듈과의 종속성이 정의 된다.

```csharp
PublicDependencyModuleNames.AddRange(
	new string[]
	{
		"Core",
		"OnlineSubsystem",
		"OnlineSubsystemSteam",
		// ... add other public dependencies that you statically link with here ...
	}
);
	
 
PrivateDependencyModuleNames.AddRange(
	new string[]
	{
		"CoreUObject",
		"Engine",
		"Slate",
		"SlateCore",
		// ... add private dependencies that you statically link with here ...	
	}
);
```



이때 `PublicDependencyModuleNames` 과 `PrivateDependencyModuleNames` 차이는 무엇일까?

언리얼엔진에서는 다음과 같은 모듈 폴더 구조를 권장한다.

- [ModuleName]
  - Private
    - [ModuleName]Module.cpp
    - 모든 .cpp 파일 및 프라이빗 헤더
  - Public
    - 모든 퍼블릭 헤더
  - [ModuleName].Build.cs



`PublicDependencyModuleNames` 목록에 추가  된 모듈을 현재 모듈이 헤더 파일에서 참고할 모듈, `PrivateDependencyModuleNames` 목록에 추가 된 모듈은 소스 코드에서만 참고할 모듈이라고 생각 하면 편하다.

되도록 프로젝트의 컴파일 시간을 줄여 주는 프라이빗 종속성을 사용하는 것이 좋으며, 헤더 파일 내에서는 전방 선언(Forward Declaration)을 사용하여 퍼블릭 종속성을  사용하지 않도록 할 수 있다.



### 참고 자료

[Unreal Engine Forum](https://forums.unrealengine.com/t/what-is-the-difference-between-publicdependencymodulenames-and-privatedependencymodulenames/279386)

[Unreal Engine Documentation](https://docs.unrealengine.com/unreal-engine-modules/)
