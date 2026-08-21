import type { ProfileConfig } from "../types/profileConfig";

export const profileConfig: ProfileConfig = {
	// 프로필 이미지
	// 이미지 경로는 세 가지 형식을 지원합니다.
	// 1. public 디렉터리("/"로 시작하며 최적화하지 않음): "/assets/images/avatar.webp"
	// 2. src 디렉터리("/"로 시작하지 않으며 자동 최적화하지만 빌드 시간이 늘어남, 권장): "assets/images/avatar.webp"
	// 3. 원격 URL: "https://example.com/avatar.jpg"
	avatar: "assets/images/avatar.avif",

	// 이름
	name: "Jihoon Jeon",

	// 소개 문구
	bio: "Hello, I'm Jihoon Jeon.",

	// 링크 설정
	// 기본 설치된 아이콘 세트: fa7-brands, fa7-regular, fa7-solid, material-symbols, simple-icons
	// https://icones.js.org/ 에서 아이콘 코드를 확인할 수 있습니다.
	// 아직 포함되지 않은 아이콘 세트를 사용하려면 직접 설치해야 합니다.
	// `pnpm add @iconify-json/<icon-set-name>`
	// showName이 true이면 아이콘과 이름을, false이면 아이콘만 표시합니다.
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/hon454",
			showName: false,
		},
		{
			name: "Email",
			icon: "fa7-solid:envelope",
			url: "mailto:hon454@gmail.com",
			showName: false,
		},
		{
			name: "RSS",
			icon: "fa7-solid:rss",
			url: "/rss/",
			showName: false,
		},
	],
};
