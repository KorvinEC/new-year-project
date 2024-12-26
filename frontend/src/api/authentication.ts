import { LoginType, RegisterType } from "../types/user";
import { useAxiosInstance } from "./api-client";

export const useAuthenticationApi = () => {
  const axiosInstance = useAxiosInstance()

  const login = async (loginData: LoginType) => {
    const formData = new FormData()

    formData.append("username", loginData.username)
    formData.append("password", loginData.password)

    return await axiosInstance.post(
      "authentication/token",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    ).then(response => response.data)
  }

  const regitser = async (registerData: RegisterType) => {
    const formData = new FormData

    formData.append("nickname", registerData.nickname)
    formData.append("username", registerData.username)
    formData.append("password", registerData.password)

    return await axiosInstance.post(
      "authentication/signup",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    ).then(response => response.data)
  }

  return {
    login,
    regitser
  }
}
