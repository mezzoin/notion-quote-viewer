"use client";

/**
 * 견적서 링크 복사 버튼 컴포넌트
 */

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";

interface CopyLinkButtonProps {
  /** 견적서 ID */
  quoteId: string;
  /** 버튼 크기 */
  size?: "default" | "sm" | "lg" | "icon";
  /** 버튼 variant */
  variant?: "default" | "secondary" | "ghost" | "outline";
  /** 추가 클래스 */
  className?: string;
  /** 복사 성공 콜백 */
  onCopySuccess?: () => void;
  /** 복사 실패 콜백 */
  onCopyError?: (error: string) => void;
}

export function CopyLinkButton({
  quoteId,
  size = "icon",
  variant = "ghost",
  className,
  onCopySuccess,
  onCopyError,
}: CopyLinkButtonProps) {
  const { copy, isCopying, isSuccess, error, reset } = useCopyToClipboard();
  const [showCheck, setShowCheck] = useState(false);

  // 복사 성공 시 체크 아이콘 표시
  useEffect(() => {
    if (isSuccess) {
      setShowCheck(true);
      toast.success("링크가 복사되었습니다", {
        description: "클라이언트에게 공유하세요.",
      });
      onCopySuccess?.();

      const timer = setTimeout(() => {
        setShowCheck(false);
        reset();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, onCopySuccess, reset]);

  // 복사 실패 시 에러 토스트
  useEffect(() => {
    if (error) {
      toast.error("링크 복사에 실패했습니다", {
        description: error,
      });
      onCopyError?.(error);
    }
  }, [error, onCopyError]);

  const handleCopy = useCallback(async () => {
    const url = `${window.location.origin}/quote/${quoteId}`;
    await copy(url);
  }, [quoteId, copy]);

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(size === "icon" && "h-8 w-8", className)}
      onClick={handleCopy}
      disabled={isCopying}
      title="링크 복사"
    >
      {isCopying ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : showCheck ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {size !== "icon" && (
        <span className="ml-2">
          {isCopying ? "복사 중..." : showCheck ? "복사됨" : "링크 복사"}
        </span>
      )}
    </Button>
  );
}
