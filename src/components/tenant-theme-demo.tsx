import { TenantThemedCard } from '@/components/tenant-themed-card'
import { useTenantContext } from '@/context/tenant-context'
import { useTenantStyles } from '@/hooks/use-tenant-theme'

export default function TenantThemeDemo() {
  const { tenant, isLoading, error } = useTenantContext()
  const { getCardStyle, getButtonStyle, getTypographyStyle } = useTenantStyles()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Tenant</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Tenant Found</h2>
          <p className="text-gray-600">Please access through a valid tenant URL</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 style={getTypographyStyle('4xl', 'bold')} className="text-primary">
            {tenant.settings.branding.company_name || tenant.name}
          </h1>
          <p style={getTypographyStyle('lg', 'normal')} className="text-muted-foreground">
            Theme Configuration Demo
          </p>
        </div>

        {/* Main Demo Card */}
        <TenantThemedCard />

        {/* Theme Configuration Details */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Colors Section */}
          <div style={getCardStyle()} className="p-6">
            <h2 style={getTypographyStyle('xl', 'semibold')} className="mb-4">
              Color Palette
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(tenant.settings.theme_config.colors).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: value }}
                  />
                  <div>
                    <p style={getTypographyStyle('sm', 'medium')}>{key.replace('_', ' ')}</p>
                    <p style={getTypographyStyle('xs', 'normal')} className="text-muted-foreground">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Section */}
          <div style={getCardStyle()} className="p-6">
            <h2 style={getTypographyStyle('xl', 'semibold')} className="mb-4">
              Typography
            </h2>
            <div className="space-y-4">
              <div>
                <p style={getTypographyStyle('sm', 'medium')}>Font Family</p>
                <p style={getTypographyStyle('sm', 'normal')} className="text-muted-foreground">
                  {tenant.settings.theme_config.typography.font_family}
                </p>
              </div>
              
              <div>
                <p style={getTypographyStyle('sm', 'medium')}>Font Sizes</p>
                <div className="space-y-2">
                  {Object.entries(tenant.settings.theme_config.typography.font_sizes).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span style={getTypographyStyle('sm', 'normal')}>{key}</span>
                      <span style={getTypographyStyle('sm', 'normal')} className="text-muted-foreground">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Spacing Section */}
          <div style={getCardStyle()} className="p-6">
            <h2 style={getTypographyStyle('xl', 'semibold')} className="mb-4">
              Spacing System
            </h2>
            <div className="space-y-2">
              {Object.entries(tenant.settings.theme_config.spacing).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span style={getTypographyStyle('sm', 'normal')}>{key}</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="bg-primary h-4"
                      style={{ width: value }}
                    />
                    <span style={getTypographyStyle('xs', 'normal')} className="text-muted-foreground">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Border Radius Section */}
          <div style={getCardStyle()} className="p-6">
            <h2 style={getTypographyStyle('xl', 'semibold')} className="mb-4">
              Border Radius
            </h2>
            <div className="space-y-3">
              {Object.entries(tenant.settings.theme_config.border_radius).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span style={getTypographyStyle('sm', 'normal')}>{key}</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 bg-primary"
                      style={{ borderRadius: value }}
                    />
                    <span style={getTypographyStyle('xs', 'normal')} className="text-muted-foreground">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Button Examples */}
        <div style={getCardStyle()} className="p-6">
          <h2 style={getTypographyStyle('xl', 'semibold')} className="mb-4">
            Button Styles
          </h2>
          <div className="flex flex-wrap gap-4">
            <button style={getButtonStyle('primary')}>
              Primary Button
            </button>
            <button style={getButtonStyle('secondary')}>
              Secondary Button
            </button>
            <button style={getButtonStyle('accent')}>
              Accent Button
            </button>
          </div>
        </div>

        {/* Tenant Info */}
        <div style={getCardStyle()} className="p-6">
          <h2 style={getTypographyStyle('xl', 'semibold')} className="mb-4">
            Tenant Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p style={getTypographyStyle('sm', 'medium')}>Name</p>
              <p style={getTypographyStyle('sm', 'normal')} className="text-muted-foreground">
                {tenant.name}
              </p>
            </div>
            <div>
              <p style={getTypographyStyle('sm', 'medium')}>Domain</p>
              <p style={getTypographyStyle('sm', 'normal')} className="text-muted-foreground">
                {tenant.domain}
              </p>
            </div>
            <div>
              <p style={getTypographyStyle('sm', 'medium')}>Theme Mode</p>
              <p style={getTypographyStyle('sm', 'normal')} className="text-muted-foreground">
                {tenant.settings.theme_config.mode}
              </p>
            </div>
            <div>
              <p style={getTypographyStyle('sm', 'medium')}>Language</p>
              <p style={getTypographyStyle('sm', 'normal')} className="text-muted-foreground">
                {tenant.settings.language}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
