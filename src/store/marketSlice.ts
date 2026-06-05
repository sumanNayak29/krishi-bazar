import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Shipment {
  id: string;
  cropName: string;
  mandiSource: string;
  tonnage: number;
  logisticsStatus: "Dispatching" | "In-Transit" | "Arrived";
}

export interface FarmerProfile {
  age: number;
  memberSince: string;
  rating: number;
  completedTrades: number;
  fulfillmentRate: number;
  verifiedLand: boolean;
}

export interface ProductSpecs {
  moisture: string;
  admixture: string;
  grainSize: string;
  organic: boolean;
  harvestDate: string;
}

export interface FarmerListing {
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

export interface Bid {
  id: string;
  buyerName: string;
  cropName: string;
  priceOffered: number;
  quantity: number;
  status: "Pending" | "Accepted" | "Rejected";
}

export interface Mandate {
  id: string;
  cropName: string;
  mandi: string;
  tonnage: number;
}

interface MarketState {
  listings: FarmerListing[];
  bids: Bid[];
  shipments: Shipment[];
  mandates: Mandate[];
  merchantEscrowBalance: number;
  farmerTotalSales: number;
  farmerPendingPayouts: number;
}

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

const initialShipments: Shipment[] = [
  { id: "S1", cropName: "Super Basmati Paddy", mandiSource: "Karnal APMC", tonnage: 45, logisticsStatus: "In-Transit" },
  { id: "S2", cropName: "Premium Sharbati Wheat", mandiSource: "Indore APMC", tonnage: 120, logisticsStatus: "Dispatching" },
  { id: "S3", cropName: "Dry Guntur Chillies", mandiSource: "Guntur APMC", tonnage: 15, logisticsStatus: "Arrived" },
];

const initialBids: Bid[] = [
  { id: "B1", buyerName: "Sharma Traders Pvt Ltd", cropName: "Premium Sharbati Wheat", priceOffered: 2430, quantity: 150, status: "Pending" },
  { id: "B2", buyerName: "Basundhara Millers Ltd", cropName: "Super Basmati Paddy", priceOffered: 4150, quantity: 200, status: "Pending" },
];

const initialState: MarketState = {
  listings: initialFarmerListings,
  bids: initialBids,
  shipments: initialShipments,
  mandates: [],
  merchantEscrowBalance: 250000,
  farmerTotalSales: 48250,
  farmerPendingPayouts: 18500,
};

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    acceptBid(state, action: PayloadAction<string>) {
      const bid = state.bids.find((b) => b.id === action.payload);
      if (bid) {
        bid.status = "Accepted";
        // Lock payouts
        const totalCost = bid.priceOffered * bid.quantity;
        state.farmerPendingPayouts += totalCost;
        // Optionally update listing stock if matching
        const listing = state.listings.find((l) => l.cropName === bid.cropName);
        if (listing) {
          listing.availableQuantity = Math.max(0, listing.availableQuantity - bid.quantity);
        }
      }
    },
    rejectBid(state, action: PayloadAction<string>) {
      const bid = state.bids.find((b) => b.id === action.payload);
      if (bid) {
        bid.status = "Rejected";
      }
    },
    procureProduce(state, action: PayloadAction<{ listingId: string; quantity: number }>) {
      const { listingId, quantity } = action.payload;
      const listing = state.listings.find((l) => l.id === listingId);
      if (listing) {
        const cost = listing.expectedPrice * quantity;
        if (cost <= state.merchantEscrowBalance && quantity <= listing.availableQuantity) {
          // Deduct escrow
          state.merchantEscrowBalance -= cost;
          // Subtract stock
          listing.availableQuantity -= quantity;
          // Add shipment
          const newShipmentId = "S" + (state.shipments.length + 1);
          state.shipments.unshift({
            id: newShipmentId,
            cropName: listing.cropName,
            mandiSource: listing.mandiSource,
            tonnage: quantity / 10,
            logisticsStatus: "Dispatching",
          });
          // Update farmer side if listing belongs to our main farmer (Rajesh Kumar)
          if (listing.farmerName === "Rajesh Kumar") {
            state.farmerTotalSales += cost;
            state.farmerPendingPayouts += cost;
          }
        }
      }
    },
    addFarmerListing(state, action: PayloadAction<Omit<FarmerListing, "farmerName" | "farmerProfile" | "productSpecs" | "imageEmoji" | "grade">>) {
      const newListing: FarmerListing = {
        ...action.payload,
        farmerName: "Rajesh Kumar",
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
          moisture: "11.5%",
          admixture: "< 0.5%",
          grainSize: "Medium Bold",
          organic: false,
          harvestDate: "May 2026"
        }
      };
      state.listings.unshift(newListing);
    },
    postMandate(state, action: PayloadAction<Omit<Mandate, "id">>) {
      const newMandate: Mandate = {
        id: "M" + (state.mandates.length + 1),
        ...action.payload,
      };
      state.mandates.unshift(newMandate);
    },
  },
});

export const {
  acceptBid,
  rejectBid,
  procureProduce,
  addFarmerListing,
  postMandate,
} = marketSlice.actions;

export default marketSlice.reducer;
