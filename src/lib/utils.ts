import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 노션 ID 또는 UUID 형식 검증 함수
 * 노션 페이지 ID (32자리 hex) 또는 하이픈이 포함된 UUID 형식을 허용합니다.
 * @param id - 검증할 문자열
 * @returns 유효한 ID 형식이면 true, 아니면 false
 */
export function isValidUUID(id: string): boolean {
  // 32자리 hex (노션 ID 형식)
  const notionIdRegex = /^[0-9a-f]{32}$/i;
  // 하이픈 포함 UUID 형식 (8-4-4-4-12)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return notionIdRegex.test(id) || uuidRegex.test(id);
}

/**
 * 한국 원화 형식으로 금액을 포맷팅하는 함수
 * @param amount - 포맷팅할 금액
 * @returns 천 단위 구분자와 '원' 단위가 포함된 문자열
 * @example
 * formatCurrency(1000000) // '1,000,000원'
 * formatCurrency(0) // '0원'
 * formatCurrency(-5000) // '-5,000원'
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}
