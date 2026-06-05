"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store";
import { acceptBid, rejectBid } from "@/store/marketSlice";
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
  const profileMenuRef = useRef<HTMLDivElement>(null);

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
    alert("Profile picture updated!");
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
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        bid.status === "Accepted" 
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

          {/* Active Listings */}
          <div className="bg-white border border-brand-border-light rounded-2xl p-6 shadow-md flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 font-outfit">My Active Listings</h2>
              <p className="text-[11px] text-brand-text-muted">Live listings currently open for bidding across regional APMCs.</p>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 text-[10px] text-brand-text-muted uppercase tracking-wider font-bold">
                    <th className="py-2.5">Crop Name</th>
                    <th className="py-2.5">Acreage</th>
                    <th className="py-2.5">Expected Price</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td className="py-3 font-bold text-gray-800">{listing.cropName}</td>
                      <td className="py-3 text-brand-text-secondary">{listing.acreage} Acres</td>
                      <td className="py-3 text-brand-text-secondary">₹{listing.expectedPrice} / Qt</td>
                      <td className="py-3">
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          listing.status === "Listed" 
                            ? "text-[#1aa35a] bg-emerald-50 border-emerald-100"
                            : listing.status === "Pending Sourcing"
                            ? "text-brand-secondary bg-amber-50 border-amber-100"
                            : "text-gray-600 bg-gray-50 border-gray-200"
                        }`}>
                          {listing.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
    </div>
  );
}
