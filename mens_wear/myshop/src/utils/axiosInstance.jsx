import axios from "axios";
import config from "../../config"
const server = config.server

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: server,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach Tokens & User Info
axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const userId = localStorage.getItem("userId");
        const roleId = localStorage.getItem("roleId");

        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        if (refreshToken) {
            config.headers["x-refresh-token"] = refreshToken;
        }
        if (userId) {
            config.headers["x-user-id"] = userId;
        }
        if (roleId) {
            config.headers["x-role-id"] = roleId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Token Expiry & Refresh Token
axiosInstance.interceptors.response.use(
    (response) => response, // If response is OK, return it directly
    async (error) => {
        const originalRequest = error.config;

        // If access token expired & we haven't retried already
        if (error.response && error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    console.error("Refresh token missing. Redirecting to login.");
                    window.location.href = "/login"; // Redirect to login if refresh token is missing
                    return Promise.reject(error);
                }

                const { data } = await axiosInstance.post(`/refresh-token`, { refreshToken });

                // Store new tokens
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);

                // Update Axios instance with new access token
                originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed. Redirecting to login.");
                localStorage.clear(); // Clear storage and logout
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
