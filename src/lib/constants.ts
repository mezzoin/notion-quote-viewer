import type { NavItem, SiteConfig } from "@/types";

// 사이트 설정
export const siteConfig: SiteConfig = {
  name: "노션 웹 견적서",
  description: "노션 API를 활용한 웹 견적서 시스템",
  url: "https://example.com",
  author: "개발자",
  keywords: ["Next.js", "React", "TypeScript", "Notion API", "견적서"],
};

// 네비게이션 메뉴
export const navItems: NavItem[] = [
  { label: "홈", href: "/" },
];

// 푸터 링크
export const footerLinks: NavItem[] = [
  { label: "GitHub", href: "https://github.com" },
];

// Rate Limiting 설정
export const rateLimitConfig = {
  /** Rate Limit 윈도우 시간 (밀리초) - 1분 */
  windowMs: 60 * 1000,
  /** 윈도우 시간 내 최대 요청 수 */
  maxRequests: 60,
  /** Rate Limit 적용 경로 패턴 */
  pathPattern: /^\/api\//,
} as const;
