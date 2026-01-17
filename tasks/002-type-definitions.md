# Task 002: 타입 정의 및 데이터 인터페이스 설계

## 개요

견적서 시스템에서 사용할 모든 TypeScript 타입과 인터페이스를 정의합니다. 노션 데이터베이스 스키마와 매핑되는 타입을 설계하여 타입 안전성을 확보합니다.

## 관련 PRD 섹션

- 8.4 API 명세
- 8.5 데이터 모델
- TypeScript 타입 정의 예시

## 관련 파일

- `src/types/quote.ts` - 견적서 관련 모든 타입 정의
- `src/types/index.ts` - 타입 배럴 익스포트 업데이트

## 수락 기준

- [ ] QuoteData 인터페이스가 PRD 명세와 일치한다
- [ ] QuoteItem 인터페이스가 정의되어 있다
- [ ] SenderInfo, ReceiverInfo 인터페이스가 정의되어 있다
- [ ] QuoteStatus 타입이 정의되어 있다
- [ ] ApiResponse, ApiError 제네릭 타입이 정의되어 있다
- [ ] 모든 타입이 배럴 익스포트를 통해 접근 가능하다

## 구현 단계

### 1단계: 기본 타입 정의

- [ ] `src/types/quote.ts` 파일 생성
- [ ] QuoteStatus 타입 정의 (`'active' | 'expired' | 'cancelled'`)
- [ ] SenderInfo 인터페이스 정의
- [ ] ReceiverInfo 인터페이스 정의
- [ ] QuoteItem 인터페이스 정의

### 2단계: 핵심 데이터 타입 정의

- [ ] QuoteData 인터페이스 정의
- [ ] 모든 속성의 optional/required 여부 PRD와 일치 확인
- [ ] 날짜 필드 타입 결정 (string 또는 Date)

### 3단계: API 관련 타입 정의

- [ ] ApiError 인터페이스 정의
- [ ] ApiResponse<T> 제네릭 인터페이스 정의
- [ ] QuoteApiResponse 타입 별칭 정의

### 4단계: 익스포트 및 검증

- [ ] `src/types/index.ts`에 배럴 익스포트 추가
- [ ] 타입스크립트 컴파일 오류 없음 확인
- [ ] 다른 파일에서 import 테스트

## 타입 정의 참조

```typescript
// PRD 8.5 데이터 모델 기준

export type QuoteStatus = 'active' | 'expired' | 'cancelled';

export interface SenderInfo {
  companyName: string;
  contactName: string;
  phone: string | null;
  email: string | null;
  address: string | null;
}

export interface ReceiverInfo {
  companyName: string;
  contactName: string | null;
}

export interface QuoteItem {
  id: number;
  name: string;
  description: string | null;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

export interface QuoteData {
  id: string;
  quoteNumber: string;
  issueDate: string;
  validUntil: string;
  status: QuoteStatus;
  sender: SenderInfo;
  receiver: ReceiverInfo;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export type QuoteApiResponse = ApiResponse<QuoteData>;
```

## 참고 사항

- 날짜는 ISO 8601 형식 문자열로 저장 (노션 API 응답 형식과 일치)
- null을 사용하여 선택적 필드 표현 (undefined 대신)
- 금액 필드는 number 타입 (원 단위 정수)

## 예상 소요 시간

약 2시간

## 변경 사항 요약

> 작업 완료 후 작성합니다.
