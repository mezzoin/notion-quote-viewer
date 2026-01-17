# Task 001: 라우트 구조 및 페이지 골격 설정

## 개요

견적서 웹 뷰어 시스템의 기본 라우트 구조와 페이지 골격을 설정합니다. Next.js App Router를 사용하여 동적 라우트를 구성하고, 필요한 레이아웃 및 로딩/에러 페이지를 생성합니다.

## 관련 PRD 섹션

- 5.3 메뉴 구조
- 6.1 견적서 상세 페이지
- 6.2 에러 페이지
- 8.3 디렉토리 구조

## 관련 파일

- `src/app/(main)/quote/[id]/page.tsx` - 견적서 상세 페이지
- `src/app/(main)/quote/[id]/loading.tsx` - 로딩 UI
- `src/app/(main)/quote/[id]/error.tsx` - 에러 UI
- `src/app/(main)/quote/[id]/not-found.tsx` - 404 UI
- `src/app/api/quote/[id]/route.ts` - 견적서 API 라우트 (골격)
- `src/app/api/quote/[id]/pdf/route.ts` - PDF API 라우트 (골격)

## 수락 기준

- [ ] `/quote/[id]` 동적 라우트가 정상 작동한다
- [ ] 로딩 상태에서 스켈레톤 UI가 표시된다
- [ ] 존재하지 않는 ID 접근 시 404 페이지가 표시된다
- [ ] 서버 오류 발생 시 에러 페이지가 표시된다
- [ ] API 라우트 골격이 생성되어 있다
- [ ] 기존 레이아웃 (Header/Footer) 구조와 통합된다

## 구현 단계

### 1단계: 페이지 디렉토리 구조 생성

- [ ] `src/app/(main)/quote/[id]/` 디렉토리 생성
- [ ] `page.tsx` 빈 페이지 컴포넌트 생성
- [ ] `loading.tsx` 로딩 컴포넌트 생성
- [ ] `error.tsx` 에러 바운더리 컴포넌트 생성
- [ ] `not-found.tsx` 404 컴포넌트 생성

### 2단계: API 라우트 골격 생성

- [ ] `src/app/api/quote/[id]/route.ts` 생성 (GET 핸들러 골격)
- [ ] `src/app/api/quote/[id]/pdf/route.ts` 생성 (GET 핸들러 골격)
- [ ] 기본 응답 구조 정의 (success, data, error)

### 3단계: 페이지 컴포넌트 기본 구현

- [ ] 견적서 상세 페이지 기본 레이아웃 구현
- [ ] 로딩 스켈레톤 구현 (shadcn Skeleton 활용)
- [ ] 에러 페이지 UI 구현 (재시도 버튼 포함)
- [ ] 404 페이지 UI 구현

### 4단계: 라우트 테스트

- [ ] `/quote/test-id` 접속 시 페이지 렌더링 확인
- [ ] 로딩 상태 시뮬레이션 및 확인
- [ ] API 라우트 호출 테스트 (curl 또는 브라우저)

## 참고 사항

- 기존 프로젝트의 `(main)` 라우트 그룹을 사용하여 Header/Footer 레이아웃 적용
- ShadcnUI의 Skeleton, Card, Button 컴포넌트 활용
- Framer Motion 애니메이션은 Phase 2에서 추가

## 예상 소요 시간

약 4시간

## 변경 사항 요약

> 작업 완료 후 작성합니다.
