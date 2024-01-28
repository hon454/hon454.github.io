---
title: 언리얼 엔진의 C++ Cast<T> 함수는 어떻게 작동하는가?
date: 2024-01-29 00:43:00 +0900
categories: [Unreal, C++]
tags: [unreal, c++, cpp, casting]
typora-root-url: .
---

언리얼 엔진 C++에서 `Cast<T>`를 사용하면 오브젝트 유형을 안전하게 동적 형변환을 수행 할 수 있다. 기본 C++에서 제공하는 `dynamic_cast<T*>`가 있음에도 왜 언리얼 C++에서는 `Cast<T>`를 사용할까? 

언리얼 엔진 C++에서는 `dynamic_cast<T*>`를 사용하지 않아도 안전하게 업/다운 캐스팅을 수행 할 수 있는 `Cast<T>` 함수를 제공하는데 구현이 다음과 같다. 

> 아래 소스 코드는 언리얼 엔진 5 기준이다. 언리얼 엔진 4의 `Cast<T>` 구현은 언리얼 엔진 5와 다르다

```cpp
// Dynamically cast an object type-safely.
template <typename To, typename From>
FORCEINLINE To* Cast(From* Src)
{
    // 두 원본 개체의 타입과 목표 타입이 불완전한 타입이 아닌지 체크
	static_assert(sizeof(From) > 0 && sizeof(To) > 0, "Attempting to cast between incomplete types");

    // 원본 개체가 nullptr가 아닌지 체크
	if (Src)
	{
        // 원본 개체 타입이 인터페이스인 경우
		if constexpr (TIsIInterface<From>::Value)
		{
            // 
			if (UObject* Obj = Src->_getUObject())
			{
				if constexpr (TIsIInterface<To>::Value)
				{
					return (To*)Obj->GetInterfaceAddress(To::UClassType::StaticClass());
				}
				else
				{
					if (Obj->IsA<To>())
					{
						return (To*)Obj;
					}
				}
			}
		}
        // UE_USE_CAST_FLAGS는 에디터가 아닌 경우 True를 반환한다.
        // 캐스트 플래그가 활성화 되어 있고, 목표 타입에 대한 
		else if constexpr (UE_USE_CAST_FLAGS && TCastFlags<To>::Value != CASTCLASS_None)
		{
			if (((const UObject*)Src)->GetClass()->HasAnyCastFlag(TCastFlags<To>::Value))
			{
				return (To*)Src;
			}
		}
        // 기본 캐스팅 로직
		else
		{
            // 원본 개체 타입이 UObject나 UInterface가 아닌 경우, assert 발생
			static_assert(std::is_base_of_v<UObject, From>, "Attempting to use Cast<> on a type that is not a UObject or an Interface");
			
            // 목표 개채 타입이 인터페이스인 경우
			if constexpr (TIsIInterface<To>::Value)
			{
				return (To*)((UObject*)Src)->GetInterfaceAddress(To::UClassType::StaticClass());
			}
			else
			{                
				if (((const UObject*)Src)->IsA<To>())
				{
					return (To*)Src;
				}
			}
		}
	}

	// 위 조건들이 충족되지 않거나 캐스트가 실패하는 경우, nullptr 반환
	return nullptr;
}
```



아래는 `Class.h`에 `ClassCastFlags `선언 된 코드 영역이다.

```cpp
/** Cast flags used to accelerate dynamic_cast<T*> on objects of this type for common T */
EClassCastFlags ClassCastFlags;
```

주석에 나와 있듯이 일반적인 타입에 대한 형변환을 가속하기 위해 사용한다는 것을 유추할 수 있다.



## `IsA<T>` 함수

```cpp
// ObjectPtr.h
COREUOBJECT_API bool IsA(const UClass* SomeBase) const;

template <typename T>
FORCEINLINE bool IsA() const
{
    return IsA(T::StaticClass());
}

// ObjectPtr.cpp
bool FObjectPtr::IsA(const UClass* SomeBase) const
{
	checkfSlow(SomeBase, TEXT("IsA(NULL) cannot yield meaningful results"));

	if (const UClass* ThisClass = GetClass())
	{
		return ThisClass->IsChildOf(SomeBase);
	}

	return false;
}
```

이 함수는 UObject가 특정 클래스의 자손 클래스 타입인지 판별하는 함수이다. 내부적으로는 UClass의 IsChildof 함수를 통해 구현되고 있다.



### `IsChildof` 함수

```cpp
	/** Returns true if this struct either is class T, or is a child of class T. This will not crash on null structs */
	template<class T>
	bool IsChildOf() const
	{
		return IsChildOf(T::StaticClass());
	}

	/** Returns true if this struct either is SomeBase, or is a child of SomeBase. This will not crash on null structs */
#if USTRUCT_FAST_ISCHILDOF_COMPARE_WITH_OUTERWALK || USTRUCT_FAST_ISCHILDOF_IMPL == USTRUCT_ISCHILDOF_OUTERWALK
	COREUOBJECT_API bool IsChildOf( const UStruct* SomeBase ) const;
#else
	bool IsChildOf(const UStruct* SomeBase) const
	{
		return (SomeBase ? IsChildOfUsingStructArray(*SomeBase) : false);
	}
#endif
```

`Class.h` 파일의 `IsChildof`의 선언부를 살펴보면 전처리지시자에 의해 `USTRUCT_FAST_ISCHILDOF_COMPARE_WITH_OUTERWALK` 와 

`USTRUCT_FAST_ISCHILDOF_IMPL`에 따라 구현부가 분리되어 있는 것을 확인 할 수 있다.

```cpp
// Enumeration of different methods of determining ustruct relationships.
#define USTRUCT_ISCHILDOF_OUTERWALK  1 // walks the super struct chain                                     - original IsA behavior
#define USTRUCT_ISCHILDOF_STRUCTARRAY 2 // stores an array of parents per struct and uses this to compare - faster than 1 and thread-safe but can have issues with BP reinstancing and hot reload

// USTRUCT_FAST_ISCHILDOF_IMPL sets which implementation of IsChildOf to use.
#if UE_EDITOR
	// On editor, we use the outerwalk implementation because BP reinstancing and hot reload
	// mess up the struct array
	#define USTRUCT_FAST_ISCHILDOF_IMPL USTRUCT_ISCHILDOF_OUTERWALK
#else
	#define USTRUCT_FAST_ISCHILDOF_IMPL USTRUCT_ISCHILDOF_STRUCTARRAY
#endif

// USTRUCT_FAST_ISCHILDOF_COMPARE_WITH_OUTERWALK, if set, does a checked comparison of the current implementation against the outer walk - used for testing.
#define USTRUCT_FAST_ISCHILDOF_COMPARE_WITH_OUTERWALK 0
```

`ObjectMacros.h`에 선언된 매크로를 살펴보면 `USTRUCT_FAST_ISCHILDOF_COMPARE_WITH_OUTERWALK`는 일반적으로 0이기에 신경쓰지 않아도 되고, 에디터 실행인지 여부에 따라 `USTRUCT_FAST_ISCHILDOF_IMPL`가 `USTRUCT_ISCHILDOF_OUTERWALK`와 `USTRUCT_ISCHILDOF_STRUCTARRAY`로 설정되는 것을 확인 할 수 있다.

즉, 에디터 실행인 경우 에는 아래의 구현이 사용 되며

```cpp
/**
* @return	true if this object is of the specified type.
*/
#if USTRUCT_FAST_ISCHILDOF_COMPARE_WITH_OUTERWALK || USTRUCT_FAST_ISCHILDOF_IMPL == USTRUCT_ISCHILDOF_OUTERWALK
bool UStruct::IsChildOf( const UStruct* SomeBase ) const
{
	// If you're looking at this check it is due to calling IsChildOf with a this nullptr. *MAKE* sure you do not call this function
	// with a this nullptr. It is undefined behavior, and some compilers, clang13 have started to optimize out this == nullptr checks.
	check(this);

	if (SomeBase == nullptr)
	{
		return false;
	}

	bool bOldResult = false;
	for ( const UStruct* TempStruct=this; TempStruct; TempStruct=TempStruct->GetSuperStruct() )
	{
		if ( TempStruct == SomeBase )
		{
			bOldResult = true;
			break;
		}
	}

#if USTRUCT_FAST_ISCHILDOF_IMPL == USTRUCT_ISCHILDOF_STRUCTARRAY
	const bool bNewResult = IsChildOfUsingStructArray(*SomeBase);
#endif

#if USTRUCT_FAST_ISCHILDOF_COMPARE_WITH_OUTERWALK
	ensureMsgf(bOldResult == bNewResult, TEXT("New cast code failed"));
#endif

	return bOldResult;
}
#endif
```

에디터 실행이 아닌 경우에는 아래의 구현이 사용된다

```cpp
bool IsChildOf(const UStruct* SomeBase) const
{
    return (SomeBase ? IsChildOfUsingStructArray(*SomeBase) : false);
}
```



### `IsA<T>` 함수의 시간복잡도





## 왜 Cast 함수를 사용해야 하는가?

- `dynamic_cast`를 사용할 경우 RTTI를 활성 해야 하기 때문에 성능 저하의 요인이 된다
- 



##  ExactCast<T> 함수

```cpp
template< class T >
FORCEINLINE T* ExactCast( UObject* Src )
{
	return Src && (Src->GetClass() == T::StaticClass()) ? (T*)Src : nullptr;
}
```

- 위 함수는 원본 개체의 클래스 타입이 정확히 목표 클래스 타입인 경우에만 캐스팅하여 반환한다.
- 엄격한 타입 일치를 요구하지만 `Cast<T>`보다 더 빠른 성능을 가진다.
  - 클래스 타입 비교를 한번만 수행하므로 O(1)의 시간복잡도를 가진다.
- 전달 되는 오브젝트의 타입을 미리 알고 있을 경우에는 유용하게 사용할 수도 있다.



## 참고자료

https://peterleontev.com/blog/unreal_cast/

https://forums.unrealengine.com/t/is-casting-expensive/13589/31

https://devshovelinglife.tistory.com/714
