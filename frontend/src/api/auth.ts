import { axiosInstance } from './axios';

export const authApi = {
  registerChapterLeader: async (data: any) => {
    return await axiosInstance.post('/chapterLeader/register', data);
  },
  
  loginChapterLeader: async (data: any) => {
    return await axiosInstance.post('/chapterLeader/login', data);
  },
  
  forgotPassword: async (data: { email: string }) => {
    return await axiosInstance.post('/chapterLeader/forgot-password', data);
  },

  resetPassword: async (token: string, data: { password: string }) => {
    return await axiosInstance.post(`/chapterLeader/reset-password/${token}`, data);
  },
};
