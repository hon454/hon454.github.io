---
title: Firefly 블로그 가이드
published: 2026-08-24
updated: 2026-09-02
description: Firefly 기본 예제 글을 정리하면서 실제로 사용하는 글 작성법, Markdown 확장, 다이어그램, 내부 링크, 암호화와 레이아웃 설정을 한곳에 모았습니다.
image: ./images/firefly2.avif
tags: [firefly, astro, markdown, blog]
category: 블로그
slug: firefly-blog-guide
---

이 블로그는 Astro 기반 테마인 [Firefly](https://github.com/CuteLeaf/Firefly)를 사용한다. 처음에는 테마 기능을 확인하기 위한 예제 글을 그대로 두었지만, 개인 글보다 예제 글이 아카이브의 대부분을 차지하는 모습이 점점 어색해졌다.

예제를 전부 없애면 나중에 문법과 설정을 다시 찾아야 하고, 그대로 두면 블로그의 성격이 흐려진다. 그래서 실제로 참고할 내용만 이 글 하나에 모으고 나머지 기본 예제는 정리하기로 했다. 상세한 최신 설정은 [Firefly 공식 문서](https://docs-firefly.cuteleaf.cn)를 기준으로 하고, 이 글은 내가 이 저장소에서 자주 확인할 내용을 위한 빠른 안내서로 사용한다.

::github{repo="CuteLeaf/Firefly"}

## 새 글 만들기

글은 `src/content/posts/` 아래에 Markdown 또는 MDX 파일로 작성한다. 스크립트를 사용하면 기본 Frontmatter가 들어간 파일을 만들 수 있다.

```bash
pnpm new-post my-new-post
```

직접 파일을 만들 때는 다음 정도로 시작하면 충분하다.

```yaml
---
title: 새 글 제목
published: 2026-08-24
description: 글 목록과 검색 결과에 표시할 짧은 설명
image: ./images/cover.avif
tags: [개발, 기록]
category: 개발
draft: false
slug: my-new-post
---
```

자주 사용하는 필드는 다음과 같다.

| 필드 | 용도 |
| --- | --- |
| `title` | 글 제목 |
| `published` | 최초 발행일 |
| `updated` | 내용을 수정한 날짜 |
| `description` | 목록 카드와 메타데이터에 사용할 요약 |
| `image` | 원격 URL, `public` 절대 경로 또는 글 기준 상대 경로의 표지 이미지 |
| `tags` | 여러 글을 주제별로 연결하는 태그 |
| `category` | 글의 대표 분류 |
| `pinned` | 글을 일반적인 날짜 정렬보다 위에 고정 |
| `draft` | `true`이면 프로덕션에서 비공개 |
| `comment` | 글별 댓글 사용 여부 |
| `slug` | 파일 이름과 다른 공개 URL이 필요할 때 지정 |
| `password` | 빌드 시 글 내용을 암호화할 비밀번호 |
| `passwordHint` | 비밀번호 입력 화면에 표시할 힌트 |
| `series` | 여러 글을 같은 시리즈로 묶는 이름 |
| `seriesOrder` | 시리즈 안에서 글을 표시할 순서 |

`slug`는 한 번 공개한 뒤 바꾸면 기존 링크가 깨질 수 있으므로 짧은 영문과 하이픈 조합으로 처음부터 정해 두는 편이 좋다.

## 글을 시리즈로 묶기

연속해서 읽을 글은 같은 `series` 이름을 지정하고 `seriesOrder`로 순서를 정한다.

```yaml
series: Unreal Engine 네트워킹
seriesOrder: 1
```

시리즈가 지정된 글에는 같은 시리즈의 글 목록이 표시된다. `/series/`에서는 전체 시리즈를 글 수가 많은 순서로 보여 주며, 각 시리즈 안에서는 `seriesOrder`가 작은 글부터 정렬한다. `seriesOrder`를 생략한 글은 순서를 지정한 글 뒤에 배치된다.

## Markdown과 MDX

대부분의 글은 `.md`로 충분하다. 제목, 목록, 인용문, 표, 링크, 이미지와 코드 블록 같은 일반적인 Markdown 문법을 그대로 사용할 수 있다.

```markdown
## 소제목

- 첫 번째 항목
- 두 번째 항목

> 인용문

[링크](https://example.com)
![대체 텍스트](./images/example.avif)
```

Astro나 Svelte 컴포넌트를 글 안에서 직접 사용해야 할 때만 `.mdx`를 선택한다. MDX 파일에서는 컴포넌트를 가져온 뒤 JSX 형태로 배치할 수 있다.

```mdx
import Badge from "@components/common/Badge.astro";

<Badge>MDX에서 렌더링한 배지</Badge>
```

:::note
단순한 글을 MDX로 만들면 작성과 유지보수 비용만 늘어날 수 있다. 인터랙션이나 재사용 컴포넌트가 필요한 경우에만 MDX를 사용한다.
:::

## 알림 상자와 확장 요소

중요한 설명은 Admonition 문법으로 강조할 수 있다.

```markdown
:::tip[작은 팁]
독자가 바로 실행할 수 있는 내용을 짧게 적는다.
:::

:::warning
되돌리기 어렵거나 주의가 필요한 내용을 적는다.
:::
```

`note`, `tip`, `info`, `warning`, `danger` 유형을 사용할 수 있다. 모양은 `src/config/siteConfig.ts`의 Markdown 관련 설정에서 GitHub, Obsidian, VitePress, Docusaurus 테마 중 하나로 선택한다.

GitHub 저장소 카드는 저장소 주소를 반복해서 설명하는 대신 다음처럼 넣는다.

```markdown
::github{repo="CuteLeaf/Firefly"}
```

긴 설명을 접어 둘 때는 HTML의 `details` 요소도 유용하다.

```html
<details>
  <summary>자세히 보기</summary>

  접혀 있을 내용
</details>
```

## 코드 블록

Firefly의 코드 블록은 Expressive Code를 기반으로 한다. 언어 이름만 붙여도 구문 강조가 적용되고, 제목·줄 번호·강조·추가와 삭제 표시를 함께 사용할 수 있다.

````markdown
```ts title="example.ts" showLineNumbers {2} ins={3}
const message = "Firefly";
console.log(message);
export default message;
```
````

긴 코드의 일부는 `collapse`로 접을 수 있다.

````markdown
```ts collapse={1-5, 20-30}
// 긴 예제 코드
```
````

여러 언어 또는 패키지 관리자 명령을 나란히 보여 줄 때는 MDX의 탭 컴포넌트를 사용할 수 있지만, 한두 개의 짧은 명령이라면 일반 코드 블록이 읽기 쉽다.

## 수식

KaTeX 문법으로 인라인 수식과 블록 수식을 작성할 수 있다. 문장 안에서는 `$E = mc^2$`처럼 쓰고, 독립된 식은 `$$`로 감싼다.

```markdown
원의 넓이는 $A = \pi r^2$이다.

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

실제 렌더링 결과는 다음과 같다.

원의 넓이는 $A = \pi r^2$이다.

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## Mermaid와 PlantUML 다이어그램

간단한 흐름도나 문서에 가까운 다이어그램은 Mermaid가 편하다.

````markdown
```mermaid
flowchart LR
  Draft[초안 작성] --> Review[검토]
  Review --> Build[빌드]
  Build --> Publish[배포]
```
````

```mermaid
flowchart LR
  Draft[초안 작성] --> Review[검토]
  Review --> Build[빌드]
  Build --> Publish[배포]
```

UML 표기나 복잡한 소프트웨어 구조를 표현할 때는 PlantUML을 사용할 수 있다.

````markdown
```plantuml
@startuml
actor Writer
participant Firefly
participant Astro

Writer -> Firefly: Markdown 작성
Firefly -> Astro: 콘텐츠 빌드
Astro --> Writer: 정적 사이트 생성
@enduml
```
````

다이어그램은 한 글에 너무 많이 넣으면 빌드 시간과 가독성이 모두 나빠질 수 있다. 본문을 보조하는 한두 개의 핵심 그림에 사용하는 편이 좋다.

## Wiki Link로 글 연결하기

Obsidian에서 글을 관리한다면 Wiki Link 문법을 그대로 사용할 수 있다.

```markdown
[[cognitive-surrender]]
[[cognitive-surrender|AI와 함께 코딩하며 느낀 점]]
[[cognitive-surrender#압도되는-것과-항복하는-것|관련 문단으로 이동]]
```

파일 경로나 파일 이름을 기준으로 연결하며, 표시 제목과 제목 앵커도 지정할 수 있다. 현재 페이지 안의 제목으로 이동할 때는 `[[#제목|표시 문구]]` 형태를 사용한다.

이미지 첨부를 뜻하는 Obsidian의 `![[image.png]]` 문법은 지원 대상이 아니므로 일반 Markdown 이미지 문법을 사용한다.

## 이미지와 동영상

글과 함께 관리하는 이미지는 글 파일을 기준으로 상대 경로를 사용한다.

```markdown
![이미지 설명](./images/example.avif)
```

`public` 아래의 파일은 `/images/example.avif`처럼 루트 경로로 참조한다. 중요한 글자나 로고가 있는 표지는 목록과 그리드 양쪽에서 잘리지 않도록 중앙에 충분한 여백을 둔다.

YouTube처럼 임베드 코드를 제공하는 서비스는 HTML을 Markdown에 직접 넣을 수 있다.

```html
<iframe
  width="100%"
  height="468"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="YouTube video player"
  allowfullscreen
></iframe>
```

외부 플레이어는 개인정보 보호, 자동 재생, 모바일 크기와 로딩 비용을 함께 확인해야 한다.

## 비밀번호로 글 보호하기

Frontmatter에 `password`를 넣으면 Firefly가 빌드 과정에서 본문을 암호화한다.

```yaml
password: "긴 비밀번호"
passwordHint: "나만 알아볼 수 있는 힌트"
```

방문자가 올바른 비밀번호를 입력하면 브라우저에서 내용을 복호화한다. 비밀번호 자체를 저장소에 커밋하는 구조이므로 진짜 비밀이나 민감한 자료를 보관하는 용도로 생각해서는 안 된다. 제한적으로 공유할 글을 가볍게 가리는 기능에 가깝다.

## 레이아웃 설정

사이트 전체 설정은 주로 `src/config`에서 관리한다.

- `siteConfig.ts`: 사이트 정보, 글 목록, 내비게이션과 페이지 기능
- `sidebarConfig.ts`: 사이드바 위치와 위젯 구성
- `backgroundWallpaper.ts`: 배경 이미지와 전체 화면 효과
- `commentConfig.ts`: 댓글 제공자와 글별 댓글 동작
- `fontConfig.ts`: 글꼴과 로딩 방식

사이드바는 왼쪽, 오른쪽 또는 양쪽에 둘 수 있다.

```ts
// src/config/sidebarConfig.ts
export const sidebarLayoutConfig = {
  enable: true,
  position: "left",
  showBothSidebarsOnPostPage: true,
};
```

글 목록은 목록형과 그리드형을 선택할 수 있다.

```ts
// src/config/siteConfig.ts
postListLayout: {
  defaultMode: "grid",
  mobileDefaultMode: "list",
  coverPosition: "right",
  grid: {
    masonry: true,
    columnWidth: 320,
  },
},
```

설정을 바꿀 때는 타입 정의와 실제 설정 모듈을 함께 확인한다. 스크롤이나 전체 화면 배경 효과는 모바일 성능에 직접 영향을 주므로 시각적인 변화만 보고 값을 크게 올리지 않는다.

## 발행 전 확인

글을 추가하거나 설정을 바꾼 뒤에는 다음 명령을 순서대로 실행한다.

```bash
pnpm check
pnpm type-check
pnpm build
```

`pnpm dev`로 목록형과 그리드형 카드, 모바일 너비, 글 상세 페이지의 목차와 이미지 잘림도 확인한다. 글 표지나 생성 이미지가 바뀌었다면 `pnpm lqips`가 갱신한 `src/constants/lqips.json`도 함께 검토한다.

## 정리

이 글은 Firefly의 모든 기능을 복제한 문서가 아니다. 내 블로그에서 실제로 사용하는 작성 흐름과 잊기 쉬운 문법을 한곳에 모은 개인 메모다. 테마가 업데이트되면서 세부 옵션이 달라질 수 있으므로 다음 순서로 확인한다.

1. 현재 저장소의 `src/config`와 타입 정의
2. [Firefly 공식 문서](https://docs-firefly.cuteleaf.cn)
3. [Firefly GitHub 저장소](https://github.com/CuteLeaf/Firefly)
4. Astro 자체 동작은 [Astro 공식 문서](https://docs.astro.build)

예제 글 여러 개가 아카이브를 채우는 대신, 앞으로는 이 글을 실제 사용 경험에 맞춰 조금씩 고쳐 나갈 생각이다.
