---
title: "Rider 대용량 파일 코드 분석 제한 조정하기"
published: 2023-04-10
description: "JetBrains Rider가 큰 소스 파일의 code insight를 끌 때 파일별 분석 수준과 전역 크기 제한을 구분해 조정하는 방법을 설명합니다."
image: ""
tags:
  - rider
  - jetbrains
  - code-analysis
  - large-files
  - performance
category: Rider
draft: true
lang: ko
---

큰 소스 파일을 Rider에서 열면 syntax highlight만 일부 동작하고 code inspection, completion 또는 error analysis가 비활성화될 수 있다.

## 문제 현상

editor 상단에 파일이 너무 커서 code insight를 제공할 수 없다는 알림이 나타나거나, 작은 파일에서는 보이는 오류가 큰 파일에서 표시되지 않는다.

## 적용 범위

Rider의 IntelliJ platform editor limit 또는 ReSharper backend analysis limit에 걸린 파일에 해당한다. 두 제한은 서로 다른 설정이며 제품 버전별 기본값도 다르다.

## 원인

대용량 파일 분석은 parsing, index와 inspection 비용이 커서 IDE가 성능 보호를 위해 제한한다. 과거 기록에서 하나의 “기본 300KB”로 설명되기도 했지만 현재 JetBrains 안내는 platform의 `idea.max.intellisense.filesize` 기본값을 약 2.5MB로 설명하고, C#의 ReSharper analysis에는 별도의 300,000-byte threshold가 있을 수 있다고 구분한다.

## 재현 및 진단

1. 알림 문구가 file size limit인지 inspection severity 문제인지 확인한다.
2. 상태 표시줄의 Highlighting level이 `None`, `Syntax`, `All Problems` 중 무엇인지 본다.
3. `Help | Diagnostic Tools | Special Files and Folders` 또는 custom properties에서 현재 제한 설정을 확인한다.
4. 파일 byte 수와 generated/minified file 여부를 확인한다.

## 해결 방법

한 파일만 일시적으로 분석하려면 editor 오른쪽 위의 highlighting widget에서 `All Problems`를 선택한다. 전역 제한을 바꿔야 한다면 JetBrains가 안내하는 custom properties에서 현재 제품 버전에 맞는 key와 byte 단위를 사용한다.

```properties
idea.max.intellisense.filesize=5000
```

이 값은 예시일 뿐이다. ReSharper backend 제한에 걸렸다면 공식 지원 문서가 안내하는 별도 property를 사용해야 한다. 가장 좋은 장기 해결은 generated file을 분석 대상에서 제외하거나 거대한 hand-written source를 책임 단위로 분리하는 것이다.

## 검증 방법

- IDE를 재시작한 뒤 문제 파일에서 completion과 inspection이 복구되는지 확인한다.
- CPU, memory와 indexing 시간을 관찰한다.
- 작은 파일의 분석 성능이 악화되지 않았는지 확인한다.
- command-line build 결과와 Rider 표시가 일치하는지 비교한다.

## 주의점

제한을 크게 올리면 editor가 멈추거나 전체 solution 분석이 느려질 수 있다. IDE 분석은 compiler를 대체하지 않으므로 큰 파일에서 highlighting을 켰더라도 CI build와 static analysis를 유지한다.

## 참고 자료

- [JetBrains Support: Rider Cannot Analyze a Source File Because It Is Too Large](https://rider-support.jetbrains.com/hc/en-us/articles/360010996600-Rider-Cannot-Analyze-a-Source-File-Because-It-s-Too-Large)
- [JetBrains Support: The file size exceeds the configured limit](https://youtrack.jetbrains.com/articles/SUPPORT-A-4391/How-to-fix-The-file-size-exceeds-the-configured-limit-2.56-MB.-Code-insight-features-are-not-available)
