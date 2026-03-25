import React, { useState, useEffect } from "react";
import { IoMdStar, IoMdColorPalette, IoMdClose } from "react-icons/io";
import {
  FaShieldAlt,
  FaTicketAlt,
  FaBolt,
  FaShoppingBag,
  FaHistory,
  FaMapMarkerAlt,
  FaPlus,
  FaCheckCircle,
} from "react-icons/fa";
import { GiCrystalCluster } from "react-icons/gi";
import { productApi } from "../../../api/product";
import { chapterLeaderApi } from "../../../api/chapterLeader";
import { useToast } from "../../../context/ToastContext";

// --- Shop Data Types ---
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

interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  type: string;
  category: string;
  pointsRequired: number;
  stock: number;
  isAvailable: boolean;
  requiresShipping: boolean;
  voucherDetails?: {
    brand: string;
    value: number;
    type: string;
  };
}

interface Leader {
  name: string;
  email: string;
  totalIpEarned: number;
  address: Address[];
}

const Shop: React.FC = () => {
  const { addToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [leader, setLeader] = useState<Leader | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, leaderRes] = await Promise.all([
        productApi.getAllProducts(),
        chapterLeaderApi.getChapterleaderDetails()
      ]);
      console.log(productsRes, leaderRes)
      if (productsRes.data.success) {
        setProducts(productsRes.data.products);
      }
      if (leaderRes.data.success) {
        const leaderData = leaderRes.data.chapterLeader;
        setLeader(leaderData);
        // Default to first address if available and not already set
        if (leaderData.address.length > 0 && !selectedAddressId) {
          setSelectedAddressId(leaderData.address[0]._id!);
        }
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
      addToast("Failed to load shop data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClaim = async () => {
    if (!selectedProduct || !leader) return;

    if (leader.totalIpEarned < selectedProduct.pointsRequired) {
      addToast("Insufficient points", "error");
      return;
    }

    if (selectedProduct.requiresShipping && !selectedAddressId) {
      addToast("Please select an address for shipping", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await chapterLeaderApi.claimProduct(selectedProduct._id);
      if (res.data.success) {
        addToast("Product claimed successfully!", "success");
        setIsOrderModalOpen(false);
        setSelectedProduct(null);
        await fetchData(); // Refresh data to update points and stock
      } else {
        addToast(res.data.message || "Failed to claim product", "error");
      }
    } catch (error: any) {
      console.error("Claim error:", error);
      addToast(error.response?.data?.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await chapterLeaderApi.addAddress(addressForm);
      if (res.data.success) {
        addToast("Address added successfully", "success");
        const updatedLeaderRes = await chapterLeaderApi.getChapterleaderDetails();
        if (updatedLeaderRes.data.success) {
          const updatedLeader = updatedLeaderRes.data.chapterLeader;
          setLeader(updatedLeader);
          // Set selected address to the newly added one
          const newAddr = updatedLeader.address[updatedLeader.address.length - 1];
          if (newAddr?._id) {
             setSelectedAddressId(newAddr._id);
          }
          setShowAddressForm(false);
        }
      }
    } catch (error: any) {
      addToast(error.response?.data?.message || "Failed to add address", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredItems =
    selectedCategory === "All"
      ? products
      : products.filter((i) => i.category === selectedCategory);

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "skins": return <IoMdColorPalette />;
      case "badges": return <IoMdStar />;
      case "avatars": return <FaShieldAlt />;
      case "boosts": return <FaBolt />;
      case "voucher": return <FaTicketAlt />;
      case "clothing": return <FaShoppingBag />;
      default: return <FaShoppingBag />;
    }
  };

  const getLevel = (points: number) => {
    if (points >= 5000) return "Elite";
    if (points >= 1500) return "Premium";
    return "Standard";
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
    setShowAddressForm(false);
  };

  if (loading || !leader) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#070b14] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen text-white w-full relative bg-[#070b14] selection:bg-blue-600/30">
      {/* Subtle Background Accents */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-600/10 via-blue-600/5 to-transparent pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* --- ELITE NAV HEADER --- */}
      <div className="sticky top-0 z-[100] w-full flex flex-col items-center pt-2 md:pt-6 px-4 pb-4 backdrop-blur-xl transition-all duration-700">
        <header className="flex flex-row items-center justify-between w-full lg:max-w-[1240px] p-4 px-6 md:px-10 bg-[#0c121d]/80 border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-transform group-hover:scale-105">
              <FaShoppingBag className="text-xl text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-500/80 tracking-[0.3em] uppercase mb-0.5">
                Marketplace
              </p>
              <h1 className="text-xl font-black uppercase tracking-tight text-white leading-none">
                Resource Center
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] scale-105"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="hidden sm:flex flex-col items-end px-6 border-r border-white/10">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2 opacity-70">
                Available Credits
              </span>
              <div className="flex items-center gap-2.5">
                <GiCrystalCluster className="text-blue-400 text-xl animate-pulse" />
                <span className="text-white font-black text-2xl tracking-tighter">{leader.totalIpEarned.toLocaleString()}</span>
              </div>
            </div>
            <button className="flex items-center justify-center p-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg group/hist">
              <FaHistory className="text-slate-400 group-hover/hist:text-blue-400 transition-colors" />
            </button>
          </div>
        </header>
      </div>

      {/* --- SHOP CONTENT GRID --- */}
      <div className="w-full lg:max-w-[1240px] flex flex-col items-center pt-8 md:pt-16 px-6 pb-40 relative z-10">
        
        {/* Mobile Selection Tool */}
        <div className="md:hidden w-full flex overflow-x-auto no-scrollbar gap-2 mb-10 items-center bg-black/40 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-lg active:scale-95"
                  : "text-slate-500 bg-white/5 border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              onClick={() => openProductDetail(item)}
              className="bg-[#0c121d]/60 backdrop-blur-sm border border-white/5 rounded-[2rem] p-1.5 hover:border-blue-600/40 transition-all duration-500 relative group flex flex-col cursor-pointer hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] active:scale-[0.99]"
            >
              {/* Asset Container */}
              <div className="bg-[#0c121d] rounded-[1.8rem] p-6 h-full flex flex-col border border-white/5">
                {/* Image / Icon Area */}
                <div className="relative w-full aspect-[4/3] rounded-2xl mb-8 overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center group-hover:border-blue-600/20 transition-colors">
                   {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                    />
                  ) : (
                    <div className="text-4xl text-slate-700/50 group-hover:text-blue-500/50 transition-colors duration-500">
                      {getIcon(item.category)}
                    </div>
                  )}
                  
                  {/* Badge Overlay */}
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <span
                      className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg backdrop-blur-md border ${
                        getLevel(item.pointsRequired) === "Elite"
                          ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                          : getLevel(item.pointsRequired) === "Premium"
                            ? "bg-purple-500/20 text-purple-500 border-purple-500/30"
                            : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }`}
                    >
                      {getLevel(item.pointsRequired)}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c121d] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
                        View Specs <FaBolt size={10} className="animate-bounce" />
                     </span>
                  </div>
                </div>

                {/* Info Area */}
                <div className="flex flex-col flex-1 px-2">
                  <div className="flex items-start justify-between mb-3 gap-4">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-[12px] leading-relaxed font-medium line-clamp-2 mb-6">
                    {item.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 opacity-60">Price Range</span>
                      <div className="flex items-center gap-2">
                        <GiCrystalCluster className="text-blue-500 text-lg" />
                        <span className="text-white font-black text-xl tracking-tighter">
                          {item.pointsRequired.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 opacity-60">Availability</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${item.stock > 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {item.stock > 0 ? `${item.stock} Units` : "Depleted"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- PRODUCT DETAIL MODAL --- */}
      {isOrderModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10 backdrop-blur-2xl bg-black/90 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-[#0c121d] border border-white/10 rounded-[2.5rem] w-full max-w-5xl shadow-[0_0_100px_rgba(37,99,235,0.15)] relative overflow-hidden flex flex-col md:row-span-1 md:flex-row max-h-[90vh] lg:h-[700px]">
            <button 
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute top-8 right-8 z-[2001] p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all hover:rotate-90"
            >
              <IoMdClose size={24} />
            </button>

            {/* Left side: Hero Asset */}
            <div className="w-full md:w-1/2 h-72 md:h-auto bg-[#070b14] relative group/modalimg">
               <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay pointer-events-none" />
               {selectedProduct.image ? (
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover opacity-60 transition-transform duration-[2s] group-hover/modalimg:scale-110" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[120px] text-white/5">
                  {getIcon(selectedProduct.category)}
                </div>
              )}
              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0c121d] via-transparent to-transparent opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0c121d] md:hidden" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-10 left-10 z-10 hidden md:block">
                  <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-3xl animate-in slide-in-from-left-4 duration-700">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-600/30">
                       <GiCrystalCluster className="text-blue-400 text-2xl" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Price per unit</p>
                      <h4 className="text-2xl font-black text-white tracking-tighter leading-none">{selectedProduct.pointsRequired.toLocaleString()}</h4>
                    </div>
                  </div>
              </div>
            </div>

            {/* Right side: Configuration Panel */}
            <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col overflow-y-auto !scrollbar-hide">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 uppercase tracking-[0.25em]">{selectedProduct.category}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10 ${selectedProduct.stock > 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {selectedProduct.stock > 0 ? "Inventory Ready" : "Out of Stack"}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6 leading-tight">{selectedProduct.name}</h2>
                <div className="h-1 w-20 bg-blue-600 rounded-full mb-8" />
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium opacity-80">{selectedProduct.description}</p>
              </div>

              {/* Order Context */}
              <div className="space-y-8">
                  {selectedProduct.requiresShipping && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-2 text-yellow-500/80">
                            <FaMapMarkerAlt size={14} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Shipping Required</span>
                          </div>
                          {!showAddressForm && (
                             <button 
                              onClick={() => setShowAddressForm(true)}
                              className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:blue-300 transition-all flex items-center gap-2 hover:translate-x-1"
                            >
                              <FaPlus size={10} /> Add New Connection
                            </button>
                          )}
                        </div>
                        
                        {!showAddressForm ? (
                          <div className="space-y-3">
                             {leader.address.length > 0 ? (
                               <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto !scrollbar-hide pr-2">
                                 {leader.address.map((addr) => (
                                   <div 
                                    key={addr._id}
                                    onClick={() => setSelectedAddressId(addr._id!)}
                                    className={`group/addr p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
                                      selectedAddressId === addr._id 
                                      ? "bg-blue-600/10 border-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.1)]" 
                                      : "bg-white/5 border-white/5 hover:border-white/20"
                                    }`}
                                   >
                                     <div className="relative z-10">
                                       <div className="flex justify-between items-center mb-2">
                                          <p className="text-[11px] font-black text-white uppercase tracking-tight">{addr.name}</p>
                                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${selectedAddressId === addr._id ? "bg-blue-600 border-blue-600" : "border-white/20"}`}>
                                            {selectedAddressId === addr._id && <FaCheckCircle className="text-white" size={12} />}
                                          </div>
                                       </div>
                                       <p className="text-[12px] text-slate-500 group-hover/addr:text-slate-400 transition-colors font-medium">{addr.addressLine1}</p>
                                       <div className="flex items-center gap-4 mt-1">
                                          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{addr.city}, {addr.state}</p>
                                          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-none">{addr.phone}</p>
                                       </div>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             ) : (
                               <button 
                                onClick={() => setShowAddressForm(true)}
                                className="w-full p-12 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-slate-500 hover:text-white hover:border-blue-600/30 hover:bg-blue-600/5 transition-all duration-500 group/empty"
                               >
                                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/5 group-hover/empty:scale-110 transition-transform">
                                    <FaPlus className="text-2xl" />
                                  </div>
                                  <span className="text-[11px] font-black uppercase tracking-[0.2em] group-hover/empty:text-blue-400 transition-colors">Establish Shipping Node</span>
                                  <p className="text-[9px] font-medium text-slate-600 mt-2 uppercase">No saved addresses detected in database</p>
                               </button>
                             )}
                          </div>
                        ) : (
                          <form onSubmit={handleAddAddress} className="space-y-4 p-8 bg-white/5 border border-white/5 rounded-[2rem] animate-in zoom-in-95 duration-500">
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Contact Name</label>
                                  <input required type="text" placeholder="Full Name" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-xs outline-none focus:border-blue-500 transition-all text-white font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Phone Protocol</label>
                                  <input required type="text" placeholder="+91 XXXXX XXXXX" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-xs outline-none focus:border-blue-500 transition-all text-white font-medium" />
                                </div>
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Coordinate 1 (Street)</label>
                                <input required type="text" placeholder="House/Flat No, Building, Street" value={addressForm.addressLine1} onChange={e => setAddressForm({...addressForm, addressLine1: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-xs outline-none focus:border-blue-500 transition-all text-white font-medium" />
                             </div>
                             <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                  <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">City</label>
                                  <input required type="text" placeholder="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-xs outline-none focus:border-blue-500 transition-all text-white font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">State</label>
                                  <input required type="text" placeholder="State" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-xs outline-none focus:border-blue-500 transition-all text-white font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">ZIP</label>
                                  <input required type="text" placeholder="Pin" value={addressForm.zip} onChange={e => setAddressForm({...addressForm, zip: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-xs outline-none focus:border-blue-500 transition-all text-white font-medium" />
                                </div>
                             </div>
                             <div className="flex gap-3 pt-6">
                                <button type="button" onClick={() => setShowAddressForm(false)} className="flex-1 py-4 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-blue-600 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-blue-500 transition-all disabled:opacity-50">Secure & Save</button>
                             </div>
                          </form>
                        )}
                    </div>
                  )}

                  {!selectedProduct.requiresShipping && (
                    <div className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-[2rem] flex items-center gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                        <FaBolt className="text-white text-2xl" />
                      </div>
                      <div>
                         <h5 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-1">Instant Deployment</h5>
                         <p className="text-[10px] text-slate-400 font-medium uppercase leading-relaxed tracking-wider">Digital asset. No shipping required. Available in history immediately after claim.</p>
                      </div>
                    </div>
                  )}
              </div>

              {/* Action Zone */}
              {!showAddressForm && (
                <div className="mt-auto pt-10 flex flex-col gap-6">
                   <button 
                    disabled={isSubmitting || selectedProduct.stock === 0 || !selectedProduct.isAvailable || (selectedProduct.requiresShipping && !selectedAddressId)}
                    onClick={handleClaim}
                    className={`group/btn relative w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-[0.98] overflow-hidden ${
                      isSubmitting || selectedProduct.stock === 0 || !selectedProduct.isAvailable || (selectedProduct.requiresShipping && !selectedAddressId)
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                   >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                     <span className="relative z-10 flex items-center justify-center gap-3">
                       {isSubmitting ? "Syncing Transaction..." : selectedProduct.stock === 0 ? "Inventory Depleted" : "Authorize Order"}
                       {!isSubmitting && selectedProduct.stock > 0 && !(selectedProduct.requiresShipping && !selectedAddressId) && <FaCheckCircle size={14} className="group-hover/btn:rotate-[360deg] transition-transform duration-700" />}
                     </span>
                   </button>
                   
                   {selectedProduct.requiresShipping && !selectedAddressId && (
                     <p className="text-center text-[9px] font-black text-red-500 uppercase tracking-[0.2em] animate-pulse">Critical: Shipping route selection required</p>
                   )}
                   
                   <div className="flex items-center justify-center gap-8 opacity-40">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest tracking-widest">Secure Server</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Protocol V4.2</span>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
