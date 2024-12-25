import { useAxiosInstance } from "./api-client";

export const useUserApi = () => {
  const axiosInstance = useAxiosInstance()

  const fetchMe = async () => 
    (await axiosInstance.get("users/me")).data

  const fetchUsers = async () => 
    (await axiosInstance.get("users")).data

  return {
    fetchMe,
    fetchUsers,
  }
}
