"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store";
import { procureProduce } from "@/store/marketSlice";
import { updateMerchantBank, updateMerchantAvatar } from "@/store/userSlice";

interface Shipment {
  id: string;
  cropName: string;
  mandiSource: string;
  tonnage: number;
  logisticsStatus: "Dispatching" | "In-Transit" | "Arrived";
}

interface FarmerProfile {
  age: number;
  memberSince: string;
  rating: number;
  completedTrades: number;
  fulfillmentRate: number;
  verifiedLand: boolean;
}

interface ProductSpecs {
  moisture: string;
  admixture: string;
  grainSize: string;
  organic: boolean;
  harvestDate: string;
}

interface FarmerListing {
  id: string;
  farmerName: string;
  cropName: string;
  category: "Grains" | "Oilseeds" | "Pulses" | "Spices" | "Vegetables";
  expectedPrice: number;
  availableQuantity: number;
  mandiSource: string;
  grade: "A+" | "A" | "B";
  imageEmoji: string;
  farmerProfile: FarmerProfile;
  productSpecs: ProductSpecs;
}

const initialShipments: Shipment[] = [
  { id: "S1", cropName: "Super Basmati Paddy", mandiSource: "Karnal APMC", tonnage: 45, logisticsStatus: "In-Transit" },
  { id: "S2", cropName: "Premium Sharbati Wheat", mandiSource: "Indore APMC", tonnage: 120, logisticsStatus: "Dispatching" },
  { id: "S3", cropName: "Dry Guntur Chillies", mandiSource: "Guntur APMC", tonnage: 15, logisticsStatus: "Arrived" },
];

const initialFarmerListings: FarmerListing[] = [
  { 
    id: "F1", 
    farmerName: "Rajesh Kumar", 
    cropName: "Premium Sharbati Wheat", 
    category: "Grains", 
    expectedPrice: 2450, 
    availableQuantity: 250, 
    mandiSource: "Indore APMC", 
    grade: "A+", 
    imageEmoji: "🌾",
    farmerProfile: {
      age: 42,
      memberSince: "March 2021",
      rating: 4.8,
      completedTrades: 85,
      fulfillmentRate: 98,
      verifiedLand: true
    },
    productSpecs: {
      moisture: "11.2%",
      admixture: "< 0.5%",
      grainSize: "Medium Bold",
      organic: false,
      harvestDate: "April 2026"
    }
  },
  { 
    id: "F2", 
    farmerName: "Gurpreet Singh", 
    cropName: "Super Basmati Paddy", 
    category: "Grains", 
    expectedPrice: 4120, 
    availableQuantity: 180, 
    mandiSource: "Karnal APMC", 
    grade: "A+", 
    imageEmoji: "🌾",
    farmerProfile: {
      age: 38,
      memberSince: "August 2020",
      rating: 4.9,
      completedTrades: 142,
      fulfillmentRate: 99,
      verifiedLand: true
    },
    productSpecs: {
      moisture: "12.5%",
      admixture: "< 0.2%",
      grainSize: "7.4 mm Long",
      organic: true,
      harvestDate: "May 2026"
    }
  },
  { 
    id: "F3", 
    farmerName: "Harpal Singh", 
    cropName: "Yellow Mustard Seeds", 
    category: "Oilseeds", 
    expectedPrice: 5850, 
    availableQuantity: 120, 
    mandiSource: "Jaipur APMC", 
    grade: "A", 
    imageEmoji: "🟡",
    farmerProfile: {
      age: 51,
      memberSince: "November 2022",
      rating: 4.7,
      completedTrades: 64,
      fulfillmentRate: 96,
      verifiedLand: true
    },
    productSpecs: {
      moisture: "8.0%",
      admixture: "< 1.0%",
      grainSize: "Standard Small",
      organic: false,
      harvestDate: "March 2026"
    }
  },
  { 
    id: "F4", 
    farmerName: "Venkat Rao", 
    cropName: "Dry Guntur Chillies", 
    category: "Spices", 
    expectedPrice: 8200, 
    availableQuantity: 80, 
    mandiSource: "Guntur APMC", 
    grade: "A+", 
    imageEmoji: "🌶️",
    farmerProfile: {
      age: 45,
      memberSince: "June 2019",
      rating: 4.9,
      completedTrades: 210,
      fulfillmentRate: 100,
      verifiedLand: true
    },
    productSpecs: {
      moisture: "9.5%",
      admixture: "< 0.3%",
      grainSize: "Capsaicin High",
      organic: true,
      harvestDate: "April 2026"
    }
  },
  { 
    id: "F5", 
    farmerName: "Vikram Patel", 
    cropName: "Kabuli Chana (Chickpeas)", 
    category: "Pulses", 
    expectedPrice: 5300, 
    availableQuantity: 150, 
    mandiSource: "Akola APMC", 
    grade: "A", 
    imageEmoji: "🫘",
    farmerProfile: {
      age: 33,
      memberSince: "September 2023",
      rating: 4.6,
      completedTrades: 38,
      fulfillmentRate: 95,
      verifiedLand: true
    },
    productSpecs: {
      moisture: "10.0%",
      admixture: "< 0.8%",
      grainSize: "9 mm Bold",
      organic: false,
      harvestDate: "May 2026"
    }
  },
  { 
    id: "F6", 
    farmerName: "Ramesh Dev", 
    cropName: "Organic Cold-Storage Potatoes", 
    category: "Vegetables", 
    expectedPrice: 1500, 
    availableQuantity: 300, 
    mandiSource: "Agra APMC", 
    grade: "B", 
    imageEmoji: "🥔",
    farmerProfile: {
      age: 49,
      memberSince: "January 2022",
      rating: 4.5,
      completedTrades: 55,
      fulfillmentRate: 94,
      verifiedLand: false
    },
    productSpecs: {
      moisture: "78% (Standard)",
      admixture: "< 1.5%",
      grainSize: "Large Oval Shape",
      organic: true,
      harvestDate: "February 2026"
    }
  }
];

export default function MerchantDashboard() {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const shipments = useAppSelector((state) => state.market.shipments);
  const farmerListings = useAppSelector((state) => state.market.listings);
  const escrowBalance = useAppSelector((state) => state.market.merchantEscrowBalance);
  const bankDetails = useAppSelector((state) => state.user.merchant.bankDetails);
  const profilePic = useAppSelector((state) => state.user.merchant.avatar);
  const isProfileComplete = useAppSelector((state) => state.user.merchant.isVerified);
  const merchantId = useAppSelector((state) => state.user.merchant.id);

  // Store & Sourcing states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedListing, setSelectedListing] = useState<FarmerListing | null>(null);
  const [procureQuantity, setProcureQuantity] = useState<number>(50);

  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Form states
  const [bankNameForm, setBankNameForm] = useState("");
  const [accountNumForm, setAccountNumForm] = useState("");
  const [ifscForm, setIfscForm] = useState("");

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountNumForm.length < 9 || ifscForm.length < 4) {
      alert("Please enter valid account and IFSC details.");
      return;
    }
    dispatch(updateMerchantBank({ bankName: bankNameForm, accountNum: accountNumForm, ifsc: ifscForm }));
    setIsBankModalOpen(false);
    alert("Bank details linked successfully!");
  };

  const handleAvatarSelect = (avatarEmoji: string) => {
    dispatch(updateMerchantAvatar(avatarEmoji));
    setIsPicModalOpen(false);
    alert("Profile picture updated!");
  };

  const profileProgress = 60 + (profilePic ? 20 : 0) + (bankDetails ? 20 : 0);

  // Filters logic
  const filteredListings = farmerListings.filter((listing) => {
    const matchesSearch =
      listing.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.mandiSource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || listing.category === selectedCategory;
    return matchesSearch && matchesCategory && listing.availableQuantity > 0;
  });

  const handleProcureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;

    if (procureQuantity <= 0) {
      alert("Please enter a valid quantity to procure.");
      return;
    }

    if (procureQuantity > selectedListing.availableQuantity) {
      alert(`Only ${selectedListing.availableQuantity} Qt available for this listing.`);
      return;
    }

    const cost = selectedListing.expectedPrice * procureQuantity;
    if (cost > escrowBalance) {
      alert(`Insufficient Escrow Balance! Total cost is ₹${cost.toLocaleString()}, but your balance is ₹${escrowBalance.toLocaleString()}.`);
      return;
    }

    // Deduct cost and update available quantity
    dispatch(procureProduce({ listingId: selectedListing.id, quantity: procureQuantity }));

    const tonnage = procureQuantity / 10; // 1 Ton = 10 Qt
    alert(`Sourcing Contract Locked! ₹${cost.toLocaleString()} secured in escrow for ${tonnage} Tons of ${selectedListing.cropName} from ${selectedListing.farmerName}.`);
    setSelectedListing(null);
  };

  const categories = ["All", "Grains", "Oilseeds", "Pulses", "Spices", "Vegetables"];

  // Compute total dynamic tonnage
  const totalTonnage = shipments.reduce((sum, s) => sum + s.tonnage, 0);

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg-main relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="flex justify-between items-center px-[5%] py-4 sticky top-0 z-50 backdrop-blur-md bg-brand-bg-main/70 border-b border-brand-border-light">
        <div className="flex items-center gap-2 text-xl font-extrabold tracking-tight font-outfit">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary text-sm text-white font-sans p-1">🌾</span>
          <span>Krishi Bazar</span>
        </div>
        <div className="flex items-center gap-4 relative">
          <span className="text-xs font-bold bg-amber-500/15 text-[#d97706] py-1 px-3 rounded-full uppercase tracking-wider">Merchant Pro</span>
          <Button component={Link} href="/" variant="outlined" size="small" sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}>
            Catalog View
          </Button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white border border-brand-border-light flex items-center justify-center text-lg font-bold shadow-md cursor-pointer hover:scale-105 transition-all"
            >
              {profilePic || "🏢"}
            </button>
            
            {isProfileMenuOpen && (
              <>
                {/* Click outside backdrop */}
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-60 bg-white border border-gray-150 rounded-2xl p-4 shadow-xl z-50 flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <span className="text-2xl">{profilePic || "🏢"}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-extrabold text-xs text-gray-800 truncate">Sharma Agro Traders</span>
                      <span className="text-[10px] text-gray-500 font-semibold truncate">{merchantId}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 text-xs text-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Status</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${isProfileComplete ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>
                        {isProfileComplete ? "Verified" : "Unverified"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Bank Linked</span>
                      <span className="font-semibold">{bankDetails ? "Yes" : "No"}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-2.5 flex flex-col gap-1.5">
                    <button 
                      onClick={() => { setIsProfileMenuOpen(false); if (!bankDetails) setIsBankModalOpen(true); }}
                      className="text-left w-full text-xs font-semibold text-[#1aa35a] hover:underline"
                    >
                      {bankDetails ? "Modify Bank Account" : "Link Bank Account"}
                    </button>
                    <button 
                      onClick={() => { setIsProfileMenuOpen(false); setIsPicModalOpen(true); }}
                      className="text-left w-full text-xs font-semibold text-[#1aa35a] hover:underline"
                    >
                      Change Avatar
                    </button>
                    <Link href="/" className="text-left w-full text-xs font-semibold text-red-500 hover:underline">
                      Log Out
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="flex-grow max-w-[1400px] mx-auto w-full px-[5%] py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        
        {/* Left Section: Stats, Shipments, Store Front */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold font-outfit text-gray-800 tracking-tight">Merchant Workspace</h1>
            <p className="text-xs text-brand-text-secondary mt-1">Review locked escrow budgets, trace inbound cargo fleets, and procure direct produce from live farmer listings.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-brand-border-light shadow-md">
              <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-bold">Escrow Balance</span>
              <div className="text-2xl font-extrabold text-[#d97706] mt-1">₹{escrowBalance.toLocaleString()}</div>
              <p className="text-[10px] text-brand-text-secondary font-semibold mt-1">Sourcing credits secured</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-brand-border-light shadow-md">
              <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-bold">In-Transit Tonnage</span>
              <div className="text-2xl font-extrabold text-gray-800 mt-1">{totalTonnage} Tons</div>
              <p className="text-[10px] text-[#1aa35a] font-semibold mt-1">↑ Sourcing goals active</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-brand-border-light shadow-md">
              <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-bold">Verified Sourcing APMCs</span>
              <div className="text-2xl font-extrabold text-[#1aa35a] mt-1">6 Mandis</div>
              <p className="text-[10px] text-brand-text-secondary font-semibold mt-1">Active logistics matches</p>
            </div>
          </div>

          {/* Logistics Tracking */}
          <div className="bg-white border border-brand-border-light rounded-2xl p-6 shadow-md flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 font-outfit">Active Sourcing Shipments</h2>
              <p className="text-[11px] text-brand-text-muted">Real-time tracking of procurement contracts in dispatch phase.</p>
            </div>

            <div className="flex flex-col gap-4 max-h-[280px] overflow-y-auto pr-1">
              {shipments.map((s) => (
                <div key={s.id} className="p-4 rounded-xl border border-gray-150 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-800">{s.cropName}</span>
                    <span className="text-[10px] text-brand-text-secondary font-semibold">Origin: {s.mandiSource} | Volume: {s.tonnage} Tons</span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                      s.logisticsStatus === "Arrived"
                        ? "text-[#1aa35a] bg-emerald-50 border-emerald-200"
                        : s.logisticsStatus === "In-Transit"
                        ? "text-brand-secondary bg-amber-50 border-amber-200"
                        : "text-blue-600 bg-blue-50 border-blue-200"
                    }`}>
                      {s.logisticsStatus === "Arrived" ? "● " : s.logisticsStatus === "In-Transit" ? "🚚 " : "📦 "}
                      {s.logisticsStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Farmer Listings - B2B Produce Store Front */}
          <div className="bg-white border border-brand-border-light rounded-2xl p-6 shadow-md flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800 font-outfit">Farmer Sourcing Hub</h2>
                <p className="text-[11px] text-brand-text-muted">Direct B2B purchase catalog of verified farm listings.</p>
              </div>
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-[240px]">
                <input
                  type="text"
                  placeholder="Search crop, farmer or mandi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs p-2.5 pl-8 rounded-full border border-gray-200 focus:outline-none focus:border-[#1aa35a] font-medium bg-gray-50 text-gray-850"
                />
                <span className="absolute left-3 top-2.5 text-xs text-gray-400">🔍</span>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-4 py-1.5 rounded-full font-bold transition-all border shrink-0 ${
                    selectedCategory === cat
                      ? "bg-[#1aa35a] border-[#1aa35a] text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:border-[#1aa35a]/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Produce Grid */}
            {filteredListings.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-250 rounded-2xl bg-gray-50 flex flex-col items-center gap-2">
                <span className="text-3xl">🌾</span>
                <span className="text-xs font-bold text-gray-500">No active listings match your filters.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map((listing) => (
                  <div key={listing.id} className="group bg-white rounded-2xl border border-gray-150 hover:border-[#1aa35a]/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
                    
                    {/* Grade Badge */}
                    <span className="absolute top-3 right-3 text-[9px] font-extrabold bg-[#1aa35a]/10 text-[#1aa35a] py-0.5 px-2.5 rounded-full border border-[#1aa35a]/20">
                      GRADE {listing.grade}
                    </span>

                    {/* Card Body */}
                    <div className="p-5 flex gap-4">
                      {/* Crop Icon container */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-all">
                        {listing.imageEmoji}
                      </div>

                      <div className="flex flex-col gap-1 w-full min-w-0">
                        <span className="text-sm font-extrabold text-gray-800 truncate leading-tight">
                          {listing.cropName}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-500 font-bold">Seller:</span>
                          <span className="text-[10px] text-gray-700 font-bold truncate flex items-center gap-0.5">
                            {listing.farmerName} 
                            <span className="text-[9px] text-[#1aa35a]">✓</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-gray-500 font-bold">Mandi:</span>
                          <span className="text-[10px] text-gray-600 font-semibold">{listing.mandiSource}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Price & Procure Action */}
                    <div className="px-5 py-3.5 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-brand-text-muted uppercase tracking-wider font-bold">Price per Quintal</span>
                        <span className="text-sm font-extrabold text-gray-800">
                          ₹{listing.expectedPrice} <span className="text-[9px] text-gray-500 font-normal">/ Qt</span>
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-brand-text-muted uppercase tracking-wider font-bold block">Stock Available</span>
                        <span className="text-[10px] font-bold text-gray-700 block">
                          {listing.availableQuantity} Qt
                        </span>
                      </div>
                    </div>
                    
                    <div className="px-5 pb-4 bg-gray-50/80 flex justify-end">
                      <Button
                        onClick={() => {
                          setSelectedListing(listing);
                          setProcureQuantity(Math.min(50, listing.availableQuantity));
                        }}
                        variant="contained"
                        size="small"
                        sx={{
                          width: "100%",
                          textTransform: "none",
                          borderRadius: "10px",
                          fontWeight: 700,
                          backgroundColor: "#1aa35a",
                          color: "#fff",
                          "&:hover": { backgroundColor: "#15803d" },
                          fontSize: "0.75rem",
                          py: 0.8,
                        }}
                      >
                        ⚡ Procure Produce
                      </Button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Section: Buyer Pass & Quick Mandate Form */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Profile Progress Card */}
          <div className="bg-white border border-brand-border-light rounded-2xl p-6 shadow-md flex flex-col gap-4">
            <h2 className="text-sm font-bold text-gray-800 font-outfit">Verification Progress</h2>
            
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-500">Profile Progress</span>
                <span className={isProfileComplete ? "text-green-600" : "text-[#d97706]"}>{profileProgress}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${isProfileComplete ? "bg-green-600" : "bg-[#d97706]"}`}
                  style={{ width: `${profileProgress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 text-xs mt-1 border-t border-gray-100 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium flex items-center gap-1.5">
                  <span className="text-green-600 font-bold">✓</span> Basic Details
                </span>
                <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">Filled</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium flex items-center gap-1.5">
                  <span className={profilePic ? "text-green-600 font-bold" : "text-gray-300"}>{profilePic ? "✓" : "○"}</span> Profile Avatar
                </span>
                {profilePic ? (
                  <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">Uploaded</span>
                ) : (
                  <button 
                    onClick={() => setIsPicModalOpen(true)}
                    className="text-[10px] text-brand-primary hover:underline font-bold bg-emerald-50 hover:bg-emerald-100/50 px-2.5 py-1 rounded border border-emerald-100/50 transition-all cursor-pointer"
                  >
                    Add Avatar
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium flex items-center gap-1.5">
                  <span className={bankDetails ? "text-green-600 font-bold" : "text-gray-300"}>{bankDetails ? "✓" : "○"}</span> Bank Account Details
                </span>
                {bankDetails ? (
                  <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">Linked</span>
                ) : (
                  <button 
                    onClick={() => setIsBankModalOpen(true)}
                    className="text-[10px] text-brand-primary hover:underline font-bold bg-emerald-50 hover:bg-emerald-100/50 px-2.5 py-1 rounded border border-emerald-100/50 transition-all cursor-pointer"
                  >
                    Link Bank
                  </button>
                )}
              </div>
            </div>
            
            {!isProfileComplete && (
              <p className="text-[10px] text-brand-text-muted mt-0.5">
                ⚠ Link your bank account and upload a profile picture to earn the verified badge.
              </p>
            )}
          </div>

          {/* Virtual Buyer Pass Preview */}
          <div className="bg-white border border-brand-border-light rounded-2xl p-6 shadow-md flex flex-col gap-4">
            <h2 className="text-sm font-bold text-gray-800 font-outfit">Virtual Sourcing Pass</h2>
            
            <div className="w-full bg-gradient-to-br from-[#1aa35a] to-[#0f5230] border border-emerald-500/20 rounded-2xl p-5 text-left relative overflow-hidden shadow-md">
              <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                <span className="flex items-center gap-1.5 font-bold font-outfit text-white text-xs">
                  🌾 Buyer Pass
                </span>
                {isProfileComplete ? (
                  <span className="text-[7px] font-bold bg-[#d97706] text-white p-0.5 px-2 rounded shadow-[0_0_8px_rgba(217,119,6,0.4)] uppercase tracking-wider">
                    VERIFIED BUYER
                  </span>
                ) : (
                  <span className="text-[7px] font-bold bg-gray-500/80 text-gray-100 p-0.5 px-2 rounded uppercase tracking-wider">
                    PENDING VERIFY
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col gap-2 text-[10px] text-white flex-grow">
                  <div className="flex flex-col">
                    <span className="text-[7px] text-emerald-200 uppercase font-bold">Representative Name</span>
                    <span className="font-bold">Sharma Agro Traders</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7px] text-emerald-200 uppercase font-bold">Buyer ID</span>
                    <span className="font-mono text-[9px]">{merchantId}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7px] text-emerald-200 uppercase font-bold">Sourcing Region</span>
                    <span>Indore, Madhya Pradesh</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/10 shadow-inner text-3xl">
                  {profilePic || "🏢"}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Mandate Form */}
          <div className="bg-white border border-brand-border-light rounded-2xl p-6 shadow-md flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-bold text-gray-800 font-outfit">Post Buying Mandate</h2>
              <p className="text-[10px] text-brand-text-muted">Broadcast a sourcing request directly to regional farmers.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert("Buying mandate broadcasted successfully!"); }} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Crop Name</label>
                <input required type="text" placeholder="e.g. Sharbati Wheat" className="text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#1aa35a] font-medium" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Target Mandi</label>
                <input required type="text" placeholder="e.g. Indore Mandi" className="text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#1aa35a] font-medium" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tonnage Needed (Tons)</label>
                <input required type="number" placeholder="e.g. 50" className="text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#1aa35a] font-medium" />
              </div>
              <Button type="submit" variant="contained" sx={{ textTransform: "none", borderRadius: "10px", color: "#fff", backgroundColor: "#1aa35a", "&:hover": { backgroundColor: "#15803d" }, fontWeight: 600, py: 1, mt: 1 }}>
                Broadcast Mandate
              </Button>
            </form>
          </div>

        </div>

      </main>

      {/* Sourcing Modal Dialog */}
      {selectedListing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8 w-full max-w-[850px] flex flex-col gap-6 relative animate-in fade-in zoom-in-95 duration-200 text-gray-800 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center text-xs font-bold transition-all border border-gray-200/50 cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-bold bg-[#1aa35a]/10 text-[#1aa35a] py-1 px-3 rounded-full border border-[#1aa35a]/20 uppercase tracking-wider">
                Procure Deal Specification
              </span>
              <h3 className="text-2xl font-extrabold font-outfit mt-2.5 text-gray-900 leading-tight">
                {selectedListing.cropName}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Direct trade sourcing contract with regional seller.
              </p>
            </div>

            {/* Split Grid for Detailed Specs & Checkout Sourcing */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-gray-100 pt-6">
              
              {/* Left Side: Farmer Profile & Product specs (Span 7) */}
              <div className="md:col-span-7 flex flex-col gap-6">
                
                {/* Farmer Profile */}
                <div className="border border-gray-150 rounded-2xl p-5 bg-emerald-50/20 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-gray-750 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200/50 pb-2">
                    👨🏽‍🌾 Farmer Profile
                  </h4>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-250 border border-emerald-200 flex items-center justify-center text-3xl shadow-sm shrink-0">
                      👨🏽‍🌾
                    </div>
                    <div className="flex flex-col gap-1 w-full min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-800 text-base leading-tight">
                          {selectedListing.farmerName}
                        </span>
                        {selectedListing.farmerProfile.verifiedLand && (
                          <span className="text-[9px] font-bold bg-[#1aa35a] text-white py-0.5 px-2.5 rounded-full flex items-center gap-0.5 shrink-0">
                            ✓ Land Verified
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-600 mt-0.5">
                        <span><strong>Age:</strong> {selectedListing.farmerProfile.age} Yrs</span>
                        <span>●</span>
                        <span><strong>Member since:</strong> {selectedListing.farmerProfile.memberSince}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reputation / Fulfillment Specs */}
                  <div className="grid grid-cols-3 gap-3 text-center border-t border-gray-200/50 pt-3.5 mt-1">
                    <div className="flex flex-col bg-white border border-gray-100 rounded-xl p-2.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Rating</span>
                      <span className="text-xs font-extrabold text-amber-500 mt-0.5">
                        ⭐ {selectedListing.farmerProfile.rating}
                      </span>
                    </div>
                    <div className="flex flex-col bg-white border border-gray-100 rounded-xl p-2.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Trades</span>
                      <span className="text-xs font-extrabold text-gray-800 mt-0.5">
                        {selectedListing.farmerProfile.completedTrades} Completed
                      </span>
                    </div>
                    <div className="flex flex-col bg-white border border-gray-100 rounded-xl p-2.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Fulfillment</span>
                      <span className="text-xs font-extrabold text-green-600 mt-0.5">
                        {selectedListing.farmerProfile.fulfillmentRate}% On-Time
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Specifications */}
                <div className="border border-gray-150 rounded-2xl p-5 flex flex-col gap-3 bg-white">
                  <h4 className="text-xs font-bold text-gray-750 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200/50 pb-2 mb-1">
                    🌾 Quality Specifications
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500 font-medium">Quality Grade</span>
                      <span className="font-bold text-[#1aa35a] bg-emerald-50 px-2 rounded-full border border-emerald-100">
                        Grade {selectedListing.grade}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500 font-medium">Harvest Date</span>
                      <span className="font-bold text-gray-800">{selectedListing.productSpecs.harvestDate}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500 font-medium">Moisture Content</span>
                      <span className="font-bold text-gray-800">{selectedListing.productSpecs.moisture}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500 font-medium">Organic Certified</span>
                      <span className={`font-bold ${selectedListing.productSpecs.organic ? "text-emerald-600" : "text-gray-550"}`}>
                        {selectedListing.productSpecs.organic ? "Yes (Certified)" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2 col-span-2">
                      <span className="text-gray-500 font-medium">Foreign Matter (Admixture)</span>
                      <span className="font-bold text-gray-800">{selectedListing.productSpecs.admixture}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2 col-span-2">
                      <span className="text-gray-500 font-medium">Grain / Product Attribute</span>
                      <span className="font-bold text-gray-800">{selectedListing.productSpecs.grainSize}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Side: Sourcing Checkout Form (Span 5) */}
              <div className="md:col-span-5 border border-gray-150 rounded-2xl p-5 bg-gray-50 flex flex-col gap-5">
                <h4 className="text-xs font-bold text-gray-750 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200/50 pb-2">
                  ⚡ Sourcing Procurement
                </h4>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-semibold">Price per Quintal</span>
                    <span className="font-extrabold text-gray-800 text-sm">₹{selectedListing.expectedPrice} / Qt</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-semibold">Available Stock</span>
                    <span className="font-extrabold text-gray-800">{selectedListing.availableQuantity} Qt</span>
                  </div>
                </div>

                <form onSubmit={handleProcureSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-gray-600">Enter Purchase Volume (Quintals)</label>
                    </div>
                    <div className="flex gap-2">
                      <input
                        required
                        type="number"
                        min={1}
                        max={selectedListing.availableQuantity}
                        value={procureQuantity}
                        onChange={(e) => setProcureQuantity(Number(e.target.value))}
                        className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1aa35a] font-bold bg-white text-gray-850"
                      />
                      <button
                        type="button"
                        onClick={() => setProcureQuantity(selectedListing.availableQuantity)}
                        className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all shrink-0 cursor-pointer"
                      >
                        Max
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold text-right block mt-0.5">
                      10 Quintals = 1 Metric Ton
                    </span>
                  </div>

                  {/* Dynamic Cost summary */}
                  <div className="border-t border-dashed border-gray-200 pt-4 flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-bold text-gray-600">
                      <span>Volume Tonnage</span>
                      <span className="text-gray-800">{(procureQuantity / 10).toFixed(1)} Tons</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-600">
                      <span>Escrow Budget Required</span>
                      <span className="text-gray-800">₹{(selectedListing.expectedPrice * procureQuantity).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm font-extrabold text-gray-800 border-t border-gray-150 pt-2.5 mt-1">
                      <span>Total Sourcing Cost</span>
                      <span className="text-[#d97706] text-base">
                        ₹{(selectedListing.expectedPrice * procureQuantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 mt-2">
                    <Button
                      type="submit"
                      disabled={selectedListing.expectedPrice * procureQuantity > escrowBalance}
                      variant="contained"
                      sx={{
                        width: "100%",
                        textTransform: "none",
                        borderRadius: "12px",
                        fontWeight: 700,
                        backgroundColor: "#1aa35a",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#15803d" },
                        py: 1,
                      }}
                    >
                      Confirm Escrow & Buy
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setSelectedListing(null)}
                      variant="outlined"
                      sx={{
                        width: "100%",
                        textTransform: "none",
                        borderRadius: "12px",
                        fontWeight: 700,
                        borderColor: "gray",
                        color: "gray",
                        "&:hover": { borderColor: "black", color: "black" },
                        py: 0.8,
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  {selectedListing.expectedPrice * procureQuantity > escrowBalance && (
                    <span className="text-[10px] font-bold text-red-500 text-center block mt-1">
                      ⚠ Insufficient Escrow Balance to complete procurement!
                    </span>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bank Details Link Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8 w-full max-w-[420px] flex flex-col gap-5 relative text-gray-800 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsBankModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold transition-all border border-gray-200/50 cursor-pointer"
            >
              ✕
            </button>
            <div>
              <h3 className="text-lg font-extrabold font-outfit text-gray-900">Link Bank Account</h3>
              <p className="text-[11px] text-gray-500 mt-1">Needed for processing direct-to-merchant escrow transactions.</p>
            </div>
            
            <form onSubmit={handleBankSubmit} className="flex flex-col gap-4 text-xs font-semibold text-gray-600">
              <div className="flex flex-col gap-1.5">
                <label>Bank Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. HDFC Bank"
                  value={bankNameForm}
                  onChange={(e) => setBankNameForm(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1aa35a] font-bold bg-gray-50 text-gray-850"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label>Account Number</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••••••"
                  value={accountNumForm}
                  onChange={(e) => setAccountNumForm(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1aa35a] font-bold bg-gray-50 text-gray-850"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label>IFSC Code</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. HDFC0001925"
                  value={ifscForm}
                  onChange={(e) => setIfscForm(e.target.value.toUpperCase())}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1aa35a] font-bold bg-gray-50 text-gray-850"
                />
              </div>
              
              <div className="flex gap-3 mt-2">
                <Button
                  onClick={() => setIsBankModalOpen(false)}
                  variant="outlined"
                  sx={{ flex: 1, textTransform: "none", borderRadius: "10px", fontWeight: 700 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ flex: 1, textTransform: "none", borderRadius: "10px", fontWeight: 700, backgroundColor: "#1aa35a", "&:hover": { backgroundColor: "#15803d" }, color: "#fff" }}
                >
                  Save Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Avatar Selector Modal */}
      {isPicModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8 w-full max-w-[420px] flex flex-col gap-5 relative text-gray-800 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsPicModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold transition-all border border-gray-200/50 cursor-pointer"
            >
              ✕
            </button>
            <div>
              <h3 className="text-lg font-extrabold font-outfit text-gray-900">Select Profile Avatar</h3>
              <p className="text-[11px] text-gray-500 mt-1">Select an identity avatar representing your workspace profile.</p>
            </div>
            
            <div className="grid grid-cols-4 gap-4 py-4 justify-items-center">
              {["🏢", "💼", "🚛", "🤵🏽", "👩🏽‍💼", "👨🏽‍💼", "🏬", "💵"].map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => handleAvatarSelect(avatar)}
                  className="w-16 h-16 rounded-2xl bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-[#1aa35a] flex items-center justify-center text-3xl shadow-sm transition-all hover:scale-110 cursor-pointer"
                >
                  {avatar}
                </button>
              ))}
            </div>

            <Button
              onClick={() => setIsPicModalOpen(false)}
              variant="outlined"
              sx={{ textTransform: "none", borderRadius: "10px", fontWeight: 700 }}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
