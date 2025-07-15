// Quick test script to verify tenant theming
// You can run this in browser console or create a test component

import { useTenantThemeStore } from '@/stores/tenant-theme-store'

export function TestTenantThemes() {
  const store = useTenantThemeStore()

  const runTests = () => {
    console.log('🎨 Testing Multi-Tenant Theming System')
    
    // Test 1: Initialize themes
    console.log('1. Initializing tenant themes...')
    store.initializeTenantThemes()
    console.log('Available themes:', Object.keys(store.tenantThemes))
    
    // Test 2: Switch to tenant-1 (Acme Corp - Blue theme)
    console.log('2. Switching to tenant-1 (Acme Corp)...')
    store.setTenant('tenant-1')
    console.log('Current tenant:', store.currentTenant)
    console.log('Current theme config:', store.currentThemeConfig.tenantName)
    
    // Test 3: Switch theme mode
    setTimeout(() => {
      console.log('3. Switching to dark mode...')
      store.setThemeMode('dark')
      console.log('Current theme mode:', store.themeMode)
    }, 2000)
    
    // Test 4: Switch to tenant-2 (Green Tech)
    setTimeout(() => {
      console.log('4. Switching to tenant-2 (Green Tech)...')
      store.setTenant('tenant-2')
      console.log('Current tenant:', store.currentTenant)
    }, 4000)
    
    // Test 5: Back to light mode
    setTimeout(() => {
      console.log('5. Switching back to light mode...')
      store.setThemeMode('light')
    }, 6000)
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Theme Testing</h3>
      <button 
        onClick={runTests}
        className="px-4 py-2 bg-primary text-primary-foreground rounded"
      >
        Run Theme Tests
      </button>
    </div>
  )
}
