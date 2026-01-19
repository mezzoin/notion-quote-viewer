/**
 * QuoteStatusBadge 컴포넌트 테스트
 */

import { render, screen } from "@testing-library/react";
import { QuoteStatusBadge } from "../QuoteStatusBadge";
import type { QuoteStatus } from "@/types/quote";

describe("QuoteStatusBadge", () => {
  describe("상태별 렌더링", () => {
    it("pending 상태를 '대기'로 렌더링해야 함", () => {
      render(<QuoteStatusBadge status="pending" />);
      expect(screen.getByText("대기")).toBeInTheDocument();
    });

    it("approved 상태를 '승인'으로 렌더링해야 함", () => {
      render(<QuoteStatusBadge status="approved" />);
      expect(screen.getByText("승인")).toBeInTheDocument();
    });

    it("rejected 상태를 '거절'로 렌더링해야 함", () => {
      render(<QuoteStatusBadge status="rejected" />);
      expect(screen.getByText("거절")).toBeInTheDocument();
    });
  });

  describe("CSS 클래스 적용", () => {
    it("pending 상태에 outline variant를 적용해야 함", () => {
      const { container } = render(<QuoteStatusBadge status="pending" />);
      const badge = container.querySelector("[data-slot='badge']");
      expect(badge).toBeInTheDocument();
    });

    it("approved 상태에 green 스타일을 적용해야 함", () => {
      const { container } = render(<QuoteStatusBadge status="approved" />);
      const badge = container.querySelector("[data-slot='badge']");
      expect(badge).toHaveClass("bg-green-600");
    });

    it("rejected 상태에 destructive variant를 적용해야 함", () => {
      const { container } = render(<QuoteStatusBadge status="rejected" />);
      const badge = container.querySelector("[data-slot='badge']");
      expect(badge).toBeInTheDocument();
    });
  });

  describe("추가 클래스 적용", () => {
    it("className prop이 추가 스타일을 적용해야 함", () => {
      const { container } = render(
        <QuoteStatusBadge status="pending" className="custom-class" />
      );
      const badge = container.querySelector("[data-slot='badge']");
      expect(badge).toHaveClass("custom-class");
    });
  });

  describe("모든 상태 렌더링 확인", () => {
    const statuses: QuoteStatus[] = ["pending", "approved", "rejected"];
    const labels: Record<QuoteStatus, string> = {
      pending: "대기",
      approved: "승인",
      rejected: "거절",
    };

    statuses.forEach((status) => {
      it(`${status} 상태가 올바르게 렌더링되어야 함`, () => {
        render(<QuoteStatusBadge status={status} />);
        expect(screen.getByText(labels[status])).toBeInTheDocument();
      });
    });
  });
});
