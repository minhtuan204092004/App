import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CigaretteOff, LogIn, UserPlus } from "lucide-react"

export default async function HomePage() {
  const supabase = getSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-100 via-teal-50 to-emerald-100 p-4">
      <div className="text-center space-y-6 max-w-lg">
        <CigaretteOff className="mx-auto h-24 w-24 text-primary" />
        <h1 className="text-5xl font-bold tracking-tight text-gray-800">
          Chào mừng đến với <span className="text-primary">Cai Thuốc App</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Nền tảng hỗ trợ bạn trên hành trình từ bỏ thuốc lá. Theo dõi tiến trình, tiết kiệm tiền và cải thiện sức khỏe.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/login">
              <LogIn className="mr-2 h-5 w-5" /> Đăng nhập
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-background text-foreground hover:bg-accent">
            <Link href="/signup">
              <UserPlus className="mr-2 h-5 w-5" /> Đăng ký
            </Link>
          </Button>
        </div>
      </div>
      <footer className="absolute bottom-0 py-6 text-center text-sm text-muted-foreground w-full">
        Xây dựng bởi v0. &copy; {new Date().getFullYear()} Vercel.
      </footer>
    </div>
  )
}
