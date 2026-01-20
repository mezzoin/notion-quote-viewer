/**
 * 노션 API 서비스 함수
 * 견적서 데이터를 노션에서 조회하는 서비스 레이어입니다.
 */

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getNotionClient, ITEMS_DB_ID, INVOICES_DB_ID } from "./client";
import { mapNotionItem, mapNotionInvoice, extractRelationIds, mapNotionInvoiceToListItem, extractItemIdsFromInvoice } from "./mapper";

/**
 * 노션 API 키 (서비스 레벨에서 직접 사용)
 */
const NOTION_API_KEY = process.env.NOTION_API_KEY;

/**
 * 노션 API 버전
 */
const NOTION_VERSION = "2022-06-28";

/**
 * 노션 데이터베이스 쿼리 (fetch API 직접 사용)
 * Turbopack 컴파일 이슈로 SDK의 databases.query가 누락되어 직접 구현
 */
async function queryNotionDatabase(databaseId: string, body: Record<string, unknown>) {
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Notion API error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * 노션 페이지 조회 (fetch API 직접 사용)
 */
async function fetchNotionPage(pageId: string) {
  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

/**
 * 여러 항목 ID로 항목 데이터를 조회하고 총액을 계산합니다.
 * @param itemIds - 노션 페이지 ID 배열 (품목)
 * @returns 총액 (부가세 포함)
 */
async function calculateTotalFromItems(itemIds: string[]): Promise<number> {
  if (itemIds.length === 0) {
    return 0;
  }

  // 병렬로 품목 조회
  const pagePromises = itemIds.map((id) => fetchNotionPage(id));
  const pages = await Promise.all(pagePromises);

  let subtotal = 0;
  for (const page of pages) {
    if (page && "properties" in page) {
      const itemPage = page as unknown as NotionItemPage;
      const item = mapNotionItem(itemPage);
      subtotal += item.amount;
    }
  }

  // 부가세 10% 추가
  const taxRate = 0.1;
  const tax = Math.round(subtotal * taxRate);
  return subtotal + tax;
}
import type { NotionInvoicePage, NotionItemPage } from "@/types/notion-raw";
import type { QuoteData, QuoteItem, QuoteStatus } from "@/types/quote";
import type { QuoteListItem, QuoteListData, QuoteListFilters, PaginationParams, PaginationMeta } from "@/types/admin";

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

/**
 * 앱 상태를 노션 상태로 변환합니다.
 */
const APP_TO_NOTION_STATUS: Record<QuoteStatus, string> = {
  pending: "대기",
  approved: "승인",
  rejected: "거절",
};

/**
 * 견적서 목록을 조회합니다.
 * 필터링과 페이지네이션을 지원합니다.
 *
 * @param params - 페이지네이션 및 필터 파라미터
 * @returns 견적서 목록 데이터
 */
export async function getInvoiceList(
  params?: PaginationParams & QuoteListFilters
): Promise<QuoteListData> {
  const { page = 1, pageSize = 10, status, search } = params || {};

  if (!INVOICES_DB_ID) {
    throw new Error("NOTION_INVOICES_DB_ID가 설정되지 않았습니다.");
  }

  try {
    // 필터 조건 구성
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any[] = [];

    // 상태 필터 (노션 status 타입 사용)
    if (status) {
      filters.push({
        property: "상태",
        status: {
          equals: APP_TO_NOTION_STATUS[status],
        },
      });
    }

    // 검색 필터 (클라이언트명 또는 견적서 번호)
    if (search) {
      filters.push({
        or: [
          {
            property: "클라이언트명",
            rich_text: {
              contains: search,
            },
          },
          {
            property: "견적서 번호",
            title: {
              contains: search,
            },
          },
        ],
      });
    }

    // 노션 쿼리 파라미터
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryParams: any = {
      database_id: INVOICES_DB_ID,
      page_size: 100, // 노션 API 최대값
      sorts: [
        {
          property: "발행일",
          direction: "descending",
        },
      ],
    };

    // 필터가 있으면 추가
    if (filters.length === 1) {
      queryParams.filter = filters[0];
    } else if (filters.length > 1) {
      queryParams.filter = { and: filters };
    }

    // 노션 API 호출 (fetch API 직접 사용)
    const response = await queryNotionDatabase(INVOICES_DB_ID, {
      page_size: queryParams.page_size,
      sorts: queryParams.sorts,
      ...(queryParams.filter && { filter: queryParams.filter }),
    });

    // 견적서 페이지 필터링
    const invoicePages = response.results.filter(
      (page: unknown): page is PageObjectResponse =>
        typeof page === "object" && page !== null && "properties" in page
    ) as unknown as NotionInvoicePage[];

    // 각 견적서의 항목에서 총액 계산
    const allItems: QuoteListItem[] = await Promise.all(
      invoicePages.map(async (invoicePage) => {
        const itemIds = extractItemIdsFromInvoice(invoicePage);
        const calculatedTotal = await calculateTotalFromItems(itemIds);
        return mapNotionInvoiceToListItem(invoicePage, calculatedTotal);
      })
    );

    // 클라이언트 사이드 페이지네이션 (노션 API는 커서 기반이라 오프셋 계산 필요)
    const totalItems = allItems.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = allItems.slice(startIndex, endIndex);

    const pagination: PaginationMeta = {
      currentPage: page,
      pageSize,
      totalItems,
      totalPages,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
    };

    return {
      items: paginatedItems,
      pagination,
    };
  } catch (error) {
    console.error("견적서 목록 조회 실패:", error);
    throw error;
  }
}
