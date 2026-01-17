"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, RefreshCw, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";

// 에러 페이지 Props 타입
interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// main 그룹 에러 바운더리 페이지
export default function MainErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 에러 모니터링 서비스로 전송)
    console.error("페이지 에러:", error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center py-20">
      <Container className="text-center">
        {/* 에러 아이콘 애니메이션 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.div
            className="inline-flex items-center justify-center rounded-full bg-destructive/10 p-6"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </motion.div>
        </motion.div>

        {/* 에러 메시지 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">
            페이지를 불러올 수 없습니다
          </h1>
          <p className="mb-2 text-muted-foreground">
            이 페이지에서 문제가 발생했습니다.
            <br />
            다시 시도하거나 다른 페이지로 이동해 주세요.
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
          <Button
            variant="ghost"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            이전 페이지
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
