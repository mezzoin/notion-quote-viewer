"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";

// 에러 페이지 Props 타입
interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// 전역 에러 바운더리 페이지
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 에러 모니터링 서비스로 전송)
    console.error("애플리케이션 에러:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Container className="text-center">
        {/* 에러 아이콘 애니메이션 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
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
            {/* 배경 텍스트 */}
            <span className="text-[8rem] font-bold leading-none tracking-tighter text-destructive/10 md:text-[12rem]">
              Error
            </span>

            {/* 경고 아이콘 오버레이 */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <AlertTriangle className="h-20 w-20 text-destructive md:h-28 md:w-28" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 에러 메시지 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            문제가 발생했습니다
          </h1>
          <p className="mb-2 text-lg text-muted-foreground">
            예기치 않은 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>
          {error.digest && (
            <p className="mb-8 text-sm text-muted-foreground/60">
              오류 코드: {error.digest}
            </p>
          )}
        </motion.div>

        {/* 액션 버튼 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button size="lg" onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              홈으로 가기
            </Link>
          </Button>
        </motion.div>
      </Container>
    </div>
  );
}
