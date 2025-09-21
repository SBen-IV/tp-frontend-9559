import axios from 'axios'
import router from '../router'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // from .env files
})

axiosInstance.interceptors.request.use((config) => {
  // Add Bearer token or other headers
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle logout or redirect to login
      console.error('Not authenticated, please login...')
      router.push('/login')
    }
    if (error.response?.status === 403) {
      // Handle logout or redirect to login
      alert("Unauthorized, you don't have the right credentials")
    }
    // Show error message
    return Promise.reject(error)
  }
)

export default axiosInstance