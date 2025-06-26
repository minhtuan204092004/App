"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { z } from "zod"
import type { AuthSchema } from "@/components/auth/auth-form" // Assuming AuthSchema is defined here

export async function signInWithPassword(data: z.infer<typeof AuthSchema>) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { error: { message: error.message } }
  }
  revalidatePath("/", "layout") // Revalidate all paths
  redirect("/dashboard")
}

export async function signUpWithPassword(data: z.infer<typeof AuthSchema>) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      // You can add additional user meta data here if needed
      // data: {
      //   full_name: 'Test User',
      // }
    },
  })

  if (error) {
    return { error: { message: error.message } }
  }
  // For email confirmation, you might redirect to a page telling them to check their email
  // For this example, we'll redirect to login, assuming auto-confirmation or manual for now.
  revalidatePath("/", "layout")
  redirect("/login?message=Kiểm tra email của bạn để xác nhận tài khoản.")
}

export async function signOut() {
  const supabase = getSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/login")
}
