import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BankDetails {
  bankName: string;
  accountNum: string;
  ifsc: string;
}

interface UserProfile {
  name: string;
  id: string;
  region: string;
  rating?: number;
  trades?: number;
  avatar: string | null;
  bankDetails: BankDetails | null;
  isVerified: boolean;
}

interface UserState {
  farmer: UserProfile;
  merchant: UserProfile;
}

const initialState: UserState = {
  farmer: {
    name: "Rajesh Kumar",
    id: "KB-2026-4892-1925",
    region: "Indore, Madhya Pradesh",
    rating: 4.8,
    trades: 85,
    avatar: null,
    bankDetails: null,
    isVerified: false,
  },
  merchant: {
    name: "Sharma Agro Traders",
    id: "KB-BUY-7940-1925",
    region: "Indore, Madhya Pradesh",
    avatar: null,
    bankDetails: null,
    isVerified: false,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateFarmerBank(state, action: PayloadAction<BankDetails>) {
      state.farmer.bankDetails = action.payload;
      state.farmer.isVerified = !!(state.farmer.avatar && action.payload);
    },
    updateFarmerAvatar(state, action: PayloadAction<string>) {
      state.farmer.avatar = action.payload;
      state.farmer.isVerified = !!(state.farmer.bankDetails && action.payload);
    },
    updateMerchantBank(state, action: PayloadAction<BankDetails>) {
      state.merchant.bankDetails = action.payload;
      state.merchant.isVerified = !!(state.merchant.avatar && action.payload);
    },
    updateMerchantAvatar(state, action: PayloadAction<string>) {
      state.merchant.avatar = action.payload;
      state.merchant.isVerified = !!(state.merchant.bankDetails && action.payload);
    },
    setFarmerProfile(state, action: PayloadAction<{ name: string; region: string; id?: string; avatar?: string | null }>) {
      state.farmer.name = action.payload.name;
      state.farmer.region = action.payload.region;
      if (action.payload.id) {
        state.farmer.id = action.payload.id;
      }
      if (action.payload.avatar !== undefined) {
        state.farmer.avatar = action.payload.avatar;
      }
      state.farmer.isVerified = !!(state.farmer.avatar && state.farmer.bankDetails);
    },
    setMerchantProfile(state, action: PayloadAction<{ name: string; region: string; id?: string; avatar?: string | null }>) {
      state.merchant.name = action.payload.name;
      state.merchant.region = action.payload.region;
      if (action.payload.id) {
        state.merchant.id = action.payload.id;
      }
      if (action.payload.avatar !== undefined) {
        state.merchant.avatar = action.payload.avatar;
      }
      state.merchant.isVerified = !!(state.merchant.avatar && state.merchant.bankDetails);
    },
  },
});

export const {
  updateFarmerBank,
  updateFarmerAvatar,
  updateMerchantBank,
  updateMerchantAvatar,
  setFarmerProfile,
  setMerchantProfile,
} = userSlice.actions;

export default userSlice.reducer;
