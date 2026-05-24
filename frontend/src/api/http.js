import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('luxstay_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
    return Promise.reject({ ...error, message });
  }
);

export default http;
