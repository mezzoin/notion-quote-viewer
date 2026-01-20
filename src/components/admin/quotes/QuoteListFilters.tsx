"use client";

/**
 * 견적서 목록 필터 컴포넌트
 */

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import type { QuoteStatus } from "@/types/quote";

interface QuoteListFiltersProps {
  status?: QuoteStatus;
  search?: string;
  onStatusChange: (status: QuoteStatus | undefined) => void;
  onSearchChange: (search: string) => void;
  onClear: () => void;
}

const statusOptions: { value: string; label: string }[] = [
  { value: "all", label: "전체 상태" },
  { value: "pending", label: "대기" },
  { value: "approved", label: "승인" },
  { value: "rejected", label: "거절" },
];

export function QuoteListFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
  onClear,
}: QuoteListFiltersProps) {
  const hasFilters = status || search;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        {/* 검색 */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="고객명, 견적번호로 검색..."
            value={search || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* 상태 필터 */}
        <Select
          value={status || "all"}
          onValueChange={(value) =>
            onStatusChange(value === "all" ? undefined : (value as QuoteStatus))
          }
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 필터 초기화 */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="mr-2 h-4 w-4" />
          필터 초기화
        </Button>
      )}
    </div>
  );
}
