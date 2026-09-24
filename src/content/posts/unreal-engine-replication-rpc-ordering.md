---
title: "언리얼 엔진의 리플리케이션 및 RPC 순서 보장에 관하여"
published: 2026-09-24
description: "프로퍼티 복제와 OnRep, RPC의 순서 보장 범위를 살펴보고, 일시적인 상태 불일치와 액터 간 준비 순서를 처리하는 방법을 예시로 정리한다."
image: "../../assets/images/posts/replication-rpc-ordering-cover.webp"
tags:
  - unreal-engine
  - networking
  - replication
category: Unreal Engine
draft: false
lang: ko
---

언리얼 엔진에서 네트워크 프로그래밍을 하다 보면, 리플리케이션이나 RPC가 작성한 코드 순서대로 처리되지 않는 상황을 만나게 된다. 서버에서 체력을 `0`으로 바꾼 뒤 사망 연출 RPC를 호출했는데, 클라이언트의 RPC 안에서는 체력이 아직 `100`인 식이다.

이때 단순히 “네트워크에서는 순서가 보장되지 않는다”고 이해하면 혼란스러울 수 있다. 실제로는 순서가 보장되는 경우도 있고, 같은 액터인지 다른 액터인지에 따라 보장 범위가 달라지기도 한다.

프로퍼티의 값이 반영되는 순서, `OnRep`가 실행되는 순서, RPC가 실행되는 순서를 나누어 살펴보자.

## 프로퍼티는 모든 변경 과정을 전달하지 않는다

프로퍼티 리플리케이션은 서버의 현재 상태를 클라이언트에 전달한다. 서버에서 값이 바뀐 모든 과정을 재현하지는 않는다.

서버의 탄약 수가 빠르게 바뀌었다고 하자.

```text
서버:        30 → 29 → 28 → 27
클라이언트:  30 ──────────→ 27
```

클라이언트는 `29`, `28`을 받지 못하고 `27`만 받을 수 있다. 액터가 매번 변경 직후 복제되는 것은 아니고, 전송한 패킷이 손실될 수도 있기 때문이다.

프로퍼티 리플리케이션의 신뢰성은 복제가 정상적으로 이어지는 조건에서 서버의 최종 값으로 맞춰진다는 의미다. 각 변경이 빠짐없이 전달된다는 의미는 아니다.

값이 복제되기 전에 원래대로 돌아오면 변경 자체를 관찰하지 못할 수도 있다.

```cpp
// 서버에서 실행한다.
// 두 대입 사이에 복제가 일어나지 않았다고 가정한다.
bIsReloading = true;
bIsReloading = false;
```

클라이언트의 기존 값도 `false`였다면, 이 변수만으로 장전이 발생했다는 사실을 알아낼 수 없다.

`NetUpdateFrequency`를 높여도 모든 변경을 전달한다는 보장은 생기지 않는다. 따라서 현재 탄약 수를 표시하는 일과 발사할 때마다 효과음을 재생하는 일을 같은 방식으로 처리하면 안 된다.

## 서로 다른 프로퍼티는 잠시 어긋날 수 있다

상자를 여는 액터에 다음 세 변수가 있다고 하자. 각각 독립적으로 복제되는 프로퍼티이며, 초기값은 모두 `false`다.

이 글의 코드는 설명에 필요한 부분만 발췌한 예시다. 클래스 전체 선언, 액터의 복제 활성화, `GetLifetimeReplicatedProps()`의 등록 코드는 생략했다. Unreal 프로젝트에서 컴파일·실행 검증한 코드는 아니다.

```cpp
UPROPERTY(Replicated)
bool bHasKey = false;

UPROPERTY(Replicated)
bool bIsUnlocked = false;

UPROPERTY(ReplicatedUsing = OnRep_IsOpen)
bool bIsOpen = false;

UFUNCTION()
void OnRep_IsOpen();
```

이 변수들이 클라이언트에서 일시적으로 어긋나는 상황을 이해하려면, 변경들이 같은 복제 업데이트에 포함됐는지부터 구분해야 한다.

### 같은 복제 업데이트에 포함됐다면

서버에서 세 값을 바꾸고, 그 변경들이 모두 같은 액터의 한 복제 업데이트에 포함됐다고 하자.

```cpp
void AChest::OpenImmediately()
{
    if (!HasAuthority())
    {
        return;
    }

    bHasKey = true;
    bIsUnlocked = true;
    bIsOpen = true;
}
```

이 예시의 단순한 불리언 세 개는 함께 전달된다.

```text
서버                                  클라이언트

세 값을 모두 true로 변경
    │
복제 업데이트 #1 전송
[HasKey, IsUnlocked, IsOpen] ─────────→ #1 수신
                                      세 값 반영
```

이 업데이트가 담긴 패킷이 손실됐다고 해서 `bIsUnlocked`만 빠지고 나머지 두 값이 적용되는 상황은 아니다.

다만 값들이 함께 전달되는 것과 서로 다른 `OnRep`의 실행 순서는 별개다. 세 프로퍼티에 각각 `OnRep`를 붙였더라도, 그 콜백들이 선언 순서대로 실행된다고 가정하면 안 된다. 아직 해석되지 않은 객체 참조는 이 단순한 불리언 예시와 구분해서 다뤄야 한다.

### 서로 다른 복제 업데이트로 전송됐다면

이번에는 열쇠 확보, 잠금 해제, 상자 열기가 서로 다른 게임 이벤트에서 발생한다고 하자.

```cpp
void AChest::OnKeyObtained()
{
    if (HasAuthority())
    {
        bHasKey = true;
    }
}

void AChest::OnUnlockCompleted()
{
    if (HasAuthority() && bHasKey)
    {
        bIsUnlocked = true;
    }
}

void AChest::OnOpenRequested()
{
    if (HasAuthority() && bIsUnlocked)
    {
        bIsOpen = true;
    }
}
```

함수가 다르다는 사실만으로 변경들이 따로 전송되는 것은 아니다. 서로 다른 서버 프레임에서 호출됐더라도, 액터의 다음 복제 시점에 함께 전송될 수 있다.

여기서는 각 이벤트 사이에 실제 복제 업데이트가 있었고, 세 변경이 각각 업데이트 #1, #2, #3으로 전송됐다고 가정한다. 또한 #2의 손실이 보완되기 전에 #3이 전송·수신되는 상황을 가정한다.

```text
시간 ↓

서버                                      클라이언트

OnKeyObtained()
  bHasKey = true
업데이트 #1 전송 ───────────────────────→ #1 수신
                                          bHasKey = true

OnUnlockCompleted()
  bIsUnlocked = true
업데이트 #2 전송 ───────× 패킷 손실
                                          bIsUnlocked는 여전히 false

OnOpenRequested()
  bIsOpen = true
업데이트 #3 전송 ───────────────────────→ #3 수신
                                          bIsOpen = true
                                          OnRep_IsOpen() 실행

#2의 손실을 인지한 뒤,
누락된 상태를 후속 업데이트로 전송 ──────→ 보완 업데이트 수신
                                          bIsUnlocked = true
```

도식에는 설명에 필요한 변경만 표시했다. 실제 업데이트에 항상 프로퍼티 하나만 들어간다는 의미는 아니다.

클라이언트가 관찰하는 값은 다음과 같다.

| 수신 시점 | `bHasKey` | `bIsUnlocked` | `bIsOpen` |
|---|---|---|---|
| 초기 상태 | false | false | false |
| #1 수신 후 | true | false | false |
| #3 수신 후 | true | false | true |
| 보완 업데이트 수신 후 | true | true | true |

#3을 받은 직후에는 “잠겨 있는데 열린 상자”가 된다. 서버에는 없었던 상태 조합이다.

### 최종 값은 맞아져도 후속 처리는 누락될 수 있다

클라이언트의 상자 열림 처리가 다음과 같다고 하자.

```cpp
void AChest::OnRep_IsOpen()
{
    if (!bIsOpen || !bIsUnlocked)
    {
        return;
    }

    PlayOpenAnimation();
}
```

#3을 받으면 `bIsOpen`은 `true`가 되고 `OnRep_IsOpen()`이 실행된다. 하지만 `bIsUnlocked`는 아직 `false`이므로 함수가 그대로 종료된다.

이후 보완 업데이트를 받으면 `bIsUnlocked`도 `true`가 된다. 그렇다고 `OnRep_IsOpen()`이 다시 호출되지는 않는다. 이 함수는 `bIsOpen`의 RepNotify이지, 다른 프로퍼티의 변경까지 감시하는 함수가 아니기 때문이다.

따라서 두 문제를 구분해야 한다.

- 프로퍼티 값은 복제가 정상적으로 이어지면 누락된 상태가 보완되어 서버의 최종 값과 맞아진다.
- 게임 코드의 후속 처리는 그렇지 않다. 이전 값을 보고 건너뛴 애니메이션은 자동으로 다시 실행되지 않는다.

이 예시에서 영구적으로 누락된 것은 `bIsUnlocked`의 최종 값이 아니라, 상자를 여는 애니메이션 처리다.

두 값이 모두 필요하다면 어느 값이 나중에 도착해도 다시 확인하도록 만들 수 있다.

```cpp
// bIsUnlocked도 ReplicatedUsing = OnRep_IsUnlocked로 변경한다.
// 두 OnRep는 UFUNCTION으로 선언한다.

void AChest::OnRep_IsUnlocked()
{
    TryPlayOpenAnimation();
}

void AChest::OnRep_IsOpen()
{
    TryPlayOpenAnimation();
}

void AChest::TryPlayOpenAnimation()
{
    if (bOpenAnimationPlayed || !bIsOpen || !bIsUnlocked)
    {
        return;
    }

    bOpenAnimationPlayed = true;
    PlayOpenAnimation();
}
```

`bOpenAnimationPlayed`는 `false`로 초기화한 클라이언트 로컬 플래그다. 여러 콜백에서 재확인하더라도 애니메이션을 중복 재생하지 않게 한다.

이 코드는 한 번만 열리는 상자를 가정한다. 다시 닫히는 상자나 늦게 접속한 플레이어에게는, 과거의 열림 연출을 재생할지 현재 열린 모습만 표시할지도 별도로 정해야 한다.

게임 규칙상 열쇠 확보, 잠금 해제, 열림이 항상 하나의 진행 단계라면, 여러 불리언 대신 `Locked`, `Unlocked`, `Open` 같은 하나의 상태 값으로 표현하는 설계도 고려할 수 있다.

## OnRep의 실행 순서도 따로 생각해야 한다

앞의 예시는 값이 서로 다른 시점에 도착하는 문제였다. 값이 같은 업데이트로 도착해도, 서로 다른 프로퍼티의 `OnRep` 호출 순서에는 의존하면 안 된다.

무기 종류와 탄약 수를 각각 복제한다고 하자.

```cpp
void AMyCharacter::OnRep_WeaponId()
{
    // 새 무기 UI를 만들며 탄약 표시는 0으로 초기화한다.
    RecreateWeaponUI(WeaponId);
}

void AMyCharacter::OnRep_Ammo()
{
    SetAmmoText(Ammo);
}
```

이 코드는 다음 순서를 기대한다.

```text
무기 UI 생성 → 탄약 표시 갱신
```

반대로 실행되면 탄약 표시가 다시 초기화된다.

```text
기존 UI의 탄약 갱신 → 새 무기 UI 생성 → 탄약 표시가 0
```

문제는 한 콜백이 만든 UI를 다른 콜백이 사용한다는 것이다. 변수 선언 순서나 서버의 대입 순서를 바꿔도 이 의존성이 해결되지는 않는다.

### 함께 사용하는 값은 구조체로 묶는다

무기 종류와 탄약을 하나의 상태로 묶으면 하나의 `OnRep`에서 처리할 수 있다.

```cpp
USTRUCT()
struct FWeaponState
{
    GENERATED_BODY()

    UPROPERTY()
    FName WeaponId = NAME_None;

    UPROPERTY()
    int32 Ammo = 0;
};

// AMyCharacter 클래스 내부
UPROPERTY(ReplicatedUsing = OnRep_WeaponState)
FWeaponState WeaponState;

UFUNCTION()
void OnRep_WeaponState();
```

```cpp
void AMyCharacter::OnRep_WeaponState()
{
    // 무기가 달라졌을 때만 UI를 교체한다.
    EnsureWeaponUI(WeaponState.WeaponId);

    SetAmmoText(WeaponState.Ammo);
}
```

이제 처리 순서는 함수 안에 직접 적혀 있다.

```text
OnRep_WeaponState()
    └─ 무기 UI 준비
        └─ 탄약 표시 갱신
```

구조체가 네트워크의 도착 순서를 바꾼 것은 아니다. 두 콜백 사이에 있던 순서 의존성을 하나의 함수 안으로 옮긴 것이다.

구조체로 묶었다고 모든 중간 변경이 전달되거나, 여러 업데이트에 걸친 값들이 자동으로 하나의 완성된 상태가 되는 것은 아니다. 여기서 해결한 것은 콜백의 처리 순서다.

### 변수를 분리해 둬야 한다면 PostRepNotifies를 사용한다

무기와 탄약을 별도 프로퍼티로 유지하면서 UI 갱신만 모으고 싶을 수도 있다. 이때는 각 `OnRep`에서 갱신이 필요하다는 표시만 남기고, `PostRepNotifies()`에서 실제 작업을 수행할 수 있다.

```cpp
// AMyCharacter 클래스 내부
bool bWeaponUIDirty = false;

virtual void PostRepNotifies() override;
```

```cpp
void AMyCharacter::OnRep_WeaponId()
{
    bWeaponUIDirty = true;
}

void AMyCharacter::OnRep_Ammo()
{
    bWeaponUIDirty = true;
}

void AMyCharacter::PostRepNotifies()
{
    Super::PostRepNotifies();

    if (!bWeaponUIDirty)
    {
        return;
    }

    bWeaponUIDirty = false;

    EnsureWeaponUI(WeaponId);
    SetAmmoText(Ammo);
}
```

`PostRepNotifies()`는 해당 객체의 `OnRep` 호출들이 끝난 뒤 실행된다.

```text
OnRep_Ammo()      ─┐
                  ├─ 갱신 필요 표시
OnRep_WeaponId()  ─┘
                          ↓
                  PostRepNotifies()
                          ↓
                  무기 UI 준비 → 탄약 표시
```

두 `OnRep` 중 무엇이 먼저 실행돼도 실제 UI 처리 순서는 같아진다.

다만 이 함수가 손실된 업데이트나 다른 액터의 수신까지 기다려주는 것은 아니다. 무기 종류만 도착했다면, 그 시점에 가지고 있는 탄약 값으로 갱신한다.

`PostRepNotifies()`가 구조체보다 일반적으로 더 권장되는 방식은 아니다. 공식 문서는 여러 값을 함께 다뤄야 할 때 구조체로 묶는 방법을 권장하고, 별도 `OnRep`의 후속 처리를 모으는 방법으로 `PostRepNotifies()`를 소개한다.

- 하나의 상태로 함께 사용하는 값이라면 구조체와 하나의 `OnRep`로 묶는다.
- 프로퍼티는 분리하되 공통 후속 처리를 모아야 한다면 `PostRepNotifies()`를 사용한다.

## Reliable RPC는 어디까지 순서를 보장할까

RPC는 원격 컴퓨터에서 함수를 실행하도록 요청하는 기능이다. 프로퍼티가 현재 상태를 전달한다면, RPC는 함수 호출을 전달한다.

| 종류 | 패킷이 손실되었을 때 |
|---|---|
| Reliable | 수신 확인을 받을 때까지 재전송한다 |
| Unreliable | 손실된 호출을 재전송하지 않는다 |

같은 액터에서 같은 수신 대상으로 보내는 Reliable RPC끼리는 호출 순서가 유지된다.

```cpp
// 모두 Reliable Client RPC라고 가정한다.
Weapon->ClientStartReload();
Weapon->ClientFinishReload();
```

클라이언트에서는 장전 시작을 처리한 뒤 장전 완료를 처리한다. 재전송 때문에 늦어질 수는 있어도 완료가 시작보다 먼저 실행되지는 않는다.

같은 액터에 속한 복제 서브오브젝트의 Reliable RPC도 이 순서 범위에 포함된다. 반면 서로 다른 액터 사이에는 보장이 없다.

```cpp
ActorA->ClientReliableFirst();
ActorB->ClientReliableSecond();
ActorA->ClientReliableThird();
```

세 호출이 같은 클라이언트로 전달되더라도 보장되는 것은 `First → Third`다.

```text
가능: First → Second → Third
가능: Second → First → Third
가능: First → Third → Second
```

`Reliable`은 여러 액터의 호출을 하나의 전역 순서로 정렬하는 설정이 아니다.

### Reliable과 Unreliable을 섞으면

같은 액터에서 다음 순서로 호출했다고 하자.

```text
R1: Reliable
U2: Unreliable Unicast
R3: Reliable

호출 순서: R1 → U2 → R3
```

`U2`의 패킷이 손실되면 해당 호출은 실행되지 않는다.

```text
실행 순서: R1 → R3
```

`R1`의 패킷이 손실되어 재전송을 기다리는 동안 `U2`가 먼저 실행될 수도 있다.

```text
실행 순서: U2 → R1 → R3
```

Reliable끼리의 `R1 → R3`는 유지되지만, 세 호출 전체의 순서는 보장되지 않는다.

### Multicast도 호출 순서대로 처리되는 것은 아니다

Unicast RPC는 특정 원격 대상으로, Multicast RPC는 여러 대상으로 호출을 전달한다. 같은 액터에서 같은 수신 대상에 전달되는 Reliable RPC끼리라면 Multicast와 Unicast를 섞어도 순서가 유지된다.

Unreliable Multicast는 다르다. 기본 전송 정책에서는 잠시 대기했다가 뒤에 묶여 전송되므로, 먼저 호출했어도 다른 RPC보다 나중에 실행될 수 있다.

```text
호출: Unreliable Multicast → Reliable Client RPC
실행: Reliable Client RPC → Unreliable Multicast
```

전송 정책을 `ForceSend`나 `ForceQueue`로 바꾸면 전송 시점도 달라진다. 이 설정은 각각 지원되는 조건에서 전송을 앞당기거나 뒤로 미루는 데 사용되며, 서로 다른 액터나 프로퍼티까지 포함한 전체 순서를 보장해주지는 않는다.

## 프로퍼티를 바꾼 뒤 RPC를 호출하면

다음 코드에서는 탄약을 채운 뒤 장전 완료를 알린다.

```cpp
// 서버
Ammo = 30;
ClientReliableReloadFinished();
```

클라이언트의 `ClientReliableReloadFinished()`가 실행될 때도 `Ammo`가 반드시 `30`일까?

그렇지 않다. RPC의 Reliable 설정은 앞서 변경한 프로퍼티의 적용까지 기다리게 하지 않는다.

일반적인 대기하지 않는 RPC와 프로퍼티 업데이트가 함께 전송되는 경우에는 RPC가 먼저 처리될 수 있다. 기본 Unreliable Multicast처럼 뒤로 대기하는 RPC는 프로퍼티보다 뒤에 처리되는 경우도 있다. 패킷 손실까지 고려하면 이 순서를 게임 로직의 고정된 전제로 사용해서는 안 된다.

### 현재 상태를 맞추려면 프로퍼티와 OnRep를 사용한다

남은 탄약, 현재 무기, 장전 중인지 여부는 현재 상태다. 나중에 접속하거나 액터가 뒤늦게 보이더라도 현재 상태에 맞는 표시가 필요하다.

예를 들어 지속되는 장전 표시를 제어하려면 `bIsReloading` 같은 상태를 복제하고, `OnRep`에서 표시를 켜거나 끌 수 있다.

다만 클라이언트의 `OnRep`가 게임 규칙상의 장전을 완료하는 것은 아니다. 서버가 장전 완료를 판단하고 탄약과 장전 상태를 변경하면, 클라이언트가 그 결과를 받아 표현한다.

또한 탄약이 증가했다는 이유만으로 장전 완료라고 판단하면 탄약 획득 등 다른 변경과 혼동할 수 있다. 장전 상태 자체가 필요하다면 이를 명시적으로 표현하는 편이 낫다.

### 그 순간의 연출을 전달하려면 RPC를 고려한다

장전 완료음이나 짧은 불꽃처럼, 그 순간의 수신자에게만 보여줄 연출은 RPC가 적합할 수 있다. 뒤늦게 접속한 플레이어에게 과거의 완료음을 재생할 필요는 없기 때문이다.

```cpp
// 소유 클라이언트에게만 전달하는 일회성 연출 예시다.
UFUNCTION(Client, Unreliable)
void ClientPlayReloadFinishedEffect(int32 AmmoAtCompletion);
```

```cpp
// 서버가 장전 완료를 처리하는 코드
Ammo = 30;
bIsReloading = false;

ClientPlayReloadFinishedEffect(Ammo);
```

RPC 구현에서는 이벤트 당시의 값인 `AmmoAtCompletion`을 사용한다. 복제 프로퍼티 `Ammo`가 먼저 갱신됐다고 가정할 필요가 없다. 이후 발사가 진행됐다면 이 인자는 현재 탄약 수와 다를 수 있다.

이 예시의 연출은 가끔 누락돼도 게임 상태에는 영향이 없다는 전제로 `Unreliable`을 사용했다. 반드시 전달해야 하는 호출이라면 Reliable을 검토하되, 잦은 호출의 재전송 비용도 고려해야 한다.

| 필요한 동작 | 선택 기준 |
|---|---|
| 현재 탄약 표시 | 프로퍼티와 `OnRep` |
| 장전 중인 동안 유지되는 표시 | 장전 상태를 복제하고 `OnRep`로 갱신 |
| 순간적인 장전 완료음 | RPC 고려 |
| 장전 완료에 따른 실제 탄약 지급 | 서버의 게임 로직에서 처리 |

이펙트라도 불타는 상태처럼 지속되고, 늦게 도착한 클라이언트에도 보여야 한다면 프로퍼티 기반 처리가 적합하다. 반대로 모든 일회성 사건을 받아야 한다면, 중간 변경을 건너뛸 수 있는 `OnRep`만으로 처리해서는 안 된다.

## 다른 액터의 준비 여부는 직접 확인한다

캐릭터와 인벤토리가 별도 액터라면, 캐릭터의 인벤토리 참조와 인벤토리의 데이터가 어느 순서로 준비될지 가정해서는 안 된다.

간단한 예로, 인벤토리의 슬롯 수를 받아 UI를 만든다고 하자. 이 예시에서는 슬롯 수가 `INDEX_NONE`이면 아직 준비되지 않았고, `0` 이상이면 준비된 것으로 정한다. 빈 인벤토리도 유효하므로 `0`을 미준비 상태로 취급하지 않는다.

```cpp
// AInventory 클래스의 공개 멤버 발췌
DECLARE_MULTICAST_DELEGATE(FOnSlotsChanged);
FOnSlotsChanged OnSlotsChanged;

UPROPERTY(ReplicatedUsing = OnRep_NumSlots)
int32 NumSlots = INDEX_NONE;

UFUNCTION()
void OnRep_NumSlots();
```

```cpp
void AInventory::OnRep_NumSlots()
{
    OnSlotsChanged.Broadcast();
}
```

여기서 `OnSlotsChanged`는 클라이언트 안에서 객체 사이에 알림을 전달하는 C++ 델리게이트다. 앞에서 다룬 네트워크 Multicast RPC와는 다르다.

캐릭터는 인벤토리 참조를 받으면 데이터 변경 알림을 구독한다.

```cpp
// AMyCharacter 클래스 내부
UPROPERTY(ReplicatedUsing = OnRep_Inventory)
TObjectPtr<AInventory> Inventory = nullptr;

TWeakObjectPtr<AInventory> ObservedInventory;

UFUNCTION()
void OnRep_Inventory();

void TryRefreshInventoryUI();
```

```cpp
void AMyCharacter::OnRep_Inventory()
{
    if (AInventory* Previous = ObservedInventory.Get())
    {
        Previous->OnSlotsChanged.RemoveAll(this);
    }

    ObservedInventory = Inventory.Get();

    if (IsValid(Inventory.Get()))
    {
        Inventory->OnSlotsChanged.AddUObject(
            this,
            &AMyCharacter::TryRefreshInventoryUI);
    }

    // 알림이 이미 발생했을 수도 있으므로 지금 상태도 확인한다.
    TryRefreshInventoryUI();
}

void AMyCharacter::TryRefreshInventoryUI()
{
    if (!IsValid(Inventory.Get()) || Inventory->NumSlots == INDEX_NONE)
    {
        HideInventoryUI();
        return;
    }

    // 기존 UI를 현재 슬롯 수에 맞춘다.
    // 반복 호출해도 위젯이 중복 생성되지 않게 구현한다.
    RefreshInventorySlots(Inventory->NumSlots);
}
```

이 코드는 두 순서 모두 처리한다.

```text
참조가 먼저 도착한 경우

OnRep_Inventory()
    → 알림 구독
    → 현재 상태 확인: NumSlots == INDEX_NONE
    → 대기
        ↓
OnRep_NumSlots()
    → 알림 발생
    → TryRefreshInventoryUI()
    → UI 표시
```

```text
슬롯 수가 먼저 도착한 경우

OnRep_NumSlots()
    → 알림 발생: 아직 구독자가 없음
        ↓
OnRep_Inventory()
    → 알림 구독
    → 현재 상태 확인: NumSlots >= 0
    → 즉시 UI 표시
```

핵심은 나중의 변경을 구독하면서, 이미 준비된 상태도 즉시 확인하는 것이다. 알림만 기다리면 두 번째 경우에서 놓친 알림을 계속 기다리게 된다.

`HideInventoryUI()`와 `RefreshInventorySlots()`는 프로젝트에서 구현할 UI 함수다. 실제 코드에서는 캐릭터의 `EndPlay()`에서도 구독을 정리하고, UI 자체의 준비가 늦어질 수 있다면 UI 준비 시점에도 `TryRefreshInventoryUI()`를 호출해야 한다.

이 예시는 슬롯 수 하나의 준비 여부만 다룬다. 아이템 목록 등 여러 데이터가 모두 필요하다면 `NumSlots` 하나를 전체 인벤토리의 준비 완료 신호로 사용해서는 안 된다.

Replication Graph의 의존성 설정을 사용하더라도 수신 순서를 가정하는 대신, 이러한 준비 조건을 확인해야 한다.

## 지연과 패킷 손실이 있는 환경에서 테스트한다

네트워크 지연이나 손실이 거의 없는 로컬 환경에서는 잘못된 순서 가정이 드러나지 않을 수 있다.

Network Emulation으로 지연과 패킷 손실을 적용하면, 필요한 데이터가 늦게 도착하거나 Unreliable RPC가 누락되는 상황을 테스트할 수 있다.

이때는 서버와 클라이언트의 최종 값이 일치하는지만 확인해서는 안 된다. 데이터가 준비되기 전에 실행된 코드가 잘못된 UI를 표시하지 않는지, 준비될 때까지 미뤄둔 처리가 데이터 수신 후 다시 실행되는지도 확인해야 한다. 여러 콜백에서 같은 처리를 재시도한다면 UI나 연출이 중복으로 생성되지 않는지도 함께 살펴본다.

## 참고 자료

- [Replicated Object Execution Order](https://dev.epicgames.com/documentation/en-us/unreal-engine/replicated-object-execution-order-in-unreal-engine)
- [Network Emulation](https://dev.epicgames.com/documentation/unreal-engine/using-network-emulation-in-unreal-engine)
