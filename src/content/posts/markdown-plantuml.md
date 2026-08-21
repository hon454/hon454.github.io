---
title: Markdown PlantUML 다이어그램
published: 1970-01-01
description: Firefly의 PlantUML 플러그인 렌더링, 테마 전환, 상호 작용 기능을 확인하는 예시 글입니다.
tags: [PlantUML, Firefly, Markdown]
category: 글 예시
slug: markdown-plantuml
---

## Markdown의 PlantUML 다이어그램 가이드

PlantUML은 일반 텍스트로 다이어그램을 설명하는 도구입니다. 구조화된 문법만 작성하면 시퀀스, 클래스, 유스케이스, 활동 다이어그램 같은 일반적인 엔지니어링 다이어그램을 만들 수 있습니다.

기술 블로그와 프로젝트 문서에 특히 적합합니다.

- 다이어그램과 본문을 함께 버전 관리해 협업과 검토가 쉽습니다.
- 텍스트만 바꾸면 다이어그램을 수정할 수 있어 잦은 반복 작업에 적합합니다.
- Markdown과 자연스럽게 결합되어 문서의 일관성을 유지합니다.

Firefly에서는 `plantuml` 코드 블록을 빌드 단계에서 인코딩해 서버 SVG 주소를 생성합니다. 페이지는 라이트·다크 테마에 따라 이미지 소스를 자동 전환하며 확대·축소, 드래그, 전체 화면 기능을 지원합니다.

빠르게 시작하려면 다음 최소 템플릿을 기억하세요.

```plantuml
@startuml
Alice -> Bob: Hello
Bob --> Alice: Hi
@enduml
```

## 활동 다이어그램 예시

```plantuml
@startuml
start
:사용자가 주문 제출;
if (재고 충분?) then (예)
	:재고 예약;
	:결제 요청 생성;
	if (결제 성공?) then (예)
		:배송 지시 생성;
		:창고에 피킹 알림;
	else (아니요)
		:주문 취소;
		:재고 해제;
	endif
else (아니요)
	:품절 안내;
endif
stop
@enduml
```

## 상태 다이어그램 예시

```plantuml
@startuml
[*] --> 초안

초안 --> 검토대기 : 제출
검토대기 --> 초안 : 반려
검토대기 --> 발행됨 : 검토 통과
발행됨 --> 보관됨 : 만료 보관
발행됨 --> 초안 : 회수 후 수정

state 발행됨 {
	[*] --> 표시
	표시 --> 숨김 : 직접 숨김
	숨김 --> 표시 : 표시 복원
}

보관됨 --> [*]
@enduml
```

## 유스케이스 다이어그램 예시

```plantuml
@startuml
left to right direction
actor 방문자
actor 사용자
actor 관리자

rectangle 블로그시스템 {
	usecase "글 탐색" as UC1
	usecase "콘텐츠 검색" as UC2
	usecase "댓글 작성" as UC3
	usecase "좋아요와 저장" as UC4
	usecase "댓글 검토" as UC5
	usecase "글 발행" as UC6
}

방문자 --> UC1
방문자 --> UC2
사용자 --> UC1
사용자 --> UC2
사용자 --> UC3
사용자 --> UC4
관리자 --> UC5
관리자 --> UC6
@enduml
```

## 컴포넌트 다이어그램 예시

```plantuml
@startuml
package "Firefly Site" {
	[Astro App] as App
	[Markdown Parser] as Parser
	[PlantUML Encoder] as Encoder
	[Theme Switcher] as Theme
	[Search Indexer] as Search
}

cloud "PlantUML Server" as PU
database "Content Store" as Content

App --> Parser : parse markdown
Parser --> Encoder : encode plantuml blocks
Encoder --> PU : request svg
App --> Theme : switch dark/light src
App --> Search : build page index
Parser --> Content : read posts
@enduml
```

## 배포 다이어그램 예시

```plantuml
@startuml
node "User Device" {
	artifact "Browser"
}

node "CDN / Edge" {
	artifact "Static Assets"
}

node "Cloudflare Worker" {
	artifact "SSR Handler"
}

node "PlantUML Service" {
	artifact "SVG Renderer"
}

database "Object Storage" {
	artifact "Markdown Content"
}

"Browser" --> "Static Assets" : GET js/css/img
"Browser" --> "SSR Handler" : request page
"SSR Handler" --> "Markdown Content" : read post
"Browser" --> "SVG Renderer" : fetch diagram svg
@enduml
```

## ER 다이어그램 예시

```plantuml
@startuml
entity User {
	*id : uuid <<PK>>
	--
	username : varchar
	email : varchar
	created_at : datetime
}

entity Post {
	*id : uuid <<PK>>
	--
	author_id : uuid <<FK>>
	title : varchar
	content : text
	published_at : datetime
}

entity Comment {
	*id : uuid <<PK>>
	--
	post_id : uuid <<FK>>
	user_id : uuid <<FK>>
	body : text
	created_at : datetime
}

User ||--o{ Post : writes
User ||--o{ Comment : creates
Post ||--o{ Comment : has
@enduml
```

## 시퀀스 다이어그램 예시(로그인과 토큰 갱신)

```plantuml
@startuml
autonumber
actor User as 사용자
participant Web as 프런트엔드페이지
participant API as API게이트웨이
participant Auth as 인증서비스
database Redis as 세션캐시

사용자 -> 프런트엔드페이지 : 계정과 비밀번호 입력 후 제출
프런트엔드페이지 -> API게이트웨이 : POST /login
API게이트웨이 -> 인증서비스 : 자격 증명 검증
인증서비스 -> 세션캐시 : refresh_token 저장
인증서비스 --> API게이트웨이 : access_token + refresh_token
API게이트웨이 --> 프런트엔드페이지 : 200 로그인 성공

... access_token 만료 ...

프런트엔드페이지 -> API게이트웨이 : POST /refresh
API게이트웨이 -> 인증서비스 : refresh_token 검증
인증서비스 -> 세션캐시 : refresh_token 교체
인증서비스 --> API게이트웨이 : 새 access_token
API게이트웨이 --> 프런트엔드페이지 : 200 새 토큰
@enduml
```

## C4 스타일 컨테이너 다이어그램 예시

```plantuml
@startuml
!includeurl https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(user, "블로그 방문자", "글 읽기와 콘텐츠 검색")

System_Boundary(system, "Firefly Blog") {
	Container(web, "Web App", "Astro + Svelte", "페이지 렌더링과 상호 작용")
	Container(worker, "SSR Worker", "Cloudflare Workers", "서버 렌더링 요청 처리")
	ContainerDb(content, "Content Store", "Markdown / Object Storage", "글과 리소스 메타데이터 저장")
	Container(search, "Search Index", "Pagefind", "전체 텍스트 검색 제공")
}

System_Ext(plantuml, "PlantUML Server", "SVG 다이어그램 생성")

Rel(user, web, "방문", "HTTPS")
Rel(web, worker, "SSR 페이지 요청", "HTTPS")
Rel(worker, content, "글 읽기")
Rel(web, search, "검색어 조회")
Rel(web, plantuml, "다이어그램 SVG 요청")

LAYOUT_LEFT_RIGHT()
@enduml
```
