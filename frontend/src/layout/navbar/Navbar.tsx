import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Calendar,
  FileText,
  MessageCircle,
  Bell,
  BarChart2,
  Layout,
  Globe,
  Users,
  ShoppingBag,
  User,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";

interface NavItemData {
  label: string;
  icon: LucideIcon;
  to: string;
}

const ADMIN_ITEMS: NavItemData[] = [
  { label: "Home", icon: Home, to: "/admin/home" },
  { label: "Event", icon: Calendar, to: "/admin/event" },
  { label: "Content", icon: FileText, to: "/admin/content" },
  { label: "Blog", icon: MessageCircle, to: "/admin/blog" },
  { label: "Notification", icon: Bell, to: "/admin/notification" },
  { label: "Statistic", icon: BarChart2, to: "/admin/statistic" },
];

const CHAPTER_ITEMS: NavItemData[] = [
  { label: "Club", icon: Layout, to: "/chapterleader/club" },
  { label: "Community", icon: Globe, to: "/chapterleader/community" },
  { label: "Events", icon: Calendar, to: "/chapterleader/event" },
  { label: "Members", icon: Users, to: "/chapterleader/members" },
  { label: "Shops", icon: ShoppingBag, to: "/chapterleader/shop" },
  // { label: "Profile", icon: User, to: "/chapterleader/profile" },
];

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const items = user?.role === ROLES.ADMIN ? ADMIN_ITEMS : CHAPTER_ITEMS;

  return (
    <>
      {/* Desktop Sidebar & Mobile Bottom Bar */}
      <div
        className="
          fixed bottom-0 left-0 right-0 
          md:top-0 md:bottom-auto md:left-0 md:h-screen 
          w-full md:w-20 lg:w-64 
          h-20 md:h-screen 
          bg-[#0B0F17]/90 backdrop-blur-xl md:bg-[#0B0F17] 
          flex md:flex-col 
          px-4 md:px-2 lg:px-6 md:py-8
          z-50
          md:overflow-y-auto
          no-scrollbar
          transition-all duration-300
        "
      >
        {/* Brand Header - Hidden on Mobile */}
        <div className="hidden md:block mb-10 px-2 text-center lg:text-left overflow-hidden">
          <h1 className="text-3xl font-black text-white tracking-tighter">
            M<span className="hidden lg:inline">acbease</span>
          </h1>
          <p className="hidden lg:block text-[10px] font-bold text-gray-500 tracking-[0.3em] mt-1 uppercase">
            Cosmic Explorer
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-row md:flex-col w-full gap-1 md:gap-3 items-center lg:items-stretch justify-around md:justify-start">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex flex-col lg:flex-row items-center 
                gap-1 lg:gap-4 
                px-2 lg:px-5 py-2.5 lg:py-3.5 
                rounded-2xl transition-all duration-300
                group relative flex-1 md:flex-none
                ${
                  isActive
                    ? "text-blue-500 bg-blue-600/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }
              `}
            >
              <item.icon
                size={22}
                className="transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
              />
              <span className="text-[10px] lg:text-base font-bold tracking-tight hidden lg:block overflow-hidden whitespace-nowrap">
                {item.label}
              </span>

              {/* Desktop Active Bar Indicator */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-r-full hidden md:block opacity-0 md:group-[.active]:opacity-100 transition-opacity duration-300" />
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
