import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

// Define a generic structure for your API responses if applicable
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

// Now let me explain what it does.

const baseUrl = import.meta.env.VITE_API_BASE_URL;
// I defind a baseUrl which mean the url of our api backend so you don't need to type http://localhost everytime
// but what the value of the baseUrl goes from ? 
// Well this is the code that is an env file is .env.production
// so in the real domain it will choose this value inside the .env.product but in the local it will use the localhost
// this is the flexible thing that I did for our team but they does not understand 
// so even though our team use localhostt url but the system will change it to use domain name instead?
// yes but if they type exactly like this axios.get("http://localhost") this can not still help 
// that is why I create this now look at what the code this file help
// it not 100% right but it also c

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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Useful for global error handling and auto-refresh token handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // If the failed request was the refresh token request itself, log out!
      if (originalRequest.url && originalRequest.url.includes('/auth/refresh')) {
        console.warn('Refresh token is invalid or expired. Logging out.');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('employeeId');
        localStorage.removeItem('userRole');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        if (isRefreshing) {
          // If we are already refreshing, put this request in a queue to wait
          return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            return apiClient(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Hit the brand new backend /refresh endpoint seamlessly
          const refreshUrl = baseUrl + '/auth/refresh';
          await axios.post(refreshUrl, {}, { withCredentials: true });
          
          isRefreshing = false;
          processQueue(null, 'true');
          
          // Re-run the original request! It will now succeed!
          return apiClient(originalRequest);

        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError, null);
          
          console.warn('Background refresh token failed. Session completely dead. Logging out.');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('employeeId');
          localStorage.removeItem('userRole');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
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

// this export mean you can import this api to use in your file
// and what it help ?
export const api = {
  /**
   * Make a GET request
   * @example api.get<User[]>('/users', { page: 1 })
   */
  // so when you import you will write api.get() which already appy the value of a url to our api
  // is localhost or bff.learner-teach.online/api
  // because the url is already assign the value to that 
  // let me show you how to call and use it 
  // back to our code
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
