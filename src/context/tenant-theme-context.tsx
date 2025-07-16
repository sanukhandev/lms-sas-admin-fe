import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useTenantThemeStore } from '@/stores/tenant-theme-store'

type TenantThemeProviderProps = {
  children: ReactNode
  tenantId?: string
}

const TenantThemeContext = createContext<{
  tenantId: string | null
  switchTenant: (tenantId: string) => void
  themeMode: 'light' | 'dark' | 'system'
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void
} | null>(null)

export function TenantThemeProvider({
  children,
  tenantId,
}: TenantThemeProviderProps) {
  const {
    currentTenant,
    themeMode,
    setTenant,
    setThemeMode,
    initializeTenantThemes,
    applyTenantTheme,
  } = useTenantThemeStore()

  useEffect(() => {
    // Initialize tenant themes on mount
    initializeTenantThemes()

    // If tenantId is provided, set it as current
    if (tenantId && tenantId !== currentTenant) {
      setTenant(tenantId)
    } else if (!tenantId && !currentTenant) {
      // If no tenant ID provided, use default
      setTenant('default')
    }
  }, [tenantId, currentTenant, initializeTenantThemes, setTenant])

  useEffect(() => {
    // Apply theme when current tenant or theme mode changes
    if (currentTenant) {
      applyTenantTheme(currentTenant, themeMode)
    }

    // Cleanup function to remove tenant theme marker when component unmounts
    return () => {
      document.documentElement.removeAttribute('data-tenant-theme')
    }
  }, [currentTenant, themeMode, applyTenantTheme])

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (themeMode === 'system' && currentTenant) {
        applyTenantTheme(currentTenant, 'system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode, currentTenant, applyTenantTheme])

  const switchTenant = (newTenantId: string) => {
    setTenant(newTenantId)
  }

  const contextValue = {
    tenantId: currentTenant,
    switchTenant,
    themeMode,
    setThemeMode,
  }

  return (
    <TenantThemeContext.Provider value={contextValue}>
      {children}
    </TenantThemeContext.Provider>
  )
}

export function useTenantTheme() {
  const context = useContext(TenantThemeContext)
  if (!context) {
    throw new Error('useTenantTheme must be used within a TenantThemeProvider')
  }
  return context
}

// Hook to get current tenant theme config
export function useCurrentTenantTheme() {
  const { currentThemeConfig } = useTenantThemeStore()
  return currentThemeConfig
}
