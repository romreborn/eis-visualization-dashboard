import { IconAlertTriangle, IconRefresh, IconWifiOff } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DashboardError({
  error,
  onRetry,
  title = "Failed to load dashboard data",
  description = "There was an error loading the dashboard. Please try again."
}: {
  error: string
  onRetry: () => void
  title?: string
  description?: string
}) {
  const isNetworkError = error.toLowerCase().includes('network') ||
                         error.toLowerCase().includes('connection')

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                {isNetworkError ? (
                  <IconWifiOff className="size-6 text-destructive" />
                ) : (
                  <IconAlertTriangle className="size-6 text-destructive" />
                )}
              </div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <IconAlertTriangle className="size-4" />
                <AlertTitle>Error Details</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>

              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <Button onClick={onRetry} className="flex-1">
                  <IconRefresh className="mr-2 size-4" />
                  Try Again
                </Button>
                {isNetworkError && (
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="flex-1"
                  >
                    Refresh Page
                  </Button>
                )}
              </div>

              {isNetworkError && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Troubleshooting Tips:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Check your internet connection</li>
                    <li>• Verify the backend API is running</li>
                    <li>• Check if the API URL is correct in environment variables</li>
                    <li>• Ensure CORS is properly configured on the backend</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function ChartError({
  error,
  onRetry
}: {
  error: string
  onRetry: () => void
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-lg">Circuit Overview</CardTitle>
        <CardDescription>Error loading chart data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <IconAlertTriangle className="size-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={onRetry}>
              <IconRefresh className="mr-2 size-4" />
              Retry
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TableError({
  error,
  onRetry
}: {
  error: string
  onRetry: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Circuit Data</CardTitle>
        <CardDescription>Error loading table data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <IconAlertTriangle className="size-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={onRetry}>
              <IconRefresh className="mr-2 size-4" />
              Retry
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CardsError({
  error,
  onRetry
}: {
  error: string
  onRetry: () => void
}) {
  return (
    <div className="px-4 lg:px-6">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <IconAlertTriangle className="size-8 text-muted-foreground mx-auto mb-2" />
          <CardTitle className="text-lg">Statistics Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onRetry} className="w-full">
            <IconRefresh className="mr-2 size-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}