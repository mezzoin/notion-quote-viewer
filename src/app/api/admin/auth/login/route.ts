/**
 * 관리자 로그인 API
 * POST /api/admin/auth/login
 */

import { NextRequest, NextResponse } from "next/server";
import { validatePassword, setAdminSession } from "@/lib/auth/admin";

interface LoginRequest {
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LoginRequest;
    const { password } = body;

    // 비밀번호 검증
    if (!password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "비밀번호를 입력해 주세요.",
          },
        },
        { status: 400 }
      );
    }

    // 비밀번호 확인
    if (!validatePassword(password)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_PASSWORD",
            message: "비밀번호가 올바르지 않습니다.",
          },
        },
        { status: 401 }
      );
    }

    // 세션 쿠키 설정
    await setAdminSession();

    return NextResponse.json({
      success: true,
      data: {
        message: "로그인에 성공했습니다.",
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
