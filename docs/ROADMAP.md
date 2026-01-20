# 노션 견적서 웹 뷰어 시스템 V2 개발 로드맵

노션 데이터베이스와 연동하여 관리자가 견적서를 효율적으로 관리하고, 클라이언트에게 견적서 링크를 공유할 수 있는 관리자 시스템

## 개요

V2 고도화 작업은 기존 견적서 뷰어 시스템에 **관리자 기능**을 추가하여 다음 기능을 제공합니다:

- **관리자 인증**: 환경변수 기반 패스워드 인증으로 관리자 페이지 보호
- **관리자 대시보드**: 전용 레이아웃을 통한 관리자 인터페이스
- **견적서 목록 관리**: 모든 견적서를 테이블 형태로 조회 및 관리
- **필터링 및 검색**: 상태, 날짜, 고객명 등 다양한 조건으로 견적서 검색
- **클라이언트 링크 공유**: 원클릭으로 견적서 URL을 복사하여 고객에게 전달

## 개발 워크플로우

1. **작업 계획**

   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 명명 형식: `XXX-description.md` (예: `017-admin-auth.md`)
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

## V1 완료 현황

V1 개발이 성공적으로 완료되었습니다. 상세 내용은 [ROADMAP_V1.md](./roadmaps/ROADMAP_V1.md)를 참조하세요.

| Phase | 상태 | 주요 내용 |
|-------|------|----------|
| Phase 1 | ✅ | 애플리케이션 골격 구축 (라우트 구조, 타입 정의, API 골격) |
| Phase 2 | ✅ | UI/UX 완성 (모든 컴포넌트 UI, 더미 데이터 연동) |
| Phase 3 | ✅ | 핵심 기능 구현 (노션 연동, PDF 생성, 실제 데이터 연동) |
| Phase 4 | ✅ | 고급 기능 및 최적화 (성능 최적화, 테스트, 배포) |

## 개발 단계

### Phase 5: 관리자 기능 구현

- **Task 017: 환경변수 기반 관리자 인증 구현** - P0
  - [ ] `ADMIN_PASSWORD` 환경변수 설정
  - [ ] `/admin/login` 로그인 페이지 생성
  - [ ] AdminLoginForm 컴포넌트 (패스워드 입력 필드만)
  - [ ] `/api/admin/auth/login` POST 엔드포인트 (패스워드 검증)
  - [ ] `/api/admin/auth/logout` POST 엔드포인트
  - [ ] httpOnly 쿠키로 세션 관리 (`admin-session`)
  - [ ] Next.js 미들웨어로 `/admin/*` 라우트 보호 (login 제외)
  - [ ] 로그아웃 버튼 (AdminHeader에 추가)

- **Task 018: 관리자 레이아웃 및 라우트 구조 설정** - P0
  - [ ] `(admin)` 라우트 그룹 생성
  - [ ] 관리자 전용 레이아웃 컴포넌트 구현
  - [ ] `/admin/quotes` 페이지 골격 생성
  - [ ] 관리자 네비게이션 구조 설정

- **Task 019: 견적서 목록 타입 정의 및 API 설계** - P0
  - [ ] `src/types/admin.ts` 관리자 관련 타입 정의
  - [ ] QuoteListItem, QuoteListFilters, QuoteListResponse 인터페이스 정의
  - [ ] 페이지네이션 타입 (PaginationParams, PaginationMeta) 정의
  - [ ] API 엔드포인트 설계 문서화

- **Task 020: 관리자 공통 컴포넌트 구현** - P0
  - [ ] `src/components/admin/` 디렉토리 생성 및 구조화
  - [ ] AdminHeader 컴포넌트 (로고, 네비게이션, 로그아웃)
  - [ ] AdminSidebar 컴포넌트 (메뉴, 접기 기능)
  - [ ] 배럴 익스포트 (`index.ts`)

- **Task 021: 견적서 목록 페이지 UI 완성 (더미 데이터)** - P0
  - [ ] `src/lib/mock/admin.ts` 더미 데이터 생성
  - [ ] QuoteListTable 컴포넌트 (테이블 헤더, 행, 정렬)
  - [ ] QuoteListFilters 컴포넌트 (검색, 상태 필터, 날짜 범위)
  - [ ] 견적서 목록 페이지 전체 UI 조합 및 레이아웃 완성
  - [ ] 반응형 디자인 적용

- **Task 022: 견적서 목록 API 구현 (노션 연동)** - P0
  - [ ] `/api/admin/quotes/route.ts` API 엔드포인트 생성
  - [ ] 노션 데이터베이스 쿼리 함수 확장
  - [ ] 필터링 조건을 노션 쿼리로 변환
  - [ ] 더미 데이터를 실제 노션 API 호출로 교체
  - [ ] Playwright MCP를 활용한 API 통합 테스트

- **Task 023: 필터링 및 검색 기능 구현** - P1
  - [ ] 상태별 필터링 (전체, 발행됨, 수락됨, 거절됨, 만료됨)
  - [ ] 날짜 범위 필터링 (견적일 기준)
  - [ ] 고객명/견적번호 검색
  - [ ] 필터 상태 URL 쿼리 파라미터 동기화
  - [ ] `useQuoteList` 훅 구현

- **Task 024: 페이지네이션 구현** - P1
  - [ ] QuoteListPagination 컴포넌트
  - [ ] 페이지 크기 선택 (10, 20, 50개)
  - [ ] 페이지 번호 네비게이션
  - [ ] 전체 건수 및 현재 페이지 표시

- **Task 025: 클라이언트 링크 복사 기능 구현** - P0
  - [ ] CopyLinkButton 컴포넌트 구현
  - [ ] `useCopyToClipboard` 훅 구현
  - [ ] 복사 성공/실패 토스트 알림
  - [ ] 테이블 행에 복사 버튼 통합

- **Task 026: 관리자 기능 통합 테스트** - P0
  - [ ] Playwright MCP를 사용한 전체 사용자 플로우 테스트
  - [ ] 로그인 -> 견적서 목록 조회 -> 필터링 -> 검색 -> 링크 복사 E2E 테스트
  - [ ] 성능 검증 (목록 로드 시간 1초 이내)

## 디렉토리 구조 (V2 신규 추가분)

```
src/
├── app/
│   ├── (admin)/
│   │   ├── layout.tsx              # 관리자 레이아웃
│   │   └── admin/
│   │       ├── login/
│   │       │   └── page.tsx        # 로그인 페이지
│   │       └── quotes/
│   │           └── page.tsx        # 견적서 목록 페이지
│   └── api/
│       └── admin/
│           ├── auth/
│           │   ├── login/route.ts  # 로그인 API
│           │   └── logout/route.ts # 로그아웃 API
│           └── quotes/
│               └── route.ts        # 견적서 목록 API
├── components/
│   └── admin/
│       ├── AdminHeader.tsx         # 관리자 헤더 (로그아웃 포함)
│       ├── AdminSidebar.tsx        # 관리자 사이드바
│       ├── AdminLoginForm.tsx      # 로그인 폼
│       ├── QuoteListTable.tsx      # 견적서 목록 테이블
│       ├── QuoteListFilters.tsx    # 필터 컴포넌트
│       ├── QuoteListPagination.tsx # 페이지네이션
│       ├── CopyLinkButton.tsx      # 링크 복사 버튼
│       └── index.ts                # 배럴 익스포트
├── types/
│   └── admin.ts                    # 관리자 타입 정의
├── lib/
│   ├── auth/
│   │   └── admin.ts                # 인증 유틸리티 (쿠키 검증)
│   └── mock/
│       └── admin.ts                # 관리자 더미 데이터
├── hooks/
│   ├── useQuoteList.ts             # 견적서 목록 훅
│   └── useCopyToClipboard.ts       # 클립보드 복사 훅
└── middleware.ts                   # 관리자 라우트 보호
```

## 인증 흐름

```
1. /admin/* 접근 → 미들웨어가 쿠키 확인
2. 쿠키 없음 → /admin/login 리다이렉트
3. 패스워드 입력 → POST /api/admin/auth/login
4. 환경변수와 비교 → 일치 시 httpOnly 쿠키 발급
5. 인증됨 → /admin/quotes로 리다이렉트
```

## 환경변수

```env
# 관리자 인증
ADMIN_PASSWORD=your-secure-password
```

## 예상 일정

| Phase | 기간 | 주요 산출물 |
|-------|------|------------|
| Phase 5: 관리자 기능 구현 | 2주 | 인증, 관리자 레이아웃, 견적서 목록, 필터링, 페이지네이션, 링크 복사 |

## 우선순위 기준

- **P0 (Must Have)**: 관리자 인증, 관리자 레이아웃, 견적서 목록 조회, 링크 복사 기능
- **P1 (Should Have)**: 필터링, 검색, 페이지네이션
- **P2 (Nice to Have)**: 대시보드 통계, 엑셀 내보내기

## 품질 기준

- Lighthouse Performance: 90점 이상
- Lighthouse Accessibility: 90점 이상
- 테스트 커버리지: 기존 수준 유지
- 목록 로드 시간: 1초 이내
- 반응형 지원: 모바일, 태블릿, 데스크톱
