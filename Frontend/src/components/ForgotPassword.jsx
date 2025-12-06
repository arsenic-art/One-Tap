import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) setCanResend(true);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!isEmailValid) return;

    setStep(2);
    setTimer(60);
    setCanResend(false);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) otpRefs[index + 1].current.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleOtpSubmit = () => {
    if (otp.some((digit) => digit === "")) return;

    // Normally verify OTP here
    console.log("OTP submitted:", otp.join(""));
  };

  const handleResendOtp = () => {
    if (!canResend) return;

    setTimer(60);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    otpRefs[0]?.current?.focus();
  };

  const handleBackToLogin = () => {
    setStep(1);
    setEmail("");
    setOtp(["", "", "", ""]);
    setTimer(0);
    setCanResend(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            {step === 1 ? (
              <>
                <div className="text-5xl mb-4">🔧</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-600">
                  Enter your email address and we'll send you an OTP
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">🔐</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Enter OTP
                </h2>
                <p className="text-gray-600">
                  Enter the 4-digit code sent to <br />
                  <span className="font-medium text-gray-800">{email}</span>
                </p>
              </>
            )}
          </div>

          {/* Step 1: Email Input */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleEmailSubmit(e)}
                    className="w-full px-8 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                    placeholder="abc@onetap.com"
                  />
                </div>
              </div>

              <button
                onClick={handleEmailSubmit}
                disabled={!isEmailValid}
                className={`w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform shadow-lg text-lg flex items-center justify-center ${
                  !isEmailValid
                    ? "opacity-50 cursor-not-allowed transform-none"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send className="w-5 h-5 mr-2" />
                Send OTP
              </button>
            </div>
          )}

          {/* Step 2: OTP Input */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Enter 4-digit OTP
                </label>
                <div className="flex justify-center space-x-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(index, e.target.value.replace(/\D/g, ""))
                      }
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-16 h-16 text-center text-2xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                    />
                  ))}
                </div>
              </div>

              {/* Timer */}
              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-gray-600">
                    Resend OTP in{" "}
                    <span className="font-medium text-red-600">{timer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="text-red-600 hover:text-red-700 font-medium transition-colors duration-300"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={handleOtpSubmit}
                disabled={otp.some((digit) => digit === "")}
                className={`w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform shadow-lg text-lg ${
                  otp.some((d) => d === "")
                    ? "opacity-50 cursor-not-allowed transform-none"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Verify OTP
              </button>
            </div>
          )}

          {/* Back */}
          <div className="mt-8 text-center">
            <button
              onClick={step === 1 ? handleBackToLogin : () => setStep(1)}
              className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {step === 1 ? "Back to Login" : "Change Email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
