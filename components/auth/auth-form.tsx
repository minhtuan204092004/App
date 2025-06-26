"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signInWithPassword, signUpWithPassword } from "@/app/auth/actions"
import { useState, useTransition } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export const AuthSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ." }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
})

interface AuthFormProps {
  mode: "login" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof AuthSchema>>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof AuthSchema>) {
    setError(null)
    setMessage(null)
    startTransition(async () => {
      const result = mode === "login" ? await signInWithPassword(values) : await signUpWithPassword(values)

      if (result?.error) {
        setError(result.error.message)
      }
      if (result?.message) {
        // For signup success message
        setMessage(result.message)
        form.reset()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="ban@email.com" {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert variant="default">
            <AlertTriangle className="h-4 w-4" /> {/* Use a different icon if desired */}
            <AlertTitle>Thông báo</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending
            ? mode === "login"
              ? "Đang đăng nhập..."
              : "Đang đăng ký..."
            : mode === "login"
              ? "Đăng nhập"
              : "Đăng ký"}
        </Button>
      </form>
    </Form>
  )
}

AuthForm.defaultProps = {
  mode: "login",
}
