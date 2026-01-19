/**
 * 노션 클라이언트 초기화
 * 싱글톤 패턴으로 노션 API 클라이언트를 관리합니다.
 */

import { Client } from "@notionhq/client";

/**
 * 노션 API 키
 * 환경변수에서 로드됩니다.
 */
const NOTION_API_KEY = process.env.NOTION_API_KEY;

/**
 * 노션 Invoices 데이터베이스 ID
 */
export const INVOICES_DB_ID = process.env.NOTION_INVOICES_DB_ID || "";

/**
 * 노션 Items 데이터베이스 ID
 */
export const ITEMS_DB_ID = process.env.NOTION_ITEMS_DB_ID || "";

/**
 * 노션 클라이언트 인스턴스 (싱글톤)
 * 서버 사이드에서만 사용됩니다.
 */
let notionClient: Client | null = null;

/**
 * 노션 클라이언트를 가져옵니다.
 * 인스턴스가 없으면 새로 생성합니다.
 *
 * @throws {Error} NOTION_API_KEY가 설정되지 않은 경우
 * @returns {Client} 노션 클라이언트 인스턴스
 */
export function getNotionClient(): Client {
  if (!NOTION_API_KEY) {
    throw new Error(
      "NOTION_API_KEY 환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요."
    );
  }

  if (!notionClient) {
    notionClient = new Client({
      auth: NOTION_API_KEY,
    });
  }

  return notionClient;
}

/**
 * 노션 설정이 올바르게 되어 있는지 확인합니다.
 *
 * @returns {boolean} 설정이 올바르면 true
 */
export function isNotionConfigured(): boolean {
  return Boolean(NOTION_API_KEY && INVOICES_DB_ID && ITEMS_DB_ID);
}
