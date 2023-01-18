---
title: 언리얼 엔진 블루프린트의 'Construction Script' 사용에 관하여
date: 2023-01-19 03:13:00 +0900
categories: [Unreal, Blueprint]
tags: [unreal, blueprint]
typora-root-url: ./..
---

## C++에서 OnConstruction 메소드로 구현가능

```cpp
virtual void OnConstruction(const FTransform& Transform) {}
```



## 'Construction Script'의 호출 타이밍

- 액터가 스폰 될 때
  - 런타임의 경우, 맵에 배치되지 않고 동적으로 스폰되는 액터만 호출한다.
- 에디터에서 액터가 움직 일 때 (C++의 PostEditMove가 호출 될 때)
  - 이 경우 오브젝트가 움직이는 동안 여러번 호출 된다.
- 에기터에서 액터의 속성이 변경된 경우 (C++의 PostEditChangeProperty가 호출 될 때)



## 남용 할 경우 발생하는 문제

### 1. 너무 잦은 호출로 인한 성능 문제

다양한 타이밍에 호출되며 특히 액터를 움직일 때 여러번 호출 되기 때문에 **Construction Script** 내부 로직이 무겁거나 액터의 개수가 많은 경우에는 에디터가 멈추는 현상이 발생 할 수 있다.



### 2. 순환 호출 문제

A액터에 **ChildActorComponent**가 있어 관계 된 다른 B액터가 있는 경우, A액터가 **Construction Script**에서 B액터의 프로퍼티를 변경하면 A액터와 B액터 사이에 서로의 **Construction Script**에 의한 순환 호출이 발생하여 에디터가 크래시가 발생 할 수 있다.



## 사용 시 권장사항

- **필요하지 않은 경우 사용하지 않기.** 자동화 작업을 통해 액터를 변경시켜야 하는 경우에만 사용하기
- **'Construction Script'를 최대한 간결하게 유지할 것.** 자동화에 필요한 내용만 담아야 하며, 이것을 생성자나 BeginPlay와 같이 사용하면 안된다.
- **'Construction Script'에서 다른 액터(자식 액터 포함)의 속성을 변경하지 않기.** 이를 어길 경우 'Construction Script'가 순환 호출 되어 에디터의 크래시를 유발한다.



## 참고자료

[UE4 – Be careful with the Construction Script](https://isaratech.com/ue4-be-careful-with-the-construction-script/)

