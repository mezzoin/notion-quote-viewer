import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FadeIn, StaggerChildren } from "@/components/motion";
import {
  QuoteHeader,
  QuoteInfo,
  QuoteItemsTable,
  QuoteSummary,
  QuoteNotes,
  QuoteActions,
  QuoteExpired,
} from "@/components/quote";
import { getInvoiceById } from "@/lib/notion/service";
import { isNotionConfigured } from "@/lib/notion/client";

// ISR(Incremental Static Regeneration) 설정
// 60초마다 페이지를 백그라운드에서 재생성
export const revalidate = 60;

// 페이지 Props 타입
interface QuotePageProps {
  params: Promise<{ id: string }>;
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: QuotePageProps): Promise<Metadata> {
  const { id } = await params;

  // 노션 설정 확인
  if (!isNotionConfigured()) {
    return {
      title: "견적서 - 설정 오류",
      description: "노션 API 설정을 확인하세요.",
    };
  }

  const quote = await getInvoiceById(id);

  if (!quote) {
    return {
      title: "견적서를 찾을 수 없습니다",
      description: "요청하신 견적서가 존재하지 않습니다.",
    };
  }

  return {
    title: `${quote.title} - ${quote.quoteNumber}`,
    description: `${quote.receiver.companyName}님께 보내는 견적서입니다.`,
  };
}

/**
 * 견적서 유효기간 만료 여부 확인
 */
function isQuoteExpired(validUntil?: string): boolean {
  if (!validUntil) return false;
  return new Date(validUntil) < new Date();
}

/**
 * 만료 후 경과 일수 계산
 */
function getExpiredDays(validUntil?: string): number | undefined {
  if (!validUntil) return undefined;
  const expiredDate = new Date(validUntil);
  const now = new Date();
  if (expiredDate >= now) return undefined;
  const diffTime = now.getTime() - expiredDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// 견적서 상세 페이지 (서버 컴포넌트)
export default async function QuoteDetailPage({ params }: QuotePageProps) {
  const { id } = await params;

  // 노션 설정 확인
  if (!isNotionConfigured()) {
    throw new Error("노션 API 설정이 완료되지 않았습니다.");
  }

  // 노션에서 견적서 데이터 조회
  const quote = await getInvoiceById(id);

  // 견적서가 없으면 404
  if (!quote) {
    notFound();
  }

  const expired = isQuoteExpired(quote.validUntil);
  const expiredDays = getExpiredDays(quote.validUntil);

  return (
    <section className="py-8 md:py-12">
      <Container>
        <FadeIn>
          {/* 만료 경고 (만료된 경우에만 표시) */}
          {expired && quote.validUntil && (
            <div className="mx-auto mb-6 max-w-4xl">
              <QuoteExpired
                validUntil={quote.validUntil}
                expiredDays={expiredDays}
              />
            </div>
          )}

          {/* 견적서 카드 */}
          <Card className="mx-auto max-w-4xl">
            {/* 헤더 영역 */}
            <CardHeader className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <QuoteHeader
                  quoteNumber={quote.quoteNumber}
                  title={quote.title}
                  status={quote.status}
                />
                <QuoteActions quoteId={quote.id} />
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
              <StaggerChildren className="space-y-8">
                {/* 발신/수신자 정보 */}
                <QuoteInfo sender={quote.sender} receiver={quote.receiver} />

                {/* 품목 테이블 */}
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-muted-foreground">
                    품목 내역
                  </h2>
                  <QuoteItemsTable items={quote.items} />
                </div>

                {/* 금액 요약 */}
                <QuoteSummary
                  subtotal={quote.subtotal}
                  taxRate={quote.taxRate}
                  tax={quote.tax}
                  total={quote.total}
                />

                {/* 비고 사항 */}
                <QuoteNotes notes={quote.notes} />

                {/* 견적서 ID (디버그용) */}
                <div className="text-center text-xs text-muted-foreground">
                  견적서 ID: {quote.id}
                </div>
              </StaggerChildren>
            </CardContent>
          </Card>
        </FadeIn>
      </Container>
    </section>
  );
}
