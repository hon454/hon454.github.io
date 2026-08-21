---
title: Firefly Wiki Link 내부 링크 예시
published: 1970-01-03
description: Firefly 글에서 Obsidian 스타일의 Wiki Link 내부 링크를 사용하고 글 링크 카드를 자동 생성합니다.
image: ""
tags: [Markdown, Obsidian, Wiki-Link, 글 예시]
category: 블로그 가이드
slug: guide/firefly-wiki-link
---

Firefly는 Markdown과 MDX 글에서 Obsidian 스타일의 Wiki Link 내부 링크를 지원합니다. 링크 대상에는 확장자를 제외한 글의 slug나 파일 경로를 입력합니다. 자세한 일치 규칙은 아래의 '링크 대상을 쓰는 세 가지 방법'을 참고하세요.

## 글 링크 카드

`[[slug]]`가 별도 문단에 있으면 대상 글의 제목, 설명, 발행일, 카테고리, 태그, 표지를 자동으로 읽어 링크 카드로 렌더링합니다.

```markdown
[[firefly]]

[[guide/index]]

[[markdown-extended]]
```

[[firefly]]

[[guide/index]]

[[markdown-extended]]

## 인라인 링크

`[[slug]]`가 본문 중간에 있으면 일반 링크로 렌더링하며 링크 문구에는 대상 글의 제목을 자동으로 사용합니다.

```markdown
테마의 특징은 [[firefly]]를 참고하세요.
```

테마의 특징은 [[firefly]]를 참고하세요.

## 표시 제목 사용자 지정

`|` 뒤에 링크에 표시할 문구를 입력합니다. 인라인 링크에서는 글 제목을 이 문구로 바꿉니다. 별도 문단에서는 계속 카드로 렌더링하되 카드 제목에 사용자 지정 문구를 사용하고 설명, 시간, 카테고리, 태그, 표지는 대상 글에서 읽습니다.

```markdown
테마의 특징은 [[firefly|테마 소개]]를 참고하세요.

[[firefly|Firefly 테마 소개]]
```

테마의 특징은 [[firefly|테마 소개]]를 참고하세요.

[[firefly|Firefly 테마 소개]]

예외가 하나 있습니다. `|` 뒤의 문구가 링크 대상을 그대로 반복한 것뿐이면(`[[guide/index|index]]`) 유효하지 않은 별칭으로 보아 무시하고 글 제목을 표시합니다. Obsidian은 메모에 긴 경로가 보이지 않도록 링크를 삽입할 때 이런 별칭을 자동으로 붙이므로 이를 처리하기 위한 예외입니다.

## 링크 대상을 쓰는 세 가지 방법

Obsidian으로 글을 관리할 때는 `src/content/posts` 디렉터리 자체를 Obsidian 보관소(vault)로 여세요. 아래에서 말하는 '보관소 루트 디렉터리'는 이 디렉터리를 뜻하며 Firefly가 링크 경로를 해석하는 시작점이기도 합니다.

링크 대상은 다음 순서로 찾습니다.

| 형식 | 예시 | Obsidian 지원 |
|---|---|---|
| Frontmatter의 `slug` | `[[firefly-wiki-link]]` | ✗ 미지원 |
| 파일 경로(보관소 루트 기준) | `[[guide/firefly-layout-system]]` | ✓ 설정 변경 필요(권장) |
| 파일 이름만 사용(보관소에서 고유할 때) | `[[firefly-layout-system]]` | ✓ 기본 지원 |

### 첫 번째: slug

`slug` 형식은 Obsidian에서 지원하지 않습니다. `slug`는 Firefly 고유 개념이고 Obsidian은 Frontmatter의 `slug`를 읽지 않으므로 자동 완성도 되지 않고 클릭할 수도 없습니다. 빌드된 사이트에서만 이동할 수 있습니다. 주로 Obsidian에서 글을 쓴다면 아래 두 형식을 사용하세요.

### 두 번째: 파일 경로(권장)

파일 경로 형식을 쓰려면 Obsidian에서 `설정 → 파일 및 링크 → 링크 → 새 링크 형식`을 **보관소 루트 기준 절대 경로**로 바꿔야 합니다. 그러면 Obsidian이 삽입한 링크에 디렉터리가 포함됩니다.

```markdown
[[guide/firefly-layout-system|firefly-layout-system]]
```

[[guide/firefly-layout-system|firefly-layout-system]]

보관소 루트가 `src/content/posts`이므로 Obsidian이 작성한 경로와 Firefly가 요구하는 경로가 정확히 같아 별도 변환이 필요하지 않습니다.

위 줄 끝의 `|firefly-layout-system`은 Obsidian이 자동으로 추가한 별칭입니다. Firefly는 이를 무시하고 카드 제목에 글의 title을 사용합니다. 파일 이름과 다르게 수정했을 때만 바꾼 별칭을 사용합니다.

내부 링크 형식의 **현재 노트 기준 상대 경로**는 같은 디렉터리 안에서만 사용할 수 있습니다. 같은 디렉터리의 글에는 파일 이름만 만들어 정상적으로 찾지만, 다른 디렉터리에는 `../` 접두사를 만들어 Firefly가 해석하지 못하고 원문 그대로 표시합니다.

### 세 번째: 파일 이름만 사용

'내부 링크 형식'의 기본값은 **가능한 한 짧은 형식**입니다. 파일 이름이 보관소 전체에서 고유하다면 Obsidian은 디렉터리 없이 파일 이름만 삽입합니다. 설정을 바꾸지 않아도 되며 전체 경로를 쓴 것과 같은 결과를 냅니다.

```markdown
[[firefly-layout-system]]
```

[[firefly-layout-system]]

같은 파일 이름이 있으면 이 형식은 실패하고 빌드 로그에 안내가 표시됩니다. 전체 파일 경로를 사용하면 해결됩니다. 따라서 Obsidian 내부 링크 형식을 **보관소 루트 기준 절대 경로**로 바꾸고 두 번째 방식을 사용하는 것을 권장합니다.

## 다른 글의 제목으로 연결

글 slug 뒤에 `#제목`을 추가합니다. 제목 앵커가 있는 링크는 항상 일반 링크로 렌더링됩니다.

[[code-examples#구문-강조|코드 블록 구문 강조 보기]]

[[guide/firefly-layout-system#관련-링크|firefly-layout-system]]

```markdown
[[code-examples#구문-강조|코드 블록 구문 강조 보기]]

[[guide/firefly-layout-system#관련-링크|firefly-layout-system]]
```

제목 앵커는 페이지 제목과 같은 slug 규칙을 사용하므로 언어, 공백, 대소문자는 페이지에서 실제 생성된 ID에 따라 처리됩니다.

## 현재 페이지의 제목으로 연결

글 slug를 생략하고 제목만 쓰면 현재 글로 연결됩니다.

[[#현재-페이지-대상|현재 페이지 대상으로 이동]]

```markdown
[[#현재-페이지-대상|현재 페이지 대상으로 이동]]
```

## 현재 페이지 대상

현재 페이지의 Wiki Link가 가리키는 제목입니다.

## 첨부 파일 임베드는 지원하지 않음

첨부 파일 임베드 문법은 현재 변환하지 않으며 원문 그대로 표시합니다.

![[image.png]]

인라인 코드와 코드 블록 안의 `[[firefly]]`도 변환하지 않습니다.
