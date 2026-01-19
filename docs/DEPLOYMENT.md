# 배포 가이드

노션 견적서 웹 뷰어의 배포 및 환경 설정 가이드입니다.

## 목차

1. [로컬 개발 환경 설정](#로컬-개발-환경-설정)
2. [환경변수 설정](#환경변수-설정)
3. [Vercel 배포](#vercel-배포)
4. [도메인 설정](#도메인-설정)
5. [문제 해결](#문제-해결)

---

## 로컬 개발 환경 설정

### 필수 요구사항

- Node.js 20.x 이상
- npm 10.x 이상
- Git

### 설치 단계

```bash
# 1. 저장소 클론
git clone https://github.com/your-org/notion-quote-web.git
cd notion-quote-web

# 2. 의존성 설치
npm ci

# 3. 환경변수 설정
cp .env.local.example .env.local
# .env.local 파일을 편집하여 실제 값 입력

# 4. 개발 서버 실행
npm run dev
```

개발 서버가 시작되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 유용한 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run type-check` | TypeScript 타입 검사 |
| `npm run test` | 테스트 실행 |
| `npm run test:coverage` | 커버리지 포함 테스트 |

---

## 환경변수 설정

### 필수 환경변수

#### 노션 API 설정

```env
# 노션 통합 시크릿 키
# 노션 설정 > 내 연결 > 통합에서 생성
NOTION_API_KEY=secret_xxxxxxxxxx

# 견적서 데이터베이스 ID
# 노션 데이터베이스 URL에서 추출: notion.so/{database_id}?v=...
NOTION_INVOICES_DB_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# 항목 데이터베이스 ID
NOTION_ITEMS_DB_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

#### 발신자(공급자) 정보

```env
SENDER_COMPANY_NAME=회사명
SENDER_REPRESENTATIVE=대표자명
SENDER_BUSINESS_NUMBER=123-45-67890
SENDER_ADDRESS=서울특별시 강남구 테헤란로 123
SENDER_PHONE=02-1234-5678
SENDER_EMAIL=contact@company.com
SENDER_LOGO_URL=https://example.com/logo.png
```

### 선택 환경변수

#### Sentry 에러 모니터링

```env
# Sentry 대시보드에서 DSN 확인
NEXT_PUBLIC_SENTRY_DSN=https://xxxxxx@o000000.ingest.sentry.io/0000000
SENTRY_DSN=https://xxxxxx@o000000.ingest.sentry.io/0000000
SENTRY_ORG=your-organization
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=sntrys_xxxxxx
```

#### 앱 URL

```env
# 프로덕션 도메인
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 노션 데이터베이스 ID 찾기

1. 노션에서 데이터베이스 페이지를 엽니다
2. 브라우저 URL을 확인합니다:
   ```
   https://www.notion.so/{workspace}/{database_id}?v={view_id}
   ```
3. `database_id` 부분이 32자리 UUID입니다
4. 하이픈을 포함한 형식으로 변환: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

## Vercel 배포

### 초기 배포

1. **GitHub 저장소 연결**
   - [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
   - "Add New Project" 클릭
   - GitHub 저장소 선택

2. **프로젝트 설정**
   - Framework Preset: Next.js (자동 감지)
   - Root Directory: `./` (기본값)
   - Build Command: `npm run build`
   - Install Command: `npm ci`

3. **환경변수 설정**
   - Vercel 프로젝트 설정 > Environment Variables
   - 위의 모든 필수 환경변수 추가
   - Production, Preview, Development 환경별로 다르게 설정 가능

4. **배포 실행**
   - "Deploy" 버튼 클릭
   - 빌드 로그 확인

### 자동 배포

- `master` 브랜치에 푸시 시 자동 프로덕션 배포
- PR 생성 시 Preview 환경 자동 배포
- Preview URL: `{project}-{branch}-{org}.vercel.app`

### 배포 설정 파일 (vercel.json)

```json
{
  "framework": "nextjs",
  "regions": ["icn1"],  // 한국 리전
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

### 환경별 설정

| 환경 | 브랜치 | URL |
|------|--------|-----|
| Production | `master` | `your-domain.com` |
| Preview | PR 브랜치 | `*.vercel.app` |
| Development | 로컬 | `localhost:3000` |

---

## 도메인 설정

### Vercel 커스텀 도메인

1. Vercel 프로젝트 > Settings > Domains
2. "Add Domain" 클릭
3. 도메인 입력 (예: `quote.company.com`)
4. DNS 레코드 설정 안내에 따라 설정

### DNS 설정 예시

| 타입 | 이름 | 값 |
|------|------|-----|
| CNAME | quote | cname.vercel-dns.com |
| A | @ | 76.76.21.21 |

### HTTPS

- Vercel은 자동으로 Let's Encrypt SSL 인증서 발급
- 별도 설정 불필요

---

## 문제 해결

### 빌드 실패

**증상:** Vercel 배포 시 빌드 에러

**해결:**
```bash
# 로컬에서 빌드 테스트
npm run build

# 타입 에러 확인
npm run type-check

# 린트 에러 확인
npm run lint
```

### 환경변수 누락

**증상:** `NOTION_API_KEY is not defined`

**해결:**
1. Vercel Dashboard > Settings > Environment Variables 확인
2. 환경변수명의 오타 확인
3. 환경(Production/Preview/Development) 선택 확인

### API 403 에러

**증상:** 노션 API 호출 시 권한 에러

**해결:**
1. 노션 통합이 데이터베이스에 연결되어 있는지 확인
2. 데이터베이스 페이지 > 연결 추가 > 통합 선택
3. API 키가 올바른지 확인

### Rate Limiting

**증상:** 429 Too Many Requests

**해결:**
- 노션 API: 초당 3회 제한
- 앱 API: 분당 60회 제한 (IP당)
- 요청 빈도 조절 또는 캐싱 활용

---

## 관련 문서

- [모니터링 가이드](./MONITORING.md)
- [PRD 문서](./PRD.md)
- [로드맵](./ROADMAP.md)
