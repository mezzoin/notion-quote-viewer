/**
 * 관리자 견적서 목록 API
 * GET /api/admin/quotes
 *
 * Query Parameters:
 * - page: 페이지 번호 (기본값: 1)
 * - pageSize: 페이지당 항목 수 (기본값: 10)
 * - status: 상태 필터 (pending, approved, rejected)
 * - search: 검색어 (고객명, 견적번호)
 */

import { NextRequest, NextResponse } from "next/server";
import { getInvoiceList } from "@/lib/notion/service";
import type { QuoteStatus, ApiResponse } from "@/types/quote";
import type { QuoteListData } from "@/types/admin";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<QuoteListData>>> {
  try {
    const { searchParams } = new URL(request.url);

    // 쿼리 파라미터 파싱
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const status = searchParams.get("status") as QuoteStatus | null;
    const search = searchParams.get("search") || undefined;

    // 유효성 검사
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_PARAMS",
            message: "잘못된 페이지네이션 파라미터입니다.",
          },
        },
        { status: 400 }
      );
    }

    // 유효한 상태값 검사
    if (status && !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_STATUS",
            message: "잘못된 상태값입니다.",
          },
        },
        { status: 400 }
      );
    }

    // 노션에서 견적서 목록 조회
    const data = await getInvoiceList({
      page,
      pageSize,
      status: status || undefined,
      search,
    });

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        headers: {
          // 캐싱 설정 (30초)
          "Cache-Control": "private, max-age=30",
        },
      }
    );
  } catch (error) {
    console.error("견적서 목록 API 에러:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "견적서 목록을 불러오는 중 오류가 발생했습니다.",
        },
      },
      { status: 500 }
    );
  }
}
