// 네비게이션 아이템 타입
export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

// 사이트 설정 타입
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  author: string;
  keywords: string[];
}

// 소셜 링크 타입
export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}
