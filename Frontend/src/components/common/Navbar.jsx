import React, { useState, useCallback, useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/OneTapLogo.png";
import { getRandomAvatar } from "../../utils/getAvatar";
import { useAuthStore } from "../../store/useAuthStore";

const navLinkClass = (isActive) =>
  `no-underline px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${
    isActive ? "text-red-600 font-semibold" : "text-gray-700 hover:text-red-600"
  }`;

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isMechanic = user?.role === "mechanic";

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
    setMenuOpen(false);
  }, [logout, navigate]);

  const resolvedAvatar = useMemo(() => {
    const nameToUse = user?.firstName || user?.name || "Account";

    if (user?.profileImage) return user.profileImage;
    if (user?.avatarUrl) return user.avatarUrl;

    return getRandomAvatar(nameToUse);
  }, [user]);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 1. LOGO SECTION */}
          <div className="flex items-center gap-4">
            <Link to="/" onClick={closeMenu}>
              <img src={Logo} className="w-12 rounded-full" alt="OneTap Logo" />
            </Link>
            <Link
              to="/"
              onClick={closeMenu}
              className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent transition-all duration-300"
            >
              OneTap
            </Link>
          </div>

          {/* 2. DESKTOP NAVIGATION (Dynamic based on Role) */}
          <div className="hidden md:flex items-center space-x-2">
            {/* --- CASE 1: NOT LOGGED IN --- */}
            {!isLoggedIn && (
              <>
                <NavLink
                  end
                  to="/"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  Home
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </NavLink>
                <NavLink
                  to="/aboutus"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  About Us
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </NavLink>
                <NavLink
                  to="/support"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  Support
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </NavLink>
              </>
            )}

            {/* --- CASE 2: LOGGED IN AS USER --- */}
            {isLoggedIn && !isMechanic && (
              <>
                <NavLink
                  to="/browse"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  Browse
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </NavLink>
                <NavLink
                  to="/services"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  Book Service
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </NavLink>
                <NavLink
                  to="/bookings"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  Bookings
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </NavLink>
              </>
            )}

            {/* --- CASE 3: LOGGED IN AS MECHANIC --- */}
            {isLoggedIn && isMechanic && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  Dashboard
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </NavLink>
                <NavLink
                  to="/edit-service"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  Edit Service
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </NavLink>
                <NavLink
                  to="/browse"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  Browse
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </NavLink>
                <NavLink
                  to="/support"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  Support
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </NavLink>
              </>
            )}

            {/* 3. AUTH SECTION */}
            <div className="flex items-center space-x-4 ml-6 border-l pl-6 border-gray-100">
              {!isLoggedIn ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={closeMenu}
                    className="text-red-600 px-4 py-2 text-sm font-medium border border-red-600 rounded-full transition-all duration-300 hover:bg-red-50"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={closeMenu}
                    className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Sign Up
                  </NavLink>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-all duration-300"
                  >
                    <img
                      src={resolvedAvatar}
                      alt="avatar"
                      className="w-7 h-7 rounded-full object-cover border border-white shadow-sm"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {user?.firstName || "Profile"}
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-gray-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 4. MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-red-600 transition"
            >
              <svg
                className={`h-6 w-6 transition-transform ${
                  menuOpen ? "rotate-90" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeWidth={2}
                    strokeLinecap="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeWidth={2}
                    strokeLinecap="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 5. MOBILE MENU PANEL */}
      <div
        className={`md:hidden transition-all duration-300 ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden bg-white border-t`}
      >
        <div className="px-4 py-6 space-y-3">
          {!isLoggedIn ? (
            <>
              <NavLink
                to="/"
                onClick={closeMenu}
                className="block py-2 text-gray-700 font-medium"
              >
                Home
              </NavLink>
              <NavLink
                to="/aboutus"
                onClick={closeMenu}
                className="block py-2 text-gray-700 font-medium"
              >
                About Us
              </NavLink>
              <NavLink
                to="/support"
                onClick={closeMenu}
                className="block py-2 text-gray-700 font-medium"
              >
                Support
              </NavLink>
              <div className="pt-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    navigate("/login");
                    closeMenu();
                  }}
                  className="w-full border border-red-600 text-red-600 rounded-full py-2 font-semibold"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    closeMenu();
                  }}
                  className="w-full bg-red-600 text-white rounded-full py-2 font-semibold"
                >
                  Sign Up
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Mechanic Mobile Links */}
              {isMechanic ? (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={closeMenu}
                    className="block py-2 text-gray-700 font-medium"
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/edit-service"
                    onClick={closeMenu}
                    className="block py-2 text-gray-700 font-medium"
                  >
                    Edit Service
                  </NavLink>
                  <NavLink
                    to="/browse"
                    onClick={closeMenu}
                    className="block py-2 text-gray-700 font-medium"
                  >
                    Browse
                  </NavLink>
                  <NavLink
                    to="/support"
                    onClick={closeMenu}
                    className="block py-2 text-gray-700 font-medium"
                  >
                    Support
                  </NavLink>
                </>
              ) : (
                /* User Mobile Links */
                <>
                  <NavLink
                    to="/browse"
                    onClick={closeMenu}
                    className="block py-2 text-gray-700 font-medium"
                  >
                    Browse
                  </NavLink>
                  <NavLink
                    to="/services"
                    onClick={closeMenu}
                    className="block py-2 text-gray-700 font-medium"
                  >
                    Book Service
                  </NavLink>
                  <NavLink
                    to="/bookings"
                    onClick={closeMenu}
                    className="block py-2 text-gray-700 font-medium"
                  >
                    Bookings
                  </NavLink>
                </>
              )}
              <NavLink
                to="/profile"
                onClick={closeMenu}
                className="block py-2 text-gray-700 font-medium border-t pt-4"
              >
                My Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full border border-gray-200 rounded-full py-2 mt-4 text-red-600 font-bold"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
