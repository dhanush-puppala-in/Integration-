import { axiosPrivate } from "./axios";

export interface MetadataResponse<T = unknown> {
    data: T;
}

/* ------------------------- AVG COMMUNITY TIME ------------------------- */
export const getAvgCommunityTimeToday = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/AvgCommunityTimeToday");
    return res.data;
};

export const getAvgCommunityTimeLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/AvgCommunityTimeLastWeek");
    return res.data;
};

export const getAvgCommunityTimeLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/AvgCommunityTimeLastMonth");
    return res.data;
};

export const getAvgCommunityTimeAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/AvgCommunityTimeAllTime");
    return res.data;
};

/* ------------------------- TOTAL COMMUNITY VISITS ------------------------- */
export const getTotalCommunityVisitsToday = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/TotalCommunityVisitsToday");
    return res.data;
};

export const getTotalCommunityVisitsLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/TotalCommunityVisitsLastWeek");
    return res.data;
};

export const getTotalCommunityVisitsLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/TotalCommunityVisitsLastMonth");
    return res.data;
};

export const getTotalCommunityVisitsAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/TotalCommunityVisitsAllTime");
    return res.data;
};

/* ------------------------- CHARTS & CLUSTERS ------------------------- */
export const getTopNavigationFromCommunity = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/TopNavigationFromCommunity");
    return res.data;
};

export const getTotalCommunityTimeAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/TotalCommunityTimeAllTime");
    return res.data;
};

export const getCommunityVisitTimeClusters = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/CommunityVisitTimeClusters");
    return res.data;
};

/* ------------------------- BOUNCE RATE ------------------------- */
export const getBounceRateCommunityToday = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/BounceRateCommunityToday");
    return res.data;
};

export const getBounceRateCommunityLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/BounceRateCommunityLastWeek");
    return res.data;
};

export const getBounceRateCommunityLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/BounceRateCommunityLastMonth");
    return res.data;
};

export const getBounceRateCommunityAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/BounceRateCommunityAllTime");
    return res.data;
};

/* ------------------------- SINGLE HIT SESSIONS ------------------------- */
export const getSingleHitCommunitySessionsToday = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/SingleHitCommunitySessionsToday");
    return res.data;
};

export const getSingleHitCommunitySessionsLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/SingleHitCommunitySessionsLastWeek");
    return res.data;
};

export const getSingleHitCommunitySessionsLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/SingleHitCommunitySessionsLastMonth");
    return res.data;
};

export const getSingleHitCommunitySessionsAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/SingleHitCommunitySessionsAllTime");
    return res.data;
};

/* ------------------------- REQUESTS PER VISIT ------------------------- */
export const getPeakCommunityUsageHourly = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/PeakCommunityUsageHourly");
    return res.data;
};

export const getAvgRequestsPerCommunityVisitToday = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/AvgRequestsPerCommunityVisitToday");
    return res.data;
};

export const getAvgRequestsPerCommunityVisitLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/AvgRequestsPerCommunityVisitLastWeek");
    return res.data;
};

export const getAvgRequestsPerCommunityVisitLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/AvgRequestsPerCommunityVisitLastMonth");
    return res.data;
};

export const getAvgRequestsPerCommunityVisitAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/AvgRequestsPerCommunityVisitAllTime");
    return res.data;
};

/* ------------------------- ADVANCED METRICS ------------------------- */
export const getCommunityToEventConversionRate = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/CommunityToEventConversionRate");
    return res.data;
};

export const getReturningCommunityUsers = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/ReturningCommunityUsers");
    return res.data;
};

export const getMedianCommunityTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/community-metadata/MedianCommunityTime");
    return res.data;
};
