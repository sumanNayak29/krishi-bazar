"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl 
} from "@mui/material";
import { ArrowBackIcon, AddIcon } from "@/icons";

interface CropItem {
  name: string;
  acreage: number;
}

interface FormState {
  fullName: string;
  phone: string;
  lang: string;
  state: string;
  district: string;
  mandi: string;
  crops: CropItem[];
  accountNumber: string;
  ifsc: string;
  upi: string;
}

const initialFormState: FormState = {
  fullName: "",
  phone: "",
  lang: "Hindi",
  state: "",
  district: "",
  mandi: "",
  crops: [],
  accountNumber: "",
  ifsc: "",
  upi: "",
};

export default function FarmerRegistrationPage() {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "crop", string>>>({});
  
  // Stable random card suffix for React 19 render purity
  const [cardIdSuffix] = useState(() => Math.floor(1000 + Math.random() * 9000));
  
  // Local state for adding crops
  const [newCropName, setNewCropName] = useState("");
  const [newCropAcreage, setNewCropAcreage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddCrop = () => {
    if (!newCropName.trim()) {
      setErrors((prev) => ({ ...prev, crop: "Crop name cannot be empty" }));
      return;
    }
    const acreageNum = parseFloat(newCropAcreage);
    if (isNaN(acreageNum) || acreageNum <= 0) {
      setErrors((prev) => ({ ...prev, crop: "Enter a valid acreage (greater than 0)" }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      crops: [...prev.crops, { name: newCropName.trim(), acreage: acreageNum }],
    }));
    setNewCropName("");
    setNewCropAcreage("");
    setErrors((prev) => ({ ...prev, crop: "" }));
  };

  const handleRemoveCrop = (index: number) => {
    setForm((prev) => ({
      ...prev,
      crops: prev.crops.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (form.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters long.";
    }
    if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    }
    if (!form.state.trim()) newErrors.state = "State selection is required.";
    if (!form.district.trim()) newErrors.district = "District name is required.";
    if (!form.mandi.trim()) newErrors.mandi = "Mandi location is required.";
    if (form.crops.length === 0) {
      newErrors.crops = "Please add at least one crop to your agricultural portfolio.";
    }
    if (!/^\d{9,18}$/.test(form.accountNumber)) {
      newErrors.accountNumber = "Enter a valid bank account number (9 to 18 digits).";
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.toUpperCase())) {
      newErrors.ifsc = "Enter a valid 11-character IFSC code (e.g. SBIN0001234).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsRegistered(true);
    }
  };

  const muiTextFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#f9fafb",
      "& fieldset": { borderColor: "#e5e7eb" },
      "&:hover fieldset": { borderColor: "#9ca3af" },
      "&.Mui-focused fieldset": { borderColor: "#1aa35a" },
    },
    "& .MuiInputBase-input": {
      color: "#1f2937",
      fontWeight: 500,
      fontSize: "0.9rem",
    },
    "& .MuiFormHelperText-root": {
      fontSize: "0.75rem",
      fontWeight: 500,
    }
  };

  // Farmer registration success ID
  const farmerId = "KB-2026-" + (form.phone ? form.phone.substring(6) : "4892") + "-" + cardIdSuffix;

  return (
    <div className="min-h-screen flex justify-center items-center py-16 px-6 relative bg-brand-bg-main overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

      <Link href="/" className="absolute top-8 left-[5%] text-sm font-semibold text-brand-text-secondary hover:text-brand-primary flex items-center gap-2 transition-all duration-300 hover:-translate-x-1 z-10">
        <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Bazar Catalog
      </Link>

      <div className="w-full max-w-[650px] bg-white border border-gray-200/80 rounded-[24px] shadow-2xl relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-brand-primary before:to-brand-secondary z-10">
        
        {/* ==================== FORM VIEW ==================== */}
        {!isRegistered && (
          <div className="p-8 sm:p-12 max-h-[700px] overflow-y-auto flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-extrabold font-outfit text-gray-800 mb-1">Farmer Registration</h2>
              <p className="text-xs text-gray-500">Create your account for direct merchant trading in one step.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* 1. Personal Profile */}
              <div className="flex flex-col gap-3">
                <div className="border-b border-gray-150 pb-1.5">
                  <h3 className="text-xs font-bold text-[#1aa35a] uppercase tracking-wider">1. Profile Details</h3>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="fullName">Full Name (as in Aadhaar/ID)</label>
                  <TextField
                    fullWidth
                    size="small"
                    id="fullName"
                    name="fullName"
                    placeholder="e.g. Rajesh Kumar"
                    value={form.fullName}
                    onChange={handleChange}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    sx={muiTextFieldStyle}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="phone">Mobile Number</label>
                    <TextField
                      fullWidth
                      size="small"
                      id="phone"
                      name="phone"
                      placeholder="e.g. 9876543210"
                      value={form.phone}
                      onChange={handleChange}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      sx={muiTextFieldStyle}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="lang">Preferred Language</label>
                    <FormControl fullWidth size="small" sx={muiTextFieldStyle}>
                      <Select
                        id="lang"
                        name="lang"
                        value={form.lang}
                        onChange={handleChange}
                      >
                        <MenuItem value="Hindi">हिन्दी (Hindi)</MenuItem>
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Marathi">मరాठी (Marathi)</MenuItem>
                        <MenuItem value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</MenuItem>
                        <MenuItem value="Telugu">తెలుగు (Telugu)</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>

              {/* 2. Farm Location */}
              <div className="flex flex-col gap-3">
                <div className="border-b border-gray-150 pb-1.5">
                  <h3 className="text-xs font-bold text-[#1aa35a] uppercase tracking-wider">2. Farm Location</h3>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="state">State</label>
                  <FormControl fullWidth size="small" error={!!errors.state} sx={muiTextFieldStyle}>
                    <Select
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      displayEmpty
                      renderValue={(val) => val || <span className="text-gray-400">Select Sourcing State</span>}
                    >
                      <MenuItem value="Madhya Pradesh">Madhya Pradesh</MenuItem>
                      <MenuItem value="Punjab">Punjab</MenuItem>
                      <MenuItem value="Rajasthan">Rajasthan</MenuItem>
                      <MenuItem value="Uttar Pradesh">Uttar Pradesh</MenuItem>
                      <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                    </Select>
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </FormControl>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="district">District</label>
                    <TextField
                      fullWidth
                      size="small"
                      id="district"
                      name="district"
                      placeholder="e.g. Indore"
                      value={form.district}
                      onChange={handleChange}
                      error={!!errors.district}
                      helperText={errors.district}
                      sx={muiTextFieldStyle}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="mandi">Target APMC Mandi</label>
                    <TextField
                      fullWidth
                      size="small"
                      id="mandi"
                      name="mandi"
                      placeholder="e.g. Indore APMC Sanyogitaganj"
                      value={form.mandi}
                      onChange={handleChange}
                      error={!!errors.mandi}
                      helperText={errors.mandi}
                      sx={muiTextFieldStyle}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Crop details */}
              <div className="flex flex-col gap-3">
                <div className="border-b border-gray-150 pb-1.5">
                  <h3 className="text-xs font-bold text-[#1aa35a] uppercase tracking-wider">3. Crop Portfolio</h3>
                </div>

                <div className="flex gap-2 items-end">
                  <div className="flex-[1.5] flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Crop Name</label>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="e.g. Sharbati Wheat"
                      value={newCropName}
                      onChange={(e) => setNewCropName(e.target.value)}
                      sx={muiTextFieldStyle}
                    />
                  </div>

                  <div className="flex-[1] flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Acreage (Acres)</label>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      placeholder="e.g. 5"
                      value={newCropAcreage}
                      onChange={(e) => setNewCropAcreage(e.target.value)}
                      sx={muiTextFieldStyle}
                    />
                  </div>

                  <Button 
                    type="button"
                    onClick={handleAddCrop} 
                    variant="contained" 
                    sx={{ 
                      height: "40px", 
                      minWidth: "40px", 
                      borderRadius: "10px", 
                      color: "#fff",
                      backgroundColor: "#1aa35a",
                      "&:hover": { backgroundColor: "#15803d" }
                    }}
                  >
                    <AddIcon />
                  </Button>
                </div>

                {errors.crop && <p className="text-red-500 text-xs -mt-2">{errors.crop}</p>}
                {errors.crops && <p className="text-red-500 text-xs -mt-2">{errors.crops}</p>}

                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-gray-200 bg-gray-50 min-h-[50px] items-center">
                    {form.crops.length > 0 ? (
                      form.crops.map((crop, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#1aa35a] bg-emerald-50 border border-emerald-100">
                          🌱 {crop.name} ({crop.acreage} Acres)
                          <button type="button" onClick={() => handleRemoveCrop(i)} className="text-[#1aa35a] hover:text-red-500 font-bold ml-1 cursor-pointer">
                            &times;
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-gray-400 mx-auto">
                        Add target crops above. (At least 1 required)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Financial payout details */}
              <div className="flex flex-col gap-3">
                <div className="border-b border-gray-150 pb-1.5">
                  <h3 className="text-xs font-bold text-[#1aa35a] uppercase tracking-wider">4. Payout Account</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="accountNumber">Bank Account Number</label>
                    <TextField
                      fullWidth
                      size="small"
                      type="password"
                      id="accountNumber"
                      name="accountNumber"
                      placeholder="e.g. 5010048293910"
                      value={form.accountNumber}
                      onChange={handleChange}
                      error={!!errors.accountNumber}
                      helperText={errors.accountNumber}
                      sx={muiTextFieldStyle}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="ifsc">IFSC Code</label>
                    <TextField
                      fullWidth
                      size="small"
                      id="ifsc"
                      name="ifsc"
                      placeholder="e.g. HDFC0000124"
                      value={form.ifsc}
                      onChange={handleChange}
                      error={!!errors.ifsc}
                      helperText={errors.ifsc}
                      slotProps={{ htmlInput: { style: { textTransform: "uppercase" } } }}
                      sx={muiTextFieldStyle}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="upi">UPI ID (Optional)</label>
                  <TextField
                    fullWidth
                    size="small"
                    id="upi"
                    name="upi"
                    placeholder="e.g. name@upi"
                    value={form.upi}
                    onChange={handleChange}
                    sx={muiTextFieldStyle}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="contained"
                sx={{ 
                  textTransform: "none", 
                  fontWeight: 700, 
                  py: 1.2,
                  borderRadius: "20px", 
                  color: "#fff",
                  backgroundColor: "#1aa35a",
                  "&:hover": { backgroundColor: "#15803d" }
                }}
              >
                Register Account & Generate Krishi Card
              </Button>
            </form>
          </div>
        )}

        {/* ==================== SUCCESS VIEW ==================== */}
        {isRegistered && (
          <div className="p-8 sm:p-12 flex flex-col items-center text-center gap-6 bg-white text-gray-800">
            <div>
              <div className="text-5xl mb-2">🎉</div>
              <h2 className="text-2xl font-extrabold font-outfit text-[#1aa35a] mb-1">Registration Successful!</h2>
              <p className="text-sm text-gray-500">Your digital agricultural account is active and verified.</p>
            </div>

            <div className="w-full max-w-[440px] my-6 transition-all duration-500 [perspective:1000px]">
              <div className="w-full bg-gradient-to-br from-[#1aa35a] to-[#0f5230] border-2 border-emerald-500/20 rounded-3xl p-6 sm:p-8 text-left relative overflow-hidden shadow-2xl hover:border-brand-primary hover:rotate-1 hover:scale-[1.01] transition-all duration-500">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>

                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-1.5 font-extrabold font-outfit text-white text-base">
                    <span>🌾</span>
                    <span>Krishi Card</span>
                  </div>
                  <span className="text-[9px] font-bold tracking-wider bg-[#d97706] text-white p-1 px-2.5 rounded shadow-[0_0_8px_rgba(217,119,6,0.4)]">
                    VERIFIED FARMER
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-8 flex flex-col gap-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-emerald-200 uppercase tracking-wider font-semibold">Name</span>
                      <span className="text-sm font-bold text-white">{form.fullName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-emerald-200 uppercase tracking-wider font-semibold">Farmer ID</span>
                      <span className="text-xs font-bold text-white font-mono">{farmerId}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-emerald-200 uppercase tracking-wider font-semibold">Region</span>
                      <span className="text-xs font-bold text-white">{form.district}, {form.state}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-emerald-200 uppercase tracking-wider font-semibold">Preferred Mandi</span>
                      <span className="text-xs font-bold text-white">{form.mandi}</span>
                    </div>
                  </div>

                  <div className="col-span-4 flex flex-col items-center gap-4 justify-self-center">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-950 border border-emerald-800 flex items-center justify-center text-4xl shadow-md">
                      👨🏽‍🌾
                    </div>
                    
                    {/* Mock QR Code in CSS */}
                    <div className="w-14 h-14 bg-white rounded-md p-1.5 grid grid-cols-4 grid-rows-4 gap-1 opacity-90 shadow-md">
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-transparent"></div>
                      <div className="bg-black rounded-sm"></div>
                      <div className="bg-black rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 w-full justify-center">
              <Button
                onClick={() => alert("Your virtual Krishi Card download is starting...")}
                variant="outlined"
                sx={{ textTransform: "none", fontWeight: 600, borderRadius: "20px", px: 4, color: "gray", borderColor: "gray" }}
              >
                Download Card
              </Button>
              <Button
                component={Link}
                href="/"
                variant="contained"
                sx={{ 
                  textTransform: "none", 
                  fontWeight: 600, 
                  color: "#fff", 
                  borderRadius: "20px", 
                  px: 4,
                  backgroundColor: "#1aa35a",
                  "&:hover": { backgroundColor: "#15803d" }
                }}
              >
                Go to Marketplace
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
