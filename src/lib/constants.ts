import type { NavItem, SiteConfig, AdminNavItem } from "@/types";

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

// 관리자 네비게이션 메뉴
export const adminNavItems: AdminNavItem[] = [
  {
    label: "견적서 관리",
    href: "/admin/quotes",
    icon: "FileText",
    description: "견적서 목록 조회 및 관리",
  },
];

// 관리자 페이지 설정
export const adminConfig = {
  /** 페이지당 기본 항목 수 */
  defaultPageSize: 10,
  /** 페이지 크기 옵션 */
  pageSizeOptions: [10, 20, 50, 100],
} as const;
