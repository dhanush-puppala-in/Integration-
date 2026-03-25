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
  }
};
