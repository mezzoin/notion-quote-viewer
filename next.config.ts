import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

// 번들 분석기 설정 (ANALYZE=true 환경변수로 활성화)
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // 이미지 최적화 설정
  images: {
    // 최신 이미지 포맷 우선 사용 (AVIF > WebP > 기본)
    formats: ["image/avif", "image/webp"],
    // 외부 이미지 도메인 허용 (필요시 추가)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // 실험적 기능 - 패키지 최적화
  experimental: {
    // 특정 패키지의 tree shaking 최적화
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "date-fns",
      "@radix-ui/react-icons",
    ],
  },

  // 프로덕션 빌드 최적화
  compiler: {
    // 프로덕션에서 console.log 제거 (선택적)
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },

  // 헤더 설정 (캐시 및 보안)
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

// Sentry 설정 옵션
const sentryWebpackPluginOptions = {
  // 조직/프로젝트 설정 (Sentry 대시보드에서 확인)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // 소스맵 업로드 (프로덕션 빌드 시만)
  silent: true,

  // 소스맵이 클라이언트에 노출되지 않도록 설정
  hideSourceMaps: true,

  // 자동 instrumentation 비활성화 (수동 설정 사용)
  disableLogger: true,

  // 빌드 시 Sentry 트레이스 비활성화
  automaticVercelMonitors: true,
};

// 플러그인 체이닝: bundleAnalyzer -> Sentry
export default withSentryConfig(
  withBundleAnalyzer(nextConfig),
  sentryWebpackPluginOptions
);
