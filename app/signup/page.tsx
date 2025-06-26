import { AuthForm } from "@/components/auth/auth-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function SignupPage() {
  const supabase = getSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng ký</CardTitle>
          <CardDescription>Tạo tài khoản mới để bắt đầu hành trình cai thuốc.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
