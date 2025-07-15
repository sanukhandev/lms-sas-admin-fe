import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add token
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

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await api.post('/v1/auth/refresh', {
            refresh_token: refreshToken,
          })
          
          const { token } = response.data
          localStorage.setItem('auth_token', token)
          
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/sign-in'
      }
    }

    return Promise.reject(error)
  }
)

export interface User {
  id: number
  name: string
  email: string
  role: string
  tenant_id?: number
  email_verified_at?: string
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
  tenant_id?: number
  role?: string
}

export interface AuthResponse {
  message: string
  user: User
  token: string
  token_type: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/v1/auth/login', credentials)
    return response.data
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/v1/auth/register', userData)
    return response.data
  }

  static async logout(): Promise<void> {
    await api.post('/v1/auth/logout')
  }

  static async getUser(): Promise<{ user: User }> {
    const response = await api.get('/v1/user')
    return response.data
  }

  static async changePassword(passwords: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await api.post('/v1/auth/change-password', passwords)
    return response.data
  }

  static async refreshToken(): Promise<AuthResponse> {
    const response = await api.post('/v1/auth/refresh')
    return response.data
  }
}

export default api
