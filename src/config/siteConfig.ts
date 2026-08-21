import type { SiteConfig } from "@/types/siteConfig";
import { resolvePageToggles } from "../utils/page-toggle-utils";
import { resolveSiteLang } from "../utils/site-config-utils";

// 사이트 언어 정의
// 언어 코드 예시: 'zh_CN', 'zh_TW', 'en', 'ja', 'ru', 'ko'
const SITE_LANG = resolveSiteLang("ko");

// 페이지 토글 설정 - 페이지 접근 권한을 제어합니다. false이면 404를 반환하고 해당 내비게이션 메뉴를 자동으로 숨깁니다.
const pages = resolvePageToggles({
	// ── 소셜 (Social) ──────────────────────────────────

	// 친구 링크 페이지 토글
	friends: true,
	// 방명록 페이지 토글. 댓글 시스템 설정이 필요합니다.
	guestbook: true,

	// ── 내 공간 (My) ──────────────────────────────────

	// 소식 페이지 토글
	dynamic: true,
	// 갤러리 페이지 토글
	gallery: true,
	// 북마크 페이지 토글
	booknav: true,
	// Bilibili 시청 목록 페이지 토글
	bilibili: false,
	// Bangumi 페이지 토글
	bangumi: false,
	// VNDB 페이지 토글
	vndb: false,
	// MyAnimeList 페이지 토글
	mal: false,

	// ── 소개 (About) ──────────────────────────────────

	// 후원 페이지 토글
	sponsor: false,
});

export const siteConfig: SiteConfig = {
	// 사이트 제목
	title: "Jihoon Jeon의 블로그",

	// 사이트 부제목
	subtitle: "개발과 일상을 기록하는 공간",

	// 사이트 URL
	site_url: "https://hon454.github.io",

	// 사이트 설명
	description:
		"Firefly는 Astro 프레임워크와 Fuwari 템플릿을 바탕으로 만든 산뜻하고 현대적인 개인 블로그 테마입니다. 기술 애호가와 콘텐츠 제작자를 위해 풍부한 기능과 높은 사용자 지정 가능성을 제공합니다.",

	// 사이트 키워드
	keywords: [
		"Firefly",
		"Fuwari",
		"Astro",
		"ACGN",
		"블로그",
		"기술 블로그",
		"정적 블로그",
	],

	// 테마 색상
	themeColor: {
		// 테마 색상의 기본 색조. 범위는 0~360입니다. 예: 빨강 0, 청록 200, 푸른 청록 250, 분홍 345
		hue: 165,
		// 기본 모드: "light" 라이트, "dark" 다크, "system" 시스템 설정 따름
		defaultMode: "system",
	},

	// 페이지 전체 너비(rem 단위)
	// 값이 클수록 페이지 콘텐츠 영역이 넓어집니다.
	// 단일 사이드바를 사용할 때는 더 나은 시각적 균형을 위해 너비를 조금 줄이는 것이 좋습니다.
	pageWidth: 100,

	// 사이트 카드 스타일 설정
	card: {
		// 카드 테두리와 그림자 사용 여부. 켜면 사이트에 입체감을 더합니다.
		border: false,
		// 카드 스타일이 테마 색조를 따를지 여부
		followTheme: false,
	},

	// Favicon 설정
	// OpenGraph 이미지 기능을 사용하면 배열에 PNG 형식의 favicon 아이콘이 있어야 합니다.
	favicon: [
		{
			// 아이콘 파일 경로
			src: "/favicon/firefly-32.png",
			// 선택 사항: 테마 지정 'light' | 'dark'
			// theme: "light",
			// 선택 사항: 아이콘 크기
			// sizes: "32x32",
		},
	],

	// 내비게이션 바 설정
	navbar: {
		// 내비게이션 바 로고
		// 다음 네 가지 유형을 지원합니다.
		// 1. Astro 아이콘 라이브러리: { type: "icon", value: "material-symbols:home-pin-outline" }
		// 2. 로컬 이미지(public 디렉터리, 최적화하지 않음): { type: "image", value: "/assets/images/logo.webp", alt: "Logo" }
		// 3. 로컬 이미지(src 디렉터리, 자동 최적화하지만 빌드 시간이 늘어남): { type: "image", value: "assets/images/logo.webp", alt: "Logo" }
		// 4. 원격 이미지: { type: "url", value: "https://example.com/logo.png", alt: "Logo" }
		// image와 url 유형은 다크 모드용 이미지를 valueDark로 추가 지정할 수 있습니다. 지정하지 않으면 라이트·다크 모드가 value를 공유합니다.
		// 예: { type: "image", value: "assets/images/logo.png", valueDark: "assets/images/logo-dark.png", alt: "Logo" }
		// Astro 아이콘 라이브러리는 valueDark 설정이 필요 없으며 아이콘이 테마에 맞춰 자동 전환됩니다.
		logo: {
			type: "image",
			value: "assets/images/logo/firefly-light.png",
			valueDark: "assets/images/logo/firefly-dark.png",
			alt: "🍀",
		},
		// 내비게이션 바 제목
		title: "Firefly",
		// 내비게이션 바가 화면 전체 너비를 채울지 여부
		widthFull: false,
		// 내비게이션 메뉴 정렬: left 왼쪽 정렬, center 가운데 정렬
		menuAlign: "center",
		// 내비게이션 바 아이콘과 제목이 테마 색상을 따를지 여부
		followTheme: false,
		// 내비게이션 바를 위쪽에 고정해 항상 표시할지 여부
		stickyNavbar: true,
	},

	// 사이트 시작일. 운영 일수를 계산할 때 사용합니다.
	siteStartDate: "2026-08-21",

	// 사이트 시간대(IANA 시간대 문자열). Bangumi, RSS 등의 빌드 날짜와 시간을 표시할 때 사용합니다.
	// 예: "Asia/Shanghai", "UTC". 비워 두면 빌드 서버 시간대를 기준으로 변환합니다.
	timezone: "Asia/Shanghai",

	// 페이지 토글 설정 - 페이지 접근 권한을 제어합니다. false이면 404를 반환하고 해당 내비게이션 메뉴를 자동으로 숨깁니다.

	// 카테고리 바 토글. 홈페이지와 아카이브 페이지 상단에 카테고리 바로 가기를 표시합니다.
	categoryBar: true,

	// 카테고리 바 버튼 스타일
	// "pill": 옅은 테마색 배경과 둥근 모서리의 캡슐형
	// "rectangle": 캡슐형과 같은 색상이지만 모서리 둥글기가 작은 사각형
	categoryStyle: "rectangle",

	// 태그 스타일. 글 목록 하단 태그, 태그 페이지, 사이드바 태그에 적용됩니다.
	// "pill": 테마색 배경과 둥근 모서리의 캡슐형
	// "pill-gray": 중성 회색 배경과 둥근 모서리의 캡슐형
	// "rectangle": 테마색 배경과 조금 둥근 모서리의 사각형
	tagStyle: "pill",

	// 아카이브 페이지에서 최신 연도가 아닌 글을 접을지 여부. 끄면 모든 연도를 기본으로 펼칩니다.
	foldArticle: true,

	// ── 글 목록 레이아웃 설정 ──────────────────────────────────
	postListLayout: {
		// 기본 레이아웃 모드: "list" 목록 모드(단일 열), "grid" 그리드 모드(여러 열)
		defaultMode: "list",
		// 모바일 기본 레이아웃 모드. 설정하지 않으면 defaultMode를 따릅니다.
		mobileDefaultMode: "grid",
		// 목록 모드의 표지 이미지 위치: "right" 오른쪽, "left" 왼쪽
		// 그리드 모드의 표지는 카드 상단에 고정되어 이 설정의 영향을 받지 않습니다.
		coverPosition: "right",
		// 글 소개를 표시할 줄 수. 0이면 자르지 않습니다.
		descriptionLines: 2,
		// 글 카드 하단 통계와 발행일에 아이콘을 표시할지 여부
		showStatsIcons: true,
		// 태그 표시 위치
		// "meta": 글 제목 아래 메타데이터에 표시
		// "bottom": stats 대신 카드 하단에 표시
		tagsPosition: "bottom",
		// 하단 태그 스타일. tagsPosition이 "bottom"일 때만 적용됩니다.
		// "chip": 버튼 스타일이며 모양은 위 tagStyle 설정을 따릅니다.
		// "text": 배경 없이 문구만 표시합니다.
		tagsBottomStyle: "chip",
		// PostMeta 메타데이터 표시 설정
		meta: {
			// 발행일 표시 여부
			showPublished: true,
			// 카테고리 표시 여부
			showCategory: true,
			// 태그 표시 여부
			showTags: true,
			// 태그 수. 0이면 제한하지 않습니다.
			tagCount: 3,
			// 글자 수 표시 여부
			showWords: false,
			// 읽기 시간 표시 여부
			showReadingTime: false,
		},
		// 하단 PostStats 통계 표시 설정
		// tagsPosition이 "bottom"이면 stats를 표시하지 않습니다.
		stats: {
			// 발행일 표시 여부
			showPublished: true,
			// 글자 수 표시 여부
			showWords: true,
			// 읽기 시간 표시 여부
			showReadingTime: true,
		},
		// 그리드 레이아웃 설정. defaultMode가 "grid"이거나 레이아웃 전환을 허용할 때만 적용됩니다.
		grid: {
			// 메이슨리 레이아웃 사용 여부. 표지가 있는 글과 없는 글이 섞여 있다면 사용을 권장합니다.
			masonry: false,
			// 그리드 모드 카드 최소 너비(px). 브라우저가 컨테이너 너비에 맞춰 열 수를 자동 계산합니다.
			columnWidth: 320,
			// 그리드 모드 표지가 카드 가장자리까지 채울지 여부
			// true: 표지가 카드의 왼쪽·오른쪽·위쪽 가장자리에 닿으며 위쪽 두 모서리만 둥글게 표시
			// false: 표지가 카드 안쪽 여백만큼 들어가 위·왼쪽·오른쪽에 간격을 두며 네 모서리를 모두 둥글게 표시
			coverFullWidth: false,
		},
	},

	// 페이지 나누기 설정
	pagination: {
		// 페이지마다 표시할 글 수
		postsPerPage: 10,
	},

	// ── 글 콘텐츠 페이지 설정 ──────────────────────────────────
	post: {
		// 알림 상자(Admonitions) 설정. 변경 후 개발 서버를 다시 시작해야 적용됩니다.
		// 테마: 'github' | 'obsidian' | 'vitepress' | 'docusaurus'. 테마마다 스타일과 문법이 다르므로 취향에 맞게 선택하세요.
		rehypeCallouts: {
			theme: "github",
			// Python-Markdown 스타일의 admonition 문법(!!! 및 ??? 문법) 호환 기능 사용 여부
			// 주의: theme가 obsidian일 때만 이 문법을 기본적으로 지원합니다. 다른 테마에서는 스타일 문제나 호환성 문제가 생길 수 있습니다.
			enablePythonMarkdownAdmonitions: false,
		},
		// 글 페이지 하단의 "마지막 수정 시간" 카드 토글
		showLastModified: true,
		// 글이 오래된 것으로 판단하는 기준(일). 이 기간을 초과해야 "마지막 수정" 카드를 표시합니다.
		outdatedThreshold: 30,
		// 공유 포스터 생성 기능 사용 여부
		sharePoster: true,
		// OpenGraph 이미지 기능. 사용하면 렌더링 시간이 크게 늘어나므로 로컬 디버깅 중에는 권장하지 않습니다.
		generateOgImages: false,
	},

	// ── Bilibili 설정 ──────────────────────────────────
	bilibili: {
		// Bilibili 사용자 UID
		uid: "38932988",
	},

	// ── Bangumi 설정 ──────────────────────────────────
	bangumi: {
		// Bangumi 사용자 ID
		userId: "1143164",
		// 데이터 모드: static=빌드할 때 가져오기, dynamic=클라이언트에서 실시간으로 가져오기
		// static 모드는 빌드할 때 데이터를 가져와 정적으로 렌더링하므로 배포 후에는 갱신되지 않습니다.
		// dynamic 모드는 브라우저에서 API를 실시간으로 요청해 항상 최신 데이터를 표시합니다.
		mode: "dynamic",
		// Bangumi API 주소
		apiUrl: "https://bgmapi.anibt.net",
		// 상세 페이지 주소
		subjectBaseUrl: "https://bgmmi.anibt.net/subject/",
		// 항목 유형 정렬. 배열에 적은 순서대로 먼저 표시합니다.
		// 선택값: "anime" | "book" | "music" | "game" | "real" ("real" 유형은 아직 지원하지 않음)
		// 나열하지 않은 유형은 기본 순서에 따라 뒤에 배치합니다.
		categoryOrder: ["anime", "book", "music", "game"],
		// 카테고리별 사용 상태(true/false). 지정하지 않은 카테고리는 기본으로 활성화합니다.
		// categories: {
		// 	game: false, // 게임 카테고리 표시 비활성화
		// },
	},

	// ── VNDB 설정 ──────────────────────────────────
	vndb: {
		// VNDB 사용자 ID
		userId: "u358128",
		// 데이터 모드: static=빌드할 때 가져오기, dynamic=클라이언트에서 실시간으로 가져오기
		// static 모드는 빌드할 때 데이터를 가져와 정적으로 렌더링하므로 배포 후에는 갱신되지 않습니다.
		// dynamic 모드는 브라우저에서 API를 실시간으로 요청해 항상 최신 데이터를 표시합니다.
		mode: "static",
		// 빌드할 때 표지를 public/vndb-covers에 내려받아 압축하고 사이트 서버에서 제공합니다.
		downloadCovers: false,
		// VNDB API 주소
		apiUrl: "https://api.vndb.org/kana",
		// 항목 상세 페이지 주소. 끝에 /가 있어야 합니다.
		vnBaseUrl: "https://vndb.org/",
		// 비공개 목록 접근 토큰. static 모드에서만 사용합니다. 실제 토큰을 공개 저장소에 커밋하지 마세요!
		apiToken: "",
		// NSFW 게임 표지 흐리게 처리
		blurNsfw: true,
	},

	// ── MyAnimeList 설정 ──────────────────────────────────
	mal: {
		// MyAnimeList 사용자 이름(목록은 공개 상태여야 하며 비공개 목록은 읽을 수 없음)
		username: "cuteleaf",
		// MyAnimeList Client ID. https://myanimelist.net/apiconfig 에서 무료 앱을 등록해 발급받습니다.
		clientId: "	0ef34371450f9c6c809deaadec6aa8f3",
		// MAL API 주소
		apiUrl: "https://api.myanimelist.net/v2",
		// 애니메이션 항목 상세 페이지 주소. 끝에 /가 있어야 합니다.
		animeBaseUrl: "https://myanimelist.net/anime/",
		// 만화 항목 상세 페이지 주소. 끝에 /가 있어야 합니다.
		mangaBaseUrl: "https://myanimelist.net/manga/",
	},

	// ── 이미지 최적화 설정 ──────────────────────────────────
	// 이미지 최적화 압축은 AVIF 또는 WebP만 유지합니다.
	// 반응형 이미지는 여러 기기에서 성능을 높이도록 조정된 이미지입니다. 컨테이너에 맞게 크기를 바꾸고 방문자의 화면 크기와 해상도에 따라 다른 크기로 제공할 수 있습니다.
	// Astro는 src 디렉터리의 이미지만 최적화할 수 있으며 이미지가 많을수록 빌드 시간이 늘어납니다.
	// Astro 이미지 문서: https://docs.astro.build/zh-cn/guides/images/
	imageOptimization: {
		// 출력 이미지 형식
		// - "avif": AVIF만 출력(최신 기술, 가장 작은 용량, 현재 호환성이 낮고 빌드 시간이 김)
		// - "webp": WebP만 출력(적당한 용량, 높은 호환성, 짧은 빌드 시간)
		// - "both": AVIF와 WebP를 모두 출력(브라우저가 최적 형식을 자동 선택)
		formats: "webp",
		// 이미지 압축 품질(1~100). 값이 낮을수록 용량과 품질이 낮아지며 70~85를 권장합니다.
		quality: 85,
		// 특정 도메인의 이미지에 referrerpolicy="no-referrer" 속성을 추가합니다.
		// 와일드카드 *를 지원합니다. 예: ["i0.hdslb.com", "*.bilibili.com"]
		// 핫링크 방지 이미지처럼 특정 도메인의 이미지 로딩 시 발생하는 403 문제를 해결할 수 있습니다.
		noReferrerDomains: [
			"*.hdslb.com",
			"*.bilibili.com",
			"*.myanimelist.net",
			"*.vndb.org",
		],
	},

	// 사이트 언어. 이 설정 파일 상단의 SITE_LANG에서 정의합니다.
	lang: SITE_LANG,

	// 페이지 토글 설정. 이 설정 파일 상단의 pages에서 정의합니다.
	pages,
};
