import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * 관리자 레이아웃
 * 헤더와 사이드바가 포함된 관리자 전용 레이아웃
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 pt-20 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
