/**
 * 관리자 인증 유틸리티
 * httpOnly 쿠키 기반의 세션 관리를 제공합니다.
 */

import { cookies } from "next/headers";
import crypto from "crypto";

/** 관리자 세션 쿠키 이름 */
export const ADMIN_SESSION_COOKIE = "admin-session";

/** 세션 만료 시간 (24시간) */
export const SESSION_MAX_AGE = 60 * 60 * 24;

/**
 * 세션 토큰을 생성합니다.
 * ADMIN_PASSWORD와 타임스탬프를 조합하여 해시를 생성합니다.
 */
export function generateSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD || "";
  const timestamp = Date.now().toString();
  const data = `${password}:${timestamp}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * 세션 쿠키를 설정합니다.
 * httpOnly, secure, sameSite 옵션을 적용합니다.
 */
export async function setAdminSession(): Promise<string> {
  const token = generateSessionToken();
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return token;
}

/**
 * 세션 쿠키를 삭제합니다.
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

/**
 * 현재 세션이 유효한지 확인합니다.
 * 쿠키가 존재하고 값이 있으면 인증된 것으로 간주합니다.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  // 환경변수가 설정되지 않으면 인증 비활성화
  if (!process.env.ADMIN_PASSWORD) {
    return true;
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE);

  return !!sessionCookie?.value;
}

/**
 * 비밀번호가 올바른지 확인합니다.
 */
export function validatePassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;

  // 환경변수가 설정되지 않으면 인증 비활성화
  if (!adminPassword) {
    return true;
  }

  return password === adminPassword;
}
