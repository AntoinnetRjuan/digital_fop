import axios from "axios";
import {getCsrfToken} from './Utils'

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // Permet d'envoyer les cookies
});

// Ajouter un intercepteur pour inclure le token CSRF
axiosInstance.interceptors.request.use(config => {
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken; // Ajoute le token CSRF
  }
  return config;
});

export default axiosInstance;
