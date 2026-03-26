import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Gift,
  MapPin,
  X,
  History,
  Info,
  Truck,
  Coins,
  Plus,
  Check,
  Package,
  Shield,
  Pencil,
  Trash2,
  Lock,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { useToast } from "../../../context/ToastContext";
import logo from "../../../assets/macbease.png";
import { StoreApi } from "../../../api/StoreApi";
import Smartimage from "../../../utils/Smartimage";
// --- Types ---
interface Variant {
  name: string;
  stock: number;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  pointsRequired: number;
  isAvailable: boolean;
  variants: Variant[];
  requiresShipping: boolean;
  voucherDetails?: {
    brand: string;
    value: number;
    type: string;
  };
  stock?: number;
}

interface SavedAddress {
  id: string;
  label: string;
  name: string;
  phone: string;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
}

// --- Reusable Components ---
const ProductCard: React.FC<{
  item: Product;
  onRedeem: (product: Product) => void;
  userPoints: number;
}> = ({ item, onRedeem, userPoints }) => {
  const canAfford = userPoints >= item.pointsRequired;
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#292929] rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-white/80 overflow-hidden group hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col h-full"
  >
    {/* Top: Image Section */}
    <div className="w-full h-40 bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center">
      <Smartimage imgKey={item.image} width={400} contain={true} className="w-full h-full object-cover"/>
    </div>

    {/* Bottom: Info Section */}
    <div className="p-5 bg-[#292929] flex flex-col flex-1">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-black text-white tracking-tight group-hover:text-blue-600 transition-colors">
          {item.name}
        </h3>
        <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-xl border border-yellow-500/20">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span className="text-yellow-600 font-black text-xs">
            {item.pointsRequired.toLocaleString()}
          </span>
        </div>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 font-medium">
        {item.description}
      </p>

      <button
        onClick={() => true && onRedeem(item)}
        // disabled={!canAfford}
        className={`w-full py-3 mt-auto rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg active:scale-95 ${
          canAfford
            ? "bg-[#1a1a1a] hover:bg-black text-white shadow-black/10"
            : "bg-white/5 text-gray-600 cursor-not-allowed"
        }`}
      >
        {canAfford ? (
          <>
            Redeem Reward
            {item.requiresShipping && <Truck className="w-3.5 h-3.5" />}
          </>
        ) : (
          <>
            <Lock className="w-3 h-3" />
            Not enough coins
          </>
        )}
      </button>
    </div>
  </motion.div>
  );
};

const Shop: React.FC = () => {
  const { addToast } = useToast();
  const { details } = useSelector((state: RootState) => state.chapterLeader);
  const actualData = (details as any)?.leader as any;
  const userPoints: number = actualData?.totalIpEarned ?? 0;
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"redeem" | "orders">("redeem");
  const [showRedeemPanel, setShowRedeemPanel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");

  // Address management
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
    {
      id: "addr_1",
      label: "Home",
      name: "Dhanush Puppala",
      phone: "+91 98765 43210",
      fullAddress: "Flat 402, Skyline Towers, Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034",
    },
    {
      id: "addr_2",
      label: "Office",
      name: "Dhanush Puppala",
      phone: "+91 91234 56789",
      fullAddress: "3rd Floor, Tech Park, HITEC City",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500081",
    },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>("addr_1");
  const [addressFormMode, setAddressFormMode] = useState<"hidden" | "new" | "edit">("hidden");
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    name: "",
    phone: "",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
  });

  const emptyForm = { label: "", name: "", phone: "", fullAddress: "", city: "", state: "", pincode: "" };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await StoreApi.getProducts();
        setProducts(response.data.products || response.data);
      } catch (error) {
        addToast("Failed to load store", "error");
      }
    };
    fetchProducts();
  }, []);

  const handleRedeem = (product: Product) => {
    setSelectedProduct(product);
    if (product.variants && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0]._id);
    } else {
      setSelectedVariantId("");
    }

    // Digital products don't need shipping address
    if (!product.requiresShipping) {
      processRedeem(product._id);
      return;
    }

    // Physical products — show address modal
    if (savedAddresses.length === 0) {
      setAddressFormMode("new");
    } else {
      setAddressFormMode("hidden");
    }
    setEditingAddressId(null);
    setShowRedeemPanel(true);
  };

  const closePanel = () => {
    setShowRedeemPanel(false);
    setAddressFormMode("hidden");
    setEditingAddressId(null);
  };

  const processRedeem = async (productId: string, variantId?: string, shippingAddress?: any) => {
    const product = products.find((p) => p._id === productId);
    const variantName = product?.variants?.find((v) => v._id === variantId)?.name;
    const msg = variantName
      ? `${product?.name} (${variantName}) redeemed!`
      : `${product?.name} redeemed!`;
    addToast(msg, "success");
    closePanel();
  };

  const openNewAddressForm = () => {
    setAddressForm(emptyForm);
    setEditingAddressId(null);
    setAddressFormMode("new");
  };

  const openEditAddressForm = (addr: SavedAddress) => {
    setAddressForm({
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      fullAddress: addr.fullAddress,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setEditingAddressId(addr.id);
    setAddressFormMode("edit");
  };

  const handleSaveAddress = () => {
    if (Object.values(addressForm).some((val) => !val)) {
      addToast("Fill all fields", "error");
      return;
    }

    if (addressFormMode === "edit" && editingAddressId) {
      // Update existing
      setSavedAddresses((prev) =>
        prev.map((a) => (a.id === editingAddressId ? { ...a, ...addressForm } : a))
      );
      addToast("Address updated", "success");
    } else {
      // Create new
      const addr: SavedAddress = { id: Date.now().toString(), ...addressForm };
      setSavedAddresses((prev) => [...prev, addr]);
      setSelectedAddressId(addr.id);
      addToast("Address saved", "success");
    }

    setAddressFormMode("hidden");
    setEditingAddressId(null);
    setAddressForm(emptyForm);
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddressId === id) setSelectedAddressId(null);
    addToast("Removed", "success");
  };

  const submitOrder = () => {
    if (!selectedAddressId) {
      addToast("Select an address", "error");
      return;
    }
    const addr = savedAddresses.find((a) => a.id === selectedAddressId);
    if (selectedProduct && addr) {
      processRedeem(selectedProduct._id, selectedVariantId || undefined, addr);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-white w-full bg-[#f8f9fa] relative overflow-x-hidden">
      {/* 1. DARK HEADER */}
      <div className="w-full bg-[#121212] pb-24 relative overflow-hidden text-white">
        

        <div className="flex flex-col items-center pt-16 px-6">
          <div className="w-24 h-24 mb-6 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl transform group hover:rotate-0 transition-all duration-500">
            <img src={logo} alt="" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter">
            Macbease <span className="text-gray-400">Store</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium max-w-lg text-center leading-relaxed">
            Shop in our store or redeem our products for free by using MacCoins. Official merchandise and digital access keys.
          </p>

          <div className="flex items-center gap-4 mt-10">
            <button
              onClick={() => setActiveTab("redeem")}
              className={`flex items-center gap-3 px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 shadow-xl ${
                activeTab === "redeem"
                  ? "bg-white text-black scale-105"
                  : "bg-transparent text-gray-500 border border-white/10 hover:bg-white/5"
              }`}
            >
              <Gift className={`w-4 h-4 ${activeTab === "redeem" ? "text-orange-500" : ""}`} />
              Redeem
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-3 px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === "orders"
                  ? "bg-white text-black scale-105"
                  : "bg-transparent text-gray-500 border border-white/10 hover:bg-white/5"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              View Orders
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-12 bg-[#292929] clip-path-header-wave" />
      </div>

      {/* 2. PRODUCT GRID */}
      <div className="flex-1 w-full flex flex-col items-center px-6 py-12 bg-[#292929]">
        <div className="w-full max-w-[1200px]">
          {activeTab === "redeem" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((item) => (
                <ProductCard key={item._id} item={item} onRedeem={handleRedeem} userPoints={userPoints} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
                <History className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2 tracking-tight">No active orders found</h2>
              <p className="text-gray-400 text-sm max-w-xs font-medium">
                You haven't redeemed any rewards yet. Start exploring the store to use your points!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. REDEEM MODAL — Centered Split Layout */}
      <AnimatePresence>
        {showRedeemPanel && selectedProduct && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePanel}
              className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
            />

            {/* Modal — Centered */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
            >
              <div className="bg-[#111] w-full max-w-[900px] max-h-[85vh] rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/5 flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-7 py-4 border-b border-white/5 bg-[#0a0a0a] shrink-0">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-blue-400" />
                    <h2 className="text-white font-black text-sm uppercase tracking-widest">
                      Confirm Redemption
                    </h2>
                  </div>
                  <button
                    onClick={closePanel}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body — Split Layout */}
                <div className="flex-1 flex overflow-hidden min-h-0">
                  {/* LEFT SIDE — Product Details */}
                  <div className="w-[320px] min-w-[320px] bg-[#0d0d0d] border-r border-white/5 flex flex-col overflow-y-auto no-scrollbar">
                    <div className="w-full h-48 bg-[#080808] flex items-center justify-center">
                      <Smartimage imgKey={selectedProduct.image} width={400} height={250} contain={true} className="w-full h-full object-cover"/>
                    </div>

                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <div>
                        <h3 className="text-lg font-black text-white mt-1 tracking-tight leading-tight">
                          {selectedProduct.name}
                        </h3>
                      </div>

                      <p className="text-gray-500 text-[11px] leading-relaxed font-medium">
                        {selectedProduct.description}
                      </p>

                      <div className="flex items-center gap-3 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl px-4 py-3">
                        <Coins className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="text-yellow-500 font-black text-lg leading-none">
                            {selectedProduct.pointsRequired.toLocaleString()}
                          </p>
                          <p className="text-yellow-600/60 text-[9px] font-black uppercase tracking-widest mt-0.5">
                            MacCoins
                          </p>
                        </div>
                      </div>

                      {/* Variant Selector */}
                      {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                            Choose Variant
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.variants.map((variant) => (
                              <button
                                key={variant._id}
                                onClick={() => setSelectedVariantId(variant._id)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 border ${
                                  selectedVariantId === variant._id
                                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                {variant.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-auto flex items-center gap-2 text-gray-500 pt-3 border-t border-white/5">
                        <Shield className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          Free shipping • 5-7 days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE — Address Selection & Form */}
                  <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-[#111]">
                    <div className="p-5 flex flex-col gap-4 flex-1">
                      {/* Header with Add New button */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <h3 className="text-white font-black text-xs uppercase tracking-widest">
                            Delivery Address
                          </h3>
                        </div>
                        {savedAddresses.length > 0 && addressFormMode === "hidden" && (
                          <button
                            onClick={openNewAddressForm}
                            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-[10px] font-black uppercase tracking-widest transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add New
                          </button>
                        )}
                      </div>

                      {/* Saved Address Cards */}
                      {savedAddresses.length > 0 && addressFormMode === "hidden" && (
                        <div className="flex flex-col gap-3">
                          {savedAddresses.map((addr) => (
                            <div
                              key={addr.id}
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                                selectedAddressId === addr.id
                                  ? "border-blue-500 bg-blue-500/5"
                                  : "border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/5"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className="px-2 py-0.5 bg-white/10 rounded-md text-[8px] font-black text-gray-300 uppercase tracking-widest">
                                      {addr.label}
                                    </span>
                                    <span className="text-white text-xs font-bold">{addr.name}</span>
                                  </div>
                                  <p className="text-gray-500 text-[11px] font-medium leading-relaxed">
                                    {addr.fullAddress}, {addr.city}, {addr.state} - {addr.pincode}
                                  </p>
                                  <p className="text-gray-600 text-[10px] font-bold mt-1">
                                    📞 {addr.phone}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-3">
                                  {/* Edit & Delete */}
                                  <button
                                    onClick={(e) => { e.stopPropagation(); openEditAddressForm(addr); }}
                                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-blue-400 transition-all"
                                    title="Edit"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}
                                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-500 hover:text-red-400 transition-all"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                  {/* Radio check */}
                                  <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                      selectedAddressId === addr.id
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-white/20 bg-transparent"
                                    }`}
                                  >
                                    {selectedAddressId === addr.id && (
                                      <Check className="w-3 h-3 text-white" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Address Form (New or Edit) */}
                      {(addressFormMode !== "hidden" || savedAddresses.length === 0) && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-white text-xs font-black uppercase tracking-widest">
                              {addressFormMode === "edit" ? "Edit Address" : savedAddresses.length === 0 ? "Create Address" : "New Address"}
                            </p>
                            {savedAddresses.length > 0 && (
                              <button
                                onClick={() => { setAddressFormMode("hidden"); setEditingAddressId(null); }}
                                className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>

                          {/* Label */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">
                              Label
                            </label>
                            <div className="flex gap-2">
                              {["Home", "Office", "Other"].map((lbl) => (
                                <button
                                  key={lbl}
                                  onClick={() => setAddressForm({ ...addressForm, label: lbl })}
                                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                                    addressForm.label === lbl
                                      ? "bg-blue-600 border-blue-500 text-white"
                                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                  }`}
                                >
                                  {lbl}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Name & Phone */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                              <input
                                type="text"
                                placeholder="John Doe"
                                value={addressForm.name}
                                onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone</label>
                              <input
                                type="text"
                                placeholder="+91..."
                                value={addressForm.phone}
                                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                              />
                            </div>
                          </div>

                          {/* Full Address */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Address</label>
                            <textarea
                              rows={2}
                              placeholder="House No, Street, Landmark..."
                              value={addressForm.fullAddress}
                              onChange={(e) => setAddressForm({ ...addressForm, fullAddress: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                            />
                          </div>

                          {/* City, State, Pincode */}
                          <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">City</label>
                              <input
                                type="text"
                                placeholder="Mumbai"
                                value={addressForm.city}
                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">State</label>
                              <input
                                type="text"
                                placeholder="Maharashtra"
                                value={addressForm.state}
                                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Pincode</label>
                              <input
                                type="text"
                                placeholder="400001"
                                value={addressForm.pincode}
                                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                              />
                            </div>
                          </div>

                          {/* Save / Update Button */}
                          <button
                            onClick={handleSaveAddress}
                            className="w-full py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-white/10 active:scale-[0.98]"
                          >
                            {addressFormMode === "edit" ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                Update Address
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                Save Address
                              </>
                            )}
                          </button>
                        </motion.div>
                      )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="shrink-0 bg-[#0a0a0a] border-t border-white/5 px-5 py-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Info className="w-3 h-3 text-blue-400" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">
                          Estimated delivery: 5-7 business days
                        </span>
                      </div>
                      <button
                        onClick={submitOrder}
                        disabled={!selectedAddressId}
                        className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                          selectedAddressId
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30"
                            : "bg-white/5 text-gray-600 cursor-not-allowed"
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                        Confirm & Ship
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .clip-path-header-wave {
          clip-path: ellipse(50% 100% at 50% 100%);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Shop;

