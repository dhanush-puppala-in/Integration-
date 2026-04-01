import { axiosPrivate } from "../../../../api/axios";

// Generic response type since exact structure depends on the backend
export interface SidebarMetadataResponse<T = unknown> {
  data: T;
}

// =======================
// DASHBOARD STATS APIs
// =======================

export const fetchTotalUsers = async (): Promise<any> => {
  const res = await axiosPrivate.get("/session/getTotalUsers");
  return res.data;
};

export const fetchTodayUsers = async (): Promise<any> => {
  const res = await axiosPrivate.get("/session/getTodayUser");
  return res.data;
};

export const fetchLiveEvents = async (): Promise<any> => {
  const res = await axiosPrivate.get("/session/getLiveEvents");
  return res.data;
};

export const fetchTodaySessions = async (): Promise<any> => {
  const res = await axiosPrivate.get("/session/getTodaySessionCount");
  return res.data;
};

export const fetchAverageSessionTime = async (): Promise<any> => {
  const res = await axiosPrivate.get("/session/averageSessionTime");
  return res.data;
};
