import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { TermsOfService, PrivacyPolicy } from "../../pages/TermsAndPrivacyPage";
import { useAuthStore } from "../../store/useAuthStore";
import { useMechanicAuthStore } from "../../store/useAuthStore";

const API_BASE = import.meta.env.VITE_API_BASE_LINK + "/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

const AuthPage = ({ signUp }) => {
  const [isLogin, setIsLogin] = useState(Boolean(signUp));
  const navigate = useNavigate();

  const userLoginSuccess = useAuthStore((s) => s.loginSuccess);
  const mechanicLoginSuccess = useMechanicAuthStore((s) => s.loginSuccess);

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
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeButton, setActiveButton] = useState("services");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isUser, setIsUser] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: termsAccepted && privacyAccepted,
    }));
  }, [termsAccepted, privacyAccepted]);

  useEffect(() => {
    document.body.style.overflow =
      showTerms || showPrivacy ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [showTerms, showPrivacy]);

  useEffect(() => {
    setIsUser(activeButton !== "mechanic");
  }, [activeButton]);

  useEffect(() => {
    setIsLogin(Boolean(signUp));
    setActiveButton("services");
    setApiError("");
    setApiSuccess("");
    setErrors({});
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      agreeToTerms: false,
      rememberMe: false,
    });
  }, [signUp]);

  const validateField = (name, value) => {
    let error = null;

    switch (name) {
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!EMAIL_REGEX.test(value)) {
          error = "Please enter a valid email address";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        } else if (!SPECIAL_CHAR_REGEX.test(value)) {
          error =
            "Password must contain at least one special character (!@#$...)";
        }
        break;

      case "confirmPassword":
        if (!isLogin) {
          if (!value) {
            error = "Please confirm your password";
          } else if (value !== formData.password) {
            error = "Passwords do not match";
          }
        }
        break;

      case "firstName":
        if (!isLogin && !value.trim()) {
          error = "First name is required";
        }
        break;

      case "phone":
        if (!isLogin) {
          if (!value) {
            error = "Phone number is required";
          } else if (!PHONE_REGEX.test(value)) {
            error = "Please enter a valid 10-digit phone number";
          }
        }
        break;

      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    const error = validateField(name, newValue);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    if (name === "password" && !isLogin && formData.confirmPassword) {
      if (newValue !== formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: null }));
      }
    }

    if (apiError) setApiError("");
    if (apiSuccess) setApiSuccess("");
  };

  useEffect(() => {
    if (!isLogin && formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: null }));
      }
    }
  }, [formData.password, formData.confirmPassword, isLogin]);

  const validateForm = () => {
    const newErrors = {};

    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validateField("password", formData.password);
    if (passwordError) newErrors.password = passwordError;

    if (!isLogin) {
      const fnError = validateField("firstName", formData.firstName);
      if (fnError) newErrors.firstName = fnError;

      const phoneError = validateField("phone", formData.phone);
      if (phoneError) newErrors.phone = phoneError;

      const confirmError = validateField(
        "confirmPassword",
        formData.confirmPassword
      );
      if (confirmError) newErrors.confirmPassword = confirmError;

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    return newErrors;
  };

  const isFormValid = () => {
    if (Object.values(errors).some((err) => err !== null && err !== ""))
      return false;

    if (isLogin) {
      return formData.email.trim() && formData.password;
    }

    return (
      formData.email.trim() &&
      formData.password &&
      formData.confirmPassword &&
      formData.firstName.trim() &&
      formData.phone.trim() &&
      formData.agreeToTerms &&
      formData.password.length >= 6 &&
      SPECIAL_CHAR_REGEX.test(formData.password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (!isFormValid()) return;

    setLoading(true);
    setApiError("");
    setApiSuccess("");

    try {
      const currentBase = isUser ? `${API_BASE}/user` : `${API_BASE}/mechanic`;
      const endpoint = isLogin ? "/login" : "/register";

      const payload = isLogin
        ? {
            email: formData.email.trim(),
            password: formData.password,
            rememberMe: formData.rememberMe,
          }
        : {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            phoneNumber: formData.phone.trim(),
            password: formData.password,
            role: isUser ? "user" : "mechanic",
          };

      const res = await fetch(`${currentBase}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          setApiError("Please fix the errors below");
        } else {
          setApiError(
            data.message || "Authentication failed. Please try again."
          );
        }
        return;
      }

      if (!isLogin) {
        setApiSuccess(
          data.message ||
            "Registration successful! Please check your email to verify your account before logging in."
        );

        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          phone: "",
          agreeToTerms: false,
          rememberMe: false,
        });
        setTermsAccepted(false);
        setPrivacyAccepted(false);
        setErrors({});

        // Auto-switch to login after 3 seconds
        setTimeout(() => {
          setIsLogin(true);
          setApiSuccess("");
        }, 3000);
        return;
      }

      if (data.role === "mechanic") {
        mechanicLoginSuccess(data);
        navigate("/dashboard");
      } else {
        userLoginSuccess(data);
        navigate("/services");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setApiError(
        "Connection failed. Please check your internet and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      {/* Role Toggle Buttons */}
      <div className="flex items-center justify-center p-4">
        <div className="bg-white rounded-full shadow-lg flex p-2 space-x-2 border border-gray-200">
          <button
            onClick={() => {
              setActiveButton("services");
              setApiError("");
              setApiSuccess("");
              setErrors({});
            }}
            className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
              activeButton === "services"
                ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Get Our Services
          </button>
          <button
            onClick={() => {
              setActiveButton("mechanic");
              setApiError("");
              setApiSuccess("");
              setErrors({});
            }}
            className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
              activeButton === "mechanic"
                ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {isLogin ? "Sign in as Mechanic" : "Create Mechanic Account"}
          </button>
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔧</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? "Sign In" : "Create Account"}
            </h2>
            <p className="text-gray-600">
              {isLogin
                ? `Access your OneTap ${
                    isUser ? "account" : "mechanic dashboard"
                  }`
                : `Join OneTap as ${isUser ? "a user" : "a mechanic"}`}
            </p>
          </div>

          {/* Error Message */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3 animate-shake">
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <p className="text-red-700 text-sm font-medium">{apiError}</p>
            </div>
          )}

          {/* Success Message */}
          {apiSuccess && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl flex items-center gap-3">
              <CheckCircle className="text-green-500 shrink-0" size={20} />
              <p className="text-green-700 text-sm font-medium">{apiSuccess}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Tulsidas"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {errors.firstName}
                    </p>
                  )}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Khan"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="abc@onetap.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${
                    errors.phone || errors.phoneNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="6267051524"
                  maxLength={10}
                />
                {(errors.phone || errors.phoneNumber) && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.phone || errors.phoneNumber}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all pr-12 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all pr-12 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <Eye size={20} />
                    ) : (
                      <EyeOff size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Login Options / Terms Acceptance */}
            {isLogin ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            ) : (
              <div className="flex items-start space-x-2">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                />
                <div className="text-sm text-gray-700">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className={`font-medium underline ${
                      termsAccepted ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => setShowPrivacy(true)}
                    className={`font-medium underline ${
                      privacyAccepted ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Privacy Policy
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 text-lg ${
                isFormValid() && !loading
                  ? "bg-gradient-to-r from-red-600 to-orange-500 text-white hover:scale-105 shadow-lg hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Toggle Between Login/Signup */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setApiError("");
                  setApiSuccess("");
                  setErrors({});
                  setFormData({
                    email: "",
                    password: "",
                    confirmPassword: "",
                    firstName: "",
                    lastName: "",
                    phone: "",
                    agreeToTerms: false,
                    rememberMe: false,
                  });
                }}
                className="ml-1 text-red-600 hover:text-red-700 font-semibold"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Terms and Privacy Modals */}
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
    </div>
  );
};

export default AuthPage;
