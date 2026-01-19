import { NextRequest, NextResponse } from "next/server";
import { validateQuoteId } from "@/lib/validations";
import { getInvoiceById } from "@/lib/notion/service";
import { isNotionConfigured } from "@/lib/notion/client";
import type { ApiResponse, QuoteData } from "@/types/quote";

// API 라우트 Props 타입
interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * 견적서 데이터 조회 API
 * GET /api/quote/[id]
 *
 * 성공 시: { success: true, data: QuoteData }
 * 실패 시: { success: false, error: { code, message } }
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<QuoteData | null>>> {
  try {
    const { id } = await params;

    // Zod 스키마로 ID 형식 검증
    const validation = validateQuoteId(id);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: validation.error,
          },
        },
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
            message: "노션 API 설정이 완료되지 않았습니다. 환경변수를 확인하세요.",
          },
        },
        { status: 500 }
      );
    }

    // 노션에서 견적서 조회
    const quoteData = await getInvoiceById(id);

    // 견적서가 존재하지 않는 경우
    if (!quoteData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "요청한 견적서를 찾을 수 없습니다.",
          },
        },
        { status: 404 }
      );
    }

    // 성공 응답 (캐시 헤더 포함)
    return NextResponse.json(
      {
        success: true,
        data: quoteData,
      },
      {
        status: 200,
        headers: {
          // 60초 동안 캐시, 이후 5분간 stale 데이터 제공하며 백그라운드 갱신
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    // 에러 로깅 (프로덕션에서는 에러 모니터링 서비스로 전송)
    console.error("견적서 조회 API 에러:", error);

    // 노션 API 에러 세부 처리
    if (isNotionApiError(error)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOTION_ERROR",
            message: `노션 API 오류: ${error.message}`,
          },
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * 노션 API 에러인지 확인합니다.
 */
function isNotionApiError(error: unknown): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    typeof (error as { code: unknown }).code === "string" &&
    typeof (error as { message: unknown }).message === "string"
  );
}
