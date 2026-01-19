/**
 * 견적서 스켈레톤 UI 컴포넌트
 * 견적서 로딩 상태를 표시하는 스켈레톤 UI입니다.
 */

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

/**
 * 헤더 영역 스켈레톤
 */
function HeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
}

/**
 * 정보 카드 스켈레톤 (발신자/수신자용)
 */
function InfoCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-16" />
      <div className="space-y-2 rounded-lg bg-muted/50 p-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-44" />
      </div>
    </div>
  );
}

/**
 * 발신/수신자 정보 영역 스켈레톤
 */
function InfoSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <InfoCardSkeleton />
      <InfoCardSkeleton />
    </div>
  );
}

/**
 * 품목 테이블 스켈레톤
 */
function TableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-20" />
      <div className="overflow-hidden rounded-lg border">
        {/* 테이블 헤더 */}
        <div className="flex bg-muted/50 px-4 py-3">
          <Skeleton className="h-4 w-24 flex-1" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="ml-4 h-4 w-16" />
          <Skeleton className="ml-4 h-4 w-20" />
        </div>
        {/* 테이블 행 */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex border-t px-4 py-3">
            <Skeleton className="h-4 w-32 flex-1" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="ml-4 h-4 w-20" />
            <Skeleton className="ml-4 h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 금액 요약 스켈레톤
 */
function SummarySkeleton() {
  return (
    <div className="flex justify-end">
      <div className="w-full max-w-xs space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Separator />
        <div className="flex justify-between">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-6 w-28" />
        </div>
      </div>
    </div>
  );
}

/**
 * 비고 영역 스켈레톤
 */
function NotesSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-12" />
      <div className="space-y-2 rounded-lg bg-muted/50 p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

/**
 * QuoteSkeleton 컴포넌트
 *
 * 견적서 전체 로딩 상태를 표시하는 스켈레톤 UI입니다.
 * Card 내부에서 사용되도록 설계되었습니다.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <QuoteSkeleton.Header />
 *   </CardHeader>
 *   <CardContent>
 *     <QuoteSkeleton.Content />
 *   </CardContent>
 * </Card>
 *
 * // 또는 전체 스켈레톤
 * <QuoteSkeleton />
 * ```
 */
export function QuoteSkeleton() {
  return (
    <div className="space-y-6">
      <HeaderSkeleton />
      <Separator />
      <div className="space-y-8">
        <InfoSkeleton />
        <TableSkeleton />
        <SummarySkeleton />
        <NotesSkeleton />
      </div>
    </div>
  );
}

// 서브 컴포넌트 노출
QuoteSkeleton.Header = HeaderSkeleton;
QuoteSkeleton.Info = InfoSkeleton;
QuoteSkeleton.Table = TableSkeleton;
QuoteSkeleton.Summary = SummarySkeleton;
QuoteSkeleton.Notes = NotesSkeleton;
