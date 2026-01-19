"use client";

/**
 * 견적서 액션 버튼 컴포넌트
 * PDF 다운로드와 인쇄 기능을 제공합니다.
 */

import { Download, Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * QuoteActions Props
 */
interface QuoteActionsProps {
  /** 견적서 ID */
  quoteId: string;
  /** PDF 다운로드 중 여부 */
  isDownloading?: boolean;
  /** PDF 다운로드 핸들러 (Phase 3에서 구현 예정) */
  onDownloadPdf?: () => void;
}

/**
 * QuoteActions 컴포넌트
 *
 * 견적서의 PDF 다운로드와 인쇄 기능을 제공하는 액션 버튼입니다.
 *
 * @example
 * ```tsx
 * <QuoteActions
 *   quoteId="uuid-1234"
 *   isDownloading={false}
 *   onDownloadPdf={() => handleDownload()}
 * />
 * ```
 */
export function QuoteActions({
  quoteId,
  isDownloading = false,
  onDownloadPdf,
}: QuoteActionsProps) {
  /**
   * 인쇄 버튼 클릭 핸들러
   */
  const handlePrint = () => {
    toast.info("인쇄 다이얼로그를 열고 있습니다...");
    window.print();
  };

  /**
   * PDF 다운로드 버튼 클릭 핸들러
   * Phase 3에서 실제 PDF 생성 로직 구현 예정
   */
  const handleDownloadPdf = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
    } else {
      // Phase 3 구현 전 임시 처리
      toast.info("PDF 다운로드 기능은 곧 제공될 예정입니다.", {
        description: `견적서 ID: ${quoteId}`,
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* 인쇄 버튼 */}
      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        인쇄
      </Button>

      {/* PDF 다운로드 버튼 */}
      <Button
        variant="default"
        size="sm"
        onClick={handleDownloadPdf}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            다운로드 중...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            PDF 다운로드
          </>
        )}
      </Button>
    </div>
  );
}
