"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";

// 404 페이지
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Container className="text-center">
        {/* 404 애니메이션 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* 404 숫자 */}
          <motion.div
            className="relative inline-block"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-[10rem] font-bold leading-none tracking-tighter text-primary/10 md:text-[14rem]">
              404
            </span>

            {/* 검색 아이콘 오버레이 */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Search className="h-24 w-24 text-primary md:h-32 md:w-32" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 메시지 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
            <br />
            주소를 다시 확인해 주세요.
          </p>
        </motion.div>

        {/* 액션 버튼 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              홈으로 가기
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            이전 페이지
          </Button>
        </motion.div>
      </Container>
    </div>
  );
}
