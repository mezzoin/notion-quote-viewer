import { Container } from "@/components/shared/Container";

// 홈페이지
export default function HomePage() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            노션 기반 웹 견적서
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            노션 API를 활용한 웹 견적서 시스템
          </p>
        </div>
      </Container>
    </section>
  );
}
