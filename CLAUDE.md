# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Next.js 16 + React 19 기반의 모던 웹 스타터킷. ShadcnUI, TailwindCSS, Framer Motion을 사용한 한국어 웹 애플리케이션.

## 주요 명령어

```bash
npm run dev      # 개발 서버 실행 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사

# ShadcnUI 컴포넌트 추가
npx shadcn@latest add <component-name>
```

## 아키텍처

### 디렉토리 구조
- `src/app/` - Next.js App Router 페이지
- `src/components/` - React 컴포넌트
- `src/lib/` - 유틸리티 및 상수
- `src/types/` - TypeScript 타입 정의
- `src/providers/` - Context Provider

### 라우트 그룹
- `(main)` - Header/Footer가 포함된 메인 레이아웃
- 루트 레이아웃(`src/app/layout.tsx`)은 ThemeProvider와 Toaster를 제공

### 컴포넌트 구조
```
components/
├── ui/          # ShadcnUI 기반 UI 컴포넌트 (Button, Card, Dialog 등)
├── layout/      # 레이아웃 컴포넌트 (Header, Footer, Navigation)
├── motion/      # Framer Motion 애니메이션 래퍼 (FadeIn, SlideIn, ScrollReveal, StaggerChildren)
└── shared/      # 공통 컴포넌트 (Container, Logo)
```

### 경로 별칭
`@/*` → `./src/*` (tsconfig.json에 설정됨)

## 기술 스택

- **UI**: ShadcnUI (new-york 스타일) + Radix UI primitives + Lucide 아이콘
- **스타일링**: TailwindCSS 4
- **애니메이션**: Framer Motion
- **폼**: React Hook Form + Zod 검증
- **테마**: next-themes (다크모드 지원)
- **토스트**: Sonner
- **폰트**: Space Grotesk (영문) + Noto Sans KR (한글)

## 코드 컨벤션

- 모든 주석과 커밋 메시지는 한국어로 작성
- 컴포넌트명은 PascalCase, 변수/함수명은 camelCase
- 들여쓰기 2칸
- any 타입 사용 금지
- 타입 정의는 `src/types/index.ts`에 집중
- 사이트 설정 및 네비게이션 데이터는 `src/lib/constants.ts`에서 관리
