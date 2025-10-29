import { IconTrendingDown, IconTrendingUp, IconActivity, IconUsers, IconServer, IconWorld } from "@tabler/icons-react"
import { CircuitData } from "@/lib/api-client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DashboardStats {
  totalCircuits: number
  activeCircuits: number
  circuitsByStatus: Record<string, number>
  circuitsByServiceType: Record<string, number>
  circuitsByPartner: Record<string, number>
}

interface SectionCardsProps {
  stats: DashboardStats | null
}

export function SectionCards({ stats }: SectionCardsProps) {
  if (!stats) {
    return null
  }

  const { totalCircuits, activeCircuits, circuitsByStatus, circuitsByServiceType, circuitsByPartner } = stats

  // Calculate active percentage
  const activePercentage = totalCircuits > 0 ? Math.round((activeCircuits / totalCircuits) * 100) : 0

  // Get top service type
  const topServiceType = Object.entries(circuitsByServiceType)
    .sort(([,a], [,b]) => b - a)[0]

  // Get top partner
  const topPartner = Object.entries(circuitsByPartner)
    .sort(([,a], [,b]) => b - a)[0]

  // Get inactive circuits count
  const inactiveCircuits = circuitsByStatus['Inactive'] || 0
  const inactivePercentage = totalCircuits > 0 ? Math.round((inactiveCircuits / totalCircuits) * 100) : 0

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Circuits Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Circuits</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCircuits.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <IconServer className="size-3" />
              Total
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            All network circuits <IconActivity className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Across all service types and partners
          </div>
        </CardFooter>
      </Card>

      {/* Active Circuits Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Circuits</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeCircuits.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600 border-green-200">
              <IconTrendingUp />
              {activePercentage}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {activePercentage >= 90 ? 'Excellent uptime' : activePercentage >= 80 ? 'Good performance' : 'Needs attention'}
            <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {activeCircuits} of {totalCircuits} circuits operational
          </div>
        </CardFooter>
      </Card>

      {/* Top Service Type Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Primary Service</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {topServiceType ? topServiceType[0] : 'N/A'}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              <IconWorld className="size-3" />
              {topServiceType ? topServiceType[1].toLocaleString() : 0}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Most used service type <IconWorld className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {topServiceType
              ? `${topServiceType[1]} circuits using ${topServiceType[0]}`
              : 'No service data available'
            }
          </div>
        </CardFooter>
      </Card>

      {/* Top Partner Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Leading Partner</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl truncate">
            {topPartner ? topPartner[0] : 'N/A'}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              <IconUsers className="size-3" />
              {topPartner ? topPartner[1].toLocaleString() : 0}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Largest partner network <IconUsers className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {topPartner
              ? `${topPartner[1]} circuits managed by ${topPartner[0]}`
              : 'No partner data available'
            }
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
