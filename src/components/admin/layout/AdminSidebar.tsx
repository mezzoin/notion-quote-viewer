"use client";

/**
 * 관리자 사이드바 컴포넌트
 * 네비게이션 메뉴와 현재 위치 표시를 포함
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { adminNavItems } from "@/lib/constants";
import { FileText, Shield } from "lucide-react";

interface AdminSidebarContentProps {
  onNavigate?: () => void;
}

// 아이콘 매핑
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
};

export function AdminSidebarContent({ onNavigate }: AdminSidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* 로고 영역 */}
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/admin/quotes"
          className="flex items-center gap-2 font-semibold text-lg"
          onClick={onNavigate}
        >
          <Shield className="h-5 w-5 text-primary" />
          관리자
        </Link>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 space-y-1 p-4">
        {adminNavItems.map((item, index) => {
          const Icon = iconMap[item.icon] || FileText;
          const isActive = pathname === item.href;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-64 border-r bg-background lg:block">
      <AdminSidebarContent />
    </aside>
  );
}
