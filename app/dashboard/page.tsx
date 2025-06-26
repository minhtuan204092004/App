import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StatDisplay } from "@/components/dashboard/stat-display"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CalendarDays, CigaretteOff, DollarSign, HeartPulse, Settings } from "lucide-react"
import { formatDistanceToNowStrict, differenceInDays } from "date-fns"
import { vi } from "date-fns/locale"

export interface Profile {
  quit_date: string | null
  cigs_per_day_before: number | null
  cost_per_pack: number | null
}

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login") // Should be handled by layout, but good for safety
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("quit_date, cigs_per_day_before, cost_per_pack")
    .eq("id", user.id)
    .single<Profile>()

  if (error && error.code !== "PGRST116") {
    // PGRST116: single row not found
    console.error("Lỗi tải hồ sơ:", error)
    // Handle error display if necessary
  }

  let daysSmokeFree = 0
  let moneySaved = 0
  let quitDateDisplay = "Chưa đặt"

  if (profile?.quit_date) {
    const quitDate = new Date(profile.quit_date)
    quitDateDisplay = formatDistanceToNowStrict(quitDate, { addSuffix: true, locale: vi })
    daysSmokeFree = differenceInDays(new Date(), quitDate)
    if (daysSmokeFree < 0) daysSmokeFree = 0 // If quit date is in future

    if (profile.cigs_per_day_before && profile.cost_per_pack) {
      const packsPerDay = profile.cigs_per_day_before / 20 // Assuming 20 cigs per pack
      moneySaved = daysSmokeFree * packsPerDay * profile.cost_per_pack
    }
  }

  if (!profile?.quit_date || !profile?.cigs_per_day_before || !profile?.cost_per_pack) {
    return (
      <div className="space-y-6">
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertTitle>Chào mừng bạn!</AlertTitle>
          <AlertDescription>
            Vui lòng cập nhật thông tin cai thuốc của bạn để bắt đầu theo dõi tiến trình.
          </AlertDescription>
          <Button asChild className="mt-4">
            <Link href="/dashboard/settings">Đến trang Cài đặt</Link>
          </Button>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bảng điều khiển</h1>
        <Button asChild variant="outline" className="bg-background text-foreground">
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" /> Cài đặt
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatDisplay title="Số ngày không hút thuốc" value={daysSmokeFree} unit="ngày" icon={CigaretteOff} />
        <StatDisplay
          title="Số tiền tiết kiệm được"
          value={Math.round(moneySaved).toLocaleString("vi-VN")}
          unit="VNĐ"
          icon={DollarSign}
        />
        <StatDisplay title="Thời gian đã cai" value={quitDateDisplay} icon={CalendarDays} />
      </div>

      {/* Placeholder for health improvements or tips */}
      <div className="mt-8 p-6 border rounded-lg bg-card text-card-foreground">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          <HeartPulse className="mr-2 h-5 w-5 text-primary" />
          Cải thiện sức khỏe
        </h2>
        <p className="text-muted-foreground">
          Mỗi ngày không hút thuốc là một bước tiến lớn cho sức khỏe của bạn. Hãy tiếp tục cố gắng! Bạn có thể tìm hiểu
          thêm về các lợi ích sức khỏe khi cai thuốc lá.
        </p>
        {/* Future: Link to articles or display dynamic health milestones */}
      </div>
    </div>
  )
}
