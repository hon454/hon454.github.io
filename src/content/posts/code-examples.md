---
title: Firefly 코드 블록 예시
published: 1970-01-03
pinned: false
description: Firefly에서 Expressive Code 코드 블록이 Markdown에 표시되는 모습을 보여 줍니다.
tags: [Markdown, Firefly]
category: 글 예시
image: ./images/firefly3.avif
slug: code-examples
---

여기서는 [Expressive Code](https://expressive-code.com/)로 코드 블록을 표시하는 방법을 살펴봅니다. 예시는 공식 문서를 바탕으로 하며 더 자세한 내용은 해당 문서를 참고하세요.

## Expressive Code

### 구문 강조

[구문 강조](https://expressive-code.com/key-features/syntax-highlighting/)

#### 일반 구문 강조

```js
console.log('이 코드는 구문 강조가 적용됩니다!')
```

#### ANSI 이스케이프 시퀀스 렌더링

```ansi
[1;4mStandard ANSI colors:[0m
- Dimmed:     [2;30m Black [2;31m Red [2;32m Green [2;33m Yellow [2;34m Blue [2;35m Magenta [2;36m Cyan [2;37m White [0m
- Foreground: [30m Black [31m Red [32m Green [33m Yellow [34m Blue [35m Magenta [36m Cyan [37m White [0m
- Background: [40m Black [41m Red [42m Green [43m Yellow [44m Blue [45m Magenta [46m Cyan [47m White [0m
- Reversed:   [7;30m Black [7;31m Red [7;32m Green [7;33m Yellow [7;34m Blue [7;35m Magenta [7;36m Cyan [7;37m White [0m

[1;4m8-bit colors (showing colors 160-171 as an example):[0m
- Dimmed:     [2;38;5;160m 160 [2;38;5;161m 161 [2;38;5;162m 162 [2;38;5;163m 163 [2;38;5;164m 164 [2;38;5;165m 165 [2;38;5;166m 166 [2;38;5;167m 167 [2;38;5;168m 168 [2;38;5;169m 169 [2;38;5;170m 170 [2;38;5;171m 171 [0m
- Foreground: [38;5;160m 160 [38;5;161m 161 [38;5;162m 162 [38;5;163m 163 [38;5;164m 164 [38;5;165m 165 [38;5;166m 166 [38;5;167m 167 [38;5;168m 168 [38;5;169m 169 [38;5;170m 170 [38;5;171m 171 [0m
- Background: [48;5;160m 160 [48;5;161m 161 [48;5;162m 162 [48;5;163m 163 [48;5;164m 164 [48;5;165m 165 [48;5;166m 166 [48;5;167m 167 [48;5;168m 168 [48;5;169m 169 [48;5;170m 170 [48;5;171m 171 [0m
- Reversed:   [7;38;5;160m 160 [7;38;5;161m 161 [7;38;5;162m 162 [7;38;5;163m 163 [7;38;5;164m 164 [7;38;5;165m 165 [7;38;5;166m 166 [7;38;5;167m 167 [7;38;5;168m 168 [7;38;5;169m 169 [7;38;5;170m 170 [7;38;5;171m 171 [0m

[1;4m24-bit colors (full RGB):[0m
- Dimmed:     [2;38;2;34;139;34m ForestGreen - RGB(34,139,34) [2;38;2;102;51;153m RebeccaPurple - RGB(102,51,153) [0m
- Foreground: [38;2;34;139;34m ForestGreen - RGB(34,139,34) [38;2;102;51;153m RebeccaPurple - RGB(102,51,153) [0m
- Background: [48;2;34;139;34m ForestGreen - RGB(34,139,34) [48;2;102;51;153m RebeccaPurple - RGB(102,51,153) [0m
- Reversed:   [7;38;2;34;139;34m ForestGreen - RGB(34,139,34) [7;38;2;102;51;153m RebeccaPurple - RGB(102,51,153) [0m

[1;4mFont styles:[0m
- Default
- [1mBold[0m
- [2mDimmed[0m
- [3mItalic[0m
- [4mUnderline[0m
- [7mReversed[0m
- [9mStrikethrough[0m
```

### 편집기와 터미널 프레임

[편집기와 터미널 프레임](https://expressive-code.com/key-features/frames/)

#### 코드 편집기 프레임

```js title="my-test-file.js"
console.log('title 속성 예시')
```

---

```html
<!-- src/content/index.html -->
<div>파일 이름 주석 예시</div>
```

#### 터미널 프레임

```bash
echo "이 터미널 프레임에는 제목이 없습니다"
```

---

```powershell title="PowerShell 터미널 예시"
Write-Output "이 블록에는 제목이 있습니다!"
```

#### 프레임 유형 재정의

```sh frame="none"
echo "보세요, 프레임이 없습니다!"
```

---

```ps frame="code" title="PowerShell Profile.ps1"
# 재정의하지 않으면 터미널 프레임이 됩니다.
function Watch-Tail { Get-Content -Tail 20 -Wait $args }
New-Alias tail Watch-Tail
```

### 텍스트와 줄 표시

[텍스트와 줄 표시](https://expressive-code.com/key-features/text-markers/)

#### 전체 줄과 줄 범위 표시

```js {1, 4, 7-8}
// 1번째 줄 - 줄 번호로 지정
// 2번째 줄
// 3번째 줄
// 4번째 줄 - 줄 번호로 지정
// 5번째 줄
// 6번째 줄
// 7번째 줄 - "7-8" 범위로 지정
// 8번째 줄 - "7-8" 범위로 지정
```

#### 줄 표시 유형 선택 (mark, ins, del)

```js title="line-markers.js" del={2} ins={3-4} {6}
function demo() {
  console.log('이 줄은 삭제된 줄로 표시됩니다')
  // 이 줄과 다음 줄은 삽입된 줄로 표시됩니다.
  console.log('두 번째로 삽입된 줄입니다')

  return '이 줄은 중립적인 기본 표시 유형을 사용합니다'
}
```

#### 줄 표시에 레이블 추가

```jsx {"1":5} del={"2":7-8} ins={"3":10-12}
// labeled-line-markers.jsx
<button
  role="button"
  {...props}
  value={value}
  className={buttonClassName}
  disabled={disabled}
  active={active}
>
  {children &&
    !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>
```

#### 별도 줄에 긴 레이블 추가

```jsx {"1. Provide the value prop here:":5-6} del={"2. Remove the disabled and active states:":8-10} ins={"3. Add this to render the children inside the button:":12-15}
// labeled-line-markers.jsx
<button
  role="button"
  {...props}

  value={value}
  className={buttonClassName}

  disabled={disabled}
  active={active}
>

  {children &&
    !active &&
    (typeof children === 'string' ? <span>{children}</span> : children)}
</button>
```

#### diff와 비슷한 문법 사용

```diff
+이 줄은 삽입된 줄로 표시됩니다.
-이 줄은 삭제된 줄로 표시됩니다.
일반 줄입니다.
```

---

```diff
--- a/README.md
+++ b/README.md
@@ -1,3 +1,4 @@
+this is an actual diff file
-all contents will remain unmodified
 no whitespace will be removed either
```

#### 구문 강조와 diff형 문법 함께 사용

```diff lang="js"
  function thisIsJavaScript() {
    // 전체 블록을 JavaScript로 구문 강조하면서
    // diff 표시도 추가할 수 있습니다!
-   console.log('삭제할 이전 코드')
+   console.log('새롭고 멋진 코드!')
  }
```

#### 줄 안의 개별 텍스트 표시

```js "given text"
function demo() {
  // 줄 안에서 지정한 텍스트를 표시합니다.
  return '지정한 텍스트와 일치하는 여러 부분을 지원합니다';
}
```

#### 정규 표현식

```ts /ye[sp]/
console.log('yes와 yep이라는 단어가 표시됩니다.')
```

#### 슬래시 이스케이프

```sh /\/ho.*\//
echo "Test" > /home/test.txt
```

#### 인라인 표시 유형 선택 (mark, ins, del)

```js "return true;" ins="inserted" del="deleted"
function demo() {
  console.log('삽입 및 삭제 표시 유형입니다');
  // return 문은 기본 표시 유형을 사용합니다.
  return true;
}
```

### 자동 줄 바꿈

[자동 줄 바꿈](https://expressive-code.com/key-features/word-wrap/)

#### 블록별 자동 줄 바꿈 설정

```js wrap
// 줄 바꿈을 사용한 예시
function getLongString() {
  return '컨테이너가 아주 넓지 않다면 사용 가능한 공간에 들어가기 어려울 만큼 매우 긴 문자열입니다'
}
```

---

```js wrap=false
// wrap=false 예시
function getLongString() {
  return '컨테이너가 아주 넓지 않다면 사용 가능한 공간에 들어가기 어려울 만큼 매우 긴 문자열입니다'
}
```

#### 줄 바꿈 들여쓰기 설정

```js wrap preserveIndent
// preserveIndent 예시(기본으로 사용)
function getLongString() {
  return '컨테이너가 아주 넓지 않다면 사용 가능한 공간에 들어가기 어려울 만큼 매우 긴 문자열입니다'
}
```

---

```js wrap preserveIndent=false
// preserveIndent=false 예시
function getLongString() {
  return '컨테이너가 아주 넓지 않다면 사용 가능한 공간에 들어가기 어려울 만큼 매우 긴 문자열입니다'
}
```

## 접을 수 있는 구간

[접을 수 있는 구간](https://expressive-code.com/plugins/collapsible-sections/)

```js collapse={1-5, 12-14, 21-24}
// 이 상용구 설정 코드는 모두 접힙니다.
import { someBoilerplateEngine } from '@example/some-boilerplate'
import { evenMoreBoilerplate } from '@example/even-more-boilerplate'

const engine = someBoilerplateEngine(evenMoreBoilerplate())

// 이 부분의 코드는 기본으로 표시됩니다.
engine.doSomething(1, 2, 3, calcFn)

function calcFn() {
  // 접을 수 있는 구간을 여러 개 둘 수 있습니다.
  const a = 1
  const b = 2
  const c = a + b

  // 이 코드는 계속 표시됩니다.
  console.log(`계산 결과: ${a} + ${b} = ${c}`)
  return c
}

// 블록 끝까지의 모든 코드가 다시 접힙니다.
engine.closeConnection()
engine.freeMemory()
engine.shutdown({ reason: '예시 상용구 코드 종료' })
```

## 줄 번호

[줄 번호](https://expressive-code.com/plugins/line-numbers/)

### 블록별 줄 번호 표시

```js showLineNumbers
// 이 코드 블록은 줄 번호를 표시합니다.
console.log('2번째 줄에서 인사드립니다!')
console.log('저는 3번째 줄에 있습니다')
```

---

```js showLineNumbers=false
// 이 블록은 줄 번호를 표시하지 않습니다.
console.log('안녕하세요?')
console.log('실례지만 제가 몇 번째 줄에 있는지 아시나요?')
```

### 시작 줄 번호 변경

```js showLineNumbers startLineNumber=5
console.log('5번째 줄에서 인사드립니다!')
console.log('저는 6번째 줄에 있습니다')
```

## 탭 코드 블록

[rehype-code-group](https://github.com/ITZSHOAIB/rehype-code-group)이 제공하며 [VitePress 코드 그룹](https://vitepress.dev/guide/markdown#code-groups)과 같은 문법을 사용합니다. 여러 코드 블록을 `::: code-group labels=[...]`로 감싸면 하나의 탭 그룹으로 합칠 수 있습니다.

> [!NOTE]
> `labels=[...]`의 레이블은 그룹 안 코드 블록과 순서대로 대응하며 영문 쉼표로 구분합니다. `:::`와 `code-group` 사이의 공백은 생략할 수 없습니다.

### 기본 사용법

````markdown
::: code-group labels=[code.js, code.py, code.html]

```js
export function greet(name) {
  return `Hello, ${name}!`;
}
```

```py
def greet(name):
    return f"Hello, {name}!"
```

```html
<p>Hello, world!</p>
```

:::
````

렌더링 결과:

::: code-group labels=[code.js, code.py, code.html]

```js
export function greet(name) {
  return `Hello, ${name}!`;
}
```

```py
def greet(name):
    return f"Hello, {name}!"
```

```html
<p>Hello, world!</p>
```

:::

### 레이블에 Emoji 사용

레이블은 [emoji 단축 코드](https://github.com/omnidan/node-emoji#readme)를 지원하며 빌드할 때 emoji로 자동 변환됩니다.

````markdown
::: code-group labels=[:package: npm, :package: pnpm, :yarn: yarn]
````

::: code-group labels=[:package: npm, :package: pnpm, :yarn: yarn]

```bash
npm create astro@latest
```

```bash
pnpm create astro@latest
```

```bash
yarn create astro
```

:::

### 다른 코드 블록 기능과 조합

그룹 안의 블록도 일반 Expressive Code 코드 블록이므로 제목, 줄 번호, 줄 표시, 접기, 터미널 프레임 같은 기능을 그대로 사용할 수 있습니다.

::: code-group labels=[설정 파일, 터미널, 접기]

```js title="astro.config.mjs" showLineNumbers {2} ins={3}
export default {
  theme: "firefly",
  codeGroup: true,
};
```

```bash title="배포"
pnpm build && pnpm preview
```

```js collapse={1-3}
// 이 세 줄은 기본으로 접힙니다.
import { a } from "a";
import { b } from "b";

console.log(a, b);
```

:::

### 코드 블록 이외의 콘텐츠

탭 안에는 문구, 목록, 이미지 등 어떤 콘텐츠든 넣을 수 있습니다.

::: code-group labels=[설명, 목록]

일반 문단 내용입니다.

- 목록 항목 1
- 목록 항목 2

:::

> [!TIP]
> 탭 바는 빌드할 때 생성되며 첫 번째 항목을 기본으로 엽니다. 마우스 클릭과 키보드 <kbd>←</kbd> / <kbd>→</kbd> / <kbd>Home</kbd> / <kbd>End</kbd>로 전환할 수 있습니다.

### 알림 상자 안에서 사용(MDX 컴포넌트)

`::: code-group`과 `::: tip` 같은 Docusaurus 스타일 알림 상자는 모두 `:::` 컨테이너 문법을 사용합니다. micromark-directive는 부모와 자식 컨테이너의 콜론 수가 달라야 한다고 규정하므로 `::: code-group`은 **`::: tip` 같은 알림 상자 안에 중첩할 수 없습니다**(블록 전체가 작동하지 않음).

이 경우에는 MDX 컴포넌트 [`TabGroup`](@/components/common/TabGroup.svelte)을 사용하세요. MDX 컴포넌트는 `:::` 지시문 해석을 거치지 않아 알림 상자 안팎에서 정상적으로 사용할 수 있고 나중에 UI 컴포넌트를 확장하기도 쉽습니다. 글 확장자를 `.mdx`로 바꾸고 통합 진입점 [`@/components/firefly-mdx`](@/components/firefly-mdx.ts)에서 가져옵니다(여러 컴포넌트를 한 번에 가져올 수 있음).

````mdx
import { TabGroup } from "@/components/firefly-mdx";

:::tip

<TabGroup labels={["test.js", "test.py"]} client:load>
  ```js
  console.log(1)
  ```

  ```py
  print("hello world")
  ```
</TabGroup>

:::
````

:::tip
- `labels` 배열은 각 코드 블록의 레이블을 같은 순서로 지정합니다.
- 컴포넌트는 `client:load`로 탭 전환 기능을 활성화합니다.
:::
