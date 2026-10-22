---
name: post-cover
description: Generate two blog cover candidates for a post in src/content/posts at the same time with ChatGPT web and Gemini web via Claude in Chrome, have the user pick one, and apply it to the post. Use ONLY when the user explicitly asks to create or replace a cover image for a specific post (e.g. "이 글 커버 만들어 줘", /post-cover <slug>). Never use as part of writing, polishing, reviewing, publishing a post, or an upstream sync.
argument-hint: <post-slug>
---

# 블로그 커버 후보 생성

Claude in Chrome으로 ChatGPT 웹과 Gemini 웹에 같은 프롬프트와 기준 이미지를 보내 커버 후보 두 장을 동시에 얻고, 사용자가 고른 한 장을 글에 적용한다.

이 스킬은 `docs/blog-image-guidelines.md`를 따른다. 지침과 이 문서가 다르면 지침이 우선한다. 사용자가 해당 글의 커버를 명시적으로 요청했을 때만 실행하고, 요청 범위(커버 한 장)를 본문 삽화로 넓히지 않는다.

## 준비물

- Claude in Chrome 연결, 같은 Chrome에서 chatgpt.com과 gemini.google.com 로그인
- `cwebp`, `pnpm` 의존성 설치
- 대상 글: `src/content/posts/<slug>.md`

Codex CLI `codex exec`의 내장 이미지 생성은 ChatGPT 무료 플랜에서 비활성화된다(`image_gen` 도구가 노출되지 않음). 유료 플랜 계정이 아니면 이 스킬의 웹 경로를 사용한다.

## 1. 장면과 프롬프트 작성

1. `docs/blog-image-guidelines.md`와 대상 글을 끝까지 읽는다.
2. 지침의 "요청별 입력 예시" 형식으로 대상 글, 요청 범위, 전달할 개념, 반드시 구분할 조건, 장면, 출력을 정리한다. 글에 없는 사실이나 인과를 만들지 않는다.
3. 영어 프롬프트 한 개를 쓴다. 두 서비스에 같은 프롬프트를 보내야 후보를 공정하게 비교할 수 있다. 다음을 포함한다.
   - 첫 문장 `Generate an image.` 와 16:9 커버라는 용도
   - 기준 이미지 역할은 **번호가 아니라 내용으로** 지칭한다. Gemini는 첨부 순서를 거꾸로 해석한 적이 있다. 예: `The attached image of a single green snail with a lime spiral shell is the character reference ... The attached clay scene with envelopes defines only the rendering style ...`
   - 캐릭터 정체성(짙은 초록 몸체, 라임색 나선 껍질, 둥근 두 더듬이, 아이보리 눈, 작은 입, 두툼한 비율)
   - 스타일 기준 이미지의 소품(봉투, 숫자, 길, 물음표)을 복사하지 말 것
   - 중앙 크롭을 견디는 구도: 핵심 요소를 중앙에 모으고 가장자리는 단순한 아이보리 배경
   - `Keep the bottom-right corner plain ivory background.` Gemini는 오른쪽 아래에 반투명 반짝임 워터마크를 넣는다. 그 자리에 소품이 있으면 워터마크가 눈에 띈다.
   - 제목·문장·로고·워터마크 금지, 허용하는 짧은 숫자나 기호만 명시
4. 정리한 입력과 프롬프트를 사용자에게 보여 주고 바로 생성으로 넘어간다. 사용자가 장면을 바꾸라고 하면 반영한다.

## 2. 두 서비스에 동시에 요청

`tabs_context_mcp`로 탭 그룹을 확인하고 새 탭 두 개를 만들어 각각 `https://chatgpt.com/`과 `https://gemini.google.com/app`을 연다. 기존 사용자 탭은 쓰지 않는다. 두 탭의 작업은 `browser_batch`로 묶어 번갈아 진행한다.

기준 이미지(절대 경로로 전달):

- 캐릭터: `public/assets/images/logo/steady-spiral-color.png`
- 스타일: `src/assets/images/posts/replication-rpc-ordering-cover.webp`

**ChatGPT 탭**

1. `find`로 "사진 첨부" 파일 입력(accept `image/*`, multiple)의 ref를 얻는다.
2. `file_upload`로 기준 이미지 두 장을 한 번에 올린다. 입력창 위에 썸네일 두 개가 보이는지 스크린샷으로 확인한다.
3. 입력창(`ChatGPT에게 물어보세요` textbox)을 클릭하고 프롬프트를 `type`으로 입력한 뒤 보내기 버튼을 한 번 누른다. Enter 대신 버튼을 누르고, 결과가 불확실하면 다시 보내지 않는다.

**Gemini 탭**

1. 입력창 왼쪽 `+` 버튼을 눌러 메뉴를 연다. 파일 입력은 메뉴가 열려 있을 때만 DOM에 있다. Escape를 누르면 사라진다.
2. 메뉴가 열린 상태에서 `find`로 이미지 파일 입력(accept `image/*`)의 ref를 얻고 `file_upload`로 두 장을 올린다.
3. 입력창(`Gemini 프롬프트 입력`)을 클릭하고 같은 프롬프트를 입력한 뒤 보내기 버튼을 누른다.

보통 1분 안에 끝난다. 10초 간격으로 스크린샷을 찍어 진행을 확인하고, 사용량 제한·거절 메시지가 보이면 그 서비스는 건너뛰고 사용자에게 알린다.

## 3. 원본 저장

후보는 `.cache/post-cover/<slug>/`에 저장한다(gitignore 대상).

**ChatGPT** — 다운로드 없이 원본 PNG(보통 1672×941)를 받는다. chatgpt.com의 CSP가 localhost fetch를 막으므로 팝업 수신 페이지로 넘긴다.

1. 수신기를 백그라운드로 띄운다. 파일 하나를 저장하면 경로를 출력하고 종료한다.

   ```bash
   pnpm cover receive <slug> --name chatgpt.png
   ```

2. ChatGPT 탭에서 `javascript_tool`로 임시 버튼을 붙인다. 팝업은 실제 클릭(사용자 활성화)이 있어야 열린다.

   ```js
   window.__coverSave = { status: "idle" };
   const btn = document.createElement("button");
   btn.textContent = "Save cover candidate";
   Object.assign(btn.style, { position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)", zIndex: 2147483647, padding: "12px 20px", background: "#84cc16", color: "#000", borderRadius: "8px" });
   btn.addEventListener("click", async () => {
   	const w = window.open("http://127.0.0.1:47321/", "post-cover-receiver", "width=360,height=200");
   	if (!w) { window.__coverSave.status = "popup blocked"; return; }
   	const imgs = [...document.querySelectorAll('[data-testid="generated-image-preview"] img')];
   	const blob = await fetch(imgs[imgs.length - 1].src).then((r) => r.blob());
   	window.addEventListener("message", function onMessage(e) {
   		if (e.data?.receiverReady) w.postMessage({ blob }, "*");
   		if (e.data?.saved) { window.__coverSave = { status: "saved", ...e.data.saved }; window.removeEventListener("message", onMessage); w.close(); btn.remove(); }
   	});
   });
   document.body.appendChild(btn);
   ```

3. `find`로 `Save cover candidate` 버튼 ref를 얻어 클릭하고, `window.__coverSave.status`가 `saved`인지 확인한다.

**Gemini** — 화면의 이미지와 "이미지 복사"는 1024×572 미리보기다. 원본(보통 1376×768)은 "원본 크기 이미지 다운로드" 버튼으로만 받을 수 있고, 이 버튼은 `~/Downloads`에 파일을 저장한다. 파일 다운로드이므로 **클릭 전에 사용자에게 허락을 받는다**(파일명 `Gemini_Generated_Image_*.png`, 출처 gemini.google.com, 1MB 안팎). 사용자의 커버 요청 메시지에 후보 저장 허락이 이미 있으면 다시 묻지 않는다.

1. 클릭 직전 시각을 `date +%s000`으로 기록한다.
2. 이미지 위에 마우스를 올리고 `find`로 "원본 크기 이미지 다운로드" 버튼을 찾아 클릭한다.
3. 다운로드 파일을 후보 폴더로 옮긴다.

   ```bash
   pnpm cover collect <slug> --since <기록한 시각>
   ```

## 4. 후보 검토와 선택

1. 두 후보를 `Read`로 보고, `SendUserFile`로 사용자에게 함께 보여 준다.
2. 후보마다 짧게 평가한다: 캐릭터 일관성, 글의 개념과의 연결, 기술적 오해 소지, 중앙 크롭 여유, 불필요한 문자. Gemini 후보는 오른쪽 아래 워터마크가 소품과 겹치는지도 확대해서 확인한다. 워터마크를 지우거나 가리는 편집은 하지 않는다. 겹치면 그 사실을 알리고 재생성이나 다른 후보를 제안한다.
3. **사용자가 고르기 전에는 글에 적용하지 않는다.** 수정 요청이 있으면 같은 대화에서 고칠 점만 요청하고 새 결과를 다시 저장한다.

## 5. 적용

```bash
pnpm cover apply <slug> .cache/post-cover/<slug>/<chosen>.png
```

- 16:9가 아니면 중앙을 16:9로 자른 뒤 `cwebp -q 85 -resize 1600 900`으로 `src/assets/images/posts/<slug>-cover.webp`를 만든다.
- 프런트매터 `published:` 바로 뒤에 `image: ../../assets/images/posts/<slug>-cover.webp`를 넣고 `pnpm lqips`를 실행한다.
- 글에 이미 `image`가 있으면 멈춘다. 사용자가 교체를 요청한 경우에만 `--force`를 붙인다.

## 6. 검증

1. `pnpm check`, `pnpm type-check`, `pnpm build`
2. `pnpm dev`에서 카드 크롭을 확인한다. 목록형 데스크톱(1440px), 그리드형(`localStorage.postListLayout = "grid"` 후 새로고침), 모바일(375px)에서 얼굴과 핵심 소품이 보이는지 본다. 스크린샷은 QA에만 쓰고 커밋하거나 PR에 첨부하지 않는다.

## 7. 작업 기록과 정리

- `docs/blog-image-records/<slug>-cover-<YYYY-MM-DD>.json`에 기존 기록과 같은 형식으로 남긴다: `created`, `branch`, `tool`(`chatgpt-web` 또는 `gemini-web`), `post`, `userDirection`, `references`, `assets[]`(`path`, `width`, `height`, `prompt`, `revisions`, `review`), 그리고 선택하지 않은 후보의 도구와 탈락 이유.
- PR 본문 `## Notes`에 생성 도구, 기준 이미지, 후처리, 프롬프트(`<details>`)를 적는다.
- 만든 탭을 닫는다. ChatGPT와 Gemini의 대화 기록은 사용자의 계정에 남으므로 지우지 않고, 남아 있다는 사실만 알린다.
- `.cache/post-cover/<slug>/`의 후보는 사용자가 원하면 지운다.
