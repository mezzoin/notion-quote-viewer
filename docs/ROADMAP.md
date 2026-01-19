# 노션 견적서 웹 뷰어 시스템 개발 로드맵

노션 데이터베이스와 연동하여 클라이언트가 웹에서 견적서를 확인하고 PDF로 다운로드할 수 있는 전문적인 뷰어 시스템

## 개요

노션 견적서 웹 뷰어 시스템은 기업 고객을 위한 견적서 조회 및 다운로드 솔루션으로 다음 기능을 제공합니다:

- **견적서 웹 뷰어**: 노션 API를 통해 견적서 데이터를 조회하여 전문적인 웹 인터페이스로 표시
- **PDF 다운로드**: 브랜딩이 적용된 A4 규격 PDF 파일 생성 및 다운로드
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 뷰 제공
- **다크모드 지원**: 사용자 선호에 따른 테마 전환 기능

## 개발 워크플로우

1. **작업 계획**

   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
   
   
3. **작업 구현**

   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

   - 로드맵에서 완료된 작업을 완료 표시로 변경

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 ✅

- **Task 001: 라우트 구조 및 페이지 골격 설정** ✅ - 완료
  - ✅ `/quote/[id]` 동적 라우트 페이지 생성
  - ✅ 견적서 전용 레이아웃 컴포넌트 골격 구현
  - ✅ 로딩 상태 페이지 (`loading.tsx`) 생성
  - ✅ 에러 처리 페이지 확장 (견적서 전용 404/500)

- **Task 002: 타입 정의 및 데이터 인터페이스 설계** ✅ - 완료
  - ✅ `src/types/quote.ts` 견적서 관련 타입 정의 파일 생성
  - ✅ QuoteData, QuoteItem, SenderInfo, ReceiverInfo 인터페이스 정의
  - ✅ API 응답 타입 (ApiResponse, ApiError) 정의
  - ✅ 노션 데이터베이스 스키마와 매핑되는 타입 설계

- **Task 003: API 라우트 구조 설정** ✅ - 완료
  - ✅ `/api/quote/[id]/route.ts` 견적서 데이터 API 엔드포인트 생성
  - ✅ `/api/quote/[id]/pdf/route.ts` PDF 생성 API 엔드포인트 생성
  - ✅ API 응답 형식 및 에러 핸들링 구조 정의

### Phase 2: UI/UX 완성 (더미 데이터 활용) ✅

- **Task 004: 견적서 공통 컴포넌트 라이브러리 구현** ✅ - 완료
  - ✅ `src/components/quote/` 디렉토리 생성 및 구조화
  - ✅ QuoteStatusBadge 컴포넌트 (상태 배지)
  - ✅ QuoteHeader 컴포넌트 (아이콘, 제목, 견적번호, 상태 배지)
  - ✅ QuoteInfo 컴포넌트 (발신/수신자 정보 2컬럼 레이아웃)
  - ✅ QuoteItemsTable 컴포넌트 (품목 테이블, 반응형 스크롤)
  - ✅ QuoteSummary 컴포넌트 (소계, 부가세, 총액)
  - ✅ QuoteNotes 컴포넌트 (비고 섹션)
  - ✅ QuoteActions 컴포넌트 (PDF 다운로드, 인쇄 버튼)
  - ✅ QuoteSkeleton 컴포넌트 (로딩 스켈레톤 UI)
  - ✅ QuoteExpired 컴포넌트 (만료 경고 UI)
  - ✅ 배럴 익스포트 (`index.ts`)

- **Task 005: 견적서 상세 페이지 UI 완성** ✅ - 완료
  - ✅ 더미 데이터 생성 유틸리티 (`src/lib/mock/quote.ts`)
  - ✅ formatCurrency 유틸리티 함수 (`src/lib/utils.ts`)
  - ✅ 견적서 상세 페이지 전체 UI 조합 및 레이아웃 완성
  - ✅ 반응형 디자인 적용 (모바일/태블릿/데스크톱)
  - ✅ 다크모드 스타일링 검증
  - ✅ Framer Motion 애니메이션 적용 (FadeIn, StaggerChildren)
  - ✅ 로딩 페이지 리팩토링 (QuoteSkeleton 활용)

- **Task 006: 에러 페이지 및 상태 UI 구현** ✅ - 완료
  - ✅ 견적서 만료 안내 UI (QuoteExpired 컴포넌트)
  - ✅ 토스트 알림 통합 (Sonner)
  - ✅ Playwright MCP E2E 테스트 완료

### Phase 3: 핵심 기능 구현 ✅

- **Task 007: 노션 API 연동 및 데이터 조회** ✅ - 완료
  - ✅ `@notionhq/client` 패키지 설치 및 설정
  - ✅ `src/lib/notion/client.ts` 노션 클라이언트 초기화
  - ✅ `src/lib/notion/service.ts` 데이터베이스 쿼리 함수 구현
  - ✅ `src/lib/notion/mapper.ts` 노션 응답 -> 앱 데이터 변환 함수
  - ✅ 환경 변수 설정 (`NOTION_API_KEY`, `NOTION_INVOICES_DB_ID`, `NOTION_ITEMS_DB_ID`)
  - ✅ Playwright MCP를 활용한 API 통합 테스트

- **Task 008: 견적서 데이터 API 구현** ✅ - 완료
  - ✅ `/api/quote/[id]` API 라우트 비즈니스 로직 구현
  - ✅ 더미 데이터를 실제 노션 API 호출로 교체
  - ✅ 노션 ID 형식 검증 (32자리 hex + UUID 형식 지원)
  - ✅ 에러 핸들링 (404, 500) 구현
  - ✅ Playwright MCP를 활용한 엔드포인트 테스트

- **Task 009: 견적서 페이지 실제 데이터 연동** ✅ - 완료
  - ✅ 서버 컴포넌트에서 직접 노션 API 호출
  - ✅ 견적서 페이지에서 더미 데이터를 실제 데이터로 교체
  - ✅ notFound() 처리로 존재하지 않는 견적서 404 페이지 표시

- **Task 010: PDF 생성 기능 구현** ✅ - 완료
  - ✅ `@react-pdf/renderer` 라이브러리 설치
  - ✅ `src/components/pdf/QuotePdfTemplate.tsx` PDF 템플릿 컴포넌트
  - ✅ `/api/quote/[id]/pdf` API 라우트 구현
  - ✅ 한글 폰트 (Spoqa Han Sans Neo) 임베딩
  - ✅ A4 규격 레이아웃
  - ✅ Playwright MCP를 활용한 PDF 다운로드 테스트

- **Task 011: PDF 다운로드 및 인쇄 기능 연동** ✅ - 완료
  - ✅ QuoteActions 컴포넌트에 PDF 다운로드 기능 구현
  - ✅ 다운로드 버튼 클릭 -> PDF 생성 -> 브라우저 다운로드 플로우
  - ✅ PDF 생성 중 로딩 상태 표시
  - ✅ 인쇄 기능 구현 (브라우저 print 다이얼로그)
  - ✅ 에러 핸들링 및 토스트 알림

- **Task 012: 핵심 기능 통합 테스트** ✅ - 완료
  - ✅ Playwright MCP를 사용한 전체 사용자 플로우 테스트
  - ✅ 견적서 조회 -> PDF 다운로드 E2E 테스트

### Phase 4: 고급 기능 및 최적화 ✅

- **Task 013: 성능 최적화** ✅ - 완료
  - ✅ next.config.ts 성능 최적화 (이미지 최적화 AVIF/WebP, 패키지 최적화)
  - ✅ PDF 컴포넌트 동적 임포트 및 LazyMotion 적용
  - ✅ Lighthouse 성능 점수 90점 이상 달성
  - ✅ Core Web Vitals 최적화 (preconnect, dns-prefetch 힌트 추가)
  - ✅ API 응답 캐싱 (ISR revalidate=60, Cache-Control 헤더)

- **Task 014: 접근성 및 보안 강화** ✅ - 완료
  - ✅ WCAG 2.1 AA 수준 접근성 준수
  - ✅ 키보드 네비게이션 지원
  - ✅ 스크린 리더용 aria-label, aria-busy 추가
  - ✅ 색상 대비율 4.5:1 이상 확보 (muted-foreground 조정)
  - ✅ Rate Limiting 미들웨어 구현 (분당 60회/IP)
  - ✅ 입력 검증 강화 (Zod v4 스키마)
  - ✅ 보안 헤더 추가 (X-Frame-Options, X-XSS-Protection 등)

- **Task 015: 테스트 코드 작성 및 CI/CD 구축** ✅ - 완료
  - ✅ Jest + React Testing Library 환경 설정
  - ✅ 유틸리티 함수 단위 테스트 (24개 테스트)
  - ✅ 컴포넌트 테스트 (34개 테스트: QuoteStatusBadge, QuoteHeader, QuoteSummary)
  - ✅ API 검증 로직 테스트 (23개 테스트)
  - ✅ GitHub Actions CI/CD 파이프라인 구축 (lint, type-check, test, build)
  - ✅ 테스트 커버리지 리포트 자동 생성

- **Task 016: 프로덕션 배포 및 모니터링** ✅ - 완료
  - ✅ Vercel 프로덕션 환경 설정 (vercel.json, 한국 리전 icn1)
  - ✅ 환경 변수 템플릿 (.env.local.example)
  - ✅ 보안 헤더 및 캐싱 규칙 설정
  - ✅ Sentry 에러 모니터링 설정 (@sentry/nextjs)
  - ✅ 운영 가이드 문서화 (DEPLOYMENT.md, MONITORING.md, README.md)

## 기술 스택

| 카테고리 | 기술 | 용도 |
|----------|------|------|
| Framework | Next.js 16 | 풀스택 프레임워크 |
| Runtime | React 19 | UI 라이브러리 |
| Language | TypeScript 5 | 타입 안전성 |
| Styling | TailwindCSS 4 | 유틸리티 CSS |
| UI Components | ShadcnUI | 컴포넌트 라이브러리 |
| Animation | Framer Motion | 애니메이션 |
| Theme | next-themes | 다크모드 |
| Toast | Sonner | 알림 메시지 |
| Notion API | @notionhq/client | 노션 연동 |
| PDF | @react-pdf/renderer | PDF 생성 |
| Date | date-fns | 날짜 처리 |
| Validation | Zod | 스키마 검증 |

## 디렉토리 구조 (신규 추가분)

```
src/
├── app/
│   ├── (main)/
│   │   └── quote/
│   │       └── [id]/
│   │           ├── page.tsx           # 견적서 상세 페이지
│   │           └── loading.tsx        # 로딩 UI
│   └── api/
│       └── quote/
│           └── [id]/
│               ├── route.ts           # 견적서 데이터 API
│               └── pdf/
│                   └── route.ts       # PDF 생성 API
├── components/
│   ├── quote/
│   │   ├── QuoteStatusBadge.tsx      # 상태 배지 ✅
│   │   ├── QuoteHeader.tsx           # 견적서 헤더 ✅
│   │   ├── QuoteInfo.tsx             # 발신/수신자 정보 ✅
│   │   ├── QuoteItemsTable.tsx       # 품목 테이블 ✅
│   │   ├── QuoteSummary.tsx          # 금액 요약 ✅
│   │   ├── QuoteNotes.tsx            # 비고 섹션 ✅
│   │   ├── QuoteActions.tsx          # 액션 버튼 (PDF, 인쇄) ✅
│   │   ├── QuoteSkeleton.tsx         # 스켈레톤 로딩 ✅
│   │   ├── QuoteExpired.tsx          # 만료 경고 ✅
│   │   └── index.ts                  # 배럴 익스포트 ✅
│   └── pdf/
│       └── QuotePdfTemplate.tsx      # PDF 템플릿
├── lib/
│   ├── notion/
│   │   ├── client.ts                 # 노션 클라이언트
│   │   ├── queries.ts                # 노션 쿼리 함수
│   │   └── transformers.ts           # 데이터 변환 함수
│   ├── pdf/
│   │   └── generator.ts              # PDF 생성 로직
│   └── mock/
│       └── quote.ts                  # 더미 데이터 ✅
├── types/
│   └── quote.ts                      # 견적서 관련 타입 ✅
└── hooks/
    ├── useQuote.ts                   # 견적서 데이터 훅
    └── usePdfDownload.ts             # PDF 다운로드 훅
```

## 예상 일정

| Phase | 기간 | 주요 산출물 |
|-------|------|------------|
| Phase 1: 애플리케이션 골격 구축 | 1주 | 라우트 구조, 타입 정의, API 골격 |
| Phase 2: UI/UX 완성 | 2주 | 모든 컴포넌트 UI, 더미 데이터 연동 |
| Phase 3: 핵심 기능 구현 | 2주 | 노션 연동, PDF 생성, 실제 데이터 연동 |
| Phase 4: 고급 기능 및 최적화 | 1.5주 | 성능 최적화, 테스트, 배포 |

**총 예상 기간: 6.5주**

## 우선순위 기준

- **P0 (Must Have)**: 견적서 조회, PDF 다운로드, 노션 연동, 반응형 UI
- **P1 (Should Have)**: 인쇄 기능, 다크모드, 접근성
- **P2 (Nice to Have)**: 실시간 갱신, 고급 애니메이션

## 품질 기준

- ✅ Lighthouse Performance: 90점 이상 달성
- ✅ Lighthouse Accessibility: 90점 이상 달성
- ✅ 테스트 커버리지: 81개 테스트 케이스 작성
- ✅ 페이지 로드 시간: ISR 적용으로 최적화
- ✅ PDF 생성 시간: 서버사이드 생성으로 최적화

## 프로젝트 완료

**모든 Phase가 성공적으로 완료되었습니다.**

- Phase 1: 애플리케이션 골격 구축 ✅
- Phase 2: UI/UX 완성 ✅
- Phase 3: 핵심 기능 구현 ✅
- Phase 4: 고급 기능 및 최적화 ✅
