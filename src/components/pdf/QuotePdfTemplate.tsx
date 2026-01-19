/**
 * 견적서 PDF 템플릿 컴포넌트
 * @react-pdf/renderer를 사용한 A4 규격 PDF 문서 템플릿
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { QuoteData } from "@/types/quote";

// 한글 폰트 등록 (Noto Sans KR)
Font.register({
  family: "NotoSansKR",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans@latest/Subset/SpoqaHanSansNeo/SpoqaHanSansNeo-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans@latest/Subset/SpoqaHanSansNeo/SpoqaHanSansNeo-Bold.ttf",
      fontWeight: 700,
    },
  ],
});

// 스타일 정의
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "NotoSansKR",
    fontSize: 10,
    color: "#333",
  },
  // 헤더
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#333",
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1a1a1a",
  },
  quoteNumber: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  status: {
    fontSize: 10,
    padding: "4 8",
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
    color: "#666",
  },
  // 정보 섹션
  infoSection: {
    flexDirection: "row",
    marginBottom: 25,
    gap: 20,
  },
  infoBox: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#333",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: 80,
    fontSize: 9,
    color: "#666",
  },
  infoValue: {
    flex: 1,
    fontSize: 9,
    color: "#333",
  },
  // 테이블
  tableSection: {
    marginBottom: 25,
  },
  tableTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 8,
  },
  tableRowLast: {
    flexDirection: "row",
    padding: 8,
  },
  colNo: { width: "8%", textAlign: "center" },
  colName: { width: "40%", textAlign: "left" },
  colQty: { width: "12%", textAlign: "right" },
  colPrice: { width: "20%", textAlign: "right" },
  colAmount: { width: "20%", textAlign: "right" },
  headerText: {
    fontSize: 9,
    fontWeight: 700,
    color: "#333",
  },
  cellText: {
    fontSize: 9,
    color: "#333",
  },
  // 금액 요약
  summarySection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 25,
  },
  summaryBox: {
    width: 200,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 9,
    color: "#666",
  },
  summaryValue: {
    fontSize: 9,
    color: "#333",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#333",
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1a73e8",
  },
  // 비고
  notesSection: {
    marginBottom: 25,
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 8,
  },
  notesBox: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
  },
  noteText: {
    fontSize: 9,
    color: "#666",
    marginBottom: 3,
  },
  // 푸터
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#999",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
});

/**
 * 금액 포맷팅 함수
 */
function formatCurrency(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

/**
 * 날짜 포맷팅 함수
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 상태 한글 변환
 */
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "대기",
    approved: "승인",
    rejected: "거절",
  };
  return labels[status] || status;
}

interface QuotePdfTemplateProps {
  quote: QuoteData;
}

/**
 * 견적서 PDF 문서 컴포넌트
 */
export function QuotePdfTemplate({ quote }: QuotePdfTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>견적서</Text>
            <Text style={styles.quoteNumber}>{quote.quoteNumber}</Text>
          </View>
          <View>
            <Text style={styles.status}>{getStatusLabel(quote.status)}</Text>
          </View>
        </View>

        {/* 공급자/수신자 정보 */}
        <View style={styles.infoSection}>
          {/* 공급자 정보 */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>공급자 정보</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>회사명</Text>
              <Text style={styles.infoValue}>{quote.sender.companyName}</Text>
            </View>
            {quote.sender.representative && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>대표자</Text>
                <Text style={styles.infoValue}>{quote.sender.representative}</Text>
              </View>
            )}
            {quote.sender.businessNumber && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>사업자번호</Text>
                <Text style={styles.infoValue}>{quote.sender.businessNumber}</Text>
              </View>
            )}
            {quote.sender.address && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>주소</Text>
                <Text style={styles.infoValue}>{quote.sender.address}</Text>
              </View>
            )}
            {quote.sender.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>연락처</Text>
                <Text style={styles.infoValue}>{quote.sender.phone}</Text>
              </View>
            )}
            {quote.sender.email && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>이메일</Text>
                <Text style={styles.infoValue}>{quote.sender.email}</Text>
              </View>
            )}
          </View>

          {/* 수신자 정보 */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>수신자 정보</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>회사명/고객명</Text>
              <Text style={styles.infoValue}>{quote.receiver.companyName}</Text>
            </View>
            {quote.receiver.representative && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>담당자</Text>
                <Text style={styles.infoValue}>{quote.receiver.representative}</Text>
              </View>
            )}
            {quote.receiver.address && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>주소</Text>
                <Text style={styles.infoValue}>{quote.receiver.address}</Text>
              </View>
            )}
            {quote.receiver.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>연락처</Text>
                <Text style={styles.infoValue}>{quote.receiver.phone}</Text>
              </View>
            )}
            {quote.receiver.email && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>이메일</Text>
                <Text style={styles.infoValue}>{quote.receiver.email}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 품목 테이블 */}
        <View style={styles.tableSection}>
          <Text style={styles.tableTitle}>품목 내역</Text>
          <View style={styles.table}>
            {/* 테이블 헤더 */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, styles.colNo]}>#</Text>
              <Text style={[styles.headerText, styles.colName]}>품목명</Text>
              <Text style={[styles.headerText, styles.colQty]}>수량</Text>
              <Text style={[styles.headerText, styles.colPrice]}>단가</Text>
              <Text style={[styles.headerText, styles.colAmount]}>금액</Text>
            </View>
            {/* 테이블 내용 */}
            {quote.items.map((item, index) => (
              <View
                key={item.id}
                style={index === quote.items.length - 1 ? styles.tableRowLast : styles.tableRow}
              >
                <Text style={[styles.cellText, styles.colNo]}>{index + 1}</Text>
                <Text style={[styles.cellText, styles.colName]}>{item.name}</Text>
                <Text style={[styles.cellText, styles.colQty]}>{item.quantity}</Text>
                <Text style={[styles.cellText, styles.colPrice]}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={[styles.cellText, styles.colAmount]}>{formatCurrency(item.amount)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 금액 요약 */}
        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>소계</Text>
              <Text style={styles.summaryValue}>{formatCurrency(quote.subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>부가세 ({(quote.taxRate * 100).toFixed(0)}%)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(quote.tax)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>총액</Text>
              <Text style={styles.totalValue}>{formatCurrency(quote.total)}</Text>
            </View>
          </View>
        </View>

        {/* 비고 */}
        {quote.notes && quote.notes.length > 0 && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>비고</Text>
            <View style={styles.notesBox}>
              {quote.notes.split("\n").filter(Boolean).map((note, index) => (
                <Text key={index} style={styles.noteText}>• {note}</Text>
              ))}
            </View>
          </View>
        )}

        {/* 푸터 */}
        <View style={styles.footer}>
          <Text>
            발행일: {formatDate(quote.createdAt)}
            {quote.validUntil && ` | 유효기간: ${formatDate(quote.validUntil)}`}
          </Text>
          <Text style={{ marginTop: 3 }}>
            본 견적서는 {quote.sender.companyName}에서 발행되었습니다.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default QuotePdfTemplate;
