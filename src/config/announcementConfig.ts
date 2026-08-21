import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	// 공지 제목. 비워 두면 i18n의 기본 제목을 사용합니다.
	title: "",

	// 공지 내용
	content: "제 블로그에 오신 것을 환영합니다! 예시 공지입니다.",

	// 사용자가 공지를 닫을 수 있는지 여부
	closable: true,

	link: {
		// 링크 사용 여부
		enable: true,
		// 링크 문구
		text: "자세히 알아보기",
		// 링크 URL
		url: "/about/",
		// 내부 링크 여부
		external: false,
	},
};
