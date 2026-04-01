import { axiosPrivate } from "./axios";

export interface CrucialMetadataResponse<T = unknown> {
    data: T;
}

/* =========================
   CLUBS & COMMUNITIES
========================= */

export const fetchTopAndWorstClubs = async (limit = 5): Promise<unknown> => {
    const res = await axiosPrivate.get("/crucial/clubs/top-worst", {
        params: { limit },
    });
    return res.data;
};

export const fetchTopAndWorstCommunities = async (limit = 5): Promise<unknown> => {
    const res = await axiosPrivate.get("/crucial/community/top-worst", {
        params: { limit },
    });
    return res.data;
};

/* =========================
   CERTIFICATE AWARDS
========================= */

// 📈 Today – Per Hour (Line Chart)
export const fetchCertificateAwardsTodayPerHour = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/crucial/certificate-awards-per-hour");
    return res.data;
};

// 🧮 Today – Total (Table)
export const fetchCertificateAwardsTodayTotal = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/crucial/certificate-awards-today");
    return res.data;
};

// 🧮 Last Week
export const fetchCertificateAwardsLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/crucial/certificate-awards-last-week");
    return res.data;
};

// 🧮 Last Month
export const fetchCertificateAwardsLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/crucial/certificate-awards-last-month");
    return res.data;
};

// 🧮 All Time
export const fetchCertificateAwardsAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/crucial/certificate-awards-all-time");
    return res.data;
};

/* =========================
   MEMORIES ANALYTICS
========================= */

// 📈 Today – Per Hour
export const fetchMemoriesCreatedPerHour = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/crucial/memories-created-per-hour");
    return res.data;
};

// 🧮 Last Week
export const fetchMemoriesLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/crucial/memories-created-last-week");
    return res.data;
};

// 🧮 Last Month
export const fetchMemoriesLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/crucial/memories-created-last-month");
    return res.data;
};

// 🧮 All Time
export const fetchMemoriesAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/crucial/memories-created-all-time");
    return res.data;
};

// 🧠 KPI Cards
export const fetchAverageMemoriesPerUser = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/crucial/average-memories-per-user");
    return res.data;
};

export const fetchNewUsersWhoCreatedMemories = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/crucial/new-users-who-created-memories");
    return res.data;
};

export const fetchTotalMemoriesCount = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/crucial/total-memories-count");
    return res.data;
};
