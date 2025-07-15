import { useTenantContext } from '@/context/tenant-context'
import { useMemo } from 'react'

export interface TenantTheme {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    card: string
    cardForeground: string
    muted: string
    mutedForeground: string
    border: string
    destructive: string
    success: string
    warning: string
    info: string
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
      '5xl': string
      '6xl': string
    }
    fontWeight: {
      thin: string
      light: string
      normal: string
      medium: string
      semibold: string
      bold: string
      extrabold: string
      black: string
    }
    lineHeight: {
      none: string
      tight: string
      snug: string
      normal: string
      relaxed: string
      loose: string
    }
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
  borderRadius: {
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
  mode: 'light' | 'dark' | 'auto'
}

export function useTenantTheme(): TenantTheme | null {
  const { tenant } = useTenantContext()

  const theme = useMemo(() => {
    if (!tenant?.settings?.theme_config) return null

    const { theme_config } = tenant.settings

    return {
      colors: {
        primary: theme_config.colors.primary,
        secondary: theme_config.colors.secondary,
        accent: theme_config.colors.accent,
        background: theme_config.colors.background,
        foreground: theme_config.colors.foreground,
        card: theme_config.colors.card,
        cardForeground: theme_config.colors.card_foreground,
        muted: theme_config.colors.muted,
        mutedForeground: theme_config.colors.muted_foreground,
        border: theme_config.colors.border,
        destructive: theme_config.colors.destructive,
        success: theme_config.colors.success,
        warning: theme_config.colors.warning,
        info: theme_config.colors.info,
      },
      typography: {
        fontFamily: theme_config.typography.font_family,
        fontSize: theme_config.typography.font_sizes,
        fontWeight: theme_config.typography.font_weights,
        lineHeight: theme_config.typography.line_heights,
      },
      spacing: theme_config.spacing,
      borderRadius: theme_config.border_radius,
      shadows: theme_config.shadows,
      mode: theme_config.mode,
    }
  }, [tenant])

  return theme
}

export function useTenantStyles() {
  const theme = useTenantTheme()

  const getColorStyle = (colorName: keyof TenantTheme['colors']) => {
    if (!theme) return {}
    return { color: theme.colors[colorName] }
  }

  const getBackgroundStyle = (colorName: keyof TenantTheme['colors']) => {
    if (!theme) return {}
    return { backgroundColor: theme.colors[colorName] }
  }

  const getBorderStyle = (colorName: keyof TenantTheme['colors']) => {
    if (!theme) return {}
    return { borderColor: theme.colors[colorName] }
  }

  const getTypographyStyle = (
    size?: keyof TenantTheme['typography']['fontSize'],
    weight?: keyof TenantTheme['typography']['fontWeight'],
    lineHeight?: keyof TenantTheme['typography']['lineHeight']
  ) => {
    if (!theme) return {}
    
    const style: React.CSSProperties = {
      fontFamily: theme.typography.fontFamily,
    }

    if (size) {
      style.fontSize = theme.typography.fontSize[size]
    }

    if (weight) {
      style.fontWeight = theme.typography.fontWeight[weight]
    }

    if (lineHeight) {
      style.lineHeight = theme.typography.lineHeight[lineHeight]
    }

    return style
  }

  const getSpacingStyle = (
    property: 'padding' | 'margin',
    size: keyof TenantTheme['spacing']
  ) => {
    if (!theme) return {}
    return { [property]: theme.spacing[size] }
  }

  const getBorderRadiusStyle = (size: keyof TenantTheme['borderRadius']) => {
    if (!theme) return {}
    return { borderRadius: theme.borderRadius[size] }
  }

  const getShadowStyle = (size: keyof TenantTheme['shadows']) => {
    if (!theme) return {}
    return { boxShadow: theme.shadows[size] }
  }

  const getButtonStyle = (variant: 'primary' | 'secondary' | 'accent' = 'primary') => {
    if (!theme) return {}
    
    const baseStyle = {
      fontFamily: theme.typography.fontFamily,
      fontWeight: theme.typography.fontWeight.medium,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.default,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
          color: theme.colors.background,
        }
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.secondary,
          color: theme.colors.background,
        }
      case 'accent':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.accent,
          color: theme.colors.background,
        }
      default:
        return baseStyle
    }
  }

  const getCardStyle = () => {
    if (!theme) return {}
    return {
      backgroundColor: theme.colors.card,
      color: theme.colors.cardForeground,
      borderRadius: theme.borderRadius.default,
      boxShadow: theme.shadows.sm,
      border: `1px solid ${theme.colors.border}`,
    }
  }

  const getInputStyle = () => {
    if (!theme) return {}
    return {
      backgroundColor: theme.colors.background,
      color: theme.colors.foreground,
      borderRadius: theme.borderRadius.default,
      border: `1px solid ${theme.colors.border}`,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      fontFamily: theme.typography.fontFamily,
    }
  }

  return {
    theme,
    getColorStyle,
    getBackgroundStyle,
    getBorderStyle,
    getTypographyStyle,
    getSpacingStyle,
    getBorderRadiusStyle,
    getShadowStyle,
    getButtonStyle,
    getCardStyle,
    getInputStyle,
  }
}

export default useTenantTheme
