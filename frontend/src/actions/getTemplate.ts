import AxiosApi from './axiosApi';

export const getTemplate = async () => {
    const data = await AxiosApi.get('cards');
    return data;
};
