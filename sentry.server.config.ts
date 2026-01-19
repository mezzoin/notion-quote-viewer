/**
 * Sentry 서버 설정
 * Node.js 서버에서 발생하는 에러를 추적합니다.
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // Sentry DSN (환경변수에서 로드)
  dsn: process.env.SENTRY_DSN,

  // 환경 설정
  environment: process.env.NODE_ENV,

  // 트레이스 샘플 레이트
  tracesSampleRate: process.env.NODE_ENV === "production" ? 1.0 : 0,

  // 디버그 모드
  debug: process.env.NODE_ENV === "development",

  // 필터링 설정
  beforeSend(event) {
    // 개발 환경에서는 에러를 Sentry로 전송하지 않음
    if (process.env.NODE_ENV === "development") {
      console.log("[Sentry Server] 개발 환경 - 에러 전송 스킵:", event.message);
      return null;
    }
    return event;
  },
});
