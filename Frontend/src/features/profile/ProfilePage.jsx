// src/features/profile/ProfilePage.jsx
import { useEffect, useState } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  LogOut,
  Edit2,
  CalendarCheck,
  AlertCircle,
  Loader2,
  Shield,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useMechanicAuthStore } from "../../store/useAuthStore"; // ✅ Add this

const ProfilePage = () => {
  const navigate = useNavigate();
  
  // ✅ Get both auth stores
  const {
    user,
    isLoggedIn: userLoggedIn,
    isCheckingAuth: userCheckingAuth,
    checkAuth: checkUserAuth,
    logout: userLogout,
  } = useAuthStore();
  
  const {
    mechanic,
    isLoggedIn: mechanicLoggedIn,
    isCheckingAuth: mechanicCheckingAuth,
    logout: mechanicLogout,
  } = useMechanicAuthStore();

  const [error, setError] = useState("");

  // ✅ Combined auth state
  const currentUser = mechanic || user;
  const isLoggedIn = mechanicLoggedIn || userLoggedIn;
  const isCheckingAuth = userCheckingAuth || mechanicCheckingAuth;

  useEffect(() => {
    if (isCheckingAuth) return;
    if (!currentUser && !isLoggedIn) {
      checkUserAuth();
    }
  }, [isCheckingAuth, currentUser, isLoggedIn, checkUserAuth]);

  const handleLogout = async () => {
    if (!currentUser) return;
    
    const base =
      currentUser.role === "mechanic"
        ? "http://localhost:7777/api/mechanic/logout"
        : "http://localhost:7777/api/user/logout";

    try {
      await fetch(base, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    } finally {
      // ✅ Logout from both stores
      if (mechanicLoggedIn) mechanicLogout();
      if (userLoggedIn) userLogout();
      navigate("/login");
    }
  };

  const fullName = currentUser
    ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "User"
    : "User";

  const isLoading = isCheckingAuth || (!currentUser && isLoggedIn);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-6">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
            <p className="text-sm opacity-90">
              {currentUser?.role === "mechanic"
                ? "Manage your mechanic account and job details."
                : "Manage your account, bookings, and personal details."}
            </p>
          </div>
          <UserIcon size={40} className="opacity-90" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex items-center justify-center py-12 text-gray-600">
            <Loader2 className="animate-spin mr-2" size={20} />
            <span>Loading your profile...</span>
          </div>
        )}

        {!isLoading && !currentUser && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />
            <p className="text-lg font-semibold text-gray-800 mb-1">
              You are not logged in
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Please log in to view and manage your profile.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300"
            >
              Go to Login
            </button>
          </div>
        )}

        {!isLoading && currentUser && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left panel */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-3xl shadow-2xl p-5 flex flex-col h-full">
                {/* Avatar */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold mb-3 overflow-hidden">
                    {currentUser.profileImage ? (
                      <img
                        src={currentUser.profileImage}
                        alt={fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      fullName.charAt(0).toUpperCase()
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-gray-900">
                    {fullName}
                  </h2>
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-[11px] text-gray-700">
                    <Shield size={10} />
                    <span>
                      {currentUser.role === "mechanic" ? "Mechanic" : "User"}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm mb-5">
                  <div className="flex items-center text-gray-700">
                    <Mail size={16} className="mr-2 text-gray-500" />
                    <span className="break-all">{currentUser.email}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone size={16} className="mr-2 text-gray-500" />
                    <span>{currentUser.phoneNumber}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-auto space-y-2">
                  <button
                    type="button"
                    onClick={() => navigate("/profile/edit")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-all duration-200"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>

                  {/* Show "Manage Addresses" only for users (not mechanics) */}
                  {currentUser.role !== "mechanic" && (
                    <button
                      type="button"
                      onClick={() => navigate("/addresses")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-all duration-200"
                    >
                      <MapPin size={16} />
                      Manage Addresses
                    </button>
                  )}

                  {currentUser.role === "mechanic" ? (
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-sm font-semibold text-white hover:from-red-700 hover:to-orange-600 transition-all duration-200"
                    >
                      <CalendarCheck size={16} />
                      Go to Dashboard
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate("/services")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-sm font-semibold text-white hover:from-red-700 hover:to-orange-600 transition-all duration-200"
                    >
                      <CalendarCheck size={16} />
                      Book a Service
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 border-red-600 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-all duration-200"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white rounded-3xl shadow-md p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Account overview
                </h3>
                <p className="text-sm text-gray-600">
                  {currentUser.role === "mechanic"
                    ? "From here you can manage your mechanic profile and see your jobs in the dashboard."
                    : "You can manage your upcoming bookings, service requests, saved addresses and vehicles here."}
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-md p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Quick links
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {currentUser.role === "mechanic" ? (
                    <>
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      >
                        Open mechanic dashboard
                      </button>
                      <button
                        onClick={() => navigate("/browse")}
                        className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      >
                        Browse mechanics
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate("/addresses")}
                        className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      >
                        Manage addresses
                      </button>
                      <button
                        onClick={() => navigate("/bookings")}
                        className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      >
                        View service requests
                      </button>
                      <button
                        onClick={() => navigate("/browse")}
                        className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      >
                        Browse mechanics
                      </button>
                    </>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-2xl text-sm flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
