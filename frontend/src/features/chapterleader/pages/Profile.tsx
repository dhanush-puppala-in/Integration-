import React, { useState, useEffect } from "react";
import { IoMdSettings, IoMdTrendingUp, IoMdRocket } from "react-icons/io";
import {
  FaGraduationCap,
  FaGlobeAmericas,
  FaUsers,
  FaMedal,
  FaBell,
  FaCheckCircle,
  FaPlus,
  FaTrash,
  FaEdit,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { GiCrystalCluster } from "react-icons/gi";

import ProfileWidget from "../../../layout/rightsidebar/ProfileWidget";
import DailyQuestWidget from "../../../layout/rightsidebar/DailyQuestWidget";
import { chapterLeaderApi } from "../../../api/chapterLeader";
import { useToast } from "../../../context/ToastContext";

interface Address {
  _id?: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Leader {
  name: string;
  email: string;
  totalIpEarned: number;
  address: Address[];
}

const Profile: React.FC = () => {
  const { addToast } = useToast();
  const [leader, setLeader] = useState<Leader | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<Address>({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  const fetchLeaderDetails = async () => {
    try {
      setLoading(true);
      const res = await chapterLeaderApi.getChapterleaderDetails();
      if (res.data.success) {
        setLeader(res.data.chapterLeader);
      }
    } catch (error) {
      console.error("Error fetching leader details:", error);
      addToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderDetails();
  }, []);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress?._id) {
        const res = await chapterLeaderApi.updateAddress(editingAddress._id, addressForm);
        if (res.data.success) {
          addToast("Address updated successfully", "success");
        }
      } else {
        const res = await chapterLeaderApi.addAddress(addressForm);
        if (res.data.success) {
          addToast("Address added successfully", "success");
        }
      }
      setIsAddressModalOpen(false);
      setEditingAddress(null);
      setAddressForm({
        name: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
      });
      fetchLeaderDetails();
    } catch (error: any) {
      addToast(error.response?.data?.message || "Something went wrong", "error");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await chapterLeaderApi.deleteAddress(addressId);
      if (res.data.success) {
        addToast("Address deleted successfully", "success");
        fetchLeaderDetails();
      }
    } catch (error) {
      addToast("Failed to delete address", "error");
    }
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setAddressForm(addr);
    setIsAddressModalOpen(true);
  };

  if (loading || !leader) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#070b14] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen text-white w-full relative bg-[#070b14] p-6 md:p-14 ">
      {/* Professional Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />

      {/* --- PROFESSIONAL PROFILE HEADER --- */}
      <div className="w-full flex flex-col items-center pt-6 md:pt-10 pb-16 px-6 relative z-10 border-b border-white/5">
        <div className="w-full lg:max-w-[1700px] flex flex-col md:flex-row items-stretch gap-12 xl:gap-20">
          {/* Section 1: Avatar & Quick Actions */}
          <div className="flex-1 flex flex-col items-center gap-8 shrink-0">
            <div className="relative group">
              <div className="w-44 h-44 md:w-56 md:h-56 rounded-3xl overflow-hidden border-2 border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-[#0c121d] p-1 transition-all duration-500 group-hover:border-blue-500/30 group-hover:shadow-[0_40px_80px_-16px_rgba(37,99,235,0.2)]">
                <div className="w-full h-full rounded-[20px] overflow-hidden bg-slate-900/50 flex items-center justify-center relative">
                  <FaUsers className="text-6xl text-blue-500/20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent" />
                </div>
              </div>
              {/* Professional Tier Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#0c121d] px-5 py-2.5 rounded-xl border border-blue-500/20 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap">
                    Active Leader
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col gap-3 w-full max-w-[240px]">
              <button className="flex items-center justify-center gap-3 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_12px_24px_-6px_rgba(37,99,235,0.4)] active:scale-95 w-full font-black">
                Edit Profile
              </button>
              <button className="flex items-center justify-center gap-3 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all w-full font-black">
                <IoMdSettings className="text-sm" />
                Settings
              </button>
            </div>
          </div>

          {/* Section 2: Bio, Professional DNA & Core Metrics */}
          <div className="flex-1 flex flex-col justify-between pt-2">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-blue-500 tracking-[0.3em] uppercase">
                  Executive Profile
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              </div>

              <h1 className="text-4xl xl:text-5xl font-black tracking-tight mb-5 text-white">
                {leader.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-300">
                    {leader.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Core Metrics Grid - Unified in Section 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-white/5 w-full mt-auto">
              <div className="flex flex-col items-center md:items-start group cursor-default">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 group-hover:text-blue-500 transition-colors">
                  Portfolio
                </span>
                <div className="flex items-center gap-2 text-blue-400">
                  <GiCrystalCluster className="text-xl shrink-0" />
                  <span className="text-xl xl:text-2xl font-black text-white whitespace-nowrap leading-none">
                    {leader.totalIpEarned.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start group cursor-default">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 group-hover:text-slate-300 transition-colors">
                  Addresses
                </span>
                <div className="flex items-center gap-2 text-slate-400">
                  <FaMapMarkerAlt className="text-xl shrink-0" />
                  <span className="text-xl xl:text-2xl font-black text-white whitespace-nowrap leading-none">
                    {leader.address.length}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start group cursor-default">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 group-hover:text-emerald-500 transition-colors">
                  Growth
                </span>
                <div className="flex items-center gap-2 text-emerald-500">
                  <IoMdTrendingUp className="text-xl shrink-0" />
                  <span className="text-xl xl:text-2xl font-black text-white whitespace-nowrap leading-none">
                    92%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Analytical Intelligence (Integrated Widgets) */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="w-full">
              <ProfileWidget />
            </div>
            <div className="w-full">
              <DailyQuestWidget />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:max-w-[1700px] grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 pb-32 relative z-10 mt-16">
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* Address Management Section */}
          <div className="bg-[#0c121d] border border-white/5 rounded-2xl p-8">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-blue-500" />
                  </div>
                  <h2 className="text-lg font-black uppercase tracking-tight">
                    Shipping Addresses
                  </h2>
                </div>
                <button 
                  onClick={() => { setIsAddressModalOpen(true); setEditingAddress(null); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                >
                  <FaPlus /> Add New
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leader.address.map((addr) => (
                  <div key={addr._id} className="p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all group relative">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{addr.name}</h4>
                        <p className="text-[11px] text-slate-500 font-bold">{addr.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(addr)} className="p-2 bg-white/5 hover:bg-blue-600/20 rounded-lg text-slate-400 hover:text-blue-500 transition-all">
                          <FaEdit size={14} />
                        </button>
                        <button onClick={() => handleDeleteAddress(addr._id!)} className="p-2 bg-white/5 hover:bg-red-600/20 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="text-[12px] text-slate-400 leading-relaxed font-medium">
                      {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}<br />
                      {addr.city}, {addr.state} - {addr.zip}<br />
                      {addr.country}
                    </div>
                  </div>
                ))}
                {leader.address.length === 0 && (
                  <div className="col-span-full border-2 border-dashed border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-500">
                    <FaMapMarkerAlt className="text-4xl mb-4 opacity-20" />
                    <p className="text-[11px] font-black uppercase tracking-[0.2em]">No addresses configured</p>
                  </div>
                )}
              </div>
          </div>

          {/* Verified Credentials Section */}
          <div className="bg-[#0c121d] border border-white/5 rounded-2xl p-8 overflow-hidden relative">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                  <FaMedal className="text-blue-500" />
                </div>
                <h2 className="text-lg font-black uppercase tracking-tight">
                  Verified Credentials
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  name: "Founding Member",
                  level: "Elite",
                  icon: <IoMdRocket />,
                },
                {
                  name: "Active Node",
                  level: "Standard",
                  icon: <GiCrystalCluster />,
                },
              ].map((badge) => (
                <div
                  key={badge.name}
                  className="flex flex-col items-center p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 bg-white/5 text-slate-400 group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-all duration-300">
                    {badge.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white mb-1">
                    {badge.name}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
                    {badge.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          {/* Status Card */}
          <div className="bg-[#0c121d] border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl pointer-events-none" />

            <h2 className="text-base font-black uppercase tracking-widest text-white mb-8 flex items-center justify-between">
              <span className="flex items-center gap-3">
                <FaCheckCircle className="text-blue-500" /> Operational Status
              </span>
              <span className="text-[9px] text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded">
                ONLINE
              </span>
            </h2>

            <div className="flex flex-col gap-7">
              {[
                {
                  node: "Account Security",
                  status: "Verified",
                  prog: 100,
                  active: true,
                },
              ].map((s) => (
                <div key={s.node} className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-slate-300">
                    <span className={s.active ? "text-white" : ""}>
                      {s.node}
                    </span>
                    <span className="text-slate-500 font-black">{s.prog}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${s.prog === 100 ? "bg-emerald-500" : "bg-blue-600"}`}
                      style={{ width: `${s.prog}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
          <div className="bg-[#0c121d] border border-white/10 rounded-3xl w-full max-w-xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
            
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8 relative z-10">
              {editingAddress ? "Update Address" : "Add New Address"}
            </h2>

            <form onSubmit={handleAddressSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={addressForm.name} 
                    onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all" 
                    placeholder="Recipient Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
                  <input 
                    required 
                    type="text" 
                    value={addressForm.phone} 
                    onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all" 
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Address Line 1</label>
                <input 
                  required 
                  type="text" 
                  value={addressForm.addressLine1} 
                  onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all" 
                  placeholder="Street, Building, etc."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Address Line 2 (Optional)</label>
                <input 
                  type="text" 
                  value={addressForm.addressLine2} 
                  onChange={(e) => setAddressForm({...addressForm, addressLine2: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all" 
                  placeholder="Appt, Suite, Landmark"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">City</label>
                  <input 
                    required 
                    type="text" 
                    value={addressForm.city} 
                    onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">State</label>
                  <input 
                    required 
                    type="text" 
                    value={addressForm.state} 
                    onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ZIP</label>
                  <input 
                    required 
                    type="text" 
                    value={addressForm.zip} 
                    onChange={(e) => setAddressForm({...addressForm, zip: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
