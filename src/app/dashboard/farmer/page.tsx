"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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

const initialListings: Listing[] = [
  { id: "L1", cropName: "Premium Sharbati Wheat", acreage: 5, expectedPrice: 2450, status: "Listed" },
  { id: "L2", cropName: "Super Basmati Paddy", acreage: 8, expectedPrice: 4120, status: "Pending Sourcing" },
  { id: "L3", cropName: "Organic Cold-Storage Potatoes", acreage: 3, expectedPrice: 1500, status: "Sold" },
];

const initialBids: Bid[] = [
  { id: "B1", buyerName: "Sharma Traders Pvt Ltd", cropName: "Premium Sharbati Wheat", priceOffered: 2430, quantity: 150, status: "Pending" },
  { id: "B2", buyerName: "Basundhara Millers Ltd", cropName: "Super Basmati Paddy", priceOffered: 4150, quantity: 200, status: "Pending" },
];

export default function FarmerDashboard() {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [bids, setBids] = useState<Bid[]>(initialBids);

  const handleAcceptBid = (bidId: string) => {
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: "Accepted" } : b))
    );
    alert("Bid Accepted successfully! Payout escrow is now locked.");
  };

  const handleRejectBid = (bidId: string) => {
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: "Rejected" } : b))
    );
    alert("Bid rejected successfully.");
  };

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
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold bg-[#1aa35a]/15 text-[#1aa35a] py-1 px-3 rounded-full uppercase tracking-wider">Farmer Pro</span>
          <Button component={Link} href="/" variant="outlined" size="small" sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}>
            Catalog View
          </Button>
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
              <div className="text-2xl font-extrabold text-[#1aa35a] mt-1">₹48,250</div>
              <p className="text-[10px] text-green-500 font-semibold mt-1">↑ 12.4% from last week</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-brand-border-light shadow-md">
              <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-bold">Active Listings</span>
              <div className="text-2xl font-extrabold text-gray-800 mt-1">{listings.filter(l => l.status !== "Sold").length} Crops</div>
              <p className="text-[10px] text-brand-text-secondary font-semibold mt-1">Sourcing active in 3 Mandis</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-brand-border-light shadow-md">
              <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-bold">Pending Payouts</span>
              <div className="text-2xl font-extrabold text-brand-secondary mt-1">₹18,500</div>
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
          
          {/* Virtual Krishi Card Preview */}
          <div className="bg-white border border-brand-border-light rounded-2xl p-6 shadow-md flex flex-col gap-4">
            <h2 className="text-sm font-bold text-gray-800 font-outfit">Virtual Digital Pass</h2>
            
            <div className="w-full bg-gradient-to-br from-[#1aa35a] to-[#0f5230] border border-emerald-500/20 rounded-2xl p-5 text-left relative overflow-hidden shadow-md">
              <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                <span className="flex items-center gap-1.5 font-bold font-outfit text-white text-xs">
                  🌾 Krishi Card
                </span>
                <span className="text-[7px] font-bold bg-[#d97706] text-white p-0.5 px-2 rounded shadow-[0_0_8px_rgba(217,119,6,0.4)]">
                  VERIFIED FARMER
                </span>
              </div>
              
              <div className="flex flex-col gap-2 text-[10px] text-white">
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
    </div>
  );
}
