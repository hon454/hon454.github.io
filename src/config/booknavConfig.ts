import type { BooknavGroup, BooknavPageConfig } from "../types/booknavConfig";

// 书签导航页面配置
export const booknavPageConfig: BooknavPageConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// favicon 自动获取配置
	favicon: {
		// 书签未填写 icon 时，是否自动获取目标站点的 favicon 图标
		enabled: true,

		// favicon 接口地址，{domain} 为占位符，会被替换成目标站点域名
		// 更换接口只需保证地址里含有 {domain}，例如：
		//   https://a.favicon.im/{domain}
		//   https://favicon.im/{domain}
		api: "https://a.favicon.im/{domain}",
	},
};

// 书签导航配置
// 每个数组项是一个分类组，分类组内的 items 是该分类下的书签
export const booknavConfig: BooknavGroup[] = [
	{
		id: "dev",
		name: "개발",
		icon: "material-symbols:code-rounded",
		desc: "코드를 작성할 때 유용한 사이트",
		weight: 100,
		items: [
			{
				title: "GitHub",
				url: "https://github.com",
				desc: "세계 최대 규모의 코드 호스팅 플랫폼",
				// icon 字段可以使用 astro-icon 图标库的图标名称
				// 也可以使用图片 URL 和本地图片路径
				// 不填则会通过接口自动获取目标站点的 favicon 图标（需要在上面配置）
				icon: "fa7-brands:github",
				weight: 10,
			},
			{
				title: "MDN Web Docs",
				url: "https://developer.mozilla.org",
				desc: "신뢰할 수 있는 웹 기술 문서",
				weight: 9,
			},
			{
				title: "Astro",
				url: "https://astro.build",
				desc: "콘텐츠 중심 웹사이트를 위한 웹 프레임워크",
				weight: 8,
			},
			{
				title: "Svelte",
				url: "https://svelte.dev",
				desc: "컴포넌트를 효율적인 기본 JavaScript로 컴파일하는 프레임워크",
				weight: 7,
			},
			{
				title: "Tailwind CSS",
				url: "https://tailwindcss.com",
				desc: "강력하고 유연한 CSS 프레임워크",
				weight: 6,
			},
		],
	},
	{
		id: "opensource",
		name: "프로젝트",
		icon: "material-symbols:code-rounded",
		desc: "유용한 오픈 소스 프로젝트",
		weight: 90,
		items: [
			{
				title: "mattpocock/skills",
				url: "https://github.com/mattpocock/skills",
				desc: "실무 소프트웨어 개발을 위한 작고 조합 가능한 AI 에이전트 스킬 모음",
				icon: "https://www.aihero.dev/favicon.svg",
				invertInDark: true,
				weight: 10,
			},
		],
	},
	{
		id: "design",
		name: "디자인",
		icon: "material-symbols:palette-outline-rounded",
		desc: "색상, 아이콘, 영감을 얻을 수 있는 자료",
		weight: 90,
		items: [
			{
				title: "Iconify",
				url: "https://icon-sets.iconify.design",
				desc: "방대한 오픈 소스 아이콘 컬렉션 검색",
				weight: 10,
			},
			{
				title: "iconfont",
				url: "https://www.iconfont.cn",
				desc: "Alibaba 벡터 아이콘 라이브러리",
				weight: 9,
			},
		],
	},
	{
		id: "tools",
		name: "도구",
		icon: "material-symbols:build-outline-rounded",
		desc: "간편한 온라인 도구",
		weight: 80,
		items: [
			{
				title: "TinyPNG",
				url: "https://tinypng.com",
				desc: "PNG/JPEG 이미지 온라인 압축",
				weight: 10,
			},
			{
				title: "Squoosh",
				url: "https://squoosh.app",
				desc: "Google이 제공하는 이미지 압축과 형식 변환",
				weight: 9,
			},
			{
				title: "Carbon",
				url: "https://carbon.now.sh",
				desc: "코드 조각을 멋진 이미지로 변환",
				weight: 8,
			},
		],
	},
	{
		id: "resources",
		name: "자료",
		icon: "material-symbols:auto-stories-outline-rounded",
		desc: "문서, 튜토리얼, 읽을거리",
		weight: 70,
		items: [
			{
				title: "GeekNews",
				url: "https://news.hada.io",
				desc: "개발·기술·스타트업 소식을 공유하는 한국어 뉴스 커뮤니티",
				weight: 8,
			},
			{
				title: "Firefly Docs",
				url: "https://docs-firefly.cuteleaf.cn",
				desc: "Firefly 테마 템플릿 문서",
				icon: "https://docs-firefly.cuteleaf.cn/logo.png",
				weight: 10,
			},
			{
				title: "여름밤의 반딧불",
				url: "https://blog.cuteleaf.cn",
				desc: "반딧불의 빛은 꿈 없는 긴 밤에 피어납니다",
				weight: 9,
			},
		],
	},
];
