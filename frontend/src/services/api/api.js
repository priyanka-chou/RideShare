
import axios from "axios";

/*
========================================
AXIOS API INSTANCE
========================================
*/

export const api = axios.create({
baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    withCredentials: true,
});

/*
========================================
REQUEST INTERCEPTOR
========================================
*/

// FormData upload ke liye Content-Type manually set nahi karna.
// Browser multipart boundary automatically set karega.
api.interceptors.request.use(
    (config) => {
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        } else if (config.data !== undefined) {
            config.headers.set
                ? config.headers.set("Content-Type", "application/json")
                : (config.headers["Content-Type"] = "application/json");
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/*
========================================
RESPONSE INTERCEPTOR
========================================
*/

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status !== 401 ||
            !error.config?.url?.includes("/auth/me")
        ) {
            console.error(
                "API Error:",
                error.response?.data || error.message
            );
        }

        return Promise.reject(error);
    }
);

/*
========================================
GET USERS
========================================
*/

export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};
