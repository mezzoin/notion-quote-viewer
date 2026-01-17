# Development Guidelines

## 프로젝트 개요

### 기술 스택
- **프레임워크**: Next.js 16 + React 19 (App Router)
- **UI 라이브러리**: ShadcnUI (new-york 스타일) + Radix UI + Lucide 아이콘
- **스타일링**: TailwindCSS 4 + CSS Variables (OKLCH 색상)
- **애니메이션**: Framer Motion
- **폼 처리**: React Hook Form + Zod
- **테마**: next-themes (다크모드 지원)
- **폰트**: Space Grotesk (영문) + Noto Sans KR (한글)

### 핵심 목적
노션 API를 활용한 한국어 웹 견적서 시스템

---

## 디렉토리 구조 규칙

### 파일 배치 기준

| 디렉토리 | 용도 | 규칙 |
|---------|------|------|
| `src/app/` | Next.js 페이지 | App Router 규칙 준수 |
| `src/app/(main)/` | Header/Footer 포함 페이지 | 메인 레이아웃이 필요한 페이지만 배치 |
| `src/components/ui/` | ShadcnUI 컴포넌트 | **직접 수정 금지**, CLI로만 추가 |
| `src/components/layout/` | 레이아웃 컴포넌트 | Header, Footer, Navigation 등 |
| `src/components/motion/` | 애니메이션 래퍼 | Framer Motion 기반 컴포넌트 |
| `src/components/shared/` | 공통 컴포넌트 | 재사용 가능한 UI 컴포넌트 |
| `src/lib/` | 유틸리티 | utils.ts, constants.ts |
| `src/types/` | 타입 정의 | **모든 타입은 index.ts에 집중** |
| `src/providers/` | Context Provider | ThemeProvider 등 |

### 새 파일 생성 시 결정 트리

```
새 컴포넌트 생성?
├─ ShadcnUI 컴포넌트 → npx shadcn@latest add <name>
├─ 레이아웃 관련 → src/components/layout/
├─ 애니메이션 래퍼 → src/components/motion/
├─ 재사용 UI → src/components/shared/
└─ 페이지 전용 → 해당 페이지 디렉토리 내부
```

---

## 컴포넌트 규칙

### ShadcnUI 컴포넌트 (src/components/ui/)

- **추가 방법**: `npx shadcn@latest add <component-name>`
- **직접 생성 금지**: 이 디렉토리에 수동으로 파일 생성하지 않음
- **수정 주의**: 기존 컴포넌트 수정 시 ShadcnUI 업데이트 시 충돌 가능

```bash
# 올바른 예
npx shadcn@latest add button
npx shadcn@latest add dialog

# 잘못된 예
# src/components/ui/my-button.tsx 직접 생성
```

### 커스텀 컴포넌트 (layout, motion, shared)

- **index.ts export 필수**: 새 컴포넌트 생성 시 해당 디렉토리의 index.ts에 export 추가
- **"use client" 지시자**: 클라이언트 훅 사용 시 파일 최상단에 명시

```tsx
// 올바른 예: src/components/layout/NewComponent.tsx 생성 후
// src/components/layout/index.ts 수정
export { NewComponent } from "./NewComponent";
```

### 애니메이션 컴포넌트 사용

| 컴포넌트 | 용도 | 주요 Props |
|---------|------|-----------|
| `FadeIn` | 페이드인 + 방향 이동 | direction, delay, duration |
| `SlideIn` | 슬라이드 진입 | direction, delay |
| `ScrollReveal` | 스크롤 시 노출 | threshold, delay |
| `StaggerChildren` | 자식 순차 애니메이션 | staggerDelay |

```tsx
// 올바른 예
import { FadeIn, ScrollReveal } from "@/components/motion";

// 잘못된 예
import { FadeIn } from "@/components/motion/FadeIn";
```

---

## 코드 스타일 규칙

### 필수 준수 사항

| 항목 | 규칙 |
|-----|------|
| 주석 언어 | **한국어** |
| 커밋 메시지 | **한국어** |
| 컴포넌트명 | PascalCase |
| 변수/함수명 | camelCase |
| 들여쓰기 | 2칸 스페이스 |
| 타입 정의 위치 | `src/types/index.ts` |

### 타입 규칙

- **any 타입 사용 금지**
- 새 타입은 `src/types/index.ts`에 정의
- 컴포넌트 Props 타입은 해당 컴포넌트 파일 내 interface로 정의 가능

```tsx
// 올바른 예
interface ButtonProps {
  variant: "primary" | "secondary";
  onClick: () => void;
}

// 잘못된 예
interface ButtonProps {
  variant: any;  // any 금지
  onClick: Function;  // Function 대신 구체적 타입 사용
}
```

### 경로 별칭

- **항상 `@/*` 사용**: 상대 경로 대신 절대 경로 별칭 사용
- `@/*` → `./src/*`

```tsx
// 올바른 예
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 잘못된 예
import { Button } from "../../components/ui/button";
```

---

## 파일 연동 규칙

### constants.ts 수정 시

| 수정 항목 | 확인 필요 파일 |
|---------|--------------|
| `siteConfig` | `src/app/layout.tsx` (metadata) |
| `navItems` | `src/components/layout/Navigation.tsx`, `MobileMenu.tsx` |
| `footerLinks` | `src/components/layout/Footer.tsx` |

### types/index.ts 수정 시

- 해당 타입을 import하는 모든 파일 확인
- `constants.ts`의 타입 참조 확인

### 레이아웃 수정 시

| 수정 대상 | 영향 범위 |
|---------|----------|
| `src/app/layout.tsx` | 전체 앱 (폰트, ThemeProvider, Toaster) |
| `src/app/(main)/layout.tsx` | (main) 라우트 그룹 페이지 |
| `Header.tsx` / `Footer.tsx` | (main) 레이아웃 사용 페이지 |

### 테마/스타일 수정 시

| 수정 대상 | 연동 파일 |
|---------|----------|
| CSS 변수 (globals.css) | 다크모드 변수도 함께 수정 (.dark 클래스) |
| TailwindCSS 설정 | `postcss.config.mjs` 확인 |

---

## 금지 사항

### 절대 금지

| 항목 | 이유 |
|-----|------|
| `src/components/ui/` 직접 수정 | ShadcnUI CLI 관리 영역 |
| `any` 타입 사용 | 타입 안정성 저하 |
| 영어 주석/커밋 | 프로젝트 규칙 |
| 상대 경로 import | 경로 별칭 `@/*` 사용 |

### 피해야 할 패턴

```tsx
// 금지: any 타입
const handleClick = (e: any) => {};

// 금지: 상대 경로
import { Button } from "../ui/button";

// 금지: index.ts에 export 누락
// 새 컴포넌트 생성 후 index.ts 미수정

// 금지: ui/ 디렉토리에 커스텀 컴포넌트 생성
// src/components/ui/MyCustomButton.tsx
```

---

## 기능 구현 가이드

### 새 페이지 추가

1. `src/app/(main)/페이지명/page.tsx` 생성 (Header/Footer 필요 시)
2. 또는 `src/app/페이지명/page.tsx` 생성 (독립 레이아웃)
3. 필요 시 `constants.ts`의 `navItems`에 네비게이션 추가

### 새 컴포넌트 추가

1. 적절한 디렉토리 선택 (layout/motion/shared)
2. PascalCase 파일명으로 생성
3. 해당 디렉토리의 `index.ts`에 export 추가
4. 새 타입이 필요하면 `src/types/index.ts`에 정의

### 폼 구현

```tsx
// React Hook Form + Zod 패턴 사용
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
});

type FormData = z.infer<typeof schema>;
```

### 토스트 알림

```tsx
import { toast } from "sonner";

// 사용
toast.success("저장되었습니다");
toast.error("오류가 발생했습니다");
```

---

## AI 결정 기준

### 컴포넌트 위치 결정

```
Q: 새 컴포넌트는 어디에?
├─ 여러 페이지에서 사용? → shared/
├─ 레이아웃 구조 담당? → layout/
├─ 애니메이션 래퍼? → motion/
├─ ShadcnUI 기반 확장? → shared/ (ui/ 아님)
└─ 특정 페이지 전용? → 해당 페이지 디렉토리
```

### 타입 정의 위치 결정

```
Q: 타입은 어디에 정의?
├─ 여러 파일에서 사용? → src/types/index.ts
├─ 컴포넌트 Props? → 해당 컴포넌트 파일 내 interface
└─ API 응답 타입? → src/types/index.ts
```

### 스타일 적용 우선순위

1. TailwindCSS 유틸리티 클래스 사용
2. CSS 변수 활용 (테마 일관성)
3. `cn()` 함수로 조건부 클래스 병합
4. 인라인 스타일 최소화
