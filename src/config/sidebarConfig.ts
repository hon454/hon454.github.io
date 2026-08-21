import type { SidebarLayoutConfig } from "../types/sidebarConfig";

/**
 * 사이드바 레이아웃 설정
 */
export const sidebarLayoutConfig: SidebarLayoutConfig = {
	// 사이드바 기능 사용 여부
	enable: true,

	// 사이드바 위치:
	// left: 왼쪽 사이드바만 표시
	// right: 오른쪽 사이드바만 표시
	// both: 양쪽 사이드바. 1280px 이상에서는 양쪽을 모두, 769~1279px에서는 tabletSidebar 설정에 따른 한쪽을 표시합니다.
	position: "both",

	// 태블릿(769~1279px)에서 표시할 사이드바. position이 both일 때만 적용됩니다.
	// left: 태블릿에서 왼쪽 사이드바 표시
	// right: 태블릿에서 오른쪽 사이드바 표시
	tabletSidebar: "left",

	// 글 상세 페이지에서 사이드바를 숨길지 여부. true이면 홈페이지 같은 글 외 페이지에만 표시합니다.
	hideSidebarOnPostPage: false,

	// 글 상세 페이지에서 양쪽 사이드바 유지
	// 단일 사이드바(position이 left 또는 right)를 사용할 때 글 상세 페이지에 양쪽 사이드바를 표시할지 여부입니다(hideSidebarOnPostPage는 false여야 함).
	// position이 left이면 글 상세 페이지에 오른쪽 사이드바를 추가합니다.
	// position이 right이면 글 상세 페이지에 왼쪽 사이드바를 추가합니다.
	// 평소에는 단일 사이드바를 쓰되 글 상세 페이지에서 반대편 목차 같은 컴포넌트가 필요할 때 유용합니다.
	showBothSidebarsOnPostPage: true,

	// 왼쪽 사이드바 컴포넌트 설정 목록
	// 컴포넌트는 설정 배열의 순서대로 렌더링하되 top 컴포넌트를 sticky 컴포넌트보다 먼저 렌더링합니다.
	// type: 컴포넌트 유형
	// enable: 컴포넌트 사용 여부
	// showTitle: 컴포넌트 제목 표시 여부(기본값 true)
	// position: 컴포넌트 위치. top은 위쪽에 고정, sticky는 페이지 스크롤을 따라가는 고정 위치입니다.
	// showOnPostPage: 글 상세 페이지에 컴포넌트 표시 여부
	// hideOnNonPostPage: 글 상세 페이지가 아닌 곳에서 컴포넌트를 숨길지 여부(true이면 글 상세 페이지에만 표시)
	// specificConfig: 컴포넌트 전용 설정
	leftComponents: [
		{
			// 컴포넌트 유형: 프로필
			type: "profile",
			// 컴포넌트 사용 여부
			enable: true,
			// 컴포넌트 위치
			position: "top",
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
		},
		{
			// 컴포넌트 유형: 공지
			type: "announcement",
			// 컴포넌트 사용 여부
			enable: true,
			// 컴포넌트 위치
			position: "top",
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
		},
		{
			// 컴포넌트 유형: 음악 플레이어
			type: "music",
			// 컴포넌트 사용 여부
			enable: true,
			// 컴포넌트 위치
			position: "sticky",
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
		},
		{
			// 컴포넌트 유형: 카테고리
			type: "categories",
			// 컴포넌트 사용 여부
			enable: true,
			// 컴포넌트 위치
			position: "sticky",
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
			// 컴포넌트 전용 설정
			specificConfig: {
				// 접기 기준: 카테고리가 5개를 초과하면 자동으로 접습니다.
				collapseThreshold: 5,
			},
		},
		{
			// 컴포넌트 유형: 태그
			type: "tags",
			// 컴포넌트 사용 여부
			enable: true,
			// 컴포넌트 위치
			position: "sticky",
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
			// 컴포넌트 전용 설정
			specificConfig: {
				// 접기 기준: 태그가 10개를 초과하면 자동으로 접습니다.
				collapseThreshold: 10,
			},
		},
	],

	// 오른쪽 사이드바 컴포넌트 설정 목록
	rightComponents: [
		{
			// 컴포넌트 유형: 최신 소식
			type: "dynamic",
			// 컴포넌트 사용 여부
			enable: true,
			// 컴포넌트 위치
			position: "top",
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
			// 컴포넌트 전용 설정
			specificConfig: {
				dynamic: {
					// 표시할 최신 소식 수
					limit: 2,
				},
			},
		},
		{
			// 컴포넌트 유형: 사이트 통계
			type: "stats",
			// 컴포넌트 사용 여부
			enable: true,
			// 컴포넌트 위치
			position: "top",
			// 글 상세 페이지 표시 여부
			showOnPostPage: false,
		},
		{
			// 컴포넌트 유형: 사이트 정보
			type: "siteInfo",
			// 컴포넌트 사용 여부
			enable: true,
			// 컴포넌트 위치
			position: "top",
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
			// 컴포넌트 전용 설정
			specificConfig: {
				siteInfo: {
					// 빌드 플랫폼을 식별하지 못했을 때 표시할 사용자 지정 대체 문구
					unknownBuildPlatform: "Unknown CI",
				},
			},
		},
		{
			// 컴포넌트 유형: 달력
			type: "calendar",
			// 컴포넌트 사용 여부
			enable: true,
			// 컴포넌트 제목 표시 여부
			showTitle: false,
			// 컴포넌트 위치
			position: "sticky",
			// 글 상세 페이지 표시 여부
			showOnPostPage: false,
			// 컴포넌트 전용 설정
			specificConfig: {
				calendar: {
					// 연간 글 히트맵 표시 여부
					showHeatmap: true,
				},
			},
		},
		{
			// 컴포넌트 유형: 사이드바 목차(글 상세 페이지에만 표시)
			type: "sidebarToc",
			// 컴포넌트 사용 여부
			enable: true,
			// 컴포넌트 위치
			position: "sticky",
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
			// 글 상세 페이지가 아닌 곳에서 숨길지 여부
			hideOnNonPostPage: true,
		},
		{
			// 컴포넌트 유형: 광고 영역 1
			type: "advertisement",
			// 컴포넌트 사용 여부
			enable: false,
			// 컴포넌트 제목 표시 여부
			showTitle: false,
			// 컴포넌트 위치
			position: "sticky",
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
			// 컴포넌트 전용 설정(광고 내용을 여기에서 직접 설정)
			specificConfig: {
				ad: {
					image: {
						src: "/assets/images/ad/ad1.webp",
						alt: "광고 배너",
						link: "https://haoka.lot-ml.com/plugreg.html?agentid=1423316",
						external: true,
					},
					// 광고 닫기 허용 여부
					closable: false,
					// 표시 횟수 제한. -1이면 제한 없음
					displayCount: -1,
					// 컴포넌트 안쪽 여백 설정
					padding: {
						all: "1rem",
					},
				},
			},
		},
		{
			// 컴포넌트 유형: 광고 영역 2
			type: "advertisement",
			// 컴포넌트 사용 여부
			enable: false,
			// 컴포넌트 위치
			position: "sticky",
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
			// 컴포넌트 전용 설정(광고 내용을 여기에서 직접 설정)
			specificConfig: {
				ad: {
					title: "블로그 후원",
					content:
						"이 사이트의 콘텐츠가 도움이 되었다면 블로그 운영을 후원해 주세요. 여러분의 응원이 꾸준한 업데이트의 힘이 됩니다.",
					link: {
						text: "후원하기",
						url: "about/",
						external: false,
					},
					closable: false,
					displayCount: -1,
				},
			},
		},
	],

	// 모바일 하단 컴포넌트 설정 목록
	// 이 컴포넌트는 좌우 사이드바 설정과 별개로 모바일(<768px)의 페이지 하단에만 표시됩니다.
	mobileBottomComponents: [
		{
			// 컴포넌트 유형: 프로필
			type: "profile",
			// 컴포넌트 사용 여부
			enable: true,
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
		},
		{
			// 컴포넌트 유형: 공지
			type: "announcement",
			// 컴포넌트 사용 여부
			enable: true,
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
		},
		{
			// 컴포넌트 유형: 카테고리
			type: "categories",
			// 컴포넌트 사용 여부
			enable: true,
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
			// 컴포넌트 전용 설정
			specificConfig: {
				// 접기 기준: 카테고리가 5개를 초과하면 자동으로 접습니다.
				collapseThreshold: 5,
			},
		},
		{
			// 컴포넌트 유형: 태그
			type: "tags",
			// 컴포넌트 사용 여부
			enable: true,
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
			// 컴포넌트 전용 설정
			specificConfig: {
				// 접기 기준: 태그가 20개를 초과하면 자동으로 접습니다.
				collapseThreshold: 10,
			},
		},
		{
			// 컴포넌트 유형: 최신 소식
			type: "dynamic",
			// 컴포넌트 사용 여부
			enable: true,
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
			// 컴포넌트 전용 설정
			specificConfig: {
				dynamic: {
					// 표시할 최신 소식 수
					limit: 2,
				},
			},
		},
		{
			// 컴포넌트 유형: 사이트 통계
			type: "stats",
			// 컴포넌트 사용 여부
			enable: true,
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
		},
		{
			// 컴포넌트 유형: 사이트 정보
			type: "siteInfo",
			// 컴포넌트 사용 여부
			enable: true,
			// 글 상세 페이지 표시 여부
			showOnPostPage: true,
			// 컴포넌트 전용 설정
			specificConfig: {
				siteInfo: {
					// 빌드 플랫폼을 식별하지 못했을 때 표시할 사용자 지정 대체 문구
					unknownBuildPlatform: "Unknown CI",
				},
			},
		},
	],
};
