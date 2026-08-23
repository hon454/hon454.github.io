---
published: 2021-09-29
updated: 2026-08-24
author: Jihoon Jeon
title: 'UE4 Net Dormancy와 서버 리플리케이션 최적화'
description: UE 4.26~4.27의 Net Dormancy 상태, FlushNetDormancy와 ForceNetUpdate의 차이, Adaptive NetUpdateFrequency, RPC와 프로퍼티 복제 최적화 기준을 정리합니다.
category: Unreal Engine
tags:
  - unreal-engine
  - ue4
  - networking
  - replication
  - dormancy
  - optimization
sourceLink: "https://velog.io/@hon454/ue4-서버-최적화-팁"
---

> 이 글은 2021년 8~9월에 작성한 `NetDormancy 이해`와 `Networking in UE4: Server Optimizations` 메모를 **Unreal Engine 4.26~4.27** 기준으로 합쳐 옮긴 글이다. 당시 잘못 이해했던 `DORM_Initial`, `NetUpdateFrequency`, Multicast RPC 부분은 같은 시점의 엔진 소스와 문서에 맞춰 교정했다.

UE4 서버 리플리케이션 최적화의 출발점은 payload 몇 byte를 줄이는 것보다, 불필요한 Actor를 복제 후보에 올리지 않는 것이다. 당시 Epic 문서가 제시한 우선순위도 다음과 같았다.

1. 필요 없는 Actor의 replication을 끈다.
2. `NetUpdateFrequency`를 가능한 낮춘다.
3. Dormancy를 사용한다.
4. Relevancy 범위를 줄인다.
5. 그 뒤에 프로퍼티와 RPC payload를 줄인다.

## `ENetDormancy` 상태

UE 4.26~4.27의 `ENetDormancy`는 다음 상태를 제공했다.

| 상태 | 당시 의미 |
| --- | --- |
| `DORM_Never` | 이 Actor를 dormancy 대상으로 사용하지 않는다. |
| `DORM_Awake` | 현재 깨어 있으며, 게임 코드가 나중에 dormant 상태로 바꿀 수 있다. |
| `DORM_DormantAll` | 모든 connection에 대해 dormant 상태가 되기를 원한다. |
| `DORM_DormantPartial` | `GetNetDormancy()` 결과에 따라 connection별로 dormancy를 결정한다. |
| `DORM_Initial` | 맵에 배치된 startup Actor가 모든 connection에 대해 처음부터 dormant다. |

Dormant Actor는 일반적인 property replication 비교와 전송 대상에서 빠진다. 나무, 문, 고정 건물처럼 평소에는 변하지 않고 특정 사건에만 상태가 바뀌는 Actor에 적합하다.

## `DORM_Initial`은 “한 번 보낸 뒤 잠든다”가 아니다

원문에서는 `DORM_Initial`을 “맵에 배치될 때 한 번 복제한 뒤 `DORM_DormantAll`로 전환”한다고 설명했다. UE 4.27의 detailed replication flow는 `DORM_Initial` Actor를 초기 고려 단계에서 바로 건너뛴다.

맵에 함께 포함된 Actor와 기본 상태는 client도 level package를 통해 이미 알고 있다. 서버에서 runtime에 값을 변경했다면 dormancy를 flush해야 그 변경이 전송된다.

```cpp
ATreeActor::ATreeActor()
{
    bReplicates = true;
    NetDormancy = DORM_Initial;
}

void ATreeActor::ApplyDamage(int32 Damage)
{
    if (!HasAuthority())
    {
        return;
    }

    // 변경 전에 dormant connection을 다시 전송 가능 상태로 만든다.
    FlushNetDormancy();
    Health = FMath::Max(0, Health - Damage);
}
```

UE 4.27의 `FlushNetDormancy`는 `DORM_Initial`을 `DORM_DormantAll`로 바꾸고, 각 connection의 dormant 목록에서 Actor를 제거한다. Actor 자체의 최종 정책은 dormant 상태로 남으므로 적어도 한 번 더 업데이트한 뒤 다시 잠들 수 있다.

## `FlushNetDormancy`와 `ForceNetUpdate`

두 함수는 비슷해 보이지만 의도를 구분할 수 있다.

- `FlushNetDormancy()`: dormant Actor의 변경사항을 다시 전송할 수 있게 한다.
- `ForceNetUpdate()`: 다음 정규 update 간격을 기다리지 않고 Actor를 replication 대상으로 당긴다.

UE 4.27의 `AActor::ForceNetUpdate()`는 Actor가 `DORM_Awake`보다 높은 dormancy 상태라면 내부에서 `FlushNetDormancy()`도 호출했다. 따라서 dormant Actor에서 `ForceNetUpdate`가 결과적으로 flush를 수행한다는 원문의 메모는 맞았다.

다만 코드를 읽는 사람에게 의도를 드러내기 위해서는 다음처럼 선택하는 편이 좋다.

- “이 dormant Actor의 상태가 바뀌었다” → `FlushNetDormancy`
- “깨어 있는 Actor를 지금 한 번 더 빨리 보내고 싶다” → `ForceNetUpdate`

## Multicast RPC가 자동으로 깨워 준다고 가정하지 않는다

원문은 Multicast RPC가 `FlushNetDormancy`를 강제로 호출한다고 적었다. 하지만 UE 4.27의 기본 `UNetDriver::ProcessRemoteFunction` 경로에는 Multicast 호출만으로 Actor의 dormancy를 flush하는 처리가 없다. 당시 구현도 connection에 대한 relevancy와 Actor channel 상태를 전제로 RPC를 보냈다.

Dormant Actor에서 중요한 상태가 바뀐다면 다음 순서를 사용한다.

1. 서버에서 `FlushNetDormancy()`를 호출한다.
2. replicated property를 변경한다.
3. 일시적인 연출이 필요할 때만 Multicast RPC를 추가한다.

지속되어야 하는 게임 상태를 RPC만으로 표현하면 join-in-progress client가 과거 이벤트를 받지 못한다. 상태는 replicated property로, 소리·파티클처럼 순간적인 사건은 RPC로 나누는 편이 안전하다.

## `NetUpdateFrequency`는 무조건 크게 두지 않는다

기본 동작에서 `NetUpdateFrequency`는 초당 최대 update 시도 횟수다. 값이 높을수록 더 자주 후보가 되므로, 중요하지 않거나 천천히 변하는 Actor는 값을 낮추는 것이 기본 최적화다.

```cpp
NetUpdateFrequency = 5.f;
MinNetUpdateFrequency = 1.f;
```

`net.UseAdaptiveNetUpdateFrequency=1`을 켜면 의미가 조금 달라진다.

- `NetUpdateFrequency`: adaptive 범위의 최대 빈도
- `MinNetUpdateFrequency`: adaptive 범위의 최소 빈도

변화가 잦을 때는 최대치 쪽으로, 의미 있는 변화가 오랫동안 없으면 최소치 쪽으로 update 빈도를 조절한다. 원문의 “`NetUpdateFrequency`를 크게 하고 `ForceNetUpdate`를 사용”이라는 메모는 adaptive 범위의 최대치를 말한 것으로는 이해할 수 있지만, 일반 규칙으로 적용하면 오히려 비용을 늘린다.

## 전송량을 줄이는 당시의 실전 항목

### 복제 자체를 줄인다

- cosmetic 전용 Actor와 Component는 replication을 끈다.
- 클라이언트에서 파생할 수 있는 값은 별도 property로 보내지 않는다.
- 상태 변경 주기가 전혀 다른 책임은 별도 Actor나 subobject로 나누는 것을 검토한다.
- 정적인 배치 Actor는 `DORM_Initial` 또는 `DORM_DormantAll`을 검토한다.

### 데이터 표현을 줄인다

- 위치·벡터 정밀도가 충분하다면 `FVector_NetQuantize` 계열을 사용한다.
- 자주 보내는 문자열 대신 enum이나 작은 ID를 검토한다.
- UE 4.27에서 RPC의 `FName`은 일반적으로 압축되지 않아 호출마다 문자열 비용이 생길 수 있었다.
- 자주 변하는 배열은 `FFastArraySerializer`로 항목 단위 delta를 보내는 방식을 검토한다.

### RPC를 상태 저장소로 사용하지 않는다

- 매 Tick reliable RPC를 보내지 않는다. reliable buffer가 밀리면 지연이 커지고 overflow 시 연결이 끊길 수 있다.
- 모든 중간값이 필요한 것이 아니라 최종 상태가 중요하다면 replicated property를 사용한다.
- unreliable RPC가 유실되어도 다음 상태 동기화로 복구되는 구조를 만든다.
- Multicast는 연결 수만큼 트래픽을 만들므로 일시적인 사건에 제한한다.

## Network Profiler로 먼저 측정한다

UE 4.27에서는 다음 명령으로 `.nprof` 기록을 제어할 수 있었다.

```text
netprofile enable
netprofile disable
```

파일은 프로젝트의 `Saved/Profiling`에 저장되며, 당시 standalone 도구는 다음 경로에 있었다.

```text
Engine/Binaries/DotNET/NetworkProfiler.exe
```

Actor 수, RPC 호출 횟수, property payload를 측정한 뒤 replication off, update frequency, dormancy, relevancy, payload 순서로 줄인다. 추측만으로 bit flag부터 만드는 것보다 큰 비용이 어디에서 발생하는지 먼저 확인하는 편이 효과적이다.

## 참고 자료

- [원문: NetDormancy 이해](https://velog.io/@hon454/NetDormancy-네트워크-휴면-여부-이해)
- [Epic Games: Performance and Bandwidth Tips — UE 4.27](https://dev.epicgames.com/documentation/en-us/unreal-engine/performance-and-bandwidth-tips?application_version=4.27)
- [Epic Games: Property Replication — UE 4.27](https://dev.epicgames.com/documentation/en-us/unreal-engine/property-replication?application_version=4.27)
- [Epic Games: Detailed Actor Replication Flow — UE 4.27](https://dev.epicgames.com/documentation/unreal-engine/detailed-actor-replication-flow?application_version=4.27)
- [Epic Games: RPCs — UE 4.27](https://dev.epicgames.com/documentation/unreal-engine/rpcs?application_version=4.27)
- [Epic Games: Network Profiler — UE 4.27](https://dev.epicgames.com/documentation/unreal-engine/network-profiler?application_version=4.27)
