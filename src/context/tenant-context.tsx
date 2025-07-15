import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useTenant } from '@/stores/tenant-store'
import { TenantConfig } from '@/services/tenant-detection'

interface TenantContextType {
  tenant: TenantConfig | null
  isLoading: boolean
  error: string | null
  detectionMethod: string | null
  isInitialized: boolean
  initializeTenant: () => Promise<void>
  refreshTenant: () => Promise<void>
  clearTenant: () => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const tenantStore = useTenant()

  useEffect(() => {
    console.log('🏠 [TenantProvider] useEffect triggered', {
      isInitialized: tenantStore.isInitialized,
      tenant: tenantStore.tenant?.name || 'No tenant',
      error: tenantStore.error,
      isLoading: tenantStore.isLoading
    })
    
    // Initialize tenant detection when the provider mounts
    if (!tenantStore.isInitialized) {
      console.log('🏠 [TenantProvider] Tenant not initialized, calling initializeTenant()')
      tenantStore.initializeTenant()
    } else {
      console.log('🏠 [TenantProvider] Tenant already initialized, skipping')
    }
  }, [tenantStore.isInitialized])

  return (
    <TenantContext.Provider value={tenantStore}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenantContext() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenantContext must be used within a TenantProvider')
  }
  return context
}
