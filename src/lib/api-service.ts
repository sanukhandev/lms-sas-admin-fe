import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Enhanced API service with security features
 */
class ApiService {
  private instance: AxiosInstance
  private readonly baseURL: string
  private retryCount = 0
  private readonly maxRetries = 3

  constructor() {
    this.baseURL =
      import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Add tenant information
        const tenantData = JSON.parse(
          localStorage.getItem('current_tenant') || '{}'
        )
        if (tenantData.id) {
          config.headers['X-Tenant-ID'] = tenantData.id
        }
        if (tenantData.domain) {
          config.headers['X-Tenant-Domain'] = tenantData.domain
        }

        // Add request timestamp for debugging
        config.headers['X-Request-Time'] = new Date().toISOString()

        // Log request in development
        if (import.meta.env.VITE_ENABLE_LOGGING === 'true') {
          console.log(
            '[API] Request:',
            config.method?.toUpperCase(),
            config.url
          )
        }

        return config
      },
      (error) => {
        console.error('[API] Request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Log response in development
        if (import.meta.env.VITE_ENABLE_LOGGING === 'true') {
          console.log('[API] Response:', response.status, response.config.url)
        }

        this.retryCount = 0 // Reset retry count on successful response
        return response
      },
      async (error) => {
        const originalRequest = error.config

        // Handle different error types
        if (error.response?.status === 401) {
          return this.handleUnauthorized(originalRequest)
        }

        if (error.response?.status === 403) {
          console.error('[API] Access denied:', error.response.data?.message)
          return Promise.reject(error)
        }

        if (error.response?.status >= 500) {
          return this.handleServerError(error, originalRequest)
        }

        if (error.code === 'NETWORK_ERROR' || !error.response) {
          return this.handleNetworkError(error, originalRequest)
        }

        console.error(
          '[API] Response error:',
          error.response?.status,
          error.message
        )
        return Promise.reject(error)
      }
    )
  }

  private async handleUnauthorized(originalRequest: any): Promise<any> {
    if (originalRequest._retry) {
      // Already tried to refresh, redirect to login
      this.redirectToLogin()
      return Promise.reject(new Error('Authentication failed'))
    }

    originalRequest._retry = true

    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        const response = await this.instance.post('/v1/auth/refresh', {
          refresh_token: refreshToken,
        })

        const { token } = response.data
        localStorage.setItem('auth_token', token)
        originalRequest.headers.Authorization = `Bearer ${token}`

        return this.instance(originalRequest)
      }
    } catch (refreshError) {
      console.error('[API] Token refresh failed:', refreshError)
    }

    this.redirectToLogin()
    return Promise.reject(new Error('Authentication failed'))
  }

  private async handleServerError(
    error: any,
    originalRequest: any
  ): Promise<any> {
    if (this.retryCount < this.maxRetries && !originalRequest._retry) {
      this.retryCount++
      originalRequest._retry = true

      // Exponential backoff
      const delay = Math.pow(2, this.retryCount) * 1000
      await new Promise((resolve) => setTimeout(resolve, delay))

      console.log(
        `[API] Retrying request (${this.retryCount}/${this.maxRetries})`
      )
      return this.instance(originalRequest)
    }

    console.error('[API] Server error after retries:', error)
    return Promise.reject(error)
  }

  private async handleNetworkError(
    error: any,
    originalRequest: any
  ): Promise<any> {
    if (this.retryCount < this.maxRetries && !originalRequest._retry) {
      this.retryCount++
      originalRequest._retry = true

      const delay = 2000 // Fixed delay for network errors
      await new Promise((resolve) => setTimeout(resolve, delay))

      console.log(
        `[API] Retrying network request (${this.retryCount}/${this.maxRetries})`
      )
      return this.instance(originalRequest)
    }

    console.error('[API] Network error after retries:', error)
    return Promise.reject(error)
  }

  private redirectToLogin(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')

    if (!window.location.pathname.includes('sign-in')) {
      window.location.href = '/sign-in'
    }
  }

  // Public API methods
  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config)
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config)
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config)
  }

  public patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config)
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config)
  }

  // Utility methods
  public setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token)
    this.instance.defaults.headers.Authorization = `Bearer ${token}`
  }

  public clearAuthToken(): void {
    localStorage.removeItem('auth_token')
    delete this.instance.defaults.headers.Authorization
  }

  public setTenantContext(tenantId: string, domain: string): void {
    this.instance.defaults.headers['X-Tenant-ID'] = tenantId
    this.instance.defaults.headers['X-Tenant-Domain'] = domain
  }

  public clearTenantContext(): void {
    delete this.instance.defaults.headers['X-Tenant-ID']
    delete this.instance.defaults.headers['X-Tenant-Domain']
  }

  public getBaseURL(): string {
    return this.baseURL
  }

  public getInstance(): AxiosInstance {
    return this.instance
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService
