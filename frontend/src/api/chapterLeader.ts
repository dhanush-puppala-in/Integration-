import { axiosPrivate } from './axios';

export const chapterLeaderApi = {
  getQuestsProgress: async (category?: string) => {
    return await axiosPrivate.get(`/chapterLeader/getQuestsProgress?category=${category}`);
  },
  claimQuestReward: async (questId: string) => {
    return await axiosPrivate.post(`/chapterLeader/claimQuestReward`, { questId });
  }
};
