"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { Navigation } from "./Navigation";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

// 헤더 컴포넌트 (스크롤 시 배경 전환)
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // 스크롤 위치에 따른 배경 투명도
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  // 스크롤 감지 (Framer Motion의 useMotionValueEvent 사용)
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300",
        isScrolled && "border-b"
      )}
    >
      {/* 스크롤 시 나타나는 배경 */}
      <motion.div
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        style={{ opacity: headerOpacity }}
      />

      <Container className="relative flex h-full items-center justify-between">
        {/* 로고 */}
        <Logo />

        {/* 데스크탑 네비게이션 */}
        <Navigation />

        {/* 우측 액션 버튼들 */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </Container>
    </motion.header>
  );
}
