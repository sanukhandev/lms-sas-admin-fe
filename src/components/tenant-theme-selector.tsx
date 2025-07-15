import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTenantTheme, useCurrentTenantTheme } from '@/context/tenant-theme-context'
import { useTenantThemeStore } from '@/stores/tenant-theme-store'
import { Palette, Building, Sun, Moon, Monitor } from 'lucide-react'

export function TenantThemeSelector() {
  const { tenantId, switchTenant, themeMode, setThemeMode } = useTenantTheme()
  const currentTheme = useCurrentTenantTheme()
  const { tenantThemes } = useTenantThemeStore()

  const availableTenants = Object.values(tenantThemes)

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Tenant & Theme Settings
        </CardTitle>
        <CardDescription>
          Switch between tenants and customize the theme
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tenant Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Current Tenant</label>
          <Select value={tenantId || ''} onValueChange={switchTenant}>
            <SelectTrigger>
              <SelectValue placeholder="Select a tenant" />
            </SelectTrigger>
            <SelectContent>
              {availableTenants.map((tenant) => (
                <SelectItem key={tenant.tenantId} value={tenant.tenantId}>
                  {tenant.tenantName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Theme Mode Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Theme Mode</label>
          <div className="flex gap-2">
            <Button
              variant={themeMode === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setThemeMode('light')}
              className="flex items-center gap-2"
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              variant={themeMode === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setThemeMode('dark')}
              className="flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={themeMode === 'system' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setThemeMode('system')}
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              System
            </Button>
          </div>
        </div>

        {/* Current Theme Preview */}
        {tenantId && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Theme</label>
            <div className="p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-4 w-4" />
                <span className="font-medium">{currentTheme.tenantName}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {currentTheme.theme.branding.companyName}
              </div>
              <div className="flex gap-2 mt-2">
                <div 
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: currentTheme.theme.colors.primary }}
                  title="Primary Color"
                />
                <div 
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: currentTheme.theme.colors.accent }}
                  title="Accent Color"
                />
                <div 
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: currentTheme.theme.branding.brandColor }}
                  title="Brand Color"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Component for theme switching in header
export function TenantThemeSwitch() {
  const { tenantId, switchTenant, themeMode, setThemeMode } = useTenantTheme()
  const { tenantThemes } = useTenantThemeStore()

  const availableTenants = Object.values(tenantThemes)

  return (
    <div className="flex items-center gap-2">
      <Select value={tenantId || ''} onValueChange={switchTenant}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Tenant" />
        </SelectTrigger>
        <SelectContent>
          {availableTenants.map((tenant) => (
            <SelectItem key={tenant.tenantId} value={tenant.tenantId}>
              {tenant.tenantName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system']
          const currentIndex = modes.indexOf(themeMode)
          const nextMode = modes[(currentIndex + 1) % modes.length]
          setThemeMode(nextMode)
        }}
      >
        {themeMode === 'light' && <Sun className="h-4 w-4" />}
        {themeMode === 'dark' && <Moon className="h-4 w-4" />}
        {themeMode === 'system' && <Monitor className="h-4 w-4" />}
      </Button>
    </div>
  )
}
