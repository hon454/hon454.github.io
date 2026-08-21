---
title: KaTeX 수식 예시
published: 1970-01-02
description: 인라인 수식, 블록 수식, 복잡한 수학 기호를 포함해 Firefly 테마의 KaTeX 지원을 보여 줍니다.
tags: [KaTeX, Math, 예시]
category: 글 예시
image: api
slug: katex-math-example
---

이 글은 [Firefly](https://github.com/CuteLeaf/Firefly) 테마의 KaTeX 수식 렌더링 기능을 보여 줍니다.

## 인라인 수식 (Inline)

인라인 수식은 `$` 기호 한 쌍으로 감쌉니다.

예를 들어 오일러 공식 $e^{i\pi} + 1 = 0$은 수학에서 가장 아름다운 공식 가운데 하나입니다.

질량-에너지 등가식 $E = mc^2$도 널리 알려져 있습니다.

## 블록 수식 (Block)

블록 수식은 `$$` 기호 두 쌍으로 감싸며 가운데 정렬됩니다.

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

## 복잡한 예시

### 행렬 (Matrices)

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
\alpha & \beta \\
\gamma & \delta
\end{pmatrix} =
\begin{pmatrix}
a\alpha + b\gamma & a\beta + b\delta \\
c\alpha + d\gamma & c\beta + d\delta
\end{pmatrix}
$$

### 극한과 합 (Limits and Sums)

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

### 맥스웰 방정식 (Maxwell's Equations)

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\varepsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

### 화학 방정식 (Chemical Equations)

$$
\ce{CH4 + 2O2 -> CO2 + 2H2O}
$$

## 더 많은 기호

| 기호 | 코드 | 렌더링 결과 |
| :--- | :--- | :--- |
| Alpha | `\alpha` | $\alpha$ |
| Beta | `\beta` | $\beta$ |
| Gamma | `\Gamma` | $\Gamma$ |
| Pi | `\pi` | $\pi$ |
| Infinity | `\infty` | $\infty$ |
| Right Arrow | `\rightarrow` | $\rightarrow$ |
| Partial | `\partial` | $\partial$ |

더 많은 KaTeX 문법은 [KaTeX Supported Functions](https://katex.org/docs/supported.html)를 참고하세요.
