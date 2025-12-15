// src/components/Navbar.jsx
import React, { useState, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/OneTapLogo.png";

/**
 * Navbar
 * Props:
 *  - isLoggedIn (bool)         : whether the user is logged in
 *  - setIsLoggedIn (func)      : optional setter to update login state (used for logout)
 *  - isUser (bool)             : whether the logged-in account is a regular user (not mechanic)
 *  - user (object)             : optional user object { name, avatarUrl } for display
 */
const navLinkClass = (isActive) =>
  `no-underline px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${
    isActive ? "text-red-600 font-semibold" : "text-gray-700 hover:text-red-600"
  }`;

const Navbar = ({ isLoggedIn = false, setIsLoggedIn, isUser = true, user = null }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleAddMechanic = useCallback(
    (e) => {
      if (e && e.preventDefault) e.preventDefault();

      if (!isLoggedIn || isUser) {
        alert("Sign in as Mechanic to access this page.");
        navigate("/login");
      } else {
        navigate("/addmechanic");
      }

      setMenuOpen(false);
    },
    [isLoggedIn, isUser, navigate]
  );

  const closeMenuAndNavigate = useCallback(
    (to) => {
      setMenuOpen(false);
      navigate(to);
    },
    [navigate]
  );

  const handleLogout = useCallback(() => {
    // replace with real logout (API, token removal, store update) when available
    if (typeof setIsLoggedIn === "function") setIsLoggedIn(false);
    // optional: clear user session in store, localStorage, etc.
    navigate("/");
    setMenuOpen(false);
  }, [setIsLoggedIn, navigate]);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-4">
              <Link to="/" className="cursor-pointer" onClick={closeMenu}>
                <img src={Logo} className="w-12 rounded-full" alt="Logo" />
              </Link>

              <Link
                to="/"
                onClick={closeMenu}
                className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent hover:from-red-700 hover:to-red-600 transition-all duration-300"
              >
                OneTap
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink end to="/" className={({ isActive }) => navLinkClass(isActive)}>
              Home
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </NavLink>

            <NavLink to="/services" className={({ isActive }) => navLinkClass(isActive)}>
              Services
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </NavLink>

            <NavLink to="/aboutus" className={({ isActive }) => navLinkClass(isActive)}>
              About Us
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </NavLink>

            <NavLink to="/support" className={({ isActive }) => navLinkClass(isActive)}>
              Support
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </NavLink>

            {/* Join as Mechanic - controlled navigation to avoid alert/navigation race */}
            <NavLink to="/addmechanic" onClick={handleAddMechanic} className={({ isActive }) => navLinkClass(isActive)}>
              Join as Mechanic
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </NavLink>

            {/* Auth area (desktop) */}
            <div className="flex items-center space-x-4 ml-6">
              {!isLoggedIn ? (
                <>
                  <NavLink
                    to="/login"
                    className="text-red-600 hover:text-red-700 px-4 py-2 text-sm no-underline font-medium border border-red-600 hover:border-red-700 rounded-full transition-all duration-300 hover:bg-red-50 hover:shadow-md hover:-translate-y-0.5"
                    onClick={closeMenu}
                  >
                    Login
                  </NavLink>

                  <NavLink
                    to="/signup"
                    className="no-underline bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </NavLink>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      closeMenuAndNavigate("/profile");
                    }}
                    className="flex items-center gap-2 text-gray-700 px-3 py-2 text-sm font-medium rounded-full hover:bg-gray-50 transition"
                  >
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                      </div>
                    )}
                    <span>{user?.name ?? "Account"}</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="text-sm px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 transition-all duration-200"
            >
              <svg className={`h-6 w-6 transform transition-transform duration-300 ${menuOpen ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
          <NavLink to="/" end className="text-gray-700 hover:text-red-600 hover:bg-red-50 block px-3 py-2 text-base font-medium rounded-md transition-all duration-200" onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/services" className="text-gray-700 hover:text-red-600 hover:bg-red-50 block px-3 py-2 text-base font-medium rounded-md transition-all duration-200" onClick={closeMenu}>
            Services
          </NavLink>

          <NavLink to="/aboutus" className="text-gray-700 hover:text-red-600 hover:bg-red-50 block px-3 py-2 text-base font-medium rounded-md transition-all duration-200" onClick={closeMenu}>
            About Us
          </NavLink>

          <NavLink to="/support" className="text-gray-700 hover:text-red-600 hover:bg-red-50 block px-3 py-2 text-base font-medium rounded-md transition-all duration-200" onClick={closeMenu}>
            Support
          </NavLink>

          {/* Mobile Join as Mechanic - same handler */}
          <a href="/addmechanic" onClick={handleAddMechanic} className="text-gray-700 hover:text-red-600 hover:bg-red-50 block px-3 py-2 text-base font-medium rounded-md transition-all duration-200">
            Join as Mechanic
          </a>

          {/* Mobile Auth Buttons */}
          <div className="pt-4 pb-2 space-y-3">
            {!isLoggedIn ? (
              <>
                <button onClick={() => closeMenuAndNavigate("/login")} className="w-full text-center text-red-600 hover:text-red-700 block px-4 py-2 text-base font-medium border border-red-600 hover:border-red-700 rounded-full transition-all duration-300 hover:bg-red-50">
                  Login
                </button>
                <button onClick={() => closeMenuAndNavigate("/signup")} className="w-full text-center bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white block px-4 py-2 text-base font-medium rounded-full transition-all duration-300 shadow-lg">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-4 py-2 text-base font-medium rounded-md hover:bg-gray-50 transition"
                >
                  Account
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                  }}
                  className="w-full text-center px-4 py-2 text-base font-medium rounded-full border border-gray-200 hover:bg-gray-50 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
