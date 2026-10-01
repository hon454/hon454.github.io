---
title: "접속 시 레벨 스트리밍 상태 RPC 줄이기"
published: 2026-10-01
description: "Night of the Dead에서 접속한 클라이언트에 스트리밍 레벨 상태를 보내는 RPC를 줄이기 위해 패키지 이름을 테이블 기반 코드로 바꾸고 플래그를 비트로 묶은 방법과, 그 앞뒤에 놓인 클라이언트 준비 게이트와 에셋 사전 로딩을 정리한다."
image: ./images/notd-multiplayer-optimization/cover.avif
tags:
  - unreal-engine
  - networking
  - level-streaming
  - dedicated-server
category: Unreal Engine
series: Night of the Dead 멀티플레이 최적화
seriesOrder: 3
draft: true
lang: ko
---

클라이언트가 서버에 접속하면 엔진은 현재 스트리밍 레벨들의 상태를 한 번에 알려 준다. `AGameModeBase::ReplicateStreamingStatus()`가 월드의 모든 스트리밍 레벨을 순회하며 상태 배열을 만들고, `ClientUpdateMultipleLevelsStreamingStatus()`라는 Reliable Client RPC로 보낸다.

배열의 원소는 `FUpdateLevelStreamingLevelStatus`다. 로드 여부와 표시 여부 같은 플래그 몇 개, LOD 인덱스, 그리고 레벨의 패키지 이름(`FName`)이 들어 있다. 패키지 이름은 `/Game/Maps/...`로 시작하는 긴 경로이고 네트워크에서는 문자열로 전송된다.

[Night of the Dead](/projects/night-of-the-dead/)는 오픈월드라 스트리밍 레벨 수가 많았다. 접속할 때마다 레벨 수만큼의 경로 문자열이 Reliable RPC 하나에 실렸고, 이 RPC는 여러 번치로 쪼개져 접속 직후의 Reliable 버퍼를 차지했고, 실제로 버퍼가 넘쳤다. 내용 대부분은 서버와 클라이언트가 이미 똑같이 알고 있는 문자열이었다.

이 글의 코드는 구조를 설명하기 위해 새로 작성한 예시이며 프로젝트의 실제 코드와는 이름과 세부가 다르다.

## 경로 대신 코드를 보낸다

스트리밍 레벨의 목록은 빌드에 고정돼 있다. 양쪽이 같은 표를 가지고 있으면 경로 대신 표의 번호만 보내면 된다.

레벨 에셋을 한 행에 하나씩 담은 DataTable을 만들고, 게임 인스턴스 서브시스템이 시작할 때 이 표를 읽어 양방향 맵을 만든다. 코드는 행 순서에 1을 더한 값이다. 0은 "코드 없음"으로 남겨 둔다.

```cpp
void ULevelStatusCoderSubsystem::BuildCodeMaps(const UDataTable* Table)
{
	TArray<FLevelCodeRow*> Rows;
	Table->GetAllRows(FString(), Rows);

	NameToCode.Empty(Rows.Num());
	CodeToName.Empty(Rows.Num());

	for (int32 Index = 0; Index < Rows.Num(); ++Index)
	{
		if (Rows[Index]->Level.IsNull())
		{
			continue;
		}

		const int16 Code = static_cast<int16>(Index + 1);
		const FName PackageName(*Rows[Index]->Level.GetLongPackageName());

		NameToCode.Add(PackageName, Code);
		CodeToName.Add(Code, PackageName);
	}
}
```

## 전송용 구조체

엔진의 구조체를 직접 고칠 수는 없으므로 같은 내용을 담는 전송용 구조체를 따로 두고 커스텀 `NetSerialize`를 붙였다.

```cpp
USTRUCT()
struct FCodedLevelStatus
{
	GENERATED_BODY()

	UPROPERTY()
	FName PackageName;

	UPROPERTY()
	int16 Code = 0;

	UPROPERTY()
	int8 LODIndex = 0;

	UPROPERTY()
	bool bShouldBeLoaded = false;

	UPROPERTY()
	bool bShouldBeVisible = false;

	UPROPERTY()
	bool bShouldBlockOnLoad = false;

	UPROPERTY()
	bool bShouldBlockOnUnload = false;

	bool NetSerialize(FArchive& Ar, UPackageMap* Map, bool& bOutSuccess)
	{
		const bool bHasCode = Ar.IsSaving() && Code != 0;

		uint8 Flags = 0;
		Flags |= bShouldBeLoaded << 0;
		Flags |= bShouldBeVisible << 1;
		Flags |= bShouldBlockOnLoad << 2;
		Flags |= bShouldBlockOnUnload << 3;
		Flags |= bHasCode << 4;
		Ar.SerializeBits(&Flags, 5);

		bShouldBeLoaded = (Flags & (1 << 0)) != 0;
		bShouldBeVisible = (Flags & (1 << 1)) != 0;
		bShouldBlockOnLoad = (Flags & (1 << 2)) != 0;
		bShouldBlockOnUnload = (Flags & (1 << 3)) != 0;

		Ar << LODIndex;

		if ((Flags & (1 << 4)) != 0)
		{
			Ar << Code;
			if (Ar.IsLoading())
			{
				PackageName = NAME_None;
			}
		}
		else
		{
			Ar << PackageName;
			if (Ar.IsLoading())
			{
				Code = 0;
			}
		}

		bOutSuccess = true;
		return true;
	}
};

template<>
struct TStructOpsTypeTraits<FCodedLevelStatus> : public TStructOpsTypeTraitsBase2<FCodedLevelStatus>
{
	enum
	{
		WithNetSerializer = true,
	};
};
```

와이어에 실리는 내용은 다음과 같다.

| 필드 | 크기 |
| --- | --- |
| 플래그 넷과 "코드 사용" 비트 | 5비트 |
| LOD 인덱스 | 8비트 |
| 코드가 있을 때: 레벨 코드 | 16비트 |
| 코드가 없을 때: 패키지 이름 | 문자열 |

표에 있는 레벨 하나는 29비트다. 엔진의 LOD 인덱스는 `int32`지만 실제 값의 범위가 좁아 `int8`로 줄였다.

### 표에 없는 레벨은 그대로 보낸다

다섯 번째 비트가 이 설계의 안전장치다. 표에 등록되지 않은 레벨은 코드가 0이고, 이때는 원래대로 패키지 이름을 보낸다. 레벨을 추가하고 표 갱신을 잊어도 접속은 정상 동작하고 그 레벨만 압축되지 않는다. 서버는 코드가 없는 레벨을 만나면 경고 로그를 남겨 누락을 알 수 있게 했다.

표를 갖추지 않은 맵으로 테스트할 때를 위해 이 경고를 끄는 설정도 두었다.

## 엔진 함수 교체

`ReplicateStreamingStatus()`는 가상 함수다. 엔진 구현을 그대로 옮긴 뒤 RPC를 호출하는 부분만 바꿨다.

```cpp
void AMyGameMode::ReplicateStreamingStatus(APlayerController* PC)
{
	// ... 엔진 구현과 동일하게 LevelStatuses를 채운다 ...

	if (AMyPlayerController* MyPC = Cast<AMyPlayerController>(PC))
	{
		TArray<FCodedLevelStatus> Coded;
		Coded.Reserve(LevelStatuses.Num());
		for (const FUpdateLevelStreamingLevelStatus& Status : LevelStatuses)
		{
			Coded.Add(Coder->Encode(Status));
		}

		MyPC->ClientUpdateCodedLevelStatuses(Coded);
	}
	else
	{
		PC->ClientUpdateMultipleLevelsStreamingStatus(LevelStatuses);
	}

	PC->ClientFlushLevelStreaming();
}
```

클라이언트는 받은 배열을 엔진의 구조체로 되돌린 뒤 엔진의 처리 함수를 그대로 호출한다. 레벨 스트리밍 로직 자체는 건드리지 않는다.

```cpp
void AMyPlayerController::ClientUpdateCodedLevelStatuses_Implementation(const TArray<FCodedLevelStatus>& Coded)
{
	TArray<FUpdateLevelStreamingLevelStatus> Decoded;
	Decoded.Reserve(Coded.Num());
	for (const FCodedLevelStatus& Status : Coded)
	{
		Decoded.Add(Coder->Decode(Status));
	}

	ClientUpdateMultipleLevelsStreamingStatus_Implementation(Decoded);
}
```

바꾼 범위는 접속 시의 일괄 전송 하나다. 플레이 중 레벨 하나의 상태가 바뀔 때 가는 RPC는 엔진 경로를 그대로 쓴다.

## 주의할 점

- 코드는 DataTable의 행 순서다. 서버와 클라이언트의 표가 다르면 다른 레벨이 로드된다. 표는 빌드에 함께 들어가므로 버전이 같으면 일치하지만, 버전이 다른 클라이언트의 접속을 다른 경로로 막고 있어야 한다.
- 엔진 함수를 통째로 옮겼기 때문에 엔진을 올릴 때 원본의 변경을 직접 따라가야 한다. `FUpdateLevelStreamingLevelStatus`에 필드가 추가되면 전송용 구조체에도 반영해야 한다.
- 코드의 타입이 `int16`이므로 표의 행 수에 상한이 있다.

## 접속 과정에서의 위치

이 RPC는 접속 과정의 한 단계일 뿐이다. 클라이언트가 실제로 플레이할 수 있게 되기까지는 다음 조건을 순서대로 통과해야 했다. PlayerController가 매 틱 플래그를 확인하고, 앞 단계가 끝나지 않았으면 뒤 단계로 넘어가지 않는다.

1. 에셋 사전 로딩 완료
2. 상주 서브레벨 로드 완료
3. 서버 초기화 완료 (복제된 플래그로 확인)
4. 서버와의 초기 동기화 완료
5. 로딩 화면 해제와 입력 허용
6. HUD 초기화

로딩 화면은 PlayerController가 만들어지는 시점부터 띄우고 5번에서 내린다. 그 전까지 플레이어의 뷰 위치를 무효한 값으로 돌려주도록 해 두었다. 임시 스폰 위치를 기준으로 주변 레벨이 스트리밍되거나 주변 액터가 복제 대상으로 잡히는 일을 막기 위해서다.

### 에셋 사전 로딩

1번 게이트는 플레이 중 첫 사용 시점에 생기던 로딩을 접속 시점으로 옮기는 단계다. 소프트 참조로 둔 애니메이션과 이펙트를 좀비가 처음 등장하거나 처음 피격되는 순간에 로드하면 끊김이 생긴다.

레벨에 배치한 프리로더 액터가 네 단계를 비동기로 이어서 처리한다.

1. 데이터 테이블에서 수집한 이펙트, 사운드, 플레이어 애니메이션
2. 사전 로딩 목록 에셋에 명시한 에셋과 블루프린트 클래스. 목록을 하나씩 순서대로 로드하면서 로딩 화면의 진행률을 갱신한다.
3. 2번에서 로드된 에셋이 다시 참조하는 2차 에셋. 해당 에셋 타입이 "내가 필요로 하는 에셋 목록"을 돌려주는 인터페이스를 구현한다.
4. 2번에서 로드된 클래스의 CDO가 지연 로딩하는 에셋. 좀비 클래스가 자기 공격, 피격 애니메이션 목록을 직접 알려 주는 식이다.

로드된 객체는 프리로더가 하드 참조로 쥐고 있어 GC에 수거되지 않는다.

멀티플레이와 관련된 부분은 두 가지다. Dedicated Server는 별도의 목록을 쓴다. 서버에는 이펙트나 사운드가 필요 없으므로 클라이언트 목록을 그대로 로드하면 메모리와 시작 시간만 늘어난다. 서버는 GameMode의 `BeginPlay()`에서 서버용 목록으로 같은 프리로더를 돌린 뒤 게임을 시작한다. 클라이언트 쪽에는 사전 로딩 수준 옵션이 있어, 목록 항목마다 지정한 최소 수준보다 옵션이 낮으면 그 항목을 건너뛴다.

2단계는 한꺼번에 요청하지 않고 하나씩 로드한다. 항목이 끝날 때마다 진행률을 갱신할 수 있어 로딩 화면이 멈춘 것처럼 보이지 않는다.

## 참고 자료

- [Level Streaming in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/level-streaming-in-unreal-engine)
- [Asynchronous Asset Loading in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/asynchronous-asset-loading-in-unreal-engine)
