"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { z } from "zod"
import type { SettingsSchema } from "@/components/dashboard/settings-form" // Assuming schema is defined here

export async function updateProfileSettings(values: z.infer<typeof SettingsSchema>) {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: { message: "Người dùng không được xác thực." } }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      quit_date: values.quit_date ? values.quit_date.toISOString().split("T")[0] : null, // Format as YYYY-MM-DD
      cigs_per_day_before: values.cigs_per_day_before,
      cost_per_pack: values.cost_per_pack,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) {
    console.error("Lỗi cập nhật hồ sơ:", error)
    return { error: { message: `Lỗi cập nhật hồ sơ: ${error.message}` } }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/settings")
  return { success: true, message: "Cài đặt đã được cập nhật thành công!" }
}
