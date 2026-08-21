import type { SponsorConfig } from "../types/sponsorConfig";

export const sponsorConfig: SponsorConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// 打赏用途说明
	usage:
		"후원금은 서버 유지보수, 콘텐츠 제작, 기능 개발에 사용되며 좋은 콘텐츠를 꾸준히 제공하는 데 큰 도움이 됩니다.",

	// 是否显示打赏者列表
	showSponsorsList: true,

	// 是否显示评论区，需要先在commentConfig.ts启用评论系统
	showComment: true,

	// 是否在文章详情页底部显示打赏按钮
	showButtonInPost: true,

	// 打赏方式列表
	methods: [
		{
			name: "Alipay",
			icon: "fa7-brands:alipay",
			// 收款码图片路径（需要放在 public 目录下）
			qrCode: "/assets/images/sponsor/alipay.png",
			link: "",
			description: "Alipay QR 코드를 스캔해 후원",
			enabled: true,
		},
		{
			name: "WeChat Pay",
			icon: "fa7-brands:weixin",
			qrCode: "/assets/images/sponsor/wechat.png",
			link: "",
			description: "WeChat Pay QR 코드를 스캔해 후원",
			enabled: true,
		},
		{
			name: "ko-fi",
			icon: "simple-icons:kofi",
			qrCode: "",
			link: "https://ko-fi.com/cuteleaf",
			description: "Buy a Coffee for Firefly",
			enabled: true,
		},
		{
			name: "Afdian",
			icon: "simple-icons:afdian",
			qrCode: "",
			link: "https://ifdian.net/a/cuteleaf",
			description: "Afdian에서 후원",
			enabled: true,
		},
	],

	// 打赏者列表（可选）
	sponsors: [
		// 示例：已实名打赏者
		{
			name: "XiaYe",
			avatar:
				"https://weavatar.com/avatar/d252655d40d6874417a720bad0a6c5f77f8f6a1fd2f882f8f338402dc37e4190?s=640",
			amount: "¥50",
			date: "2025-10-01",
		},

		// 示例：匿名打赏者
		{
			name: "익명 사용자",
			// avatar: "",
			amount: "¥20",
			date: "2025-10-01",
		},
	],
};
