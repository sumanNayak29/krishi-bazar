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
import { ArrowBackIcon, AddIcon, GoogleIcon } from "@/icons";

interface MandiItem {
  name: string;
  state: string;
}

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  gstin: string;
  buyerType: string;
  sourcingCapacity: string;
  mandis: MandiItem[];
  accountNumber: string;
  ifsc: string;
  billingAddress: string;
}

const initialFormState: FormState = {
  fullName: "",
  phone: "",
  email: "",
  companyName: "",
  gstin: "",
  buyerType: "Wholesaler",
  sourcingCapacity: "",
  mandis: [],
  accountNumber: "",
  ifsc: "",
  billingAddress: "",
};

export default function MerchantRegistrationPage() {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true); // Defaults directly to Login card
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "mandi", string>>>({});
  
  // Stable random card suffix for React 19 render purity
  const [cardIdSuffix] = useState(() => Math.floor(1000 + Math.random() * 9000));
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Partial<Record<"email" | "password", string>>>({});

  // Local state for adding mandis
  const [newMandiName, setNewMandiName] = useState("");
  const [newMandiState, setNewMandiState] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddMandi = () => {
    if (!newMandiName.trim()) {
      setErrors((prev) => ({ ...prev, mandi: "Mandi name cannot be empty" }));
      return;
    }
    if (!newMandiState.trim()) {
      setErrors((prev) => ({ ...prev, mandi: "State selection is required" }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      mandis: [...prev.mandis, { name: newMandiName.trim(), state: newMandiState }],
    }));
    setNewMandiName("");
    setNewMandiState("");
    setErrors((prev) => ({ ...prev, mandi: "" }));
  };

  const handleRemoveMandi = (index: number) => {
    setForm((prev) => ({
      ...prev,
      mandis: prev.mandis.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (form.fullName.trim().length < 3) {
      newErrors.fullName = "Representative full name must be at least 3 characters long.";
    }
    if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid corporate email address.";
    }
    if (form.companyName.trim().length < 3) {
      newErrors.companyName = "Company name must be at least 3 characters long.";
    }
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9a-zA-Z]{1}$/.test(form.gstin.toUpperCase())) {
      newErrors.gstin = "Enter a valid 15-character GSTIN format (e.g. 27AAAAA1111A1Z1).";
    }
    const capacityNum = parseFloat(form.sourcingCapacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      newErrors.sourcingCapacity = "Enter a valid monthly capacity in tons.";
    }
    if (form.mandis.length === 0) {
      newErrors.mandis = "Please list at least one target sourcing mandi.";
    }
    if (!/^\d{9,18}$/.test(form.accountNumber)) {
      newErrors.accountNumber = "Enter a valid bank account number (9 to 18 digits).";
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.toUpperCase())) {
      newErrors.ifsc = "Enter a valid 11-character IFSC code (e.g. SBIN0001234).";
    }
    if (form.billingAddress.trim().length < 5) {
      newErrors.billingAddress = "Billing address must be at least 5 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsRegistered(true);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoginErrors: Partial<Record<"email" | "password", string>> = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      newLoginErrors.email = "Enter a valid corporate email address.";
    }
    if (loginPassword.length < 6) {
      newLoginErrors.password = "Password must be at least 6 characters long.";
    }

    setLoginErrors(newLoginErrors);
    if (Object.keys(newLoginErrors).length === 0) {
      setLoginSuccess(true);
    }
  };

  const muiInputStyle = (hasError: boolean) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: "9999px",
      backgroundColor: "#f9fafb",
      transition: "all 0.2s ease-in-out",
      "& fieldset": { 
        borderColor: hasError ? "#f87171" : "#d1d5db",
        borderWidth: "1.5px"
      },
      "&:hover fieldset": { 
        borderColor: hasError ? "#f87171" : "#9ca3af" 
      },
      "&.Mui-focused fieldset": { 
        borderColor: hasError ? "#ef4444" : "#1aa35a",
        borderWidth: "1.5px"
      },
    },
    "& .MuiInputBase-input": {
      color: "#1f2937",
      fontWeight: 500,
      fontSize: "0.9rem",
      padding: "10px 16px",
      "&::placeholder": {
        color: "#9ca3af",
        opacity: 1,
      }
    },
    "& .MuiFormHelperText-root": {
      marginLeft: "12px",
      fontSize: "0.75rem",
      fontWeight: 500,
    }
  });

  const muiWizardInputStyle = {
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

  // Merchant ID format
  const merchantId = "KB-BUY-" + (form.phone ? form.phone.substring(6) : "5798") + "-" + cardIdSuffix;

  return (
    <div className="min-h-screen flex justify-center items-center py-16 px-6 relative bg-brand-bg-main overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

      <Link href="/" className="absolute top-8 left-[5%] text-sm font-semibold text-brand-text-secondary hover:text-brand-primary flex items-center gap-2 transition-all duration-300 hover:-translate-x-1 z-10">
        <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Bazar Catalog
      </Link>

      <div className="w-full max-w-[850px] bg-white border border-gray-200/80 rounded-[24px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row min-h-[500px] z-10">
        
        {/* ==================== LOGIN VIEW ==================== */}
        {isLoginMode && !loginSuccess && (
          <>
            {/* Left Welcome Panel (Green Triangle Overlay) */}
            <div 
              className="hidden md:flex absolute top-0 left-0 h-full w-[46%] bg-[#1aa35a] z-20 flex-col justify-center text-white"
              style={{ clipPath: "polygon(0 0, 100% 0, 75% 100%, 0 100%)" }}
            >
              <div className="p-8 sm:p-12 flex flex-col gap-2">
                <h2 className="text-4xl font-extrabold font-outfit mb-3 tracking-wide">Welcome!</h2>
                <p className="text-sm font-medium leading-relaxed opacity-90">Create your account.</p>
                <p className="text-sm font-medium leading-relaxed opacity-90">For Free!</p>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsLoginMode(false);
                    setIsRegistered(false);
                  }}
                  className="mt-8 border-2 border-white text-white hover:bg-white hover:text-[#1aa35a] font-bold rounded-full px-8 py-2.5 transition-all duration-300 self-start cursor-pointer text-xs uppercase tracking-wider"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Right Form Panel (White Background) */}
            <div className="w-full md:w-[54%] md:ml-[46%] p-8 sm:p-12 md:pl-8 md:pr-16 flex flex-col justify-center gap-6 bg-white text-gray-800 z-10">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-700 font-outfit mb-1">Login</h2>
              </div>

              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="loginEmail">
                    Username/Email address <span className="text-red-500">*</span>
                  </label>
                  <TextField
                    fullWidth
                    size="small"
                    id="loginEmail"
                    placeholder="Codewithrandom@gmail.com"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setLoginErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    error={!!loginErrors.email}
                    helperText={loginErrors.email}
                    sx={muiInputStyle(!!loginErrors.email)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="loginPassword">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <TextField
                    fullWidth
                    size="small"
                    id="loginPassword"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    error={!!loginErrors.password}
                    helperText={loginErrors.password}
                    sx={muiInputStyle(!!loginErrors.password)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <Button 
                    type="submit" 
                    variant="outlined" 
                    fullWidth 
                    sx={{ 
                      textTransform: "none", 
                      borderRadius: "9999px", 
                      fontWeight: 700, 
                      py: 1.2, 
                      borderColor: "#1aa35a", 
                      color: "#1aa35a",
                      borderWidth: "1.5px",
                      "&:hover": { 
                        backgroundColor: "#1aa35a", 
                        color: "#fff", 
                        borderColor: "#1aa35a",
                        borderWidth: "1.5px"
                      } 
                    }}
                  >
                    Sign In
                  </Button>

                  <div className="flex items-center my-0.5">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-wider">or</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => alert("Simulated Google authentication initiated.")}
                    startIcon={
                      <GoogleIcon />
                    }
                    sx={{
                      textTransform: "none",
                      borderRadius: "9999px",
                      fontWeight: 600,
                      py: 1.1,
                      borderColor: "#d1d5db",
                      color: "#374151",
                      borderWidth: "1.5px",
                      backgroundColor: "#fff",
                      "&:hover": {
                        backgroundColor: "#f9fafb",
                        borderColor: "#9ca3af",
                        borderWidth: "1.5px"
                      }
                    }}
                  >
                    Sign in with Google
                  </Button>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span 
                      onClick={() => alert("Simulated password recovery link clicked.")} 
                      className="text-xs text-[#1aa35a] hover:underline cursor-pointer font-bold transition-all"
                    >
                      Forgot password?
                    </span>
                    
                    <span 
                      onClick={() => {
                        setIsLoginMode(false);
                        setIsRegistered(false);
                      }} 
                      className="md:hidden text-xs text-[#1aa35a] hover:underline cursor-pointer font-bold"
                    >
                      New user? Register account
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}

        {/* Login Success Panel */}
        {isLoginMode && loginSuccess && (
          <div className="w-full p-8 sm:p-16 flex flex-col items-center text-center gap-6 bg-white text-gray-800">
            <div className="text-5xl">🎉</div>
            <div>
              <h2 className="text-2xl font-extrabold font-outfit text-[#1aa35a] mb-1">Welcome Back!</h2>
              <p className="text-sm text-gray-500">Authenticated as <span className="text-gray-900 font-semibold">{loginEmail}</span></p>
            </div>
            
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50 text-left w-full max-w-[360px] flex flex-col gap-2.5">
              <div className="flex justify-between border-b border-gray-200 pb-2 mb-1">
                <span className="text-xs text-gray-500 font-semibold">Account Type</span>
                <span className="text-xs font-bold text-[#1aa35a]">MERCHANT PRO</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 font-semibold">Buyer ID</span>
                <span className="text-xs font-bold font-mono text-gray-800">KB-BUY-7940-1925</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 font-semibold">Status</span>
                <span className="text-xs font-bold text-green-600 flex items-center gap-1">● Active Sourcing</span>
              </div>
            </div>

            <div className="flex gap-4 w-full justify-center mt-2">
              <Button 
                onClick={() => {
                  setLoginSuccess(false);
                  setIsLoginMode(true);
                  setLoginEmail("");
                  setLoginPassword("");
                }} 
                variant="outlined" 
                sx={{ textTransform: "none", borderRadius: "30px", fontWeight: 600, color: "gray", borderColor: "gray", px: 4 }}
              >
                Log Out
              </Button>
              <Button 
                component={Link} 
                href="/" 
                variant="contained" 
                sx={{ 
                  textTransform: "none", 
                  borderRadius: "30px", 
                  fontWeight: 600, 
                  backgroundColor: "#1aa35a", 
                  color: "#fff",
                  px: 4,
                  "&:hover": { backgroundColor: "#15803d" }
                }}
              >
                Enter Market
              </Button>
            </div>
          </div>
        )}

        {/* ==================== SIGN UP FORM ==================== */}
        {!isLoginMode && !isRegistered && (
          <>
            {/* Left Sourcing Form */}
            <div className="w-full md:w-[54%] p-8 sm:p-12 md:pr-6 md:pl-12 flex flex-col gap-5 z-10 max-h-[650px] overflow-y-auto">
              <div>
                <h2 className="text-2xl font-extrabold font-outfit mb-1 text-gray-800">Merchant Sourcing Registration</h2>
                <p className="text-xs text-gray-500">Provide representative, company, sourcing APMCs, and payout details below.</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-6">
                {/* 1. Representative Contact */}
                <div className="flex flex-col gap-3">
                  <div className="border-b border-gray-150 pb-1.5">
                    <h3 className="text-xs font-bold text-[#1aa35a] uppercase tracking-wider">1. Representative Contact</h3>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="fullName">Representative Name</label>
                    <TextField
                      fullWidth
                      size="small"
                      id="fullName"
                      name="fullName"
                      placeholder="e.g. Rajesh Sharma"
                      value={form.fullName}
                      onChange={handleChange}
                      error={!!errors.fullName}
                      helperText={errors.fullName}
                      sx={muiWizardInputStyle}
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
                        sx={muiWizardInputStyle}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="email">Corporate Email</label>
                      <TextField
                        fullWidth
                        size="small"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g. sourcing@sharmatraders.com"
                        value={form.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={muiWizardInputStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Company Profile */}
                <div className="flex flex-col gap-3">
                  <div className="border-b border-gray-150 pb-1.5">
                    <h3 className="text-xs font-bold text-[#1aa35a] uppercase tracking-wider">2. Company Profile</h3>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="companyName">Registered Company Name</label>
                    <TextField
                      fullWidth
                      size="small"
                      id="companyName"
                      name="companyName"
                      placeholder="e.g. Sharma Agro Traders Pvt Ltd"
                      value={form.companyName}
                      onChange={handleChange}
                      error={!!errors.companyName}
                      helperText={errors.companyName}
                      sx={muiWizardInputStyle}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="gstin">GSTIN (GST Number)</label>
                      <TextField
                        fullWidth
                        size="small"
                        id="gstin"
                        name="gstin"
                        placeholder="e.g. 27AAAAA1111A1Z1"
                        value={form.gstin}
                        onChange={handleChange}
                        error={!!errors.gstin}
                        helperText={errors.gstin}
                        slotProps={{ htmlInput: { style: { textTransform: "uppercase" } } }}
                        sx={muiWizardInputStyle}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="buyerType">Business Type</label>
                      <FormControl fullWidth size="small" sx={muiWizardInputStyle}>
                        <Select
                          id="buyerType"
                          name="buyerType"
                          value={form.buyerType}
                          onChange={handleChange}
                        >
                          <MenuItem value="Wholesaler">Wholesaler</MenuItem>
                          <MenuItem value="Exporter">Exporter</MenuItem>
                          <MenuItem value="Processor">Processor / Mill</MenuItem>
                          <MenuItem value="Retailer">Retailer Chain</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="sourcingCapacity">Sourcing Capacity (Tons/Month)</label>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      id="sourcingCapacity"
                      name="sourcingCapacity"
                      placeholder="e.g. 150"
                      value={form.sourcingCapacity}
                      onChange={handleChange}
                      error={!!errors.sourcingCapacity}
                      helperText={errors.sourcingCapacity}
                      sx={muiWizardInputStyle}
                    />
                  </div>
                </div>

                {/* 3. Sourcing Preferences */}
                <div className="flex flex-col gap-3">
                  <div className="border-b border-gray-150 pb-1.5">
                    <h3 className="text-xs font-bold text-[#1aa35a] uppercase tracking-wider">3. Target Sourcing Mandis</h3>
                  </div>

                  <div className="flex gap-2 items-end">
                    <div className="flex-[1.5] flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mandi Location</label>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="e.g. Indore Mandi"
                        value={newMandiName}
                        onChange={(e) => setNewMandiName(e.target.value)}
                        sx={muiWizardInputStyle}
                      />
                    </div>

                    <div className="flex-[1] flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
                      <FormControl fullWidth size="small" sx={muiWizardInputStyle}>
                        <Select
                          value={newMandiState}
                          onChange={(e) => setNewMandiState(e.target.value)}
                          displayEmpty
                          renderValue={(val) => val || <span className="text-gray-400">State</span>}
                        >
                          <MenuItem value="Madhya Pradesh">Madhya Pradesh</MenuItem>
                          <MenuItem value="Punjab">Punjab</MenuItem>
                          <MenuItem value="Rajasthan">Rajasthan</MenuItem>
                          <MenuItem value="Uttar Pradesh">Uttar Pradesh</MenuItem>
                          <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                          <MenuItem value="Andhra Pradesh">Andhra Pradesh</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    <Button 
                      type="button"
                      onClick={handleAddMandi} 
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

                  {errors.mandi && <p className="text-red-500 text-xs -mt-2">{errors.mandi}</p>}
                  {errors.mandis && <p className="text-red-500 text-xs -mt-2">{errors.mandis}</p>}

                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-gray-200 bg-gray-50 min-h-[50px] items-center">
                      {form.mandis.length > 0 ? (
                        form.mandis.map((mandi, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#1aa35a] bg-emerald-50 border border-emerald-100">
                            📍 {mandi.name} ({mandi.state})
                            <button type="button" onClick={() => handleRemoveMandi(i)} className="text-[#1aa35a] hover:text-red-500 font-bold ml-1 cursor-pointer">
                              &times;
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-gray-400 mx-auto">
                          Add target sourcing mandis above. (At least 1 required)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Financial & Billing Details */}
                <div className="flex flex-col gap-3">
                  <div className="border-b border-gray-150 pb-1.5">
                    <h3 className="text-xs font-bold text-[#1aa35a] uppercase tracking-wider">4. Financial & Billing</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="accountNumber">Corporate Bank Account</label>
                      <TextField
                        fullWidth
                        size="small"
                        type="password"
                        id="accountNumber"
                        name="accountNumber"
                        placeholder="e.g. 918047582031"
                        value={form.accountNumber}
                        onChange={handleChange}
                        error={!!errors.accountNumber}
                        helperText={errors.accountNumber}
                        sx={muiWizardInputStyle}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="ifsc">Bank IFSC Code</label>
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
                        sx={muiWizardInputStyle}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="billingAddress">Billing Address</label>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={1.5}
                      id="billingAddress"
                      name="billingAddress"
                      placeholder="e.g. 42, Wholesaler Market Road, Mumbai"
                      value={form.billingAddress}
                      onChange={handleChange}
                      error={!!errors.billingAddress}
                      helperText={errors.billingAddress}
                      sx={muiWizardInputStyle}
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button 
                    type="button"
                    onClick={() => setIsLoginMode(true)} 
                    variant="outlined" 
                    fullWidth
                    sx={{ 
                      textTransform: "none", 
                      fontWeight: 600, 
                      borderRadius: "20px", 
                      color: "gray", 
                      borderColor: "gray",
                      "&:hover": { borderColor: "darkgray" }
                    }}
                  >
                    Back to Sign In
                  </Button>
                  <Button 
                    type="submit"
                    variant="contained" 
                    fullWidth
                    sx={{ 
                      textTransform: "none", 
                      fontWeight: 600, 
                      color: "#fff", 
                      borderRadius: "20px", 
                      backgroundColor: "#1aa35a",
                      "&:hover": { backgroundColor: "#15803d" }
                    }}
                  >
                    Register Sourcing Pass
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Welcome Back Panel (Green Triangle Overlay) */}
            <div 
              className="hidden md:flex absolute top-0 right-0 h-full w-[46%] bg-[#1aa35a] z-20 flex-col justify-center text-white"
              style={{ clipPath: "polygon(25% 0, 100% 0, 100% 100%, 0 100%)" }}
            >
              <div className="p-8 sm:p-12 flex flex-col gap-2 items-end text-right">
                <h2 className="text-3xl font-extrabold font-outfit mb-3 tracking-wide">Welcome Back!</h2>
                <p className="text-sm font-medium leading-relaxed opacity-90">Already have a sourcing account?</p>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsLoginMode(true);
                    setLoginSuccess(false);
                  }}
                  className="mt-8 border-2 border-white text-white hover:bg-white hover:text-[#1aa35a] font-bold rounded-full px-8 py-2.5 transition-all duration-300 cursor-pointer text-xs uppercase tracking-wider"
                >
                  Sign In
                </button>
              </div>
            </div>
          </>
        )}

        {/* ==================== REGISTRATION SUCCESS VIEW ==================== */}
        {!isLoginMode && isRegistered && (
          <div className="w-full p-8 sm:p-12 flex flex-col items-center text-center gap-4 py-8 bg-white text-gray-800">
            <div>
              <div className="text-4xl mb-1">🎉</div>
              <h2 className="text-xl font-extrabold font-outfit text-[#1aa35a] mb-1">Registration Successful!</h2>
              <p className="text-xs text-gray-500">Your corporate purchasing account is active.</p>
            </div>

            <div className="w-full transition-all duration-500 [perspective:1000px] max-w-[380px]">
              <div className="w-full bg-gradient-to-br from-[#1aa35a] to-[#0f5230] border border-emerald-500/30 rounded-2xl p-5 text-left relative overflow-hidden shadow-lg">
                <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                  <div className="flex items-center gap-1.5 font-extrabold font-outfit text-white text-xs">
                    <span>🌾</span>
                    <span>Bazar Buyer Pass</span>
                  </div>
                  <span className="text-[8px] font-bold bg-[#f59e0b] text-white p-0.5 px-2 rounded">
                    VERIFIED BUYER
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-8 flex flex-col gap-2 text-[10px]">
                    <div className="flex flex-col">
                      <span className="text-[7px] text-white/60 uppercase font-bold">Company</span>
                      <span className="font-bold text-white truncate">{form.companyName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[7px] text-white/60 uppercase font-bold">Buyer ID</span>
                      <span className="font-bold text-white font-mono text-[9px]">{merchantId}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[7px] text-white/60 uppercase font-bold">Capacity</span>
                      <span className="font-bold text-white">{form.sourcingCapacity} Tons / Month</span>
                    </div>
                  </div>

                  <div className="col-span-4 flex flex-col items-center gap-2 justify-self-center">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-900 to-green-950 border border-white/10 flex items-center justify-center text-2xl shadow-md">
                      🏢
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full justify-center mt-4">
              <Button
                onClick={() => alert("Your corporate Buyer Pass file is downloading...")}
                variant="outlined"
                sx={{ textTransform: "none", fontWeight: 600, borderRadius: "20px", px: 3, py: 0.5, fontSize: "0.8rem", color: "gray", borderColor: "gray" }}
              >
                Download Pass
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
                  px: 3, 
                  py: 0.5, 
                  fontSize: "0.8rem",
                  backgroundColor: "#1aa35a",
                  "&:hover": { backgroundColor: "#15803d" }
                }}
              >
                Go to Catalog
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
