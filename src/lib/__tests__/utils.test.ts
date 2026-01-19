/**
 * 유틸리티 함수 테스트
 * src/lib/utils.ts의 함수들을 테스트합니다.
 */

import { cn, isValidUUID, formatCurrency } from "@/lib/utils";

describe("cn (className 병합)", () => {
  it("여러 클래스를 병합해야 함", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("조건부 클래스를 처리해야 함", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("Tailwind 클래스 충돌을 해결해야 함", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("빈 입력을 처리해야 함", () => {
    expect(cn()).toBe("");
    expect(cn("", null, undefined)).toBe("");
  });
});

describe("isValidUUID (ID 형식 검증)", () => {
  describe("유효한 ID", () => {
    it("하이픈 포함 UUID를 허용해야 함", () => {
      expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
      expect(isValidUUID("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    });

    it("32자리 hex (노션 ID)를 허용해야 함", () => {
      expect(isValidUUID("550e8400e29b41d4a716446655440000")).toBe(true);
      expect(isValidUUID("123e4567e89b12d3a456426614174000")).toBe(true);
    });

    it("대소문자를 구분하지 않아야 함", () => {
      expect(isValidUUID("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
      expect(isValidUUID("550e8400E29B41d4A716446655440000")).toBe(true);
    });
  });

  describe("유효하지 않은 ID", () => {
    it("빈 문자열을 거부해야 함", () => {
      expect(isValidUUID("")).toBe(false);
    });

    it("잘못된 길이를 거부해야 함", () => {
      expect(isValidUUID("550e8400")).toBe(false);
      expect(isValidUUID("550e8400-e29b-41d4-a716")).toBe(false);
    });

    it("유효하지 않은 문자를 거부해야 함", () => {
      expect(isValidUUID("550e8400-e29b-41d4-a716-44665544000g")).toBe(false);
      expect(isValidUUID("not-a-valid-uuid-format-here!!")).toBe(false);
    });
  });
});

describe("formatCurrency (금액 포맷팅)", () => {
  it("양수를 올바르게 포맷팅해야 함", () => {
    expect(formatCurrency(1000)).toBe("1,000원");
    expect(formatCurrency(1000000)).toBe("1,000,000원");
    expect(formatCurrency(12345678)).toBe("12,345,678원");
  });

  it("0을 올바르게 포맷팅해야 함", () => {
    expect(formatCurrency(0)).toBe("0원");
  });

  it("음수를 올바르게 포맷팅해야 함", () => {
    expect(formatCurrency(-5000)).toBe("-5,000원");
    expect(formatCurrency(-1000000)).toBe("-1,000,000원");
  });

  it("소수점이 있는 숫자를 처리해야 함", () => {
    // 한국 원화는 일반적으로 정수만 사용하지만, 소수점 입력도 처리
    expect(formatCurrency(1000.5)).toBe("1,000.5원");
  });
});
