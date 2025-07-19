import { Badge } from '@/components/ui/badge'
import { useTenantStore } from '@/stores/tenant-store'

export function TenantInfo() {
  const { currentTenant, detectionMethod } = useTenantStore()

  if (!currentTenant) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="destructive">No Tenant</Badge>
        <span>No tenant detected</span>
      </div>
    )
  }

  const getMethodBadgeVariant = (method: string | null) => {
    switch (method) {
      case 'subdomain':
        return 'default'
      case 'path':
        return 'secondary'
      case 'header':
        return 'outline'
      case 'localStorage':
        return 'secondary'
      default:
        return 'destructive'
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Badge variant={getMethodBadgeVariant(detectionMethod)}>
        {detectionMethod || 'unknown'}
      </Badge>
      <span className="font-medium">{currentTenant.name}</span>
      <span className="text-muted-foreground">({currentTenant.domain})</span>
    </div>
  )
}
