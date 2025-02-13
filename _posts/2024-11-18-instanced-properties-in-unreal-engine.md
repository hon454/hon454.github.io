---
title: Instanced Properties in Unreal Engine
date: 2024-11-18 11:55:00 +0900
categories: [Unreal, C++]
tags: [unreal, c++, cpp, instanced, instanced-struct, instanced-object, instanced-properties]
typora-root-url: .

---

# Instanced Properties

인스턴스화된 속성(Instanced Properties)을 사용하면 참조된 UObject 또는 인스턴스화된 구조체의 속성에 엑세스 할 수 있으므로 아래 예시와 같이 동적인 데이터를 구성 할 수 있다. 이는 정보나 작업의 모듈식 조각을 추가하는 좋은 방법이 될 수 있다. 또한, 인스턴스턴스화된 속성에는 또 다른 분기 구조를 가진 인스턴스화된 속성을 참조 할 수 있다.

![instanced-properties-demo](/../assets/img/2024-11-18-unreal-instanced-property/instanced-properties-demo.gif)

> `Instanced Properties`의 선언은 **C++에서만 가능하다는 점을 유의**해야 한다.
{: .prompt-warning }

> 모든 객체는 부모 객체와 함께 직렬화 되며, 부모 객체가 로드되면 완전히 로드 된다.
{: .prompt-info }



## Object Vs Struct

`Instanced Properties`는 `UObject` 또는 `Instaced Struct`의 두 가지 유형으로 제공된다. `UObject`는 더 높은 수준의 유연성과 제어성을 제공하지만 더 큰 성능 오버헤드(특히 메모리)가 한다. 그래서 `Instanced Struct`는 단순한 데이터를 저장하는데 훨씬 좋다. `UObject`의 기능이 꼭 필요한 경우가 아니라면 `Instanced Struct`를 사용하는 것이 권장 된다.

`Instanced Struct`를 사용하는 경우에는 UFUNCTION 매크로를 사용할 수 없기 때문(Class, IInterface, Interface 스코프에서만 사용 가능)에 함수 지정자를 활용할 수 없고, UFUNCTION 함수와 연계 되는 일부 프로퍼티 지정자들을 사용 할 수 없는 단점이 있다.



## Instanced UObject

먼저 `Instanced Object`를 클래스를 생성해야 한다.  UCLASS 지정자 `EditInlineNew`, `DefaultToInstanced` 를 추가 해야 한다.

```cpp
// CollapseCategories를 통해 UObject내 다른 변수들을 그룹화 되도록 한다.
// Display Name에 설정 된 이름으로 에디터의 드랍다운에 표시 되는 이름이 변경된다.
UCLASS(EditInlineNew, DefaultToInstanced, CollapseCategories, DisplayName = "Single Item")
class DATAINUNREAL_API UInstancedInventoryItem : public UObject
{
	GENERATED_BODY()

public:
	UPROPERTY(EditAnywhere, BlueprintReadWrite)
    TSoftClassPtr<class UInventoryItemObject> Item;
};
```

다른 객체에서 해당 클래스의 포인터 변수를 선언하고 UPROEPRTY 지정자 `Instanced`를 추가한다.

```cpp
UPROPERTY(EditAnywhere, BlueprintReadOnly, Instanced)
TObjectPtr<class UInstancedInventoryItem> InstancedItemData;

// 배열을 지원한다.
UPROPERTY(EditAnywhere, BlueprintReadOnly, Instanced)
TArray<TObjectPtr<class UInstancedInventoryItem>> InstancedItemArray;
```

`Instanced Object`는 상속을 지원한다. 

```cpp
// 상속을 지원한다.
UCLASS(DisplayName = "Stack of Items")
class DATAINUNREAL_API UChildInstancedInventoryItem : public UInstancedInventoryItem
{
	GENERATED_BODY()

public:
	// 추가적인 프로퍼티를 선언할 수 있다.
	UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 AmountOfItem;
};
```

> `Instanced Object`는 부모와 함께 직렬화되므로 데이터 테이블과 호환되지 않는다. 대신 `Instanced Struct`를 사용해야 한다.
{: .prompt-warning }



## Instanced Struct (UE5)

`Instanced Struct`는 언리얼 엔진 5에 추가 된 `Instanced Object`의 대안이다. 주요 장점은 `Instanced Object` 보다 낮은 메모리 오버헤드를 가지기에 데이터를 저장하는 용도로만 `Instanced Object`를 활용하는 경우 `Instanced Struct`가 더 올바른 선택이 될 수 있다. 

> `InstancedStruct`는 최상위 구조체를 개발자가 구축 하기 때문에 선언하는 변수 만큼 메모리 크기를 가지지만, UObject를 상속한 클래스를 기반으로 하는 `Instanced Object`는 기본적으로 UObject의 클래스 크기 인 48Byte의 메모리 오버헤드를 각 `Instanced Object` 마다 가지게 된다.
{: .prompt-info }

또한, `Instanced Struct`는 `Instanced Object`를 사용하지 못하는 데이터 테이블에서 사용 할 수 있기 때문에 데이터 테이블에 절실히 필요했던 유연성을 제공할 수 있다.

![enable-struct-utils-plugin](/../assets/img/2024-11-18-unreal-instanced-struct/enable-struct-utils-plugin.png)

`Instanced Struct`를 사용하려면 `Struct Utils` 플러그인을 활성화 되어 있어야 한다. 또한, 사용하려는 모듈의 `{모듈이름}.Build.cs` 파일의 `PublicDependencyModuleNames`에 `"StructUtils"`를 추가 해줘야 한다.

`Instanced Struct`는 일반적인 USTRUCT를 활용해 구현 할 수 있다. 

```cpp
USTRUCT(BlueprintType)
struct FMyStructParent
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere)
	int32 ParentProperty;
};

USTRUCT(BlueprintType)
struct FMyStructChild : public FMyStructParent
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere)
	float ChildProperty;
};
```

다른 객체에서 이를 사용하기 위해서는 `FInstancedStruct` 타입으로 변수를 선언하고, UPROPERTY 메타 지정자 `BaseStruct = {F를 제외한 구조체명}` 혹은 `BaseStruct = /Script/{구조체가 속한 모듈명}.{F를 제외한 구조체명}`을 추가하면 된다.

```cpp
// 가장 기본 적인 선언 방식. BaseStruct 메타 지정자를 통해 최상위 구조체를 설정한다.
UPROPERTY(EditAnywhere, meta = (BaseStruct = "MyStructParent"))
FInstancedStruct InstancedStruct;

// 여러 모듈이나 플러그인에서 동일한 이름의 구조체를 정의할 경우, 명시적 경로 지정을 활용한다.
UPROPERTY(EditAnywhere, meta = (BaseStruct = "/Script/MyModuele/MyStructParent"))
FInstancedStruct InstancedStruct;

// ShowTreeView 메타 지정자를 추가할 경우, 옵션이 리스트 뷰에서 트리 뷰로 변경된다.
UPROPERTY(EditAnywhere, meta = (BaseStruct = "MyStructParent", ShowTreeView))
FInstancedStruct InstancedStruct;

// ExcludeBaseStruct 메타 지정자를 통해 최상위 구조체가 선택 가능 하지 않게 할 수 있다.
UPROPERTY(EditAnywhere, meta = (BaseStruct = "MyStructParent", ExcludeBaseStruct))
FInstancedStruct InstancedStruct;

// TArray, TMap을 지원한다.
UPROPERTY(EditAnywhere, meta = (BaseStruct = "MyStructParent"))
TArray<FInstancedStruct> InstancedStruct;

// 탬플릿을 버전의 TInstancedStruct를 활용할 경우, BaseStruct 메타 지정자를 생략 할 수 있다.
UPROPERTY(EditAnywhere)
TInstancedStruct<FMyStructParent> InstancedStruct;

// 하지만, 버그인지 TInstancedStruct를 TArray나 TMap과 같이 사용 하는 경우에는 생략이 지원되지 않는다. (UE5.3 기준)
UPROPERTY(EditAnywhere, meta = (BaseStruct = "MyStructParent", ExcludeBaseStruct))
TArray<TInstancedStruct<FMyStructParent>> InstancedStruct;
```

![instanced-struct-example](/../assets/img/2024-11-18-unreal-instanced-property/instanced-struct-example.png)

> `Instanced Struct` 사용 시, `EditCondition` 프로퍼티 지정자가 작동하지 않는다. (UE5.3 기준)
{: .prompt-warning }



`InstancedStruct` 변수를 사용하는 방법은 다음과 같다. 

```cpp
// GetScriptStruct() 함수를 통해 변수에 할당 된 구조체 인스턴스의 타입을 확인 할 수 있다.
bool bIsChild = InstancedStruct.GetScriptStruct() == FMyStructChild::StaticStruct())

// 할당 된 구조체 인스턴스의 const 레퍼런스를 가져온다. 호환 되는 타입이 아닐 경우 assert가 발생한다.
const FMyStructChild& Ref = InstancedStruct.Get<FMyStructChild>();

// 할당 된 구조체 인스턴스의 const 포인터를 가져온다. 호환 되는 타입이 아닐 경우 nullptr를 반환한다.
const FMyStructChild* Ptr = InstancedStruct.GetPtr<FMyStructChild>();

// 할당 된 구조체 인스턴스의 레퍼런스를 가져온다. 호환 되는 타입이 아닐 경우 assert가 발생한다.
FMyStructChild* MutableRef = InstancedStruct.GetMutable<FMyStructChild>();

// 할당 된 구조체 인스턴스의 포인터를 가져온다. 호환 되는 타입이 아닐 경우 nullptr를 반환한다.
FMyStructChild* MutablePtr = InstancedStruct.GetMutablePtr<FMyStructChild>();
```

> 더 자세한 사용법은 엔진 코드의 `FInstancedStruct`나 `TInstancedStruct`를 참고 하면 된다.
{: .prompt-info}



## Instanced Properties Considerations

- 구조체나 UObject에 선택적 파라미터를 추가하는 데 매우 유용하다.
- 참조 체인이나 트리 계층 구조를 만드는 데 매우 유용할 수 있다.
- `Instanced Object`의 경우, Owner 객체가 로드 되는 경우 완전히 로드 된다.



## 참고자료

[Working with Data in Unreal Engine - Unreal Dev Community](https://dev.epicgames.com/community/learning/tutorials/Gp9j/working-with-data-in-unreal-engine-data-tables-data-assets-uproperty-specifiers-and-more)

[InstancedStruct - DataConfig Book](https://slowburn.dev/dataconfig/Extra/InstancedStruct.html#instancedstruct)

[GenericItemization - mattyman174](https://github.com/mattyman174/GenericItemization#instanced-structs)

[Polymorphic Serialization In Unreal Engine](https://slowburn.dev/blog/polymorphic-serialization-in-unreal-engine/)
