/**
 * 견적서 관련 Zod 검증 스키마
 * API 입력 검증에 사용되는 스키마 정의
 */

import { z } from "zod";

/**
 * UUID v4 정규식 패턴
 * 노션 페이지 ID 형식 (하이픈 포함/미포함 모두 지원)
 */
const UUID_REGEX = /^[0-9a-f]{8}-?[0-9a-f]{4}-?4[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i;

/**
 * 노션 페이지 ID를 검증하는 스키마
 * 32자리 hex 또는 하이픈이 포함된 36자리 UUID v4 형식 지원
 */
export const notionIdSchema = z.string().refine(
  (val) => UUID_REGEX.test(val),
  {
    message: "유효하지 않은 노션 ID 형식입니다.",
  }
);

/**
 * 견적서 ID 파라미터 스키마
 */
export const quoteIdParamsSchema = z.object({
  id: notionIdSchema,
});

/**
 * 견적서 ID 검증 결과 타입
 */
export type QuoteIdParams = z.infer<typeof quoteIdParamsSchema>;

/**
 * API 입력 검증 헬퍼 함수
 * 검증 실패 시 에러 정보 반환, 성공 시 파싱된 데이터 반환
 */
export function validateQuoteId(id: string): {
  success: true;
  data: string;
} | {
  success: false;
  error: string;
} {
  const result = notionIdSchema.safeParse(id);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Zod v4: issues 배열에서 첫 번째 에러 메시지 추출
  const firstIssue = result.error.issues[0];
  return {
    success: false,
    error: firstIssue?.message ?? "유효하지 않은 ID 형식입니다.",
  };
}
