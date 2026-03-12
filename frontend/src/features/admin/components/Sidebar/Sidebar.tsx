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
  const [totalUsers, setTotalUsers] = useState<number>(1200);
  const [todayUsers, setTodayUsers] = useState<number>(85);
  const [todaySessions, setTodaySessions] = useState<number>(340);
  const [avgSessionTime, setAvgSessionTime] = useState<number>(7);
  const [liveEvents, setLiveEvents] = useState<number>(14);

  useEffect(() => {
    fetchTotalUsers()
      .then((data: any) => setTotalUsers(data?.users ?? 1200))
      .catch(() => setTotalUsers(1200));

    fetchTodayUsers()
      .then((data: any) => setTodayUsers(data?.users ?? 85))
      .catch(() => setTodayUsers(85));

    fetchTodaySessions()
      .then((data: any) => setTodaySessions(data?.count ?? 340))
      .catch(() => setTodaySessions(340));

    fetchAverageSessionTime()
      .then((data: any) =>
        setAvgSessionTime(Number(data?.avgSessionTimeMinutes ?? 7))
      )
      .catch(() => setAvgSessionTime(7));

    fetchLiveEvents()
      .then((data: any) => setLiveEvents(data?.count ?? 14))
      .catch(() => setLiveEvents(14));
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