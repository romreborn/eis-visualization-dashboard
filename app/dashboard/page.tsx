"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { CircuitDataTable } from "@/components/circuit-data-table"
import { SectionCards } from "@/components/section-cards"
import { DashboardError, ChartError, TableError, CardsError } from "@/components/dashboard-error"
import { DashboardLoading, ChartLoading, TableLoading, CardsLoading, LoadingSpinner } from "@/components/dashboard-loading"
import { Button } from "@/components/ui/button"
import { IconRefresh } from "@tabler/icons-react"
import { useDashboardData } from "@/hooks/use-dashboard-data"

export default function Page() {
  const {
    circuits,
    stats,
    dataState,
    statsState,
    error,
    statsError,
    refetch,
    refetchStats,
    isLoading,
    isRefreshing,
    currentPage,
    pageSize,
    totalRecords,
    setCurrentPage,
    setPageSize,
    filters,
    setFilters,
    clearFilters,
  } = useDashboardData()

  // Handle overall error state
  if (dataState === 'error' && statsState === 'error') {
    return (
      <DashboardError
        error={error || statsError || 'Unknown error occurred'}
        onRetry={() => {
          refetch()
          refetchStats()
        }}
      />
    )
  }

  // Show loading state on initial load
  if (dataState === 'loading' && statsState === 'loading') {
    return <DashboardLoading />
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      {/* Refresh button */}
      <div className="flex justify-end px-4 py-2 lg:px-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            refetch()
            refetchStats()
          }}
          disabled={isLoading}
        >
          <IconRefresh className={`mr-2 size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Section Cards */}
        {statsState === 'loading' ? (
          <CardsLoading />
        ) : statsState === 'error' ? (
          <CardsError error={statsError || 'Failed to load statistics'} onRetry={refetchStats} />
        ) : (
          <SectionCards stats={stats} />
        )}

        {/* Chart */}
        <div className="px-4 lg:px-6">
          {dataState === 'loading' ? (
            <ChartLoading />
          ) : dataState === 'error' ? (
            <ChartError error={error || 'Failed to load chart data'} onRetry={refetch} />
          ) : (
            <ChartAreaInteractive
              data={circuits}
              onRefresh={refetch}
              isLoading={isRefreshing}
            />
          )}
        </div>

        {/* Data Table */}
        <div className="px-4 lg:px-6">
          {dataState === 'loading' ? (
            <TableLoading />
          ) : dataState === 'error' ? (
            <TableError error={error || 'Failed to load table data'} onRetry={refetch} />
          ) : (
            <CircuitDataTable
              data={circuits}
              currentPage={currentPage}
              pageSize={pageSize}
              totalRecords={totalRecords}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              isLoading={isRefreshing}
              onRefresh={refetch}
            />
          )}
        </div>
      </div>
    </div>
  )
}