import type { BackgroundWallpaperConfig } from "@/types/backgroundWallpaper";

export const backgroundWallpaper: BackgroundWallpaperConfig = {
	// 배경화면 모드: "banner" 배너 배경, "fullscreen" 전체 화면 배경, "overlay" 투명 오버레이, "none" 단색 배경
	mode: "banner",
	// 배경 동영상 재생 여부. 설정하면 내비게이션 바에 동영상 재생 버튼이 표시됩니다.
	playerEnable: true,
	/**
	 * 배경 이미지 설정
	 * 이미지 경로는 세 가지 형식을 지원합니다.
	 * 1. public 디렉터리("/"로 시작하며 최적화하지 않음): "/assets/images/banner.avif"
	 * 2. src 디렉터리("/"로 시작하지 않으며 자동 최적화하지만 빌드 시간이 늘어남, 권장): "assets/images/banner.avif"
	 * 3. 원격 URL: "https://example.com/banner.jpg"
	 * 주의: 원격 URL과 public 디렉터리의 이미지는 최적화하지 않으므로 로딩 속도에 영향을 주지 않도록 파일 크기를 충분히 줄이세요.
	 *
	 * 이미지 한 장이나 무작위 이미지 API만 사용한다면 문자열 형식을 권장합니다.
	 * desktop: "https://t.alcy.cc/pc",   // 무작위 이미지 API
	 * desktop: "assets/images/DesktopWallpaper/b1.avif", // 단일 이미지
	 *
	 * mobile: "https://t.alcy.cc/mp", // 무작위 이미지 API
	 * mobile: "assets/images/MobileWallpaper/m1.avif", // 단일 이미지
	 *
	 * 여러 이미지를 배열로 설정할 수도 있으며 페이지를 새로 고칠 때마다 한 장을 무작위로 표시합니다.
	 * desktop: [
	 * "assets/images/DesktopWallpaper/b1.avif",
	 * "assets/images/DesktopWallpaper/b2.avif",
	 * ],
	 *
	 * mobile:[
	 *   "assets/images/MobileWallpaper/m1.avif",
	 *   "assets/images/MobileWallpaper/m2.avif",
	 * ],
	 */
	src: {
		// 데스크톱 배경 이미지(단일 이미지 또는 여러 이미지 무작위 표시 지원)
		// desktop: "assets/images/DesktopWallpaper/b1.avif",
		desktop: [
			"assets/images/DesktopWallpaper/b1.avif",
			"assets/images/DesktopWallpaper/b2.avif",
			"assets/images/DesktopWallpaper/b3.avif",
			"assets/images/DesktopWallpaper/b4.avif",
		],
		// 모바일 배경 이미지(단일 이미지 또는 여러 이미지 무작위 표시 지원)
		// mobile: "assets/images/MobileWallpaper/m1.avif",
		mobile: [
			"assets/images/MobileWallpaper/m1.avif",
			"assets/images/MobileWallpaper/m2.avif",
			"assets/images/MobileWallpaper/m3.avif",
			"assets/images/MobileWallpaper/m4.avif",
		],
		// 배경 동영상 재생 주소
		// 단일 동영상 경로(문자열) 또는 여러 동영상 반복 재생(배열, 위 배경화면 설정 참고)을 지원합니다.
		// 원격 동영상 URL을 지원하며 로컬 동영상은 public/assets/videos/ 디렉터리에 두세요.
		// playerUrl: "/assets/videos/firefly.mp4",
		playerUrl: "https://bed.twoleaf.cn/file/1785658612716_firefly.mp4",
	},
	// 배너 배경화면과 전체 화면 배경화면의 공통 설정
	common: {
		// 배너 문구를 더 선명하게 보이게 하는 배경화면 마스크의 어두운 정도. 0~1 사이이며 클수록 어두워집니다.
		dimOpacity: 0.2,
		// 여러 동영상 재생 모드: "order" 순차 반복, "random" 무작위 전환(playerUrl이 배열일 때만 적용)
		playerMode: "random",
		// 홈페이지 배너 문구
		homeText: {
			// 홈페이지 배너 문구 사용 여부
			enable: true,
			// 홈페이지 배너 주 제목
			title: "Just Keep Pedaling",
			// 홈페이지 배너 주 제목 글자 크기
			titleSize: "4.5rem",
			// 홈페이지 배너 부제목
			subtitle: [
				"Life is like riding a bicycle.",
				"To keep your balance, you must keep moving.",
				"— Albert Einstein, in a letter to his son Eduard, 1930",
			],
			// 홈페이지 배너 부제목 글자 크기
			subtitleSize: "1.5rem",
			typewriter: {
				// 타자기 효과 사용 여부
				// 타자기 효과 켬 → 모든 부제목을 순환 표시
				// 타자기 효과 끔 → 새로 고칠 때마다 부제목 하나를 무작위 표시
				enable: true,
				// 입력 속도(밀리초)
				speed: 100,
				// 삭제 속도(밀리초)
				deleteSpeed: 50,
				// 전체 문구 표시 후 대기 시간(밀리초)
				pauseTime: 2000,
			},
			// 제목 아래 링크 아이콘 표시 여부
			linksEnable: true,
			// 홈페이지 배너 제목 아래의 링크 아이콘(선택 사항, showName으로 문구 표시 지원)
			// 아이콘은 fa7-brands:github, fa7-solid:envelope, mdi:rss 같은 Iconify 형식을 지원합니다.
			links: [
				{
					name: "GitHub",
					icon: "fa7-brands:github",
					url: "https://github.com/hon454",
					showName: true,
				},
				{
					name: "Instagram",
					icon: "fa7-brands:instagram",
					url: "https://www.instagram.com/jihoon.dev/",
				},
				{
					name: "LinkedIn",
					icon: "fa7-brands:linkedin",
					url: "https://www.linkedin.com/in/jihoon-jeon-b7ab83116/",
				},
				{
					name: "Email",
					icon: "fa7-solid:envelope",
					url: "mailto:hon454@gmail.com",
				},
				{
					name: "RSS",
					icon: "fa7-solid:rss",
					url: "/rss/",
				},
			],
		},
		// 배경화면 슬라이드 설정. 배너와 전체 화면 배경이 공유하며 여러 이미지를 설정했을 때만 적용됩니다.
		carousel: {
			// 배경화면 슬라이드 사용 여부. 끄면 새로 고칠 때마다 한 장을 무작위로 표시합니다.
			enable: false,
			// 슬라이드 전환 간격(밀리초)
			interval: 5000,
			// 전환 효과: 'fade' 페이드 | 'zoom' 확대·축소 | 'slide' 슬라이드 | 'kenburns' 회전식 전환
			transitionEffect: "zoom",
		},
		// 물결 애니메이션 설정. 사용하면 페이지 성능과 메모리 사용량에 영향을 주므로 필요에 따라 켜세요.
		waves: {
			enable: {
				// 데스크톱에서 물결 애니메이션 사용 여부
				desktop: true,
				// 모바일에서 물결 애니메이션 사용 여부
				mobile: true,
			},
		},
		// 그라데이션 전환 설정. 물결 효과가 꺼지면 자동으로 활성화되어 배경화면 아래쪽에서 배경색으로 부드럽게 이어집니다.
		gradient: {
			enable: {
				// 데스크톱에서 그라데이션 전환 사용 여부
				desktop: true,
				// 모바일에서 그라데이션 전환 사용 여부
				mobile: true,
			},
			// 그라데이션 높이
			height: "10%",
		},
	},
	// Banner 모드 전용 설정
	banner: {
		// 이미지 위치
		// 'top', 'center', 'bottom', 'left top', 'right bottom', '25% 75%', '10px 20px' 등 모든 CSS object-position 값을 지원합니다.
		// 백분율 설정이 익숙하지 않다면 'center' 가운데, 'top' 위쪽 가운데, 'bottom' 아래쪽 가운데, 'left' 왼쪽 가운데, 'right' 오른쪽 가운데를 사용하세요.
		position: "0% 20%",
		// 글 배너 정보: "description"은 설명을, "meta"는 날짜·글자 수·읽기 시간을 표시합니다.
		postInfo: {
			mode: "description",
		},
		// 내비게이션 바 설정
		navbar: {
			// 내비게이션 바 투명 모드: "semi" 반투명, "semifull" 동적 투명, "none" 불투명
			transparentMode: "semi",
			// 유리 효과 흐림 정도. 0이면 내비게이션 바의 유리 효과를 끕니다.
			// 주의: 내비게이션 하위 메뉴와 플로팅 패널은 항상 유리 효과를 유지하며 이 값에 따르되 최솟값이 있습니다.
			blur: 12,
		},
	},
	// 투명 오버레이 모드 전용 설정
	overlay: {
		// 배경화면을 배경 레이어에 유지하는 z-index
		zIndex: -1,
		// 배경화면 투명도
		opacity: 0.8,
		// 배경 흐림 정도
		blur: 10,
		// 카드 불투명도. 0~1 사이이며 작을수록 투명합니다.
		cardOpacity: 0.6,
	},
	// 전체 화면 배경화면 모드 전용 설정
	// "classic"은 문서 흐름 안에 전체 화면 배경을 배치하고, "hero"는 첫 화면 배경을 고정합니다.
	// 배경화면 흐림(blur), 카드 불투명도(cardOpacity), z-index(zIndex)는 위 overlay 모드 설정을 재사용합니다.
	// 배경 투명도(opacity)는 적용되지 않습니다(전체 화면 배경은 불투명). 내비게이션 바 투명 모드는 fullscreen.navbar.transparentMode가 제어하며 banner 설정과 무관합니다.
	fullscreen: {
		// 전체 화면 배경 레이아웃: "classic" 문서 흐름형, "hero" 고정형
		layout: "classic",
		// 이미지 위치
		position: "center",
		// 전체 화면 배경화면 모드의 내비게이션 바 설정
		navbar: {
			// "semi"는 반투명, "semifull"은 홈페이지 상단에서 투명하고 스크롤하면 유리 효과를 적용합니다.
			transparentMode: "semifull",
			// 유리 효과 흐림 정도. 0이면 흐림 효과를 끕니다.
			blur: 12,
		},
		// 홈페이지 스크롤 시 배경화면 흐림 전환 여부(0에서 overlay.blur의 최댓값까지 변화)
		// 끄면 해당 기기에서 전체 화면 배경을 항상 선명하게 유지하고(홈페이지와 다른 페이지 모두) 설정 패널의 흐림 슬라이더도 숨깁니다.
		blurRamp: {
			enable: {
				// 데스크톱에서 흐림 전환 사용 여부
				desktop: true,
				// 모바일에서 흐림 전환 사용 여부
				mobile: true,
			},
		},
	},
};
