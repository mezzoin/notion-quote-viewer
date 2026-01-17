import { Container } from "@/components/shared/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

// 견적서 로딩 스켈레톤 페이지
export default function QuoteLoading() {
  return (
    <section className="py-8 md:py-12">
      <Container>
        <Card className="mx-auto max-w-4xl">
          {/* 헤더 스켈레톤 */}
          <CardHeader className="space-y-4">
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
          </CardHeader>

          <Separator />

          <CardContent className="space-y-8 pt-6">
            {/* 발신/수신자 정보 스켈레톤 */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* 발신자 스켈레톤 */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-16" />
                <div className="space-y-2 rounded-lg bg-muted/50 p-4">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-44" />
                </div>
              </div>

              {/* 수신자 스켈레톤 */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-16" />
                <div className="space-y-2 rounded-lg bg-muted/50 p-4">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>

            {/* 품목 테이블 스켈레톤 */}
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

            {/* 금액 요약 스켈레톤 */}
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

            {/* 비고 스켈레톤 */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-12" />
              <div className="space-y-2 rounded-lg bg-muted/50 p-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
