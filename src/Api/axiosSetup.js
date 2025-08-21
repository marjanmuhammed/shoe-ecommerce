import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7175/api",
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "https://localhost:7175/api/Auth/refresh",
          { token: refreshToken }
        );

        // Save new tokens
        localStorage.setItem("accessToken", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${res.data.token}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
