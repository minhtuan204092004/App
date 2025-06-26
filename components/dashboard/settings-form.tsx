"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker" // Ensure this path is correct
import { updateProfileSettings } from "@/app/dashboard/actions"
import { useState, useTransition } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import type { Profile } from "@/app/dashboard/page" // Import Profile type

export const SettingsSchema = z.object({
  quit_date: z.date({ required_error: "Vui lòng chọn ngày bắt đầu cai thuốc." }).optional().nullable(),
  cigs_per_day_before: z.coerce.number().min(0, "Số điếu thuốc phải là số dương.").optional().nullable(),
  cost_per_pack: z.coerce.number().min(0, "Giá tiền phải là số dương.").optional().nullable(),
})

interface SettingsFormProps {
  profile: Profile | null
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      quit_date: profile?.quit_date ? new Date(profile.quit_date) : undefined,
      cigs_per_day_before: profile?.cigs_per_day_before ?? undefined,
      cost_per_pack: profile?.cost_per_pack ?? undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof SettingsSchema>) {
    setError(null)
    setSuccessMessage(null)
    startTransition(async () => {
      const result = await updateProfileSettings(values)
      if (result.error) {
        setError(result.error.message)
      } else if (result.success) {
        setSuccessMessage(result.message || "Cập nhật thành công!")
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="quit_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ngày bắt đầu cai thuốc</FormLabel>
              <DatePicker
                date={field.value || undefined}
                setDate={(date) => field.onChange(date)}
                placeholder="Chọn ngày bạn bắt đầu cai thuốc"
              />
              <FormDescription>Đây là ngày bạn chính thức ngừng hút thuốc.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cigs_per_day_before"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điếu hút mỗi ngày (trước đây)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ví dụ: 20" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormDescription>Bạn đã hút bao nhiêu điếu thuốc mỗi ngày trước khi cai?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cost_per_pack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá mỗi bao thuốc (VNĐ)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ví dụ: 30000" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormDescription>Giá tiền cho một bao thuốc bạn thường hút (20 điếu).</FormDescription>
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
        {successMessage && (
          <Alert variant="default" className="bg-green-100 border-green-300 text-green-700">
            <CheckCircle2 className="h-4 w-4 text-green-700" />
            <AlertTitle>Thành công</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </form>
    </Form>
  )
}

SettingsForm.defaultProps = {
  profile: null,
}
