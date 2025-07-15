import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TenantThemeConfig, defaultTenantTheme, sampleTenantThemes } from '@/config/tenant-themes'
import { TenantThemeAPIService, MockTenantThemeAPIService } from '@/services/tenant-theme-api'
import { ColorPaletteUpdateRequest, ColorPalette } from '@/types/tenant-theme-api'

type Theme = 'dark' | 'light' | 'system'

interface TenantThemeStore {
  // Current tenant
  currentTenant: string | null
  
  // Theme mode (dark/light/system)
  themeMode: Theme
  
  // Current tenant theme config
  currentThemeConfig: TenantThemeConfig
  
  // All available tenant themes
  tenantThemes: Record<string, TenantThemeConfig>
  
  // Available color palettes
  colorPalettes: ColorPalette[]
  
  // Loading states
  isLoading: boolean
  isSaving: boolean
  
  // Actions
  setTenant: (tenantId: string) => void
  setThemeMode: (mode: Theme) => void
  updateTenantTheme: (tenantId: string, config: TenantThemeConfig) => void
  getTenantTheme: (tenantId: string) => TenantThemeConfig | null
  applyTenantTheme: (tenantId: string, mode?: Theme) => void
  
  // API-based actions
  loadTenantThemeFromAPI: (tenantId: string) => Promise<void>
  updateColorPaletteAPI: (request: ColorPaletteUpdateRequest) => Promise<void>
  loadColorPalettes: () => Promise<void>
  generateColorPalette: (primaryColor: string) => Promise<ColorPalette>
  saveThemeToAPI: (tenantId: string, theme: TenantThemeConfig) => Promise<void>
  
  // Initialize tenant themes
  initializeTenantThemes: () => void
}

export const useTenantThemeStore = create<TenantThemeStore>()(
  persist(
    (set, get) => ({
      currentTenant: null,
      themeMode: 'system',
      currentThemeConfig: defaultTenantTheme,
      tenantThemes: {},
      colorPalettes: [],
      isLoading: false,
      isSaving: false,
      
      setTenant: (tenantId: string) => {
        const theme = get().tenantThemes[tenantId] || defaultTenantTheme
        set({ 
          currentTenant: tenantId,
          currentThemeConfig: theme
        })
        get().applyTenantTheme(tenantId, get().themeMode)
      },
      
      setThemeMode: (mode: Theme) => {
        set({ themeMode: mode })
        if (get().currentTenant) {
          get().applyTenantTheme(get().currentTenant!, mode)
        }
      },
      
      updateTenantTheme: (tenantId: string, config: TenantThemeConfig) => {
        set(state => ({
          tenantThemes: {
            ...state.tenantThemes,
            [tenantId]: config
          },
          currentThemeConfig: state.currentTenant === tenantId ? config : state.currentThemeConfig
        }))
        
        if (get().currentTenant === tenantId) {
          get().applyTenantTheme(tenantId, get().themeMode)
        }
      },
      
      getTenantTheme: (tenantId: string) => {
        return get().tenantThemes[tenantId] || null
      },
      
      // Load tenant theme from API
      loadTenantThemeFromAPI: async (tenantId: string) => {
        set({ isLoading: true })
        try {
          // Use mock service for development
          const isDev = import.meta.env.DEV
          const theme = isDev 
            ? (get().tenantThemes[tenantId] || defaultTenantTheme)
            : await TenantThemeAPIService.getTenantTheme(tenantId)
          
          set(state => ({
            tenantThemes: {
              ...state.tenantThemes,
              [tenantId]: theme
            },
            currentThemeConfig: state.currentTenant === tenantId ? theme : state.currentThemeConfig,
            isLoading: false
          }))
          
          if (get().currentTenant === tenantId) {
            get().applyTenantTheme(tenantId, get().themeMode)
          }
        } catch (error) {
          console.error('Failed to load tenant theme:', error)
          set({ isLoading: false })
        }
      },
      
      // Update color palette via API
      updateColorPaletteAPI: async (request: ColorPaletteUpdateRequest) => {
        set({ isSaving: true })
        try {
          // Use mock service for development
          const isDev = process.env.NODE_ENV === 'development'
          if (isDev) {
            await MockTenantThemeAPIService.updateColorPalette(request)
          } else {
            await TenantThemeAPIService.updateColorPalette(request)
          }
          
          // Update local state
          const currentTheme = get().tenantThemes[request.tenantId]
          if (currentTheme) {
            const updatedTheme = {
              ...currentTheme,
              theme: {
                ...currentTheme.theme,
                colors: { ...currentTheme.theme.colors, ...request.colors },
                darkMode: {
                  ...currentTheme.theme.darkMode,
                  colors: { ...currentTheme.theme.darkMode.colors, ...request.darkModeColors }
                }
              }
            }
            get().updateTenantTheme(request.tenantId, updatedTheme)
          }
          
          set({ isSaving: false })
        } catch (error) {
          console.error('Failed to update color palette:', error)
          set({ isSaving: false })
          throw error
        }
      },
      
      // Load available color palettes
      loadColorPalettes: async () => {
        set({ isLoading: true })
        try {
          // Use mock service for development
          const isDev = process.env.NODE_ENV === 'development'
          const palettes = isDev 
            ? await MockTenantThemeAPIService.getColorPalettes()
            : await TenantThemeAPIService.getColorPalettes()
          
          set({ colorPalettes: palettes, isLoading: false })
        } catch (error) {
          console.error('Failed to load color palettes:', error)
          set({ isLoading: false })
        }
      },
      
      // Generate color palette from primary color
      generateColorPalette: async (primaryColor: string) => {
        set({ isLoading: true })
        try {
          // Use mock service for development
          const isDev = process.env.NODE_ENV === 'development'
          const palette = isDev 
            ? await MockTenantThemeAPIService.generateColorPalette(primaryColor)
            : await TenantThemeAPIService.generateColorPalette(primaryColor)
          
          set({ isLoading: false })
          return palette
        } catch (error) {
          console.error('Failed to generate color palette:', error)
          set({ isLoading: false })
          throw error
        }
      },
      
      // Save theme to API
      saveThemeToAPI: async (tenantId: string, theme: TenantThemeConfig) => {
        set({ isSaving: true })
        try {
          // Use mock service for development
          const isDev = process.env.NODE_ENV === 'development'
          if (!isDev) {
            await TenantThemeAPIService.updateTenantTheme(tenantId, theme)
          }
          
          // Update local state
          get().updateTenantTheme(tenantId, theme)
          set({ isSaving: false })
        } catch (error) {
          console.error('Failed to save theme:', error)
          set({ isSaving: false })
          throw error
        }
      },
      
      applyTenantTheme: (tenantId: string, mode?: Theme) => {
        const themeConfig = get().tenantThemes[tenantId] || defaultTenantTheme
        const currentMode = mode || get().themeMode
        
        const root = document.documentElement
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        
        // Determine effective theme
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        const effectiveTheme = currentMode === 'system' ? systemTheme : currentMode
        
        // Apply theme classes
        root.classList.remove('light', 'dark')
        root.classList.add(effectiveTheme)
        
        // Apply colors based on theme mode
        const colors = effectiveTheme === 'dark' ? themeConfig.theme.darkMode.colors : themeConfig.theme.colors
        
        // Apply CSS custom properties
        const applyColorProperties = (colors: any) => {
          Object.entries(colors).forEach(([key, value]) => {
            const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
            root.style.setProperty(cssVarName, value as string)
          })
        }
        
        applyColorProperties(colors)
        
        // Apply typography
        root.style.setProperty('--font-family', themeConfig.theme.typography.fontFamily)
        
        // Apply spacing
        root.style.setProperty('--radius', themeConfig.theme.spacing.radius)
        
        // Apply custom CSS if provided
        if (themeConfig.customCSS) {
          let styleElement = document.getElementById('tenant-custom-styles')
          if (!styleElement) {
            styleElement = document.createElement('style')
            styleElement.id = 'tenant-custom-styles'
            document.head.appendChild(styleElement)
          }
          styleElement.textContent = themeConfig.customCSS
        }
        
        // Update favicon and title
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
        if (favicon) {
          favicon.href = themeConfig.theme.branding.favicon
        }
        
        document.title = `${themeConfig.theme.branding.companyName} - Admin Dashboard`
      },
      
      initializeTenantThemes: () => {
        const themes: Record<string, TenantThemeConfig> = {
          [defaultTenantTheme.tenantId]: defaultTenantTheme
        }
        
        // Add sample tenant themes
        sampleTenantThemes.forEach(theme => {
          themes[theme.tenantId] = theme
        })
        
        set({ tenantThemes: themes })
        
        // Load color palettes
        get().loadColorPalettes()
      }
    }),
    {
      name: 'tenant-theme-storage',
      partialize: (state) => ({
        currentTenant: state.currentTenant,
        themeMode: state.themeMode,
        tenantThemes: state.tenantThemes,
        colorPalettes: state.colorPalettes
      })
    }
  )
)
