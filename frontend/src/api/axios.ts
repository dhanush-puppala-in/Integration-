import axios from 'axios';

const BASE_URL = 'http://172.20.10.2:5050/universe/api/v1';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for API calls
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Adjust depending on backend expectation
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosPrivate.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Condition to check if token is expired and this request was not previously retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Use standard axios instance so we don't trigger the interceptor again
        const res = await axiosInstance.post('/chapterLeader/regenerateAccessToken', { // Adjust if backend URL differs slightly
          refreshToken: refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        // Optionally update refresh token if your backend sends it
        if (res.data.refreshToken) {
           localStorage.setItem('refreshToken', res.data.refreshToken);
        }

        localStorage.setItem('accessToken', newAccessToken);

        // Update Authorization header and retry original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosPrivate(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log the user out
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Or handle via history/navigation
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
