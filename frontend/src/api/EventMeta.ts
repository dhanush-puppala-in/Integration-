import { axiosPrivate } from "./axios";

export interface MetadataResponse<T = unknown> {
    data: T;
}

/* -------------------------------------------------------------------------- */
/*                               AVG EVENT TIME                                */
/* -------------------------------------------------------------------------- */

export const getAvgEventTimeToday = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/AvgEventTimeToday");
    return res.data;
};

export const getAvgEventTimeLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/AvgEventTimeLastWeek");
    return res.data;
};

export const getAvgEventTimeLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/AvgEventTimeLastMonth");
    return res.data;
};

export const getAvgEventTimeAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/AvgEventTimeAllTime");
    return res.data;
};

/* -------------------------------------------------------------------------- */
/*                             TOTAL EVENT VISITS                              */
/* -------------------------------------------------------------------------- */

export const getTotalEventVisitsToday = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/TotalEventVisitsToday");
    return res.data;
};

export const getTotalEventVisitsLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/TotalEventVisitsLastWeek");
    return res.data;
};

export const getTotalEventVisitsLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/TotalEventVisitsLastMonth");
    return res.data;
};

export const getTotalEventVisitsAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/TotalEventVisitsAllTime");
    return res.data;
};

/* -------------------------------------------------------------------------- */
/*                        TOP NAVIGATION FROM EVENT                             */
/* -------------------------------------------------------------------------- */

export const getTopNavigationFromEvent = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/TopNavigationFromEvent");
    return res.data;
};

/* -------------------------------------------------------------------------- */
/*                        TOTAL EVENT TIME (ALL TIME)                          */
/* -------------------------------------------------------------------------- */

export const getTotalEventTimeAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/TotalEventTimeAllTime");
    return res.data;
};

/* -------------------------------------------------------------------------- */
/*                        EVENT VISIT TIME CLUSTERS                             */
/* -------------------------------------------------------------------------- */

export const getEventVisitTimeClusters = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/EventVisitTimeClusters");
    return res.data;
};

/* -------------------------------------------------------------------------- */
/*                              BOUNCE Rate                                    */
/* -------------------------------------------------------------------------- */

export const getBounceRateEventToday = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/BounceRateEventToday");
    return res.data;
};

export const getBounceRateEventLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/BounceRateEventLastWeek");
    return res.data;
};

export const getBounceRateEventLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/BounceRateEventLastMonth");
    return res.data;
};

export const getBounceRateEventAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/BounceRateEventAllTime");
    return res.data;
};

/* -------------------------------------------------------------------------- */
/*                         SINGLE HIT EVENT SESSIONS                            */
/* -------------------------------------------------------------------------- */

export const getSingleHitEventSessionsToday = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/SingleHitEventSessionsToday");
    return res.data;
};

export const getSingleHitEventSessionsLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/SingleHitEventSessionsLastWeek");
    return res.data;
};

export const getSingleHitEventSessionsLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/SingleHitEventSessionsLastMonth");
    return res.data;
};

export const getSingleHitEventSessionsAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/SingleHitEventSessionsAllTime");
    return res.data;
};

/* -------------------------------------------------------------------------- */
/*                           PEAK EVENT USAGE                                  */
/* -------------------------------------------------------------------------- */

export const getPeakEventUsageHourly = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/PeakEventUsageHourly");
    return res.data;
};

/* -------------------------------------------------------------------------- */
/*                   AVG REQUESTS PER EVENT VISIT                               */
/* -------------------------------------------------------------------------- */

export const getAvgRequestsPerEventVisitToday = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/AvgRequestsPerEventVisitToday");
    return res.data;
};

export const getAvgRequestsPerEventVisitLastWeek = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/AvgRequestsPerEventVisitLastWeek");
    return res.data;
};

export const getAvgRequestsPerEventVisitLastMonth = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/AvgRequestsPerEventVisitLastMonth");
    return res.data;
};

export const getAvgRequestsPerEventVisitAllTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/AvgRequestsPerEventVisitAllTime");
    return res.data;
};

/* -------------------------------------------------------------------------- */
/*                    EVENT → CLUB CONVERSION RATE                              */
/* -------------------------------------------------------------------------- */

export const getEventToClubConversionRate = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/EventToClubConversionRate");
    return res.data;
};

/* -------------------------------------------------------------------------- */
/*                         RETURNING EVENT USERS                                */
/* -------------------------------------------------------------------------- */

export const getReturningEventUsers = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/ReturningEventUsers");
    return res.data;
};

/* -------------------------------------------------------------------------- */
/*                             MEDIAN EVENT TIME                                */
/* -------------------------------------------------------------------------- */

export const getMedianEventTime = async (): Promise<unknown> => {
    const res = await axiosPrivate.get("/event-metadata/MedianEventTime");
    return res.data;
};
