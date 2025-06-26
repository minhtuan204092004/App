import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider" // Assuming this exists

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Cai Thuốc App - Hỗ trợ cai nghiện thuốc lá",
  description: "Nền tảng giúp bạn theo dõi tiến trình cai thuốc, tiết kiệm tiền và cải thiện sức khỏe.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
