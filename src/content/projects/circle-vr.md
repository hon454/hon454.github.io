---
title: "CircleVR"
published: 2017-06-19
description: "클라우드 기반 다중 접속 무선 VR 전시 플랫폼. 장치 간 좌표계 보정과 외부 시점 연결을 담당했고 홍익대학교 VR 뮤지엄에 설치됐다."
image: ./images/circle-vr/cover.webp
tags: [unity, csharp, htc-vive, tcp-ip]
draft: false
status: published
lang: ko
---

| 항목 | 내용 |
| --- | --- |
| 기간 | 2017.06 - 2018.02 |
| 소속 | 클릭트 |
| 역할 | 클라이언트 프로그래머 |
| 기술 | Unity, C#, Gear VR, HTC Vive Tracker, TCP/IP |

## 프로젝트와 담당 역할

CircleVR은 클릭트가 개발한 클라우드 기반 다중 접속 무선 VR 플랫폼이다. VR 서버에서 렌더링한 콘텐츠를 onAirVR로 무선 전송하고, HTC Lighthouse 기반 트래커로 체험자의 위치를 추적한다. 내부에서는 Unity로 제작한 콘텐츠를 체험하고, 외부의 곡면 OLED 디스플레이 22대에는 각 체험자의 시점 영상을 출력해 관람객과 공유한다. 국내 작가들의 아이디어를 바탕으로 4개의 내부 콘텐츠를 제작해 홍익대학교 VR 뮤지엄 전시관에 설치했다.

클라이언트 프로그래머로 장치 간 좌표계 보정과 체험자 시점의 외부 출력 연결을 담당했다.

## 담당 업무

- Gear VR 클라이언트를 외부 Vive Tracker의 6DoF 좌표계에 맞추고 장착 오프셋을 보정
- Vive Tracker 정보를 소켓 통신으로 수신해 체험자의 위치와 자세를 콘텐츠에 연결
- 여러 사용자의 시점을 외부 디스플레이로 연결하는 전시 시스템 구성

## 전시 영상

<iframe class="video-embed" src="https://www.youtube.com/embed/SJXxF24qk70" title="CircleVR 영상 1" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<iframe class="video-embed" src="https://www.youtube.com/embed/vuU4vzvfMos" title="CircleVR 영상 2" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<iframe class="video-embed" src="https://www.youtube.com/embed/iW6r6pMeCUs" title="CircleVR 영상 3" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<iframe class="video-embed" src="https://www.youtube.com/embed/Fiy7w0SAdvI" title="CircleVR 영상 4" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<iframe class="video-embed" src="https://www.youtube.com/embed/8vgeLtJ5pj4" title="CircleVR 영상 5" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
