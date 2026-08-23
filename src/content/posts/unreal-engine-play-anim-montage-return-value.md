---
published: 2021-05-18
updated: 2026-08-24
author: Jihoon Jeon
title: 'UE4 ACharacter::PlayAnimMontage 반환값이 실제 재생시간과 다른 이유'
description: UE 4.26의 ACharacter::PlayAnimMontage가 Play Rate와 Rate Scale이 반영되지 않은 원본 몽타주 길이를 반환하던 이유와 안전한 대안을 설명합니다.
category: Unreal Engine
tags:
  - unreal-engine
  - ue4
  - cpp
  - animation
  - montage
sourceLink: "https://velog.io/@hon454/ACharacterPlayAnimMontage의-반환값에-대하여"
---

> 이 글은 2021년 5월의 **Unreal Engine 4.26** 동작을 기준으로 검토해 옮겼다. UE 4.27.2 소스에서도 같은 호출 경로가 유지되는 것을 함께 확인했다.

Character에서 Animation Montage를 재생할 때 흔히 `ACharacter::PlayAnimMontage`를 사용한다.

```cpp
/**
 * Play Animation Montage on the character mesh.
 * Returns the length of the animation montage in seconds,
 * or 0.f if failed to play.
 */
UFUNCTION(BlueprintCallable, Category = Animation)
virtual float PlayAnimMontage(
    class UAnimMontage* AnimMontage,
    float InPlayRate = 1.f,
    FName StartSectionName = NAME_None);
```

문제는 반환값을 “현재 설정으로 실제 재생되는 시간”이라고 해석하기 쉽다는 점이다. UE 4.26에서 이 함수는 `InPlayRate`, Montage의 `RateScale`, `StartSectionName`이 반영된 남은 시간을 반환하지 않았다.

## 내부에서는 기본 반환 형식을 사용한다

당시 구현은 `UAnimInstance::Montage_Play`를 다음처럼 호출했다.

```cpp
float ACharacter::PlayAnimMontage(
    UAnimMontage* AnimMontage,
    float InPlayRate,
    FName StartSectionName)
{
    UAnimInstance* AnimInstance = Mesh ? Mesh->GetAnimInstance() : nullptr;

    if (AnimMontage && AnimInstance)
    {
        const float Duration = AnimInstance->Montage_Play(
            AnimMontage,
            InPlayRate);

        if (Duration > 0.f)
        {
            if (StartSectionName != NAME_None)
            {
                AnimInstance->Montage_JumpToSection(
                    StartSectionName,
                    AnimMontage);
            }

            return Duration;
        }
    }

    return 0.f;
}
```

`Montage_Play`의 세 번째 인자는 다음 enum이며, 기본값은 `MontageLength`였다.

```cpp
enum class EMontagePlayReturnType : uint8
{
    MontageLength,
    Duration,
};
```

따라서 `ACharacter::PlayAnimMontage`는 `MontageToPlay->SequenceLength`를 반환한다. 재생 속도를 바꾸더라도 반환값은 원본 전체 길이다.

```cpp
// UE 4.27.2의 Montage_Play 반환 부분을 단순화한 형태
return ReturnValueType == EMontagePlayReturnType::MontageLength
    ? MontageLength
    : MontageLength / (InPlayRate * MontageToPlay->RateScale);
```

`StartSectionName`도 반환값을 계산한 뒤 `Montage_JumpToSection`으로 적용되므로, 특정 Section에서 시작해도 반환값은 전체 Montage 길이 그대로다.

## 속도가 반영된 전체 길이가 필요할 때

Character wrapper 대신 Anim Instance의 함수를 직접 호출하고 반환 형식을 `Duration`으로 지정할 수 있다.

```cpp
UAnimInstance* AnimInstance = GetMesh()->GetAnimInstance();
if (!AnimInstance || !AnimMontage)
{
    return 0.f;
}

const float Duration = AnimInstance->Montage_Play(
    AnimMontage,
    InPlayRate,
    EMontagePlayReturnType::Duration);

if (Duration > 0.f && StartSectionName != NAME_None)
{
    AnimInstance->Montage_JumpToSection(
        StartSectionName,
        AnimMontage);
}
```

이 `Duration`도 **전체 Montage를 처음부터 재생한다고 가정한 속도 보정 길이**다. 시작 Section, Section 연결 관계, 반복 Section, runtime의 `Montage_SetNextSection`, blend out과 interruption까지 포함한 실제 종료 시점은 표현하지 못한다.

## 원문의 수식은 제한적으로만 맞는다

원문에서는 다음 계산을 제안했다.

```cpp
const float Duration =
    PlayAnimMontage(AnimMontage, InPlayRate) /
    (InPlayRate * AnimMontage->RateScale);
```

UE 4.26의 `Montage_Play(..., EMontagePlayReturnType::Duration)` 내부 계산과 같은 형태이므로, **전체 Montage가 순서대로 한 번 재생되는 단순한 경우**에는 맞는다. 그러나 다음 상황에서는 실제 종료시간이 아니다.

- `StartSectionName`으로 중간에서 시작한다.
- Section이 반복되거나 runtime에 다음 Section을 바꾼다.
- 다른 Montage가 재생을 중단한다.
- blend out이나 notify 시점을 기다리는 것이 목적이다.
- 0 또는 비정상적인 Play Rate를 전달한다.

게임플레이 로직을 정확한 종료 시점에 연결하려는 목적이라면 float 길이로 timer를 예약하기보다 Montage 종료 delegate, Blueprint의 `On Completed`·`On Blend Out`·`On Interrupted`, Anim Notify를 사용한다. 길이 반환값은 재생 성공 여부와 단순한 예상 시간을 얻는 용도로 제한하는 편이 안전하다.

## 참고 자료

- [Epic Games: Using Animation Montages — UE 4.27](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-animation-montages?application_version=4.27)
- [Epic Games: Editing an Animation Montage — UE 4.27](https://dev.epicgames.com/documentation/en-us/unreal-engine/editing-an-animation-montage?application_version=4.27)
