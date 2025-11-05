// Environment-based URL configuration
export const getApiBaseUrl = (): string => {
  // Check if we're in production (when deployed)
  const isProduction = window.location.hostname === 'mockinterview.shop' || 
                      window.location.hostname === 'www.mockinterview.shop'
  
  // Check for Vite environment variables (if available)
  const viteApiUrl = (import.meta as any).env.VITE_API_BASE_URL
  
  if (viteApiUrl) {
    return viteApiUrl
  }
  
  // Fallback based on hostname
  if (isProduction) {
    return 'https://mockinterview.shop'
  }
  
  // Development fallback
  return 'http://localhost:5000'
}

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${getApiBaseUrl()}/${cleanEndpoint}`
}

// Helper function to check if we're in development
export const isDevelopment = (): boolean => {
  return !(window.location.hostname === 'mockinterview.shop' || 
           window.location.hostname === 'www.mockinterview.shop')
}

// Helper function to check if we're in production
export const isProduction = (): boolean => {
  return window.location.hostname === 'mockinterview.shop' || 
         window.location.hostname === 'www.mockinterview.shop'
}

console.log('Environment Configuration:', {
  baseUrl: getApiBaseUrl(),
  environment: isProduction() ? 'production' : 'development',
  hostname: window.location.hostname
})
