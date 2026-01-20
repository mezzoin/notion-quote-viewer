"use client";

/**
 * 견적서 목록 테이블 컴포넌트
 */

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuoteListItem } from "@/types/admin";
import type { QuoteStatus } from "@/types/quote";
import { STATUS_LABELS } from "@/types/quote";
import { ExternalLink, Copy, FileText } from "lucide-react";
import Link from "next/link";

interface QuoteListTableProps {
  items: QuoteListItem[];
  onCopyLink?: (id: string) => void;
}

// 상태별 Badge 스타일
const statusVariants: Record<QuoteStatus, { variant: "default" | "secondary" | "destructive"; className: string }> = {
  pending: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  approved: { variant: "default", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  rejected: { variant: "destructive", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
};

// 금액 포맷팅
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

// 날짜 포맷팅
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function QuoteListTable({ items, onCopyLink }: QuoteListTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">견적서가 없습니다</h3>
        <p className="text-sm text-muted-foreground mt-1">
          조건에 맞는 견적서가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">견적번호</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-[150px]">고객명</TableHead>
            <TableHead className="w-[100px]">상태</TableHead>
            <TableHead className="w-[130px] text-right">금액</TableHead>
            <TableHead className="w-[110px]">생성일</TableHead>
            <TableHead className="w-[100px] text-center">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            const statusStyle = statusVariants[item.status];
            return (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-muted/50 border-b transition-colors"
              >
                <TableCell className="font-mono text-sm">
                  {item.quoteNumber}
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {item.title}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.customerName}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={statusStyle.variant}
                    className={cn("border-0", statusStyle.className)}
                  >
                    {STATUS_LABELS[item.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(item.total)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(item.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onCopyLink?.(item.id)}
                      title="링크 복사"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <Link href={`/quote/${item.id}`} target="_blank" title="견적서 보기">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
