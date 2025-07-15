export interface TenantConfig {
  id: number
  name: string
  domain: string
  settings: {
    timezone: string
    language: string
    theme: string
    features: {
      courses: boolean
      certificates: boolean
      payments: boolean
      notifications: boolean
    }
    branding: {
      logo: string | null
      primary_color: string
      secondary_color: string
      company_name?: string
      favicon?: string
    }
    theme_config: {
      mode: 'light' | 'dark' | 'auto'
      colors: {
        primary: string
        secondary: string
        accent: string
        background: string
        foreground: string
        card: string
        card_foreground: string
        popover: string
        popover_foreground: string
        muted: string
        muted_foreground: string
        border: string
        input: string
        ring: string
        destructive: string
        destructive_foreground: string
        success: string
        success_foreground: string
        warning: string
        warning_foreground: string
        info: string
        info_foreground: string
      }
      typography: {
        font_family: string
        font_sizes: {
          xs: string
          sm: string
          base: string
          lg: string
          xl: string
          '2xl': string
          '3xl': string
          '4xl': string
          '5xl': string
          '6xl': string
        }
        line_heights: {
          none: string
          tight: string
          snug: string
          normal: string
          relaxed: string
          loose: string
        }
        font_weights: {
          thin: string
          light: string
          normal: string
          medium: string
          semibold: string
          bold: string
          extrabold: string
          black: string
        }
      }
      border_radius: {
        none: string
        sm: string
        default: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
        full: string
      }
      shadows: {
        sm: string
        default: string
        md: string
        lg: string
        xl: string
        '2xl': string
        inner: string
        none: string
      }
      spacing: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
        '4xl': string
        '5xl': string
      }
    }
  }
}

export interface TenantDetectionResult {
  tenant: TenantConfig | null
  detectionMethod: 'subdomain' | 'path' | 'header' | 'localStorage' | 'default'
  isValid: boolean
  error?: string
}

export class TenantDetectionService {
  private static readonly DEFAULT_TENANT_DOMAIN = 'demo'
  private static readonly API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

  /**
   * Detect tenant from current URL
   */
  static detectTenantFromUrl(): TenantDetectionResult {
    const hostname = window.location.hostname
    const pathname = window.location.pathname
    
    // Method 1: Subdomain detection (e.g., acme-university.localhost:5173)
    if (hostname.includes('.') && !hostname.startsWith('localhost') && !hostname.startsWith('127.0.0.1')) {
      return {
        tenant: null, // Will be resolved later
        detectionMethod: 'subdomain',
        isValid: true
      }
    }

    // Method 2: Path-based detection (e.g., localhost:5173/tenant/acme-university)
    const pathMatch = pathname.match(/^\/tenant\/([^\/]+)/)
    if (pathMatch) {
      return {
        tenant: null, // Will be resolved later
        detectionMethod: 'path',
        isValid: true
      }
    }

    // Method 3: Query parameter (e.g., localhost:5173?tenant=acme-university)
    const urlParams = new URLSearchParams(window.location.search)
    const tenantParam = urlParams.get('tenant')
    if (tenantParam) {
      return {
        tenant: null, // Will be resolved later
        detectionMethod: 'header',
        isValid: true
      }
    }

    // Method 4: localStorage fallback
    const storedTenant = localStorage.getItem('current_tenant')
    if (storedTenant) {
      try {
        const tenant = JSON.parse(storedTenant)
        return {
          tenant,
          detectionMethod: 'localStorage',
          isValid: true
        }
      } catch (error) {
        console.warn('Invalid tenant data in localStorage:', error)
        localStorage.removeItem('current_tenant')
      }
    }

    // Default fallback
    return {
      tenant: null,
      detectionMethod: 'default',
      isValid: false,
      error: 'No tenant detected'
    }
  }

  /**
   * Get tenant domain from URL
   */
  static getTenantDomainFromUrl(): string {
    const hostname = window.location.hostname
    const pathname = window.location.pathname
    
    // Subdomain detection
    if (hostname.includes('.') && !hostname.startsWith('localhost') && !hostname.startsWith('127.0.0.1')) {
      return hostname.split('.')[0]
    }

    // Path-based detection
    const pathMatch = pathname.match(/^\/tenant\/([^\/]+)/)
    if (pathMatch) {
      return pathMatch[1]
    }

    // Query parameter
    const urlParams = new URLSearchParams(window.location.search)
    const tenantParam = urlParams.get('tenant')
    if (tenantParam) {
      return tenantParam
    }

    return this.DEFAULT_TENANT_DOMAIN
  }

  /**
   * Fetch tenant configuration from API
   */
  static async fetchTenantConfig(domain: string): Promise<TenantConfig | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/v1/tenants/domain/${domain}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch tenant config: ${response.status}`)
      }

      const data = await response.json()
      return data.tenant
    } catch (error) {
      console.error('Error fetching tenant config:', error)
      return null
    }
  }

  /**
   * Initialize tenant detection and configuration
   */
  static async initializeTenant(): Promise<TenantDetectionResult> {
    const detection = this.detectTenantFromUrl()
    const domain = this.getTenantDomainFromUrl()

    if (!domain) {
      return {
        ...detection,
        isValid: false,
        error: 'No tenant domain found'
      }
    }

    // Fetch tenant configuration from API
    const tenantConfig = await this.fetchTenantConfig(domain)
    
    if (!tenantConfig) {
      return {
        ...detection,
        isValid: false,
        error: `Tenant not found for domain: ${domain}`
      }
    }

    // Store in localStorage for future use
    localStorage.setItem('current_tenant', JSON.stringify(tenantConfig))

    return {
      ...detection,
      tenant: tenantConfig,
      isValid: true
    }
  }

  /**
   * Apply tenant branding to the page
   */
  static applyTenantBranding(tenant: TenantConfig): void {
    const { branding, theme_config } = tenant.settings

    // Apply CSS custom properties for theming
    const root = document.documentElement
    
    // Legacy branding colors (for backward compatibility)
    root.style.setProperty('--tenant-primary-color', branding.primary_color)
    root.style.setProperty('--tenant-secondary-color', branding.secondary_color)

    // Apply comprehensive theme configuration
    if (theme_config) {
      // Theme mode
      root.setAttribute('data-theme', theme_config.mode)

      // Color system
      Object.entries(theme_config.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key.replace('_', '-')}`, value)
      })

      // Typography
      root.style.setProperty('--font-family', theme_config.typography.font_family)
      Object.entries(theme_config.typography.font_sizes).forEach(([key, value]) => {
        root.style.setProperty(`--text-${key}`, value)
      })
      Object.entries(theme_config.typography.line_heights).forEach(([key, value]) => {
        root.style.setProperty(`--leading-${key}`, value)
      })
      Object.entries(theme_config.typography.font_weights).forEach(([key, value]) => {
        root.style.setProperty(`--font-${key}`, value)
      })

      // Border radius
      Object.entries(theme_config.border_radius).forEach(([key, value]) => {
        const cssKey = key === 'default' ? 'radius' : `radius-${key}`
        root.style.setProperty(`--${cssKey}`, value)
      })

      // Shadows
      Object.entries(theme_config.shadows).forEach(([key, value]) => {
        const cssKey = key === 'default' ? 'shadow' : `shadow-${key}`
        root.style.setProperty(`--${cssKey}`, value)
      })

      // Spacing
      Object.entries(theme_config.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value)
      })
    }

    // Update page title
    if (branding.company_name) {
      document.title = `${branding.company_name} - LMS`
    } else {
      document.title = `${tenant.name} - LMS`
    }

    // Update favicon if provided
    if (branding.favicon) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (favicon) {
        favicon.href = branding.favicon
      } else {
        const newFavicon = document.createElement('link')
        newFavicon.rel = 'icon'
        newFavicon.href = branding.favicon
        document.head.appendChild(newFavicon)
      }
    }

    // Apply theme class to body
    document.body.className = `theme-${tenant.settings.theme} ${theme_config?.mode || 'light'}-mode`
  }

  /**
   * Get current tenant from localStorage
   */
  static getCurrentTenant(): TenantConfig | null {
    const stored = localStorage.getItem('current_tenant')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.warn('Invalid tenant data in localStorage:', error)
        localStorage.removeItem('current_tenant')
      }
    }
    return null
  }

  /**
   * Clear current tenant data
   */
  static clearTenantData(): void {
    localStorage.removeItem('current_tenant')
  }
}
