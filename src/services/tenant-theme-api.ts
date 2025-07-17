import axios from 'axios'
import { TenantThemeConfig } from '@/config/tenant-themes'
import {
  TENANT_THEME_API_ENDPOINTS,
  ColorPaletteUpdateRequest,
  ColorPalette,
  TenantThemeResponse,
  ColorPalettesResponse,
} from '@/types/tenant-theme-api'

// Enhanced API service with color palette management
export class TenantThemeAPIService {
  private static apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Add auth token to requests
  static setAuthToken(token: string) {
    this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  // Set tenant context for requests
  static setTenantContext(tenantId: string, domain: string) {
    this.apiClient.defaults.headers.common['X-Tenant-ID'] = tenantId
    this.apiClient.defaults.headers.common['X-Tenant-Domain'] = domain
  }

  // Initialize with auth and tenant context
  static initialize(token: string, tenantId: string, domain: string) {
    this.setAuthToken(token)
    this.setTenantContext(tenantId, domain)
  }

  // Get authentication token from localStorage or session storage
  static getStoredAuthToken(): string | null {
    return (
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    )
  }

  // Get tenant context from localStorage or session storage
  static getStoredTenantContext(): { tenantId: string; domain: string } | null {
    const tenantId =
      localStorage.getItem('tenantId') || sessionStorage.getItem('tenantId')
    const domain =
      localStorage.getItem('tenantDomain') ||
      sessionStorage.getItem('tenantDomain')

    if (tenantId && domain) {
      return { tenantId, domain }
    }
    return null
  }

  // Auto-initialize from stored values
  static autoInitialize(): boolean {
    const token = this.getStoredAuthToken()
    const tenantContext = this.getStoredTenantContext()

    if (token && tenantContext) {
      this.initialize(token, tenantContext.tenantId, tenantContext.domain)
      return true
    }
    return false
  }

  // Initialize with manual token and tenant context (for testing)
  static initializeManually(
    token: string,
    tenantId: string,
    domain: string
  ): void {
    this.initialize(token, tenantId, domain)
  }

  // Test function to verify API connection
  static async testColorPalettesAPI(): Promise<boolean> {
    try {
      // Try to initialize with known values for testing
      this.initializeManually(
        '2|hmi2QveT1j2dbPTuexCZz0rLvdU71tgyjDDdSiLA3df96ce7',
        '1',
        'demo'
      )

      const palettes = await this.getColorPalettes()
      return palettes.length > 0
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('API test failed:', error)
      return false
    }
  }

  // Get tenant theme configuration
  static async getTenantTheme(tenantId: string): Promise<TenantThemeConfig> {
    try {
      const response = await this.apiClient.get<TenantThemeResponse>(
        TENANT_THEME_API_ENDPOINTS.getTenantTheme(tenantId)
      )
      return response.data.data.theme
    } catch (error) {
      console.error('Error fetching tenant theme:', error)
      throw new Error('Failed to fetch tenant theme')
    }
  }

  // Update entire tenant theme
  static async updateTenantTheme(
    tenantId: string,
    theme: TenantThemeConfig
  ): Promise<void> {
    try {
      await this.apiClient.put(
        TENANT_THEME_API_ENDPOINTS.updateTenantTheme(tenantId),
        { theme }
      )
    } catch (error) {
      console.error('Error updating tenant theme:', error)
      throw new Error('Failed to update tenant theme')
    }
  }

  // Update only color palette
  static async updateColorPalette(
    request: ColorPaletteUpdateRequest
  ): Promise<void> {
    try {
      await this.apiClient.patch(
        TENANT_THEME_API_ENDPOINTS.updateColorPalette(request.tenantId),
        {
          colors: request.colors,
          darkModeColors: request.darkModeColors,
        }
      )
    } catch (error) {
      console.error('Error updating color palette:', error)
      throw new Error('Failed to update color palette')
    }
  }

  // Get available color palettes
  static async getColorPalettes(): Promise<ColorPalette[]> {
    try {
      // Auto-initialize if not already done
      if (!this.apiClient.defaults.headers.common['Authorization']) {
        this.autoInitialize()
      }

      // Ensure we have auth token and tenant context
      const authToken =
        this.apiClient.defaults.headers.common['Authorization'] ||
        this.getStoredAuthToken()
      const tenantContext = this.getStoredTenantContext()

      if (!authToken) {
        throw new Error('No authentication token available')
      }

      if (!tenantContext) {
        throw new Error('No tenant context available')
      }

      // Clean up auth token if it's already prefixed with Bearer
      const cleanToken =
        typeof authToken === 'string'
          ? authToken.replace('Bearer ', '')
          : String(authToken)

      const response = await this.apiClient.get<ColorPalettesResponse>(
        TENANT_THEME_API_ENDPOINTS.getColorPalettes(),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cleanToken}`,
            'X-Tenant-ID': tenantContext.tenantId,
            'X-Tenant-Domain': tenantContext.domain,
          },
        }
      )
      return response.data.data.palettes
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching color palettes:', error)
      throw new Error('Failed to fetch color palettes')
    }
  }

  // Get preset themes
  static async getPresetThemes(): Promise<TenantThemeConfig[]> {
    try {
      // Auto-initialize if not already done
      if (!this.apiClient.defaults.headers.common['Authorization']) {
        this.autoInitialize()
      }

      // Ensure we have auth token and tenant context
      const authToken =
        this.apiClient.defaults.headers.common['Authorization'] ||
        this.getStoredAuthToken()
      const tenantContext = this.getStoredTenantContext()

      if (!authToken) {
        throw new Error('No authentication token available')
      }

      if (!tenantContext) {
        throw new Error('No tenant context available')
      }

      // Clean up auth token if it's already prefixed with Bearer
      const cleanToken =
        typeof authToken === 'string'
          ? authToken.replace('Bearer ', '')
          : String(authToken)

      const response = await this.apiClient.get(
        TENANT_THEME_API_ENDPOINTS.getPresetThemes(),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cleanToken}`,
            'X-Tenant-ID': tenantContext.tenantId,
            'X-Tenant-Domain': tenantContext.domain,
          },
        }
      )
      return response.data.data.presets
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching preset themes:', error)
      throw new Error('Failed to fetch preset themes')
    }
  }

  // Save custom theme
  static async saveCustomTheme(
    tenantId: string,
    theme: TenantThemeConfig
  ): Promise<void> {
    try {
      await this.apiClient.post(
        TENANT_THEME_API_ENDPOINTS.saveCustomTheme(tenantId),
        { theme }
      )
    } catch (error) {
      console.error('Error saving custom theme:', error)
      throw new Error('Failed to save custom theme')
    }
  }

  // Generate color palette from primary color
  static async generateColorPalette(
    primaryColor: string
  ): Promise<ColorPalette> {
    try {
      const response = await this.apiClient.post('/v1/theme/generate-palette', {
        primaryColor,
      })
      return response.data.data.palette
    } catch (error) {
      console.error('Error generating color palette:', error)
      throw new Error('Failed to generate color palette')
    }
  }

  // Preview color changes without saving
  static async previewColorPalette(
    _tenantId: string,
    colors: Record<string, string>
  ): Promise<string> {
    try {
      const response = await this.apiClient.post(
        `/v1/tenant/settings/theme/preview`,
        { colors }
      )
      return response.data.data.cssVariables
    } catch (error) {
      console.error('Error previewing color palette:', error)
      throw new Error('Failed to preview color palette')
    }
  }

  // Bulk update multiple tenant themes
  static async bulkUpdateTenantThemes(
    updates: Array<{
      tenantId: string
      theme: Partial<TenantThemeConfig>
    }>
  ): Promise<void> {
    try {
      await this.apiClient.post('/v1/theme/bulk-update', {
        updates,
      })
    } catch (error) {
      console.error('Error bulk updating tenant themes:', error)
      throw new Error('Failed to bulk update tenant themes')
    }
  }

  // Get theme usage analytics
  static async getThemeAnalytics(
    _tenantId: string
  ): Promise<Record<string, unknown>> {
    try {
      const response = await this.apiClient.get(
        `/v1/tenant/settings/theme/analytics`
      )
      return response.data.data
    } catch (error) {
      console.error('Error fetching theme analytics:', error)
      throw new Error('Failed to fetch theme analytics')
    }
  }
}

// Mock API responses for development
export class MockTenantThemeAPIService {
  private static mockPalettes: ColorPalette[] = [
    {
      id: 'corporate-blue',
      name: 'Corporate Blue',
      description: 'Professional blue theme for corporate applications',
      colors: {
        primary: 'oklch(0.55 0.24 262.4)',
        secondary: 'oklch(0.968 0.007 247.896)',
        accent: 'oklch(0.55 0.24 262.4)',
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0.129 0.042 264.695)',
        card: 'oklch(1 0 0)',
        cardForeground: 'oklch(0.129 0.042 264.695)',
        border: 'oklch(0.929 0.013 255.508)',
        input: 'oklch(0.929 0.013 255.508)',
        ring: 'oklch(0.55 0.24 262.4)',
        destructive: 'oklch(0.577 0.245 27.325)',
        muted: 'oklch(0.968 0.007 247.896)',
        mutedForeground: 'oklch(0.554 0.046 257.417)',
        popover: 'oklch(1 0 0)',
        popoverForeground: 'oklch(0.129 0.042 264.695)',
        chart1: 'oklch(0.646 0.222 41.116)',
        chart2: 'oklch(0.6 0.118 184.704)',
        chart3: 'oklch(0.398 0.07 227.392)',
        chart4: 'oklch(0.828 0.189 84.429)',
        chart5: 'oklch(0.769 0.188 70.08)',
        sidebar: 'oklch(1 0 0)',
        sidebarForeground: 'oklch(0.129 0.042 264.695)',
        sidebarPrimary: 'oklch(0.55 0.24 262.4)',
        sidebarPrimaryForeground: 'oklch(0.984 0.003 247.858)',
        sidebarAccent: 'oklch(0.968 0.007 247.896)',
        sidebarAccentForeground: 'oklch(0.208 0.042 265.755)',
        sidebarBorder: 'oklch(0.929 0.013 255.508)',
        sidebarRing: 'oklch(0.55 0.24 262.4)',
      },
      darkModeColors: {
        primary: 'oklch(0.75 0.2 262.4)',
        secondary: 'oklch(0.208 0.042 265.755)',
        accent: 'oklch(0.4 0.2 262.4)',
        background: 'oklch(0.129 0.042 264.695)',
        foreground: 'oklch(0.984 0.003 247.858)',
        card: 'oklch(0.14 0.04 259.21)',
        cardForeground: 'oklch(0.984 0.003 247.858)',
        border: 'oklch(0.208 0.042 265.755)',
        input: 'oklch(0.208 0.042 265.755)',
        ring: 'oklch(0.75 0.2 262.4)',
        destructive: 'oklch(0.703 0.251 29.233)',
        muted: 'oklch(0.208 0.042 265.755)',
        mutedForeground: 'oklch(0.663 0.043 257.099)',
        popover: 'oklch(0.208 0.042 265.755)',
        popoverForeground: 'oklch(0.984 0.003 247.858)',
        chart1: 'oklch(0.646 0.222 41.116)',
        chart2: 'oklch(0.6 0.118 184.704)',
        chart3: 'oklch(0.398 0.07 227.392)',
        chart4: 'oklch(0.828 0.189 84.429)',
        chart5: 'oklch(0.769 0.188 70.08)',
        sidebar: 'oklch(0.129 0.042 264.695)',
        sidebarForeground: 'oklch(0.984 0.003 247.858)',
        sidebarPrimary: 'oklch(0.75 0.2 262.4)',
        sidebarPrimaryForeground: 'oklch(0.208 0.042 265.755)',
        sidebarAccent: 'oklch(0.208 0.042 265.755)',
        sidebarAccentForeground: 'oklch(0.984 0.003 247.858)',
        sidebarBorder: 'oklch(0.208 0.042 265.755)',
        sidebarRing: 'oklch(0.75 0.2 262.4)',
      },
      preview: 'linear-gradient(45deg, #3b82f6, #1e40af)',
    },
    {
      id: 'nature-green',
      name: 'Nature Green',
      description: 'Fresh green theme for eco-friendly applications',
      colors: {
        primary: 'oklch(0.55 0.15 142.5)',
        secondary: 'oklch(0.968 0.007 247.896)',
        accent: 'oklch(0.55 0.15 142.5)',
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0.129 0.042 264.695)',
        card: 'oklch(1 0 0)',
        cardForeground: 'oklch(0.129 0.042 264.695)',
        border: 'oklch(0.929 0.013 255.508)',
        input: 'oklch(0.929 0.013 255.508)',
        ring: 'oklch(0.55 0.15 142.5)',
        destructive: 'oklch(0.577 0.245 27.325)',
        muted: 'oklch(0.968 0.007 247.896)',
        mutedForeground: 'oklch(0.554 0.046 257.417)',
        popover: 'oklch(1 0 0)',
        popoverForeground: 'oklch(0.129 0.042 264.695)',
        chart1: 'oklch(0.646 0.222 41.116)',
        chart2: 'oklch(0.6 0.118 184.704)',
        chart3: 'oklch(0.398 0.07 227.392)',
        chart4: 'oklch(0.828 0.189 84.429)',
        chart5: 'oklch(0.769 0.188 70.08)',
        sidebar: 'oklch(1 0 0)',
        sidebarForeground: 'oklch(0.129 0.042 264.695)',
        sidebarPrimary: 'oklch(0.55 0.15 142.5)',
        sidebarPrimaryForeground: 'oklch(0.984 0.003 247.858)',
        sidebarAccent: 'oklch(0.968 0.007 247.896)',
        sidebarAccentForeground: 'oklch(0.208 0.042 265.755)',
        sidebarBorder: 'oklch(0.929 0.013 255.508)',
        sidebarRing: 'oklch(0.55 0.15 142.5)',
      },
      darkModeColors: {
        primary: 'oklch(0.75 0.12 142.5)',
        secondary: 'oklch(0.208 0.042 265.755)',
        accent: 'oklch(0.4 0.12 142.5)',
        background: 'oklch(0.129 0.042 264.695)',
        foreground: 'oklch(0.984 0.003 247.858)',
        card: 'oklch(0.14 0.04 259.21)',
        cardForeground: 'oklch(0.984 0.003 247.858)',
        border: 'oklch(0.208 0.042 265.755)',
        input: 'oklch(0.208 0.042 265.755)',
        ring: 'oklch(0.75 0.12 142.5)',
        destructive: 'oklch(0.703 0.251 29.233)',
        muted: 'oklch(0.208 0.042 265.755)',
        mutedForeground: 'oklch(0.663 0.043 257.099)',
        popover: 'oklch(0.208 0.042 265.755)',
        popoverForeground: 'oklch(0.984 0.003 247.858)',
        chart1: 'oklch(0.646 0.222 41.116)',
        chart2: 'oklch(0.6 0.118 184.704)',
        chart3: 'oklch(0.398 0.07 227.392)',
        chart4: 'oklch(0.828 0.189 84.429)',
        chart5: 'oklch(0.769 0.188 70.08)',
        sidebar: 'oklch(0.129 0.042 264.695)',
        sidebarForeground: 'oklch(0.984 0.003 247.858)',
        sidebarPrimary: 'oklch(0.75 0.12 142.5)',
        sidebarPrimaryForeground: 'oklch(0.208 0.042 265.755)',
        sidebarAccent: 'oklch(0.208 0.042 265.755)',
        sidebarAccentForeground: 'oklch(0.984 0.003 247.858)',
        sidebarBorder: 'oklch(0.208 0.042 265.755)',
        sidebarRing: 'oklch(0.75 0.12 142.5)',
      },
      preview: 'linear-gradient(45deg, #10b981, #059669)',
    },
  ]

  static async getColorPalettes(): Promise<ColorPalette[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return this.mockPalettes
  }

  static async updateColorPalette(
    request: ColorPaletteUpdateRequest
  ): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log('Mock API: Updated color palette for tenant:', request.tenantId)
  }

  static async generateColorPalette(
    primaryColor: string
  ): Promise<ColorPalette> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Mock generated palette
    return {
      id: 'generated-' + Date.now(),
      name: 'Generated Palette',
      description: `Auto-generated palette from ${primaryColor}`,
      colors: {
        primary: primaryColor,
        secondary: 'oklch(0.968 0.007 247.896)',
        accent: primaryColor,
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0.129 0.042 264.695)',
        card: 'oklch(1 0 0)',
        cardForeground: 'oklch(0.129 0.042 264.695)',
        border: 'oklch(0.929 0.013 255.508)',
        input: 'oklch(0.929 0.013 255.508)',
        ring: primaryColor,
        destructive: 'oklch(0.577 0.245 27.325)',
        muted: 'oklch(0.968 0.007 247.896)',
        mutedForeground: 'oklch(0.554 0.046 257.417)',
        popover: 'oklch(1 0 0)',
        popoverForeground: 'oklch(0.129 0.042 264.695)',
        chart1: 'oklch(0.646 0.222 41.116)',
        chart2: 'oklch(0.6 0.118 184.704)',
        chart3: 'oklch(0.398 0.07 227.392)',
        chart4: 'oklch(0.828 0.189 84.429)',
        chart5: 'oklch(0.769 0.188 70.08)',
        sidebar: 'oklch(1 0 0)',
        sidebarForeground: 'oklch(0.129 0.042 264.695)',
        sidebarPrimary: primaryColor,
        sidebarPrimaryForeground: 'oklch(0.984 0.003 247.858)',
        sidebarAccent: 'oklch(0.968 0.007 247.896)',
        sidebarAccentForeground: 'oklch(0.208 0.042 265.755)',
        sidebarBorder: 'oklch(0.929 0.013 255.508)',
        sidebarRing: primaryColor,
      },
      darkModeColors: {
        primary: primaryColor,
        secondary: 'oklch(0.208 0.042 265.755)',
        accent: primaryColor,
        background: 'oklch(0.129 0.042 264.695)',
        foreground: 'oklch(0.984 0.003 247.858)',
        card: 'oklch(0.14 0.04 259.21)',
        cardForeground: 'oklch(0.984 0.003 247.858)',
        border: 'oklch(0.208 0.042 265.755)',
        input: 'oklch(0.208 0.042 265.755)',
        ring: primaryColor,
        destructive: 'oklch(0.703 0.251 29.233)',
        muted: 'oklch(0.208 0.042 265.755)',
        mutedForeground: 'oklch(0.663 0.043 257.099)',
        popover: 'oklch(0.208 0.042 265.755)',
        popoverForeground: 'oklch(0.984 0.003 247.858)',
        chart1: 'oklch(0.646 0.222 41.116)',
        chart2: 'oklch(0.6 0.118 184.704)',
        chart3: 'oklch(0.398 0.07 227.392)',
        chart4: 'oklch(0.828 0.189 84.429)',
        chart5: 'oklch(0.769 0.188 70.08)',
        sidebar: 'oklch(0.129 0.042 264.695)',
        sidebarForeground: 'oklch(0.984 0.003 247.858)',
        sidebarPrimary: primaryColor,
        sidebarPrimaryForeground: 'oklch(0.208 0.042 265.755)',
        sidebarAccent: 'oklch(0.208 0.042 265.755)',
        sidebarAccentForeground: 'oklch(0.984 0.003 247.858)',
        sidebarBorder: 'oklch(0.208 0.042 265.755)',
        sidebarRing: primaryColor,
      },
      preview: `linear-gradient(45deg, ${primaryColor}, ${primaryColor}aa)`,
    }
  }
}
