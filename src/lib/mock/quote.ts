/**
 * 견적서 더미 데이터 유틸리티
 * 개발 및 테스트용 견적서 데이터를 생성합니다.
 * Phase 3 노션 API 연동 후에는 테스트용으로만 사용됩니다.
 */

import {
  QuoteData,
  QuoteItem,
  QuoteStatus,
  SenderInfo,
  ReceiverInfo,
} from "@/types/quote";

/**
 * 기본 발신자(공급자) 정보
 */
export const MOCK_SENDER: SenderInfo = {
  companyName: "주식회사 테크솔루션",
  representative: "김대표",
  businessNumber: "123-45-67890",
  address: "서울특별시 강남구 테헤란로 123, 테크빌딩 5층",
  phone: "02-1234-5678",
  email: "contact@techsolution.co.kr",
  logoUrl: undefined,
};

/**
 * 기본 수신자(고객) 정보
 */
export const MOCK_RECEIVER: ReceiverInfo = {
  companyName: "스타트업 주식회사",
  representative: "이담당",
  address: "서울특별시 서초구 서초대로 456",
  phone: "02-9876-5432",
  email: "contact@startup.com",
};

/**
 * 샘플 품목 데이터
 */
const SAMPLE_ITEMS = [
  { name: "웹사이트 기획 및 디자인", unitPrice: 3000000 },
  { name: "프론트엔드 개발", unitPrice: 5000000 },
  { name: "백엔드 API 개발", unitPrice: 4000000 },
  { name: "데이터베이스 설계 및 구축", unitPrice: 2000000 },
  { name: "서버 인프라 구축", unitPrice: 1500000 },
  { name: "QA 테스트", unitPrice: 1000000 },
  { name: "유지보수 (월)", unitPrice: 500000 },
  { name: "기술 컨설팅 (시간)", unitPrice: 200000 },
  { name: "교육 및 매뉴얼 작성", unitPrice: 800000 },
  { name: "보안 점검 및 최적화", unitPrice: 1200000 },
];

/**
 * 랜덤 UUID 생성
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 견적 품목 목록 생성
 * @param count 생성할 품목 수 (기본값: 3-5개 랜덤)
 */
export function generateMockQuoteItems(count?: number): QuoteItem[] {
  const itemCount = count ?? Math.floor(Math.random() * 3) + 3;
  const shuffled = [...SAMPLE_ITEMS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, itemCount);

  return selected.map((item, index) => {
    const quantity = Math.floor(Math.random() * 3) + 1;
    const amount = item.unitPrice * quantity;

    return {
      id: `item-${index + 1}`,
      name: item.name,
      description: undefined,
      quantity,
      unitPrice: item.unitPrice,
      amount,
    };
  });
}

/**
 * 견적서 전체 데이터 생성
 * @param id 견적서 ID (기본값: 랜덤 UUID)
 * @param options 추가 옵션
 */
export function generateMockQuote(
  id?: string,
  options?: {
    status?: QuoteStatus;
    items?: QuoteItem[];
    includeNotes?: boolean;
    isExpired?: boolean;
  }
): QuoteData {
  const quoteId = id ?? generateUUID();
  const items = options?.items ?? generateMockQuoteItems();
  const status = options?.status ?? "pending";
  const includeNotes = options?.includeNotes ?? true;
  const isExpired = options?.isExpired ?? false;

  // 금액 계산
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxRate = 0.1;
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;

  // 날짜 생성
  const now = new Date();
  const createdAt = new Date(now);
  createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));

  // 유효기간: 만료 테스트용이면 과거, 아니면 미래
  const validUntil = new Date(createdAt);
  if (isExpired) {
    validUntil.setDate(validUntil.getDate() + 15); // 이미 지난 날짜
  } else {
    validUntil.setDate(validUntil.getDate() + 30 + Math.floor(Math.random() * 30));
  }

  // 견적번호 생성
  const year = createdAt.getFullYear();
  const month = String(createdAt.getMonth() + 1).padStart(2, "0");
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
  const quoteNumber = `Q-${year}${month}-${seq}`;

  return {
    id: quoteId,
    quoteNumber,
    title: "웹 애플리케이션 개발 견적서",
    sender: MOCK_SENDER,
    receiver: MOCK_RECEIVER,
    items,
    subtotal,
    taxRate,
    tax,
    total,
    notes: includeNotes
      ? "결제 조건: 계약금 50%, 잔금 50% (검수 완료 후)\n작업 기간: 계약일로부터 약 8주 소요 예정\n본 견적서는 발행일로부터 30일간 유효합니다."
      : undefined,
    validUntil: validUntil.toISOString(),
    createdAt: createdAt.toISOString(),
    updatedAt: now.toISOString(),
    status,
  };
}

/**
 * 특정 상태의 견적서 생성 헬퍼
 */
export const createPendingQuote = (id?: string) =>
  generateMockQuote(id, { status: "pending" });

export const createApprovedQuote = (id?: string) =>
  generateMockQuote(id, { status: "approved" });

export const createRejectedQuote = (id?: string) =>
  generateMockQuote(id, { status: "rejected" });

export const createExpiredQuote = (id?: string) =>
  generateMockQuote(id, { isExpired: true });
