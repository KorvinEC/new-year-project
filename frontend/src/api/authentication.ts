import { LoginType, RegisterType, TokenType } from "../types/user";
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

  const registerWithImage = async (registerData: RegisterType): Promise<TokenType> => {
    const formData = new FormData

    formData.append("nickname", registerData.nickname)
    formData.append("username", registerData.username)
    formData.append("password", registerData.password)
    formData.append("image_file", registerData.image)

    return await axiosInstance.post(
      "authentication/signup",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    ).then(response => response.data)
  }

  return {
    login,
    registerWithImage,
  }
}
