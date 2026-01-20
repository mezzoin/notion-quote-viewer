"use client";

/**
 * 견적서 목록 페이지네이션 컴포넌트
 */

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { PaginationMeta } from "@/types/admin";
import { adminConfig } from "@/lib/constants";

interface QuoteListPaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function QuoteListPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
}: QuoteListPaginationProps) {
  const { currentPage, totalPages, totalItems, pageSize, hasPrevious, hasNext } = pagination;

  // 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* 표시 정보 */}
      <div className="text-sm text-muted-foreground">
        전체 <span className="font-medium text-foreground">{totalItems}</span>건 중{" "}
        <span className="font-medium text-foreground">
          {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)}
        </span>
        건 표시
      </div>

      <div className="flex items-center gap-4">
        {/* 페이지 크기 선택 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">페이지당</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(parseInt(value, 10))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {adminConfig.pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}개
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 페이지 네비게이션 */}
        <div className="flex items-center gap-1">
          {/* 첫 페이지 */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!hasPrevious}
            onClick={() => onPageChange(1)}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">첫 페이지</span>
          </Button>

          {/* 이전 페이지 */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!hasPrevious}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">이전 페이지</span>
          </Button>

          {/* 페이지 번호 */}
          <div className="hidden sm:flex items-center gap-1">
            {pageNumbers[0] > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPageChange(1)}
                >
                  1
                </Button>
                {pageNumbers[0] > 2 && (
                  <span className="px-2 text-muted-foreground">...</span>
                )}
              </>
            )}

            {pageNumbers.map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            ))}

            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <span className="px-2 text-muted-foreground">...</span>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPageChange(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          {/* 모바일 페이지 표시 */}
          <span className="sm:hidden px-2 text-sm">
            {currentPage} / {totalPages}
          </span>

          {/* 다음 페이지 */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!hasNext}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">다음 페이지</span>
          </Button>

          {/* 마지막 페이지 */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!hasNext}
            onClick={() => onPageChange(totalPages)}
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">마지막 페이지</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
