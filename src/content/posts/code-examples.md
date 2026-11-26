---
title: Firefly 코드 블록 예시
published: 1970-01-03
pinned: false
description: Firefly에서 Expressive Code로 꾸민 코드 블록이 Markdown에서 어떻게 보이는지 보여 주는 예시.
tags: [markdown, firefly]
category: 블로그
image: ./images/firefly3.avif
slug: code-examples
---

여기서는 [Expressive Code](https://expressive-code.com/)로 코드 블록을 표시하는 방법을 살펴본다. 예시는 공식 문서를 바탕으로 했으며, 자세한 내용은 문서를 참고하면 된다.

## Expressive Code

### 구문 강조

[구문 강조](https://expressive-code.com/key-features/syntax-highlighting/)

#### 기본 구문 강조

```js
console.log('이 코드는 구문 강조가 적용된다!')
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

### 에디터와 터미널 프레임

[에디터와 터미널 프레임](https://expressive-code.com/key-features/frames/)

#### 코드 에디터 프레임

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
echo "이 터미널 프레임에는 제목이 없다"
```

---

```powershell title="PowerShell 터미널 예시"
Write-Output "이 프레임에는 제목이 있다!"
```

#### 프레임 종류 덮어쓰기

```sh frame="none"
echo "보라, 프레임이 없다!"
```

---

```ps frame="code" title="PowerShell Profile.ps1"
# 덮어쓰지 않으면 이 블록은 터미널 프레임이 된다
function Watch-Tail { Get-Content -Tail 20 -Wait $args }
New-Alias tail Watch-Tail
```

### 텍스트와 줄 마커

[텍스트와 줄 마커](https://expressive-code.com/key-features/text-markers/)

#### 줄 전체와 줄 범위 표시

```js {1, 4, 7-8}
// 1번째 줄 - 줄 번호로 지정
// 2번째 줄
// 3번째 줄
// 4번째 줄 - 줄 번호로 지정
// 5번째 줄
// 6번째 줄
// 7번째 줄 - 범위 "7-8"로 지정
// 8번째 줄 - 범위 "7-8"로 지정
```

#### 줄 마커 종류 선택 (mark, ins, del)

```js title="line-markers.js" del={2} ins={3-4} {6}
function demo() {
  console.log('이 줄은 삭제로 표시된다')
  // 이 줄과 다음 줄은 삽입으로 표시된다
  console.log('두 번째 삽입 줄이다')

  return '이 줄은 기본 중립 마커를 쓴다'
}
```

#### 줄 마커에 레이블 붙이기

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

#### 별도 줄에 긴 레이블 붙이기

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
+이 줄은 삽입으로 표시된다
-이 줄은 삭제로 표시된다
이 줄은 일반 줄이다
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

#### 구문 강조와 diff 문법 함께 쓰기

```diff lang="js"
  function thisIsJavaScript() {
    // 블록 전체가 JavaScript로 강조되고,
    // 여기에 diff 마커도 붙일 수 있다!
-   console.log('삭제할 기존 코드')
+   console.log('새로 바뀐 코드!')
  }
```

#### 줄 안의 일부 텍스트 표시

```js "given text"
function demo() {
  // 줄 안의 지정한 텍스트를 표시한다
  return '지정한 텍스트가 여러 번 나와도 모두 표시된다';
}
```

#### 정규식

```ts /ye[sp]/
console.log('yes와 yep 단어가 표시된다.')
```

#### 슬래시 이스케이프

```sh /\/ho.*\//
echo "Test" > /home/test.txt
```

#### 인라인 마커 종류 선택 (mark, ins, del)

```js "return true;" ins="inserted" del="deleted"
function demo() {
  console.log('삽입과 삭제 마커 종류 예시');
  // return 문은 기본 마커 종류를 쓴다
  return true;
}
```

### 자동 줄 바꿈

[자동 줄 바꿈](https://expressive-code.com/key-features/word-wrap/)

#### 블록별 자동 줄 바꿈 설정

```js wrap
// 줄 바꿈을 켠 예시
function getLongString() {
  return '아주 긴 문자열이라 컨테이너가 매우 넓지 않으면 공간에 들어가지 않을 가능성이 크다'
}
```

---

```js wrap=false
// wrap=false 예시
function getLongString() {
  return '아주 긴 문자열이라 컨테이너가 매우 넓지 않으면 공간에 들어가지 않을 가능성이 크다'
}
```

#### 줄 바꿈 들여쓰기 설정

```js wrap preserveIndent
// preserveIndent 예시 (기본으로 켜져 있음)
function getLongString() {
  return '아주 긴 문자열이라 컨테이너가 매우 넓지 않으면 공간에 들어가지 않을 가능성이 크다'
}
```

---

```js wrap preserveIndent=false
// preserveIndent=false 예시
function getLongString() {
  return '아주 긴 문자열이라 컨테이너가 매우 넓지 않으면 공간에 들어가지 않을 가능성이 크다'
}
```

## 접을 수 있는 영역

[접을 수 있는 영역](https://expressive-code.com/plugins/collapsible-sections/)

```js collapse={1-5, 12-14, 21-24}
// 이 보일러플레이트 설정 코드는 모두 접힌다
import { someBoilerplateEngine } from '@example/some-boilerplate'
import { evenMoreBoilerplate } from '@example/even-more-boilerplate'

const engine = someBoilerplateEngine(evenMoreBoilerplate())

// 이 부분은 기본으로 보인다
engine.doSomething(1, 2, 3, calcFn)

function calcFn() {
  // 접는 영역을 여러 개 둘 수 있다
  const a = 1
  const b = 2
  const c = a + b

  // 이 부분은 계속 보인다
  console.log(`계산 결과: ${a} + ${b} = ${c}`)
  return c
}

// 블록 끝까지의 코드는 다시 접힌다
engine.closeConnection()
engine.freeMemory()
engine.shutdown({ reason: '예시 보일러플레이트 코드 끝' })
```

## 줄 번호

[줄 번호](https://expressive-code.com/plugins/line-numbers/)

### 블록별 줄 번호 표시

```js showLineNumbers
// 이 코드 블록은 줄 번호를 표시한다
console.log('2번째 줄에서 인사한다!')
console.log('여기는 3번째 줄이다')
```

---

```js showLineNumbers=false
// 이 블록은 줄 번호를 끈다
console.log('안녕?')
console.log('미안하지만, 지금 몇 번째 줄인지 아는가?')
```

### 시작 줄 번호 바꾸기

```js showLineNumbers startLineNumber=5
console.log('5번째 줄에서 인사한다!')
console.log('여기는 6번째 줄이다')
```

## Tab 코드 블록

[rehype-code-group](https://github.com/ITZSHOAIB/rehype-code-group)이 제공하며, 문법은 [VitePress 코드 그룹](https://vitepress.dev/guide/markdown#code-groups)과 같다. 코드 블록 여러 개를 `::: code-group labels=[...]`로 감싸면 하나의 탭 묶음이 된다.

> [!NOTE]
> `labels=[...]`의 레이블은 그룹 안의 코드 블록과 순서대로 짝을 이루며 영문 쉼표로 구분한다. `:::`와 `code-group` 사이의 공백은 생략할 수 없다.

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

### 탭 레이블에 Emoji 쓰기

탭 레이블은 [emoji 단축 코드](https://github.com/omnidan/node-emoji#readme)를 지원하며, 빌드할 때 자동으로 emoji로 바뀐다:

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

### 다른 코드 블록 기능과 함께 쓰기

그룹 안의 코드 블록은 평범한 Expressive Code 블록이라서 제목, 줄 번호, 줄 마커, 접기, 터미널 프레임 같은 기능을 그대로 쓸 수 있다.

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
// 이 세 줄은 기본으로 접혀 있다
import { a } from "a";
import { b } from "b";

console.log(a, b);
```

:::

### 코드 블록 이상의 구성

같은 탭 안에 설명 글, 코드, 목록을 함께 넣으려면 리치 콘텐츠 문법을 쓴다. 바깥은 `:::: code-group`, 각 탭은 `::: code-tab label="..."`로 감싼다. 코드 앞뒤의 설명도 코드와 함께 전환된다.

````markdown
:::: code-group label="Installation choices"

::: code-tab label="npm"

먼저 의존성을 설치한 다음 개발 서버를 시작한다.

```sh
npm install
npm run dev
```

터미널을 켜 둔 채로 로컬 미리보기 주소를 연다.

:::

::: code-tab label="pnpm"

pnpm으로 설치하고 프로젝트를 시작한다.

```sh
pnpm install
pnpm dev
```

- Node.js 22.23 이상이 필요하다.
- 프로젝트가 지정한 pnpm 버전을 쓴다.

:::

::::
````

렌더링 결과:

:::: code-group label="Installation choices"

::: code-tab label="npm"

먼저 의존성을 설치한 다음 개발 서버를 시작한다.

```sh
npm install
npm run dev
```

터미널을 켜 둔 채로 로컬 미리보기 주소를 연다.

:::

::: code-tab label="pnpm"

pnpm으로 설치하고 프로젝트를 시작한다.

```sh
pnpm install
pnpm dev
```

- Node.js 22.23 이상이 필요하다.
- 프로젝트가 지정한 pnpm 버전을 쓴다.

:::

::::

### 코드 펜스에 레이블 쓰기

`labels=[...]`를 생략하고 레이블을 코드 펜스의 대괄호 안에 적을 수도 있다. Emoji 단축 코드도 그대로 쓸 수 있고, Expressive Code의 `title`, 줄 번호, 강조 설정도 함께 쓸 수 있다.

````markdown
::: code-group

```sh [:package: npm]
npm install rehype-code-group
```

```sh [:package: pnpm]
pnpm add rehype-code-group
```

:::
````

::: code-group

```sh [:package: npm]
npm install rehype-code-group
```

```sh [:package: pnpm]
pnpm add rehype-code-group
```

:::

### 패키지 매니저 탭 자동 생성

npm 명령의 코드 펜스에 `npm2yarn`을 붙이면 빌드할 때 npm, pnpm, Yarn, Bun 탭 네 개로 자동 확장된다. `::: code-group`을 직접 쓸 필요도, 명령 네 벌을 관리할 필요도 없다.

````markdown
```sh npm2yarn
npm install rehype-code-group
```
````

```sh npm2yarn
npm install rehype-code-group
```

### 선택 동기화, 기억, 세로 배치

아래 두 그룹은 같은 `sync="firefly-package-manager"`와 `persist="local"`을 쓴다. 한 그룹에서 pnpm을 고르면 다른 그룹도 바뀌고, 새로고침한 뒤에도 선택이 유지된다. 그룹 사이의 동기화는 같은 `value`로 이루어지므로 탭 문구는 달라도 된다.

바깥에 `orientation="vertical"`을 주면 넓은 화면에서 탭이 옆에 놓이고, 좁은 화면에서는 자동으로 위쪽 탭이 된다. 세로 탭은 <kbd>↑</kbd> / <kbd>↓</kbd>, 가로 탭은 <kbd>←</kbd> / <kbd>→</kbd>로 이동한다.

````markdown
:::: code-group label="Install dependencies" sync="firefly-package-manager" persist="local"

::: code-tab label="npm" value="npm"

```sh
npm install
```

:::

::: code-tab label="pnpm" value="pnpm"

```sh
pnpm install
```

:::

::::
````

:::: code-group label="Install dependencies" sync="firefly-package-manager" persist="local"

::: code-tab label="npm" value="npm"

```sh
npm install
```

:::

::: code-tab label="pnpm" value="pnpm"

```sh
pnpm install
```

:::

::::

:::: code-group label="Start development server" sync="firefly-package-manager" persist="local" orientation="vertical"

::: code-tab label="npm" value="npm"

```sh
npm run dev
```

:::

::: code-tab label="pnpm" value="pnpm"

```sh
pnpm dev
```

:::

::::

> [!TIP]
> 탭 줄은 빌드할 때 만들어지며 기본으로 첫 항목이 펼쳐진다. 마우스 클릭과 키보드 <kbd>←</kbd> / <kbd>→</kbd> / <kbd>Home</kbd> / <kbd>End</kbd>로 전환할 수 있다. JavaScript를 끄거나 글을 인쇄하면 모든 탭의 내용이 보인다.

### 알림 상자 안에서 쓰기 (MDX 컴포넌트)

`::: code-group`과 `::: tip` 같은 Docusaurus 스타일 알림 상자는 모두 `:::` 컨테이너 문법을 쓰는데, micromark-directive는 부모와 자식 컨테이너의 콜론 수가 달라야 한다고 정하고 있다. 그래서 `::: code-group`은 **`::: tip` 같은 알림 상자 안에 중첩할 수 없다**(블록 전체가 동작하지 않는다).

이런 경우에는 MDX 컴포넌트 [`TabGroup`](@/components/common/TabGroup.svelte)을 쓴다. MDX 컴포넌트는 `:::` 지시문 파서를 거치지 않으므로 알림 상자 안팎에서 모두 동작하고, 나중에 UI 컴포넌트를 더 추가하기도 쉽다. 글의 확장자를 `.mdx`로 바꾸고 통합 진입점 [`@/components/firefly-mdx`](@/components/firefly-mdx.ts)에서 가져온다(여러 컴포넌트를 한 번에 가져올 수 있다):

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
- `labels` 배열로 각 코드 블록의 레이블을 선언하며, 순서대로 짝을 이룬다
- 컴포넌트는 `client:load`로 탭 전환을 활성화한다
:::
