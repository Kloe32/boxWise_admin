import axios from "axios";
import { API_ROUTES, STORAGE_KEY } from "./config";
import { clearLocalStorage, getItemFromLocalStorage } from "../helper/helper";

const axiosInstance = axios.create({
  baseURL:API_ROUTES.BASE_URL,
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getItemFromLocalStorage(STORAGE_KEY.TOKEN);
    if (token) {
      config.headers.Authorization = ` Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      if (window.location.pathname !== "/login") {
        clearLocalStorage();
        window.location.pathname = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
