import type { MusicPlayerConfig } from "../types/musicConfig";

// 음악 플레이어 설정
export const musicPlayerConfig: MusicPlayerConfig = {
	// 내비게이션 바에 음악 플레이어 진입 버튼을 표시할지 여부
	showInNavbar: true,

	// 사이드바에 음악 플레이어 컴포넌트를 표시할지 여부
	showInSidebar: true,

	// 사용 방식: "meting"은 Meting API, "local"은 로컬 음악 목록을 사용합니다.
	mode: "local",

	// 기본 음량(0~1)
	volume: 0.7,

	// 재생 모드: 'list'=목록 반복, 'one'=한 곡 반복, 'random'=무작위 재생
	playMode: "list",

	// 가사 사용 여부
	showLyrics: false,

	// Meting API 설정
	meting: {
		// Meting API 주소
		// 기본값은 공식 API이며 사용자 지정 API도 사용할 수 있습니다.
		api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
		// 음악 플랫폼: netease=NetEase Cloud Music, tencent=QQ Music, kugou=Kugou Music, xiami=Xiami Music, baidu=Baidu Music
		server: "netease",
		// 유형: song=곡, playlist=재생 목록, album=앨범, search=검색, artist=아티스트
		type: "playlist",
		// 재생 목록/앨범/곡 ID 또는 검색어
		id: "10046455237",
		// 인증 토큰(선택 사항)
		auth: "",
		// 예비 API 설정(기본 API가 실패했을 때 사용)
		fallbackApis: [
			"https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
			"https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
		],
	},

	// 로컬 음악 설정(mode가 'local'일 때 사용)
	// 1. 가사 파일 경로를 지정할 수 있습니다.
	// lrc: "/assets/music/lrc/使一颗心免于哀伤-哼唱.lrc",
	// 2. 또는 가사 문자열을 직접 입력할 수 있습니다.
	// lrc: "[00:00.00]가사 내용...",
	local: {
		playlist: [
			{
				name: "한 마음이 슬픔에서 벗어나도록",
				artist: "로빈 / HOYO-MiX / Chevy",
				url: "/assets/music/使一颗心免于哀伤-哼唱.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
		],
	},
};
