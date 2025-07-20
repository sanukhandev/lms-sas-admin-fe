import { useTenantContext } from '@/context/tenant-context'
import { Skeleton } from '@/components/ui/skeleton'

interface TenantLoaderProps {
  children: React.ReactNode
}

export function TenantLoader({ children }: TenantLoaderProps) {
  const { isLoading, error, tenant, isInitialized } = useTenantContext()

  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
          <p className="text-muted-foreground">Loading tenant configuration...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 p-8">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-destructive">Tenant Configuration Error</h2>
          <p className="text-muted-foreground max-w-md">
            {error}
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Please check:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Your URL contains a valid tenant domain</li>
              <li>The tenant exists in the system</li>
              <li>Your network connection is stable</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 p-8">
          <div className="text-yellow-500 text-6xl">🏢</div>
          <h2 className="text-2xl font-bold">No Tenant Found</h2>
          <p className="text-muted-foreground max-w-md">
            Unable to determine tenant from the current URL. Please ensure you're accessing the application through the correct domain.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Expected URL formats:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>tenant.domain.com</li>
              <li>domain.com/tenant/tenant-name</li>
              <li>domain.com?tenant=tenant-name</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
