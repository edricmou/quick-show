import axios from 'axios';

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 3000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
let tokenGetter = null;

export const setTokenGetter = (getToken) => {
  tokenGetter = getToken;
};

service.interceptors.request.use(async (config) => {
  if (typeof tokenGetter === 'function') {
    const token = await tokenGetter(); // ✅ 调用函数获取 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

service.interceptors.response.use((response) => {
  const { data } = response;
  return Promise.resolve(data);
});

const http = {
  get: (url, data) => service.get(url, data),
  post: (url, data) => service.post(url, data),
  put: (url, data) => service.put(url, data),
  delete: (url, data) => service.delete(url, data),
};

export default http;
