import { createClient } from "@/lib/supabase";
import { searchFilter, productFromRow } from "@/lib/format";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim().slice(0, 100);
  if (!q || q.length < 2) return Response.json({ products: [] });

  const db = createClient();
  if (!db) return Response.json({ products: [] });

  try {
    const { data, error } = await db
      .from("products")
      .select("*")
      .or(searchFilter(q))
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) return Response.json({ products: [] });
    return Response.json({ products: (data || []).map(productFromRow) });
  } catch {
    return Response.json({ products: [] });
  }
}
