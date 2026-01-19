/**
 * 견적서 상태 배지 컴포넌트
 * 견적서 상태(대기/승인/거절)를 시각적으로 표시합니다.
 */

import { Badge } from "@/components/ui/badge";
import { QuoteStatus, STATUS_LABELS } from "@/types/quote";

/**
 * QuoteStatusBadge Props
 */
interface QuoteStatusBadgeProps {
  /** 견적서 상태 */
  status: QuoteStatus;
  /** 추가 CSS 클래스 (선택) */
  className?: string;
}

/**
 * 상태별 Badge variant 매핑
 * - pending(대기): outline - 테두리만 있는 중립적인 스타일
 * - approved(승인): default - 초록색 배경의 긍정적인 스타일
 * - rejected(거절): destructive - 빨간색 배경의 부정적인 스타일
 */
const STATUS_VARIANT_MAP: Record<QuoteStatus, "default" | "destructive" | "outline"> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
} as const;

/**
 * QuoteStatusBadge 컴포넌트
 *
 * 견적서 상태를 색상이 적용된 배지로 표시합니다.
 *
 * @example
 * ```tsx
 * <QuoteStatusBadge status="pending" />   // 대기 (outline)
 * <QuoteStatusBadge status="approved" />  // 승인 (초록)
 * <QuoteStatusBadge status="rejected" />  // 거절 (빨강)
 * ```
 */
export function QuoteStatusBadge({ status, className }: QuoteStatusBadgeProps) {
  const variant = STATUS_VARIANT_MAP[status];
  const label = STATUS_LABELS[status];

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
