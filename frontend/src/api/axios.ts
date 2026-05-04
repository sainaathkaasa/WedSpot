import axios, { type AxiosError } from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retried) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          (originalRequest as any)._retried = true;
          const refreshResponse = await axios.post(`${API_BASE}/auth/refresh-token`, {
            refreshToken,
          });

          const newAccessToken = refreshResponse.data.data?.accessToken;
          if (newAccessToken) {
            localStorage.setItem('accessToken', newAccessToken);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return api(originalRequest);
          }
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login?session=expired';
          return Promise.reject(error);
        }
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login?session=expired';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
