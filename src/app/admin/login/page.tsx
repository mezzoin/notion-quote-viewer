/**
 * 관리자 로그인 페이지
 */

import { AdminLoginForm } from "@/components/admin/auth/AdminLoginForm";

export const metadata = {
  title: "관리자 로그인 | 노션 웹 견적서",
  description: "관리자 페이지에 접근하려면 로그인하세요.",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <AdminLoginForm />
    </div>
  );
}
