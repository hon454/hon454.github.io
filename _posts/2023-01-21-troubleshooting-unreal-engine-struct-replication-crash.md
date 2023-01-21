---
title: 언리얼 구조체 리플리케이션이 크래시를 발생시키는 문제 해결
date: 2023-01-21 19:18:00 +0900
categories: [Unreal, Network]
tags: [unreal, network, replication]
typora-root-url: ./..
---

## 리플리케이션 하려는 구조체의 모든 변수에 UPROPERTY 매크로가 없는 경우

```cpp
USTRUCT()
struct FMagazine_NetQuantize
{
	GENERATED_BODY()
public:
	FGuid MagazineId;
	int32 AmmoId;
	int32 AmmoAmount;
}
```

```cpp
check(ArrayNum < ShadowArrayNum || SharedParams.Cmds[CmdIndex + 1].Type == ERepLayoutCmdType::DynamicArray);
```

`FMagazine_NetQuantize`구조체를 리플리케이션 하는 경우 다음과 같은 어서트로 인해 실행이 중지 된다.



```cpp
USTRUCT()
struct FMagazine_NetQuantize
{
	GENERATED_BODY()
public:
	UPROPERTY()
	FGuid MagazineId;
    UPROPERTY()
	int32 AmmoId;
    UPROPERTY()
	int32 AmmoAmount;
}
```

위와 같이 구조체의 모든 변수에 `UPROPERTY` 매크로를 추가 하면 해결된다.





