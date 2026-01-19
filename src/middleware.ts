/**
 * Next.js 미들웨어
 * API 엔드포인트에 Rate Limiting을 적용합니다.
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimitConfig } from "@/lib/constants";

// IP별 요청 추적을 위한 메모리 저장소
// 프로덕션 환경에서는 Redis 등 분산 캐시 사용 권장
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * 클라이언트 IP 주소를 추출합니다.
 * Vercel, Cloudflare 등 리버스 프록시 환경을 고려합니다.
 */
function getClientIp(request: NextRequest): string {
  // Vercel/Cloudflare 프록시 헤더 우선
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  // Cloudflare 헤더
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Vercel 실제 IP
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // 기본값 (개발 환경)
  return "127.0.0.1";
}

/**
 * 만료된 Rate Limit 엔트리를 정리합니다.
 * 메모리 누수 방지를 위해 주기적으로 호출됩니다.
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(ip);
    }
  }
}

/**
 * Rate Limiting 검사를 수행합니다.
 *
 * @param ip - 클라이언트 IP 주소
 * @returns Rate Limit 초과 여부와 남은 요청 수
 */
function checkRateLimit(ip: string): {
  isLimited: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const { windowMs, maxRequests } = rateLimitConfig;

  // 기존 엔트리 확인
  const entry = rateLimitStore.get(ip);

  // 새로운 윈도우 시작 또는 윈도우 리셋
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      isLimited: false,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }

  // 요청 카운트 증가
  entry.count++;
  rateLimitStore.set(ip, entry);

  // 제한 초과 확인
  const isLimited = entry.count > maxRequests;
  const remaining = Math.max(0, maxRequests - entry.count);

  return {
    isLimited,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Next.js 미들웨어 함수
 * /api/* 경로의 요청에 Rate Limiting을 적용합니다.
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Rate Limiting 적용 대상 경로 확인
  if (!rateLimitConfig.pathPattern.test(pathname)) {
    return NextResponse.next();
  }

  // 주기적으로 만료된 엔트리 정리 (100회 요청마다)
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  const clientIp = getClientIp(request);
  const { isLimited, remaining, resetTime } = checkRateLimit(clientIp);

  // Rate Limit 초과 시 429 응답
  if (isLimited) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RATE_LIMITED",
          message: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
        },
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": rateLimitConfig.maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": Math.ceil(resetTime / 1000).toString(),
          "Retry-After": Math.ceil((resetTime - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // 정상 요청 - Rate Limit 헤더 추가
  const response = NextResponse.next();
  response.headers.set(
    "X-RateLimit-Limit",
    rateLimitConfig.maxRequests.toString()
  );
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set("X-RateLimit-Reset", Math.ceil(resetTime / 1000).toString());

  return response;
}

// 미들웨어 적용 경로 설정
export const config = {
  matcher: ["/api/:path*"],
};
