import axios from "axios";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const token = localStorage.getItem("token");

    if (status === 401 && token) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      sessionStorage.setItem("sessionExpired", "true");

      window.dispatchEvent(new Event("authChange"));

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default Api;