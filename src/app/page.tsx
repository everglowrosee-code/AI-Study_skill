import { connection } from "next/server";
import { RecommendationsView } from "@/components/recommendations-view";
import { getRecommendations } from "@/lib/recommendations";

export default async function Home() {
  await connection();
  const result = await getRecommendations();

  return (
    <main>
      <section className="hero">
        <div className="hero__eyebrow">
          <span className="hero__dot" /> 서울 전시 큐레이션
        </div>
        <h1><span>오래 바라볼</span><em>두개의 전시</em></h1>
        <p className="hero__lede">
          작품성과 미술사적 맥락을 중심으로 고른 서울의 전시를 기록합니다.
          화려한 체험보다 오래 남는 작품을 먼저 소개합니다.
        </p>
      </section>

      {result.ok ? (
        <RecommendationsView recommendations={result.data.filter(
          (item) => !/^테스트 전시\s*\d*$/u.test(item.exhibition_title.trim()),
        )} />
      ) : (
        <section className="state-card" role="alert">
          <span className="state-card__label">데이터를 불러오지 못했습니다</span>
          <h2>Supabase 연결을 확인해 주세요.</h2>
          <p>{result.message}</p>
        </section>
      )}

      <footer>
        <span>Seoul Exhibition Notes</span>
        <span>작품을 보는 시간을 위한 기록</span>
      </footer>
    </main>
  );
}
