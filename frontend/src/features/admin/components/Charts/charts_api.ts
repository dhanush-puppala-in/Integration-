import { axiosPrivate } from "../../../../api/axios";

// =======================
// TRAFFIC CHART APIs
// =======================

export const fetchHourlyTraffic = async (): Promise<any> => {
    const res = await axiosPrivate.get("/session/getTodaySessions");
    return res.data;
};

export const fetchWeeklyTraffic = async (): Promise<any> => {
    const res = await axiosPrivate.get("/session/getWeekSessions");
    return res.data;
};

export const fetchMonthlyTraffic = async (): Promise<any> => {
    const res = await axiosPrivate.get("/session/getMonthSessions");
    return res.data;
};

// =======================
// SIGNUPS CHART APIs
// =======================

export const fetchHourlySignups = async (): Promise<any> => {
    const res = await axiosPrivate.get("/session/getTodaySignups");
    return res.data;
};

export const fetchWeeklySignups = async (): Promise<any> => {
    const res = await axiosPrivate.get("/session/getLastWeekSignups");
    return res.data;
};

export const fetchMonthlySignups = async (): Promise<any> => {
    const res = await axiosPrivate.get("/session/getLastMonthSignups");
    return res.data;
};

// =======================
// DONUT CHART APIs
// =======================

export const todaySessionDonut = async (): Promise<any> => {
    const res = await axiosPrivate.get("/session/todaySessionDonut");
    return res.data;
};

export const lastWeekSessionDonut = async (): Promise<any> => {
    const res = await axiosPrivate.get("/session/lastWeekSessionDonut");
    return res.data;
};

export const lastMonthSessionDonut = async (): Promise<any> => {
    const res = await axiosPrivate.get("/session/lastMonthSessionDonut");
    return res.data;
};

export const todaySessionsByTimeOfDayDonut = async (): Promise<any> => {
    const res = await axiosPrivate.get("/session/todaySessionsByTimeOfDay");
    return res.data;
};

export const lastWeekSessionsByTimeOfDayDonut = async (): Promise<any> => {
    const res = await axiosPrivate.get("/session/lastWeekSessionsByTimeOfDay");
    return res.data;
};

export const lastMonthSessionsByTimeOfDayDonut = async (): Promise<any> => {
    const res = await axiosPrivate.get("/session/lastMonthSessionsByTimeOfDay");
    return res.data;
};