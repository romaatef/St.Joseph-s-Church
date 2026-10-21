export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  let projectUrl: URL;
  try {
    projectUrl = new URL(url);
  } catch {
    return null;
  }

  if (projectUrl.protocol !== "https:" && projectUrl.hostname !== "localhost") {
    return null;
  }

  return { url: projectUrl.origin, key };
}
