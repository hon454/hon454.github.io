---
title: C++의 형변환(캐스팅, Casting)에 대하여
date: 2024-01-28 21:51:00 +0900
categories: [C++]
tags: [c++, Cpp, casting]
typora-root-url: .
---



## 캐스팅의 종류

#### 암시적(Implicit) 캐스팅

- 컴파일러가 형을 변환해 줌

  - 단, 형 변환이 허용되고
  - 프로그래머가 명시적으로 형 변환을 안 할 경우

  

#### 명시적(Explicit) 캐스팅

- 프로그래머가 형 변환을 위한 코드를 직접 작성
- C++ 캐스팅
  1. `static_cast`
  2. `const_cast`
  3. `dynamic_cast` (C++98, 모던 C++)
  4. `reinterpret_cast`



## C vs C++

```cpp
double a = 1.354;
int b = (int)a;
```

### C 스타일 캐스팅

- C++ 스타일 **4개의 캐스팅 중 하나를 수행**
  - 뭔가 명확하지 못함
- 명백한 실수를 컴파일러가 캐치하지 못함
  - C++ 캐스팅이 이런 문제를 해결
  - 기계어 수준에서는 C/C++를 구분하지 않기에 실제 실행 시 차이는 없음



## C++ 캐스팅 4종

### static_cast

1. 값
   - 두 숫자 형 간의 변환
     - 값을 유지 (단, 반올림 오차는 제외)
     - **이진수 표기가 달라질 수 있음** (ex. float 형을 int 형으로 변환하는 경우)
2. 개체 포인터
   - 변수형 체크 후 베이스 클래스를 파생 클래스로 변환
   - 컴파일 시에만 형 체크 가능
   - 실행 도중 여전히 크래시가 날 수 있음



### reinterpret_cast

- 연관 없는 두 포인터 형 사이의 변환을 허용
  - `Cat*` <-> `House*`
  - `char*` <-> `int*`
- 포인터와 포인터 아닌 변수 사이의 형 변환을 허용
  - `Cat*` <-> `unsigned int`
- **이진수 표기가 달라지지 않음**
  - A형의 이진수 표기를 그냥 B형인 것처럼 해석



### const_cast

- `const_cast`로 형을 바꿀 수는 없음
- `const` 또는 `volatile` 키워드를 제거할 때 사용
- 포인터 형에 대해서 사용할 때만 권장
  - 값 형은 복사가 가능하기 때문
- 일반적으로 `const_cast`를 코드에서 사용하려고 한다면 무언가 잘못 된 것
  - 써드파티 라이브러리가 const를 제대로 사용하지 않을 때 호환을 위해 사용



### dynamic_cast

- 실행 중에 형을 판단
- 포인터 또는 참조 형을 캐스팅할 때만 쓸 수 있음
- 호환 되지 않는 자식형으로 캐스팅하려 하면 NULL을 반환
  - 따라서, `dynamic_cast`가 `static_cast`보다 안전
- 그러나 이걸 쓰려면 컴파일 중에 RTTI(실시간 타입정보, Real-Time Type Information)을 활성화 해야 함
  - C++ 프로젝트에서 RTTI가 성능 하락을 일으키기 때문에 끄는 것이 일반적
  - RTTI가 비활성 되어 있다면 `dyamic_cast`는 `static_cast`와 동일하게 동작



## 캐스팅 지침

1. 기본적으로 `staitc_cast`를 쓸 것
   - `reinterpret_cast<Cat*>` 대신 `static_cast<Cat*>
     - 만약 `Cat`이 `Animal`이 아니라면 컴파일러가 에러를 뱉
2. 필요한 경우 `reinterpret_cast`를 쓸것
   - 포인터와 비포인터 사이의 변환
     - 이걸 정말 해야 할 때가 있음 (ex. 포인터 주소의 저장)
   - 서로 연관이 없는 포인터 사이의 변환은 그 데이터형이 맞다고 **정말 확신**할 때만 할 것
3. 내가 변경 권한이 없는 외부 라이브러리를 호출할 때만 `const_cast`를 쓸 것