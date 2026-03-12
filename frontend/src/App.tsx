import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";
import { adminRoutes } from "./features/admin/routes";
import { chapterRoutes } from "./features/chapterleader/routes";
import { ROLES } from "./utils/constants";

// Lazy load login
const Login = lazy(() => import("./features/auth/Login"));

const App: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading Application...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Admin Routes */}
            <Route
              path="admin"
              element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}
            >
              <Route index element={<Navigate to="home" replace />} />
              {adminRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
            </Route>

            {/* Chapter Routes */}
            <Route
              path="chapterleader"
              element={<ProtectedRoute allowedRoles={[ROLES.CHAPTER]} />}
            >
              <Route index element={<Navigate to="club" replace />} />
              {chapterRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
