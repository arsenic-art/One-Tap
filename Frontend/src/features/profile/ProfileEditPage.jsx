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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { user, isCheckingAuth, checkAuth, loginSuccess } = useAuthStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
  });

  useEffect(() => {
    if (!user && !isCheckingAuth) {
      checkAuth();
    }
  }, [user, isCheckingAuth, checkAuth]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhoneNumber(user.phoneNumber || "");
      setPreviewSrc(user.profileImage || "");
    }
  }, [user]);

  const validateFields = () => {
    const newErrors = {
      firstName: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      profileImage: "",
    };

    const trimmedFirst = firstName.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedFirst) {
      newErrors.firstName = "First name is required.";
    } else if (trimmedFirst.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters.";
    }

    if (!trimmedPhone) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10,15}$/.test(trimmedPhone)) {
      newErrors.phoneNumber = "Phone number must be 10–15 digits.";
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

    const hasError = Object.values(newErrors).some((v) => v);
    return !hasError;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // basic validation on select
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewSrc(reader.result || "");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateFields()) {
      setError("Please fix the highlighted fields.");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName.trim());
    formData.append("lastName", lastName.trim());
    formData.append("phoneNumber", phoneNumber.trim());
    if (password) {
      formData.append("password", password);
    }
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:7777/api/user/profile", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      loginSuccess(data);
      setPreviewSrc(data.profileImage || "");
      setPassword("");
      setConfirmPassword("");
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex items-center text-gray-600">
          <Loader2 className="animate-spin mr-2" size={20} />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
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
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-6">
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
          <UserIcon size={40} className="opacity-90" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          {/* Avatar + basic info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400 text-3xl">
                {previewSrc ? (
                  <img
                    src={previewSrc}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon size={32} />
                )}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{fullName}</p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Mail size={14} className="mr-1" />
                  {user.email}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed for now.
                </p>
              </div>
            </div>
            <p className="flex items-center text-xs text-gray-600">
              <ImageIcon size={14} className="mr-1" />
              Choose an image file to update your avatar.
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm">
              <AlertCircle size={16} className="mr-2" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-xl text-sm">
              <CheckCircle size={16} className="mr-2" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* File input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                JPG/PNG/WEBP recommended. Max size 5 MB.
              </p>
              {fieldErrors.profileImage && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.profileImage}
                </p>
              )}
            </div>

            {/* Name fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border-2 text-sm focus:outline-none ${
                    fieldErrors.firstName
                      ? "border-red-500"
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border-2 text-sm focus:outline-none ${
                    fieldErrors.phoneNumber
                      ? "border-red-500"
                      : "border-gray-200 focus:border-red-500"
                  }`}
                  placeholder="+91XXXXXXXXXX"
                />
              </div>
              {fieldErrors.phoneNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.phoneNumber}
                </p>
              )}
            </div>

            {/* Password change */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  New Password (optional)
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border-2 text-sm focus:outline-none ${
                      fieldErrors.password
                        ? "border-red-500"
                        : "border-gray-200 focus:border-red-500"
                    }`}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.password}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border-2 text-sm focus:outline-none ${
                    fieldErrors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-200 focus:border-red-500"
                  }`}
                  placeholder="Repeat new password"
                />
                {fieldErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300 flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-gray-500 mt-2">
              Changing your password and profile image takes effect immediately.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
