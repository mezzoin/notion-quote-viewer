/**
 * Next.js Instrumentation
 * 서버 시작 시 Sentry를 초기화합니다.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Node.js 런타임 - 서버 사이드
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // Edge 런타임 - 미들웨어 등
    await import("../sentry.edge.config");
  }
}

// onRequestError hook - 요청 에러 캡처
export const onRequestError = async (
  error: Error,
  request: {
    path: string;
    method: string;
    headers: Record<string, string>;
  },
  context: {
    routerKind: "Pages Router" | "App Router";
    routePath: string;
    routeType: "render" | "route" | "action" | "middleware";
    revalidateReason?: "on-demand" | "stale" | undefined;
    renderSource?: "react-server-components" | "react-server-components-payload" | undefined;
  }
) => {
  const Sentry = await import("@sentry/nextjs");

  Sentry.captureException(error, {
    tags: {
      routerKind: context.routerKind,
      routePath: context.routePath,
      routeType: context.routeType,
    },
    extra: {
      path: request.path,
      method: request.method,
      revalidateReason: context.revalidateReason,
      renderSource: context.renderSource,
    },
  });
};
