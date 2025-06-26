import { SettingsForm } from "@/components/dashboard/settings-form"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Profile } from "@/app/dashboard/page" // Import Profile type

export default async function SettingsPage() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profileData: Profile | null = null
  if (user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("quit_date, cigs_per_day_before, cost_per_pack")
      .eq("id", user.id)
      .single()
    if (error) console.error("Lỗi tải hồ sơ:", error.message)
    profileData = data as Profile | null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt Cai thuốc</CardTitle>
          <CardDescription>
            Cập nhật thông tin cá nhân của bạn để theo dõi tiến trình cai thuốc chính xác hơn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm profile={profileData} />
        </CardContent>
      </Card>
    </div>
  )
}
