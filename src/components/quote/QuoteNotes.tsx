/**
 * 견적서 비고 사항 컴포넌트
 * 견적서의 비고/참고 사항을 표시합니다.
 * notes가 없으면 렌더링하지 않습니다.
 */

/**
 * QuoteNotes Props
 */
interface QuoteNotesProps {
  /** 비고 내용 (선택) */
  notes?: string;
}

/**
 * QuoteNotes 컴포넌트
 *
 * 견적서의 비고 사항을 표시합니다.
 * 줄바꿈 기준으로 각 줄을 불릿 포인트와 함께 표시합니다.
 *
 * @example
 * ```tsx
 * <QuoteNotes notes="결제 조건: 계약금 50%, 잔금 50%\n유효기간: 견적일로부터 30일" />
 * ```
 */
export function QuoteNotes({ notes }: QuoteNotesProps) {
  // notes가 없거나 빈 문자열이면 렌더링하지 않음
  if (!notes || notes.trim() === "") {
    return null;
  }

  // 줄바꿈 기준으로 분리
  const lines = notes.split("\n").filter((line) => line.trim() !== "");

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground">비고</h3>
      <div className="rounded-lg bg-muted/50 p-4">
        <ul className="space-y-1.5 text-sm">
          {lines.map((line, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-1 text-muted-foreground">•</span>
              <span>{line.trim()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
