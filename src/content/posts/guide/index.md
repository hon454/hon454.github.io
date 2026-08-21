---
title: Firefly 간단 사용 가이드
published: 1970-01-02
pinned: false
description: "Firefly 블로그 템플릿 사용 방법"
image: "./cover.avif"
tags: ["Firefly", "블로그", "Markdown", "가이드"]
category: 블로그 가이드
---



이 블로그 템플릿은 [Astro](https://astro.build/)를 기반으로 합니다. 이 가이드에서 다루지 않은 내용은 [Astro 문서](https://docs.astro.build/)를 참고하세요.

## 글의 Frontmatter

```yaml
---
title: 나의 첫 블로그 글
published: 2023-09-09
description: 새 Astro 블로그의 첫 번째 글입니다.
image: ./cover.jpg
tags: [프런트엔드, 개발]
category: 프런트엔드 개발
draft: false
---
```




| 속성          | 설명                                                                                                                                                                                                 |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`       | 글 제목                                                                                                                                                                                          |
| `published`   | 글 발행일                                                                                                                                                                                      |
| `updated`     | 글 수정일. 설정하지 않으면 발행일을 사용합니다.                                                                                                                                                      |
| `pinned`      | 글 목록 맨 위에 고정할지 여부                                                                                                                                                                    |
| `description` | 홈페이지에 표시할 짧은 글 설명                                                                                                                                                                      |
| `image`       | 글 표지 이미지 경로.<br/>1. `http://` 또는 `https://`로 시작: 원격 이미지<br/>2. `/`로 시작: `public` 디렉터리의 이미지<br/>3. 접두사 없음: Markdown 파일 기준 상대 경로 |
| `tags`        | 글 태그                                                                                                                                                                                          |
| `category`    | 글 카테고리                                                                                                                                                                                          |
| `lang`        | 글 언어 코드(예: `zh-CN`). 글 언어가 사이트 기본 언어와 다를 때만 설정합니다.                                                                                                                                    |
| `licenseName` | 글 콘텐츠의 라이선스 이름                                                                                                                                                                              |
| `licenseUrl`  | 글 콘텐츠의 라이선스 링크                                                                                                                                                                              |
| `author`      | 글 작성자                                                                                                                                                                                          |
| `sourceLink`  | 글 출처 링크 또는 참고 자료                                                                                                                                                                          |
| `draft`       | 초안이면 글을 표시하지 않습니다.                                                                                                                                                                  |
| `comment`     | 댓글 기능 사용 여부. 기본값은 `true`입니다.                                                                                                                                                           |
| `slug`        | 사용자 지정 글 URL 경로. 설정하지 않으면 파일 이름을 사용합니다.                                                                                                                                              |
| `password`    | 글 비밀번호. 설정하면 AES-256-GCM으로 콘텐츠를 암호화하며 방문자는 비밀번호를 입력해야 볼 수 있습니다.                                                                                                                              |
| `passwordHint`| 비밀번호 입력란 위에 표시할 힌트. 방문자가 비밀번호를 떠올리는 데 도움을 주며 생략할 수 있습니다.                                                                                                                                                    |

## 글 파일 위치

글 파일은 `src/content/posts/` 디렉터리에 둡니다. 하위 디렉터리를 만들어 글과 리소스를 더 체계적으로 정리할 수도 있습니다.

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```

## 사용자 지정 글 URL (Slug)

### Slug란?

Slug는 글 URL 경로에서 사용자가 정하는 부분입니다. 설정하지 않으면 파일 이름을 URL로 사용합니다.

### Slug 사용 예시

#### 예시 1: 파일 이름을 URL로 사용
```yaml
---
title: 나의 첫 블로그 글
published: 2023-09-09
---
```
파일: `src/content/posts/my-first-blog-post.md`

URL：`/posts/my-first-blog-post`

#### 예시 2: Slug 직접 지정
```yaml
---
title: 나의 첫 블로그 글
published: 2023-09-09
slug: hello-world
---
```
파일: `src/content/posts/my-first-blog-post.md`

URL：`/posts/hello-world`

#### 예시 3: 다른 언어 파일 이름에 Slug 사용
```yaml
---
title: Firefly 블로그 테마 사용 방법
published: 2023-09-09
slug: how-to-use-firefly-blog-theme
---
```
파일: `src/content/posts/Firefly-블로그-테마-사용법.md`

URL：`/posts/how-to-use-firefly-blog-theme`

### Slug 사용 권장 사항

1. **영문과 하이픈 사용**: `my awesome post` 대신 `my-awesome-post`
2. **간결하게 유지**: 지나치게 긴 slug는 피하세요.
3. **설명적으로 작성**: URL이 글 내용을 드러내게 하세요.
4. **특수 문자 제외**: 문자, 숫자, 하이픈만 사용하세요.
5. **일관성 유지**: 블로그 전체에서 비슷한 이름 규칙을 사용하세요.

### 주의 사항

- Slug를 설정해 발행한 뒤에는 SEO와 기존 링크에 영향을 주지 않도록 함부로 바꾸지 않는 것이 좋습니다.
- 여러 글이 같은 slug를 사용하면 뒤의 글이 앞의 글을 덮어씁니다.
- Slug는 자동으로 소문자로 변환됩니다.
