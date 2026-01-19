/**
 * QuoteHeader 컴포넌트 테스트
 */

import { render, screen } from "@testing-library/react";
import { QuoteHeader } from "../QuoteHeader";

describe("QuoteHeader", () => {
  const defaultProps = {
    quoteNumber: "Q-2024-001",
    title: "웹사이트 개발 견적서",
    status: "pending" as const,
  };

  describe("기본 렌더링", () => {
    it("제목을 렌더링해야 함", () => {
      render(<QuoteHeader {...defaultProps} />);
      expect(
        screen.getByRole("heading", { name: defaultProps.title })
      ).toBeInTheDocument();
    });

    it("견적번호를 렌더링해야 함", () => {
      render(<QuoteHeader {...defaultProps} />);
      expect(screen.getByText(defaultProps.quoteNumber)).toBeInTheDocument();
    });

    it("상태 배지를 렌더링해야 함", () => {
      render(<QuoteHeader {...defaultProps} />);
      expect(screen.getByText("대기")).toBeInTheDocument();
    });

    it("견적서 아이콘을 렌더링해야 함", () => {
      const { container } = render(<QuoteHeader {...defaultProps} />);
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("props 전달", () => {
    it("다양한 견적번호를 렌더링해야 함", () => {
      const customProps = { ...defaultProps, quoteNumber: "Q-2025-999" };
      render(<QuoteHeader {...customProps} />);
      expect(screen.getByText("Q-2025-999")).toBeInTheDocument();
    });

    it("긴 제목을 렌더링해야 함", () => {
      const longTitle = "매우 긴 제목의 웹사이트 개발 및 유지보수 서비스 견적서";
      const customProps = { ...defaultProps, title: longTitle };
      render(<QuoteHeader {...customProps} />);
      expect(screen.getByRole("heading", { name: longTitle })).toBeInTheDocument();
    });

    it("approved 상태를 표시해야 함", () => {
      const customProps = { ...defaultProps, status: "approved" as const };
      render(<QuoteHeader {...customProps} />);
      expect(screen.getByText("승인")).toBeInTheDocument();
    });

    it("rejected 상태를 표시해야 함", () => {
      const customProps = { ...defaultProps, status: "rejected" as const };
      render(<QuoteHeader {...customProps} />);
      expect(screen.getByText("거절")).toBeInTheDocument();
    });
  });

  describe("구조 확인", () => {
    it("h1 태그를 사용해야 함", () => {
      render(<QuoteHeader {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H1");
    });

    it("견적번호가 p 태그에 있어야 함", () => {
      const { container } = render(<QuoteHeader {...defaultProps} />);
      const quoteNumberElement = container.querySelector("p");
      expect(quoteNumberElement).toHaveTextContent(defaultProps.quoteNumber);
    });
  });
});
