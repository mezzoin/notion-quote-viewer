/**
 * 견적 품목 테이블 컴포넌트
 * 견적 품목 목록을 테이블 형식으로 표시합니다.
 * 모바일에서 가로 스크롤을 지원합니다.
 */

import { QuoteItem } from "@/types/quote";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * QuoteItemsTable Props
 */
interface QuoteItemsTableProps {
  /** 견적 품목 목록 */
  items: QuoteItem[];
}

/**
 * QuoteItemsTable 컴포넌트
 *
 * 견적서의 품목 목록을 테이블 형식으로 표시합니다.
 * - 모바일: 가로 스크롤 지원, 설명 컬럼 숨김
 * - 데스크톱: 전체 컬럼 표시
 *
 * @example
 * ```tsx
 * <QuoteItemsTable
 *   items={[
 *     { id: "1", name: "웹사이트 개발", quantity: 1, unitPrice: 5000000, amount: 5000000 },
 *     { id: "2", name: "유지보수", description: "월간", quantity: 12, unitPrice: 500000, amount: 6000000 }
 *   ]}
 * />
 * ```
 */
export function QuoteItemsTable({ items }: QuoteItemsTableProps) {
  // 빈 배열 처리
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        품목이 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>품목명</TableHead>
            {/* 설명 컬럼: 데스크톱에서만 표시 */}
            <TableHead className="hidden md:table-cell">설명</TableHead>
            <TableHead className="w-20 text-right">수량</TableHead>
            <TableHead className="w-32 text-right">단가</TableHead>
            <TableHead className="w-32 text-right">금액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="text-center text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              {/* 설명 컬럼: 데스크톱에서만 표시 */}
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {item.description || "-"}
              </TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.unitPrice)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(item.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
