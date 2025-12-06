import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { TermsOfService, PrivacyPolicy } from "../pages/TermsAndPrivacyPage";

const AuthPage = ({ signUp }) => {
  const [isLogin, setIsLogin] = useState(signUp);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    agreeToTerms: false,
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeButton, setActiveButton] = useState("services");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isMechanic, setIsMechanic] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (termsAccepted && privacyAccepted) {
      setFormData((prev) => ({ ...prev, agreeToTerms: true }));
    }
  }, [termsAccepted, privacyAccepted]);

  useEffect(() => {
    if (formData.agreeToTerms === false) {
      setTermsAccepted(false);
      setPrivacyAccepted(false);
    }
  }, [formData.agreeToTerms]);

  useEffect(() => {
    if (showTerms || showPrivacy) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showTerms, showPrivacy]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowTerms(false);
        setShowPrivacy(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
    if (buttonType === "mechanic") {
      setIsUser(false);
      setIsMechanic(true);
    } else {
      setIsUser(true);
      setIsMechanic(false);
    }
  };

  useEffect(() => {
    setIsLogin(signUp);
    setActiveButton("services");
  }, [signUp]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  useEffect(() => {
    const validate = () => {
      const newErrors = {};
      if (
        !isLogin &&
        formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
      ) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
      if (!isLogin && formData.phone && !/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid 10-digit phone number.";
      }
      setErrors(newErrors);
    };
    validate();
  }, [formData.password, formData.confirmPassword, formData.phone, isLogin]);

  const isFormValid = () => {
    const hasErrors = Object.values(errors).some((error) => error !== null);
    if (hasErrors) return false;

    if (isLogin) {
      return formData.email.trim() !== "" && formData.password.trim() !== "";
    } else {
      return (
        formData.email.trim() !== "" &&
        formData.password.trim() !== "" &&
        formData.confirmPassword.trim() !== "" &&
        formData.firstName.trim() !== "" &&
        formData.phone.trim() !== "" &&
        formData.agreeToTerms
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      console.error("Submission failed: Form is invalid.");
      return;
    }

    //Check if its user or mechanic
    

    if (isLogin) {
      console.log("Login attempt:", formData);
    } else {
      console.log("Signup attempt:", formData);
    }
  };

  return (
    <>
      <Navbar isUser={isUser} isLoggedIn={isLoggedIn}/>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
        <div className="flex items-center justify-center p-4">
          <div className="bg-white rounded-full shadow-lg flex p-2 space-x-2 border border-gray-200">
            <button
              onClick={() => handleButtonClick("services")}
              className={`
                px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out
                ${
                  activeButton === "services"
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md"
                    : "bg-transparent text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              Get Our Services
            </button>
            <button
              onClick={() => handleButtonClick("mechanic")}
              className={`
                px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out
                ${
                  activeButton === "mechanic"
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md"
                    : "bg-transparent text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              Join as Mechanic
            </button>
          </div>
        </div>
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🔧</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? "Sign In" : "Create Account"}
              </h2>
              <p className="text-gray-600">
                {isLogin ? "Access your OneTap account" : "Join the revolution"}
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                      placeholder="Tulsidas"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                      placeholder="Khan"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  placeholder="abc@onetap.com"
                  required
                />
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 ${
                      errors.phone
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-red-500"
                    }`}
                    placeholder="ex: 6267051524"
                    required
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 pr-12"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 pr-12 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-red-500"
                      }`}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="rounded size-4 border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Remember me
                    </label>
                  </div>
                  <button
                    onClick={() => navigate("/forgot-password")}
                    type="button"
                    className="text-sm cursor-pointer text-red-600 hover:text-red-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              {!isLogin && (
                <div className="flex items-start space-x-2">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="rounded size-4 border-gray-300 text-red-600 focus:ring-red-500 mt-1"
                  />
                  <div>
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm text-gray-700"
                    >
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={() => setShowTerms(true)}
                        className={`font-medium underline ${
                          termsAccepted
                            ? "text-green-600"
                            : "text-red-600 hover:text-red-700"
                        }`}
                      >
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        onClick={() => setShowPrivacy(true)}
                        className={`font-medium underline ${
                          privacyAccepted
                            ? "text-green-600"
                            : "text-red-600 hover:text-red-700"
                        }`}
                      >
                        Privacy Policy
                      </button>
                    </label>
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 text-lg ${
                  isFormValid()
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 transform hover:scale-105 shadow-lg cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 text-red-600 hover:text-red-700 font-semibold"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <TermsOfService
        showTerms={showTerms}
        setShowTerms={setShowTerms}
        setTermsAccepted={setTermsAccepted}
      />
      <PrivacyPolicy
        showPrivacy={showPrivacy}
        setShowPrivacy={setShowPrivacy}
        setPrivacyAccepted={setPrivacyAccepted}
      />
    </>
  );
};

export default AuthPage;
