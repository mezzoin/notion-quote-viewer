/**
 * QuoteSummary 컴포넌트 테스트
 */

import { render, screen } from "@testing-library/react";
import { QuoteSummary } from "../QuoteSummary";

describe("QuoteSummary", () => {
  const defaultProps = {
    subtotal: 10000000,
    taxRate: 0.1,
    tax: 1000000,
    total: 11000000,
  };

  describe("기본 렌더링", () => {
    it("소계를 렌더링해야 함", () => {
      render(<QuoteSummary {...defaultProps} />);
      expect(screen.getByText("소계")).toBeInTheDocument();
      expect(screen.getByText("10,000,000원")).toBeInTheDocument();
    });

    it("부가세 라벨과 세율을 표시해야 함", () => {
      render(<QuoteSummary {...defaultProps} />);
      expect(screen.getByText("부가세 (10%)")).toBeInTheDocument();
    });

    it("부가세 금액을 렌더링해야 함", () => {
      render(<QuoteSummary {...defaultProps} />);
      expect(screen.getByText("1,000,000원")).toBeInTheDocument();
    });

    it("총액을 렌더링해야 함", () => {
      render(<QuoteSummary {...defaultProps} />);
      expect(screen.getByText("총액")).toBeInTheDocument();
      expect(screen.getByText("11,000,000원")).toBeInTheDocument();
    });
  });

  describe("금액 포맷팅", () => {
    it("천 단위 구분자를 포함해야 함", () => {
      render(<QuoteSummary {...defaultProps} />);
      const amounts = screen.getAllByText(/,/);
      expect(amounts.length).toBeGreaterThan(0);
    });

    it("'원' 단위를 포함해야 함", () => {
      render(<QuoteSummary {...defaultProps} />);
      const amounts = screen.getAllByText(/원$/);
      expect(amounts.length).toBe(3); // 소계, 부가세, 총액
    });
  });

  describe("세율 표시", () => {
    it("0% 세율을 표시해야 함", () => {
      const props = { ...defaultProps, taxRate: 0, tax: 0, total: 10000000 };
      render(<QuoteSummary {...props} />);
      expect(screen.getByText("부가세 (0%)")).toBeInTheDocument();
    });

    it("20% 세율을 표시해야 함", () => {
      const props = {
        ...defaultProps,
        taxRate: 0.2,
        tax: 2000000,
        total: 12000000,
      };
      render(<QuoteSummary {...props} />);
      expect(screen.getByText("부가세 (20%)")).toBeInTheDocument();
    });

    it("5% 세율을 표시해야 함", () => {
      const props = {
        ...defaultProps,
        taxRate: 0.05,
        tax: 500000,
        total: 10500000,
      };
      render(<QuoteSummary {...props} />);
      expect(screen.getByText("부가세 (5%)")).toBeInTheDocument();
    });
  });

  describe("다양한 금액 처리", () => {
    it("0원을 올바르게 표시해야 함", () => {
      const props = {
        subtotal: 0,
        taxRate: 0.1,
        tax: 0,
        total: 0,
      };
      render(<QuoteSummary {...props} />);
      const zeroAmounts = screen.getAllByText("0원");
      expect(zeroAmounts.length).toBe(3);
    });

    it("작은 금액을 올바르게 표시해야 함", () => {
      const props = {
        subtotal: 100,
        taxRate: 0.1,
        tax: 10,
        total: 110,
      };
      render(<QuoteSummary {...props} />);
      expect(screen.getByText("100원")).toBeInTheDocument();
      expect(screen.getByText("10원")).toBeInTheDocument();
      expect(screen.getByText("110원")).toBeInTheDocument();
    });

    it("큰 금액을 올바르게 표시해야 함", () => {
      const props = {
        subtotal: 999999999,
        taxRate: 0.1,
        tax: 99999999,
        total: 1099999998,
      };
      render(<QuoteSummary {...props} />);
      expect(screen.getByText("999,999,999원")).toBeInTheDocument();
    });
  });

  describe("총액 강조 표시", () => {
    it("총액 라벨에 font-semibold 클래스가 있어야 함", () => {
      render(<QuoteSummary {...defaultProps} />);
      const totalLabel = screen.getByText("총액");
      expect(totalLabel).toHaveClass("font-semibold");
    });

    it("총액 값에 강조 스타일이 있어야 함", () => {
      render(<QuoteSummary {...defaultProps} />);
      const totalValue = screen.getByText("11,000,000원");
      expect(totalValue).toHaveClass("text-lg", "font-bold", "text-primary");
    });
  });
});
