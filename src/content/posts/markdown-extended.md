---
title: Markdown 확장 기능
published: 1970-01-01
updated: 1970-01-01
description: "Firefly의 Markdown 기능 알아보기"
image: ""
tags: [데모, 예시, Markdown, Firefly]
category: "글 예시"
slug: markdown-extended
---

## GitHub 저장소 카드

GitHub 저장소로 연결되는 동적 카드를 추가할 수 있습니다. 페이지를 불러올 때 GitHub API에서 저장소 정보를 가져옵니다.

::github{repo="CuteLeaf/Firefly"}

`::github{repo="CuteLeaf/Firefly"}` 코드로 GitHub 저장소 카드를 만듭니다.

```markdown
::github{repo="CuteLeaf/Firefly"}
```

## 알림 상자(Admonitions) 설정

Firefly는 [rehype-callouts](https://github.com/lin-stephanie/rehype-callouts) 플러그인을 사용하며 `GitHub`, `Obsidian`, `VitePress`, `Docusaurus`의 네 가지 알림 상자 테마를 지원합니다. `src/config/siteConfig.ts`에서 설정할 수 있습니다.

```typescript
// src/config/siteConfig.ts
export const siteConfig: SiteConfig = {
  // ...
  rehypeCallouts: {
    // 선택지: "github" | "obsidian" | "vitepress" | "docusaurus"
    theme: "github",
  },
  // ...
};
```

주의: **설정을 바꾼 뒤에는 개발 서버를 다시 시작해야 적용됩니다.**

아래는 각 테마가 지원하는 유형입니다. 테마마다 스타일과 문법이 다르므로 취향에 맞게 선택하세요.

### 1. GitHub 테마 스타일

GitHub가 공식 지원하는 다섯 가지 기본 유형입니다.

![GitHub](./images/github.avif)

**기본 문법**

```markdown
> [!NOTE] NOTE
> 사용자가 참고해야 할 정보를 강조합니다.

> [!TIP] TIP
> 작업을 더 원활하게 진행하는 데 도움이 되는 선택 정보입니다.

> [!IMPORTANT] IMPORTANT
> 작업을 성공하는 데 꼭 필요한 핵심 정보입니다.

> [!WARNING] WARNING
> 즉시 주의해야 할 핵심 내용입니다.

> [!CAUTION] CAUTION
> 작업으로 인해 발생할 수 있는 부정적 결과입니다.

> [!NOTE] 사용자 지정 제목
> 사용자 지정 제목이 있는 예시입니다.
```

---

### 2. Obsidian 테마 스타일

[Obsidian](https://obsidian.md/) 스타일은 매우 다양한 유형과 별칭을 지원합니다.

<details>
<summary>클릭하여 Obsidian 문법 목록 펼치기</summary>

```markdown

> [!NOTE] NOTE
> 일반 메모 블록입니다.

> [!ABSTRACT] ABSTRACT
> 글의 요약입니다.

> [!SUMMARY] SUMMARY
> 글의 요약(Abstract와 같음)입니다.

> [!TLDR] TLDR
> 너무 길어서 읽지 않은 사람을 위한 요약(Abstract와 같음)입니다.

> [!INFO] INFO
> 추가 정보를 제공합니다.

> [!TODO] TODO
> 완료해야 할 작업입니다.

> [!TIP] TIP
> 유용한 요령이나 팁입니다.

> [!HINT] HINT
> 힌트(Tip과 같음)입니다.

> [!IMPORTANT] IMPORTANT
> 중요한 정보입니다(Obsidian 스타일에서는 보통 비슷한 아이콘을 사용함).

> [!SUCCESS] SUCCESS
> 작업이 성공했습니다.

> [!CHECK] CHECK
> 검사를 통과했습니다(Success와 같음).

> [!DONE] DONE
> 완료되었습니다(Success와 같음).

> [!QUESTION] QUESTION
> 질문을 제시합니다.

> [!HELP] HELP
> 도움을 요청합니다(Question과 같음).

> [!FAQ] FAQ
> 자주 묻는 질문입니다(Question과 같음).

> [!WARNING] WARNING
> 경고 정보입니다.

> [!CAUTION] CAUTION
> 주의 사항입니다(Warning과 같음).

> [!ATTENTION] ATTENTION
> 주의를 환기합니다(Warning과 같음).

> [!FAILURE] FAILURE
> 작업이 실패했습니다.

> [!FAIL] FAIL
> 실패했습니다(Failure와 같음).

> [!MISSING] MISSING
> 내용이 누락되었습니다(Failure와 같음).

> [!DANGER] DANGER
> 위험한 작업에 대한 경고입니다.

> [!ERROR] ERROR
> 오류 정보입니다(Danger와 같음).

> [!BUG] BUG
> 소프트웨어 결함을 알립니다.

> [!EXAMPLE] EXAMPLE
> 예시를 보여 줍니다.

> [!QUOTE] QUOTE
> 문장을 인용합니다.

> [!CITE] CITE
> 인용문입니다(Quote와 같음).

> [!NOTE] 사용자 지정 제목
> 사용자 지정 제목이 있는 예시입니다.
```
</details>

![Obsidian](./images/obsidian.avif)

---

### 3. VitePress 테마 스타일

[VitePress](https://vitepress.dev/) 스타일은 현대적이고 평면적인 기본 디자인을 제공합니다. 현재는 GitHub와 같은 **다섯 가지** 기본 유형을 포함합니다.

<details>
<summary>클릭하여 VitePress 문법 목록 펼치기</summary>

```markdown
> [!NOTE] NOTE
> GitHub의 Note에 해당합니다.

> [!TIP] TIP
> GitHub의 Tip에 해당합니다.

> [!IMPORTANT] IMPORTANT
> GitHub의 Important에 해당합니다.

> [!WARNING] WARNING
> GitHub의 Warning에 해당합니다.

> [!CAUTION] CAUTION
> GitHub의 Caution에 해당합니다.

> [!TIP] 사용자 지정 제목
> VitePress 스타일도 사용자 지정 제목을 지원합니다.
```
</details>

![VitePress](./images/vitepress.avif)

---

### 4. Docusaurus 테마 스타일

[Docusaurus](https://docusaurus.io/docs/markdown-features/admonitions) 스타일은 현대적인 알림 상자 디자인과 다섯 가지 유형을 제공합니다.

<details>
<summary>클릭하여 Docusaurus 문법 목록 펼치기</summary>

다음 유형의 알림 상자를 지원합니다: `note` `tip` `info` `warning` `danger`

```markdown
:::note
빠르게 훑어볼 때도 사용자가 참고해야 할 정보를 강조합니다.
:::

:::tip
작업을 더 원활하게 진행하는 데 도움이 되는 선택 정보입니다.
:::

:::info
일반 정보입니다.
:::

:::warning
잠재적 위험 때문에 사용자가 즉시 주의해야 할 핵심 내용입니다.
:::

:::danger
작업으로 인해 발생할 수 있는 부정적 결과입니다.
:::

:::tip[사용자 지정 제목]
작업을 더 원활하게 진행하는 데 도움이 되는 선택 정보입니다.
:::
```

</details>

![Docusaurus](./images/docusaurus.avif)

---

## 스포일러

텍스트에 스포일러를 적용할 수 있으며 **Markdown** 문법도 지원합니다.

내용이 :spoiler[숨겨졌습니다 **하하**]!

```markdown
내용이 :spoiler[숨겨졌습니다 **하하**]!
```

## 이미지 갤러리 그리드 (Image Grid)

`[grid]`와 `[/grid]` 태그를 사용하면 여러 이미지를 세로 방향으로 나란히 표시할 수 있습니다. 사진 갤러리나 비교 이미지를 보여 줄 때 유용하며, 시스템은 포함된 이미지 수에 따라 반응형 그리드로 자동 배치합니다(한 줄에 최대 네 장).

**이미지 높이 자동 맞춤:** 같은 줄에 높이, 크기, 비율이 다른 이미지가 있으면 갤러리 격자처럼 공간을 자동으로 채웁니다. 짧거나 비율이 맞지 않는 이미지는 `object-cover`로 가운데를 잘라 맞춥니다. 테두리는 틈 없이 수평으로 정렬되지만 잘린 전체 이미지는 라이트박스에서만 볼 수 있으므로, 가능하면 같은 줄에 종횡비가 다른 이미지를 섞지 않는 것이 좋습니다.

**캡션 하단 정렬:** 이미지 크기와 비율이 달라도 같은 줄의 모든 이미지 설명(캡션)은 동일한 수평 기준선에 맞춰집니다.

[grid]
![예시 이미지 1](./images/firefly1.avif)
![예시 이미지 2](./images/firefly2.avif)
![예시 이미지 3](./images/firefly3.avif)
[/grid]

**기본 문법**

```markdown
[grid]
![예시 이미지 1](./images/firefly1.avif)
![예시 이미지 2](./images/firefly2.avif)
![예시 이미지 3](./images/firefly3.avif)
[/grid]
```


---
