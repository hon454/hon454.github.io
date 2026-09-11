# Editor Reliability Labs

브라우저 3D 편집기를 개발하며 다룬 **상태의 확정, 비동기 입력, 재시도, 결과의 출처**를 설명하는 독립 코드 샘플입니다. 회사 코드·API·인증·에셋을 포함하지 않고 작은 모델로 새로 작성했습니다. 실제 Shotloom의 구현 언어, 전체 기능, 성능을 복제한 패키지는 아닙니다.

Node.js 24 이상만 있으면 설치 없이 실행할 수 있습니다.

```sh
node --test test/*.test.ts
node demo.ts
```

TypeScript 5.9.3으로 `tsc -p tsconfig.json`의 strict 검사도 통과했습니다. 타입 검사를 다시 하려면 별도로 설치한 TypeScript CLI를 사용합니다. 런타임 테스트와 데모에는 외부 패키지가 필요 없습니다.

## 5분 리뷰 경로

1. `src/document-session.ts`에서 후보 검증과 사용자 조작 단위의 확정을 봅니다.
2. `src/latest-intent.ts`에서 비동기 작업 하나와 마지막 입력 하나만 유지하는 구조를 봅니다.
3. `src/artifact-pipeline.ts`에서 입력 bytes 고정과 실패 단계부터의 재시도를 봅니다.
4. 테스트의 실패 주입 사례로 설계가 지키는 조건을 확인합니다.

## 모듈과 설계 선택

| 파일 | 설명하는 문제 | 지키는 조건 | 의도적으로 생략한 부분 |
|---|---|---|---|
| `latest-intent.ts` | 느린 실행기로 들어오는 반복 입력 | 진행 중 1개 + 최신 대기 입력 1개, 종료 시 진행 작업 대기 | 브리지 이벤트 상관관계, 포인터 UI, GPU 취소 |
| `document-session.ts` | 드래그·검증·Undo의 경계 | 검증 전 교체 금지, 취소 복원, 드래그 한 번은 Undo 한 번 | persistent tree 최적화, dirty set, 디스크 저장 |
| `revision-gate.ts` | 중복·오래된 편집 요청 | 같은 요청은 같은 영수증, ID 재사용과 다른 epoch 거부 | 네트워크/재시작을 넘는 exactly-once, 영구 dedupe |
| `animation.ts` | 카메라 회전과 포즈 회전 | 카메라의 회전 횟수 보존, 정규화 quaternion의 짧은 경로, key ID 유지 | cubic curve, rig retargeting, IK, rebake |
| `artifact-pipeline.ts` | 입력 출처와 부분 실패 | hash와 render에 같은 캡처 bytes 사용, 완료 단계 재사용 | 실제 코덱/GPU/파일시스템, publish의 내구성 |
| `asset-boundaries.ts` | 업로드·중복 로드·썸네일 | 예산을 먼저 검증, 실패 캐시는 제거, recipe가 cache key에 포함 | VRM 파서, 실제 renderer, LRU와 자산 수명 관리 |
| `selection.ts` | 다른 장면의 같은 이름 | 범위 전체로 정확히 하나를 선택, optional preview 실패 격리 | 제품의 전체 selector/validator와 UI |
| `recovery.ts` | 같은 작업 복원과 새 작업 진입 | 같은 run은 편집본 복원, 다른 run은 백업 성공 후 교체 | 실제 OPFS, owner lock 구현, 백업 바이트 검증 |

`DocumentSession`은 작은 예제이므로 각 편집 후보를 복사·동결하고 JSON으로 no-op을 비교합니다. 제품에서 사용한 구조 공유의 성능 이점을 이 코드가 구현한다고 주장하지 않습니다. `RevisionGate.apply`는 검증 후 한 번에 반영하거나 예외를 내야 합니다. callback이 부분 변경을 남기면 gate가 그것을 되돌려주지 않습니다.

`OutputSession.publish`는 원자적 발행 또는 같은 결과에 대한 안전한 재시도를 제공하는 어댑터여야 합니다. 프로세스가 종료되면 이 샘플의 체크포인트는 사라집니다. `enterWorkspace`는 호출자가 이미 소유권 잠금을 획득한 상태를 전제로 합니다. `backup` 성공은 저장과 검증을 완료했다는 뜻입니다.

## 검증

2026-09-11, Node.js 24.15.0, TypeScript 5.9.3, macOS에서 실행했습니다. 17개 테스트가 통과했고 strict 타입 검사는 오류가 없었습니다. 시간 수치는 제품 benchmark로 사용하지 않습니다.

- 10,000개 입력 폭주에서 첫 실행과 마지막 의도만 전달
- 작업 중 종료·실패 후 재시도
- 잘못된 편집의 롤백, 한 번의 Undo, redo 분기와 immutable snapshot
- 중복 요청·ID 충돌·stale revision·scope 불일치·dedupe eviction
- 카메라 720° 회전, quaternion 부호 동치, retiming 충돌
- 캡처 직후 원본 bytes가 바뀌어도 SHA-256과 렌더 입력이 일치
- 프레임 추출·발행 단계의 실패를 각각 주입하고 성공 단계의 재실행 방지
- 업로드 누적 제한, 중복 비동기 로드, 캐시 실패 후 복구
- selector 중복 거부, optional preview 격리, 백업 실패 시 원본 보존

테스트는 `test/reliability.test.ts`에 있고, 짧은 콘솔 데모는 `demo.ts`에 있습니다. 모든 fixture는 합성 데이터입니다. 본문에 넣은 코드 블록은 이 API의 사용 예이며, 운영 저장소 코드의 발췌가 아닙니다.
