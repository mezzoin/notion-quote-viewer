/**
 * 관리자 기능 관련 타입 정의
 * 견적서 목록, 필터링, 페이지네이션 관련 인터페이스
 */

import type { QuoteStatus } from "./quote";

/**
 * 견적서 목록 아이템 인터페이스
 * 목록 테이블에 표시할 간략한 견적서 정보
 */
export interface QuoteListItem {
  /** 견적서 고유 ID (UUID) */
  id: string;
  /** 견적 번호 (예: Q-2024-001) */
  quoteNumber: string;
  /** 견적서 제목 */
  title: string;
  /** 고객명/회사명 */
  customerName: string;
  /** 견적서 상태 */
  status: QuoteStatus;
  /** 총액 */
  total: number;
  /** 생성일시 (ISO 8601) */
  createdAt: string;
  /** 수정일시 (ISO 8601) */
  updatedAt: string;
}

/**
 * 견적서 목록 필터 인터페이스
 */
export interface QuoteListFilters {
  /** 상태 필터 (전체일 경우 undefined) */
  status?: QuoteStatus;
  /** 검색어 (고객명, 견적번호) */
  search?: string;
  /** 시작 날짜 (ISO 8601) */
  dateFrom?: string;
  /** 종료 날짜 (ISO 8601) */
  dateTo?: string;
}

/**
 * 페이지네이션 파라미터 인터페이스
 */
export interface PaginationParams {
  /** 현재 페이지 번호 (1부터 시작) */
  page: number;
  /** 페이지당 항목 수 */
  pageSize: number;
}

/**
 * 페이지네이션 메타 정보 인터페이스
 */
export interface PaginationMeta {
  /** 현재 페이지 번호 */
  currentPage: number;
  /** 페이지당 항목 수 */
  pageSize: number;
  /** 전체 항목 수 */
  totalItems: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 이전 페이지 존재 여부 */
  hasPrevious: boolean;
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
}

/**
 * 견적서 목록 API 요청 파라미터
 */
export interface QuoteListParams extends PaginationParams, QuoteListFilters {}

/**
 * 견적서 목록 API 응답 데이터 인터페이스
 */
export interface QuoteListData {
  /** 견적서 목록 */
  items: QuoteListItem[];
  /** 페이지네이션 메타 정보 */
  pagination: PaginationMeta;
}

/**
 * 관리자 네비게이션 아이템 인터페이스
 */
export interface AdminNavItem {
  /** 메뉴 라벨 */
  label: string;
  /** 링크 경로 */
  href: string;
  /** 아이콘 이름 (Lucide icons) */
  icon: string;
  /** 메뉴 설명 */
  description?: string;
}

/**
 * 정렬 방향 타입
 */
export type SortDirection = "asc" | "desc";

/**
 * 정렬 옵션 인터페이스
 */
export interface SortOption {
  /** 정렬 필드 */
  field: keyof QuoteListItem;
  /** 정렬 방향 */
  direction: SortDirection;
}
