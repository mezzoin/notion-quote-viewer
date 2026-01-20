"use client";

/**
 * 견적서 목록 페이지
 * 관리자가 견적서를 조회하고 관리하는 페이지
 */

import { Suspense, useCallback } from "react";
import { QuoteListTable, QuoteListFilters } from "@/components/admin/quotes";
import { useQuoteList } from "@/hooks/useQuoteList";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { QuoteListPagination } from "@/components/admin/quotes/QuoteListPagination";

function QuotesContent() {
  const {
    items,
    pagination,
    isLoading,
    error,
    filters,
    setStatus,
    setSearch,
    setPage,
    setPageSize,
    clearFilters,
  } = useQuoteList({
    initialPageSize: 10,
    debounceMs: 300,
  });

  // 링크 복사 핸들러
  const handleCopyLink = useCallback((id: string) => {
    const url = `${window.location.origin}/quote/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("링크가 복사되었습니다", {
        description: "클라이언트에게 공유하세요.",
      });
    }).catch(() => {
      toast.error("링크 복사에 실패했습니다");
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">견적서 관리</h1>
        <p className="text-muted-foreground mt-2">
          견적서 목록을 조회하고 클라이언트에게 공유할 링크를 복사할 수 있습니다.
        </p>
      </div>

      {/* 필터 */}
      <QuoteListFilters
        status={filters.status}
        search={filters.search}
        onStatusChange={setStatus}
        onSearchChange={setSearch}
        onClear={clearFilters}
      />

      {/* 에러 표시 */}
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* 테이블 */}
          <QuoteListTable items={items} onCopyLink={handleCopyLink} />

          {/* 페이지네이션 */}
          {pagination && pagination.totalPages > 1 && (
            <QuoteListPagination
              pagination={pagination}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function AdminQuotesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <QuotesContent />
    </Suspense>
  );
}
