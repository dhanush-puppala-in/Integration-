import { axiosPrivate } from "./axios";

export interface MetadataResponse<T = unknown> {
    data: T;
}

export const getAvgClubTimeToday = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/avgClubTimeToday");
    return res.data;
};

export const getAvgClubTimeLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/avgClubTimeLastWeek");
    return res.data;
};

export const getAvgClubTimeLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/avgClubTimeLastMonth");
    return res.data;
};

export const getAvgClubTimeAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/avgClubTimeAllTime");
    return res.data;
};

export const getTotalClubVisitsToday = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/totalClubVisitsToday");
    return res.data;
};

export const getTotalClubVisitsLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/totalClubVisitsLastWeek");
    return res.data;
};

export const getTotalClubVisitsLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/totalClubVisitsLastMonth");
    return res.data;
};

export const getTotalClubVisitsAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/totalClubVisitsAllTime");
    return res.data;
};

export const getTopNavigationFromClub = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/topNavigationFromClub");
    return res.data;
};

export const getTotalClubTimeAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/totalClubTimeAllTime");
    return res.data;
};

export const getClubVisitTimeClusters = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/clubVisitTimeClusters");
    return res.data;
};

export const getBounceRateClubToday = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/bounceRateClubToday");
    return res.data;
};

export const getBounceRateClubLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/bounceRateClubLastWeek");
    return res.data;
};

export const getBounceRateClubLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/bounceRateClubLastMonth");
    return res.data;
};

export const getBounceRateClubAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/bounceRateClubAllTime");
    return res.data;
};

export const getSingleHitClubSessionsToday = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/singleHitClubSessionsToday");
    return res.data;
};

export const getSingleHitClubSessionsLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/singleHitClubSessionsLastWeek");
    return res.data;
};

export const getSingleHitClubSessionsLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/singleHitClubSessionsLastMonth");
    return res.data;
};

export const getSingleHitClubSessionsAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/singleHitClubSessionsAllTime");
    return res.data;
};

export const getPeakClubUsageHourly = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/peakClubUsageHourly");
    return res.data;
};

export const getAvgRequestsPerClubVisitToday = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/avgRequestsPerClubVisitToday");
    return res.data;
};

export const getAvgRequestsPerClubVisitLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/avgRequestsPerClubVisitLastWeek");
    return res.data;
};

export const getAvgRequestsPerClubVisitLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/avgRequestsPerClubVisitLastMonth");
    return res.data;
};

export const getAvgRequestsPerClubVisitAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/avgRequestsPerClubVisitAllTime");
    return res.data;
};

export const getClubEngagementRate = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/clubEngagementRate");
    return res.data;
};

export const getClubStickinessRate = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/clubStickinessRate");
    return res.data;
};

export const getClubDeepNavigationRate = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/clubDeepNavigationRate");
    return res.data;
};

export const getClubDiscoveryFromEventsRate = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/clubDiscoveryFromEventsRate");
    return res.data;
};

export const getReturningClubUsers = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/returningClubUsers");
    return res.data;
};

export const getMedianClubTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/club-metadata/medianClubTime");
    return res.data;
};
