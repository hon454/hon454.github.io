---
title: Markdown 튜토리얼
published: 1970-01-01
pinned: false
description: 간결한 Markdown 블로그 예시입니다.
tags: [Markdown, 글 예시]
category: 글 예시
licenseName: "라이선스 없음"
author: emn178
sourceLink: "https://github.com/emn178/markdown"
slug: markdown-tutorial

---

Markdown 파일 작성 방법을 보여 주는 예시입니다. 이 문서는 핵심 문법과 자주 쓰는 확장 문법(GFM)을 정리합니다.

- [블록 요소](#block-elements)
    - [문단과 줄 바꿈](#paragraphs-and-line-breaks)
    - [제목](#headers)
    - [인용문](#blockquotes)
    - [목록](#lists)
    - [코드 블록](#code-blocks)
    - [구분선](#horizontal-rules)
    - [표](#table)
- [인라인 요소](#span-elements)
    - [링크](#links)
    - [강조](#emphasis)
    - [인라인 코드](#code)
    - [이미지](#images)
    - [취소선](#strikethrough)
- [기타](#miscellaneous)
    - [자동 링크](#automatic-links)
    - [백슬래시 이스케이프](#backslash-escapes)
- [인라인 HTML](#inline-html)

<a id="block-elements"></a>
## 블록 요소

<a id="paragraphs-and-line-breaks"></a>
### 문단과 줄 바꿈

#### 문단

HTML 태그: `<p>`

문단은 하나 이상의 빈 줄로 구분합니다. **공백**이나 **탭**만 있는 줄도 빈 줄로 봅니다.

코드:

    This will be
    inline.

    This is second paragraph.

미리 보기:

---

This will be
inline.

This is second paragraph.

---

#### 줄 바꿈

HTML 태그: `<br />`

줄 끝에 **공백을 두 개 이상** 넣으면 줄이 바뀝니다.

코드:

    This will be not
    inline.

미리 보기:

---

This will be not  
inline.

---

<a id="headers"></a>
### 제목

Markdown은 Setext와 atx라는 두 가지 제목 스타일을 지원합니다.

#### Setext

HTML 태그: `<h1>`, `<h2>`

**등호(=)**는 `<h1>`, **하이픈(-)**은 `<h2>`를 나타내며 개수 제한 없이 제목 아래의 '밑줄'로 사용합니다.

코드:

    This is an H1
    =============
    This is an H2
    -------------

미리 보기:

---

# This is an H1

## This is an H2

---

#### atx

HTML 태그: `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`

줄 앞에 **해시 기호(#)**를 1~6개 사용하며 각각 `<h1>`부터 `<h6>`에 대응합니다.

코드:

    # This is an H1
    ## This is an H2
    ###### This is an H6

미리 보기:

---

# This is an H1

## This is an H2

###### This is an H6

---

선택 사항으로 줄 끝에서 atx 제목을 '닫을' 수 있습니다. 끝의 해시 기호 수는 시작 부분과 **같지 않아도** 됩니다.

코드:

    # This is an H1 #
    ## This is an H2 ##
    ### This is an H3 ######

미리 보기:

---

# This is an H1

## This is an H2

### This is an H3

---

<a id="blockquotes"></a>
### 인용문

HTML 태그: `<blockquote>`

Markdown은 이메일 스타일의 **>**를 인용 기호로 사용합니다. 직접 줄을 바꾸고 각 줄 앞에 >를 붙이면 가장 명확하게 표시됩니다.

코드:

    > This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
    > consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
    > Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
    >
    > Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
    > id sem consectetuer libero luctus adipiscing.

미리 보기:

---

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

---

Markdown에서는 간단히 작성할 수도 있습니다. 강제 줄 바꿈된 문단에서는 첫 줄 앞에만 >를 붙여도 됩니다.

코드:

    > This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
    consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
    Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

    > Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
    id sem consectetuer libero luctus adipiscing.

미리 보기:

---

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

---

>의 단계를 늘려 인용문 안에 인용문을 중첩할 수 있습니다.

코드:

    > This is the first level of quoting.
    >
    > > This is nested blockquote.
    >
    > Back to the first level.

미리 보기:

---

> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

---

인용문에는 제목, 목록, 코드 블록 등 다른 Markdown 요소를 넣을 수 있습니다.

코드:

    > ## This is a header.
    >
    > 1.   This is the first list item.
    > 2.   This is the second list item.
    >
    > Here's some example code:
    >
    >     return shell_exec("echo $input | $markdown_script");

미리 보기:

---

> ## This is a header.
>
> 1.  This is the first list item.
> 2.  This is the second list item.
>
> Here's some example code:
>
>     return shell_exec("echo $input | $markdown_script");

---

<a id="lists"></a>
### 목록

Markdown은 순서 있는 목록(숫자)과 순서 없는 목록(글머리 기호)을 지원합니다.

#### 순서 없는 목록

HTML 태그: `<ul>`

순서 없는 목록에는 **별표(\*)**, **더하기 기호(+)**, **하이픈(-)**을 사용할 수 있습니다.

코드:

    *   Red
    *   Green
    *   Blue

미리 보기:

---

- Red
- Green
- Blue

---

다음과 같습니다.

코드:

    +   Red
    +   Green
    +   Blue

또는:

코드:

    -   Red
    -   Green
    -   Blue

#### 순서 있는 목록

HTML 태그: `<ol>`

순서 있는 목록은 숫자 뒤에 마침표를 붙입니다.

코드:

    1.  Bird
    2.  McHale
    3.  Parish

미리 보기:

---

1.  Bird
2.  McHale
3.  Parish

---

주의: 다음과 같은 문장은 의도치 않게 순서 있는 목록으로 해석될 수 있습니다.

코드:

    1986. What a great season.

미리 보기:

---

1986. What a great season.

---

마침표 앞에 **백슬래시(\\)**를 넣어 이스케이프할 수 있습니다.

코드:

    1986\. What a great season.

미리 보기:

---

1986\. What a great season.

---

#### 목록 안의 들여쓴 콘텐츠

##### 목록 항목 안의 인용문

목록 항목 안에 인용문을 넣으려면 > 기호 전체를 들여씁니다.

코드:

    *   A list item with a blockquote:

        > This is a blockquote
        > inside a list item.

미리 보기:

---

- A list item with a blockquote:

  > This is a blockquote
  > inside a list item.

---

##### 목록 항목 안의 코드 블록

목록 항목 안에 코드 블록을 넣으려면 두 단계, 즉 **공백 8개** 또는 **탭 2개**만큼 들여씁니다.

코드:

    *   A list item with a code block:

            <code goes here>

미리 보기:

---

- A list item with a code block:

      <code goes here>

---

##### 중첩 목록

코드:

    * A
      * A1
      * A2
    * B
    * C

미리 보기:

---

- A
  - A1
  - A2
- B
- C

---

<a id="code-blocks"></a>
### 코드 블록

HTML 태그: `<pre>`

코드 블록의 각 줄을 **공백 4개** 또는 **탭 1개** 이상 들여씁니다.

코드:

    This is a normal paragraph:

        This is a code block.

미리 보기:

---

This is a normal paragraph:

    This is a code block.

---

코드 블록은 들여쓰지 않은 줄이나 문서 끝을 만날 때까지 이어집니다.

코드 블록 안의 **앰퍼샌드(&)**와 **꺾쇠괄호(< >)**는 HTML 엔티티로 자동 변환됩니다.

코드:

        <div class="footer">
            &copy; 2004 Foo Corporation
        </div>

미리 보기:

---

    <div class="footer">
        &copy; 2004 Foo Corporation
    </div>

---

아래의 '펜스 코드 블록'과 '구문 강조'는 확장 문법이며 코드 블록 작성에 사용할 수 있습니다.

#### 펜스 코드 블록

아래처럼 백틱 묶음으로 감싸면 공백 네 개를 들여쓸 필요가 없습니다.

코드:

    Here's an example:

    ```
    function test() {
      console.log("notice the blank line before this function?");
    }
    ```

미리 보기:

---

Here's an example:

```
function test() {
  console.log("notice the blank line before this function?");
}
```

---

#### 구문 강조

펜스 코드 블록 뒤에 선택적으로 언어 식별자를 추가하면 구문 강조를 사용할 수 있습니다(지원 언어 목록 참고).

코드:

    ```ruby
    require 'redcarpet'
    markdown = Redcarpet.new("Hello World!")
    puts markdown.to_html
    ```

미리 보기:

---

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

---

<a id="horizontal-rules"></a>
### 구분선(수평선)

HTML 태그: `<hr />`
한 줄에 **하이픈(-), 별표(\*), 밑줄(\_)을 세 개 이상** 입력합니다. 기호 사이에 공백을 둘 수 있습니다.

코드:

    * * *
    ***
    *****
    - - -
    ---------------------------------------
    ___

미리 보기:

---

---

---

---

---

---

---

---

<a id="table"></a>
### 표

HTML 태그: `<table>`

확장 문법입니다.

**세로선(|)**으로 열을 구분하고 **하이픈(-)**으로 표 머리글을 나누며 **콜론(:)**으로 정렬 방식을 지정합니다.

양쪽의 **세로선(|)**과 정렬 지정은 선택 사항입니다. 표 머리글을 구분할 때는 열마다 **하이픈이 최소 3개** 필요합니다.

코드:

```
| Left | Center | Right |
|:-----|:------:|------:|
|aaa   |bbb     |ccc    |
|ddd   |eee     |fff    |

 A | B
---|---
123|456


A |B
--|--
12|45
```

미리 보기:

---

| Left | Center | Right |
| :--- | :----: | ----: |
| aaa  |  bbb   |   ccc |
| ddd  |  eee   |   fff |

| A   | B   |
| --- | --- |
| 123 | 456 |

| A   | B   |
| --- | --- |
| 12  | 45  |

---

<a id="span-elements"></a>
## 인라인 요소

<a id="links"></a>
### 링크

HTML 태그: `<a>`

Markdown은 인라인 링크와 참조형 링크라는 두 가지 링크 스타일을 지원합니다.

#### 인라인 링크

인라인 링크 형식: `[문구](URL "제목")`

제목은 선택 사항입니다.

코드:

    This is [an example](http://example.com/ "Title") inline link.

    [This link](http://example.net/) has no title attribute.

미리 보기:

---

This is [an example](http://example.com/ "Title") inline link.

[This link](http://example.net/) has no title attribute.

---

같은 사이트의 로컬 리소스를 참조할 때는 상대 경로를 사용할 수 있습니다.

코드:

    See my [About](/about/) page for details.

미리 보기:

---

See my [About](/about/) page for details.

---

#### 참조형 링크

링크 참조를 미리 정의할 수 있습니다. 정의 형식: `[id]: URL "제목"`

제목은 역시 선택 사항입니다. 참조할 때는 `[문구][id]` 형식을 사용합니다.

코드:

    [id]: http://example.com/  "Optional Title Here"
    This is [an example][id] reference-style link.

미리 보기:

---

[id]: http://example.com/ "Optional Title Here"

This is [an example][id] reference-style link.

---

설명:

- 대괄호 안에 링크 식별자를 넣습니다(**대소문자를 구분하지 않으며** 왼쪽에 공백 세 칸까지 들여쓸 수 있음).
- 그 뒤에 콜론을 붙입니다.
- 공백이나 탭을 하나 이상 넣습니다.
- 링크 URL을 입력합니다.
- URL은 선택적으로 꺾쇠괄호로 감쌀 수 있습니다.
- 선택적으로 따옴표나 소괄호로 감싼 제목 속성을 덧붙일 수 있습니다.

다음 세 가지 정의는 같은 의미입니다.

코드:

    [foo]: http://example.com/  "Optional Title Here"
    [foo]: http://example.com/  'Optional Title Here'
    [foo]: http://example.com/  (Optional Title Here)
    [foo]: <http://example.com/>  "Optional Title Here"

빈 대괄호를 사용하면 링크 문구 자체를 이름으로 사용합니다.

코드:

    [Google]: http://google.com/
    [Google][]

미리 보기:

---

[Google]: http://google.com/

[Google][]

---

<a id="emphasis"></a>
### 강조

HTML 태그: `<em>`, `<strong>`

Markdown은 **별표(\*)** 또는 **밑줄(\_)**로 강조를 나타냅니다. **구분 기호 하나**는 `<em>`, **구분 기호 두 개**는 `<strong>`에 대응합니다.

코드:

    *single asterisks*

    _single underscores_

    **double asterisks**

    __double underscores__

미리 보기:

---

_single asterisks_

_single underscores_

**double asterisks**

**double underscores**

---

양쪽에 공백이 있으면 강조 문법이 아니라 일반 문자로 처리됩니다.

백슬래시로 이스케이프할 수 있습니다.

코드:

    \*this text is surrounded by literal asterisks\*

미리 보기:

---

\*this text is surrounded by literal asterisks\*

---

<a id="code"></a>
### 인라인 코드

HTML 태그: `<code>`

**백틱(`)**으로 감쌉니다.

코드:

    Use the `printf()` function.

미리 보기:

---

Use the `printf()` function.

---

인라인 코드 안에 백틱 문자를 넣어야 한다면 **여러 개의 백틱**을 구분 기호로 사용할 수 있습니다.

코드:

    ``There is a literal backtick (`) here.``

미리 보기:

---

``There is a literal backtick (`) here.``

---

인라인 코드 양쪽 구분 기호 안에 공백을 하나씩 둘 수 있어 코드의 시작이나 끝에 백틱 문자를 넣기 편리합니다.

코드:

    A single backtick in a code span: `` ` ``

    A backtick-delimited string in a code span: `` `foo` ``

미리 보기:

---

A single backtick in a code span: `` ` ``

A backtick-delimited string in a code span: `` `foo` ``

---

<a id="images"></a>
### 이미지

HTML 태그: `<img />`

Markdown 이미지 문법은 링크와 비슷하며 인라인 방식과 참조 방식을 지원합니다.

#### 인라인 이미지

인라인 이미지 문법: `![대체 텍스트](URL "제목")`

제목은 선택 사항입니다.

코드:

    ![Alt text](/path/to/img.jpg)

    ![Alt text](/path/to/img.jpg "Optional title")

미리 보기:

---

![Alt text](https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp)

![Alt text](https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp "Optional title")

---

설명:

- 느낌표 !를 입력합니다.
- 이어지는 대괄호 안에 이미지 대체 텍스트를 넣습니다.
- 다음 소괄호 안에 이미지 URL 또는 경로와 선택적인 제목(따옴표로 감쌈)을 넣습니다.

#### 참조형 이미지

참조형 이미지 문법: `![대체 텍스트][id]`

코드:

    [img id]: https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp  "Optional title attribute"
    ![Alt text][img id]

미리 보기:

---

[img id]: https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp "Optional title attribute"

![Alt text][img id]

---

<a id="strikethrough"></a>
### 취소선

HTML 태그: `<del>`

확장 문법입니다.

GFM은 취소선 문법을 추가로 제공합니다.

코드:

```
~~Mistaken text.~~
```

미리 보기:

---

~~Mistaken text.~~

---

<a id="miscellaneous"></a>
## 기타

<a id="automatic-links"></a>
### 자동 링크

Markdown에서는 URL과 이메일 주소를 꺾쇠괄호로 감싸는 간단한 방식으로 '자동 링크'를 만들 수 있습니다.

코드:

    <http://example.com/>

    <address@example.com>

미리 보기:

---

<http://example.com/>

<address@example.com>

---

GFM은 표준 URL을 자동으로 인식해 링크로 변환합니다.

코드:

```
https://github.com/emn178/markdown
```

미리 보기:

---

https://github.com/emn178/markdown

---

<a id="backslash-escapes"></a>
### 백슬래시 이스케이프

Markdown에서는 문법에 쓰이는 특수 문자 앞에 백슬래시를 넣어 문자 그대로 표시할 수 있습니다.

코드:

    \*literal asterisks\*

미리 보기:

---

\*literal asterisks\*

---

다음 문자는 백슬래시로 이스케이프해 문자 그대로 출력할 수 있습니다.

Code:

    \   backslash
    `   backtick
    *   asterisk
    _   underscore
    {}  curly braces
    []  square brackets
    ()  parentheses
    #   hash mark
    +   plus sign
    -   minus sign (hyphen)
    .   dot
    !   exclamation mark

<a id="inline-html"></a>
## 인라인 HTML

Markdown 문법으로 표현할 수 없는 마크업은 기본 HTML을 직접 사용하면 됩니다. Markdown에서 HTML로 전환한다고 따로 선언할 필요 없이 태그를 바로 작성하세요.

코드:

    This is a regular paragraph.

    <table>
        <tr>
            <td>Foo</td>
        </tr>
    </table>

    This is another regular paragraph.

미리 보기:

---

This is a regular paragraph.

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

This is another regular paragraph.

---

주의: **블록 수준 HTML 태그** 안에서는 Markdown 문법을 처리하지 않습니다.

블록 수준 태그와 달리 **인라인 수준 태그** 안에서는 Markdown 문법을 처리합니다.

코드:

    <span>**Work**</span>

    <div>
        **No Work**
    </div>

미리 보기:

---

<span>**Work**</span>

<div>
  **No Work**
</div>
***
