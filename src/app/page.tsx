"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  InputAdornment
} from "@mui/material";
import {
  SearchIcon,
  PlaceIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  StorefrontIcon,
  AssessmentIcon,
  LocalAtmIcon
} from "@/icons";

interface Crop {
  id: string;
  name: string;
  category: "Cereals" | "Oilseeds" | "Vegetables" | "Spices";
  price: number;
  unit: string;
  change: number;
  mandi: string;
  trend: "up" | "down";
}

const mockCrops: Crop[] = [
  { id: "1", name: "Premium Sharbati Wheat", category: "Cereals", price: 2450, unit: "Quintal", change: 2.5, mandi: "Indore Mandi", trend: "up" },
  { id: "2", name: "Super Basmati Paddy", category: "Cereals", price: 4120, unit: "Quintal", change: 1.8, mandi: "Karnal Mandi", trend: "up" },
  { id: "3", name: "Yellow Mustard Seeds", category: "Oilseeds", price: 5850, unit: "Quintal", change: -0.6, mandi: "Jaipur Mandi", trend: "down" },
  { id: "4", name: "Organic Cold-Storage Potatoes", category: "Vegetables", price: 1500, unit: "Quintal", change: 4.2, mandi: "Agra Mandi", trend: "up" },
  { id: "5", name: "Desi Chana (Chickpeas)", category: "Cereals", price: 5100, unit: "Quintal", change: -1.2, mandi: "Nagpur Mandi", trend: "down" },
  { id: "6", name: "Nashik Red Onions", category: "Vegetables", price: 2200, unit: "Quintal", change: 3.1, mandi: "Lasalgaon Mandi", trend: "up" },
  { id: "7", name: "Dry Guntur Chillies", category: "Spices", price: 18500, unit: "Quintal", change: 5.4, mandi: "Guntur Mandi", trend: "up" },
  { id: "8", name: "Black Pepper", category: "Spices", price: 48000, unit: "Quintal", change: -0.8, mandi: "Kochi Mandi", trend: "down" },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  // Trade Modal State
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [tradeQuantity, setTradeQuantity] = useState<number>(10);
  const [tradeSuccess, setTradeSuccess] = useState<boolean>(false);

  // Filter crops based on search query and category tab
  const filteredCrops = useMemo(() => {
    return mockCrops.filter((crop) => {
      const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            crop.mandi.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || crop.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleOpenTrade = (crop: Crop) => {
    setSelectedCrop(crop);
    setTradeQuantity(10);
    setTradeSuccess(false);
  };

  const handleCloseTrade = () => {
    setSelectedCrop(null);
    setTradeSuccess(false);
  };

  const handleConfirmTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setTradeSuccess(true);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-[5%] py-5 sticky top-0 z-50 backdrop-blur-md bg-brand-bg-main/70 border-b border-brand-border-light">
        <div className="flex items-center gap-2 text-2xl font-extrabold tracking-tight font-outfit">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary text-sm text-white font-sans p-1">🌾</span>
          <span>Krishi Bazar</span>
        </div>
        <ul className="hidden md:flex gap-8 list-none">
          <li>
            <a href="#market" className="text-sm font-medium text-brand-text-secondary hover:text-brand-primary transition-all duration-300">
              Live Market
            </a>
          </li>
          <li>
            <a href="#features" className="text-sm font-medium text-brand-text-secondary hover:text-brand-primary transition-all duration-300">
              Core Ecosystem
            </a>
          </li>
          <li>
            <a href="#cta" className="text-sm font-medium text-brand-text-secondary hover:text-brand-primary transition-all duration-300">
              Get Started
            </a>
          </li>
        </ul>
        <div className="flex items-center gap-4">
          <Button component={Link} href="/register/merchant" variant="outlined" color="primary" sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}>
            Merchant Portal
          </Button>
          <Button component={Link} href="/register/farmer" variant="contained" color="primary" sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600, color: "#fff" }}>
            Farmer Sign-up
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-16 px-[5%] py-24 items-center max-w-[1400px] mx-auto w-full">
        <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary-glow border border-brand-border-glow text-brand-primary text-xs font-semibold self-center lg:self-start">
            <span>🚀</span> Next-Gen Agri-Trading Hub
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-none font-outfit gradient-text">
            Empowering Farmers. Connecting Markets.
          </h1>
          <p className="text-lg text-brand-text-secondary max-w-[580px] mx-auto lg:mx-0 leading-relaxed">
            Experience direct-to-buyer crop trading, transparent digital mandis, real-time pricing intelligence, and instant escrowed payouts. Zero middlemen, maximum yield value.
          </p>
          <div className="flex gap-4 mt-4 justify-center lg:justify-start">
            <Button component={Link} href="#market" variant="contained" color="primary" size="large" sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600, color: "#fff", px: 4, py: 1.5 }}>
              Explore Mandi Prices
            </Button>
            <Button onClick={() => alert("Registration portals will be online soon!")} variant="outlined" color="primary" size="large" sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600, px: 4, py: 1.5 }}>
              Learn How It Works
            </Button>
          </div>
        </div>

        {/* Dashboard Visual Mockup */}
        <div className="lg:col-span-5 relative w-full aspect-[1.1/1] flex justify-center items-center">
          <div className="w-[90%] h-[90%] p-6 relative z-10 flex flex-col gap-4 rounded-2xl overflow-hidden shadow-2xl bg-brand-bg-card/85 border border-brand-border-light">
            <div className="flex justify-between items-center border-b border-brand-border-light pb-3">
              <div className="text-sm font-bold text-brand-text-primary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="ml-1.5">Bazar Live Feed</span>
              </div>
              <span className="text-xs text-brand-primary font-semibold flex items-center gap-1.5 animate-pulse">● Live Updating</span>
            </div>

            <div className="grid grid-rows-[auto_1fr] gap-4 h-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-bg-main/60 p-3.5 rounded-xl border border-brand-border-light">
                  <div className="text-[10px] text-brand-text-muted uppercase tracking-wider font-semibold">Total Trade Volume</div>
                  <div className="text-xl font-extrabold text-brand-secondary mt-1">₹42.8M</div>
                </div>
                <div className="bg-brand-bg-main/60 p-3.5 rounded-xl border border-brand-border-light">
                  <div className="text-[10px] text-brand-text-muted uppercase tracking-wider font-semibold">Verified Buyers</div>
                  <div className="text-xl font-extrabold text-brand-primary mt-1">1,248</div>
                </div>
              </div>

              <div className="bg-brand-bg-main/30 border border-dashed border-brand-border-light rounded-xl flex flex-col justify-end p-4 relative">
                <div className="absolute top-4 right-4 bg-brand-bg-card p-1.5 px-2.5 rounded-md text-xs border border-brand-border-glow shadow-md">
                  Wheat: <span className="text-brand-primary font-bold">+2.5%</span>
                </div>
                <div className="flex items-end justify-between h-[80px] gap-2.5 w-full">
                  <div className="flex-1 bg-gradient-to-t from-brand-primary-glow to-brand-primary rounded-t min-h-[20px]" style={{ height: "45%" }}></div>
                  <div className="flex-1 bg-gradient-to-t from-brand-primary-glow to-brand-primary rounded-t min-h-[20px]" style={{ height: "65%" }}></div>
                  <div className="flex-1 bg-gradient-to-t from-brand-primary-glow to-brand-primary rounded-t min-h-[20px]" style={{ height: "30%" }}></div>
                  <div className="flex-1 bg-gradient-to-t from-brand-primary-glow to-brand-primary rounded-t min-h-[20px]" style={{ height: "85%" }}></div>
                  <div className="flex-1 bg-gradient-to-t from-brand-secondary-glow to-brand-secondary rounded-t min-h-[20px]" style={{ height: "95%" }}></div>
                  <div className="flex-1 bg-gradient-to-t from-brand-primary-glow to-brand-primary rounded-t min-h-[20px]" style={{ height: "55%" }}></div>
                  <div className="flex-1 bg-gradient-to-t from-brand-primary-glow to-brand-primary rounded-t min-h-[20px]" style={{ height: "70%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Indicators */}
          <div className="absolute bottom-[5%] -left-[5%] p-3.5 px-4 rounded-xl z-20 text-xs flex items-center gap-3 bg-brand-bg-card/95 border border-brand-border-glow shadow-lg animate-[float_6s_ease-in-out_infinite]">
            <span className="text-green-500 text-lg">📈</span>
            <div>
              <div className="font-bold">Agra Mandi</div>
              <div className="text-brand-text-secondary text-[10px]">Potato: ₹1,500 (+4.2%)</div>
            </div>
          </div>

          <div className="absolute top-[10%] -right-[5%] p-3.5 px-4 rounded-xl z-20 text-xs flex items-center gap-3 bg-brand-bg-card/95 border border-brand-secondary-glow shadow-lg animate-[float_6s_ease-in-out_infinite] [animation-delay:3s]">
            <span className="text-yellow-500 text-lg">🌾</span>
            <div>
              <div className="font-bold">New Buyer Match</div>
              <div className="text-brand-text-secondary text-[10px]">Wheat Buy Order: 250 Qt</div>
            </div>
          </div>
        </div>
      </header>

      {/* Market Catalog Section */}
      <section id="market" className="py-24 px-[5%] max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-extrabold tracking-tight font-outfit">Digital Mandi Catalog</h2>
            <p className="text-brand-text-secondary">Browse current crop pricing across major regional hubs</p>
          </div>
        </div>

        {/* Filters and Search controls */}
        <div className="flex flex-wrap gap-4 items-center w-full mb-8">
          <div className="flex-1 min-w-[250px]">
            <TextField
              fullWidth
              size="small"
              placeholder="Search crops or mandi locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="text-brand-text-muted" />
                    </InputAdornment>
                  ),
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "var(--color-brand-bg-surface)",
                  "& fieldset": { borderColor: "var(--color-brand-border-light)" },
                  "&:hover fieldset": { borderColor: "var(--color-brand-text-muted)" },
                  "&.Mui-focused fieldset": { borderColor: "var(--color-brand-primary)" },
                }
              }}
            />
          </div>

          <div className="flex gap-2">
            {["All", "Cereals", "Oilseeds", "Vegetables", "Spices"].map((category) => (
              <button
                key={category}
                className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all duration-300 cursor-pointer ${
                  activeCategory === category
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-transparent text-brand-text-secondary border-brand-border-light hover:border-brand-text-muted"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Crops Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCrops.length > 0 ? (
            filteredCrops.map((crop) => (
              <div key={crop.id} className="bg-brand-bg-card border border-brand-border-light rounded-2xl p-6 hover:-translate-y-1 hover:border-brand-border-glow transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      crop.category === "Oilseeds" || crop.category === "Spices" 
                        ? "text-brand-secondary bg-brand-secondary-glow border-brand-secondary-glow" 
                        : "text-brand-primary bg-brand-primary-glow border-brand-border-glow"
                    }`}>
                      {crop.category}
                    </span>
                    <span className="text-xs text-brand-text-muted flex items-center gap-1">
                      <PlaceIcon sx={{ fontSize: 14 }} /> {crop.mandi}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-4">{crop.name}</h3>

                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <div className="text-[10px] text-brand-text-muted">Current Price</div>
                      <div className="text-2xl font-extrabold text-brand-text-primary">
                        ₹{crop.price.toLocaleString()}
                        <span className="text-xs font-semibold text-brand-text-secondary"> / {crop.unit}</span>
                      </div>
                    </div>

                    <span className={`text-xs font-bold flex items-center gap-1 p-1 px-2 rounded-md ${
                      crop.trend === "up" ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
                    }`}>
                      {crop.trend === "up" ? <TrendingUpIcon sx={{ fontSize: 14 }} /> : <TrendingDownIcon sx={{ fontSize: 14 }} />}
                      {Math.abs(crop.change)}%
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    fullWidth
                    onClick={() => handleOpenTrade(crop)}
                    variant="outlined"
                    color="primary"
                    sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px" }}
                  >
                    Trade Crop
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-brand-text-muted">
              No crops matching your search criteria. Try a different query.
            </div>
          )}
        </div>
      </section>

      {/* Features Ecosystem Section */}
      <section id="features" className="bg-gradient-to-b from-brand-bg-main to-brand-bg-card/50 py-24 px-[5%] border-t border-b border-brand-border-light">
        <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-16">
          <div className="text-center max-w-[700px] mx-auto flex flex-col gap-2">
            <h2 className="text-4xl font-extrabold tracking-tight font-outfit">The Krishi Bazar Ecosystem</h2>
            <p className="text-brand-text-secondary">Combining advanced technology with direct agricultural commerce to optimize revenue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-2xl bg-brand-bg-surface border border-brand-border-light hover:-translate-y-1 hover:border-brand-border-glow transition-all duration-300 flex flex-col gap-5">
              <div className="w-12 h-12 rounded-xl bg-brand-primary-glow border border-brand-border-glow text-brand-primary flex items-center justify-center text-xl">
                <StorefrontIcon />
              </div>
              <h3 className="text-xl font-bold">Direct Trade</h3>
              <p className="text-brand-text-secondary text-sm leading-relaxed">
                Connect directly with verified wholesale buyers. By eliminating commissions and multiple middle-agents, farmers retain up to 25% higher profit margins.
              </p>
            </div>

            <div className="p-10 rounded-2xl bg-brand-bg-surface border border-brand-border-light hover:-translate-y-1 hover:border-brand-border-glow transition-all duration-300 flex flex-col gap-5">
              <div className="w-12 h-12 rounded-xl bg-brand-primary-glow border border-brand-border-glow text-brand-primary flex items-center justify-center text-xl">
                <AssessmentIcon />
              </div>
              <h3 className="text-xl font-bold">Smart Analytics</h3>
              <p className="text-brand-text-secondary text-sm leading-relaxed">
                Access comprehensive historic mandi reports, real-time demand signals, and AI-driven crop price trends to decide exactly when and where to sell.
              </p>
            </div>

            <div className="p-10 rounded-2xl bg-brand-bg-surface border border-brand-border-light hover:-translate-y-1 hover:border-brand-border-glow transition-all duration-300 flex flex-col gap-5">
              <div className="w-12 h-12 rounded-xl bg-brand-primary-glow border border-brand-border-glow text-brand-primary flex items-center justify-center text-xl">
                <LocalAtmIcon />
              </div>
              <h3 className="text-xl font-bold">Escrow Safeguards</h3>
              <p className="text-brand-text-secondary text-sm leading-relaxed">
                Secure digital transactions with modern escrow. Funds are locked at commitment and instantly wired directly to farmer bank accounts upon load dispatch confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="py-32 px-[5%] max-w-[1400px] mx-auto w-full flex justify-center">
        <div className="w-full max-w-[1100px] p-20 text-center relative overflow-hidden rounded-3xl flex flex-col items-center gap-6 bg-gradient-to-br from-brand-bg-card to-brand-primary/10 border border-brand-border-glow shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none font-outfit max-w-[700px]">
            Ready to Experience Modern Agri-Commerce?
          </h2>
          <p className="text-brand-text-secondary text-md max-w-[580px] mb-4">
            Register today to receive real-time price warnings, list crops for live auction, and secure buyer contracts.
          </p>
          <div className="flex gap-4">
            <Button component={Link} href="/register/farmer" variant="contained" color="primary" size="large" sx={{ padding: "0.8rem 2rem", fontSize: "1rem", color: "#fff", fontWeight: 600 }}>
              Register as Farmer
            </Button>
            <Button component={Link} href="/register/merchant" variant="outlined" color="primary" size="large" sx={{ padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: 600 }}>
              Apply as Buyer
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-[5%] border-t border-brand-border-light bg-brand-bg-main/90">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-2xl font-extrabold tracking-tight font-outfit">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary text-sm text-white font-sans p-1">🌾</span>
              <span>Krishi Bazar</span>
            </div>
            <p className="text-brand-text-secondary text-sm leading-relaxed max-w-[280px]">
              Building transparency, equity, and reliability in agricultural commerce across India.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Solutions</h4>
            <ul className="list-none flex flex-col gap-3">
              <li><a href="#" className="text-sm text-brand-text-muted hover:text-brand-primary transition-all">Farmer App</a></li>
              <li><a href="#" className="text-sm text-brand-text-muted hover:text-brand-primary transition-all">Merchant Portal</a></li>
              <li><a href="#" className="text-sm text-brand-text-muted hover:text-brand-primary transition-all">Mandi Spot Trading</a></li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Company</h4>
            <ul className="list-none flex flex-col gap-3">
              <li><a href="#" className="text-sm text-brand-text-muted hover:text-brand-primary transition-all">About Us</a></li>
              <li><a href="#" className="text-sm text-brand-text-muted hover:text-brand-primary transition-all">Press Release</a></li>
              <li><a href="#" className="text-sm text-brand-text-muted hover:text-brand-primary transition-all">Contact Support</a></li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Regulatory</h4>
            <ul className="list-none flex flex-col gap-3">
              <li><a href="#" className="text-sm text-brand-text-muted hover:text-brand-primary transition-all">APMC Guidelines</a></li>
              <li><a href="#" className="text-sm text-brand-text-muted hover:text-brand-primary transition-all">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-brand-text-muted hover:text-brand-primary transition-all">Terms of Trading</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto border-t border-brand-border-light pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-brand-text-muted gap-4">
          <div>&copy; 2026 Krishi Bazar Technologies Private Limited. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-primary transition-all">Terms</a>
            <a href="#" className="hover:text-brand-primary transition-all">Privacy</a>
            <a href="#" className="hover:text-brand-primary transition-all">Cookies</a>
          </div>
        </div>
      </footer>

      {/* Trade Simulation Dialog */}
      {selectedCrop && (
        <Dialog 
          open={!!selectedCrop} 
          onClose={handleCloseTrade}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: "var(--color-brand-bg-card)",
                backgroundImage: "none",
                borderRadius: "20px",
                border: "1px solid var(--color-brand-border-glow)",
                width: "100%",
                maxWidth: "500px",
                padding: "8px",
              }
            }
          }}
        >
          {!tradeSuccess ? (
            <form onSubmit={handleConfirmTrade}>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold font-outfit text-brand-primary">
                <span>🤝</span> Initiate Digital Trade
              </DialogTitle>
              
              <DialogContent className="flex flex-col gap-4 py-4">
                <div>
                  <strong className="text-lg text-brand-text-primary">{selectedCrop.name}</strong>
                  <div className="text-xs text-brand-text-secondary mt-1 flex items-center gap-1">
                    <PlaceIcon sx={{ fontSize: 14 }} /> Mandi Source: {selectedCrop.mandi}
                  </div>
                </div>

                <div className="flex justify-between items-center bg-brand-bg-main/50 p-3 rounded-lg border border-brand-border-light">
                  <span className="text-sm text-brand-text-secondary">Spot price:</span>
                  <strong className="text-md text-brand-text-primary">
                    ₹{selectedCrop.price.toLocaleString()} / {selectedCrop.unit}
                  </strong>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="dialog-quantity" className="text-sm font-semibold text-brand-text-secondary">
                    Quantity ({selectedCrop.unit}s):
                  </label>
                  <TextField
                    id="dialog-quantity"
                    type="number"
                    size="small"
                    slotProps={{ htmlInput: { min: 1, max: 1000 } }}
                    value={tradeQuantity}
                    onChange={(e) => setTradeQuantity(Number(e.target.value))}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "var(--color-brand-bg-main)",
                        "& fieldset": { borderColor: "var(--color-brand-border-light)" },
                        "&:hover fieldset": { borderColor: "var(--color-brand-text-muted)" },
                        "&.Mui-focused fieldset": { borderColor: "var(--color-brand-primary)" },
                      }
                    }}
                  />
                </div>

                <div className="flex justify-between items-center border-t border-brand-border-light pt-4 mt-2">
                  <span className="font-semibold text-brand-text-primary">Estimated Total:</span>
                  <strong className="text-xl text-brand-secondary">
                    ₹{(selectedCrop.price * tradeQuantity).toLocaleString()}
                  </strong>
                </div>
              </DialogContent>

              <DialogActions className="p-4 pt-2">
                <Button onClick={handleCloseTrade} color="inherit" sx={{ textTransform: "none", fontWeight: 600 }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary" sx={{ textTransform: "none", fontWeight: 600, color: "#fff" }}>
                  Confirm Escrow Trade
                </Button>
              </DialogActions>
            </form>
          ) : (
            <div className="text-center p-6 flex flex-col items-center gap-4">
              <div className="text-5xl">🎉</div>
              <DialogTitle className="text-xl font-bold font-outfit text-brand-primary p-0">
                Trade Initiated Successfully!
              </DialogTitle>
              <DialogContent className="p-0 text-sm text-brand-text-secondary leading-relaxed">
                Your buy request for <strong>{tradeQuantity} {selectedCrop.unit}s</strong> of <strong>{selectedCrop.name}</strong> has been secured in escrow. A contract draft has been sent to the farmer at <strong>{selectedCrop.mandi}</strong>.
              </DialogContent>
              <DialogActions className="w-full justify-center p-0 pt-4">
                <Button onClick={handleCloseTrade} variant="contained" color="primary" sx={{ textTransform: "none", fontWeight: 600, color: "#fff", px: 4 }}>
                  Return to Catalog
                </Button>
              </DialogActions>
            </div>
          )}
        </Dialog>
      )}
    </div>
  );
}
