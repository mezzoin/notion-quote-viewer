/**
 * 노션 API 원시 타입 정의
 * 노션 데이터베이스에서 반환되는 원시 데이터 구조를 정의합니다.
 */

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

/**
 * 노션 DB의 한글 상태값 타입
 * 노션 데이터베이스 Select 속성에 정의된 값들
 */
export type NotionQuoteStatus = "대기" | "승인" | "거절";

/**
 * 노션 속성 타입 (간소화)
 * 노션 API의 복잡한 타입을 간소화하여 사용합니다.
 */
export type NotionPropertyValue =
  | { type: "title"; title: Array<{ plain_text: string }> }
  | { type: "rich_text"; rich_text: Array<{ plain_text: string }> }
  | { type: "number"; number: number | null }
  | { type: "select"; select: { name: string } | null }
  | { type: "date"; date: { start: string; end?: string | null } | null }
  | { type: "relation"; relation: Array<{ id: string }> }
  | { type: "formula"; formula: { type: "number"; number: number | null } | { type: "string"; string: string | null } }
  | { type: "rollup"; rollup: { type: "number"; number: number | null } }
  | { type: string; [key: string]: unknown };

/**
 * 노션 Invoice 페이지 속성 타입
 */
export interface NotionInvoiceProperties {
  "견적서 번호": NotionPropertyValue;
  "발행일": NotionPropertyValue;
  "상태": NotionPropertyValue;
  "유효기간": NotionPropertyValue;
  "총 금액"?: NotionPropertyValue;
  "클라이언트명": NotionPropertyValue;
  "항목": NotionPropertyValue;
  [key: string]: NotionPropertyValue | undefined;
}

/**
 * 노션 Item 페이지 속성 타입
 */
export interface NotionItemProperties {
  "항목명": NotionPropertyValue;
  "Invoices": NotionPropertyValue;
  "금액"?: NotionPropertyValue;
  "단가": NotionPropertyValue;
  "수량": NotionPropertyValue;
  [key: string]: NotionPropertyValue | undefined;
}

/**
 * 노션 Invoice 페이지 타입
 */
export interface NotionInvoicePage extends Omit<PageObjectResponse, "properties"> {
  properties: NotionInvoiceProperties;
}

/**
 * 노션 Item 페이지 타입
 */
export interface NotionItemPage extends Omit<PageObjectResponse, "properties"> {
  properties: NotionItemProperties;
}
