import React, { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import RightSidebar from "./rightsidebar/RightSidebar";
import ProfileWidget from "./rightsidebar/ProfileWidget";

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const isAdminStatistic = location.pathname === "/admin/statistic";
  const isProfilePage = location.pathname === "/chapterleader/profile";
  const isShopPage = location.pathname === "/chapterleader/shop" || location.pathname === "/shop";

  const isFullWidthPage = isAdminStatistic || isProfilePage || isShopPage;

  return (
    <div className="flex h-screen bg-[#0b0f17] text-white overflow-hidden">
      {/* Mobile & Tablet Top Bar (Fixed until RightSidebar appears on lg) */}
      {!isFullWidthPage && (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] p-4 bg-[#0B0F17]/80 backdrop-blur-md border-b border-white/5">
          <ProfileWidget />
        </div>
      )}

      {/* Sidebar (Fixed in Navbar component) */}
      <Navbar />

      {/* Center Content */}
      <main
        className={`flex-1 transition-all duration-300 md:ml-20 lg:ml-60 ${
          isFullWidthPage ? "" : "lg:mr-4 pt-20 lg:pt-0"
        }  overflow-y-auto no-scrollbar`}
      >
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-full text-gray-400">
              Loading Page...
            </div>
          }
        >
          <div
            className={`mx-auto ${isFullWidthPage ? "w-full" : "max-w-[1600px] flex flex-col h-full"}`}
          >
            <div className="flex-1">
              <Outlet />
            </div>
            
            {/* Mobile Right Sidebar Elements appended underneath Outlet */}
            {!isFullWidthPage && (
              <div className="lg:hidden p-4 pb-24 mt-8 border-t border-white/10 w-full max-w-4xl mx-auto">
                <RightSidebar className="flex flex-col gap-6 w-full" hideProfile={true} />
              </div>
            )}
          </div>
        </Suspense>
      </main>

      {/* Right Sidebar - Hidden on Admin Statistics, Profile, and Shop page */}
      {!isFullWidthPage && <RightSidebar />}
    </div>
  );
};

export default DashboardLayout;
