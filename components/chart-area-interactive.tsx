"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import { CircuitData } from "@/lib/api-client"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { IconRefresh } from "@tabler/icons-react"

export const description = "An interactive circuit status chart"

interface ChartAreaInteractiveProps {
  data: CircuitData[]
  onRefresh: () => void
  isLoading: boolean
}

type ChartViewType = "status" | "serviceType" | "partner"

export function ChartAreaInteractive({ data, onRefresh, isLoading }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [chartView, setChartView] = React.useState<ChartViewType>("status")

  React.useEffect(() => {
    if (isMobile) {
      setChartView("status")
    }
  }, [isMobile])

  // Process data based on selected view
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return []

    switch (chartView) {
      case "status": {
        const statusCounts = data.reduce((acc, circuit) => {
          const status = circuit.status || 'Unknown'
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        return Object.entries(statusCounts)
          .map(([status, count]) => ({
            name: status,
            value: count,
            fill: getStatusColor(status)
          }))
          .sort((a, b) => b.value - a.value)
      }

      case "serviceType": {
        const serviceCounts = data.reduce((acc, circuit) => {
          const serviceType = circuit.servicetype || 'Unknown'
          acc[serviceType] = (acc[serviceType] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        return Object.entries(serviceCounts)
          .map(([serviceType, count]) => ({
            name: serviceType,
            value: count,
            fill: getServiceTypeColor(serviceType)
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10) // Top 10 service types
      }

      case "partner": {
        const partnerCounts = data.reduce((acc, circuit) => {
          const partner = circuit.partnerName || circuit.partner || 'Unknown'
          acc[partner] = (acc[partner] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        return Object.entries(partnerCounts)
          .map(([partner, count]) => ({
            name: partner,
            value: count,
            fill: getPartnerColor(partner)
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10) // Top 10 partners
      }

      default:
        return []
    }
  }, [data, chartView])

  const chartConfig: ChartConfig = {
    value: {
      label: "Count",
    },
    ...processedData.reduce((acc, item, index) => {
      acc[item.name] = {
        label: item.name,
        color: item.fill,
      }
      return acc
    }, {} as Record<string, { label: string; color: string }>)
  }

  const getChartTitle = () => {
    switch (chartView) {
      case "status":
        return "Circuits by Status"
      case "serviceType":
        return "Top Service Types"
      case "partner":
        return "Top Partners"
      default:
        return "Circuit Overview"
    }
  }

  const getChartDescription = () => {
    switch (chartView) {
      case "status":
        return "Distribution of circuits by status"
      case "serviceType":
        return "Top 10 service types by circuit count"
      case "partner":
        return "Top 10 partners by circuit count"
      default:
        return "Circuit data overview"
    }
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{getChartTitle()}</CardTitle>
            <CardDescription>{getChartDescription()}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <IconRefresh className={`mr-2 size-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        <CardAction>
          <ToggleGroup
            type="single"
            value={chartView}
            onValueChange={(value) => value && setChartView(value as ChartViewType)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="status">By Status</ToggleGroupItem>
            <ToggleGroupItem value="serviceType">By Service</ToggleGroupItem>
            <ToggleGroupItem value="partner">By Partner</ToggleGroupItem>
          </ToggleGroup>
          <Select value={chartView} onValueChange={(value) => setChartView(value as ChartViewType)}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select chart view"
            >
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="status" className="rounded-lg">
                By Status
              </SelectItem>
              <SelectItem value="serviceType" className="rounded-lg">
                By Service Type
              </SelectItem>
              <SelectItem value="partner" className="rounded-lg">
                By Partner
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {processedData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No data available
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      labelFormatter={(label) => label}
                      formatter={(value: number) => [value.toLocaleString(), 'Count']}
                    />
                  }
                />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  fill={(entry: any) => entry.fill}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

// Helper functions for colors
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Active': 'hsl(142, 76%, 36%)', // green-600
    'Inactive': 'hsl(0, 84%, 60%)', // red-500
    'Pending': 'hsl(38, 92%, 50%)', // yellow-500
    'Maintenance': 'hsl(221, 83%, 53%)', // blue-600
    'Unknown': 'hsl(215, 14%, 34%)', // slate-600
  }
  return colors[status] || 'hsl(215, 14%, 34%)'
}

function getServiceTypeColor(serviceType: string): string {
  const colors: Record<string, string> = {
    'STARLINK': 'hsl(263, 70%, 50%)', // purple-600
    'FIBER': 'hsl(142, 76%, 36%)', // green-600
    'WIRELESS': 'hsl(221, 83%, 53%)', // blue-600
    'SATELLITE': 'hsl(38, 92%, 50%)', // yellow-500
    'MPLS': 'hsl(0, 84%, 60%)', // red-500
    'Unknown': 'hsl(215, 14%, 34%)', // slate-600
  }
  return colors[serviceType] || 'hsl(215, 14%, 34%)'
}

function getPartnerColor(partner: string): string {
  // Generate consistent colors based on partner name hash
  let hash = 0
  for (let i = 0; i < partner.length; i++) {
    hash = partner.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 70%, 50%)`
}
