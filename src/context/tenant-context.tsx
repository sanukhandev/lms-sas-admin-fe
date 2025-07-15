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
    // Initialize tenant detection when the provider mounts
    if (!tenantStore.isInitialized) {
      tenantStore.initializeTenant()
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
