import axios from 'axios';

export const getTemplate = async () => {
    const data = await axios.get('/template');
    return data;
};
