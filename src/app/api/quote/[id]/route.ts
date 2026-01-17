import { NextRequest, NextResponse } from "next/server";
import { isValidUUID } from "@/lib/utils";
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

    // ID 형식 검증
    if (!isValidUUID(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: "유효하지 않은 견적서 ID 형식입니다.",
          },
        },
        { status: 400 }
      );
    }

    // TODO: Phase 3에서 실제 노션 API 연동 구현
    // 현재는 더미 응답 반환
    return NextResponse.json(
      {
        success: true,
        data: null, // Phase 3에서 실제 데이터로 교체
      },
      { status: 200 }
    );
  } catch (error) {
    // 에러 로깅 (프로덕션에서는 에러 모니터링 서비스로 전송)
    console.error("견적서 조회 API 에러:", error);

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
