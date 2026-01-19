"use client";

/**
 * Framer Motion 최적화 Provider
 * LazyMotion을 사용하여 필요한 기능만 동적으로 로드합니다.
 * 이를 통해 초기 번들 크기를 줄일 수 있습니다.
 */

import { LazyMotion, domAnimation } from "framer-motion";

interface MotionProviderProps {
  children: React.ReactNode;
}

/**
 * MotionProvider
 *
 * Framer Motion의 LazyMotion을 사용하여 애니메이션 기능을 제공합니다.
 * domAnimation 기능만 로드하여 번들 크기를 최소화합니다.
 *
 * 포함된 기능:
 * - 기본 애니메이션 (opacity, transform 등)
 * - Variants
 * - Gestures (hover, tap, drag)
 *
 * 미포함 기능 (domMax 사용 시 포함):
 * - Layout animations
 * - SVG path animations
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
