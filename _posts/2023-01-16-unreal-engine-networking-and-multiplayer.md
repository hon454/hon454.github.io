---
title: 언리얼 엔진의 네트워킹과 멀티플레이
date: 2023-01-16 21:50:00 +0900
categories: [Unreal, Networking and Multiplayer]
tags: [unreal, networking, multiplayer]
typora-root-url: ./..
---

## **TMap, TSet은 리플리케이션이 불가능하다**

TArray를 리플리케이션 한 후 수신 측에서 TMap/TSet 을 재구성 하는 식으로 사용 가능



## BeginPlay가 호출 되기 전에 매개변수를 Actor에 전달하는 방법

### 첫번째 방법

```cpp
FTransform SpawnTransform(SpawnRot, SpawnLoc);
AMyCharacter* Character = world->SpawnActorDeferred<AMyCharacter>(ActorClass, SpawnTransform);
if (Character)
{
    Character->SetupFunction(... params ...);
    Character->FinishSpawning(SpawnTransform);
}
```



### 두번째 방법

```cpp
FTransform SpawnTransform(SpawnRot, SpawnLoc);
AMyCharacter* Character = Cast<AMyCharacter>(UGameplayStatics::BeginDeferredActorSpawnFromClass(this, DeferredActorClass, SpawnTransform));
if (Character != nullptr)
{
    Character->SetupFunction(... params ...);
    UGameplayStatics::FinishSpawningActor(Character, SpawnTransform);
}
```

> **SpawnActor** 호출 시 Constructor와 BeginPlay 모두 트리거<br>**SpawnActorDeferred** 호출 시 Constructor만 트리거<br>BeginPlay는 **FinishSpawning** 이후 트리거



## 참고자료

[Unreal Engine 4' Network Compendium](https://cedric-neukirchen.net/Downloads/Compendium/UE4_Network_Compendium_by_Cedric_eXi_Neukirchen.pdf)

[프로그래머를 괴롭히는 Unreal Engine 4의 함정들](https://youtu.be/o8TgvFPhUgE?si=BbKFPqcgEoVGXosG)

[언리얼 네트워킹 아키텍처](https://sites.google.com/site/techaht/trans/unreal-net-arch?pli=1)

