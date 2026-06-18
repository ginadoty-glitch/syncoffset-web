import { type NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes Supabase Auth session cookies on matched routes.
 * Phase 3: ingestion works via service role on server; middleware prepares Auth for Phase 4+.
 */
export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let supabaseResponse = NextResponse.next({ request });

  supabaseResponse.headers.set("x-pathname", pathname);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        supabaseResponse.headers.set("x-pathname", pathname);
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  await supabase.auth.getUser();

  return supabaseResponse;
}
