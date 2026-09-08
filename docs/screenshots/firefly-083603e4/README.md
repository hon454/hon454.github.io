# Firefly 083603e4 validation

2026-09-08 로컬 검증 기록입니다. 프로젝트 목록과 예제 상세는 `pnpm preview`의 프로덕션 결과(`127.0.0.1:4322`)로 확인했습니다. 새 글은 `draft: true`이므로 개발 서버(`127.0.0.1:4321`)에서 확인했습니다.

## Validation

- Node.js `v24.15.0`, pnpm `11.22.0`, Astro `7.2.10`.
- `pnpm install --lockfile-only`, `pnpm install --frozen-lockfile`: 통과. 최종 manifest와 lockfile은 upstream target과 일치합니다.
- `pnpm check`: 258 files, 0 errors / 0 warnings / 0 hints.
- `pnpm type-check`: 콘텐츠 타입 생성 후 순서대로 실행하여 통과.
- `pnpm build`: 전체 파이프라인 통과, Pagefind 55페이지 인덱싱.
- `git diff --check`: 통과.
- `/projects/`, `/projects/firefly/`, `/projects/example-project/`: 프로덕션 HTML과 canonical, `og:locale=ko_KR`, Firefly 표지 확인.
- 계획 중 상태 필터, Firefly 검색, 검색 결과 없음과 전체 복원 확인.
- 목록 → 각 예제 상세 → 목록으로 Swup 이동 확인.
- 몰입 읽기 진입, 목차 접기·펼치기, 앵커 이동, Esc 종료, 목록 이동 시 몰입 상태 해제 확인.
- 390px 모바일에서 메뉴 열기 → 프로젝트 링크 → 패널 닫힘(`aria-expanded=false`), 목록·상세 가로 넘침 없음 확인.
- 새 글 표지를 목록형·격자형·상세·몰입 읽기에서 확인. 새 글은 프로덕션 출력에서 제외됨을 확인.
- 개발 서버에만 `PUBLIC_DISPLAY_SETTINGS=true`를 주어 배너, fullscreen classic/hero, overlay, none 전환 확인. 설정 파일의 패널 비활성 기본값은 유지했습니다.
- desktop/mobile hero 스크롤 후 `--fullscreen-blur=10px`, 본문 `will-change=auto` 확인. classic은 기존 구현대로 blur 0px입니다. 별도 성능 벤치마크는 수행하지 않았습니다.

## Screenshots

- [프로젝트 목록 — 데스크톱](projects-desktop.png), [모바일](projects-mobile.png)
- [Firefly 상세 — 데스크톱](project-firefly-desktop.png), [모바일](project-firefly-mobile.png)
- [가이드 예제](project-guide-desktop.png), [프로젝트 몰입 읽기](project-immersive.png)
- [모바일 메뉴](mobile-menu.png)
- [새 글 — 모바일](post-mobile.png), [몰입 읽기](post-immersive.png), [목록형](post-list.png), [격자형](post-grid.png)
- [classic 배경](background-classic.png), [hero 배경](background-hero.png), [모바일 hero](background-hero-mobile.png)

## Notes

빌드에 `src/icons` 디렉터리 부재와 500kB 초과 청크 경고가 있습니다. Pagefind는 비활성 페이지의 리다이렉트 HTML 5개를 건너뛰며 한국어 stemming을 지원하지 않는다는 안내를 출력합니다. 빌드와 검색 인덱스 생성은 완료됐습니다.

내장 브라우저 최초 진입에서 기존 배경 영상의 로드 실패 표시를 관찰했습니다. 이번 검증 범위의 이미지 배경은 정상 표시됐으며 영상 재생 호환성은 보장하지 않습니다.

예제 Markdown은 upstream 원문을 유지했으며 `firefly.md`의 줄 끝 공백 두 곳만 정리했습니다. 목록 소개 문구는 예제를 작성자 개인 작업으로 오해하지 않도록 ‘프로젝트 소개와 기록을 모았습니다’로 표시합니다.
