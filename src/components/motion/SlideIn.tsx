"use client";

import { motion, type Variants } from "framer-motion";

interface SlideInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "left" | "right" | "up" | "down";
  distance?: number;
}

// 슬라이드인 애니메이션 래퍼 컴포넌트
export function SlideIn({
  children,
  className,
  delay = 0,
  duration = 0.4,
  direction = "left",
  distance = 100,
}: SlideInProps) {
  // 방향에 따른 초기 위치 계산
  const getInitialPosition = () => {
    switch (direction) {
      case "left":
        return { x: -distance };
      case "right":
        return { x: distance };
      case "up":
        return { y: -distance };
      case "down":
        return { y: distance };
    }
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
    exit: {
      opacity: 0,
      ...getInitialPosition(),
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
