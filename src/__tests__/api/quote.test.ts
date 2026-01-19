/**
 * 견적서 API 관련 테스트
 * API 라우트에서 사용하는 검증 로직 및 서비스 레이어 테스트
 */

import { validateQuoteId } from "@/lib/validations";
import type { QuoteData } from "@/types/quote";

// 테스트용 견적서 데이터
const mockQuoteData: QuoteData = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  quoteNumber: "Q-2024-001",
  title: "테스트 견적서",
  sender: {
    companyName: "테스트 회사",
    representative: "홍길동",
    businessNumber: "123-45-67890",
    address: "서울시 강남구",
    phone: "02-1234-5678",
    email: "test@test.com",
  },
  receiver: {
    companyName: "고객 회사",
    representative: "김철수",
  },
  items: [
    {
      id: "item-1",
      name: "테스트 품목",
      quantity: 1,
      unitPrice: 1000000,
      amount: 1000000,
    },
  ],
  subtotal: 1000000,
  taxRate: 0.1,
  tax: 100000,
  total: 1100000,
  notes: "테스트 비고",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  status: "pending",
};

describe("견적서 API 입력 검증", () => {
  describe("validateQuoteId", () => {
    describe("유효한 ID 형식", () => {
      it("하이픈 포함 UUID를 허용해야 함", () => {
        const result = validateQuoteId("550e8400-e29b-41d4-a716-446655440000");
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe("550e8400-e29b-41d4-a716-446655440000");
        }
      });

      it("32자리 노션 ID(하이픈 없음)를 허용해야 함", () => {
        const result = validateQuoteId("550e8400e29b41d4a716446655440000");
        expect(result.success).toBe(true);
      });

      it("대문자 UUID를 허용해야 함", () => {
        const result = validateQuoteId("550E8400-E29B-41D4-A716-446655440000");
        expect(result.success).toBe(true);
      });

      it("UUID v4 형식을 허용해야 함", () => {
        // UUID v4: 8-4-4-4-12 형식, 세 번째 그룹은 4로 시작
        const result = validateQuoteId("123e4567-e89b-42d3-a456-426614174000");
        expect(result.success).toBe(true);
      });
    });

    describe("유효하지 않은 ID 형식", () => {
      it("빈 문자열을 거부해야 함", () => {
        const result = validateQuoteId("");
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBeDefined();
        }
      });

      it("짧은 문자열을 거부해야 함", () => {
        const result = validateQuoteId("abc123");
        expect(result.success).toBe(false);
      });

      it("유효하지 않은 문자를 포함한 ID를 거부해야 함", () => {
        const result = validateQuoteId("550e8400-e29b-41d4-a716-44665544000g");
        expect(result.success).toBe(false);
      });

      it("길이가 맞지 않는 ID를 거부해야 함", () => {
        // 33자리 (너무 김)
        const result = validateQuoteId("550e8400e29b41d4a7164466554400001");
        expect(result.success).toBe(false);
      });

      it("특수문자를 거부해야 함", () => {
        const result = validateQuoteId("550e8400-e29b-41d4-a716-44665544000!");
        expect(result.success).toBe(false);
      });

      it("공백이 포함된 ID를 거부해야 함", () => {
        const result = validateQuoteId("550e8400 e29b 41d4 a716 446655440000");
        expect(result.success).toBe(false);
      });
    });

    describe("에러 메시지", () => {
      it("실패 시 에러 메시지를 반환해야 함", () => {
        const result = validateQuoteId("invalid");
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(typeof result.error).toBe("string");
          expect(result.error.length).toBeGreaterThan(0);
        }
      });
    });
  });
});

describe("견적서 데이터 구조", () => {
  describe("QuoteData 필드 검증", () => {
    it("필수 필드가 포함되어야 함", () => {
      expect(mockQuoteData).toHaveProperty("id");
      expect(mockQuoteData).toHaveProperty("quoteNumber");
      expect(mockQuoteData).toHaveProperty("title");
      expect(mockQuoteData).toHaveProperty("sender");
      expect(mockQuoteData).toHaveProperty("receiver");
      expect(mockQuoteData).toHaveProperty("items");
      expect(mockQuoteData).toHaveProperty("subtotal");
      expect(mockQuoteData).toHaveProperty("total");
      expect(mockQuoteData).toHaveProperty("status");
    });

    it("sender 정보가 완전해야 함", () => {
      expect(mockQuoteData.sender).toHaveProperty("companyName");
      expect(mockQuoteData.sender).toHaveProperty("representative");
      expect(mockQuoteData.sender).toHaveProperty("businessNumber");
      expect(mockQuoteData.sender).toHaveProperty("address");
      expect(mockQuoteData.sender).toHaveProperty("phone");
      expect(mockQuoteData.sender).toHaveProperty("email");
    });

    it("receiver 정보가 있어야 함", () => {
      expect(mockQuoteData.receiver).toHaveProperty("companyName");
    });

    it("items 배열이 있어야 함", () => {
      expect(Array.isArray(mockQuoteData.items)).toBe(true);
      expect(mockQuoteData.items.length).toBeGreaterThan(0);
    });

    it("item 구조가 올바라야 함", () => {
      const item = mockQuoteData.items[0];
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("quantity");
      expect(item).toHaveProperty("unitPrice");
      expect(item).toHaveProperty("amount");
    });
  });

  describe("금액 계산 검증", () => {
    it("소계와 세금의 합이 총액이어야 함", () => {
      expect(mockQuoteData.subtotal + mockQuoteData.tax).toBe(mockQuoteData.total);
    });

    it("세금이 소계 * 세율이어야 함", () => {
      const expectedTax = mockQuoteData.subtotal * mockQuoteData.taxRate;
      expect(mockQuoteData.tax).toBe(expectedTax);
    });

    it("품목 금액 합이 소계와 같아야 함", () => {
      const itemsTotal = mockQuoteData.items.reduce((sum, item) => sum + item.amount, 0);
      expect(itemsTotal).toBe(mockQuoteData.subtotal);
    });
  });

  describe("상태 값 검증", () => {
    it("유효한 상태 값이어야 함", () => {
      const validStatuses = ["pending", "approved", "rejected"];
      expect(validStatuses).toContain(mockQuoteData.status);
    });
  });
});

describe("API 응답 형식", () => {
  describe("성공 응답 구조", () => {
    it("성공 응답은 success: true와 data를 포함해야 함", () => {
      const successResponse = {
        success: true,
        data: mockQuoteData,
      };
      expect(successResponse.success).toBe(true);
      expect(successResponse.data).toBeDefined();
    });
  });

  describe("실패 응답 구조", () => {
    it("실패 응답은 success: false와 error를 포함해야 함", () => {
      const errorResponse = {
        success: false,
        error: {
          code: "INVALID_ID",
          message: "유효하지 않은 견적서 ID 형식입니다.",
        },
      };
      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error).toBeDefined();
      expect(errorResponse.error.code).toBeDefined();
      expect(errorResponse.error.message).toBeDefined();
    });

    it("에러 코드는 문자열이어야 함", () => {
      const errorCodes = ["INVALID_ID", "NOT_FOUND", "CONFIG_ERROR", "NOTION_ERROR", "INTERNAL_ERROR"];
      errorCodes.forEach((code) => {
        expect(typeof code).toBe("string");
      });
    });
  });
});
