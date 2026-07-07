// supabase/functions/_shared/cors.ts
//
// Origin allow-list instead of '*'. Set the ALLOWED_ORIGINS secret to your
// real domain(s), comma-separated, e.g.:
//   supabase secrets set ALLOWED_ORIGINS=https://kodpiksel.com,https://www.kodpiksel.com
// Falls back to local dev origins if the secret isn't set.
const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') ?? 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

export function getCorsHeaders(origin: string | null) {
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}
