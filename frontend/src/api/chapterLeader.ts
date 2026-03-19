import { axiosPrivate } from './axios';

export const chapterLeaderApi = {
  getQuestsProgress: async (category?: string) => {
    return await axiosPrivate.get(`/chapterLeader/getQuestsProgress?category=${category}`);
  },
  claimQuestReward: async (questId: string, leaderId: string) => {
    return await axiosPrivate.post(`/chapterLeader/claimReward`, { questId, leaderId });
  },
  getChapterleaderDetails: async () => {
    return await axiosPrivate.get(`/chapterLeader/getDetails`);
  }
};
