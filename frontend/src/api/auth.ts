import { axiosInstance } from './axios';

export const authApi = {
  registerChapterLeader: async (data: any) => {
    return await axiosInstance.post('/chapterLeader/register', data);
  },
  
  loginChapterLeader: async (data: any) => {
    return await axiosInstance.post('/chapterLeader/login', data);
  },
};
