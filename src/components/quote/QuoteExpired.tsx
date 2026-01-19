/**
 * 견적서 만료 안내 컴포넌트
 * 만료된 견적서에 대한 경고 메시지를 표시합니다.
 */

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * QuoteExpired Props
 */
interface QuoteExpiredProps {
  /** 견적 유효기간 (ISO 8601 형식) */
  validUntil: string;
  /** 만료 후 경과 일수 (선택) */
  expiredDays?: number;
}

/**
 * 날짜를 한국어 형식으로 포맷팅
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * QuoteExpired 컴포넌트
 *
 * 만료된 견적서에 대한 경고 메시지를 표시합니다.
 * 만료 여부 판단은 상위 컴포넌트에서 처리하고,
 * 이 컴포넌트는 UI 표시만 담당합니다.
 *
 * @example
 * ```tsx
 * // 만료된 경우에만 렌더링
 * {isExpired && (
 *   <QuoteExpired validUntil="2024-01-15" expiredDays={30} />
 * )}
 * ```
 */
export function QuoteExpired({ validUntil, expiredDays }: QuoteExpiredProps) {
  const formattedDate = formatDate(validUntil);

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>견적서 유효기간 만료</AlertTitle>
      <AlertDescription className="mt-2 space-y-1">
        <p>
          이 견적서는 <strong>{formattedDate}</strong>에 만료되었습니다.
          {expiredDays !== undefined && expiredDays > 0 && (
            <span className="ml-1">({expiredDays}일 경과)</span>
          )}
        </p>
        <p className="text-sm">
          최신 견적을 받으시려면 담당자에게 문의해 주세요.
        </p>
      </AlertDescription>
    </Alert>
  );
}
