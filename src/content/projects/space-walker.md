---
title: "Space Walker"
published: 2017-05-11
description: "모션 트래킹 기반 VR 공연 콘텐츠. 3D 배경 인터랙션, 전신 모션 연동과 GPU 파티클 적용을 담당했다."
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

## 콘텐츠 개요

- 모션 트래킹 장비를 장착한 무용수가 추는 무용을 VR 공간에서 볼 수 있는 콘텐츠
- 모션 트래킹을 위해 Perception Neuron을 이용
- VR 서버에서 렌더링되는 실시간 VR콘텐츠를 무선 전송하는 ‘onAirVR’을 이용
- Unite ’17 Seoul 행사에서 키노트 오프닝 공연으로 시연 됨

## 담당 업무

- 3D 배경 인터랙션 구현
- 다수의 파티클을 실시간으로 처리할 때의 성능 부담을 줄이기 위해 GPU 파티클 시스템 적용
- Perception Neuron의 전신 모션을 Unity Humanoid 아바타에 연결하고 좌표축 차이 보정
