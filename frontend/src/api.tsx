import axios from "axios";
import { $token } from "./stores/Authorization.ts";

const root = "http://localhost:8000/api"

const api = axios.create({
    baseURL: root,
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = $token.getState();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response.data;
    },
    (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    }
);

export default api;
