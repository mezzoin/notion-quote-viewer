/**
 * 관리자 로그아웃 API
 * POST /api/admin/auth/logout
 */

import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth/admin";

export async function POST() {
  try {
    // 세션 쿠키 삭제
    await clearAdminSession();

    return NextResponse.json({
      success: true,
      data: {
        message: "로그아웃되었습니다.",
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "서버 오류가 발생했습니다.",
        },
      },
      { status: 500 }
    );
  }
}
