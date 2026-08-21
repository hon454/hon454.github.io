---
title: Markdown Mermaid 다이어그램
published: 1970-01-01
pinned: false
description: Mermaid를 포함한 간단한 Markdown 블로그 글 예시입니다.
tags: [Markdown, 블로그, Mermaid, Firefly]
category: 글 예시
slug: markdown-mermaid
---
## Markdown의 Mermaid 다이어그램 완벽 가이드

이 글은 Markdown 문서에서 Mermaid로 흐름도, 시퀀스 다이어그램, ER 다이어그램, 클래스 다이어그램, 상태 다이어그램, XY 차트, 간트 차트, 마인드맵 등 여러 복잡한 다이어그램을 만드는 방법을 보여 줍니다.

> Mermaid 다이어그램은 [Merman](https://github.com/Latias94/merman)으로 구현됩니다. Firefly는 Astro 빌드 단계에서 라이트·다크 테마용 정적 SVG를 생성하므로 브라우저에서 Mermaid 렌더링 런타임을 불러올 필요가 없습니다. [Merman Playground](http://frankorz.com/merman/)에서 문법을 실시간으로 편집하고 결과를 미리 볼 수 있습니다.

## 흐름도 예시

흐름도는 프로세스나 알고리즘 단계를 표현하는 데 적합합니다.




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

## 시퀀스 다이어그램 예시

시퀀스 다이어그램은 시간에 따른 객체 간 상호 작용을 보여 줍니다.

```mermaid
sequenceDiagram
    participant User as 사용자
    participant WebApp as 웹 앱
    participant Server as 서버
    participant Database as 데이터베이스

    User->>WebApp: 로그인 요청 제출
    WebApp->>Server: 인증 요청 전송
    Server->>Database: 사용자 자격 증명 조회
    Database-->>Server: 사용자 데이터 반환
    Server-->>WebApp: 인증 결과 반환
    
    alt 인증 성공
        WebApp->>User: 환영 페이지 표시
        WebApp->>Server: 사용자 데이터 요청
        Server->>Database: 사용자 환경 설정 조회
        Database-->>Server: 환경 설정 반환
        Server-->>WebApp: 사용자 데이터 반환
        WebApp->>User: 맞춤 화면 로드
    else 인증 실패
        WebApp->>User: 오류 메시지 표시
        WebApp->>User: 다시 입력하도록 안내
    end
```

## ER 다이어그램 예시

ER 다이어그램(개체 관계도)은 데이터베이스 구조를 표현하는 데 적합합니다.

```mermaid
erDiagram
    USER {
        int id PK
        string username
        string email
        datetime created_at
    }
    ARTICLE {
        int id PK
        string title
        text content
        datetime published
        int author_id FK
    }
    COMMENT {
        int id PK
        text content
        datetime created_at
        int user_id FK
        int article_id FK
    }
    CATEGORY {
        int id PK
        string name
        string description
    }
    USER ||--o{ ARTICLE : "writes"
    USER ||--o{ COMMENT : "posts"
    ARTICLE ||--o{ COMMENT : "has"
    ARTICLE }o--o{ CATEGORY : "belongs to"
```

## 클래스 다이어그램 예시

클래스 다이어그램은 클래스, 속성, 메서드와 그 관계를 포함한 시스템의 정적 구조를 보여 줍니다.

```mermaid
classDiagram
    class User {
        +String username
        +String password
        +String email
        +Boolean active
        +login()
        +logout()
        +updateProfile()
    }
    
    class Article {
        +String title
        +String content
        +Date publishDate
        +Boolean published
        +publish()
        +edit()
        +delete()
    }
    
    class Comment {
        +String content
        +Date commentDate
        +addComment()
        +deleteComment()
    }
    
    class Category {
        +String name
        +String description
        +addArticle()
        +removeArticle()
    }
    
    User "1" -- "*" Article : 작성
    User "1" -- "*" Comment : 게시
    Article "1" -- "*" Comment : 포함
    Article "1" -- "*" Category : 소속
```

## 상태 다이어그램 예시

상태 다이어그램은 객체가 수명 주기 동안 거치는 상태의 흐름을 보여 줍니다.

```mermaid
stateDiagram-v2
    [*] --> 초안
    
    초안 --> 검토중 : 제출
    검토중 --> 초안 : 거절
    검토중 --> 승인됨 : 승인
    승인됨 --> 발행됨 : 발행
    발행됨 --> 보관됨 : 보관
    발행됨 --> 초안 : 회수
    
    state 발행됨 {
        [*] --> 활성
        활성 --> 숨김 : 임시 숨김
        숨김 --> 활성 : 복원
        활성 --> [*]
        숨김 --> [*]
    }
    
    보관됨 --> [*]
```

## XY 차트 예시

XY 차트는 추세와 비교 데이터를 보여 주는 데 적합합니다.

```mermaid
xychart-beta
    title "월별 방문 추세"
    x-axis [1월, 2월, 3월, 4월, 5월, 6월]
    y-axis "방문 수" 0 --> 5000
    bar [2500, 3200, 4100, 3800, 4500, 4800]
    line [2500, 3200, 4100, 3800, 4500, 4800]
```

## 원형 차트 예시

원형 차트는 각 부분이 전체에서 차지하는 비율을 직관적으로 보여 줍니다.

```mermaid
pie showData
    title 콘텐츠 유형 비율
    "기술 글" : 45
    "프로젝트 기록" : 30
    "일상 에세이" : 15
    "기타" : 10
```

## 간트 차트 예시

간트 차트는 시간축에 따라 프로젝트 단계, 작업 의존성, 현재 진행 상황을 보여 줍니다.

```mermaid
gantt
    title 블로그 버전 출시 계획
    dateFormat YYYY-MM-DD
    axisFormat %m/%d
    section 준비
    요구 사항 정리 :done, req, 2026-07-01, 3d
    시각 디자인 :done, design, after req, 4d
    section 개발
    기능 구현 :active, dev, after design, 7d
    콘텐츠 이전 :content, after design, 5d
    section 출시
    빌드 검사 :test, after dev, 2d
    정식 공개 :milestone, release, after test, 0d
```

## 마인드맵 예시

마인드맵은 주제 계층과 지식 구조를 정리하는 데 적합합니다.

```mermaid
mindmap
  root((Firefly))
    콘텐츠
      기술 글
      일상 기록
    경험
      검색
      다크 모드
      다이어그램
    엔지니어링
      Astro
      Svelte
      Merman
```

## 타임라인 예시

타임라인은 프로젝트의 중요한 사건을 연도나 단계별로 보여 줍니다.

```mermaid
timeline
    title Firefly 발전 타임라인
    2024 : 블로그 개설
         : 기본 테마 완성
    2025 : 검색과 갤러리 추가
         : 콘텐츠 시스템 개선
    2026 : Astro 7 업그레이드
         : Merman으로 다이어그램 렌더링
```

## 사용자 여정 지도 예시

사용자 여정 지도는 단계별 사용자의 행동과 경험 점수를 설명합니다.

```mermaid
journey
    title 독자가 글을 탐색하는 여정
    section 콘텐츠 발견
      홈 열기: 5: 독자
      주제 검색: 4: 독자
    section 글 읽기
      본문 읽기: 5: 독자
      다이어그램 보기: 5: 독자
    section 계속 탐색
      관련 글 보기: 4: 독자
      글 공유: 3: 독자
```

## Git 그래프 예시

Git 그래프는 브랜치, 커밋, 병합 기록을 명확하게 보여 줍니다.

```mermaid
gitGraph
    commit id: "init"
    branch feature
    checkout feature
    commit id: "add-diagrams"
    commit id: "polish-themes"
    checkout main
    merge feature id: "merge-feature"
    commit id: "release"
```

## 칸반 예시

칸반은 작업 단계별 태스크 분포를 보여 주는 데 적합합니다.

```mermaid
kanban
  todo[할 일]
    task1[요구 사항 정리]
    task2[예시 준비]
  doing[진행 중]
    task3[Merman 연동]
  done[완료]
    task4[서버 렌더링]
    task5[라이트·다크 테마]
```

## Sankey 다이어그램 예시

Sankey 다이어그램은 연결선 너비로 노드 사이의 흐름을 보여 줍니다.

```mermaid
sankey-beta
Home,Post list,1200
Home,Search,450
Post list,Post detail,900
Search,Post detail,320
Post detail,Related posts,260
Post detail,External shares,180
```

## 정리

Mermaid는 Markdown 문서에서 여러 유형의 다이어그램을 만드는 강력한 도구입니다. 이 글에서는 흐름도, 시퀀스·ER·클래스·상태 다이어그램, XY·원형·간트 차트, 마인드맵, 타임라인, 사용자 여정 지도, Git 그래프, 칸반, Sankey 다이어그램을 살펴봤습니다. 이런 시각화는 복잡한 개념과 프로세스, 데이터 구조를 더 명확하게 표현하는 데 도움을 줍니다.

Mermaid를 사용하려면 코드 블록 언어를 mermaid로 지정하고 간결한 텍스트 문법으로 다이어그램을 설명하면 됩니다. 빌드할 때 SVG로 자동 렌더링되므로 클라이언트 JavaScript를 불러올 필요가 없습니다.

[Merman Playground](http://frankorz.com/merman/)에서 더 많은 문법을 시험한 뒤 다이어그램 코드를 글에 붙여 넣어 보세요.
