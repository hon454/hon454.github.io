---
title: "Steam 인증 티켓과 EOS Private Sandbox 권한 확인"
published: 2023-11-13
description: "Steam Web API 인증 티켓을 사용한 EOS 로그인 실패가 Private Sandbox의 Player Group과 Deployment 권한 누락에서 발생한 사례를 정리합니다."
image: ""
tags:
  - unreal-engine
  - steam
  - epic-online-services
  - authentication
  - sandbox
category: Unreal Engine
draft: true
lang: ko
---

Steam 계정으로 Epic Online Services에 로그인하는 흐름에서 Private Sandbox만 실패하는 문제가 있었다. 티켓 요청 코드는 다음과 같은 형태였다.

```cpp
SteamAPICall_t Call = SteamUser()->GetAuthTicketForWebApi("epiconlineservices");
```

## 문제 현상

개발 환경에서 Steam Web API ticket을 받아 EOS 인증에 전달했지만 특정 private sandbox에서 로그인하지 못했다. 처음에는 `GetAuthTicketForWebApi`가 반환한 handle이나 ticket 생성 자체가 원인처럼 보였다.

## 적용 범위

Steam external credential을 EOS Connect 또는 Auth 흐름에 연결하고, Epic Developer Portal에서 공개되지 않은 sandbox와 deployment를 운영하는 경우에 해당한다.

## 원인

해당 계정이 속한 Epic Developer Portal의 Player Group에는 target sandbox가 허용돼 있었지만, 그 안에서 실제로 사용하는 deployment가 빠져 있었다. Private Sandbox 접근은 sandbox 이름만 맞는다고 끝나지 않고 계정 그룹이 필요한 deployment까지 사용할 수 있어야 했다.

![Player Group에 등록된 테스트 계정과 제품 접근 설정](./images/steam-eos-private-sandbox-web-api-auth-ticket/eos-player-group-accounts.webp)

![Player Group에 Sandbox와 Deployment를 함께 허용한 설정](./images/steam-eos-private-sandbox-web-api-auth-ticket/eos-player-group-sandbox-deployments.webp)

## 재현 및 진단

1. Steam API call handle과 `GetTicketForWebApiResponse_t` callback을 구분해 기록한다.
2. callback의 result, ticket byte length와 service identity 문자열을 확인한다.
3. EOS 로그에서 credential 검증 실패인지 sandbox/deployment 접근 거부인지 분리한다.
4. Product Settings의 Player Group에 테스트 계정이 포함됐는지 확인한다.
5. 그룹의 sandbox뿐 아니라 실제 deployment 권한도 확인한다.

## 해결 방법

테스트 계정이 속한 Player Group에 target sandbox와 deployment를 모두 추가했다. 권한 반영 뒤 새 ticket으로 로그인 흐름을 다시 시작했을 때 인증이 완료됐다.

Steam의 `GetAuthTicketForWebApi` 반환값은 비동기 요청 handle이다. 그 값만 보고 ticket 유효성을 판정하지 말고 callback 결과와 실제 ticket payload를 확인해야 한다. 이번 사례의 최종 해결 지점은 Steam ticket 생성 코드가 아니라 EOS 접근 제어 설정이었다.

## 검증 방법

- 권한이 있는 계정과 없는 계정으로 각각 로그인해 접근 제어가 의도대로 동작하는지 확인한다.
- 다른 sandbox/deployment 조합에서도 교차 시험한다.
- ticket 재사용이나 만료를 피하고 매 시도에서 새 ticket을 발급한다.
- client 로그에 ticket 본문, Steam ID, product secret을 남기지 않는다.

## 주의점

Player Group에 모든 사용자를 넣어 문제를 숨기면 production 접근 범위가 넓어진다. 최소 권한으로 테스트 그룹을 나누고, 계정·제품명·식별자는 스크린샷과 로그를 공유하기 전에 제거한다.

## 참고 자료

- [Steamworks: ISteamUser::GetAuthTicketForWebApi](https://partner.steamgames.com/doc/api/ISteamUser?language=english)
- [Steamworks Web API: AuthenticateUserTicket](https://partner.steamgames.com/doc/webapi/isteamuserauth)
