import React, { useEffect, useState } from "react";
import MetricCard from "./MetricCard";
import {
  FaUserPlus,
  FaChartLine,
  FaClock,
  FaBell,
  FaEnvelope,
  FaBolt,
} from "react-icons/fa";

import {
  fetchTotalUsers,
  fetchTodayUsers,
  fetchTodaySessions,
  fetchAverageSessionTime,
  fetchLiveEvents,
} from "./sidebar_api";

export default function Sidebar(): React.JSX.Element {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [todayUsers, setTodayUsers] = useState<number>(0);
  const [todaySessions, setTodaySessions] = useState<number>(0);
  const [avgSessionTime, setAvgSessionTime] = useState<number>(0);
  const [liveEvents, setLiveEvents] = useState<number>(0);

  useEffect(() => {
    let mounted = true;

    const loadSidebarData = async () => {
      try {
        const [
          totalUsersRes,
          todayUsersRes,
          todaySessionsRes,
          avgSessionTimeRes,
          liveEventsRes,
        ] = await Promise.allSettled([
          fetchTotalUsers(),
          fetchTodayUsers(),
          fetchTodaySessions(),
          fetchAverageSessionTime(),
          fetchLiveEvents(),
        ]);

        if (!mounted) return;

        if (totalUsersRes.status === "fulfilled") {
          setTotalUsers(totalUsersRes.value?.users ?? 0);
        } else {
          setTotalUsers(0);
        }

        if (todayUsersRes.status === "fulfilled") {
          setTodayUsers(todayUsersRes.value?.users ?? 0);
        } else {
          setTodayUsers(0);
        }

        if (todaySessionsRes.status === "fulfilled") {
          setTodaySessions(todaySessionsRes.value?.count ?? 0);
        } else {
          setTodaySessions(0);
        }

        if (avgSessionTimeRes.status === "fulfilled") {
          setAvgSessionTime(Number(avgSessionTimeRes.value?.avgSessionTimeMinutes ?? 0));
        } else {
          setAvgSessionTime(0);
        }

        if (liveEventsRes.status === "fulfilled") {
          setLiveEvents(liveEventsRes.value?.count ?? 0);
        } else {
          setLiveEvents(0);
        }
      } catch (error) {
        console.error("Error loading sidebar data", error);
      }
    };

    loadSidebarData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full h-full p-4 flex flex-col gap-6">
      <MetricCard
        icon={FaUserPlus}
        leftValue={totalUsers}
        leftLabel="Total Signups"
        rightValue={todayUsers}
        rightLabel="Today Signups"
      />

      <MetricCard
        icon={FaChartLine}
        singleValue={todaySessions}
        singleLabel="Today Sessions"
      />

      <MetricCard
        icon={FaClock}
        singleValue={avgSessionTime}
        singleLabel="Avg Session Time (min)"
      />

      <MetricCard
        icon={FaBolt}
        singleValue={liveEvents}
        singleLabel="Active Events"
      />

      {/* Notifications and Emails remain mocked as before since there is no backend route for them yet */}
      <MetricCard
        icon={FaBell}
        leftValue={32}
        leftLabel="Notifications"
        rightValue={5}
        rightLabel="Avg Clicks"
      />

      <MetricCard
        icon={FaEnvelope}
        leftValue={500}
        leftLabel="Auto Emails"
        rightValue={55}
        rightLabel="Manual Emails"
      />
    </div>
  );
}