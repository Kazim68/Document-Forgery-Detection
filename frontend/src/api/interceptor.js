import axios from 'axios';
import { store } from '../redux/store.js';

const BASE_URL = 'https://shy-kathy-kazim68-5d662330.koyeb.app'; // or your deployed URL
//const BASE_URL = 'http://127.0.0.1:8000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Automatically attach token from redux state (or localStorage fallback)
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
