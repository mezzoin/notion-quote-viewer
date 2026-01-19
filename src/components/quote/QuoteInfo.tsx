/**
 * 견적서 발신자/수신자 정보 컴포넌트
 * 발신자(공급자)와 수신자(고객) 정보를 2컬럼 레이아웃으로 표시합니다.
 */

import { SenderInfo, ReceiverInfo } from "@/types/quote";

/**
 * QuoteInfo Props
 */
interface QuoteInfoProps {
  /** 발신자(공급자) 정보 */
  sender: SenderInfo;
  /** 수신자(고객) 정보 */
  receiver: ReceiverInfo;
}

/**
 * 정보 항목을 렌더링하는 내부 컴포넌트
 * 값이 있을 때만 렌더링합니다.
 */
function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

/**
 * 정보 카드 컴포넌트
 * 발신자 또는 수신자 정보를 카드 형태로 표시합니다.
 */
function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
        {title}
      </h3>
      <dl className="space-y-2">{children}</dl>
    </div>
  );
}

/**
 * QuoteInfo 컴포넌트
 *
 * 견적서의 발신자(공급자)와 수신자(고객) 정보를 표시합니다.
 * 데스크톱에서는 2컬럼, 모바일에서는 1컬럼으로 표시됩니다.
 *
 * @example
 * ```tsx
 * <QuoteInfo
 *   sender={{
 *     companyName: "주식회사 테크솔루션",
 *     representative: "김대표",
 *     businessNumber: "123-45-67890",
 *     address: "서울시 강남구",
 *     phone: "02-1234-5678",
 *     email: "contact@techsolution.co.kr"
 *   }}
 *   receiver={{
 *     companyName: "고객사",
 *     representative: "이담당"
 *   }}
 * />
 * ```
 */
export function QuoteInfo({ sender, receiver }: QuoteInfoProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* 발신자 정보 */}
      <InfoCard title="공급자 정보">
        <InfoRow label="회사명" value={sender.companyName} />
        <InfoRow label="대표자" value={sender.representative} />
        <InfoRow label="사업자등록번호" value={sender.businessNumber} />
        <InfoRow label="주소" value={sender.address} />
        <InfoRow label="연락처" value={sender.phone} />
        <InfoRow label="이메일" value={sender.email} />
      </InfoCard>

      {/* 수신자 정보 */}
      <InfoCard title="고객 정보">
        <InfoRow label="회사명/고객명" value={receiver.companyName} />
        <InfoRow label="담당자" value={receiver.representative} />
        <InfoRow label="주소" value={receiver.address} />
        <InfoRow label="연락처" value={receiver.phone} />
        <InfoRow label="이메일" value={receiver.email} />
      </InfoCard>
    </div>
  );
}
