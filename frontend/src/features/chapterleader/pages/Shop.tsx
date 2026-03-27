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
  Minus,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";
import logo from "../../../assets/macbease.png";
import { StoreApi } from "../../../api/StoreApi";
import { chapterLeaderApi } from "../../../api/chapterLeader";
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
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
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
    className="bg-[#0f172a]/80 backdrop-blur-md rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-white/10 overflow-hidden group hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:border-white/15 transition-all duration-500 flex flex-col h-full"
  >
    {/* Top: Image Section */}
    <div className="w-full h-40 bg-[#080c14] relative overflow-hidden flex items-center justify-center">
      <Smartimage imgKey={item.image} width={400} contain={true} className="w-full h-full object-cover"/>
    </div>

    {/* Bottom: Info Section */}
    <div className="p-4 bg-transparent flex flex-col flex-1">
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="text-sm font-bold text-white tracking-tight leading-snug group-hover:text-blue-400 transition-colors line-clamp-1">
          {item.name}
        </h3>
        <div className="flex items-center gap-1.5 bg-yellow-500/10 px-2.5 py-1 rounded-lg border border-yellow-500/20 shrink-0">
          <Coins className="w-3.5 h-3.5 text-yellow-500" />
          <span className="text-yellow-500 font-black text-[11px]">
            {item.pointsRequired.toLocaleString()}
          </span>
        </div>
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2 font-medium flex-1">
        {item.description}
      </p>

      <button
        onClick={() => true && onRedeem(item)}
        // disabled={!canAfford}
        className={`w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
          canAfford
            ? "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/20 shadow-blue-500/10"
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
  const { fetchChapterLeaderDetails } = useAuth();
  const { details } = useSelector((state: RootState) => state.chapterLeader);
  const actualData = (details as any)?.leader as any;
  const userPoints: number = actualData?.totalIpEarned ?? 0;
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"redeem" | "orders">("redeem");
  const [showRedeemPanel, setShowRedeemPanel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address management — pull from Redux
  const reduxAddresses = actualData?.addresses || [];
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addressFormMode, setAddressFormMode] = useState<"hidden" | "new" | "edit">("hidden");
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
  });

  const emptyForm = { name: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", zip: "" };

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

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await StoreApi.getOrders();
      setOrders(response.data.orders || response.data);
    } catch (error) {
      addToast("Failed to load orders", "error");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  // Sync addresses from Redux
  useEffect(() => {
    if (reduxAddresses && reduxAddresses.length > 0) {
      const mapped: SavedAddress[] = reduxAddresses.map((a: any) => ({
        id: a._id,
        name: a.name || "",
        phone: a.phone || "",
        addressLine1: a.addressLine1 || "",
        addressLine2: a.addressLine2 || "",
        city: a.city || "",
        state: a.state || "",
        zip: a.zip || "",
      }));
      setSavedAddresses(mapped);
      if (!selectedAddressId && mapped.length > 0) {
        setSelectedAddressId(mapped[0].id);
      }
    } else {
      setSavedAddresses([]);
    }
  }, [reduxAddresses]);

  const handleRedeem = (product: Product) => {
    setSelectedProduct(product);
    if (product.variants && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0]._id);
    } else {
      setSelectedVariantId("");
    }

    // Physical products — handle address logic
    if (product.requiresShipping) {
      if (savedAddresses.length === 0) {
        setAddressFormMode("new");
      } else {
        setAddressFormMode("hidden");
      }
      setEditingAddressId(null);
    } else {
      // Digital products
      setAddressFormMode("hidden");
      setEditingAddressId(null);
    }

    setQuantity(1);
    setShowRedeemPanel(true);
  };

  const closePanel = () => {
    setShowRedeemPanel(false);
    setAddressFormMode("hidden");
    setEditingAddressId(null);
  };

  const processRedeem = async (productId: string, variantId?: string) => {
    try {
      const orderData: any = {
        productId,
        quantity,
      };
      // Address required for physical products
      const product = products.find((p) => p._id === productId);
      if (product?.requiresShipping) {
        if (!selectedAddressId) {
          addToast("Shipping address required", "error");
          return;
        }
        orderData.addressId = selectedAddressId;
      }

      if (variantId) orderData.variantId = variantId;
      await StoreApi.createOrder(orderData);
      
      const variantName = product?.variants?.find((v) => v._id === variantId)?.name;
      const msg = variantName
        ? `${product?.name} (${variantName}) × ${quantity} redeemed!`
        : `${product?.name} × ${quantity} redeemed!`;
      addToast(msg, "success");
      await Promise.all([
        fetchChapterLeaderDetails(),
        fetchOrders()
      ]);
      closePanel();
    } catch (error: any) {
      addToast(error?.response?.data?.message || "Failed to place order", "error");
    }
  };

  const openNewAddressForm = () => {
    setAddressForm(emptyForm);
    setEditingAddressId(null);
    setAddressFormMode("new");
  };

  const openEditAddressForm = (addr: SavedAddress) => {
    setAddressForm({
      name: addr.name,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
    });
    setEditingAddressId(addr.id);
    setAddressFormMode("edit");
  };

  const handleSaveAddress = async () => {
    const { name, phone, addressLine1, city, state, zip } = addressForm;
    if (!name || !phone || !addressLine1 || !city || !state || !zip) {
      addToast("Fill all fields", "error");
      return;
    }

    setSavingAddress(true);
    try {
      if (addressFormMode === "edit" && editingAddressId) {
        await chapterLeaderApi.updateAddress(editingAddressId, addressForm);
        addToast("Address updated", "success");
      } else {
        await chapterLeaderApi.addAddress(addressForm);
        addToast("Address saved", "success");
      }
      // Refresh Redux details to get updated addresses
      await fetchChapterLeaderDetails();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to save address";
      addToast(msg, "error");
    } finally {
      setSavingAddress(false);
    }

    setAddressFormMode("hidden");
    setEditingAddressId(null);
    setAddressForm(emptyForm);
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await chapterLeaderApi.deleteAddress(id);
      if (selectedAddressId === id) setSelectedAddressId(null);
      addToast("Removed", "success");
      await fetchChapterLeaderDetails();
    } catch (error: any) {
      addToast(error?.response?.data?.message || "Failed to delete", "error");
    }
  };

  const submitOrder = () => {
    if (selectedProduct?.requiresShipping && !selectedAddressId) {
      addToast("Select an address", "error");
      return;
    }
    if (selectedProduct) {
      processRedeem(selectedProduct._id, selectedVariantId || undefined);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-white w-full bg-[#0B0F17] relative overflow-x-hidden">
      {/* 1. DARK HEADER */}
      <div className="w-full bg-[#080c14] pb-24 relative overflow-hidden text-white">
        

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
        <div className="absolute bottom-0 left-0 w-full h-12 bg-[#232730]/10 clip-path-header-wave" />
      </div>

      {/* 2. PRODUCT GRID */}
      <div className="flex-1 w-full flex flex-col items-center px-6 py-12 bg-[#232730]/10">
        <div className="w-full max-w-[1200px]">
          {activeTab === "redeem" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
              {[...products]
                .sort((a, b) => {
                  const aCanAfford = userPoints >= a.pointsRequired ? 0 : 1;
                  const bCanAfford = userPoints >= b.pointsRequired ? 0 : 1;
                  return aCanAfford - bCanAfford;
                })
                .map((item) => (
                <div key={item._id} className="h-full">
                  <ProductCard item={item} onRedeem={handleRedeem} userPoints={userPoints} />
                </div>
              ))}
            </div>
          ) : loadingOrders ? (
            <div className="flex flex-col items-center justify-center py-20 w-full">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Fetching your orders...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="flex flex-col gap-4 w-full">
              {orders.map((order) => (
                <div key={order._id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#080c14] rounded-xl flex items-center justify-center border border-white/5 shrink-0">
                      <Package className="w-8 h-8 text-gray-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-white font-black text-sm uppercase tracking-tight leading-none">
                        {order.productName || "Product"} {order.variantName ? `(${order.variantName})` : ""}
                      </h4>
                      <p className="text-gray-500 text-[10px] font-bold">
                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1.5 bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-500/10">
                          <Coins className="w-3 h-3 text-yellow-500" />
                          <span className="text-yellow-500 font-black text-[10px]">
                            {order.totalPointsSpent?.toLocaleString() || order.cost?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/10">
                          <Package className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-400 font-black text-[10px]">Qty: {order.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      order.status === "Delivered" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                      order.status === "Cancelled" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                      "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]"
                    }`}>
                      {order.status || "Processing"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center w-full bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
              <div className="w-20 h-20 bg-[#080c14] rounded-full flex items-center justify-center mb-6 text-gray-500 border border-white/5">
                <History className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">No orders yet</h2>
              <p className="text-gray-500 text-[11px] max-w-xs font-bold uppercase tracking-widest">
                You haven't redeemed any rewards. Start exploring the store to use your MacCoins!
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
              <div className="bg-[#0B0F17] w-full max-w-[900px] max-h-[85vh] rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/10 flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#080c14] shrink-0">
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-blue-400" />
                    <h2 className="text-white font-black text-[11px] uppercase tracking-widest">
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
                  <div className="w-[320px] min-w-[320px] bg-[#0B0F17] border-r border-white/5 flex flex-col overflow-y-auto no-scrollbar">
                    <div className="w-full h-40 bg-[#080c14] flex items-center justify-center">
                      <Smartimage imgKey={selectedProduct.image} width={400} height={250} contain={true} className="w-full h-full object-cover"/>
                    </div>

                    <div className="p-4 flex flex-col gap-2.5 flex-1">
                      <div>
                        <h3 className="text-base font-black text-white tracking-tight leading-tight">
                          {selectedProduct.name}
                        </h3>
                      </div>

                      <p className="text-gray-500 text-[10px] leading-relaxed font-medium">
                        {selectedProduct.description}
                      </p>

                      <div className="flex items-center gap-2.5 bg-yellow-500/5 border border-yellow-500/10 rounded-xl px-3 py-2">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <div>
                          <p className="text-yellow-500 font-black text-base leading-none">
                            {selectedProduct.pointsRequired.toLocaleString()}
                          </p>
                          <p className="text-yellow-600/60 text-[8px] font-black uppercase tracking-widest mt-0.5">
                            MacCoins / each
                          </p>
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      {(() => {
                        const maxQty = selectedProduct.requiresShipping 
                          ? Math.max(1, Math.floor(userPoints / selectedProduct.pointsRequired))
                          : 1;
                        const totalCost = quantity * selectedProduct.pointsRequired;
                        return (
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                              Quantity
                            </label>
                            <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-lg px-2.5 py-1.5">
                              <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                                className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                                  quantity <= 1
                                    ? "bg-white/5 text-gray-700 cursor-not-allowed"
                                    : "bg-white/10 text-white hover:bg-white/15 active:scale-90"
                                }`}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-white font-black text-base w-8 text-center">{quantity}</span>
                              <button
                                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                                disabled={quantity >= maxQty}
                                className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                                  quantity >= maxQty
                                    ? "bg-white/5 text-gray-700 cursor-not-allowed"
                                    : "bg-white/10 text-white hover:bg-white/15 active:scale-90"
                                }`}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            {/* Total Cost */}
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-gray-500 font-bold uppercase tracking-wider">Total</span>
                              <div className="flex items-center gap-1.5">
                                <Coins className="w-3 h-3 text-yellow-500" />
                                <span className={`font-black ${totalCost > userPoints ? "text-red-400" : "text-yellow-500"}`}>
                                  {totalCost.toLocaleString()}
                                </span>
                                <span className="text-gray-600">/ {userPoints.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

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
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 border ${
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

                  {/* RIGHT SIDE — Address Selection & Form OR Digital Confirmation */}
                  <div className="flex-1 flex flex-col bg-[#0B0F17]">
                    <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-3">
                      {selectedProduct.requiresShipping ? (
                        <>
                          {/* Header with Add New button */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-blue-400" />
                              <h3 className="text-white font-black text-[10px] uppercase tracking-widest">
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
                                  className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                    selectedAddressId === addr.id
                                      ? "border-blue-500 bg-blue-500/5"
                                      : "border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/5"
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-white text-[11px] font-bold">{addr.name}</span>
                                      </div>
                                      <p className="text-gray-500 text-[10px] font-medium leading-relaxed">
                                        {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, {addr.city}, {addr.state} - {addr.zip}
                                      </p>
                                      <p className="text-gray-600 text-[9px] font-bold mt-0.5">
                                        {addr.phone}
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

                          {/* No Addresses Empty State */}
                          {savedAddresses.length === 0 && addressFormMode === "hidden" && (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                                <MapPin className="w-6 h-6 text-gray-600" />
                              </div>
                              <p className="text-gray-400 text-sm font-bold mb-1">No Addresses Saved</p>
                              <p className="text-gray-600 text-[11px] font-medium mb-5 max-w-[200px]">
                                Add a delivery address to redeem physical products
                              </p>
                              <button
                                onClick={openNewAddressForm}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600/20 border border-blue-500/20 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/30 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add Address
                              </button>
                            </div>
                          )}

                          {/* Address Form (New or Edit) */}
                          {addressFormMode !== "hidden" && (
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

                              {/* Name & Phone */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                  <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={addressForm.name}
                                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                                  />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone</label>
                                  <input
                                    type="text"
                                    placeholder="+91..."
                                    value={addressForm.phone}
                                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                                  />
                                </div>
                              </div>

                              {/* Address Lines */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Address Line 1</label>
                                <input
                                  type="text"
                                  placeholder="..."
                                  value={addressForm.addressLine1}
                                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Line 2 (optional)</label>
                                <input
                                  type="text"
                                  value={addressForm.addressLine2}
                                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                                />
                              </div>

                              {/* City, State, Zip */}
                              <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">City</label>
                                  <input
                                    type="text"
                                    value={addressForm.city}
                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                                  />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">State</label>
                                  <input
                                    type="text"
                                    value={addressForm.state}
                                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                                  />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Zip Code</label>
                                  <input
                                    type="text"
                                    value={addressForm.zip}
                                    onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                                  />
                                </div>
                              </div>

                              {/* Save / Update Button */}
                              <button
                                onClick={handleSaveAddress}
                                disabled={savingAddress}
                                className={`w-full py-2.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border active:scale-[0.98] ${
                                  savingAddress
                                    ? "bg-white/5 text-gray-600 border-white/5 cursor-wait"
                                    : "bg-white/10 hover:bg-white/15 text-white border-white/10"
                                }`}
                              >
                                {savingAddress ? "Saving..." : addressFormMode === "edit" ? "Update Address" : "Save Address"}
                              </button>
                            </motion.div>
                          )}
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_50px_-10px_rgba(59,130,246,0.3)]">
                            <Gift className="w-10 h-10 text-blue-400" />
                          </div>
                          <h3 className="text-xl font-black text-white mb-2 tracking-tight uppercase">
                            Gift Card Redemption
                          </h3>
                          <p className="text-gray-500 text-xs font-medium max-w-[240px] leading-relaxed mb-6">
                            You can redeem your points for gift cards. The gift card will be sent to your email address.
                          </p>
                          <div className="flex flex-col gap-3 w-full max-w-[260px]">
                            
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="shrink-0 bg-[#080c14] border-t border-white/8 px-5 py-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Info className="w-2.5 h-2.5 text-blue-400" />
                        <span className="text-[8px] font-bold uppercase tracking-widest">
                          {selectedProduct.requiresShipping ? "Estimated delivery: 5-7 business days" : "Digital reward will be processed instantly"}
                        </span>
                      </div>
                      <button
                        onClick={submitOrder}
                        disabled={selectedProduct.requiresShipping && !selectedAddressId}
                        className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                          (!selectedProduct.requiresShipping || selectedAddressId)
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30"
                            : "bg-white/5 text-gray-600 cursor-not-allowed"
                        }`}
                      >
                        {selectedProduct.requiresShipping ? (
                          <>
                            <Truck className="w-3.5 h-3.5" />
                            Confirm & Ship
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Confirm Redemption
                          </>
                        )}
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

