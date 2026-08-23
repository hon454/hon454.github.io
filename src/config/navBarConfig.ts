import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";

// ============================================================================
// 내비게이션 바 설정 - 순서에 따라 내비게이션 링크를 동적으로 생성합니다.
// NavBar Configuration - Dynamically generate navigation bar links based on order
// ============================================================================
const getDynamicNavBarConfig = (): NavBarConfig => {
	// 기본 내비게이션 링크
	const links: NavBarLink[] = [];

	// 홈
	links.push(LinkPresets.Home);

	// 글과 하위 메뉴
	links.push({
		name: "글",
		url: "#",
		icon: "material-symbols:article",
		children: [
			// 아카이브
			LinkPresets.Archive,

			// 카테고리
			LinkPresets.Categories,

			// 태그
			LinkPresets.Tags,

			// 블로그 가이드
			LinkPresets.BlogGuide,
		],
	});

	// 소셜과 하위 메뉴
	links.push({
		name: "소셜",
		url: "#",
		icon: "material-symbols:group",
		children: [
			// 친구 링크
			LinkPresets.Friends,

			// 방명록
			LinkPresets.Guestbook,
		],
	});

	// 내 메뉴와 하위 메뉴
	links.push({
		name: "내 공간",
		url: "#",
		icon: "material-symbols:person",
		children: [
			// 일상
			LinkPresets.Dynamic,

			// 갤러리
			LinkPresets.Gallery,

			// 북마크
			LinkPresets.Booknav,

			// Bilibili 시청 목록
			LinkPresets.Bilibili,

			// Bangumi
			LinkPresets.Bangumi,

			// VNDB
			LinkPresets.VNDB,

			// MyAnimeList
			LinkPresets.MAL,
		],
	});

	// 소개와 하위 메뉴
	links.push({
		name: "소개",
		url: "#",
		icon: "material-symbols:info",
		children: [
			// 후원
			LinkPresets.Sponsor,

			// 소개 페이지
			LinkPresets.About,

			// 이력서
			LinkPresets.Resume,
		],
	});

	// 사용자 지정 내비게이션 링크
	links.push({
		name: "링크",
		url: "#",
		icon: "material-symbols:link",
		// 하위 메뉴
		children: [
			{
				name: "GitHub",
				url: "https://github.com/hon454",
				external: true,
				icon: "fa7-brands:github",
			},
			{
				name: "Firefly GitHub",
				url: "https://github.com/CuteLeaf/Firefly",
				external: true,
				icon: "fa7-brands:github",
			},
			{
				name: "Firefly 문서",
				url: "https://docs-firefly.cuteleaf.cn",
				external: true,
				icon: "material-symbols:docs",
			},
		],
	});

	// 문서 링크
	// links.push({
	// 	name: "문서",
	// 	url: "https://docs-firefly.cuteleaf.cn",
	// 	external: true,
	// 	icon: "material-symbols:docs",
	// });

	return { links } as NavBarConfig;
};

// 내비게이션 검색 설정
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

// ============================================================================
// 링크 프리셋 - 내비게이션 링크의 이름, 아이콘, URL을 자유롭게 지정할 수 있습니다.
// Link Presets - Allows free customization of the name, icon, and URL of navigation bar links
// ============================================================================
export const LinkPresets: Record<string, NavBarLink> = {
	Home: {
		name: "홈",
		url: "/",
		icon: "material-symbols:home",
	},
	Archive: {
		name: "아카이브",
		url: "/archive/",
		icon: "material-symbols:archive",
	},
	BlogGuide: {
		name: "블로그 가이드",
		url: "/posts/firefly-blog-guide/",
		icon: "material-symbols:menu-book",
	},
	Categories: {
		name: "카테고리",
		url: "/categories/",
		icon: "material-symbols:folder-open-rounded",
	},
	Tags: {
		name: "태그",
		url: "/tags/",
		icon: "material-symbols:tag-rounded",
	},
	Friends: {
		name: "친구 링크",
		url: "/friends/",
		icon: "material-symbols:link-2-rounded",
		pageKey: "friends",
	},
	Guestbook: {
		name: "방명록",
		url: "/guestbook/",
		icon: "material-symbols:chat",
		pageKey: "guestbook",
	},
	Dynamic: {
		name: "일상",
		url: "/dynamic/",
		icon: "material-symbols:forum-rounded",
		pageKey: "dynamic",
	},
	Gallery: {
		name: "갤러리",
		url: "/gallery/",
		icon: "material-symbols:photo-library",
		pageKey: "gallery",
	},
	Booknav: {
		name: "북마크",
		url: "/booknav/",
		icon: "material-symbols:bookmarks",
		pageKey: "booknav",
	},
	Bilibili: {
		name: "Bilibili",
		url: "/bilibili/",
		icon: "fa7-brands:bilibili",
		pageKey: "bilibili",
	},
	Bangumi: {
		name: "Bangumi",
		url: "/bangumi/",
		icon: "material-symbols:movie",
		pageKey: "bangumi",
	},
	VNDB: {
		name: "VNDB",
		url: "/vndb/",
		icon: "material-symbols:chrome-reader-mode-rounded",
		pageKey: "vndb",
	},
	MAL: {
		name: "AnimeList",
		url: "/myanimelist/",
		icon: "material-symbols:menu-book",
		pageKey: "mal",
	},
	Sponsor: {
		name: "후원",
		url: "/sponsor/",
		icon: "material-symbols:favorite",
		pageKey: "sponsor",
	},
	About: {
		name: "소개",
		url: "/about/",
		icon: "material-symbols:person",
	},
	Resume: {
		name: "이력서",
		url: "/resume/",
		icon: "material-symbols:badge",
	},
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
