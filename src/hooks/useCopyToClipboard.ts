"use client";

/**
 * 클립보드 복사 훅
 * navigator.clipboard API를 사용하고 폴백으로 execCommand를 지원합니다.
 */

import { useState, useCallback } from "react";

interface UseCopyToClipboardReturn {
  /** 복사된 텍스트 */
  copiedText: string | null;
  /** 복사 중 상태 */
  isCopying: boolean;
  /** 복사 성공 여부 */
  isSuccess: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 클립보드에 복사 */
  copy: (text: string) => Promise<boolean>;
  /** 상태 초기화 */
  reset: () => void;
}

export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setCopiedText(null);
    setIsSuccess(false);
    setError(null);
  }, []);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    setIsCopying(true);
    setError(null);
    setIsSuccess(false);

    try {
      // navigator.clipboard API 사용 (HTTPS 필요)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        setIsSuccess(true);
        setIsCopying(false);
        return true;
      }

      // 폴백: execCommand 사용 (deprecated but works)
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      textArea.remove();

      if (successful) {
        setCopiedText(text);
        setIsSuccess(true);
        setIsCopying(false);
        return true;
      } else {
        throw new Error("복사에 실패했습니다.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "복사에 실패했습니다.";
      setError(errorMessage);
      setCopiedText(null);
      setIsSuccess(false);
      setIsCopying(false);
      return false;
    }
  }, []);

  return {
    copiedText,
    isCopying,
    isSuccess,
    error,
    copy,
    reset,
  };
}
