"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store";

import { acceptBid, rejectBid, addFarmerListing } from "@/store/marketSlice";
import { updateFarmerBank, updateFarmerAvatar } from "@/store/userSlice";

interface Listing {
  id: string;
  cropName: string;
  acreage: number;
  expectedPrice: number;
  status: "Listed" | "Pending Sourcing" | "Sold";
}

interface Bid {
  id: string;
  buyerName: string;
  cropName: string;
  priceOffered: number;
  quantity: number;
  status: "Pending" | "Accepted" | "Rejected";
}

export default function FarmerDashboard() {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const rawListings = useAppSelector((state) => state.market.listings);
  const bids = useAppSelector((state) => state.market.bids);
  const bankDetails = useAppSelector((state) => state.user.farmer.bankDetails);
  const profilePic = useAppSelector((state) => state.user.farmer.avatar);
  const isProfileComplete = useAppSelector((state) => state.user.farmer.isVerified);
  const totalSales = useAppSelector((state) => state.market.farmerTotalSales);
  const pendingPayouts = useAppSelector((state) => state.market.farmerPendingPayouts);

  // Map global listings to farmer listings
  const listings: Listing[] = rawListings
    .filter((l) => l.farmerName === "Rajesh Kumar")
    .map((l) => ({
      id: l.id,
      cropName: l.cropName,
      acreage: l.availableQuantity > 0 ? Math.ceil(l.availableQuantity / 50) : 3,
      expectedPrice: l.expectedPrice,
      status: l.availableQuantity > 0 ? "Listed" : "Sold",
    }));

  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // New listing form state
  const [newCropName, setNewCropName] = useState("");
  const [newCategory, setNewCategory] = useState<
    | "Grains & Cereals"
    | "Oilseeds"
    | "Pulses & Legumes"
    | "Spices & Condiments"
    | "Vegetables"
    | "Fruits"
    | "Cash Crops"
    | "Dairy & Livestock"
    | "Herbs & Medicinal"
    | "Nuts & Dry Fruits"
    | "Flowers & Floriculture"
    | "Fiber Crops"
  >("Grains & Cereals");
  const [newPrice, setNewPrice] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newMandi, setNewMandi] = useState("");
  const [listingFormErrors, setListingFormErrors] = useState<{ cropName?: string; price?: string; quantity?: string; mandi?: string }>({});

  useEffect(() => {
    if (!isProfileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen]);

  // Form states
  const [bankNameForm, setBankNameForm] = useState("");
  const [accountNumForm, setAccountNumForm] = useState("");
  const [ifscForm, setIfscForm] = useState("");
  const [bankFormErrors, setBankFormErrors] = useState<{ bankName?: string; accountNum?: string; ifsc?: string }>({});

  const handleAcceptBid = (bidId: string) => {
    dispatch(acceptBid(bidId));
    alert("Bid Accepted successfully! Payout escrow is now locked.");
  };

  const handleRejectBid = (bidId: string) => {
    dispatch(rejectBid(bidId));
    alert("Bid rejected successfully.");
  };

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { bankName?: string; accountNum?: string; ifsc?: string } = {};
    if (!bankNameForm.trim()) errs.bankName = "Bank name is required.";
    if (!/^\d{9,18}$/.test(accountNumForm.trim())) errs.accountNum = "Enter a valid account number (9–18 digits).";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscForm.trim().toUpperCase())) errs.ifsc = "Enter a valid IFSC code (e.g. SBIN0001234).";
    if (Object.keys(errs).length > 0) {
      setBankFormErrors(errs);
      return;
    }
    setBankFormErrors({});
    dispatch(updateFarmerBank({ bankName: bankNameForm.trim(), accountNum: accountNumForm.trim(), ifsc: ifscForm.trim().toUpperCase() }));
    setIsBankModalOpen(false);
    setBankNameForm(""); setAccountNumForm(""); setIfscForm("");
  };

  const handleAvatarSelect = (avatarEmoji: string) => {
    dispatch(updateFarmerAvatar(avatarEmoji));
    setIsPicModalOpen(false);
  };

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { cropName?: string; price?: string; quantity?: string; mandi?: string } = {};
    if (!newCropName.trim()) errs.cropName = "Crop name is required.";
    if (!newPrice || isNaN(Number(newPrice)) || Number(newPrice) <= 0) errs.price = "Enter a valid price per quintal.";
    if (!newQuantity || isNaN(Number(newQuantity)) || Number(newQuantity) <= 0) errs.quantity = "Enter a valid quantity.";
    if (!newMandi.trim()) errs.mandi = "Mandi/market location is required.";
    if (Object.keys(errs).length > 0) { setListingFormErrors(errs); return; }
    setListingFormErrors({});
    dispatch(addFarmerListing({
      id: "F" + Date.now(),
      cropName: newCropName.trim(),
      category: newCategory,
      expectedPrice: Number(newPrice),
      availableQuantity: Number(newQuantity),
      mandiSource: newMandi.trim(),
    }));
    setNewCropName(""); setNewCategory("Grains & Cereals"); setNewPrice(""); setNewQuantity(""); setNewMandi("");
    setIsListingModalOpen(false);
  };

  const profileProgress = 60 + (profilePic ? 20 : 0) + (bankDetails ? 20 : 0);

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
          <span className="text-xs font-bold bg-amber-500/10 text-amber-700 py-1 px-3 rounded-full flex items-center gap-1 font-semibold">
            ⭐ 4.8 Rating
          </span>
          <span className="text-xs font-bold bg-[#1aa35a]/15 text-[#1aa35a] py-1 px-3 rounded-full uppercase tracking-wider">Farmer Pro</span>
          <Button component={Link} href="/" variant="outlined" size="small" sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}>
            Catalog View
          </Button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border border-brand-border-light flex items-center justify-center text-lg font-bold shadow-md cursor-pointer hover:scale-105 transition-all"
            >
              {profilePic || "👨🏽‍🌾"}
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2.5 w-60 bg-white border border-gray-150 rounded-2xl p-4 shadow-xl z-50 flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <span className="text-2xl">{profilePic || "👨🏽‍🌾"}</span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-xs text-gray-800 truncate">Rajesh Kumar</span>
                    <span className="text-[10px] text-gray-500 font-semibold truncate">KB-2026-4892-1925</span>
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
            )}
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="flex-grow max-w-[1400px] mx-auto w-full px-[5%] py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">

        {/* Left Section: Stats, Listings, Bids */}
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold font-outfit text-gray-800 tracking-tight">Farmer Workspace</h1>
            <p className="text-xs text-brand-text-secondary mt-1">Manage your active crop portfolios, track incoming spot bids, and inspect escrow payouts.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-brand-border-light shadow-md">
              <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-bold">Total Sales</span>
              <div className="text-2xl font-extrabold text-[#1aa35a] mt-1">₹{totalSales.toLocaleString()}</div>
              <p className="text-[10px] text-green-500 font-semibold mt-1">↑ 12.4% from last week</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-brand-border-light shadow-md">
              <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-bold">Active Listings</span>
              <div className="text-2xl font-extrabold text-gray-800 mt-1">{listings.filter(l => l.status !== "Sold").length} Crops</div>
              <p className="text-[10px] text-brand-text-secondary font-semibold mt-1">Sourcing active in 3 Mandis</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-brand-border-light shadow-md">
              <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-bold">Pending Payouts</span>
              <div className="text-2xl font-extrabold text-brand-secondary mt-1">₹{pendingPayouts.toLocaleString()}</div>
              <p className="text-[10px] text-brand-text-secondary font-semibold mt-1">Locked in escrow security</p>
            </div>
          </div>

          {/* Incoming Bids */}
          <div className="bg-white border border-brand-border-light rounded-2xl p-6 shadow-md flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 font-outfit">Incoming Buyer Bids</h2>
              <p className="text-[11px] text-brand-text-muted">Direct offers from verified corporate purchasing agents.</p>
            </div>

            <div className="flex flex-col gap-4">
              {bids.map((bid) => (
                <div key={bid.id} className="p-4 rounded-xl border border-gray-150 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-[#1aa35a]">{bid.cropName}</span>
                    <span className="text-[10px] text-brand-text-secondary font-semibold">Buyer: {bid.buyerName}</span>
                    <span className="text-[10px] text-brand-text-muted">Quantity: {bid.quantity} Qt | Price: ₹{bid.priceOffered}/Qt</span>
                  </div>

                  <div className="flex gap-2 self-end sm:self-center">
                    {bid.status === "Pending" ? (
                      <>
                        <Button
                          onClick={() => handleRejectBid(bid.id)}
                          variant="outlined"
                          size="small"
                          color="error"
                          sx={{ textTransform: "none", fontSize: "0.75rem", borderRadius: "8px", fontWeight: 600 }}
                        >
                          Decline
                        </Button>
                        <Button
                          onClick={() => handleAcceptBid(bid.id)}
                          variant="contained"
                          size="small"
                          sx={{ textTransform: "none", fontSize: "0.75rem", borderRadius: "8px", color: "#fff", backgroundColor: "#1aa35a", "&:hover": { backgroundColor: "#15803d" }, fontWeight: 600 }}
                        >
                          Accept Bid
                        </Button>
                      </>
                    ) : (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${bid.status === "Accepted"
                          ? "text-green-600 bg-green-50 border-green-200"
                          : "text-red-600 bg-red-50 border-red-200"
                        }`}>
                        {bid.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Product Listings */}
          <div className="bg-white border border-brand-border-light rounded-2xl p-6 shadow-md flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800 font-outfit">My Product Listings</h2>
                <p className="text-[11px] text-brand-text-muted mt-0.5">Your produce listed on the Krishi Bazar sourcing marketplace.</p>
              </div>
              <button
                onClick={() => setIsListingModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#1aa35a] hover:bg-[#15803d] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <span className="text-base leading-none">+</span> List New Crop
              </button>
            </div>

            {listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <span className="text-4xl">🌾</span>
                <p className="text-sm font-bold text-gray-600">No listings yet</p>
                <p className="text-[11px] text-gray-400">Click &quot;List New Crop&quot; to add your first produce to the marketplace.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listings.map((listing) => {
                  const categoryColors: Record<string, string> = {
                    "Grains & Cereals": "bg-amber-50 text-amber-700 border-amber-200",
                    "Oilseeds": "bg-yellow-50 text-yellow-700 border-yellow-200",
                    "Pulses & Legumes": "bg-orange-50 text-orange-700 border-orange-200",
                    "Spices & Condiments": "bg-red-50 text-red-700 border-red-200",
                    "Vegetables": "bg-green-50 text-green-700 border-green-200",
                    "Fruits": "bg-pink-50 text-pink-700 border-pink-200",
                    "Cash Crops": "bg-slate-50 text-slate-700 border-slate-200",
                    "Dairy & Livestock": "bg-sky-50 text-sky-700 border-sky-200",
                    "Herbs & Medicinal": "bg-teal-50 text-teal-700 border-teal-200",
                    "Nuts & Dry Fruits": "bg-brown-50 text-stone-700 border-stone-200",
                    "Flowers & Floriculture": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
                    "Fiber Crops": "bg-indigo-50 text-indigo-700 border-indigo-200",
                  };
                  const rawListing = rawListings.find((r) => r.id === listing.id);
                  const category = rawListing?.category || "Grains";
                  const availableQty = rawListing?.availableQuantity ?? 0;
                  return (
                    <div key={listing.id} className="relative border border-gray-150 rounded-2xl p-4 bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-all duration-200 flex flex-col gap-3">
                      {/* Status badge */}
                      <span className={`absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${listing.status === "Listed" ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                          : listing.status === "Pending Sourcing" ? "text-amber-600 bg-amber-50 border-amber-200"
                            : "text-gray-500 bg-gray-100 border-gray-200"
                        }`}>{listing.status}</span>

                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-2xl">
                          {rawListing?.imageEmoji || "🌾"}
                        </div>
                        <div className="flex flex-col min-w-0 pr-16">
                          <span className="font-extrabold text-sm text-gray-800 truncate">{listing.cropName}</span>
                          <span className={`text-[9px] font-bold mt-0.5 px-1.5 py-0.5 rounded border w-fit ${categoryColors[category]}`}>{category}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Price</span>
                          <span className="text-sm font-extrabold text-[#1aa35a]">₹{listing.expectedPrice.toLocaleString()}</span>
                          <span className="text-[9px] text-gray-400">per Qt</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Stock</span>
                          <span className="text-sm font-extrabold text-gray-800">{availableQty}</span>
                          <span className="text-[9px] text-gray-400">Quintals</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Mandi</span>
                          <span className="text-xs font-bold text-gray-700 truncate">{rawListing?.mandiSource || "—"}</span>
                        </div>
                      </div>

                      {rawListing?.productSpecs && (
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-[9px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded font-semibold">Grade {rawListing.grade}</span>
                          {rawListing.productSpecs.organic && (
                            <span className="text-[9px] bg-green-50 text-green-600 border border-green-100 px-1.5 py-0.5 rounded font-semibold">🌿 Organic</span>
                          )}
                          <span className="text-[9px] bg-gray-50 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded font-semibold">Harvest: {rawListing.productSpecs.harvestDate}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Section: Krishi Card & Mandi Spot Prices */}
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

          {/* Virtual Krishi Card Preview */}
          <div className="bg-white border border-brand-border-light rounded-2xl p-6 shadow-md flex flex-col gap-4">
            <h2 className="text-sm font-bold text-gray-800 font-outfit">Virtual Digital Pass</h2>

            <div className="w-full bg-gradient-to-br from-[#1aa35a] to-[#0f5230] border border-emerald-500/20 rounded-2xl p-5 text-left relative overflow-hidden shadow-md">
              <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                <span className="flex items-center gap-1.5 font-bold font-outfit text-white text-xs">
                  🌾 Krishi Card
                </span>
                {isProfileComplete ? (
                  <span className="text-[7px] font-bold bg-[#d97706] text-white p-0.5 px-2 rounded shadow-[0_0_8px_rgba(217,119,6,0.4)] uppercase tracking-wider">
                    VERIFIED FARMER
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
                    <span className="text-[7px] text-emerald-200 uppercase font-bold">Farmer Name</span>
                    <span className="font-bold">Rajesh Kumar</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7px] text-emerald-200 uppercase font-bold">Farmer ID</span>
                    <span className="font-mono text-[9px]">KB-2026-4892-1925</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7px] text-emerald-200 uppercase font-bold">Sourcing Region</span>
                    <span>Indore, Madhya Pradesh</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7px] text-emerald-200 uppercase font-bold">Buyer Rating</span>
                    <span className="font-bold flex items-center gap-1">
                      ⭐ 4.8 <span className="text-[8px] text-emerald-250 font-normal">(85 Trades)</span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/10 shadow-inner text-3xl">
                  {profilePic || "👨🏽‍🌾"}
                </div>
              </div>
            </div>
          </div>

          {/* Mandi Spot Pricing */}
          <div className="bg-white border border-brand-border-light rounded-2xl p-6 shadow-md flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-bold text-gray-800 font-outfit">Mandi Spot Rates</h2>
              <p className="text-[10px] text-brand-text-muted">Real-time agricultural market indices.</p>
            </div>

            <div className="flex flex-col gap-3.5 divide-y divide-gray-100">
              <div className="pt-2 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-800 block">Premium Basmati</span>
                  <span className="text-[10px] text-brand-text-muted">Karnal Mandi</span>
                </div>
                <span className="font-bold text-green-600 font-mono">₹4,120 (+1.8%)</span>
              </div>
              <div className="pt-2 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-800 block">Yellow Mustard</span>
                  <span className="text-[10px] text-brand-text-muted">Jaipur Mandi</span>
                </div>
                <span className="font-bold text-red-500 font-mono">₹5,850 (-0.6%)</span>
              </div>
              <div className="pt-2 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-800 block">Sharbati Wheat</span>
                  <span className="text-[10px] text-brand-text-muted">Indore Mandi</span>
                </div>
                <span className="font-bold text-green-600 font-mono">₹2,450 (+2.5%)</span>
              </div>
            </div>
          </div>

        </div>

      </main>

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
              <p className="text-[11px] text-gray-500 mt-1">Needed for processing direct-to-farmer payouts via escrow security.</p>
            </div>

            <form onSubmit={handleBankSubmit} className="flex flex-col gap-4 text-xs font-semibold text-gray-600">
              <div className="flex flex-col gap-1">
                <label>Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. State Bank of India"
                  value={bankNameForm}
                  onChange={(e) => { setBankNameForm(e.target.value); setBankFormErrors((p) => ({ ...p, bankName: "" })); }}
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none font-bold bg-gray-50 text-gray-850 ${bankFormErrors.bankName ? "border-red-400" : "border-gray-200 focus:border-[#1aa35a]"}`}
                />
                {bankFormErrors.bankName && <p className="text-red-500 text-[10px] font-semibold mt-0.5">{bankFormErrors.bankName}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label>Account Number</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={accountNumForm}
                  onChange={(e) => { setAccountNumForm(e.target.value); setBankFormErrors((p) => ({ ...p, accountNum: "" })); }}
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none font-bold bg-gray-50 text-gray-850 ${bankFormErrors.accountNum ? "border-red-400" : "border-gray-200 focus:border-[#1aa35a]"}`}
                />
                {bankFormErrors.accountNum && <p className="text-red-500 text-[10px] font-semibold mt-0.5">{bankFormErrors.accountNum}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label>IFSC Code</label>
                <input
                  type="text"
                  placeholder="e.g. SBIN0001925"
                  value={ifscForm}
                  onChange={(e) => { setIfscForm(e.target.value.toUpperCase()); setBankFormErrors((p) => ({ ...p, ifsc: "" })); }}
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none font-bold bg-gray-50 text-gray-850 ${bankFormErrors.ifsc ? "border-red-400" : "border-gray-200 focus:border-[#1aa35a]"}`}
                />
                {bankFormErrors.ifsc && <p className="text-red-500 text-[10px] font-semibold mt-0.5">{bankFormErrors.ifsc}</p>}
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
              {["👨🏽‍🌾", "👩🏽‍🌾", "🧑🏽‍🌾", "👵🏽", "🌾", "🚜", "☀️", "🏡"].map((avatar) => (
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
      {/* List New Product Modal */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8 w-full max-w-[520px] flex flex-col gap-5 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => { setIsListingModalOpen(false); setListingFormErrors({}); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold transition-all border border-gray-200/50 cursor-pointer"
            >
              ✕
            </button>

            <div>
              <h3 className="text-xl font-extrabold font-outfit text-gray-900">List New Crop</h3>
              <p className="text-[11px] text-gray-500 mt-1">Your listing will appear live on the Krishi Bazar B2B sourcing marketplace instantly.</p>
            </div>

            <form onSubmit={handleAddListing} className="flex flex-col gap-4">

              {/* Crop Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Crop Name</label>
                <input
                  type="text"
                  placeholder="e.g. Premium Sharbati Wheat"
                  value={newCropName}
                  onChange={(e) => { setNewCropName(e.target.value); setListingFormErrors((p) => ({ ...p, cropName: "" })); }}
                  className={`w-full text-sm p-3 rounded-xl border focus:outline-none font-semibold bg-gray-50 ${listingFormErrors.cropName ? "border-red-400" : "border-gray-200 focus:border-[#1aa35a]"}`}
                />
                {listingFormErrors.cropName && <p className="text-red-500 text-[10px] font-semibold">{listingFormErrors.cropName}</p>}
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    "Grains & Cereals",
                    "Oilseeds",
                    "Pulses & Legumes",
                    "Spices & Condiments",
                    "Vegetables",
                    "Fruits",
                    "Cash Crops",
                    "Dairy & Livestock",
                    "Herbs & Medicinal",
                    "Nuts & Dry Fruits",
                    "Flowers & Floriculture",
                    "Fiber Crops",
                  ] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className={`text-[10px] font-bold py-2 px-1 rounded-xl border transition-all cursor-pointer ${newCategory === cat ? "bg-[#1aa35a] text-white border-[#1aa35a] shadow-sm" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#1aa35a]"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Quantity row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Price (₹/Qt)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2450"
                    value={newPrice}
                    min={1}
                    onChange={(e) => { setNewPrice(e.target.value); setListingFormErrors((p) => ({ ...p, price: "" })); }}
                    className={`w-full text-sm p-3 rounded-xl border focus:outline-none font-semibold bg-gray-50 ${listingFormErrors.price ? "border-red-400" : "border-gray-200 focus:border-[#1aa35a]"}`}
                  />
                  {listingFormErrors.price && <p className="text-red-500 text-[10px] font-semibold">{listingFormErrors.price}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Quantity (Qt)</label>
                  <input
                    type="number"
                    placeholder="e.g. 200"
                    value={newQuantity}
                    min={1}
                    onChange={(e) => { setNewQuantity(e.target.value); setListingFormErrors((p) => ({ ...p, quantity: "" })); }}
                    className={`w-full text-sm p-3 rounded-xl border focus:outline-none font-semibold bg-gray-50 ${listingFormErrors.quantity ? "border-red-400" : "border-gray-200 focus:border-[#1aa35a]"}`}
                  />
                  {listingFormErrors.quantity && <p className="text-red-500 text-[10px] font-semibold">{listingFormErrors.quantity}</p>}
                </div>
              </div>

              {/* Mandi Location */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Mandi / Market Location</label>
                <input
                  type="text"
                  placeholder="e.g. Indore APMC"
                  value={newMandi}
                  onChange={(e) => { setNewMandi(e.target.value); setListingFormErrors((p) => ({ ...p, mandi: "" })); }}
                  className={`w-full text-sm p-3 rounded-xl border focus:outline-none font-semibold bg-gray-50 ${listingFormErrors.mandi ? "border-red-400" : "border-gray-200 focus:border-[#1aa35a]"}`}
                />
                {listingFormErrors.mandi && <p className="text-red-500 text-[10px] font-semibold">{listingFormErrors.mandi}</p>}
              </div>

              {/* Summary preview */}
              {newCropName && newPrice && newQuantity && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Estimated Listing Value</span>
                    <span className="text-xl font-extrabold text-emerald-700 mt-0.5">
                      ₹{(Number(newPrice) * Number(newQuantity)).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right text-[10px] text-emerald-600 font-semibold">
                    <div>{newQuantity} Quintals</div>
                    <div>@ ₹{Number(newPrice).toLocaleString()}/Qt</div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  onClick={() => { setIsListingModalOpen(false); setListingFormErrors({}); }}
                  variant="outlined"
                  sx={{ flex: 1, textTransform: "none", borderRadius: "12px", fontWeight: 700 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ flex: 1, textTransform: "none", borderRadius: "12px", fontWeight: 700, backgroundColor: "#1aa35a", "&:hover": { backgroundColor: "#15803d" }, color: "#fff" }}
                >
                  🌾 Publish Listing
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
