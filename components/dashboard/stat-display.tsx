import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatDisplayProps {
  title: string
  value: string | number
  icon?: LucideIcon
  unit?: string
}

export function StatDisplay({ title, value, icon: Icon, unit }: StatDisplayProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  )
}

StatDisplay.defaultProps = {
  title: "Tiêu đề",
  value: "0",
  icon: undefined,
  unit: "",
}
