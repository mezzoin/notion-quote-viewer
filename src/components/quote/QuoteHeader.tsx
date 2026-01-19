/**
 * 견적서 헤더 컴포넌트
 * 견적서 상단 영역에 아이콘, 제목, 견적번호, 상태 배지를 표시합니다.
 */

import { FileText } from "lucide-react";
import { QuoteStatus } from "@/types/quote";
import { QuoteStatusBadge } from "./QuoteStatusBadge";

/**
 * QuoteHeader Props
 */
interface QuoteHeaderProps {
  /** 견적 번호 (예: Q-2024-001) */
  quoteNumber: string;
  /** 견적서 제목 */
  title: string;
  /** 견적서 상태 */
  status: QuoteStatus;
}

/**
 * QuoteHeader 컴포넌트
 *
 * 견적서 페이지 상단에 표시되는 헤더 영역입니다.
 * 견적서 아이콘, 제목, 견적번호, 상태 배지를 포함합니다.
 *
 * @example
 * ```tsx
 * <QuoteHeader
 *   quoteNumber="Q-2024-001"
 *   title="웹사이트 개발 견적서"
 *   status="pending"
 * />
 * ```
 */
export function QuoteHeader({ quoteNumber, title, status }: QuoteHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* 왼쪽: 아이콘 + 제목 + 견적번호 */}
      <div className="flex items-start gap-3">
        {/* 견적서 아이콘 */}
        <div className="rounded-lg bg-primary/10 p-2.5">
          <FileText className="h-6 w-6 text-primary" />
        </div>

        {/* 제목 및 견적번호 */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{quoteNumber}</p>
        </div>
      </div>

      {/* 오른쪽: 상태 배지 */}
      <QuoteStatusBadge status={status} className="self-start sm:self-center" />
    </div>
  );
}
