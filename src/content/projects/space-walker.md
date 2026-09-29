---
title: "Space Walker"
published: 2017-05-11
description: "모션 트래킹 기반 VR 공연 콘텐츠. 3D 배경 인터랙션, 전신 모션 연동과 GPU 파티클 적용을 담당했고 Unite ’17 Seoul 키노트에서 시연됐다."
image: ./images/space-walker/cover.webp
tags: [unity, csharp, oculus, perception-neuron]
draft: false
status: archived
lang: ko
---

| 항목 | 내용 |
| --- | --- |
| 기간 | 2017.05 - 2017.06 |
| 소속 | 클릭트 |
| 역할 | 클라이언트 프로그래머 |
| 기술 | Unity, C#, Oculus, Perception Neuron, GPU 파티클, onAirVR |

<iframe class="video-embed" src="https://www.youtube.com/embed/xht1Q-2weMw" title="Space Walker 영상 1" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<iframe class="video-embed" src="https://www.youtube.com/embed/S7bRLNLz0TA" title="Space Walker 영상 2" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 프로젝트와 담당 역할

Space Walker는 모션 트래킹 장비를 착용한 무용수의 움직임을 VR 공간에서 관람하는 공연 콘텐츠다. 클릭트와 홍익대학교 영상대학원 VR/AR 콘텐츠 전공이 산학협력으로 개발했고, 한국전파진흥협회의 2017년 차세대 실감콘텐츠 개발사업 지원을 받았다. 모션 트래킹에는 Perception Neuron을, VR 서버의 렌더링 결과를 무선 전송하는 데는 onAirVR을 사용했다. Unite ’17 Seoul 키노트 오프닝 공연으로 시연됐다.

## 담당 업무

- 3D 배경 인터랙션 구현
- 다수의 파티클을 실시간으로 처리할 때의 성능 부담을 줄이기 위해 GPU 파티클 시스템 적용
- Perception Neuron의 전신 모션을 Unity Humanoid 아바타에 연결하고 좌표축 차이 보정
