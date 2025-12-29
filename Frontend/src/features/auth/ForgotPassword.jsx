import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Send,
  Lock,
  CheckCircle,
  AlertCircle,
  Wrench,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_BASE_LINK || "http://localhost:7777") + "/api";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("user");  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      showMessage("Please enter a valid email address", "error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (role === "mechanic") {
        const res = await fetch(`${API_BASE}/mechanic/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setStep("mechanic-success"); 
        showMessage("Reset link sent! Check your inbox.", "success");
      } 
      else {
        const res = await fetch(`${API_BASE}/user/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setStep(2);
        setTimer(60);
        setCanResend(false);
        showMessage("OTP sent to your email! Check your inbox.", "success");
      }
    } catch (err) {
      showMessage(err.message || "Failed to process request.", "error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      showMessage("Please enter the complete 4-digit OTP", "error");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      setStep(3);
      showMessage("OTP verified! Now set your new password.", "success");
    } catch (err) {
      showMessage("Invalid OTP. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      showMessage("Password must be at least 6 characters long", "error");
      return;
    }

    if (!specialCharRegex.test(newPassword)) {
      showMessage("Password must contain at least one special character", "error");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const otpCode = otp.join("");
      const res = await fetch(`${API_BASE}/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: otpCode,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showMessage("Password reset successful! Redirecting...", "success");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      showMessage(err.message || "Failed to reset password.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value) || value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
    if (e.key === "Enter" && otp.every((d) => d)) {
      verifyOtp();
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setOtp(["", "", "", ""]);
    otpRefs[0].current?.focus();
    handleRequest({ preventDefault: () => {} });
  };

  const goBack = () => {
    if (step === 1 || step === "mechanic-success") {
      navigate("/login");
    } else {
      setStep(step - 1);
      setMessage("");
    }
  };

  const isPasswordValid = newPassword.length >= 6 && specialCharRegex.test(newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            {step === 1 && (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={40} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-600">
                  Select your role and enter email to reset
                </p>
              </>
            )}
            {step === "mechanic-success" && (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={40} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Check Your Email
                </h2>
                <p className="text-gray-600">
                  We've sent a password reset link to <br/>
                  <span className="font-semibold">{email}</span>
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={40} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Verify OTP
                </h2>
                <p className="text-gray-600">
                  Enter the code sent to <span className="font-semibold text-gray-900">{email}</span>
                </p>
              </>
            )}
            {step === 3 && (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Set New Password
                </h2>
              </>
            )}
          </div>

          {/* Messages */}
          {message && (
            <div className={`p-4 rounded-2xl mb-6 text-sm flex items-center gap-3 border-2 ${
              messageType === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
            }`}>
              {messageType === "success" ? <CheckCircle size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
              <span>{message}</span>
            </div>
          )}

          {/* STEP 1: Email & Role Selection */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Role Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                    role === "user" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <User size={16} /> User
                </button>
                <button
                  type="button"
                  onClick={() => setRole("mechanic")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                    role === "mechanic" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Wrench size={16} /> Mechanic
                </button>
              </div>

              <form onSubmit={handleRequest} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 ring-red-500/20 transition-all ${
                        email && emailRegex.test(email) ? "border-green-400 bg-green-50/30" : "border-gray-200 focus:border-red-500"
                      }`}
                      placeholder={`Enter your ${role} email`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!emailRegex.test(email) || loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {role === "user" ? "Send Verification Code" : "Send Reset Link"}
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Mechanic Success View */}
          {step === "mechanic-success" && (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-6">
                Please check your email inbox and spam folder. Click the link provided in the email to reset your password.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 px-6 rounded-xl font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-all"
              >
                Return to Login
              </button>
            </div>
          )}

          {/* STEP 2: OTP (User Only) */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                  Enter 4-Digit Verification Code
                </label>
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-16 h-16 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-4 ring-blue-500/30 transition-all ${
                        digit ? "border-green-400 bg-green-50 text-green-700" : "border-gray-300 focus:border-blue-500"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-gray-600">
                    Code expires in <span className="font-mono font-bold text-red-600">{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={!canResend}
                    className="text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-xl border-2 border-red-200 hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <button
                onClick={verifyOtp}
                disabled={otp.some((d) => !d) || loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? "Verifying..." : <> <CheckCircle size={18} /> Verify & Continue </>}
              </button>
            </div>
          )}

          {/* STEP 3: New Password (User Only) */}
          {step === 3 && (
            <form onSubmit={resetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 ring-red-500/20 transition-all ${
                      newPassword && isPasswordValid ? "border-green-400 bg-green-50/30" : "border-gray-200 focus:border-red-500"
                    }`}
                    placeholder="Enter new password"
                  />
                </div>
                {/* Requirements */}
                <div className="mt-3 space-y-1">
                  <div className={`flex items-center gap-2 text-xs ${newPassword.length >= 6 ? "text-green-600" : "text-gray-500"}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${newPassword.length >= 6 ? "bg-green-100" : "bg-gray-100"}`}>
                      {newPassword.length >= 6 && <CheckCircle size={12} />}
                    </div>
                    <span>At least 6 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${specialCharRegex.test(newPassword) ? "text-green-600" : "text-gray-500"}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${specialCharRegex.test(newPassword) ? "bg-green-100" : "bg-gray-100"}`}>
                      {specialCharRegex.test(newPassword) && <CheckCircle size={12} />}
                    </div>
                    <span>Contains special character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isPasswordValid || loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? "Resetting..." : <> <CheckCircle size={18} /> Reset Password </>}
              </button>
            </form>
          )}

          {/* Back Button */}
          {step !== "mechanic-success" && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={goBack}
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-all duration-300 py-2 px-4 rounded-xl hover:bg-gray-50"
              >
                <ArrowLeft size={18} />
                {step === 1 ? "Back to Login" : "Go Back"}
              </button>
            </div>
          )}
        </div>

        {step === 1 && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-red-600 hover:text-red-700 font-semibold hover:underline"
            >
              Sign in instead
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;