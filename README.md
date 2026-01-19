# 노션 견적서 웹 뷰어

노션 데이터베이스와 연동하여 견적서를 웹에서 조회하고 PDF로 다운로드할 수 있는 Next.js 기반 웹 애플리케이션입니다.

## 주요 기능

- **견적서 조회**: 노션 데이터베이스에서 견적서 정보 실시간 조회
- **PDF 다운로드**: 견적서를 PDF 파일로 변환하여 다운로드
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 환경 지원
- **다크 모드**: 시스템 설정에 따른 자동 테마 전환

## 기술 스택

| 영역 | 기술 |
|------|------|
| **프레임워크** | Next.js 16, React 19 |
| **UI** | ShadcnUI, Radix UI, Lucide Icons |
| **스타일링** | TailwindCSS 4 |
| **애니메이션** | Framer Motion |
| **폼 처리** | React Hook Form, Zod |
| **PDF 생성** | @react-pdf/renderer |
| **에러 모니터링** | Sentry |

## 빠른 시작

### 1. 저장소 클론

```bash
git clone https://github.com/your-org/notion-quote-web.git
cd notion-quote-web
```

### 2. 의존성 설치

```bash
npm ci
```

### 3. 환경변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열어 실제 값을 입력합니다:

```env
# 노션 API 설정 (필수)
NOTION_API_KEY=secret_xxxxxxxxxx
NOTION_INVOICES_DB_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NOTION_ITEMS_DB_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# 발신자 정보 (필수)
SENDER_COMPANY_NAME=회사명
SENDER_REPRESENTATIVE=대표자명
SENDER_BUSINESS_NUMBER=123-45-67890
SENDER_ADDRESS=서울특별시 강남구 테헤란로 123
SENDER_PHONE=02-1234-5678
SENDER_EMAIL=contact@company.com
```

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run type-check` | TypeScript 타입 검사 |
| `npm run test` | 테스트 실행 |
| `npm run test:coverage` | 커버리지 포함 테스트 |

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # 메인 레이아웃 그룹
│   ├── api/               # API 라우트
│   │   └── quote/         # 견적서 API
│   └── quote/             # 견적서 페이지
├── components/
│   ├── ui/                # ShadcnUI 컴포넌트
│   ├── quote/             # 견적서 관련 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   └── motion/            # 애니메이션 컴포넌트
├── lib/                   # 유틸리티 및 설정
│   ├── notion/            # 노션 API 클라이언트
│   └── validations/       # Zod 스키마
├── types/                 # TypeScript 타입 정의
└── providers/             # Context Provider
```

## API 엔드포인트

| 엔드포인트 | 메서드 | 설명 |
|------------|--------|------|
| `/api/quote/[id]` | GET | 견적서 데이터 조회 |
| `/api/quote/[id]/pdf` | GET | 견적서 PDF 다운로드 |

## 배포

### Vercel (권장)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Vercel에 GitHub 저장소 연결
2. 환경변수 설정
3. 자동 배포

자세한 내용은 [배포 가이드](./docs/DEPLOYMENT.md)를 참조하세요.

## 문서

- [배포 가이드](./docs/DEPLOYMENT.md) - 환경 설정 및 배포 절차
- [모니터링 가이드](./docs/MONITORING.md) - 에러 모니터링 및 성능 추적
- [PRD](./docs/PRD.md) - 제품 요구사항 문서
- [로드맵](./docs/ROADMAP.md) - 개발 로드맵

## 테스트

```bash
# 단위 테스트 실행
npm run test

# 커버리지 리포트 생성
npm run test:coverage
```

테스트 범위:
- 유틸리티 함수 (cn, isValidUUID, formatCurrency)
- 견적서 컴포넌트 (QuoteStatusBadge, QuoteHeader, QuoteSummary)
- API 입력 검증

## 라이선스

Private
