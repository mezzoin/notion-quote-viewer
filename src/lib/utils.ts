import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * UUID v4 형식 검증 함수
 * 주어진 문자열이 유효한 UUID v4 형식인지 확인합니다.
 * @param id - 검증할 문자열
 * @returns UUID v4 형식이면 true, 아니면 false
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
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
