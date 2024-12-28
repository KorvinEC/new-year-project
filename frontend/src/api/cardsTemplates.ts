import { CardTemplate, CardTemplateApi, TemplateStructureType } from "../types/cardTemplate"
import { useAxiosInstance } from "./api-client"

export const useFetchCardsTemplates = () => {
  const axiosInstance = useAxiosInstance();

  return async (page: number, per_page: number = 50): Promise<CardTemplateApi> => {
    const response = await axiosInstance.get(`cards/templates/?page=${page}&per_page=${per_page}`)
    return response.data
  }
}

export const useCreateCardsTemplate = () => {
  const axiosInstance = useAxiosInstance();

  return async (
    structure: TemplateStructureType[],
  ): Promise<CardTemplate[]> => {
    const response = await axiosInstance.post("cards/templates/", {
      structure,
    });
    return response.data;
  };
};

export const useRemoveCardsTemplate = () => {
  const axiosInstance = useAxiosInstance();

  return async (templatesId: number) => {
    const response = await axiosInstance.delete(
      `cards/templates/${templatesId}`,
    );
    return response.data;
  };
};
