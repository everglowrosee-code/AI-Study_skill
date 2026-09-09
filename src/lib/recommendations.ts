import "server-only";

export type ExhibitionSource = { label: string; url: string };

export type ExhibitionRecommendation = {
  id: number;
  batch_id: string;
  recommendation_rank: number;
  exhibition_title: string;
  venue_name: string;
  start_date: string;
  end_date: string;
  recommendation_reason: string;
  caution_notes: string | null;
  ticket_earlybird: string;
  sources: ExhibitionSource[];
  verified_at: string;
  created_at?: string;
};

type RecommendationResult =
  | { ok: true; data: ExhibitionRecommendation[] }
  | { ok: false; message: string };

const DEFAULT_SUPABASE_URL = "https://eltlflxjgqpviryijnrn.supabase.co";

export async function getRecommendations(): Promise<RecommendationResult> {
  const supabaseUrl = process.env.SUPABASE_URL ?? DEFAULT_SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!publishableKey) {
    return { ok: false, message: "SUPABASE_PUBLISHABLE_KEY 또는 SUPABASE_ANON_KEY 환경 변수가 필요합니다." };
  }

  const query = new URLSearchParams({ select: "*", order: "created_at.desc,recommendation_rank.asc" });

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/exhibition_recommendations?${query}`, {
      headers: { apikey: publishableKey, Authorization: `Bearer ${publishableKey}` },
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text();
      return { ok: false, message: `조회 API 오류 (${response.status}): ${detail}` };
    }

    return { ok: true, data: (await response.json()) as ExhibitionRecommendation[] };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "알 수 없는 연결 오류입니다." };
  }
}
