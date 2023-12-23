/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useUserStore } from '@enteties/User/model';
import axios, { AxiosRequestHeaders } from 'axios';

const apiPath = 'http://localhost:8000/api';
const AxiosApi = axios.create({
    baseURL: apiPath,
});

console.log(useUserStore.getState().access_token);

AxiosApi.interceptors.request.use(
    (config) => {
        console.log(useUserStore.getState().access_token);

        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${useUserStore.getState().access_token ?? ''}`,
        } as AxiosRequestHeaders;
        return config;
    },
    (error) => {
        Promise.reject(error);
    },
);

// AxiosApi.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config
//     if (
//       (error.response.status === 403 || error.response.status === 401) &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true
//       await AuthService.updateToken()

//       axios.defaults.headers.common.Authorization = `Bearer ${AuthService.getToken() ?? ''}`
//       return AxiosApi(originalRequest)
//     }

//     return Promise.reject(error)
//   }
// )

export default AxiosApi;
