"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/auth/actions"
import { Home, LogOut, Settings, UserCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavigationHeaderProps {
  userEmail?: string | null
}

export function NavigationHeader({ userEmail }: NavigationHeaderProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Bảng điều khiển", icon: Home },
    { href: "/dashboard/settings", label: "Cài đặt", icon: Settings },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
          <CigaretteOff className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">Cai Thuốc App</span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="mr-1 inline-block h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {userEmail && (
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              <UserCircle className="inline-block mr-1 h-4 w-4" />
              {userEmail}
            </span>
          )}
          <form action={signOut}>
            <Button variant="outline" size="sm" className="bg-background text-foreground">
              <LogOut className="mr-1 h-4 w-4" />
              Đăng xuất
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}

NavigationHeader.defaultProps = {
  userEmail: null,
}
