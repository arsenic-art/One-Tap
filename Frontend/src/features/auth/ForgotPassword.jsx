import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Mail, Send, Lock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        "http://localhost:7777/api/user/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setStep(2);
      setTimer(60);
      setCanResend(false);
      setMessage("OTP sent to your email! Check your inbox (and spam folder)");
    } catch (err) {
      setMessage(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setMessage("Please enter full 4-digit OTP");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      setStep(3);
      setMessage("Enter your new password below");
    } catch (err) {
      setMessage("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const otpCode = otp.join("");
      const res = await fetch("http://localhost:7777/api/user/reset-password", {
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

      setMessage("✅ Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setMessage(err.message || "Failed to reset password");
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
    sendOtp({ preventDefault: () => {} });
  };

  const goBack = () => {
    if (step === 1) {
      navigate("/login");
    } else {
      setStep(step - 1);
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
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-600 text-lg">
                  Enter your email to reset password
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <div className="text-6xl mb-4">📧</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Verify OTP
                </h2>
                <p className="text-gray-600">
                  Check your email for 4-digit code sent to <br />
                  <span className="font-semibold text-gray-900">{email}</span>
                </p>
              </>
            )}
            {step === 3 && (
              <>
                <div className="text-6xl mb-4">🔐</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  New Password
                </h2>
                <p className="text-gray-600">Create a strong new password</p>
              </>
            )}
          </div>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`p-4 rounded-2xl mb-6 text-sm flex items-center gap-2 ${
                message.includes("✅") || message.includes("success")
                  ? "bg-green-50 border-2 border-green-200 text-green-800"
                  : "bg-red-50 border-2 border-red-200 text-red-800"
              }`}
            >
              {message.includes("✅") && <CheckCircle size={20} />}
              {message.includes("failed") && (
                <Mail size={20} className="text-red-500" />
              )}
              <span>{message.replace("✅ ", "").replace("failed", "")}</span>
            </div>
          )}

          {/* STEP 1: Email */}
          {step === 1 && (
            <form onSubmit={sendOtp} className="space-y-6">
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-lg focus:ring-4 ring-red-500/20 focus:border-red-500 transition-all shadow-sm ${
                      emailRegex.test(email)
                        ? "border-green-300"
                        : "border-gray-200"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <button
                disabled={!emailRegex.test(email) || loading}
                className={`w-full flex items-center justify-center gap-3 py-5 px-6 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 transform ${
                  emailRegex.test(email) && !loading
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 hover:scale-[1.02]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                Send OTP
              </button>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                  Enter 4-digit OTP from email
                </label>
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-20 h-20 text-center text-3xl font-bold border-3 rounded-2xl focus:ring-4 ring-red-500/30 focus:border-red-500 shadow-lg transition-all ${
                        digit
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Timer/Resend */}
              <div className="text-center py-4">
                {timer > 0 ? (
                  <p className="text-lg">
                    Expires in{" "}
                    <span className="font-mono text-2xl text-red-600">
                      {timer}
                    </span>
                    s
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="text-red-600 hover:text-red-700 font-semibold text-lg px-4 py-2 rounded-xl border border-red-200 hover:bg-red-50 transition-all"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={verifyOtp}
                disabled={otp.some((d) => !d) || loading}
                className={`w-full flex items-center justify-center gap-3 py-5 px-6 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 transform ${
                  otp.every((d) => d) && !loading
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 hover:scale-[1.02]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Mail className="w-5 h-5" />
                )}
                Verify & Continue
              </button>
            </div>
          )}

          {/* STEP 3: New Password */}
          {step === 3 && (
            <form onSubmit={resetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  New Password (min 6 chars + 1 special char)
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-lg focus:ring-4 ring-red-500/20 focus:border-red-500 transition-all shadow-sm ${
                      newPassword.length >= 6
                        ? "border-green-300"
                        : "border-gray-200"
                    }`}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {newPassword.length >= 6
                    ? "✓ Strong password"
                    : "Min 6 chars + special char"}
                </div>
              </div>

              <button
                type="submit"
                disabled={newPassword.length < 6 || loading}
                className={`w-full flex items-center justify-center gap-3 py-5 px-6 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 transform ${
                  newPassword.length >= 6 && !loading
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 hover:scale-[1.02]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                Reset Password
              </button>
            </form>
          )}

          {/* Back Button */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-lg transition-all duration-300 hover:underline"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
