import React, { lazy } from 'react';

const AdminHome = lazy(() => import('./pages/AdminHome'));
const AdminEvent = lazy(() => import('./pages/AdminEvent'));
const AdminContent = lazy(() => import('./pages/AdminContent'));
const AdminBlog = lazy(() => import('./pages/AdminBlog'));
const AdminNotification = lazy(() => import('./pages/AdminNotification'));
const AdminStatistic = lazy(() => import('./pages/AdminStatistic'));

export const adminRoutes = [
  { path: 'home', component: AdminHome },
  { path: 'event', component: AdminEvent },
  { path: 'content', component: AdminContent },
  { path: 'blog', component: AdminBlog },
  { path: 'notification', component: AdminNotification },
  { path: 'statistic', component: AdminStatistic },
];
