---
title: Firefly 글 암호화
published: 1970-01-02
description: 글 암호화 기능을 보여 주는 비밀번호 보호 예시 글입니다.
tags: [예시, 비밀번호 보호]
category: 글 예시
password: "123456"
passwordHint: "예시 글 비밀번호: 123456"
slug: encrypted-demo
---

## 글의 잠금이 해제되었습니다!

이 내용을 볼 수 있다면 올바른 비밀번호를 입력해 글이 정상적으로 복호화된 것입니다.

### 기능 설명

- **빌드 시 암호화**: 글 내용은 빌드할 때 AES-256-GCM 알고리즘으로 암호화되며 페이지 소스에 평문이 포함되지 않습니다.
- **클라이언트 복호화**: 방문자가 올바른 비밀번호를 입력하면 브라우저가 Web Crypto API를 통해 로컬에서 복호화합니다.
- **세션 캐시**: 같은 브라우저 세션에서는 비밀번호가 `sessionStorage`에 저장되어 새로 고쳐도 다시 입력할 필요가 없습니다.
- **브라우저 종료 시 만료**: 브라우저를 닫으면 캐시가 지워져 다음 방문 때 비밀번호를 다시 입력해야 합니다.

> 비밀번호는 `123456`이며 테스트 용도로만 사용합니다.

## 이미지

![Firefly](./images/1.avif)

## GitHub 저장소 카드

::github{repo="CuteLeaf/Firefly"}

## 알림 상자

> [!NOTE] NOTE
> 사용자가 참고해야 할 정보를 강조합니다.

> [!TIP] TIP
> 작업을 더 원활하게 진행하는 데 도움이 되는 선택 정보입니다.

> [!NOTE] 사용자 지정 제목
> 사용자 지정 제목이 있는 예시입니다.

## 수식
### 인라인 수식 (Inline)

오일러 공식 $e^{i\pi} + 1 = 0$은 수학에서 가장 아름다운 공식 가운데 하나입니다.

질량-에너지 등가식 $E = mc^2$도 널리 알려져 있습니다.

### 블록 수식 (Block)

블록 수식은 `$$` 기호 두 쌍으로 감싸며 가운데 정렬됩니다.

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

### 화학 방정식 (Chemical Equations)

$$
\ce{CH4 + 2O2 -> CO2 + 2H2O}
$$

## 코드 블록
#### 일반 구문 강조

```js
console.log('이 코드는 구문 강조가 적용됩니다!')
```

#### ANSI 이스케이프 시퀀스 렌더링

```ansi
ANSI colors:
- Regular: [31mRed[0m [32mGreen[0m [33mYellow[0m [34mBlue[0m [35mMagenta[0m [36mCyan[0m
- Bold:    [1;31mRed[0m [1;32mGreen[0m [1;33mYellow[0m [1;34mBlue[0m [1;35mMagenta[0m [1;36mCyan[0m
- Dimmed:  [2;31mRed[0m [2;32mGreen[0m [2;33mYellow[0m [2;34mBlue[0m [2;35mMagenta[0m [2;36mCyan[0m

256 colors (showing colors 160-177):
[38;5;160m160 [38;5;161m161 [38;5;162m162 [38;5;163m163 [38;5;164m164 [38;5;165m165[0m
[38;5;166m166 [38;5;167m167 [38;5;168m168 [38;5;169m169 [38;5;170m170 [38;5;171m171[0m
[38;5;172m172 [38;5;173m173 [38;5;174m174 [38;5;175m175 [38;5;176m176 [38;5;177m177[0m

Full RGB colors:
[38;2;34;139;34mForestGreen - RGB(34, 139, 34)[0m

Text formatting: [1mBold[0m [2mDimmed[0m [3mItalic[0m [4mUnderline[0m
```


## 흐름도

```mermaid
graph TD
    A[시작] --> B{조건 확인}
    B -->|예| C[처리 단계 1]
    B -->|아니요| D[처리 단계 2]
    C --> E[하위 프로세스]
    D --> E
    subgraph E [하위 프로세스 상세]
        E1[하위 단계 1] --> E2[하위 단계 2]
        E2 --> E3[하위 단계 3]
    end
    E --> F{다른 결정}
    F -->|선택 1| G[결과 1]
    F -->|선택 2| H[결과 2]
    F -->|선택 3| I[결과 3]
    G --> J[끝]
    H --> J
    I --> J
```
