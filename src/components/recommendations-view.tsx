"use client";

import { useMemo, useState } from "react";
import type { ExhibitionRecommendation } from "@/lib/recommendations";

type Props = { recommendations: ExhibitionRecommendation[] };
type View = "home" | "archive" | "calendar";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

function parseDate(value: string, endOfDay = false) {
  return new Date(`${value}T${endOfDay ? "23:59:59" : "00:00:00"}+09:00`);
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric" })
    .format(parseDate(value));
}

function getStatus(item: ExhibitionRecommendation) {
  const today = new Date();
  if (today < parseDate(item.start_date)) return "예정";
  if (today > parseDate(item.end_date, true)) return "종료";
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

function CalendarView({ recommendations }: { recommendations: ExhibitionRecommendation[] }) {
  const now = new Date();
  const [month, setMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);
  const gridStart = new Date(monthStart);
  gridStart.setDate(1 - monthStart.getDay());
  const days = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
  const monthItems = recommendations.filter((item) =>
    parseDate(item.start_date) <= monthEnd && parseDate(item.end_date, true) >= monthStart,
  );

  return (
    <section className="calendar-section" aria-labelledby="calendar-title">
      <div className="calendar-heading">
        <div>
          <span>Exhibition calendar</span>
          <h2 id="calendar-title">{new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long" }).format(month)}</h2>
          <p>색이 표시된 날짜에는 관람 가능한 전시가 있어요.</p>
        </div>
        <div className="calendar-controls" aria-label="달력 월 이동">
          <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="이전 달">←</button>
          <button type="button" onClick={() => setMonth(new Date(now.getFullYear(), now.getMonth(), 1))}>오늘</button>
          <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="다음 달">→</button>
        </div>
      </div>

      <div className="calendar-summary"><strong>{monthItems.length}</strong><span>이번 달에 관람 가능한 전시</span></div>
      <div className="calendar" role="grid" aria-label={`${month.getFullYear()}년 ${month.getMonth() + 1}월 전시 달력`}>
        {weekdays.map((weekday) => <div className="calendar__weekday" role="columnheader" key={weekday}>{weekday}</div>)}
        {days.map((day) => {
          const key = dateKey(day);
          const items = recommendations.filter((item) => item.start_date <= key && item.end_date >= key);
          const isCurrentMonth = day.getMonth() === month.getMonth();
          return (
            <div className={`calendar__day${isCurrentMonth ? "" : " is-muted"}${key === dateKey(now) ? " is-today" : ""}`} role="gridcell" key={key}>
              <time dateTime={key}>{day.getDate()}</time>
              <div className="calendar__events">
                {items.slice(0, 2).map((item) => <span className="calendar__event" title={item.exhibition_title} key={item.id}>{item.exhibition_title}</span>)}
                {items.length > 2 && <small>+{items.length - 2}</small>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="calendar-list">
        {monthItems.length > 0 ? monthItems.map((item) => (
          <article key={item.id}>
            <span className="calendar-list__mark" aria-hidden="true" />
            <div><p>{item.venue_name}</p><h3>{item.exhibition_title}</h3></div>
            <time>{formatDate(item.start_date)} — {formatDate(item.end_date)}</time>
          </article>
        )) : <p className="no-results">이 달에 관람 가능한 전시가 없습니다.</p>}
      </div>
    </section>
  );
}

export function RecommendationsView({ recommendations }: Props) {
  const [view, setView] = useState<View>("home");
  const [query, setQuery] = useState("");
  const visibleRecommendations = useMemo(
    () => recommendations.filter((item) => !/^테스트 전시\s*\d*$/u.test(item.exhibition_title.trim())),
    [recommendations],
  );
  const batches = useMemo(() => {
    const grouped = new Map<string, ExhibitionRecommendation[]>();
    for (const item of visibleRecommendations) {
      const batch = grouped.get(item.batch_id) ?? [];
      batch.push(item);
      grouped.set(item.batch_id, batch);
    }
    return [...grouped.entries()];
  }, [visibleRecommendations]);

  const [latestBatch, ...pastBatches] = batches;
  const pastRecommendations = useMemo(() => {
    const seen = new Set<string>();
    return pastBatches.flatMap(([, items]) => items).filter((item) => {
      const key = `${item.exhibition_title.trim().toLocaleLowerCase("ko")}|${item.venue_name.trim().toLocaleLowerCase("ko")}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 10);
  }, [pastBatches]);
  const uniqueRecommendations = useMemo(() => {
    const seen = new Set<string>();
    return visibleRecommendations.filter((item) => {
      const key = `${item.exhibition_title}|${item.venue_name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [visibleRecommendations]);
  const normalizedQuery = query.trim().toLocaleLowerCase("ko");
  const filteredPast = pastRecommendations.filter((item) =>
    [item.exhibition_title, item.venue_name, item.recommendation_reason]
      .join(" ").toLocaleLowerCase("ko").includes(normalizedQuery),
  );

  if (!latestBatch) {
    return <section className="state-card"><span className="state-card__label">아직 추천이 없습니다</span><h2>첫 전시 기록을 기다리고 있어요.</h2></section>;
  }

  const tabs: { id: View; label: string; count?: number }[] = [
    { id: "home", label: "홈" },
    { id: "archive", label: "지난 전시", count: pastRecommendations.length },
    { id: "calendar", label: "전시 달력" },
  ];

  return (
    <>
      <nav className="view-nav" aria-label="전시 기록 메뉴">
        <span className="view-nav__brand"><i aria-hidden="true" /> Exhibition notes</span>
        <div className="view-nav__tabs">
          {tabs.map((tab) => (
            <button type="button" className={view === tab.id ? "is-active" : ""} aria-current={view === tab.id ? "page" : undefined} onClick={() => setView(tab.id)} key={tab.id}>
              {tab.label}{typeof tab.count === "number" && <small>{tab.count}</small>}
            </button>
          ))}
        </div>
      </nav>

      {view === "home" && (
        <section className="current-section" aria-labelledby="current-title">
          <div className="section-heading">
            <div><span>Latest selection</span><h2 id="current-title">이번 주의 선택</h2></div>
            <p>{new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" }).format(new Date(latestBatch[1][0].verified_at))}에 확인했어요</p>
          </div>
          <div className="featured-grid">
            {latestBatch[1].map((item) => <ExhibitionCard key={item.id} item={item} featured />)}
          </div>
          {pastRecommendations.length > 0 && <button type="button" className="archive-shortcut" onClick={() => setView("archive")}>지난 전시 {pastRecommendations.length}개 모두 보기 <span>→</span></button>}
        </section>
      )}

      {view === "archive" && (
        <section className="archive-section archive-section--tab" aria-labelledby="archive-title">
          <div className="section-heading section-heading--archive">
            <div><span>Archive</span><h2 id="archive-title">지난 전시</h2><p className="section-description">이전에 추천한 전시를 한곳에 모았어요.</p></div>
            <label className="search">
              <span className="sr-only">지난 전시 검색</span>
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

      {view === "calendar" && <CalendarView recommendations={uniqueRecommendations} />}
    </>
  );
}
