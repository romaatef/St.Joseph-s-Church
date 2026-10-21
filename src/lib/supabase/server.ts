import type { Database } from "@/types/database";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";

async function createSupabaseClient(canWriteCookies: boolean) {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("إعدادات Supabase غير مكتملة. تحقق من ملف .env.local.");
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(config.url, config.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // Server Components can read sessions, but only Actions may persist refreshed cookies.
        if (!canWriteCookies) return;
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}

export function createSupabaseServerClient() {
  return createSupabaseClient(false);
}

export function createSupabaseActionClient() {
  return createSupabaseClient(true);
}
