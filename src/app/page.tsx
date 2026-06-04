"use client";

import React, { useState, useMemo } from "react";
import styles from "./page.module.css";

interface Crop {
  id: string;
  name: string;
  category: "Cereals" | "Oilseeds" | "Vegetables" | "Spices";
  price: number; // raw number for calculations
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
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🌾</span>
          <span>Krishi Bazar</span>
        </div>
        <ul className={styles.navLinks}>
          <li><a href="#market" className={styles.navLink}>Live Market</a></li>
          <li><a href="#features" className={styles.navLink}>Core Ecosystem</a></li>
          <li><a href="#cta" className={styles.navLink}>Get Started</a></li>
        </ul>
        <div className={styles.navActions}>
          <button className={styles.btnSecondary}>Merchant Portal</button>
          <button className={styles.btnPrimary}>Farmer Sign-in</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span>🚀</span> Next-Gen Agri-Trading Hub
          </div>
          <h1 className={`${styles.heroTitle} gradient-text`}>
            Empowering Farmers. Connecting Markets.
          </h1>
          <p className={styles.heroDescription}>
            Experience direct-to-buyer crop trading, transparent digital mandis, real-time pricing intelligence, and instant escrowed payouts. Zero middlemen, maximum yield value.
          </p>
          <div className={styles.heroActions}>
            <a href="#market" className={styles.btnPrimary} style={{ display: "inline-flex", alignItems: "center" }}>
              Explore Mandi Prices
            </a>
            <button className={styles.btnSecondary} onClick={() => alert("Registration portals will be online soon!")}>
              Learn How It Works
            </button>
          </div>
        </div>

        {/* Dashboard Visual Mockup */}
        <div className={styles.heroVisual}>
          <div className={styles.dashboardFrame}>
            <div className={styles.dashboardHeader}>
              <div className={styles.dashboardTitle}>
                <span className={styles.dotRed}></span>
                <span className={styles.dotYellow}></span>
                <span className={styles.dotGreen}></span>
                <span style={{ marginLeft: "6px" }}>Bazar Live Feed</span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600 }}>● Live Updating</span>
            </div>

            <div className={styles.dashboardContent}>
              <div className={styles.statRow}>
                <div className={styles.miniCard}>
                  <div className={styles.miniCardLabel}>Total Trade Volume</div>
                  <div className={styles.miniCardVal} style={{ color: "var(--secondary)" }}>₹42.8M</div>
                </div>
                <div className={styles.miniCard}>
                  <div className={styles.miniCardLabel}>Verified Buyers</div>
                  <div className={styles.miniCardVal} style={{ color: "var(--primary)" }}>1,248</div>
                </div>
              </div>

              <div className={styles.chartContainer}>
                <div className={styles.chartTooltip}>Wheat: +2.5%</div>
                <div className={styles.chartLines}>
                  <div className={styles.chartBar} style={{ height: "45%" }}></div>
                  <div className={styles.chartBar} style={{ height: "65%" }}></div>
                  <div className={styles.chartBar} style={{ height: "30%" }}></div>
                  <div className={styles.chartBar} style={{ height: "85%" }}></div>
                  <div className={`${styles.chartBar} ${styles.chartBarActive}`} style={{ height: "95%" }}></div>
                  <div className={styles.chartBar} style={{ height: "55%" }}></div>
                  <div className={styles.chartBar} style={{ height: "70%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Indicators */}
          <div className={styles.floatingCard1}>
            <span style={{ color: "#22c55e", fontSize: "1.25rem" }}>📈</span>
            <div>
              <div style={{ fontWeight: 700 }}>Agra Mandi</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.7rem" }}>Potato: ₹1,500 (+4.2%)</div>
            </div>
          </div>

          <div className={styles.floatingCard2}>
            <span style={{ color: "#eab308", fontSize: "1.25rem" }}>🌾</span>
            <div>
              <div style={{ fontWeight: 700 }}>New Buyer Match</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.7rem" }}>Wheat Buy Order: 250 Qt</div>
            </div>
          </div>
        </div>
      </header>

      {/* Market Catalog Section */}
      <section id="market" className={styles.marketSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleBlock}>
            <h2 className={styles.sectionTitle}>Digital Mandi Catalog</h2>
            <p className={styles.sectionSubtitle}>Browse current crop pricing across major regional hubs</p>
          </div>
        </div>

        {/* Filters and Search controls */}
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search crops or mandi locations..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterTabs}>
            {["All", "Cereals", "Oilseeds", "Vegetables", "Spices"].map((category) => (
              <button
                key={category}
                className={`${styles.filterTab} ${activeCategory === category ? styles.filterTabActive : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Crops Cards Grid */}
        <div className={styles.cropGrid}>
          {filteredCrops.length > 0 ? (
            filteredCrops.map((crop) => (
              <div key={crop.id} className={styles.cropCard}>
                <div className={styles.cropHeader}>
                  <span className={`${styles.cropCategory} ${crop.category === "Oilseeds" || crop.category === "Spices" ? styles.cropCategorySecondary : ""}`}>
                    {crop.category}
                  </span>
                  <span className={styles.cropMandi}>📍 {crop.mandi}</span>
                </div>

                <h3 className={styles.cropName}>{crop.name}</h3>

                <div className={styles.cropPriceBlock}>
                  <div>
                    <div className={styles.cropPriceLabel}>Current Price</div>
                    <div className={styles.cropPrice}>
                      ₹{crop.price.toLocaleString()}
                      <span className={styles.cropPriceUnit}> / {crop.unit}</span>
                    </div>
                  </div>

                  <span className={`${styles.cropChange} ${crop.trend === "up" ? styles.changeUp : styles.changeDown}`}>
                    {crop.trend === "up" ? "▲" : "▼"} {Math.abs(crop.change)}%
                  </span>
                </div>

                <div className={styles.cardActions}>
                  <button className={styles.btnTrade} onClick={() => handleOpenTrade(crop)}>
                    Trade Crop
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
              No crops matching your search criteria. Try a different query.
            </div>
          )}
        </div>
      </section>

      {/* Features Ecosystem Section */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <h2 className={styles.sectionTitle}>The Krishi Bazar Ecosystem</h2>
            <p className={styles.sectionSubtitle}>Combining advanced technology with direct agricultural commerce to optimize revenue</p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} glass`}>
              <div className={styles.featureIcon}>🤝</div>
              <h3 className={styles.featureTitle}>Direct Trade</h3>
              <p className={styles.featureDescription}>
                Connect directly with verified wholesale buyers. By eliminating commissions and multiple middle-agents, farmers retain up to 25% higher profit margins.
              </p>
            </div>

            <div className={`${styles.featureCard} glass`}>
              <div className={styles.featureIcon}>📊</div>
              <h3 className={styles.featureTitle}>Smart Analytics</h3>
              <p className={styles.featureDescription}>
                Access comprehensive historic mandi reports, real-time demand signals, and AI-driven crop price trends to decide exactly when and where to sell.
              </p>
            </div>

            <div className={`${styles.featureCard} glass`}>
              <div className={styles.featureIcon}>🛡️</div>
              <h3 className={styles.featureTitle}>Escrow Safeguards</h3>
              <p className={styles.featureDescription}>
                Secure digital transactions with modern escrow. Funds are locked at commitment and instantly wired directly to farmer bank accounts upon load dispatch confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="cta" className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>Ready to Experience Modern Agri-Commerce?</h2>
          <p className={styles.ctaDescription}>
            Register today to receive real-time price warnings, list crops for live auction, and secure buyer contracts.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.btnPrimary} style={{ padding: "0.8rem 2rem", fontSize: "1rem" }} onClick={() => alert("Farmer portal launches next month!")}>
              Register as Farmer
            </button>
            <button className={styles.btnSecondary} style={{ padding: "0.8rem 2rem", fontSize: "1rem" }} onClick={() => alert("Merchant registration launches next month!")}>
              Apply as Buyer
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>🌾</span>
              <span>Krishi Bazar</span>
            </div>
            <p className={styles.footerDesc}>
              Building transparency, equity, and reliability in agricultural commerce across India.
            </p>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerColTitle}>Solutions</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#" className={styles.footerLink}>Farmer App</a></li>
              <li><a href="#" className={styles.footerLink}>Merchant Portal</a></li>
              <li><a href="#" className={styles.footerLink}>Mandi Spot Trading</a></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerColTitle}>Company</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#" className={styles.footerLink}>About Us</a></li>
              <li><a href="#" className={styles.footerLink}>Press Release</a></li>
              <li><a href="#" className={styles.footerLink}>Contact Support</a></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerColTitle}>Regulatory</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#" className={styles.footerLink}>APMC Guidelines</a></li>
              <li><a href="#" className={styles.footerLink}>Privacy Policy</a></li>
              <li><a href="#" className={styles.footerLink}>Terms of Trading</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div>&copy; 2026 Krishi Bazar Technologies Private Limited. All rights reserved.</div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="#" className={styles.footerLink}>Terms</a>
            <a href="#" className={styles.footerLink}>Privacy</a>
            <a href="#" className={styles.footerLink}>Cookies</a>
          </div>
        </div>
      </footer>

      {/* Trade Simulation Modal */}
      {selectedCrop && (
        <div className={styles.modalOverlay} onClick={handleCloseTrade}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {!tradeSuccess ? (
              <form onSubmit={handleConfirmTrade}>
                <h3 className={styles.modalTitle}>
                  <span>🤝</span> Initiate Digital Trade
                </h3>
                
                <div style={{ margin: "1.5rem 0", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <strong style={{ fontSize: "1.1rem" }}>{selectedCrop.name}</strong>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                      Mandi Source: 📍 {selectedCrop.mandi}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", background: "hsla(140, 10%, 8%, 0.5)", padding: "0.75rem", borderRadius: "8px" }}>
                    <span>Spot price:</span>
                    <strong>₹{selectedCrop.price.toLocaleString()} / {selectedCrop.unit}</strong>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label htmlFor="quantity" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                      Quantity ({selectedCrop.unit}s):
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      max="1000"
                      value={tradeQuantity}
                      onChange={(e) => setTradeQuantity(Number(e.target.value))}
                      style={{
                        padding: "0.6rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border-light)",
                        background: "var(--bg-main)",
                        color: "var(--text-primary)",
                        fontSize: "1rem",
                        width: "100%",
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-light)", paddingTop: "1rem", marginTop: "0.5rem" }}>
                    <span style={{ fontSize: "1rem", fontWeight: 600 }}>Estimated Total:</span>
                    <strong style={{ fontSize: "1.25rem", color: "var(--secondary)" }}>
                      ₹{(selectedCrop.price * tradeQuantity).toLocaleString()}
                    </strong>
                  </div>
                </div>

                <div className={styles.modalActions} style={{ gap: "0.75rem" }}>
                  <button type="button" className={styles.btnSecondary} onClick={handleCloseTrade}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnPrimary}>
                    Confirm Escrow Trade
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
                <h3 className={styles.modalTitle} style={{ justifyContent: "center", marginBottom: "1rem" }}>
                  Trade Initiated Successfully!
                </h3>
                <div className={styles.modalContent}>
                  Your buy request for <strong>{tradeQuantity} {selectedCrop.unit}s</strong> of <strong>{selectedCrop.name}</strong> has been secured in escrow. A contract draft has been sent to the farmer at <strong>{selectedCrop.mandi}</strong>.
                </div>
                <div className={styles.modalActions} style={{ justifyContent: "center" }}>
                  <button type="button" className={styles.btnPrimary} onClick={handleCloseTrade}>
                    Return to Catalog
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
