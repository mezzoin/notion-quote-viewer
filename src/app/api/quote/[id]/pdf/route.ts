import { NextRequest, NextResponse } from "next/server";
import { isValidUUID } from "@/lib/utils";
import type { ApiResponse } from "@/types/quote";

// API 라우트 Props 타입
interface RouteParams {
  params: Promise<{ id: string }>;
}

// PDF 응답 데이터 타입
interface PdfResponseData {
  url?: string;
  filename?: string;
}

/**
 * 견적서 PDF 생성 API
 * GET /api/quote/[id]/pdf
 *
 * 성공 시: PDF 파일 바이너리 또는 { success: true, data: { url, filename } }
 * 실패 시: { success: false, error: { code, message } }
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<PdfResponseData>>> {
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

    // TODO: Phase 3에서 실제 PDF 생성 로직 구현
    // 현재는 501 Not Implemented 반환
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NOT_IMPLEMENTED",
          message: "PDF 생성 기능은 현재 준비 중입니다.",
        },
      },
      { status: 501 }
    );
  } catch (error) {
    // 에러 로깅 (프로덕션에서는 에러 모니터링 서비스로 전송)
    console.error("PDF 생성 API 에러:", error);

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
