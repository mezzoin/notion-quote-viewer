/**
 * 견적서 관련 타입 정의
 * 노션 데이터베이스 스키마와 매핑되는 인터페이스들을 정의합니다.
 */

/**
 * 발신자(공급자) 정보 인터페이스
 * 견적서를 발행하는 회사의 정보를 담습니다.
 */
export interface SenderInfo {
  /** 회사명 */
  companyName: string;
  /** 대표자명 */
  representative: string;
  /** 사업자등록번호 */
  businessNumber: string;
  /** 회사 주소 */
  address: string;
  /** 연락처 */
  phone: string;
  /** 이메일 */
  email: string;
  /** 회사 로고 URL (선택) */
  logoUrl?: string;
}

/**
 * 수신자(고객) 정보 인터페이스
 * 견적서를 받는 고객/회사의 정보를 담습니다.
 */
export interface ReceiverInfo {
  /** 회사명 또는 고객명 */
  companyName: string;
  /** 담당자명 (선택) */
  representative?: string;
  /** 주소 (선택) */
  address?: string;
  /** 연락처 (선택) */
  phone?: string;
  /** 이메일 (선택) */
  email?: string;
}

/**
 * 견적 품목 인터페이스
 * 견적서에 포함되는 개별 품목 정보를 담습니다.
 */
export interface QuoteItem {
  /** 품목 고유 ID */
  id: string;
  /** 품목명 */
  name: string;
  /** 품목 설명 (선택) */
  description?: string;
  /** 수량 */
  quantity: number;
  /** 단가 (원) */
  unitPrice: number;
  /** 금액 (수량 * 단가) */
  amount: number;
}

/**
 * 노션 DB의 한글 상태값 타입
 * 노션 데이터베이스 Select 속성에 정의된 값들
 */
export type NotionQuoteStatus = "대기" | "승인" | "거절";

/**
 * 견적서 상태 타입 (앱 내부 사용)
 * - pending: 대기 중 (노션: 대기)
 * - approved: 승인됨 (노션: 승인)
 * - rejected: 거절됨 (노션: 거절)
 */
export type QuoteStatus = "pending" | "approved" | "rejected";

/**
 * 노션 상태 → 앱 상태 매핑 테이블
 * 노션 DB의 한글 상태값을 앱 내부 영어 상태값으로 변환
 */
export const NOTION_STATUS_MAP: Record<NotionQuoteStatus, QuoteStatus> = {
  "대기": "pending",
  "승인": "approved",
  "거절": "rejected",
} as const;

/**
 * 앱 상태 → 한글 라벨 매핑 테이블
 * UI 표시용 한글 라벨
 */
export const STATUS_LABELS: Record<QuoteStatus, string> = {
  pending: "대기",
  approved: "승인",
  rejected: "거절",
} as const;

/**
 * 견적서 전체 데이터 인터페이스
 * 견적서의 모든 정보를 포함하는 메인 인터페이스입니다.
 */
export interface QuoteData {
  /** 견적서 고유 ID (UUID) */
  id: string;
  /** 견적 번호 (예: Q-2024-001) */
  quoteNumber: string;
  /** 견적서 제목 */
  title: string;
  /** 발신자(공급자) 정보 */
  sender: SenderInfo;
  /** 수신자(고객) 정보 */
  receiver: ReceiverInfo;
  /** 품목 목록 */
  items: QuoteItem[];
  /** 소계 (부가세 제외 금액) */
  subtotal: number;
  /** 세율 (기본 10%, 0.1로 표현) */
  taxRate: number;
  /** 부가세 금액 */
  tax: number;
  /** 총액 (소계 + 부가세) */
  total: number;
  /** 비고 사항 (선택) */
  notes?: string;
  /** 견적 유효기간 (ISO 8601 형식, 선택) */
  validUntil?: string;
  /** 생성일시 (ISO 8601 형식) */
  createdAt: string;
  /** 수정일시 (ISO 8601 형식) */
  updatedAt: string;
  /** 견적서 상태 */
  status: QuoteStatus;
}

/**
 * API 에러 인터페이스
 * API 응답에서 에러 정보를 담는 구조입니다.
 */
export interface ApiError {
  /** 에러 코드 (예: INVALID_ID, NOT_FOUND, INTERNAL_ERROR) */
  code: string;
  /** 사용자에게 표시할 에러 메시지 */
  message: string;
  /** 추가 에러 상세 정보 (선택) */
  details?: unknown;
}

/**
 * API 응답 제네릭 인터페이스
 * 모든 API 응답의 표준 형식을 정의합니다.
 * @template T - 응답 데이터의 타입
 */
export interface ApiResponse<T> {
  /** 요청 성공 여부 */
  success: boolean;
  /** 응답 데이터 (성공 시) */
  data?: T;
  /** 에러 정보 (실패 시) */
  error?: ApiError;
}

/**
 * 견적서 API 응답 타입
 * 견적서 조회 API의 응답 타입입니다.
 */
export type QuoteApiResponse = ApiResponse<QuoteData>;

/**
 * 견적서 목록 API 응답 타입
 * 견적서 목록 조회 API의 응답 타입입니다.
 */
export type QuoteListApiResponse = ApiResponse<QuoteData[]>;
