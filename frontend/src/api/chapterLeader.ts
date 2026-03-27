import { axiosPrivate } from './axios';

export const chapterLeaderApi = {
  getQuestsProgress: async (category?: string) => {
    return await axiosPrivate.get(`/chapterLeader/getChapterLeaderProgresses?entity=${category}`);
  },
  claimQuestReward: async (questId: string, leaderId: string) => {
    return await axiosPrivate.post(`/chapterLeader/claimReward`, { questId, leaderId });
  },
  getChapterleaderDetails: async () => {
    return await axiosPrivate.get(`/chapterLeader/getDetails`);
  },
  addAddress: async (address: any) => {
    return await axiosPrivate.post(`/chapterLeader/addAddress`, { address });
  },
  updateAddress: async (addressId: string, address: any) => {
    return await axiosPrivate.put(`/chapterLeader/updateAddress/${addressId}`, { address });
  },
  deleteAddress: async (addressId: string) => {
    return await axiosPrivate.delete(`/chapterLeader/deleteAddress/${addressId}`);
  },
};
