# 모니터링 가이드

노션 견적서 웹 뷰어의 에러 모니터링 및 성능 추적 가이드입니다.

## 목차

1. [Sentry 에러 모니터링](#sentry-에러-모니터링)
2. [Vercel Analytics](#vercel-analytics)
3. [에러 알림 설정](#에러-알림-설정)
4. [성능 모니터링 지표](#성능-모니터링-지표)
5. [로그 확인](#로그-확인)

---

## Sentry 에러 모니터링

### 대시보드 접근

1. [Sentry.io](https://sentry.io) 로그인
2. 좌측 메뉴에서 프로젝트 선택
3. Issues 탭에서 에러 목록 확인

### 주요 메뉴

| 메뉴 | 설명 |
|------|------|
| **Issues** | 발생한 에러 목록 |
| **Performance** | 트랜잭션 성능 분석 |
| **Releases** | 배포 버전별 에러 추적 |
| **Alerts** | 알림 규칙 설정 |
| **Discover** | 커스텀 쿼리 |

### 에러 상세 정보

각 에러에서 확인 가능한 정보:
- **Stack Trace**: 에러 발생 위치
- **Breadcrumbs**: 에러 발생 전 사용자 행동
- **Tags**: 환경, 브라우저, OS 등
- **User**: 영향받은 사용자 정보
- **Context**: 추가 컨텍스트 데이터

### 에러 필터링

```
# 프로덕션 환경만
environment:production

# 특정 페이지
transaction:/quote/*

# 특정 에러 타입
error.type:TypeError

# 최근 24시간
lastSeen:-24h
```

### 에러 상태 관리

| 상태 | 설명 |
|------|------|
| **Unresolved** | 미해결 에러 |
| **Resolved** | 해결됨 |
| **Ignored** | 무시 처리 |
| **Archived** | 보관됨 |

---

## Vercel Analytics

### Web Analytics

Vercel 프로젝트에서 자동 제공되는 분석 기능입니다.

1. Vercel Dashboard > 프로젝트 선택
2. Analytics 탭 클릭

**확인 가능한 지표:**
- 페이지 조회수 (Page Views)
- 고유 방문자수 (Unique Visitors)
- 평균 체류 시간
- 이탈률 (Bounce Rate)
- 인기 페이지
- 트래픽 소스
- 지역별 방문자

### Speed Insights

Core Web Vitals 실시간 모니터링:

| 지표 | 설명 | 목표값 |
|------|------|--------|
| **LCP** | Largest Contentful Paint | < 2.5s |
| **FID** | First Input Delay | < 100ms |
| **CLS** | Cumulative Layout Shift | < 0.1 |
| **TTFB** | Time to First Byte | < 800ms |
| **FCP** | First Contentful Paint | < 1.8s |

### 활성화 방법

```bash
# Vercel Analytics 패키지 (이미 설치됨)
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 에러 알림 설정

### Sentry 알림 규칙

1. Sentry Dashboard > Alerts > Create Alert
2. 알림 조건 설정

**권장 알림 규칙:**

#### 신규 에러 알림
```yaml
조건: 처음 발생한 에러
알림 대상: Slack #dev-alerts
빈도: 즉시
```

#### 에러 급증 알림
```yaml
조건: 1시간 내 동일 에러 10회 이상
알림 대상: Slack #dev-alerts + Email
빈도: 1시간마다 최대 1회
```

#### 크리티컬 에러 알림
```yaml
조건: level:error AND environment:production
알림 대상: PagerDuty / 전화
빈도: 즉시
```

### Slack 연동

1. Sentry > Settings > Integrations
2. Slack 선택 > Install
3. 워크스페이스 연결
4. 알림 받을 채널 설정

### 알림 채널 예시

| 심각도 | 채널 | 대응 시간 |
|--------|------|-----------|
| Critical | PagerDuty | 15분 내 |
| Error | #dev-alerts | 1시간 내 |
| Warning | #dev-monitoring | 24시간 내 |
| Info | 로그만 기록 | - |

---

## 성능 모니터링 지표

### 핵심 성능 지표 (KPIs)

| 지표 | 설명 | SLA 목표 |
|------|------|----------|
| **가용성** | 서비스 정상 시간 | 99.9% |
| **응답 시간** | API 평균 응답 | < 500ms |
| **에러율** | 5xx 에러 비율 | < 0.1% |
| **LCP** | 페이지 로드 | < 2.5s |

### Sentry Performance 설정

```typescript
// sentry.client.config.ts
Sentry.init({
  tracesSampleRate: 0.1, // 10% 샘플링
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/your-domain\.com/,
  ],
});
```

### 모니터링 대시보드

Sentry Discover에서 커스텀 대시보드 생성:

```sql
-- 느린 API 요청 조회
SELECT transaction, avg(duration), count()
FROM transactions
WHERE transaction LIKE '/api/*'
GROUP BY transaction
ORDER BY avg(duration) DESC
```

### 성능 병목 확인

1. Sentry > Performance > Transactions
2. 느린 트랜잭션 선택
3. Span 분석으로 병목 구간 확인
4. Database, API 호출 시간 분석

---

## 로그 확인

### Vercel 함수 로그

1. Vercel Dashboard > 프로젝트
2. Logs 탭 선택
3. 함수별/시간별 필터링

**로그 레벨:**
- `info`: 일반 정보
- `warn`: 경고
- `error`: 에러

### 로그 검색

```
# API 라우트 로그
path:/api/quote

# 에러만
level:error

# 특정 시간대
timestamp:>2024-01-01
```

### 로그 보존 기간

| 플랜 | 보존 기간 |
|------|-----------|
| Hobby | 1시간 |
| Pro | 3일 |
| Enterprise | 90일 |

### 구조화된 로깅 예시

```typescript
// 권장 로깅 패턴
console.log(JSON.stringify({
  level: 'info',
  message: 'Quote fetched',
  quoteId: id,
  duration: performance.now() - start,
  timestamp: new Date().toISOString(),
}));
```

---

## 문제 대응 절차

### Level 1: 일반 에러

1. Sentry에서 에러 확인
2. Stack trace 분석
3. 로컬 환경 재현
4. 수정 및 배포
5. Sentry에서 Resolved 처리

### Level 2: 서비스 장애

1. 알림 수신
2. Vercel Status 확인
3. 노션 API Status 확인
4. 롤백 필요 시 이전 버전 배포
5. 사후 분석 (Postmortem)

### 롤백 방법

```bash
# Vercel CLI
vercel rollback [deployment-url]

# 또는 Dashboard에서
# Deployments > 이전 배포 선택 > Promote to Production
```

---

## 관련 문서

- [배포 가이드](./DEPLOYMENT.md)
- [PRD 문서](./PRD.md)
- [로드맵](./ROADMAP.md)
