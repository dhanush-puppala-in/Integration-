import { lazy } from "react";

const Club = lazy(() => import("./pages/Club"));
const Community = lazy(() => import("./pages/Community"));
const Members = lazy(() => import("./pages/Members"));
const Shop = lazy(() => import("./pages/Shop"));
const Profile = lazy(() => import("./pages/Profile"));
const Others = lazy(() => import("./pages/Others"));
const Events = lazy(() => import("./pages/Events"));

export const chapterRoutes = [
  { path: "club", component: Club },
  { path: "community", component: Community },
  { path: "event", component: Events },
  { path: "members", component: Members },
  { path: "shop", component: Shop },
  { path: "profile", component: Profile },
  { path: "others", component: Others },
];
