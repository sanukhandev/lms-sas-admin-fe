// API endpoints for tenant theme management
export const TENANT_THEME_API_ENDPOINTS = {
  // Get tenant theme
  getTenantTheme: (tenantId: string) => `/api/tenants/${tenantId}/theme`,
  
  // Update tenant theme
  updateTenantTheme: (tenantId: string) => `/api/tenants/${tenantId}/theme`,
  
  // Get color palettes
  getColorPalettes: () => `/api/theme/color-palettes`,
  
  // Update color palette
  updateColorPalette: (tenantId: string) => `/api/tenants/${tenantId}/theme/colors`,
  
  // Preset themes
  getPresetThemes: () => `/api/theme/presets`,
  
  // Save custom theme
  saveCustomTheme: (tenantId: string) => `/api/tenants/${tenantId}/theme/custom`,
}

// Color palette update request types
export interface ColorPaletteUpdateRequest {
  tenantId: string
  colors: {
    primary?: string
    secondary?: string
    accent?: string
    background?: string
    foreground?: string
    card?: string
    cardForeground?: string
    popover?: string
    popoverForeground?: string
    muted?: string
    mutedForeground?: string
    border?: string
    input?: string
    ring?: string
    destructive?: string
    // Chart colors
    chart1?: string
    chart2?: string
    chart3?: string
    chart4?: string
    chart5?: string
    // Sidebar colors
    sidebar?: string
    sidebarForeground?: string
    sidebarPrimary?: string
    sidebarPrimaryForeground?: string
    sidebarAccent?: string
    sidebarAccentForeground?: string
    sidebarBorder?: string
    sidebarRing?: string
  }
  darkModeColors?: {
    primary?: string
    secondary?: string
    accent?: string
    background?: string
    foreground?: string
    card?: string
    cardForeground?: string
    popover?: string
    popoverForeground?: string
    muted?: string
    mutedForeground?: string
    border?: string
    input?: string
    ring?: string
    destructive?: string
    // Chart colors
    chart1?: string
    chart2?: string
    chart3?: string
    chart4?: string
    chart5?: string
    // Sidebar colors
    sidebar?: string
    sidebarForeground?: string
    sidebarPrimary?: string
    sidebarPrimaryForeground?: string
    sidebarAccent?: string
    sidebarAccentForeground?: string
    sidebarBorder?: string
    sidebarRing?: string
  }
}

// Preset color palettes
export interface ColorPalette {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    [key: string]: string
  }
  darkModeColors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    [key: string]: string
  }
  preview: string // Base64 image or CSS gradient
}

// API response types
export interface TenantThemeResponse {
  success: boolean
  data: {
    tenantId: string
    theme: any
    updatedAt: string
    version: string
  }
  message?: string
}

export interface ColorPalettesResponse {
  success: boolean
  data: {
    palettes: ColorPalette[]
    categories: string[]
  }
  message?: string
}
