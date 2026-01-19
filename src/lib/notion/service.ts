/**
 * 노션 API 서비스 함수
 * 견적서 데이터를 노션에서 조회하는 서비스 레이어입니다.
 */

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getNotionClient, ITEMS_DB_ID } from "./client";
import { mapNotionItem, mapNotionInvoice, extractRelationIds } from "./mapper";
import type { NotionInvoicePage, NotionItemPage } from "@/types/notion-raw";
import type { QuoteData, QuoteItem } from "@/types/quote";

/**
 * 견적서 ID로 노션에서 견적서를 조회합니다.
 *
 * @param invoiceId - 노션 페이지 ID (견적서)
 * @returns 견적서 데이터 또는 null
 * @throws {Error} 노션 API 호출 실패 시
 */
export async function getInvoiceById(invoiceId: string): Promise<QuoteData | null> {
  const notion = getNotionClient();

  try {
    // 1. 견적서 페이지 조회
    const page = await notion.pages.retrieve({ page_id: invoiceId });

    // 페이지가 삭제되었거나 아카이브된 경우
    if (!("properties" in page)) {
      return null;
    }

    const invoicePage = page as unknown as NotionInvoicePage;

    // 2. 연결된 품목 ID 추출
    const itemIds = extractRelationIds(invoicePage.properties["항목"]);

    // 3. 품목 데이터 조회
    const items = await getItemsByIds(itemIds);

    // 4. 데이터 변환 및 반환
    return mapNotionInvoice(invoicePage, items);
  } catch (error) {
    // 노션 API 에러 처리
    if (isNotionError(error) && error.code === "object_not_found") {
      return null;
    }
    throw error;
  }
}

/**
 * 여러 품목 ID로 품목 데이터를 조회합니다.
 *
 * @param itemIds - 노션 페이지 ID 배열 (품목)
 * @returns 품목 데이터 배열
 */
async function getItemsByIds(itemIds: string[]): Promise<QuoteItem[]> {
  if (itemIds.length === 0) {
    return [];
  }

  const notion = getNotionClient();
  const items: QuoteItem[] = [];

  // 병렬로 품목 조회
  const pagePromises = itemIds.map((id) =>
    notion.pages.retrieve({ page_id: id }).catch(() => null)
  );

  const pages = await Promise.all(pagePromises);

  for (const page of pages) {
    if (page && "properties" in page) {
      const itemPage = page as unknown as NotionItemPage;
      items.push(mapNotionItem(itemPage));
    }
  }

  return items;
}

/**
 * 견적서 ID로 연결된 품목 목록을 조회합니다.
 * (Relation 대신 필터를 사용하는 대안 방법)
 *
 * @param invoiceId - 노션 페이지 ID (견적서)
 * @returns 품목 데이터 배열
 */
export async function getItemsByInvoiceId(invoiceId: string): Promise<QuoteItem[]> {
  const notion = getNotionClient();

  if (!ITEMS_DB_ID) {
    console.warn("NOTION_ITEMS_DB_ID가 설정되지 않았습니다.");
    return [];
  }

  try {
    // 노션 SDK databases.query 사용
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion as any).databases.query({
      database_id: ITEMS_DB_ID,
      filter: {
        property: "Invoices",
        relation: {
          contains: invoiceId,
        },
      },
    });

    return response.results
      .filter((page: unknown): page is PageObjectResponse =>
        typeof page === "object" && page !== null && "properties" in page
      )
      .map((page: PageObjectResponse) => mapNotionItem(page as unknown as NotionItemPage));
  } catch (error) {
    console.error("품목 조회 실패:", error);
    return [];
  }
}

/**
 * 노션 API 에러인지 확인합니다.
 */
function isNotionError(error: unknown): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}
