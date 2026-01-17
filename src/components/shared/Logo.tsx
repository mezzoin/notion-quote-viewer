"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/constants";

interface LogoProps {
  className?: string;
}

// 로고 컴포넌트 (애니메이션 적용)
export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={className}>
      <motion.div
        className="flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* 로고 아이콘 */}
        <motion.div
          className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg"
          whileHover={{
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.5 },
          }}
        >
          <Sparkles className="h-5 w-5" />
          {/* 장식용 그라디언트 블러 */}
          <div className="absolute -inset-1 -z-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 blur-md" />
        </motion.div>

        {/* 로고 텍스트 */}
        <span className="text-lg font-bold tracking-tight">
          {siteConfig.name}
        </span>
      </motion.div>
    </Link>
  );
}
