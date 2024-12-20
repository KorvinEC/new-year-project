import { LoginType, RegisterType } from "../types/user";
import { useAxiosInstance } from "./api-client";

export const useLoginUser = () => {
  const axiosInstance = useAxiosInstance()

  return async (loginData: LoginType) => {
    const formData = new FormData()

    formData.append("username", loginData.username)
    formData.append("password", loginData.password)
    try {
      const response = await axiosInstance.post(
        "authentication/token",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      )
      console.log(response);
      return response.data
    } catch (error) {
      console.error(error);
    }
  }
}

export const useRegisterUser = () => {
  const axiosInstance = useAxiosInstance()

  return async (registerData: RegisterType) => {
    const formData = new FormData

    formData.append("username", registerData.username)
    formData.append("password", registerData.password)

    try {
      const response = await axiosInstance.post(
        "authentication/signup",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      console.log(response);
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
}
