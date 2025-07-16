import axios from 'axios'

// Create axios instance with common configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor to add token and tenant information
api.interceptors.request.use(
  (config) => {
    // Add authentication token
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

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')

      // Redirect to login if not already there
      if (!window.location.pathname.includes('sign-in')) {
        window.location.href = '/sign-in'
      }
    }

    // Handle 403 errors (forbidden)
    if (error.response?.status === 403) {
      console.error('Access denied:', error.response.data?.message)
    }

    // Handle 500 errors (server errors)
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data?.message)
    }

    return Promise.reject(error)
  }
)

export default api
