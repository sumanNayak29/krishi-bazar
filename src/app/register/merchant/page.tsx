"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl 
} from "@mui/material";
import { ArrowBackIcon, GoogleIcon } from "@/icons";
import { useSharedGoogleLogin } from "@/hooks/useSharedGoogleLogin";

const FALLBACK_STATES_DATA = [
  {
    state: "Madhya Pradesh",
    districts: ["Indore", "Bhopal", "Gwalior", "Jabalpur", "Ujjain", "Dhar", "Dewas"]
  },
  {
    state: "Punjab",
    districts: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Gurdaspur"]
  },
  {
    state: "Rajasthan",
    districts: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Alwar"]
  },
  {
    state: "Uttar Pradesh",
    districts: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Noida", "Ghaziabad"]
  },
  {
    state: "Maharashtra",
    districts: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur"]
  }
];

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  password: string;
}

const initialFormState: FormState = {
  fullName: "",
  phone: "",
  email: "",
  state: "",
  district: "",
  password: "",
};

export default function MerchantRegistrationPage() {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  
  // Stable random card suffix for React 19 render purity
  const [cardIdSuffix] = useState(() => Math.floor(1000 + Math.random() * 9000));
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Partial<Record<"email" | "password", string>>>({});

  // Google login intermediate completion states
  const [googleUserInfo, setGoogleUserInfo] = useState<{ name: string; email: string; picture?: string } | null>(null);
  const [showGoogleComplete, setShowGoogleComplete] = useState(false);
  const [googleState, setGoogleState] = useState("");
  const [googleDistrict, setGoogleDistrict] = useState("");
  const [googleErrors, setGoogleErrors] = useState<{ state?: string; district?: string }>({});

  const [locationsData, setLocationsData] = useState<{ state: string; districts: string[] }[]>(FALLBACK_STATES_DATA);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json")
      .then((res) => {
        if (!res.ok) throw new Error("API call failed");
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.states)) {
          setLocationsData(data.states);
        }
      })
      .catch(() => {
        // Safe silent fallback to local mock data
      });
  }, []);

  const googleLogin = useSharedGoogleLogin({
    onLoginSuccess: (userInfo) => {
      setGoogleUserInfo(userInfo);
      setShowGoogleComplete(true);
    }
  });

  const handleGoogleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { state?: string; district?: string } = {};
    if (!googleState.trim()) {
      errs.state = "State selection is required.";
    }
    if (googleDistrict.trim().length < 3) {
      errs.district = "District name must be at least 3 characters.";
    }

    setGoogleErrors(errs);
    if (Object.keys(errs).length === 0 && googleUserInfo) {
      setForm((prev) => ({
        ...prev,
        fullName: googleUserInfo.name,
        email: googleUserInfo.email,
        state: googleState,
        district: googleDistrict,
      }));
      setLoginEmail(googleUserInfo.email);
      setLoginSuccess(true);
      setShowGoogleComplete(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any) => {
    const { name, value } = e.target;
    if (name === "state") {
      setForm((prev) => ({ ...prev, state: value, district: "" }));
      setErrors((prev) => ({ ...prev, state: "", district: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
    if (!form.state.trim()) {
      newErrors.state = "State selection is required.";
    }
    if (form.district.trim().length < 3) {
      newErrors.district = "District name must be at least 3 characters.";
    }
    if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
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
              {showGoogleComplete ? (
                <>
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-700 font-outfit mb-1">One More Step</h2>
                    <p className="text-xs text-brand-text-secondary mt-1">
                      Set your region to verify your merchant account.
                    </p>
                  </div>

                  {googleUserInfo && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-150">
                      {googleUserInfo.picture ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={googleUserInfo.picture} alt="Profile" className="w-10 h-10 rounded-full border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-[#1aa35a]">
                          {googleUserInfo.name[0]}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-gray-800 truncate">{googleUserInfo.name}</span>
                        <span className="text-[10px] text-gray-500 truncate">{googleUserInfo.email}</span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleGoogleCompleteSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="googleState">State</label>
                      <FormControl fullWidth size="small" error={!!googleErrors.state} sx={muiWizardInputStyle}>
                        <Select
                          id="googleState"
                          value={googleState}
                          onChange={(e) => {
                            setGoogleState(e.target.value);
                            setGoogleDistrict("");
                            setGoogleErrors((prev) => ({ ...prev, state: "", district: "" }));
                          }}
                          displayEmpty
                          renderValue={(val) => val || <span className="text-gray-400">Select State</span>}
                        >
                          {locationsData.map((item) => (
                            <MenuItem key={item.state} value={item.state}>
                              {item.state}
                            </MenuItem>
                          ))}
                        </Select>
                        {googleErrors.state && <p className="text-red-500 text-[10px] mt-1 font-semibold">{googleErrors.state}</p>}
                      </FormControl>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="googleDistrict">District</label>
                      <FormControl fullWidth size="small" error={!!googleErrors.district} sx={muiWizardInputStyle}>
                        <Select
                          id="googleDistrict"
                          value={googleDistrict}
                          onChange={(e) => {
                            setGoogleDistrict(e.target.value);
                            setGoogleErrors((prev) => ({ ...prev, district: "" }));
                          }}
                          displayEmpty
                          disabled={!googleState}
                          renderValue={(val) => val || <span className="text-gray-400">Select District</span>}
                        >
                          {googleState &&
                            (locationsData.find((item) => item.state === googleState)?.districts || []).map((dist) => (
                              <MenuItem key={dist} value={dist}>
                                {dist}
                              </MenuItem>
                            ))}
                        </Select>
                        {googleErrors.district && <p className="text-red-500 text-[10px] mt-1 font-semibold">{googleErrors.district}</p>}
                      </FormControl>
                    </div>

                    <div className="flex gap-2.5 mt-2">
                      <Button
                        type="button"
                        onClick={() => {
                          setShowGoogleComplete(false);
                          setGoogleUserInfo(null);
                        }}
                        variant="outlined"
                        sx={{
                          flex: 1,
                          textTransform: "none",
                          borderRadius: "9999px",
                          fontWeight: 700,
                          py: 1,
                          borderColor: "gray",
                          color: "gray",
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          flex: 2,
                          textTransform: "none",
                          borderRadius: "9999px",
                          fontWeight: 750,
                          py: 1,
                          backgroundColor: "#1aa35a",
                          color: "#fff",
                          "&:hover": { backgroundColor: "#15803d" },
                        }}
                      >
                        Log In
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <>
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
                        onClick={() => googleLogin()}
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
                </>
              )}
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
                href="/dashboard/merchant" 
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
            <div className="w-full md:w-[54%] p-8 sm:p-12 md:pr-6 md:pl-12 flex flex-col justify-center gap-5 z-10">
              <div>
                <h2 className="text-2xl font-extrabold font-outfit mb-1 text-gray-800">Merchant Registration</h2>
                <p className="text-xs text-gray-500">Provide representative, location, and account details below.</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="fullName">Full Name</label>
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="state">State</label>
                    <FormControl fullWidth size="small" error={!!errors.state} sx={muiWizardInputStyle}>
                      <Select
                        id="state"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        displayEmpty
                        renderValue={(val) => val || <span className="text-gray-400">State</span>}
                      >
                        {locationsData.map((item) => (
                          <MenuItem key={item.state} value={item.state}>
                            {item.state}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </FormControl>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="district">District</label>
                    <FormControl fullWidth size="small" error={!!errors.district} sx={muiWizardInputStyle}>
                      <Select
                        id="district"
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        displayEmpty
                        disabled={!form.state}
                        renderValue={(val) => val || <span className="text-gray-400">District</span>}
                      >
                        {form.state &&
                          (locationsData.find((item) => item.state === form.state)?.districts || []).map((dist) => (
                            <MenuItem key={dist} value={dist}>
                              {dist}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                    </FormControl>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="password">Set Password</label>
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    sx={muiWizardInputStyle}
                  />
                </div>

                <div className="flex gap-4 mt-4">
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
                      <span className="text-[7px] text-white/60 uppercase font-bold">Merchant Name</span>
                      <span className="font-bold text-white truncate">{form.fullName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[7px] text-white/60 uppercase font-bold">Buyer ID</span>
                      <span className="font-bold text-white font-mono text-[9px]">{merchantId}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[7px] text-white/60 uppercase font-bold">Sourcing Region</span>
                      <span className="font-bold text-white text-[9px]">{form.district}, {form.state}</span>
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
                href="/dashboard/merchant"
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
