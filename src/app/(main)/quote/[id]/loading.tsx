import { Container } from "@/components/shared/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QuoteSkeleton } from "@/components/quote";

/**
 * 견적서 로딩 스켈레톤 페이지
 * QuoteSkeleton 컴포넌트를 사용하여 로딩 상태를 표시합니다.
 */
export default function QuoteLoading() {
  return (
    <section className="py-8 md:py-12">
      <Container>
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <QuoteSkeleton.Header />
          </CardHeader>
          <CardContent className="space-y-8">
            <QuoteSkeleton.Info />
            <QuoteSkeleton.Table />
            <QuoteSkeleton.Summary />
            <QuoteSkeleton.Notes />
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
