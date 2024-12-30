import axios from "axios";
import { useAtomValue } from "jotai";
import { tokenAtom } from "../state/atoms";

const API_ENPOINT = import.meta.env.VITE_API_ENDPOINT

export const useAxiosInstance = () => {
  const token = useAtomValue(tokenAtom)

  const axiosInstance = axios.create({
    baseURL: API_ENPOINT,
    headers: { "Content-Type": "application/json" },
  })

  axiosInstance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return axiosInstance
}
