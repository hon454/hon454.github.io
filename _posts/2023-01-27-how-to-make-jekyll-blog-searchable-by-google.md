---
title: Jekyll 블로그가 구글 검색에 노출 되도록 하는 방법
date: 2023-01-21 01:13:00 +0900
categories: [Jekyll]
tags: [jekyll, blog, github, chirpy, google, google search]
typora-root-url: ./..
---

## 진행과정

####  [Google Search Console](https://search.google.com/search-console) 로그인 및 URL 접두어 선택 후 블로그 주소 입력

![google-search-console](/assets/images/2023-01-27-how-to-make-jekyll-blog-searchable-by-google/google-search-console.png)



#### 소유권 확인 창에서 HTML 태그 섹션의 메타태그 복사

<img src="/assets/images/2023-01-27-how-to-make-jekyll-blog-searchable-by-google/check-authority-by-html-tag.png" alt="check-authority-by-html-tag"  />



#### 복사한 메타태그에서 `content`에 해당하는 값을 복사

```yaml
<meta name="google-site-verification" content="_wV_-z2V..........................................c0pTIY" />
```

위 메타태그에서 `_wV_-z2V..........................................c0pTIY`가 해당한다.



#### `_config.yml`의 `google_site_verification`에 복사한 값 붙여넣기

```yaml
...
google_site_verification: _wV_-z2V..........................................c0pTIY
...
```
{: file="_config.yml" }



#### 변경 내용 Push 후 Deploy가 될 때 까지 대기 후 확인 버튼 클릭

![check-authority-success](/assets/images/2023-01-27-how-to-make-jekyll-blog-searchable-by-google/check-authority-success.png)





## 참고자료

[Jekyll 테마에서 구글 검색 노출 등록하기](https://www.irgroup.org/posts/jekyll-google-search/)
