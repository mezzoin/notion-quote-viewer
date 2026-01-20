"use client";

/**
 * 관리자 헤더 컴포넌트
 * 로고, 모바일 메뉴, 테마 토글, 로그아웃 버튼을 포함
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Shield } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebarContent } from "./AdminSidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function AdminHeader() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      // 에러 무시, 로그인 페이지로 이동
      router.push("/admin/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* 모바일 메뉴 버튼 */}
        <div className="flex items-center gap-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <AdminSidebarContent onNavigate={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link href="/admin/quotes" className="flex items-center gap-2 font-semibold">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-lg">관리자</span>
          </Link>
        </div>

        {/* 우측 액션 버튼들 */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
          </Button>
        </div>
      </div>
    </header>
  );
}
