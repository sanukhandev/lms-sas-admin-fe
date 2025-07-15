import { TenantThemeConfig } from '@/config/tenant-themes'

// Mock API service for tenant themes
export class TenantThemeService {
  private static readonly STORAGE_KEY = 'tenant-themes-cache'
  private static readonly API_BASE_URL = '/api/tenant-themes'

  // Get tenant theme by ID
  static async getTenantTheme(tenantId: string): Promise<TenantThemeConfig | null> {
    try {
      // In production, this would be an API call
      const response = await fetch(`${this.API_BASE_URL}/${tenantId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tenant theme')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching tenant theme:', error)
      
      // Fallback to localStorage for demo
      const cached = this.getCachedTenantThemes()
      return cached[tenantId] || null
    }
  }

  // Get all tenant themes
  static async getAllTenantThemes(): Promise<Record<string, TenantThemeConfig>> {
    try {
      const response = await fetch(this.API_BASE_URL)
      if (!response.ok) {
        throw new Error('Failed to fetch tenant themes')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching tenant themes:', error)
      return this.getCachedTenantThemes()
    }
  }

  // Save tenant theme
  static async saveTenantTheme(theme: TenantThemeConfig): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/${theme.tenantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(theme),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save tenant theme')
      }
    } catch (error) {
      console.error('Error saving tenant theme:', error)
      
      // Fallback to localStorage for demo
      const cached = this.getCachedTenantThemes()
      cached[theme.tenantId] = theme
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cached))
    }
  }

  // Delete tenant theme
  static async deleteTenantTheme(tenantId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/${tenantId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete tenant theme')
      }
    } catch (error) {
      console.error('Error deleting tenant theme:', error)
      
      // Fallback to localStorage for demo
      const cached = this.getCachedTenantThemes()
      delete cached[tenantId]
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cached))
    }
  }

  // Get cached tenant themes from localStorage
  private static getCachedTenantThemes(): Record<string, TenantThemeConfig> {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY)
      return cached ? JSON.parse(cached) : {}
    } catch (error) {
      console.error('Error reading cached tenant themes:', error)
      return {}
    }
  }

  // Cache tenant themes to localStorage
  static cacheTenantThemes(themes: Record<string, TenantThemeConfig>): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(themes))
    } catch (error) {
      console.error('Error caching tenant themes:', error)
    }
  }

  // Detect tenant from subdomain or URL
  static detectTenantFromUrl(): string | null {
    const hostname = window.location.hostname
    const subdomain = hostname.split('.')[0]
    
    // Check if it's a subdomain (not localhost or IP)
    if (subdomain && subdomain !== 'localhost' && subdomain !== 'www' && !hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      return subdomain
    }
    
    // Check URL path for tenant ID
    const pathParts = window.location.pathname.split('/')
    if (pathParts[1] === 'tenant' && pathParts[2]) {
      return pathParts[2]
    }
    
    return null
  }

  // Generate CSS variables from theme config
  static generateCSSVariables(theme: TenantThemeConfig, isDark: boolean = false): string {
    const colors = isDark ? theme.theme.darkMode.colors : theme.theme.colors
    
    let css = ':root {\n'
    css += `  --radius: ${theme.theme.spacing.radius};\n`
    css += `  --font-family: ${theme.theme.typography.fontFamily};\n`
    
    // Add color variables
    Object.entries(colors).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      css += `  ${cssVarName}: ${value};\n`
    })
    
    css += '}\n'
    
    // Add custom CSS if provided
    if (theme.customCSS) {
      css += '\n' + theme.customCSS
    }
    
    return css
  }

  // Preview theme changes without applying
  static previewTheme(theme: TenantThemeConfig, isDark: boolean = false): void {
    const css = this.generateCSSVariables(theme, isDark)
    
    let previewStyle = document.getElementById('theme-preview')
    if (!previewStyle) {
      previewStyle = document.createElement('style')
      previewStyle.id = 'theme-preview'
      document.head.appendChild(previewStyle)
    }
    
    previewStyle.textContent = css
  }

  // Remove theme preview
  static removeThemePreview(): void {
    const previewStyle = document.getElementById('theme-preview')
    if (previewStyle) {
      previewStyle.remove()
    }
  }
}
