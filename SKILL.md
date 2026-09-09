---
name: seoul-art-exhibitions
description: Recommend and save two verified current or upcoming art exhibitions in Korea, especially Seoul, tailored to a reader who favors Impressionism and substantive fine art over Instagram-oriented immersive shows. Use when the user sends "[미술전시]", asks for Korean or Seoul exhibition recommendations, or wants current exhibition dates or early-bird ticket opportunities.
---

# Seoul Art Exhibitions

Curate exactly two worthwhile exhibitions that the user can currently visit or reasonably plan to visit. Center Seoul; include another Korean city only when its exhibition is unusually strong or the user asks beyond Seoul.

## Refresh live information

Browse on every invocation. Never answer from memory alone, because dates, closures, ticket inventory, and early-bird sales change.

Build a small candidate pool from current and announced exhibitions. Search broadly enough to compare institutions, galleries, art fairs, and credible independent venues rather than returning the first two results.

Before selecting finalists, call `list_recent_exhibition_recommendations` exactly once. Exclude every exhibition already present in the returned recommendation history, not only the immediately preceding pair. On every repeated request, present two exhibitions that have not previously been recommended. Reuse a prior exhibition only when the user explicitly asks for it again or when fewer than two verified worthwhile alternatives exist; in the latter case, explain the exhaustion before reusing anything.

For each finalist, verify all of the following:

- exact exhibition title, venue, city, opening date, and closing date;
- whether the show is open now or upcoming as of the current date;
- ticket price or reservation requirement when applicable;
- early-bird availability, sale period, eligible ticket type, and purchase link when an active offer exists.

Use the organizer, museum, gallery, artist estate, or official ticketing page as the primary source. Prefer a second independent or official source for the dates when available. Treat search snippets, listicles, social posts, and old press releases only as leads. If sources conflict, resolve the conflict through the venue or organizer; otherwise state the uncertainty and do not select that exhibition. Link directly to supporting pages near each recommendation.

Do not describe an early-bird offer as available merely because an old sales page exists. Confirm that the current date falls within its stated sales window and that the page still permits or explicitly announces purchase. If no active offer is found, say `얼리버드: 현재 확인되지 않음`; if a known offer expired, say so with the end date.

## Rank for this user

Apply these preferences in order:

1. Favor Impressionism, Post-Impressionism, related modern painting, and exhibitions with strong painterly, art-historical, or curatorial substance.
2. Also consider excellent modern and contemporary art, including Korean artists, when the work itself merits attention.
3. Penalize spectacle-first, selfie-oriented, projection-only, reproduction-only, or generic immersive shows—especially displays that substitute projections or replicas for historical artists' physical works.
4. Allow media art when the exhibiting artist has credible contemporary-art significance and the exhibition presents a substantive artistic practice, not merely a photogenic experience. Explain the exception plainly.
5. Prefer exhibitions with original works, a coherent curatorial thesis, meaningful loans or archival material, or a rare chance to see an important artist.
6. Consider practical value: travel within Seoul, remaining run time, booking difficulty, price, and active early-bird savings. Do not let an early-bird discount rescue a weak artistic match.

Do not force an Impressionist selection when none is genuinely available. Label any inferred preference match honestly. Avoid inventing claims about original works, artist stature, sold-out status, or discount availability.

## Answer format

Respond in Korean and lead with a one-sentence verdict. Present only two numbered recommendations, strongest match first. For each include:

- **전시명 · 장소**
- **기간:** exact `YYYY.MM.DD–YYYY.MM.DD`, plus `현재 전시 중` or `예정`
- **왜 추천하는지:** concrete fit with the user's taste and the exhibition's artistic substance
- **주의할 점:** media-art/reproduction content, short remaining run, reservation, closure day, or other material caveat
- **티켓/얼리버드:** current status, exact sale deadline and price or discount when verified, and a direct official purchase link when available
- **확인 출처:** direct official exhibition page and any corroborating source used

End with a compact `둘 중 하나만 고르면` choice. Use absolute dates, not only relative expressions such as “이번 주” or “곧 종료.” When `[미술전시]` is the entire prompt, do not ask follow-up questions; apply this saved taste profile and complete the current search.

## Save and publish

After both recommendations are final, call `save_exhibition_recommendations` exactly once with the same two records in ranked order. This database write is required on every invocation, including a bare `미술전시` request. The local exhibition webpage reads this database and displays the newly saved batch automatically.

Do not claim that the recommendations were saved or published unless the tool confirms success. If the save tool is unavailable or returns an error, still provide the recommendations, explicitly report that the database and webpage were not updated, and include the failure reason when available.
