import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/OneTapLogo.png";
const Navbar = ({ isLoggedIn, setIsLoggedIn, isUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-4">
              <Link to="/" className="cursor-pointer">
                <img src={Logo} className="w-12 rounded-full" alt="Logo" />
              </Link>

              <Link
                to="/"
                className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent hover:from-red-700 hover:to-red-600 transition-all duration-300"
              >
                OneTap
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `no-underline px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${
                  isActive
                    ? "text-red-600 font-semibold"
                    : "text-gray-700 hover:text-red-600"
                }`
              }
            >
              Home
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </NavLink>
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                `no-underline px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${
                  isActive
                    ? "text-red-600 font-semibold"
                    : "text-gray-700 hover:text-red-600"
                }`
              }
            >
              Feed
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </NavLink>

            <NavLink
              to="/services"
              className={({ isActive }) =>
                `no-underline px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${
                  isActive
                    ? "text-red-600 font-semibold"
                    : "text-gray-700 hover:text-red-600"
                }`
              }
            >
              Services
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </NavLink>

            <NavLink
              to="/aboutus"
              className={({ isActive }) =>
                `no-underline px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${
                  isActive
                    ? "text-red-600 font-semibold"
                    : "text-gray-700 hover:text-red-600"
                }`
              }
            >
              About Us
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </NavLink>

            <NavLink
              to="/support"
              className={({ isActive }) =>
                `no-underline px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${
                  isActive
                    ? "text-red-600 font-semibold"
                    : "text-gray-700 hover:text-red-600"
                }`
              }
            >
              Support
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </NavLink>
            {/* if Mechanic is Logged in then show Provide Service Page */}
            {isLoggedIn && !isUser && (
              <NavLink
                to="/addmechanic"
                className={({ isActive }) =>
                  `no-underline px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${
                    isActive
                      ? "text-red-600 font-semibold"
                      : "text-gray-700 hover:text-red-600"
                  }`
                }
              >
                Provide Services
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </NavLink>
            )}

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4 ml-6">
              <NavLink
                to="/login"
                className="text-red-600 hover:text-red-700 px-4 py-2 text-sm no-underline font-medium border border-red-600 hover:border-red-700 rounded-full transition-all duration-300 hover:bg-red-50 hover:shadow-md hover:-translate-y-0.5"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="no-underline bg-gradient-to-r from-red-600  to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
              >
                Sign Up
              </NavLink>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 transition-all duration-200"
            >
              <svg
                className={`h-6 w-6 transform transition-transform duration-300 ${
                  menuOpen ? "rotate-90" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
          <NavLink
            to="/"
            className="text-gray-700 hover:text-red-600 hover:bg-red-50 block px-3 py-2 text-base font-medium rounded-md transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/feed"
            className="text-gray-700 hover:text-red-600 hover:bg-red-50 block px-3 py-2 text-base font-medium rounded-md transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Feed
          </NavLink>
          <NavLink
            to="/services"
            className="text-gray-700 hover:text-red-600 hover:bg-red-50 block px-3 py-2  text-base font-medium rounded-md transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Services
          </NavLink>
          <NavLink
            to="/mechanics"
            className="text-gray-700 hover:text-red-600 hover:bg-red-50 block px-3 py-2 text-base font-medium rounded-md transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Mechanics
          </NavLink>
          <NavLink
            to="/support"
            className="text-gray-700 hover:text-red-600 hover:bg-red-50 block px-3 py-2 text-base font-medium rounded-md transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Support
          </NavLink>

          {/* Mobile Auth Buttons */}
          <div className="pt-4 pb-2 space-y-3">
            <NavLink
              to="/login"
              className="w-full text-center text-red-600 hover:text-red-700 block px-4 py-2 text-base font-medium border border-red-600 hover:border-red-700 rounded-full transition-all duration-300 hover:bg-red-50"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="w-full text-center bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white block px-4 py-2 text-base font-medium rounded-full transition-all duration-300 shadow-lg"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
