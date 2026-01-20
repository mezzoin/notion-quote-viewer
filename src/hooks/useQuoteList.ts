"use client";

/**
 * 견적서 목록 조회 훅
 * API 호출, 필터링, 페이지네이션, URL 동기화를 관리합니다.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { QuoteListItem, QuoteListData, PaginationMeta } from "@/types/admin";
import type { QuoteStatus } from "@/types/quote";

interface UseQuoteListOptions {
  /** 초기 페이지 크기 */
  initialPageSize?: number;
  /** 검색 디바운스 시간 (ms) */
  debounceMs?: number;
}

interface UseQuoteListReturn {
  /** 견적서 목록 */
  items: QuoteListItem[];
  /** 페이지네이션 메타 정보 */
  pagination: PaginationMeta | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 현재 필터 값들 */
  filters: {
    status?: QuoteStatus;
    search: string;
    page: number;
    pageSize: number;
  };
  /** 상태 필터 변경 */
  setStatus: (status: QuoteStatus | undefined) => void;
  /** 검색어 변경 */
  setSearch: (search: string) => void;
  /** 페이지 변경 */
  setPage: (page: number) => void;
  /** 페이지 크기 변경 */
  setPageSize: (pageSize: number) => void;
  /** 필터 초기화 */
  clearFilters: () => void;
  /** 목록 새로고침 */
  refresh: () => void;
}

export function useQuoteList(options: UseQuoteListOptions = {}): UseQuoteListReturn {
  const { initialPageSize = 10, debounceMs = 300 } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 상태
  const [items, setItems] = useState<QuoteListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL에서 초기값 로드
  const [status, setStatusState] = useState<QuoteStatus | undefined>(() => {
    const s = searchParams.get("status");
    return s && ["pending", "approved", "rejected"].includes(s)
      ? (s as QuoteStatus)
      : undefined;
  });
  const [search, setSearchState] = useState(() => searchParams.get("search") || "");
  const [page, setPageState] = useState(() => {
    const p = searchParams.get("page");
    return p ? parseInt(p, 10) : 1;
  });
  const [pageSize, setPageSizeState] = useState(() => {
    const ps = searchParams.get("pageSize");
    return ps ? parseInt(ps, 10) : initialPageSize;
  });

  // 디바운스용 ref
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // URL 업데이트
  const updateUrl = useCallback(
    (params: { status?: QuoteStatus; search?: string; page?: number; pageSize?: number }) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (params.status !== undefined) {
        if (params.status) {
          newParams.set("status", params.status);
        } else {
          newParams.delete("status");
        }
      }

      if (params.search !== undefined) {
        if (params.search) {
          newParams.set("search", params.search);
        } else {
          newParams.delete("search");
        }
      }

      if (params.page !== undefined) {
        if (params.page > 1) {
          newParams.set("page", params.page.toString());
        } else {
          newParams.delete("page");
        }
      }

      if (params.pageSize !== undefined && params.pageSize !== initialPageSize) {
        newParams.set("pageSize", params.pageSize.toString());
      }

      const newUrl = newParams.toString()
        ? `${pathname}?${newParams.toString()}`
        : pathname;

      router.push(newUrl, { scroll: false });
    },
    [searchParams, pathname, router, initialPageSize]
  );

  // 검색어 디바운스 처리
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      if (search !== searchParams.get("search")) {
        updateUrl({ search, page: 1 });
        setPageState(1);
      }
    }, debounceMs);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [search, debounceMs, updateUrl, searchParams]);

  // API 호출
  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("pageSize", pageSize.toString());
      if (status) params.set("status", status);
      if (debouncedSearch) params.set("search", debouncedSearch);

      const response = await fetch(`/api/admin/quotes?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "목록을 불러오는데 실패했습니다.");
      }

      const listData = data.data as QuoteListData;
      setItems(listData.items);
      setPagination(listData.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      setItems([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, status, debouncedSearch]);

  // 데이터 로드
  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  // 필터 변경 핸들러
  const setStatus = useCallback(
    (newStatus: QuoteStatus | undefined) => {
      setStatusState(newStatus);
      setPageState(1);
      updateUrl({ status: newStatus, page: 1 });
    },
    [updateUrl]
  );

  const setSearch = useCallback((newSearch: string) => {
    setSearchState(newSearch);
  }, []);

  const setPage = useCallback(
    (newPage: number) => {
      setPageState(newPage);
      updateUrl({ page: newPage });
    },
    [updateUrl]
  );

  const setPageSize = useCallback(
    (newPageSize: number) => {
      setPageSizeState(newPageSize);
      setPageState(1);
      updateUrl({ pageSize: newPageSize, page: 1 });
    },
    [updateUrl]
  );

  const clearFilters = useCallback(() => {
    setStatusState(undefined);
    setSearchState("");
    setDebouncedSearch("");
    setPageState(1);
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  const refresh = useCallback(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return {
    items,
    pagination,
    isLoading,
    error,
    filters: {
      status,
      search,
      page,
      pageSize,
    },
    setStatus,
    setSearch,
    setPage,
    setPageSize,
    clearFilters,
    refresh,
  };
}
