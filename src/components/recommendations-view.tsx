"use client";

import { useMemo, useState } from "react";
import type { ExhibitionRecommendation } from "@/lib/recommendations";

type Props = { recommendations: ExhibitionRecommendation[] };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric" })
    .format(new Date(`${value}T00:00:00+09:00`));
}

function getStatus(item: ExhibitionRecommendation) {
  const today = new Date();
  const start = new Date(`${item.start_date}T00:00:00+09:00`);
  const end = new Date(`${item.end_date}T23:59:59+09:00`);
  if (today < start) return "예정";
  if (today > end) return "종료";
  return "전시 중";
}

function ExhibitionCard({ item, featured = false }: { item: ExhibitionRecommendation; featured?: boolean }) {
  const status = getStatus(item);
  return (
    <article className={`exhibition-card${featured ? " exhibition-card--featured" : ""}`}>
      <div className="exhibition-card__topline">
        <span className="rank">0{item.recommendation_rank}</span>
        <span className={`status status--${status.replace(" ", "-")}`}>{status}</span>
      </div>
      <div className="exhibition-card__body">
        <p className="venue">{item.venue_name}</p>
        <h2>{item.exhibition_title}</h2>
        <p className="date-range">{formatDate(item.start_date)} — {formatDate(item.end_date)}</p>
        <p className="reason">{item.recommendation_reason}</p>
      </div>
      <div className="exhibition-card__details">
        <div><span>관람 안내</span><p>{item.ticket_earlybird}</p></div>
        {item.caution_notes && <div><span>알아두기</span><p>{item.caution_notes}</p></div>}
      </div>
      <div className="source-links">
        {item.sources?.map((source) => (
          <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
            {source.label}<span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </article>
  );
}

export function RecommendationsView({ recommendations }: Props) {
  const [query, setQuery] = useState("");
  const batches = useMemo(() => {
    const grouped = new Map<string, ExhibitionRecommendation[]>();
    for (const item of recommendations) {
      const batch = grouped.get(item.batch_id) ?? [];
      batch.push(item);
      grouped.set(item.batch_id, batch);
    }
    return [...grouped.entries()];
  }, [recommendations]);

  const [latestBatch, ...pastBatches] = batches;
  const pastRecommendations = pastBatches.flatMap(([, items]) => items);
  const normalizedQuery = query.trim().toLocaleLowerCase("ko");
  const filteredPast = pastRecommendations.filter((item) =>
    [item.exhibition_title, item.venue_name, item.recommendation_reason]
      .join(" ").toLocaleLowerCase("ko").includes(normalizedQuery),
  );

  if (!latestBatch) {
    return <section className="state-card"><span className="state-card__label">아직 추천이 없습니다</span><h2>첫 전시 기록을 기다리고 있어요.</h2></section>;
  }

  return (
    <>
      <section className="current-section" aria-labelledby="current-title">
        <div className="section-heading">
          <div><span>Latest selection</span><h2 id="current-title">이번 주의 선택</h2></div>
          <p>{new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" }).format(new Date(latestBatch[1][0].verified_at))}에 확인했어요</p>
        </div>
        <div className="featured-grid">
          {latestBatch[1].map((item) => <ExhibitionCard key={item.id} item={item} featured />)}
        </div>
      </section>

      {pastRecommendations.length > 0 && (
        <section className="archive-section" aria-labelledby="archive-title">
          <div className="section-heading section-heading--archive">
            <div><span>Archive</span><h2 id="archive-title">지난 추천</h2></div>
            <label className="search">
              <span className="sr-only">지난 추천 검색</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="전시명이나 장소 검색" />
              <span aria-hidden="true">⌕</span>
            </label>
          </div>
          <div className="archive-grid">
            {filteredPast.length > 0
              ? filteredPast.map((item) => <ExhibitionCard key={item.id} item={item} />)
              : <p className="no-results">검색 결과가 없습니다.</p>}
          </div>
        </section>
      )}
    </>
  );
}
