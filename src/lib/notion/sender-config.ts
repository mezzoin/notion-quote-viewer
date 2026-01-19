/**
 * 발신자 정보 설정
 * 환경변수에서 발신자(공급자) 정보를 로드합니다.
 */

import type { SenderInfo } from "@/types/quote";

/**
 * 환경변수에서 발신자 정보를 로드합니다.
 * 모든 필수 정보가 설정되지 않은 경우 기본값을 사용합니다.
 *
 * @returns {SenderInfo} 발신자 정보 객체
 */
export function getSenderInfo(): SenderInfo {
  return {
    companyName: process.env.SENDER_COMPANY_NAME || "회사명 미설정",
    representative: process.env.SENDER_REPRESENTATIVE || "대표자명 미설정",
    businessNumber: process.env.SENDER_BUSINESS_NUMBER || "000-00-00000",
    address: process.env.SENDER_ADDRESS || "주소 미설정",
    phone: process.env.SENDER_PHONE || "000-0000-0000",
    email: process.env.SENDER_EMAIL || "email@example.com",
    logoUrl: process.env.SENDER_LOGO_URL || undefined,
  };
}

/**
 * 발신자 정보가 올바르게 설정되어 있는지 확인합니다.
 *
 * @returns {boolean} 필수 정보가 모두 설정되어 있으면 true
 */
export function isSenderConfigured(): boolean {
  return Boolean(
    process.env.SENDER_COMPANY_NAME &&
      process.env.SENDER_REPRESENTATIVE &&
      process.env.SENDER_BUSINESS_NUMBER &&
      process.env.SENDER_ADDRESS &&
      process.env.SENDER_PHONE &&
      process.env.SENDER_EMAIL
  );
}
