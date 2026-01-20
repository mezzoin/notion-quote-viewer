/**
 * 관리자 기능용 더미 데이터
 * 개발 및 테스트 목적으로 사용
 */

import type { QuoteListItem, QuoteListData, PaginationMeta } from "@/types/admin";
import type { QuoteStatus } from "@/types/quote";

// 더미 견적서 목록 데이터
const mockQuoteItems: QuoteListItem[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    quoteNumber: "Q-2025-001",
    title: "웹사이트 리뉴얼 프로젝트",
    customerName: "ABC 주식회사",
    status: "approved",
    total: 15000000,
    createdAt: "2025-01-15T09:00:00Z",
    updatedAt: "2025-01-16T14:30:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    quoteNumber: "Q-2025-002",
    title: "모바일 앱 개발",
    customerName: "테크스타트 Inc.",
    status: "pending",
    total: 35000000,
    createdAt: "2025-01-14T10:30:00Z",
    updatedAt: "2025-01-14T10:30:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    quoteNumber: "Q-2025-003",
    title: "ERP 시스템 구축",
    customerName: "글로벌 물류",
    status: "rejected",
    total: 85000000,
    createdAt: "2025-01-13T08:15:00Z",
    updatedAt: "2025-01-17T09:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    quoteNumber: "Q-2025-004",
    title: "데이터 분석 대시보드",
    customerName: "데이터코프",
    status: "approved",
    total: 12000000,
    createdAt: "2025-01-12T11:00:00Z",
    updatedAt: "2025-01-15T16:45:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    quoteNumber: "Q-2025-005",
    title: "클라우드 마이그레이션",
    customerName: "스마트솔루션",
    status: "pending",
    total: 28000000,
    createdAt: "2025-01-11T14:20:00Z",
    updatedAt: "2025-01-11T14:20:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    quoteNumber: "Q-2025-006",
    title: "보안 시스템 강화",
    customerName: "금융보안",
    status: "approved",
    total: 45000000,
    createdAt: "2025-01-10T09:45:00Z",
    updatedAt: "2025-01-18T11:20:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    quoteNumber: "Q-2025-007",
    title: "AI 챗봇 개발",
    customerName: "커스터머케어",
    status: "pending",
    total: 22000000,
    createdAt: "2025-01-09T13:30:00Z",
    updatedAt: "2025-01-09T13:30:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    quoteNumber: "Q-2025-008",
    title: "전자상거래 플랫폼",
    customerName: "온라인마켓",
    status: "rejected",
    total: 55000000,
    createdAt: "2025-01-08T10:00:00Z",
    updatedAt: "2025-01-12T15:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    quoteNumber: "Q-2025-009",
    title: "HR 관리 시스템",
    customerName: "피플매니지먼트",
    status: "approved",
    total: 18000000,
    createdAt: "2025-01-07T16:00:00Z",
    updatedAt: "2025-01-10T09:30:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    quoteNumber: "Q-2025-010",
    title: "IoT 모니터링 솔루션",
    customerName: "스마트팩토리",
    status: "pending",
    total: 32000000,
    createdAt: "2025-01-06T11:15:00Z",
    updatedAt: "2025-01-06T11:15:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440011",
    quoteNumber: "Q-2025-011",
    title: "CRM 시스템 개발",
    customerName: "세일즈포스코리아",
    status: "approved",
    total: 25000000,
    createdAt: "2025-01-05T09:00:00Z",
    updatedAt: "2025-01-08T14:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440012",
    quoteNumber: "Q-2025-012",
    title: "블록체인 인증 시스템",
    customerName: "디지털트러스트",
    status: "pending",
    total: 48000000,
    createdAt: "2025-01-04T14:30:00Z",
    updatedAt: "2025-01-04T14:30:00Z",
  },
];

/**
 * 더미 견적서 목록 데이터를 반환합니다.
 * 필터링 및 페이지네이션을 지원합니다.
 */
export function getMockQuoteList(params?: {
  page?: number;
  pageSize?: number;
  status?: QuoteStatus;
  search?: string;
}): QuoteListData {
  const { page = 1, pageSize = 10, status, search } = params || {};

  // 필터링
  let filteredItems = [...mockQuoteItems];

  if (status) {
    filteredItems = filteredItems.filter((item) => item.status === status);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        item.customerName.toLowerCase().includes(searchLower) ||
        item.quoteNumber.toLowerCase().includes(searchLower) ||
        item.title.toLowerCase().includes(searchLower)
    );
  }

  // 페이지네이션
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const pagination: PaginationMeta = {
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
  };

  return {
    items: paginatedItems,
    pagination,
  };
}

/**
 * 전체 더미 데이터를 반환합니다.
 */
export function getAllMockQuotes(): QuoteListItem[] {
  return mockQuoteItems;
}
