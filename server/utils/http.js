import axios from 'axios';

const service = axios.create({
  // TMDB v3 base; use relative paths like "movie/now_playing"
  baseURL: 'https://api.themoviedb.org/',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

service.interceptors.request.use(
  (config) => {
    const token = process.env.TMDB_TOKEN || '';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.log(error.message);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    console.log(response.data);
    return response;
  },
  (error) => {
    console.log(error.message);
    return Promise.reject(error);
  }
);

const http = {
  get: (url, data = {}) => service.get(url, data),
  post: (url, data = {}) => service.post(url, data),
  put: (url, data = {}) => service.put(url, data),
  delete: (url, data = {}) => service.delete(url, data),
};

export default http;
