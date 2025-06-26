import type React from "react"
import { NavigationHeader } from "@/components/navigation-header"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavigationHeader userEmail={user.email} />
      <main className="flex-1 container py-8">{children}</main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Xây dựng bởi v0. &copy; {new Date().getFullYear()} Vercel.
          </p>
        </div>
      </footer>
    </div>
  )
}
