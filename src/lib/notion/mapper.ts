/**
 * 노션 데이터 변환 유틸리티
 * 노션 API 응답을 앱에서 사용하는 타입으로 변환합니다.
 */

import type {
  NotionQuoteStatus as RawNotionQuoteStatus,
  NotionInvoicePage,
  NotionItemPage,
  NotionPropertyValue,
} from "@/types/notion-raw";
import type {
  QuoteStatus,
  NotionQuoteStatus,
  QuoteItem,
  QuoteData,
  ReceiverInfo,
  SenderInfo,
} from "@/types/quote";
import type { QuoteListItem } from "@/types/admin";
import { NOTION_STATUS_MAP } from "@/types/quote";
import { getSenderInfo } from "./sender-config";

/**
 * Title 속성에서 텍스트를 추출합니다.
 *
 * @param prop - 노션 속성
 * @returns 추출된 제목 문자열
 */
export function extractTitle(prop: NotionPropertyValue | undefined): string {
  if (!prop || prop.type !== "title") return "";
  const titleProp = prop as { type: "title"; title: Array<{ plain_text: string }> };
  return titleProp.title?.map((t) => t.plain_text).join("") || "";
}

/**
 * Rich Text 속성에서 텍스트를 추출합니다.
 *
 * @param prop - 노션 속성
 * @returns 추출된 문자열
 */
export function extractPlainText(prop: NotionPropertyValue | undefined): string {
  if (!prop || prop.type !== "rich_text") return "";
  const richTextProp = prop as { type: "rich_text"; rich_text: Array<{ plain_text: string }> };
  return richTextProp.rich_text?.map((t) => t.plain_text).join("") || "";
}

/**
 * Date 속성에서 날짜 문자열을 추출합니다.
 *
 * @param prop - 노션 속성
 * @returns ISO 8601 형식의 날짜 문자열, 없으면 빈 문자열
 */
export function extractDate(prop: NotionPropertyValue | undefined): string {
  if (!prop || prop.type !== "date") return "";
  const dateProp = prop as { type: "date"; date: { start: string } | null };
  return dateProp.date?.start || "";
}

/**
 * Select 속성에서 선택된 값을 추출합니다.
 *
 * @param prop - 노션 속성
 * @returns 선택된 값, 없으면 null
 */
export function extractSelect<T extends string>(prop: NotionPropertyValue | undefined): T | null {
  if (!prop || prop.type !== "select") return null;
  const selectProp = prop as { type: "select"; select: { name: string } | null };
  return (selectProp.select?.name as T) || null;
}

/**
 * Number 속성에서 숫자를 추출합니다.
 *
 * @param prop - 노션 속성
 * @returns 추출된 숫자, 없으면 0
 */
export function extractNumber(prop: NotionPropertyValue | undefined): number {
  if (!prop) return 0;

  // number 타입
  if (prop.type === "number") {
    const numberProp = prop as { type: "number"; number: number | null };
    return numberProp.number ?? 0;
  }

  // formula 타입 (number 결과)
  if (prop.type === "formula") {
    const formulaProp = prop as { type: "formula"; formula: { type: string; number?: number | null } };
    if (formulaProp.formula.type === "number") {
      return formulaProp.formula.number ?? 0;
    }
  }

  // rollup 타입 (number 결과)
  if (prop.type === "rollup") {
    const rollupProp = prop as { type: "rollup"; rollup: { type: string; number?: number | null } };
    if (rollupProp.rollup.type === "number") {
      return rollupProp.rollup.number ?? 0;
    }
  }

  return 0;
}

/**
 * Relation 속성에서 연결된 페이지 ID 목록을 추출합니다.
 *
 * @param prop - 노션 속성
 * @returns 연결된 페이지 ID 배열
 */
export function extractRelationIds(prop: NotionPropertyValue | undefined): string[] {
  if (!prop || prop.type !== "relation") return [];
  const relationProp = prop as { type: "relation"; relation: Array<{ id: string }> };
  return relationProp.relation?.map((item) => item.id) || [];
}

/**
 * 노션 상태값을 앱 상태값으로 변환합니다.
 *
 * @param notionStatus - 노션 DB의 한글 상태값
 * @returns 앱에서 사용하는 영어 상태값
 */
export function mapNotionStatus(notionStatus: RawNotionQuoteStatus | null): QuoteStatus {
  if (!notionStatus || !(notionStatus in NOTION_STATUS_MAP)) {
    return "pending"; // 기본값
  }
  return NOTION_STATUS_MAP[notionStatus as NotionQuoteStatus];
}

/**
 * 노션 Item 페이지를 QuoteItem으로 변환합니다.
 *
 * @param itemPage - 노션 Item 페이지
 * @returns 변환된 QuoteItem
 */
export function mapNotionItem(itemPage: NotionItemPage): QuoteItem {
  const props = itemPage.properties;

  const name = extractTitle(props["항목명"]);
  const unitPrice = extractNumber(props["단가"]);
  const quantity = extractNumber(props["수량"]);
  const amount = props["금액"] ? extractNumber(props["금액"]) : unitPrice * quantity;

  return {
    id: itemPage.id,
    name,
    quantity,
    unitPrice,
    amount,
  };
}

/**
 * 노션 Invoice 페이지를 QuoteData로 변환합니다.
 *
 * @param invoicePage - 노션 Invoice 페이지
 * @param items - 변환된 품목 목록
 * @param sender - 발신자 정보 (환경변수에서 로드)
 * @returns 변환된 QuoteData
 */
export function mapNotionInvoice(
  invoicePage: NotionInvoicePage,
  items: QuoteItem[],
  sender?: SenderInfo
): QuoteData {
  const props = invoicePage.properties;

  // 기본 정보 추출
  const quoteNumber = extractTitle(props["견적서 번호"]);
  const createdAt = extractDate(props["발행일"]) || new Date().toISOString();
  const validUntil = extractDate(props["유효기간"]);
  const clientName = extractPlainText(props["클라이언트명"]);
  const notionStatus = extractSelect<RawNotionQuoteStatus>(props["상태"]);
  const status = mapNotionStatus(notionStatus);

  // 금액 계산
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxRate = 0.1; // 10% 부가세
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;

  // 수신자 정보 구성 (클라이언트명만 사용)
  const receiver: ReceiverInfo = {
    companyName: clientName || "미지정",
  };

  // 발신자 정보
  const senderInfo = sender || getSenderInfo();

  return {
    id: invoicePage.id,
    quoteNumber,
    title: `견적서 - ${quoteNumber}`,
    sender: senderInfo,
    receiver,
    items,
    subtotal,
    taxRate,
    tax,
    total,
    validUntil: validUntil || undefined,
    createdAt,
    updatedAt: invoicePage.last_edited_time || createdAt,
    status,
  };
}

/**
 * 노션 Invoice 페이지를 QuoteListItem으로 변환합니다.
 * 목록 조회용 간략한 정보만 추출합니다.
 *
 * @param invoicePage - 노션 Invoice 페이지
 * @param calculatedTotal - 항목에서 계산된 총액 (선택적)
 * @returns 변환된 QuoteListItem
 */
export function mapNotionInvoiceToListItem(
  invoicePage: NotionInvoicePage,
  calculatedTotal?: number
): QuoteListItem {
  const props = invoicePage.properties;

  const quoteNumber = extractTitle(props["견적서 번호"]);
  const createdAt = extractDate(props["발행일"]) || invoicePage.created_time;
  const clientName = extractPlainText(props["클라이언트명"]);

  // 상태 필드가 status 타입인 경우 처리
  const statusProp = props["상태"];
  let status: QuoteStatus = "pending";
  if (statusProp?.type === "status") {
    const statusValue = (statusProp as { type: "status"; status: { name: string } | null }).status?.name;
    status = mapNotionStatus(statusValue as RawNotionQuoteStatus);
  } else {
    const notionStatus = extractSelect<RawNotionQuoteStatus>(props["상태"]);
    status = mapNotionStatus(notionStatus);
  }

  // 총액: 계산된 값 > 노션 DB 값 > 0
  const dbTotal = extractNumber(props["총 금액"]) || extractNumber(props["총액"]) || extractNumber(props["합계"]) || 0;
  const total = calculatedTotal !== undefined ? calculatedTotal : dbTotal;

  return {
    id: invoicePage.id,
    quoteNumber,
    title: `견적서 - ${quoteNumber}`,
    customerName: clientName || "미지정",
    status,
    total,
    createdAt,
    updatedAt: invoicePage.last_edited_time || createdAt,
  };
}

/**
 * 노션 Invoice 페이지에서 관계된 항목 ID를 추출합니다.
 */
export function extractItemIdsFromInvoice(invoicePage: NotionInvoicePage): string[] {
  return extractRelationIds(invoicePage.properties["항목"]);
}
