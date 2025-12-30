import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Send,
  Lock,
  CheckCircle,
  AlertCircle,
  Wrench,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  (import.meta.env.VITE_API_BASE_LINK || "http://localhost:7777") + "/api";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();

  const getEndpoint = (action) => {
    const prefix = role === "mechanic" ? "mechanic" : "user";
    if (action === "forgot") return `${API_BASE}/${prefix}/forgot-password`;
    if (action === "verify") return `${API_BASE}/${prefix}/verify-otp`;
    if (action === "reset") return `${API_BASE}/${prefix}/reset-password`;
    return "";
  };

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

  // Step 1: Request OTP
  const handleRequest = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showMessage("Please enter your email address", "error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(getEndpoint("forgot"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setStep(2);
      setTimer(600); // 10 minutes
      setCanResend(false);
      showMessage(data.message || "OTP sent to your email!", "success");
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 4) {
      showMessage("Please enter the complete 4-digit OTP", "error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(getEndpoint("verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      setStep(3);
      showMessage(
        data.message || "OTP verified! Set your new password.",
        "success"
      );
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const resetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      showMessage("Please enter a new password", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const otpCode = otp.join("");
      const res = await fetch(getEndpoint("reset"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: otpCode,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      showMessage(
        data.message || "Password reset successful! Redirecting...",
        "success"
      );
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      showMessage(err.message, "error");
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
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        otpRefs[index - 1].current?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
    if (e.key === "Enter" && otp.every((d) => d)) {
      verifyOtp();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      otpRefs[3].current?.focus();
    } else {
      showMessage("Please paste a valid 4-digit OTP", "error");
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setOtp(["", "", "", ""]);
    setMessage("");
    otpRefs[0].current?.focus();
    handleRequest({ preventDefault: () => {} });
  };

  const goBack = () => {
    if (step === 1) {
      navigate("/login");
    } else {
      setStep(step - 1);
      setMessage("");
      if (step === 3) {
        setNewPassword("");
        setConfirmPassword("");
      }
    }
  };

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
            {step === 2 && (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={40} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Verify OTP
                </h2>
                <p className="text-gray-600">
                  Enter the code sent to{" "}
                  <span className="font-semibold text-gray-900">{email}</span>
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
            <div
              className={`p-4 rounded-2xl mb-6 text-sm flex items-center gap-3 border-2 ${
                messageType === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle size={20} className="shrink-0" />
              ) : (
                <AlertCircle size={20} className="shrink-0" />
              )}
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
                    role === "user"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <User size={16} /> User
                </button>
                <button
                  type="button"
                  onClick={() => setRole("mechanic")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                    role === "mechanic"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
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
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 ring-red-500/20 transition-all"
                      placeholder={`Enter your ${role} email`}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
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
                      Send Verification Code
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: OTP (For BOTH User and Mechanic) */}
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
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className={`w-16 h-16 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-4 ring-blue-500/30 transition-all ${
                        digit
                          ? "border-green-400 bg-green-50 text-green-700"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-gray-600">
                    Code expires in{" "}
                    <span className="font-mono font-bold text-red-600">
                      {Math.floor(timer / 60)}:
                      {String(timer % 60).padStart(2, "0")}
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={!canResend || loading}
                    className="text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-xl border-2 border-red-200 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <button
                onClick={verifyOtp}
                disabled={otp.some((d) => !d) || loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} /> Verify & Continue
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 3: New Password */}
          {step === 3 && (
            <form onSubmit={resetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 ring-red-500/20 transition-all"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 ring-red-500/20 transition-all"
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    required
                  />
                </div>
                {confirmPassword && (
                  <div
                    className={`flex items-center gap-2 text-xs mt-2 ${
                      newPassword === confirmPassword
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {newPassword === confirmPassword ? (
                      <CheckCircle size={12} />
                    ) : (
                      <AlertCircle size={12} />
                    )}
                    <span>
                      {newPassword === confirmPassword
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword ||
                  loading
                }
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} /> Reset Password
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back Button */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={goBack}
              className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-all duration-300 py-2 px-4 rounded-xl hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
              {step === 1 ? "Back to Login" : "Go Back"}
            </button>
          </div>
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
