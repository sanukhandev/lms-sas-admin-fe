// Multi-tenant theme configuration types
export interface TenantThemeConfig {
  tenantId: string
  tenantName: string
  theme: {
    colors: {
      primary: string
      secondary: string
      accent: string
      background: string
      foreground: string
      card: string
      cardForeground: string
      popover: string
      popoverForeground: string
      muted: string
      mutedForeground: string
      border: string
      input: string
      ring: string
      destructive: string
      // Chart colors
      chart1: string
      chart2: string
      chart3: string
      chart4: string
      chart5: string
      // Sidebar colors
      sidebar: string
      sidebarForeground: string
      sidebarPrimary: string
      sidebarPrimaryForeground: string
      sidebarAccent: string
      sidebarAccentForeground: string
      sidebarBorder: string
      sidebarRing: string
    }
    darkMode: {
      colors: {
        primary: string
        secondary: string
        accent: string
        background: string
        foreground: string
        card: string
        cardForeground: string
        popover: string
        popoverForeground: string
        muted: string
        mutedForeground: string
        border: string
        input: string
        ring: string
        destructive: string
        // Chart colors
        chart1: string
        chart2: string
        chart3: string
        chart4: string
        chart5: string
        // Sidebar colors
        sidebar: string
        sidebarForeground: string
        sidebarPrimary: string
        sidebarPrimaryForeground: string
        sidebarAccent: string
        sidebarAccentForeground: string
        sidebarBorder: string
        sidebarRing: string
      }
    }
    typography: {
      fontFamily: string
      fontSize: {
        xs: string
        sm: string
        base: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
        '4xl': string
      }
      fontWeight: {
        normal: string
        medium: string
        semibold: string
        bold: string
      }
    }
    spacing: {
      radius: string
    }
    branding: {
      logo: string
      favicon: string
      companyName: string
      brandColor: string
    }
  }
  customCSS?: string
}

// Default theme configuration
export const defaultTenantTheme: TenantThemeConfig = {
  tenantId: 'default',
  tenantName: 'Default',
  theme: {
    colors: {
      primary: 'oklch(0.208 0.042 265.755)',
      secondary: 'oklch(0.968 0.007 247.896)',
      accent: 'oklch(0.968 0.007 247.896)',
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.129 0.042 264.695)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.129 0.042 264.695)',
      popover: 'oklch(1 0 0)',
      popoverForeground: 'oklch(0.129 0.042 264.695)',
      muted: 'oklch(0.968 0.007 247.896)',
      mutedForeground: 'oklch(0.554 0.046 257.417)',
      border: 'oklch(0.929 0.013 255.508)',
      input: 'oklch(0.929 0.013 255.508)',
      ring: 'oklch(0.704 0.04 256.788)',
      destructive: 'oklch(0.577 0.245 27.325)',
      chart1: 'oklch(0.646 0.222 41.116)',
      chart2: 'oklch(0.6 0.118 184.704)',
      chart3: 'oklch(0.398 0.07 227.392)',
      chart4: 'oklch(0.828 0.189 84.429)',
      chart5: 'oklch(0.769 0.188 70.08)',
      sidebar: 'oklch(1 0 0)',
      sidebarForeground: 'oklch(0.129 0.042 264.695)',
      sidebarPrimary: 'oklch(0.208 0.042 265.755)',
      sidebarPrimaryForeground: 'oklch(0.984 0.003 247.858)',
      sidebarAccent: 'oklch(0.968 0.007 247.896)',
      sidebarAccentForeground: 'oklch(0.208 0.042 265.755)',
      sidebarBorder: 'oklch(0.929 0.013 255.508)',
      sidebarRing: 'oklch(0.704 0.04 256.788)',
    },
    darkMode: {
      colors: {
        primary: 'oklch(0.929 0.013 255.508)',
        secondary: 'oklch(0.208 0.042 265.755)',
        accent: 'oklch(0.208 0.042 265.755)',
        background: 'oklch(0.129 0.042 264.695)',
        foreground: 'oklch(0.984 0.003 247.858)',
        card: 'oklch(0.14 0.04 259.21)',
        cardForeground: 'oklch(0.984 0.003 247.858)',
        popover: 'oklch(0.208 0.042 265.755)',
        popoverForeground: 'oklch(0.984 0.003 247.858)',
        muted: 'oklch(0.208 0.042 265.755)',
        mutedForeground: 'oklch(0.663 0.043 257.099)',
        border: 'oklch(0.208 0.042 265.755)',
        input: 'oklch(0.208 0.042 265.755)',
        ring: 'oklch(0.704 0.04 256.788)',
        destructive: 'oklch(0.703 0.251 29.233)',
        chart1: 'oklch(0.646 0.222 41.116)',
        chart2: 'oklch(0.6 0.118 184.704)',
        chart3: 'oklch(0.398 0.07 227.392)',
        chart4: 'oklch(0.828 0.189 84.429)',
        chart5: 'oklch(0.769 0.188 70.08)',
        sidebar: 'oklch(0.129 0.042 264.695)',
        sidebarForeground: 'oklch(0.984 0.003 247.858)',
        sidebarPrimary: 'oklch(0.929 0.013 255.508)',
        sidebarPrimaryForeground: 'oklch(0.208 0.042 265.755)',
        sidebarAccent: 'oklch(0.208 0.042 265.755)',
        sidebarAccentForeground: 'oklch(0.984 0.003 247.858)',
        sidebarBorder: 'oklch(0.208 0.042 265.755)',
        sidebarRing: 'oklch(0.704 0.04 256.788)',
      }
    },
    typography: {
      fontFamily: 'system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      }
    },
    spacing: {
      radius: '0.625rem',
    },
    branding: {
      logo: '/logo.svg',
      favicon: '/favicon.ico',
      companyName: 'ShadCN Admin',
      brandColor: 'oklch(0.208 0.042 265.755)',
    }
  }
}

// Sample tenant themes
export const sampleTenantThemes: TenantThemeConfig[] = [
  {
    tenantId: 'tenant-1',
    tenantName: 'Acme Corp',
    theme: {
      ...defaultTenantTheme.theme,
      colors: {
        ...defaultTenantTheme.theme.colors,
        primary: 'oklch(0.55 0.24 262.4)', // Blue
        accent: 'oklch(0.55 0.24 262.4)',
        ring: 'oklch(0.55 0.24 262.4)',
      },
      darkMode: {
        ...defaultTenantTheme.theme.darkMode,
        colors: {
          ...defaultTenantTheme.theme.darkMode.colors,
          primary: 'oklch(0.75 0.2 262.4)',
          accent: 'oklch(0.4 0.2 262.4)',
          ring: 'oklch(0.75 0.2 262.4)',
        }
      },
      branding: {
        logo: '/logos/acme-logo.svg',
        favicon: '/favicons/acme-favicon.ico',
        companyName: 'Acme Corp',
        brandColor: 'oklch(0.55 0.24 262.4)',
      }
    }
  },
  {
    tenantId: 'tenant-2',
    tenantName: 'Green Tech',
    theme: {
      ...defaultTenantTheme.theme,
      colors: {
        ...defaultTenantTheme.theme.colors,
        primary: 'oklch(0.55 0.15 142.5)', // Green
        accent: 'oklch(0.55 0.15 142.5)',
        ring: 'oklch(0.55 0.15 142.5)',
      },
      darkMode: {
        ...defaultTenantTheme.theme.darkMode,
        colors: {
          ...defaultTenantTheme.theme.darkMode.colors,
          primary: 'oklch(0.75 0.12 142.5)',
          accent: 'oklch(0.4 0.12 142.5)',
          ring: 'oklch(0.75 0.12 142.5)',
        }
      },
      branding: {
        logo: '/logos/greentech-logo.svg',
        favicon: '/favicons/greentech-favicon.ico',
        companyName: 'Green Tech',
        brandColor: 'oklch(0.55 0.15 142.5)',
      }
    }
  }
]
