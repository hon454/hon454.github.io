---
title: Anim Meta Data in Unreal Engine
date: 2024-11-20 00:52:00 +0900
categories: [Unreal, C++]
tags: [unreal, c++, cpp, animation, anim-meta-data]
typora-root-url: .

---

# Anim Meta Data

- WIP..



## Usage in runtime

```c++
/** Get available Metadata within the animation asset
 */
const TArray<UAnimMetaData*>& GetMetaData() const { return MetaData; }

/** Returns the first metadata of the specified class */
UFUNCTION(BlueprintCallable, Category = "Animation")
ENGINE_API UAnimMetaData* FindMetaDataByClass(const TSubclassOf<UAnimMetaData> MetaDataClass) const;

/** Templatized version of FindMetaDataByClass that handles casting for you */
template<class T>
T* FindMetaDataByClass() const
{
    static_assert(TPointerIsConvertibleFromTo<T, const UAnimMetaData>::Value, "'T' template parameter to FindMetaDataByClass must be derived from UAnimMetaData");

    return (T*)FindMetaDataByClass(T::StaticClass());
}

ENGINE_API void AddMetaData(UAnimMetaData* MetaDataInstance); 
void EmptyMetaData() { MetaData.Empty(); }	
ENGINE_API void RemoveMetaData(UAnimMetaData* MetaDataInstance);
ENGINE_API void RemoveMetaData(TArrayView<UAnimMetaData*> MetaDataInstances);
```
{: file="AnimationAsset.h"}

블루프린트에 노출 되는 함수는 `FindMetaDataByClass` 하나 뿐이며 이를 통해 추정컨데 애님 메타데이터 사용 시 동일한 타입의 애님 메타데이터는 애니메이션 에셋 마다 하나씩만 설정하는 것을 지향하는 것으로 보인다.



## Usage in editor

```c++
// MetaData

/** Creates and Adds an instance of the specified MetaData Class to the given Animation Asset */
UFUNCTION(BlueprintCallable, Category = "AnimationBlueprintLibrary|MetaData")
static void AddMetaData(UAnimationAsset* AnimationAsset, TSubclassOf<UAnimMetaData> MetaDataClass, UAnimMetaData*& MetaDataInstance);

/** Adds an instance of the specified MetaData Class to the given Animation Asset (requires MetaDataObject's outer to be the Animation Asset) */
UFUNCTION(BlueprintCallable, Category = "AnimationBlueprintLibrary|MetaData")
static void AddMetaDataObject(UAnimationAsset* AnimationAsset, UAnimMetaData* MetaDataObject);

/** Removes all Meta Data from the given Animation Asset */
UFUNCTION(BlueprintCallable, Category = "AnimationBlueprintLibrary|MetaData")
static void RemoveAllMetaData(UAnimationAsset* AnimationAsset);

/** Removes the specified Meta Data Instance from the given Animation Asset */
UFUNCTION(BlueprintCallable, Category = "AnimationBlueprintLibrary|MetaData")
static void RemoveMetaData(UAnimationAsset* AnimationAsset, UAnimMetaData* MetaDataObject);

/** Removes all Meta Data Instance of the specified Class from the given Animation Asset */
UFUNCTION(BlueprintCallable, Category = "AnimationBlueprintLibrary|MetaData")
static void RemoveMetaDataOfClass(UAnimationAsset* AnimationAsset, TSubclassOf<UAnimMetaData> MetaDataClass);

/** Retrieves all Meta Data Instances from the given Animation Asset */
UFUNCTION(BlueprintPure, Category = "AnimationBlueprintLibrary|MetaData")
static void GetMetaData(const UAnimationAsset* AnimationAsset, TArray<UAnimMetaData*>& MetaData);

/** Retrieves all Meta Data Instances from the given Animation Asset */
UFUNCTION(BlueprintPure, Category = "AnimationBlueprintLibrary|MetaData")
static void GetMetaDataOfClass(const UAnimationAsset* AnimationAsset, TSubclassOf<UAnimMetaData> MetaDataClass, TArray<UAnimMetaData*>& MetaDataOfClass);

/** Checks whether or not the given Animation Asset contains Meta Data Instance of the specified Meta Data Class */
UFUNCTION(BlueprintPure, Category = "AnimationBlueprintLibrary|MetaData")
static bool ContainsMetaDataOfClass(const UAnimationAsset* AnimationAsset, TSubclassOf<UAnimMetaData> MetaDataClass);
```
{: file="AnimationBlueprintLibrary.h"}

에디터 유틸리티 위젯(Editor Utility Widget)이나 애니메이션 모디파이어(Animation Modifier)에서 `AnimationBlueprintLibrary.h` 내부 함수들을 활용하여 애니메이션 에셋의 애님 메타데이터를 수정하거나 애님 메타데이터를 기반으로 다른 데이터나 에셋들을 구축하거나 수정 할 수 있다.



## [Metadata Curves](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-curves-in-unreal-engine#metadatacurves)

![meta3](/../assets/img/2024-11-20-anim-meta-data-in-unreal-engine/meta3.png)

애님 메타데이터의 대안으로 메타데이터 커브(Metadata Curves)를 사용할 수도 있다. 메타데이터 커브는 쉽게 생각하면 키프레임 없이 애니메이션의 모든 프레임에서 값이 1.0으로 설정 된 커브라고 보면된다. 이를 이용하여 마치 커브의 존재 유무로 불리언 타입의 메타데이터를 가지도록 하는 방법이다. 애니메이션 블루프린트의 `AnimGraph`에서 `Anim Instance` 기준으로 메타데이터를 사용 하는 경우에는 이 경우를 더 보편적으로 활용하는 것으로 보인다.



## 참고자료

[UE5 How to hold data in Animation Assets (Anim Meta Data)](https://www.youtube.com/watch?v=Mmz3-Oz9z20)
