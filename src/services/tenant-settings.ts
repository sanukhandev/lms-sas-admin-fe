import axios from 'axios'

// Types for different settings
export interface GeneralSettings {
  name: string
  domain: string
  description?: string
  timezone: string
  language: string
  date_format: string
  time_format: string
  currency: string
  max_users: number
  max_courses: number
  storage_limit: number
}

export interface BrandingSettings {
  logo?: string
  favicon?: string
  primary_color: string
  secondary_color: string
  accent_color: string
  login_background?: string
  email_header?: string
  custom_css?: string
}

export interface FeaturesSettings {
  courses_enabled: boolean
  assignments_enabled: boolean
  quizzes_enabled: boolean
  forums_enabled: boolean
  certificates_enabled: boolean
  analytics_enabled: boolean
  mobile_app_enabled: boolean
  api_access_enabled: boolean
  white_label_enabled: boolean
  sso_enabled: boolean
  custom_domains_enabled: boolean
  advanced_reporting_enabled: boolean
}

export interface SecuritySettings {
  password_policy: {
    min_length: number
    require_uppercase: boolean
    require_lowercase: boolean
    require_numbers: boolean
    require_special: boolean
  }
  session_timeout: number
  max_login_attempts: number
  lockout_duration: number
  two_factor_required: boolean
  email_verification_required: boolean
  allowed_domains: string[]
  ip_whitelist: string[]
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'auto'
  colors: Record<string, string>
  typography: {
    font_family: string
    font_sizes: Record<string, string>
    line_heights: Record<string, string>
    font_weights: Record<string, string>
  }
  border_radius: Record<string, string>
  shadows: Record<string, string>
  spacing: Record<string, string>
}

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor to add token and tenant info
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add tenant ID header if available
    const tenantData = JSON.parse(localStorage.getItem('tenant') || '{}')
    if (tenantData.id) {
      config.headers['X-Tenant-ID'] = tenantData.id
    }

    // Add tenant domain header if available
    if (tenantData.domain) {
      config.headers['X-Tenant-Domain'] = tenantData.domain
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)

// General Settings
export const getGeneralSettings = async () => {
  const response = await api.get('/v1/tenant/settings/general')
  return response.data
}

export const updateGeneralSettings = async (data: GeneralSettings) => {
  const response = await api.put('/v1/tenant/settings/general', data)
  return response.data
}

// Branding Settings
export const getBrandingSettings = async () => {
  const response = await api.get('/v1/tenant/settings/branding')
  return response.data
}

export const updateBrandingSettings = async (data: BrandingSettings) => {
  const response = await api.put('/v1/tenant/settings/branding', data)
  return response.data
}

// Features Settings
export const getFeaturesSettings = async () => {
  const response = await api.get('/v1/tenant/settings/features')
  return response.data
}

export const updateFeaturesSettings = async (data: FeaturesSettings) => {
  const response = await api.put('/v1/tenant/settings/features', data)
  return response.data
}

// Security Settings
export const getSecuritySettings = async () => {
  const response = await api.get('/v1/tenant/settings/security')
  return response.data
}

export const updateSecuritySettings = async (data: SecuritySettings) => {
  const response = await api.put('/v1/tenant/settings/security', data)
  return response.data
}

// Theme Settings
export const getThemeSettings = async () => {
  const response = await api.get('/v1/tenant/settings/theme')
  return response.data
}

export const updateThemeSettings = async (data: ThemeSettings) => {
  const response = await api.put('/v1/tenant/settings/theme', data)
  return response.data
}

export default api
