import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { isValidUUID } from "@/lib/utils";
import { getInvoiceById } from "@/lib/notion/service";
import { isNotionConfigured } from "@/lib/notion/client";
import { QuotePdfTemplate } from "@/components/pdf";
import type { ApiResponse } from "@/types/quote";

// API 라우트 Props 타입
interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * 견적서 PDF 생성 API
 * GET /api/quote/[id]/pdf
 *
 * 성공 시: PDF 파일 바이너리 (application/pdf)
 * 실패 시: { success: false, error: { code, message } }
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;

    // ID 형식 검증
    if (!isValidUUID(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: "유효하지 않은 견적서 ID 형식입니다.",
          },
        } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    // 노션 설정 확인
    if (!isNotionConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CONFIG_ERROR",
            message: "노션 API 설정이 완료되지 않았습니다.",
          },
        } satisfies ApiResponse<never>,
        { status: 500 }
      );
    }

    // 견적서 데이터 조회
    const quote = await getInvoiceById(id);

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "요청한 견적서를 찾을 수 없습니다.",
          },
        } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    // PDF 생성
    const pdfBuffer = await renderToBuffer(
      QuotePdfTemplate({ quote })
    );

    // 파일명 생성 (한글 인코딩)
    const filename = `견적서_${quote.quoteNumber}.pdf`;
    const encodedFilename = encodeURIComponent(filename);

    // PDF 응답 반환
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    // 에러 로깅
    console.error("PDF 생성 API 에러:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        },
      } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
