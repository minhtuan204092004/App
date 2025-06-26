import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export function getSupabaseServerClient(cookieStore?: ReturnType<typeof cookies>) {
  const currentCookies = cookieStore || cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return currentCookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        currentCookies.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        currentCookies.delete({ name, ...options })
      },
    },
  })
}

export function getSupabaseServerClientWithServiceRole() {
  const currentCookies = cookies() // Required, even if not directly used for service role
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key
    {
      cookies: {
        get(name: string) {
          return currentCookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          currentCookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          currentCookies.delete({ name, ...options })
        },
      },
      // Optional: specify auth schema if not public
      // auth: {
      //   storageKey: 'supabase.auth.token',
      // },
    },
  )
}
