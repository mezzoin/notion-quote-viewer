/**
 * 견적서 금액 요약 컴포넌트
 * 소계, 부가세, 총액을 표시합니다.
 */

import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

/**
 * QuoteSummary Props
 */
interface QuoteSummaryProps {
  /** 소계 (부가세 제외 금액) */
  subtotal: number;
  /** 세율 (0.1 = 10%) */
  taxRate: number;
  /** 부가세 금액 */
  tax: number;
  /** 총액 (소계 + 부가세) */
  total: number;
}

/**
 * 요약 항목 렌더링 컴포넌트
 */
function SummaryRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={highlight ? "font-semibold" : "text-muted-foreground"}>
        {label}
      </span>
      <span
        className={
          highlight ? "text-lg font-bold text-primary" : "font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}

/**
 * QuoteSummary 컴포넌트
 *
 * 견적서의 금액 요약(소계, 부가세, 총액)을 표시합니다.
 * 우측 정렬되며 총액이 강조 표시됩니다.
 *
 * @example
 * ```tsx
 * <QuoteSummary
 *   subtotal={10000000}
 *   taxRate={0.1}
 *   tax={1000000}
 *   total={11000000}
 * />
 * ```
 */
export function QuoteSummary({
  subtotal,
  taxRate,
  tax,
  total,
}: QuoteSummaryProps) {
  // 세율을 퍼센트로 변환
  const taxRatePercent = Math.round(taxRate * 100);

  return (
    <div className="flex justify-end">
      <div className="w-full max-w-xs space-y-2">
        <SummaryRow label="소계" value={formatCurrency(subtotal)} />
        <SummaryRow
          label={`부가세 (${taxRatePercent}%)`}
          value={formatCurrency(tax)}
        />
        <Separator className="my-2" />
        <SummaryRow label="총액" value={formatCurrency(total)} highlight />
      </div>
    </div>
  );
}
