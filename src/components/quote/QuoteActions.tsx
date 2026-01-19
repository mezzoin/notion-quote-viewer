"use client";

/**
 * 견적서 액션 버튼 컴포넌트
 * PDF 다운로드와 인쇄 기능을 제공합니다.
 */

import { useState } from "react";
import { Download, Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * QuoteActions Props
 */
interface QuoteActionsProps {
  /** 견적서 ID */
  quoteId: string;
}

/**
 * QuoteActions 컴포넌트
 *
 * 견적서의 PDF 다운로드와 인쇄 기능을 제공하는 액션 버튼입니다.
 *
 * @example
 * ```tsx
 * <QuoteActions quoteId="uuid-1234" />
 * ```
 */
export function QuoteActions({ quoteId }: QuoteActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * 인쇄 버튼 클릭 핸들러
   */
  const handlePrint = () => {
    toast.info("인쇄 다이얼로그를 열고 있습니다...");
    window.print();
  };

  /**
   * PDF 다운로드 버튼 클릭 핸들러
   */
  const handleDownloadPdf = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch(`/api/quote/${quoteId}/pdf`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "PDF 다운로드에 실패했습니다.");
      }

      // PDF 바이너리 데이터 가져오기
      const blob = await response.blob();

      // Content-Disposition에서 파일명 추출 시도
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `견적서_${quoteId}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/);
        if (filenameMatch) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }

      // 브라우저 다운로드 트리거
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("PDF 다운로드가 완료되었습니다.", {
        description: filename,
      });
    } catch (error) {
      console.error("PDF 다운로드 에러:", error);
      toast.error("PDF 다운로드 실패", {
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setIsDownloading(false);
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
