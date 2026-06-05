import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

// Define a generic structure for your API responses if applicable
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7444/api';

/**
 * Global configured Axios instance.
 * Using withCredentials: true as your backend uses HttpOnly cookies for JWTs.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 15000,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor: Useful for adding custom headers or logging before request is sent
apiClient.interceptors.request.use(
  (config) => {
    // Example: config.headers['X-Custom-Header'] = 'value';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Useful for global error handling (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Any status code that falls outside the range of 2xx causes this function to trigger
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized globally here if needed
        // e.g., clear localStorage, trigger a redirect to login
        console.warn('Unauthorized request. Token might be expired or missing.');
      } else if (error.response.status === 403) {
        console.warn('Forbidden access.');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Reusable generic API calling function with many options.
 * 
 * @param url The endpoint URL (relative to baseURL, e.g., '/users')
 * @param method HTTP Method (GET, POST, PUT, DELETE, PATCH)
 * @param data Request body data (for POST, PUT, PATCH)
 * @param params Query parameters (for GET, DELETE)
 * @param config Additional AxiosRequestConfig overrides (custom headers, timeout, responseType, etc.)
 * @returns Promise with the generic response data of type T
 */
export async function useApiCall<T = any>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  data?: any,
  params?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await apiClient({
      url,
      method,
      data,
      params,
      ...config, // This allows overriding default config (like headers) per request
    });
    return response.data; // By default, just return the payload data
  } catch (error) {
    // You could map the error to a unified format here if desired
    throw error;
  }
}

/**
 * Convenience wrapper for the most common REST operations.
 * This can be imported anywhere in the app to make clean API calls.
 */
export const api = {
  /**
   * Make a GET request
   * @example api.get<User[]>('/users', { page: 1 })
   */
  get: <T = any>(url: string, params?: any, config?: AxiosRequestConfig) => 
    useApiCall<T>(url, 'GET', undefined, params, config),
    
  /**
   * Make a POST request
   * @example api.post<User>('/users', { name: 'John' })
   */
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    useApiCall<T>(url, 'POST', data, undefined, config),
    
  /**
   * Make a PUT request
   * @example api.put<User>('/users/1', { name: 'John Doe' })
   */
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    useApiCall<T>(url, 'PUT', data, undefined, config),
    
  /**
   * Make a PATCH request
   * @example api.patch<User>('/users/1', { status: 'active' })
   */
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    useApiCall<T>(url, 'PATCH', data, undefined, config),
    
  /**
   * Make a DELETE request
   * @example api.delete('/users/1')
   */
  delete: <T = any>(url: string, params?: any, config?: AxiosRequestConfig) => 
    useApiCall<T>(url, 'DELETE', undefined, params, config),
};

export default api;
