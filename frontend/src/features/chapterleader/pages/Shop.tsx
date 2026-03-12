import React, { useState } from "react";
import { IoMdStar, IoMdColorPalette } from "react-icons/io";
import {
  FaShieldAlt,
  FaTicketAlt,
  FaBolt,
  FaShoppingBag,
  FaHistory,
} from "react-icons/fa";
import { GiCrystalCluster } from "react-icons/gi";

// --- Commercial Dashboard Theme ---
// We remove the Starfield and use a clean, deep slate gradient for professionalism.

// --- Shop Data ---
interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Skins" | "Badges" | "Avatars" | "Boosts";
  icon: React.ReactNode;
  level: "Standard" | "Premium" | "Elite";
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: "item1",
    name: "Nebula Dashboard",
    description:
      "Enterprise-grade animated background interface for high-performance tracking.",
    price: 3500,
    category: "Skins",
    icon: <IoMdColorPalette />,
    level: "Premium",
  },
  {
    id: "item2",
    name: "Verified Contributor",
    description:
      "Official verification mark for recognized ecosystem contributors.",
    price: 6000,
    category: "Badges",
    icon: <IoMdStar />,
    level: "Elite",
  },
  {
    id: "item3",
    name: "Resource Uplink",
    description:
      "System-wide efficiency boost facilitating 2.5x point generation.",
    price: 1200,
    category: "Boosts",
    icon: <FaBolt />,
    level: "Standard",
  },
  {
    id: "item4",
    name: "Quartz Interface",
    description:
      "Highly optimized profile encapsulation with reactive glass textures.",
    price: 2200,
    category: "Avatars",
    icon: <FaShieldAlt />,
    level: "Standard",
  },
  {
    id: "item5",
    name: "Multiverse Protocol",
    description:
      "Privileged access key for priority participation in global summits.",
    price: 4500,
    category: "Boosts",
    icon: <FaTicketAlt />,
    level: "Premium",
  },
  {
    id: "item6",
    name: "Singularity Suite",
    description:
      "Full-spectrum environmental visual set for mission architectures.",
    price: 9500,
    category: "Skins",
    icon: <IoMdColorPalette />,
    level: "Elite",
  },
];

const Shop: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Skins", "Badges", "Avatars", "Boosts"];

  const filteredItems =
    selectedCategory === "All"
      ? SHOP_ITEMS
      : SHOP_ITEMS.filter((i) => i.category === selectedCategory);

  return (
    <div className="flex flex-col items-center min-h-screen text-white w-full relative bg-[#070b14]">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />

      {/* --- ELITE NAV HEADER --- */}
      <div className="sticky top-[86px] md:top-0 z-[1000] w-full flex flex-col items-center pt-2 md:pt-6 px-4 pb-4 backdrop-blur-xl transition-all duration-700">
        <header className="flex flex-row items-center justify-between w-full lg:max-w-[1240px] p-4 px-6 md:px-12 bg-[#0c121d]/90 border border-white/10 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              <FaShoppingBag className="text-xl text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mb-0.5">
                Marketplace
              </p>
              <h1 className="text-lg font-black uppercase tracking-tight text-white">
                Resource Center
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="hidden sm:flex flex-col items-end px-5 border-r border-white/10">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1.5">
                Available Credits
              </span>
              <div className="flex items-center gap-2">
                <GiCrystalCluster className="text-blue-400 text-lg" />
                <span className="text-white font-black text-lg">12,850</span>
              </div>
            </div>
            <button className="hidden md:flex items-center justify-center p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all">
              <FaHistory className="text-slate-400" />
            </button>
          </div>
        </header>
      </div>

      {/* --- SHOP CONTENT GRID --- */}
      <div className="w-full lg:max-w-[1240px] flex flex-col items-center pt-12 px-6 pb-32 relative z-10">
        {/* Mobile Selection Tool */}
        <div className="md:hidden w-full flex overflow-x-auto no-scrollbar gap-2 mb-8 items-center bg-black/20 p-2 rounded-2xl border border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#0c121d] border border-white/5 rounded-2xl p-8 hover:border-blue-600/30 transition-all duration-300 relative group flex flex-col"
            >
              {/* Asset Header */}
              <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 bg-white/5 text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  {item.icon}
                </div>
                <span
                  className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md ${
                    item.level === "Elite"
                      ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                      : item.level === "Premium"
                        ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                        : "bg-white/5 text-slate-500 border border-white/10"
                  }`}
                >
                  {item.level}
                </span>
              </div>

              {/* Asset Description */}
              <div className="flex flex-col flex-1">
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">
                  {item.name}
                </h3>
                <p className="text-slate-500 text-[13px] leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              {/* Asset Footer / CTA */}
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Price
                  </span>
                  <div className="flex items-center gap-1.5">
                    <GiCrystalCluster className="text-blue-500 text-lg" />
                    <span className="text-white font-bold text-xl leading-none">
                      {item.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-bold uppercase tracking-tight rounded-xl transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] active:scale-95">
                  Deploy
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* System Stats Banner */}
        <div className="mt-20 w-full p-10 bg-black/40 border border-white/5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-black text-white mb-1 uppercase tracking-tight">
              Ecosystem Cycle
            </h2>
            <p className="text-slate-500 text-xs font-medium">
              New administrative assets are refreshed every 72 hours for
              high-priority members.
            </p>
          </div>
          <div className="flex items-center gap-10">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">4.8k</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                Active nodes
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">128</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                Daily trades
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
