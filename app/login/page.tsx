import { AuthForm } from "@/components/auth/auth-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default async function LoginPage({ searchParams }: { searchParams: { message?: string } }) {
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
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>Nhập email và mật khẩu của bạn để tiếp tục.</CardDescription>
        </CardHeader>
        <CardContent>
          {searchParams.message && (
            <Alert className="mb-4">
              <AlertDescription>{searchParams.message}</AlertDescription>
            </Alert>
          )}
          <AuthForm mode="login" />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Đăng ký
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
