import { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Printer, FileText } from "lucide-react";

// 페이지 Props 타입
interface QuotePageProps {
  params: Promise<{ id: string }>;
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: QuotePageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `견적서 - ${id}`,
    description: "견적서 상세 정보를 확인하세요.",
  };
}

// 견적서 상세 페이지 (서버 컴포넌트)
export default async function QuoteDetailPage({ params }: QuotePageProps) {
  const { id } = await params;

  return (
    <section className="py-8 md:py-12">
      <Container>
        {/* 견적서 카드 */}
        <Card className="mx-auto max-w-4xl">
          {/* 헤더 영역 */}
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold md:text-2xl">견적서</h1>
                  <p className="text-sm text-muted-foreground">
                    견적번호: Q-2024-001
                  </p>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  인쇄
                </Button>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  PDF 다운로드
                </Button>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-8 pt-6">
            {/* 발신/수신자 정보 영역 */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* 발신자 정보 */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  공급자
                </h2>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="font-medium">주식회사 예시컴퍼니</p>
                  <p className="text-sm text-muted-foreground">
                    사업자번호: 123-45-67890
                  </p>
                  <p className="text-sm text-muted-foreground">
                    서울특별시 강남구 테헤란로 123
                  </p>
                  <p className="text-sm text-muted-foreground">
                    대표: 홍길동 | Tel: 02-1234-5678
                  </p>
                </div>
              </div>

              {/* 수신자 정보 */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  수신자
                </h2>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="font-medium">고객사 주식회사</p>
                  <p className="text-sm text-muted-foreground">
                    담당자: 김철수
                  </p>
                  <p className="text-sm text-muted-foreground">
                    서울특별시 서초구 서초대로 456
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tel: 02-9876-5432
                  </p>
                </div>
              </div>
            </div>

            {/* 품목 테이블 영역 */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                품목 내역
              </h2>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">품목명</th>
                      <th className="px-4 py-3 text-right font-medium">수량</th>
                      <th className="px-4 py-3 text-right font-medium">단가</th>
                      <th className="px-4 py-3 text-right font-medium">금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3">웹사이트 개발</td>
                      <td className="px-4 py-3 text-right">1</td>
                      <td className="px-4 py-3 text-right">5,000,000원</td>
                      <td className="px-4 py-3 text-right">5,000,000원</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">유지보수 (1년)</td>
                      <td className="px-4 py-3 text-right">12</td>
                      <td className="px-4 py-3 text-right">200,000원</td>
                      <td className="px-4 py-3 text-right">2,400,000원</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">서버 호스팅</td>
                      <td className="px-4 py-3 text-right">12</td>
                      <td className="px-4 py-3 text-right">50,000원</td>
                      <td className="px-4 py-3 text-right">600,000원</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 금액 요약 영역 */}
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">소계</span>
                  <span>8,000,000원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">부가세 (10%)</span>
                  <span>800,000원</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>총액</span>
                  <span className="text-lg text-primary">8,800,000원</span>
                </div>
              </div>
            </div>

            {/* 비고 영역 */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                비고
              </h2>
              <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                <p>• 본 견적서의 유효기간은 발행일로부터 30일입니다.</p>
                <p>• 상기 금액은 부가세 포함 금액입니다.</p>
                <p>• 프로젝트 착수 후 일정 변경 시 별도 협의가 필요합니다.</p>
              </div>
            </div>

            {/* 견적서 ID (디버그용, 추후 제거 가능) */}
            <div className="text-center text-xs text-muted-foreground">
              견적서 ID: {id}
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
