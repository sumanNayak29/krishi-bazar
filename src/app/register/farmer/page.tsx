"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  FormHelperText 
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

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
  const [step, setStep] = useState<number>(1);
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

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (currentStep === 1) {
      if (form.fullName.trim().length < 3) {
        newErrors.fullName = "Full name must be at least 3 characters long.";
      }
      if (!/^\d{10}$/.test(form.phone)) {
        newErrors.phone = "Enter a valid 10-digit mobile number.";
      }
    } else if (currentStep === 2) {
      if (!form.state.trim()) newErrors.state = "State selection is required.";
      if (!form.district.trim()) newErrors.district = "District name is required.";
      if (!form.mandi.trim()) newErrors.mandi = "Mandi location is required.";
    } else if (currentStep === 3) {
      if (form.crops.length === 0) {
        newErrors.crops = "Please add at least one crop to your agricultural portfolio.";
      }
    } else if (currentStep === 4) {
      if (!/^\d{9,18}$/.test(form.accountNumber)) {
        newErrors.accountNumber = "Enter a valid bank account number (9 to 18 digits).";
      }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc)) {
        newErrors.ifsc = "Enter a valid 11-character IFSC code (e.g. SBIN0001234).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const muiTextFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "var(--color-brand-bg-main)",
      "& fieldset": { borderColor: "var(--color-brand-border-light)" },
      "&:hover fieldset": { borderColor: "var(--color-brand-text-muted)" },
      "&.Mui-focused fieldset": { borderColor: "var(--color-brand-primary)" },
    }
  };

  // Farmer registration success ID
  const farmerId = "KB-2026-" + (form.phone ? form.phone.substring(6) : "4892") + "-" + cardIdSuffix;

  return (
    <div className="min-h-screen flex justify-center items-center py-16 px-6 relative">
      <Link href="/" className="absolute top-8 left-[5%] text-sm font-semibold text-brand-text-secondary hover:text-brand-primary flex items-center gap-2 transition-all duration-300 hover:-translate-x-1">
        <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Bazar Catalog
      </Link>

      <div className="w-full max-w-[620px] bg-brand-bg-card border border-brand-border-light rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-brand-primary before:to-brand-secondary">
        
        {/* Progress Tracker */}
        {step < 5 && (
          <div className="flex justify-between items-center mb-12 relative w-full">
            <div className="absolute top-[15px] left-0 h-[2px] bg-brand-border-light w-full z-0"></div>
            <div
              className="absolute top-[15px] left-0 h-[2px] bg-brand-primary z-10 transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full bg-brand-bg-main border-2 flex items-center justify-center text-xs font-bold relative z-20 transition-all duration-300 ${
                  step === num 
                    ? "border-brand-primary bg-brand-primary-glow text-brand-primary shadow-[0_0_12px_var(--color-brand-primary-glow)]" 
                    : step > num 
                      ? "border-brand-primary bg-brand-primary text-white" 
                      : "border-brand-border-light text-brand-text-muted"
                }`}
              >
                {step > num ? "✓" : num}
                <span
                  className={`absolute top-9 text-[10px] font-bold uppercase tracking-wider white-space-nowrap ${
                    step === num ? "text-brand-primary" : "text-brand-text-muted"
                  }`}
                  style={{ 
                    left: num === 1 ? "-10px" : num === 4 ? "-45px" : "-20px",
                    transform: "translateX(0)"
                  }}
                >
                  {num === 1 ? "Profile" : num === 2 ? "Location" : num === 3 ? "Crops" : "Payout"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Personal Profile */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-extrabold font-outfit mb-1">Farmer Profile Details</h2>
              <p className="text-sm text-brand-text-secondary">Let&apos;s set up your profile for direct merchant trading.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-brand-text-secondary" htmlFor="fullName">Full Name (as in Aadhaar/ID)</label>
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

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-brand-text-secondary" htmlFor="phone">Mobile Number</label>
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
              <label className="text-xs font-semibold text-brand-text-secondary" htmlFor="lang">Preferred Language</label>
              <FormControl fullWidth size="small" sx={muiTextFieldStyle}>
                <Select
                  id="lang"
                  name="lang"
                  value={form.lang}
                  onChange={handleChange}
                >
                  <MenuItem value="Hindi">हिन्दी (Hindi)</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Marathi">मराठी (Marathi)</MenuItem>
                  <MenuItem value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</MenuItem>
                  <MenuItem value="Telugu">తెలుగు (Telugu)</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="flex justify-between mt-6">
              <div></div>
              <Button onClick={handleNext} variant="contained" color="primary" sx={{ textTransform: "none", fontWeight: 600, color: "#fff", px: 4 }}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Location & Mandi */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-extrabold font-outfit mb-1">Mandi & Location</h2>
              <p className="text-sm text-brand-text-secondary">We use this to match you with local mandis and nearby buyers.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-brand-text-secondary" htmlFor="state">State</label>
              <FormControl fullWidth size="small" error={!!errors.state} sx={muiTextFieldStyle}>
                <Select
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  displayEmpty
                  renderValue={(val) => val || <span className="text-brand-text-muted">Select State</span>}
                >
                  <MenuItem value="Madhya Pradesh">Madhya Pradesh</MenuItem>
                  <MenuItem value="Punjab">Punjab</MenuItem>
                  <MenuItem value="Rajasthan">Rajasthan</MenuItem>
                  <MenuItem value="Uttar Pradesh">Uttar Pradesh</MenuItem>
                  <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                  <MenuItem value="Andhra Pradesh">Andhra Pradesh</MenuItem>
                </Select>
                {errors.state && <FormHelperText>{errors.state}</FormHelperText>}
              </FormControl>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-text-secondary" htmlFor="district">District</label>
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
                <label className="text-xs font-semibold text-brand-text-secondary" htmlFor="mandi">Nearest Mandi / APMC</label>
                <TextField
                  fullWidth
                  size="small"
                  id="mandi"
                  name="mandi"
                  placeholder="e.g. Indore Mandi"
                  value={form.mandi}
                  onChange={handleChange}
                  error={!!errors.mandi}
                  helperText={errors.mandi}
                  sx={muiTextFieldStyle}
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button onClick={handleBack} variant="outlined" color="inherit" sx={{ textTransform: "none", fontWeight: 600 }}>
                Back
              </Button>
              <Button onClick={handleNext} variant="contained" color="primary" sx={{ textTransform: "none", fontWeight: 600, color: "#fff", px: 4 }}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Agriculture Portfolio */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-extrabold font-outfit mb-1">Agricultural Portfolio</h2>
              <p className="text-sm text-brand-text-secondary">List your crops to automatically display them in merchant searches.</p>
            </div>

            <div className="flex gap-3 items-end">
              <div className="flex-[2] flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-text-secondary">Crop Name</label>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="e.g. Premium Sharbati Wheat"
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  sx={muiTextFieldStyle}
                />
              </div>

              <div className="flex-[1] flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-text-secondary">Acreage (Acres)</label>
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
                onClick={handleAddCrop} 
                variant="contained" 
                color="primary" 
                sx={{ height: "40px", minWidth: "40px", borderRadius: "10px", color: "#fff" }}
              >
                <AddIcon />
              </Button>
            </div>

            {errors.crop && <p className="text-red-500 text-xs -mt-2">{errors.crop}</p>}
            {errors.crops && <p className="text-red-500 text-xs -mt-2">{errors.crops}</p>}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-brand-text-secondary">Listed Crops Portfolio</label>
              <div className="flex flex-wrap gap-2.5 p-4 rounded-xl border border-brand-border-light bg-brand-bg-main/40 min-h-[60px] items-center">
                {form.crops.length > 0 ? (
                  form.crops.map((crop, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-brand-primary bg-brand-primary-glow border border-brand-border-glow">
                      {crop.name} ({crop.acreage} Acres)
                      <button type="button" onClick={() => handleRemoveCrop(i)} className="text-brand-primary hover:text-red-500 font-bold ml-1 cursor-pointer">
                        &times;
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-brand-text-muted mx-auto">
                    No crops added yet. Enter crop details above.
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button onClick={handleBack} variant="outlined" color="inherit" sx={{ textTransform: "none", fontWeight: 600 }}>
                Back
              </Button>
              <Button onClick={handleNext} variant="contained" color="primary" sx={{ textTransform: "none", fontWeight: 600, color: "#fff", px: 4 }}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Escrow Bank Details */}
        {step === 4 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-extrabold font-outfit mb-1">Verification & Payout Details</h2>
              <p className="text-sm text-brand-text-secondary">Needed to securely dispatch automated escrow payouts directly to your account.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-brand-text-secondary" htmlFor="accountNumber">Bank Account Number</label>
              <TextField
                fullWidth
                size="small"
                type="password"
                id="accountNumber"
                name="accountNumber"
                placeholder="e.g. 30894576201"
                value={form.accountNumber}
                onChange={handleChange}
                error={!!errors.accountNumber}
                helperText={errors.accountNumber}
                sx={muiTextFieldStyle}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-brand-text-secondary" htmlFor="ifsc">IFSC Code</label>
              <TextField
                fullWidth
                size="small"
                id="ifsc"
                name="ifsc"
                placeholder="e.g. SBIN0001234"
                value={form.ifsc}
                onChange={handleChange}
                error={!!errors.ifsc}
                helperText={errors.ifsc}
                slotProps={{ htmlInput: { style: { textTransform: "uppercase" } } }}
                sx={muiTextFieldStyle}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-brand-text-secondary" htmlFor="upi">UPI ID (Optional)</label>
              <TextField
                fullWidth
                size="small"
                id="upi"
                name="upi"
                placeholder="e.g. rajesh@oksbi"
                value={form.upi}
                onChange={handleChange}
                sx={muiTextFieldStyle}
              />
            </div>

            <div className="flex justify-between mt-6">
              <Button onClick={handleBack} variant="outlined" color="inherit" sx={{ textTransform: "none", fontWeight: 600 }}>
                Back
              </Button>
              <Button onClick={handleNext} variant="contained" color="primary" sx={{ textTransform: "none", fontWeight: 600, color: "#fff", px: 4 }}>
                Register Account
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Completed successfully / Display Krishi Card */}
        {step === 5 && (
          <div className="flex flex-col items-center text-center gap-6">
            <div>
              <div className="text-5xl mb-2">🎉</div>
              <h2 className="text-2xl font-extrabold font-outfit text-brand-primary mb-1">Registration Successful!</h2>
              <p className="text-sm text-brand-text-secondary">Your digital agricultural account is active and verified.</p>
            </div>

            <div className="w-full max-w-[440px] my-6 transition-all duration-500 [perspective:1000px]">
              <div className="w-full bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border-2 border-brand-border-glow rounded-3xl p-6 sm:p-8 text-left relative overflow-hidden shadow-2xl hover:border-brand-primary hover:rotate-1 hover:scale-[1.01] transition-all duration-500">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>

                <div className="flex justify-between items-center border-b border-brand-border-light pb-4 mb-6">
                  <div className="flex items-center gap-1.5 font-extrabold font-outfit text-brand-text-primary text-base">
                    <span>🌾</span>
                    <span>Krishi Card</span>
                  </div>
                  <span className="text-[9px] font-bold tracking-wider bg-brand-primary text-white p-1 px-2.5 rounded shadow-[0_0_8px_var(--color-brand-primary-glow)]">
                    VERIFIED FARMER
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-8 flex flex-col gap-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-brand-text-muted uppercase tracking-wider font-semibold">Name</span>
                      <span className="text-sm font-bold text-brand-text-primary">{form.fullName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-brand-text-muted uppercase tracking-wider font-semibold">Farmer ID</span>
                      <span className="text-xs font-bold text-brand-text-primary font-mono">{farmerId}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-brand-text-muted uppercase tracking-wider font-semibold">Region</span>
                      <span className="text-xs font-bold text-brand-text-primary">{form.district}, {form.state}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-brand-text-muted uppercase tracking-wider font-semibold">Preferred Mandi</span>
                      <span className="text-xs font-bold text-brand-text-primary">{form.mandi}</span>
                    </div>
                  </div>

                  <div className="col-span-4 flex flex-col items-center gap-4 justify-self-center">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-brand-bg-main to-emerald-950 border border-brand-border-light flex items-center justify-center text-4xl shadow-md">
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
                onClick={() => alert("Your verified Krishi Card is downloading...")}
                variant="outlined"
                color="inherit"
                sx={{ textTransform: "none", fontWeight: 600, px: 3, py: 1 }}
              >
                Download Krishi Card
              </Button>
              <Button
                component={Link}
                href="/"
                variant="contained"
                color="primary"
                sx={{ textTransform: "none", fontWeight: 600, color: "#fff", px: 3, py: 1 }}
              >
                Go to Mandi Catalog
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
