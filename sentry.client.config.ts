/**
 * Sentry 클라이언트 설정
 * 브라우저에서 발생하는 에러를 추적합니다.
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // Sentry DSN (환경변수에서 로드)
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 환경 설정 (development, staging, production)
  environment: process.env.NODE_ENV,

  // 샘플 레이트 설정
  // 프로덕션에서는 100% 에러 캡처, 개발 환경에서는 비활성화
  tracesSampleRate: process.env.NODE_ENV === "production" ? 1.0 : 0,

  // 디버그 모드 (개발 환경에서만 활성화)
  debug: process.env.NODE_ENV === "development",

  // Replay 설정 (세션 리플레이 - 선택적)
  replaysOnErrorSampleRate: 1.0, // 에러 발생 시 100% 리플레이
  replaysSessionSampleRate: 0.1, // 일반 세션 10% 리플레이

  // 통합 설정
  integrations: [
    Sentry.replayIntegration({
      // 마스킹 설정 (개인정보 보호)
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // 필터링 설정
  beforeSend(event) {
    // 개발 환경에서는 에러를 Sentry로 전송하지 않음
    if (process.env.NODE_ENV === "development") {
      console.log("[Sentry] 개발 환경 - 에러 전송 스킵:", event);
      return null;
    }
    return event;
  },

  // 무시할 에러 패턴
  ignoreErrors: [
    // 네트워크 에러
    "Failed to fetch",
    "NetworkError",
    "Load failed",
    // 취소된 요청
    "AbortError",
    // 브라우저 확장 프로그램 에러
    "chrome-extension://",
    "moz-extension://",
  ],
});
