import { useTenantStyles } from '@/hooks/use-tenant-theme'
import { useTenantContext } from '@/context/tenant-context'

export function TenantThemedCard() {
  const { tenant } = useTenantContext()
  const { getCardStyle, getButtonStyle, getTypographyStyle, getColorStyle } = useTenantStyles()

  if (!tenant) {
    return <div>No tenant configuration available</div>
  }

  return (
    <div style={getCardStyle()} className="p-6 max-w-md mx-auto">
      <div className="space-y-4">
        <h1 
          style={{
            ...getTypographyStyle('2xl', 'bold'),
            ...getColorStyle('primary')
          }}
        >
          {tenant.settings.branding.company_name || tenant.name}
        </h1>
        
        <p style={getTypographyStyle('base', 'normal')}>
          Welcome to our learning management system. This card demonstrates the tenant-specific theming system.
        </p>

        <div className="space-y-2">
          <h3 style={getTypographyStyle('lg', 'semibold')}>
            Current Theme Configuration:
          </h3>
          <ul className="space-y-1 text-sm">
            <li>Theme Mode: <span style={getColorStyle('accent')}>{tenant.settings.theme_config.mode}</span></li>
            <li>Primary Color: <span style={getColorStyle('primary')}>{tenant.settings.theme_config.colors.primary}</span></li>
            <li>Font Family: <span style={getColorStyle('secondary')}>{tenant.settings.theme_config.typography.font_family}</span></li>
            <li>Domain: <span style={getColorStyle('accent')}>{tenant.domain}</span></li>
          </ul>
        </div>

        <div className="flex gap-3">
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

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div 
            className="h-8 rounded"
            style={{ backgroundColor: tenant.settings.theme_config.colors.primary }}
            title="Primary Color"
          />
          <div 
            className="h-8 rounded"
            style={{ backgroundColor: tenant.settings.theme_config.colors.secondary }}
            title="Secondary Color"
          />
          <div 
            className="h-8 rounded"
            style={{ backgroundColor: tenant.settings.theme_config.colors.accent }}
            title="Accent Color"
          />
        </div>
      </div>
    </div>
  )
}

export default TenantThemedCard
