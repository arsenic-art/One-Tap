import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Phone,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  Save,
  Lock,
  CheckCircle,
  Trash2,
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useMechanicAuthStore } from "../../store/useAuthStore";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const API_BASE = import.meta.env.VITE_API_BASE_LINK + "/api";

const ProfileEditPage = () => {
  const navigate = useNavigate();

  const {
    user,
    isCheckingAuth: userCheckingAuth,
    checkAuth: checkUserAuth,
    loginSuccess: userLoginSuccess,
  } = useAuthStore();

  const {
    mechanic,
    isCheckingAuth: mechanicCheckingAuth,
    loginSuccess: mechanicLoginSuccess,
  } = useMechanicAuthStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const currentUser = mechanic || user;
  const isCheckingAuth = userCheckingAuth || mechanicCheckingAuth;

  useEffect(() => {
    if (!currentUser && !isCheckingAuth) {
      checkUserAuth();
    }
  }, [currentUser, isCheckingAuth, checkUserAuth]);

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
      setPhoneNumber(currentUser.phoneNumber || "");
      setPreviewSrc(currentUser.profileImage || "");
    }
  }, [currentUser]);

  useEffect(() => {
    return () => {
      if (previewSrc && previewSrc.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  const handleInputChange = (setter, field, value) => {
    setter(value);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setError("");
  };

  const validateFields = () => {
    const newErrors = {};
    const trimmedFirst = firstName.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedFirst) {
      newErrors.firstName = "First name is required.";
    } else if (trimmedFirst.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters.";
    }

    if (!trimmedPhone) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!PHONE_REGEX.test(trimmedPhone)) {
      newErrors.phoneNumber =
        "Invalid phone number (10 digits starting with 6-9).";
    }

    if (password) {
      if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
      } else if (!SPECIAL_CHAR_REGEX.test(password)) {
        newErrors.password =
          "Password must contain at least one special character.";
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    if (selectedFile) {
      if (!ALLOWED_IMAGE_TYPES.includes(selectedFile.type)) {
        newErrors.profileImage = "Only JPG, PNG or WEBP files are allowed.";
      } else if (selectedFile.size > MAX_IMAGE_SIZE) {
        newErrors.profileImage = "Image must be smaller than 5 MB.";
      }
    }

    setFieldErrors(newErrors);
    return !Object.values(newErrors).some((v) => v);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFieldErrors((prev) => ({
        ...prev,
        profileImage: "Only JPG, PNG or WEBP files are allowed.",
      }));
      setSelectedFile(null);
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setFieldErrors((prev) => ({
        ...prev,
        profileImage: "Image must be smaller than 5 MB.",
      }));
      setSelectedFile(null);
      return;
    }

    setFieldErrors((prev) => ({ ...prev, profileImage: "" }));
    setSelectedFile(file);
    setDeleteImage(false);

    const objectUrl = URL.createObjectURL(file);
    setPreviewSrc(objectUrl);
  };

  const handleDeleteImage = () => {
    setSelectedFile(null);
    setPreviewSrc("");
    setDeleteImage(true);
    const fileInput = document.getElementById("profile-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    if (!validateFields()) {
      setError("Please fix the highlighted fields.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName.trim());
    formData.append("lastName", lastName.trim());
    formData.append("phoneNumber", phoneNumber.trim());

    if (password) formData.append("password", password);

    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    } else if (deleteImage) {
      formData.append("deleteProfileImage", "true");
    }

    setIsSubmitting(true);

    try {
      if (!currentUser) throw new Error("User not found in state");

      const base =
        currentUser.role === "mechanic"
          ? `${API_BASE}/mechanic/profile`
          : `${API_BASE}/user/profile`;

      const res = await fetch(base, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
          setError("Please fix the errors highlighted below.");
        } else {
          throw new Error(data.message || "Failed to update profile");
        }
        return;
      }

      if (currentUser.role === "mechanic") {
        mechanicLoginSuccess(data);
      } else {
        userLoginSuccess(data);
      }

      setPreviewSrc(data.profileImage || "");
      setPassword("");
      setConfirmPassword("");
      setSelectedFile(null);
      setDeleteImage(false);
      setSuccess("Profile updated successfully.");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth && !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex items-center text-gray-600">
          <Loader2 className="animate-spin mr-2" size={20} />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-sm w-full">
          <AlertCircle size={32} className="mx-auto mb-3 text-red-500" />
          <p className="text-lg font-semibold text-gray-800 mb-1">
            You are not logged in
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Please log in to edit your profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const fullName =
    `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
    "User";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-6 shadow-md">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300"
              aria-label="Back"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Edit Profile</h1>
              <p className="opacity-90 text-sm">
                Update your personal details and profile picture.
              </p>
            </div>
          </div>
          <UserIcon size={32} className="opacity-80" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-gray-100 shadow-inner overflow-hidden flex items-center justify-center bg-gray-50">
                {previewSrc ? (
                  <img
                    src={previewSrc}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon size={48} className="text-gray-300" />
                )}
              </div>

              <label
                htmlFor="profile-upload"
                className="absolute bottom-1 right-1 bg-red-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-red-700 transition-transform hover:scale-105"
                title="Upload new photo"
              >
                <Camera size={18} />
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="mt-3 flex gap-4 text-sm">
              {previewSrc && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Trash2 size={14} /> Remove Photo
                </button>
              )}
            </div>
            {fieldErrors.profileImage && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {fieldErrors.profileImage}
              </p>
            )}
          </div>

          <div className="border-b border-gray-100 mb-6"></div>

          {error && (
            <div className="mb-6 flex items-center bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-shake">
              <AlertCircle size={18} className="mr-2" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              <CheckCircle size={18} className="mr-2" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                <UserIcon size={18} /> Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) =>
                      handleInputChange(
                        setFirstName,
                        "firstName",
                        e.target.value
                      )
                    }
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors ${
                      fieldErrors.firstName
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-red-500"
                    }`}
                  />
                  {fieldErrors.firstName && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Email cannot be changed.
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) =>
                      handleInputChange(
                        setPhoneNumber,
                        "phoneNumber",
                        e.target.value
                      )
                    }
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors ${
                      fieldErrors.phoneNumber
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-red-500"
                    }`}
                    placeholder="9876543210"
                  />
                </div>
                {fieldErrors.phoneNumber && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            {/* Security Section */}
            <div>
              <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                <Lock size={18} /> Security
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) =>
                        handleInputChange(
                          setPassword,
                          "password",
                          e.target.value
                        )
                      }
                      className={`w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors pr-10 ${
                        fieldErrors.password
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-red-500"
                      }`}
                      placeholder="Leave blank to keep current"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) =>
                        handleInputChange(
                          setConfirmPassword,
                          "confirmPassword",
                          e.target.value
                        )
                      }
                      className={`w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors pr-10 ${
                        fieldErrors.confirmPassword
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-red-500"
                      }`}
                      placeholder="Repeat new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
