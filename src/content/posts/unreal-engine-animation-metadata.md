---
published: 2024-11-20
author: Jihoon Jeon
title: 'Unreal Engine 애니메이션 메타데이터: UAnimMetaData와 Metadata Curve'
description: UAnimMetaData를 애니메이션 에셋에 저장해 런타임에서 조회하고 에디터 자동화로 관리하며, Metadata Curve·Notify·Animation Attribute·Asset Metadata와 구분하는 기준을 정리합니다.
category: Unreal Engine
tags:
  - unreal-engine
  - animation
  - anim-metadata
  - animation-curves
  - editor-scripting
  - cpp
---

애니메이션에 부가 데이터를 붙일 때 가장 중요한 설계 질문은 **어떤 범위와 시점에서 어떤 데이터를 소비할 것인가**이다.

Unreal에는 이름이 비슷한 metadata system이 여러 개 있다.

| system                     | 저장 단위                                                | 적합한 데이터                      | runtime/평가 경계                           |
| -------------------------- | -------------------------------------------------------- | ---------------------------------- | ------------------------------------------- |
| `UAnimMetaData`            | Animation Asset 또는 Montage section의 UObject subobject | 구조화된 asset-level 설정          | Asset이 load된 뒤 game-thread code에서 조회 |
| Metadata Curve             | source animation의 constant float curve                  | pose와 함께 blend되는 tag-like 값  | AnimGraph 평가 결과에서 curve 값 조회       |
| Anim Notify / Notify State | timeline의 순간 또는 구간                                | 특정 시점의 event와 state window   | animation playback 중 event 발생            |
| Animation Attribute        | animation sample의 typed, keyed data                     | bone/시간에 연결된 custom 값       | pose evaluation과 blending pipeline         |
| Asset Metadata             | Asset Registry/editor key-value                          | 검색, import, content pipeline tag | runtime gameplay 직접 조회용이 아님         |

“애니메이션 전체에 root-motion 권장 속도 1.15를 붙인다”면 `UAnimMetaData`, “현재 blend된 pose가 traversal animation 성격을 얼마나 갖는지 AnimGraph에서 읽는다”면 Metadata Curve가 더 자연스럽다. 공격 판정이 시작되는 정확한 구간이라면 Notify State가 맞다.

## `UAnimMetaData`는 Animation Asset에 저장되는 UObject다

`UAnimationAsset`은 `UAnimMetaData` instance 배열을 보관한다. metadata object는 animation asset의 subobject로 저장되므로 class property를 사용해 구조화된 data를 만들 수 있다.

주로 아래 용도로 쓴다.

- locomotion clip의 gameplay category와 권장 play rate
- 특정 animation을 처리하는 custom pipeline option
- export/import source 정보와 project-specific validation flag
- animation selection system이 asset load 뒤 읽을 작은 configuration

Asset metadata를 매 frame 찾기보다 animation을 선택하거나 state를 초기화하는 시점에 읽고, 자주 쓰는 primitive 값을 consumer에 cache하는 편이 명확하다.

## Project 전용 metadata class 만들기

```cpp
// TraversalAnimMetaData.h
#pragma once

#include "Animation/AnimMetaData.h"
#include "GameplayTagContainer.h"
#include "TraversalAnimMetaData.generated.h"

UCLASS(BlueprintType, Blueprintable, EditInlineNew)
class MYGAME_API UTraversalAnimMetaData final : public UAnimMetaData
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Traversal")
    bool bSupportsRootMotion = false;

    UPROPERTY(
        EditAnywhere,
        BlueprintReadOnly,
        Category = "Traversal",
        meta = (ClampMin = "0.0"))
    float RecommendedPlayRate = 1.0f;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Traversal")
    FGameplayTag TraversalType;
};
```

`FGameplayTag`를 사용하므로 이 예제 module은 `GameplayTags` dependency도 선언한다. Public header에 type이 value로 노출되므로 Public dependency다.

```csharp
PublicDependencyModuleNames.AddRange(
    new[]
    {
        "Core",
        "CoreUObject",
        "Engine",
        "GameplayTags",
    }
);
```

단순 bool과 float만 필요하면 GameplayTags 부분은 제거할 수 있다.

## Runtime에서 null-safe하게 조회하기

```cpp
// TraversalAnimMetaData.cpp
#include "TraversalAnimMetaData.h"

#include "Animation/AnimationAsset.h"

const UTraversalAnimMetaData* FindTraversalMetaData(
    const UAnimationAsset* AnimationAsset)
{
    return AnimationAsset
        ? AnimationAsset->FindMetaDataByClass<UTraversalAnimMetaData>()
        : nullptr;
}
```

사용자는 metadata가 없는 Asset을 정상 입력으로 처리해야 한다.

```cpp
float GetRecommendedPlayRate(const UAnimationAsset* AnimationAsset)
{
    const UTraversalAnimMetaData* MetaData =
        FindTraversalMetaData(AnimationAsset);

    return MetaData
        ? FMath::Max(0.0f, MetaData->RecommendedPlayRate)
        : 1.0f;
}
```

[`UAnimMetaData`](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAnimMetaData)와 [`UAnimationAsset`](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAnimationAsset)은 runtime `Engine` module API다. 그러나 object 접근이 가능하다고 모든 thread에서 안전한 것은 아니다.

### AnimGraph 평가 중 직접 찾지 않기

`UAnimationAsset::FindMetaDataByClass`를 animation worker thread에서 안전하게 호출할 수 있다고 가정하지 않는다. UObject metadata를 AnimGraph 평가 중 매번 직접 찾기보다 경계를 아래처럼 분리한다.

1. game thread의 asset 선택·initialization 단계에서 metadata를 읽는다.
2. 필요한 bool, float, enum/tag를 animation instance/proxy의 thread-safe state로 복사한다.
3. worker-thread evaluation에서는 cache된 value만 사용한다.

이는 성능 최적화보다 object access와 animation evaluation의 thread boundary를 명시하는 설계다.

## 같은 class의 metadata는 여러 개일 수 있다

Blueprint의 `FindMetaDataByClass`가 단일 object를 반환하더라도 저장 구조와 editor API가 class별 singleton을 보장하는 것은 아니다.

- `UAnimationAsset::MetaData`는 array다.
- `FindMetaDataByClass`는 일치하는 **첫 instance**를 반환한다.
- editor의 `GetMetaDataOfClass`는 일치하는 instance **array**를 반환한다.

duplicate도 표현할 수 있다. 첫 항목만 쓰는 gameplay code가 duplicate 입력을 받으면 어떤 object가 선택되는지 content ordering에 의존한다.

Project가 class별 singleton을 원한다면 명시적으로 정책을 만든다.

- Editor add tool에서 기존 instance를 먼저 검색해 추가를 거부한다.
- Data Validation에서 같은 class count가 1을 넘으면 error로 보고한다.
- duplicate를 모두 허용한다면 first-match API 대신 array를 순회하고 ordering/merge rule을 정의한다.

“API 이름이 단수라서 하나일 것”이라는 추론을 serialization invariant로 사용하지 않는다.

## Editor에서 추가·삭제·검증하기

`UAnimationBlueprintLibrary`는 editor automation API다. Editor Utility Widget, Animation Modifier, commandlet/editor module에서 metadata를 일괄 추가·삭제·검사할 수 있다.

runtime module이 아니라 별도 Editor module에 dependency를 둔다.

```csharp
PrivateDependencyModuleNames.AddRange(
    new[]
    {
        "Core",
        "CoreUObject",
        "Engine",
        "AnimationBlueprintLibrary",
        "MyGame", // metadata class를 선언한 runtime module 이름으로 교체
    }
);
```

주로 아래 operation을 쓴다.

| 목적                              | Editor API                                |
| --------------------------------- | ----------------------------------------- |
| class를 지정해 instance 생성·추가 | `AddMetaData`                             |
| 이미 만든 object 추가             | `AddMetaDataObject`                       |
| 전체 조회                         | `GetMetaData`                             |
| class별 전체 조회                 | `GetMetaDataOfClass`                      |
| class 존재 확인                   | `ContainsMetaDataOfClass`                 |
| instance 또는 class별 제거        | `RemoveMetaData`, `RemoveMetaDataOfClass` |
| 전체 제거                         | `RemoveAllMetaData`                       |

직접 작성한 C++ editor tool의 기본 흐름은 이렇다.

```cpp
// Editor module only
#include "AnimationBlueprintLibrary.h"
#include "Animation/AnimationAsset.h"
#include "TraversalAnimMetaData.h"

UAnimMetaData* AddTraversalMetaDataIfMissing(
    UAnimationAsset* AnimationAsset)
{
    if (!AnimationAsset)
    {
        return nullptr;
    }

    if (UTraversalAnimMetaData* Existing =
            AnimationAsset
                ->FindMetaDataByClass<UTraversalAnimMetaData>())
    {
        return Existing;
    }

    AnimationAsset->Modify();

    UAnimMetaData* Added = nullptr;
    UAnimationBlueprintLibrary::AddMetaData(
        AnimationAsset,
        UTraversalAnimMetaData::StaticClass(),
        Added);

    if (Added)
    {
        AnimationAsset->MarkPackageDirty();
    }

    return Added;
}
```

실제 batch tool에서는 다음도 처리한다.

- `FScopedTransaction`과 undo/redo
- duplicate class 정책
- read-only/source-control checkout
- dirty package 목록과 명시적인 save
- 실패 log와 idempotent 재실행
- Animation Modifier를 반복 적용할 때 versioning과 reapply 정책

`MarkPackageDirty`는 file save가 아니다. Editor Utility나 commandlet이 변경을 디스크에 기록할지 별도로 결정해야 한다.

## Metadata Curve는 constant source curve다

[Animation Curves 문서](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-curves-in-unreal-engine#metadatacurves)의 Metadata Curve는 source animation에서 모든 key가 `1.0`인 read-only curve type이다. curve가 없으면 해당 source에는 flag가 없고, 있으면 source clip은 1.0을 제공한다.

![Animation Asset Editor의 Metadata Curve track](./images/unreal-engine-animation-metadata/metadata-curve-track.avif)

_Metadata Curve의 constant track 예시다. UI 배치는 engine version에 따라 달라질 수 있다._

하지만 최종 AnimGraph 값이 항상 정확히 0 또는 1이라고 가정하면 안 된다. animation pose와 curve가 blend되면 weight와 curve blend option에 따라 중간값이나 override 결과가 나올 수 있다.

```cpp
const float TraversalWeight =
    AnimInstance->GetCurveValue(TEXT("Traversal"));

const bool bTraversalActive = TraversalWeight >= 0.5f;
```

`0.5f`는 engine의 보편 규칙이 아니라 이 gameplay system이 정한 threshold다. 연속 weight가 유용하면 bool로 바꾸지 않고 그대로 사용한다. curve가 없을 때의 fallback도 gameplay code에서 명시한다.

아래 상황에는 Metadata Curve가 잘 맞는다.

- state machine transition이나 AnimGraph branch가 현재 pose mix의 성격을 읽음
- animation layer가 특정 curve flag를 downstream graph로 전달함
- event 시점이 아니라 clip 전체에 걸친 tag-like float가 필요함

반대로 gameplay에서 구조화된 여러 field를 읽거나 Asset을 평가하지 않은 상태에서도 설정이 필요하면 `UAnimMetaData`가 낫다.

## Notify, Attribute, Asset Metadata와 구분하기

### Anim Notify와 Notify State

특정 frame의 footstep, projectile spawn, combo window처럼 **언제**가 핵심이면 Notify를 사용한다. clip 전체에 붙은 bool metadata를 Notify 하나로 흉내 내면 seek, loop, blend, skipped event 정책이 불필요하게 복잡해진다.

### Animation Attribute

FBX custom attribute나 project-defined typed value를 bone·keyframe과 연결하고 pose evaluation/blending에 참여시키려면 Animation Attribute가 맞다. Asset-level UObject config와 목적이 다르다.

### 일반 Asset Metadata

[Asset Metadata](https://dev.epicgames.com/documentation/en-us/unreal-engine/asset-metadata-in-unreal-engine)는 import pipeline, Asset Registry 검색, editor scripting을 위한 key-value tag다. 문서는 cooked gameplay runtime에서 직접 접근하는 data store로 사용하지 말라고 구분한다. gameplay가 읽어야 하는 animation-specific 구조화 data라면 `UAnimMetaData`, curve, Data Asset 등을 사용한다.

## Montage section metadata

Animation Asset 전체가 아니라 Montage section별로 다른 설정이 필요할 수도 있다. `FCompositeSection`은 section metadata 배열을 가질 수 있다.

예를 들어 한 Montage 안의 `Windup`, `Attack`, `Recover` section에 서로 다른 traversal/interrupt rule을 붙일 수 있다. 이 경우도 같은 class duplicate와 first-match policy를 section 단위로 정의해야 한다. Section index/name이 유효한지 확인하고, Montage가 수정될 때 metadata mapping validation을 수행한다.

Section metadata와 Anim Notify State도 구분한다.

- Section 전체의 구조화된 설정: section `UAnimMetaData`
- timeline 안 정확한 활성 구간과 event: Notify State

## Runtime과 Editor 경계 요약

| 작업                                       |     Runtime module |          Editor module |
| ------------------------------------------ | -----------------: | ---------------------: |
| `FindMetaDataByClass`로 읽기               |               가능 |                   가능 |
| metadata object의 field 사용               |               가능 |                   가능 |
| `UAnimationBlueprintLibrary` batch 수정    |               불가 |                   가능 |
| Editor Utility Widget / Animation Modifier |               불가 |                   가능 |
| transaction, package dirty, save           | gameplay 책임 아님 | tool이 명시적으로 관리 |
| `GetCurveValue`로 평가 curve 읽기          |               가능 |     preview에서도 가능 |

Editor API header를 runtime module의 Public header에 include하거나 Shipping dependency에 넣지 않는다. Runtime에서 필요한 data와 editor authoring tool을 module로 분리한다.

## 검증 체크리스트

- metadata가 Asset 전체인지 Montage section 단위인지 결정했는가?
- 같은 metadata class를 여러 개 허용할지 정책을 정했는가?
- first-match API에 duplicate ordering을 맡기지 않았는가?
- runtime lookup에서 null과 invalid field range를 처리했는가?
- worker-thread AnimGraph에서 UObject metadata를 직접 조회하지 않는가?
- Editor automation을 Editor module에 격리했는가?
- transaction, source-control, dirty package, save를 처리했는가?
- Metadata Curve의 final 값이 blend될 수 있음을 고려했는가?
- bool threshold 또는 continuous weight policy를 명시했는가?
- time event라면 Notify, keyed typed data라면 Attribute를 검토했는가?
- 일반 Asset Metadata를 runtime gameplay data로 사용하지 않았는가?
- cook과 packaged build에서 필요한 metadata class/module이 포함되는가?

## 참고 자료

- [Epic Games: `UAnimMetaData`](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAnimMetaData)
- [Epic Games: `UAnimationAsset`](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAnimationAsset)
- [Epic Games: Find Meta Data by Class](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Animation/FindMetaDatabyClass)
- [Epic Games: `UAnimationBlueprintLibrary`](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Editor/AnimationBlueprintLibrary/UAnimationBlueprintLibrary)
- [Epic Games: Add Meta Data](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/AnimationBlueprintLibrary/MetaData/AddMetaData)
- [Epic Games: Get Meta Data Of Class](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/AnimationBlueprintLibrary/MetaData/GetMetaDataOfClass)
- [Epic Games: Animation Modifiers](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-modifiers-in-unreal-engine)
- [Epic Games: Animation Curves and Metadata Curves](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-curves-in-unreal-engine#metadatacurves)
- [Epic Games: `UAnimInstance::GetCurveValue`](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAnimInstance/GetCurveValue)
- [Epic Games: Animation Blend Nodes](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprint-blend-nodes-in-unreal-engine)
- [Epic Games: `UAnimMontage`](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAnimMontage)
- [Epic Games: `FCompositeSection`](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/FCompositeSection)
- [Epic Games: Animation Attributes](https://dev.epicgames.com/documentation/en-us/unreal-engine/fbx-attributes-in-unreal-engine)
- [Epic Games: Animation Notifies](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-notifies-in-unreal-engine)
- [Epic Games: Asset Metadata](https://dev.epicgames.com/documentation/en-us/unreal-engine/asset-metadata-in-unreal-engine)
- [UE5 How to hold data in Animation Assets (Anim Meta Data)](https://www.youtube.com/watch?v=Mmz3-Oz9z20)
