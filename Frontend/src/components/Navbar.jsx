import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const MenuIcon = () => (
  <svg className="pointer-events-none" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12L20 12" className="origin-center transition-all duration-300 group-aria-expanded:rotate-[315deg]" />
    <path d="M4 12H20" className="origin-center transition-all duration-300 group-aria-expanded:rotate-45" />
    <path d="M4 12H20" className="origin-center transition-all duration-300 group-aria-expanded:rotate-[135deg]" />
  </svg>
);

const Logo = () => (
  <div className="flex items-center justify-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width="28" height="28">
      <g clipPath="url(#cs_clip_1_glass)">
        <mask id="cs_mask_1_glass" style={{ maskType: "alpha" }} width="200" height="186" x="0" y="7" maskUnits="userSpaceOnUse">
          <path fill="#fff" d="M150.005 128.863c66.681 38.481-49.997 105.828-49.997 28.861 0 76.967-116.658 9.62-49.997-28.861-66.681 38.481-66.681-96.207 0-57.727-66.681-38.48 49.997-105.827 49.997-28.86 0-76.967 116.657-9.62 49.997 28.86 66.66-38.48 66.66 96.208 0 57.727z"></path>
        </mask>
        <g mask="url(#cs_mask_1_glass)">
          <path fill="#fff" d="M200 0H0v200h200V0z"></path>
          <path fill="url(#paint0_linear_glass)" d="M200 0H0v200h200V0z"></path>
          <g filter="url(#filter0_f_glass)">
            <path fill="#2563EB" d="M130 0H69v113h61V0z"></path>
            <path fill="#38BDF8" fillOpacity="0.35" d="M196 91H82v102h114V91z"></path>
            <path fill="#4F46E5" fillOpacity="0.74" d="M113 80H28v120h85V80z"></path>
          </g>
        </g>
      </g>
      <defs>
        <filter id="filter0_f_glass" width="278" height="310" x="-27" y="-55" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feGaussianBlur result="effect1_foregroundBlur_glass" stdDeviation="27.5"></feGaussianBlur>
        </filter>
        <linearGradient id="paint0_linear_glass" x1="186.5" x2="37" y1="37" y2="186.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" stopOpacity="0.8"></stop>
          <stop offset="1" stopColor="#38BDF8" stopOpacity="0.6"></stop>
        </linearGradient>
        <clipPath id="cs_clip_1_glass">
          <path fill="#fff" d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
    </svg>
    <span className="font-bold text-lg tracking-wider text-gray-900">ATS Tracker</span>
  </div>
);

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = !!user;

  // SMART ROUTING: Admins and Companies don't see the middle links
  let navLinks = [];
  if (!isLoggedIn) {
    navLinks = [{ href: "/", label: "Home" }, { href: "/about", label: "About" }];
  } else if (user?.role === 'USER') {
    navLinks = [
      { href: "/user/dashboard", label: "Home" },
      { href: "/jobs", label: "Jobs" },
      { href: "/checker", label: "ATS Check" },
      { href: "/builder", label: "Resume Builder" },
      { href: "/about", label: "About" }
    ];
  }

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  // Determine Logo Link Target
  let logoLink = "/";
  if (isLoggedIn) {
    logoLink = `/${user?.role?.toLowerCase()}/dashboard`;
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to={logoLink} className="text-gray-900 hover:opacity-80 transition-opacity">
              <Logo />
            </Link>
          </div>

          {/* Desktop Links (Hidden for Admins/Companies) */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navLinks.map((link, index) => (
                <li key={index} className="list-none">
                  <Link to={link.href} className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium relative group transition-all duration-300">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-1 rounded-full border border-gray-200 hover:bg-gray-50 transition shadow-sm">
                  <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=2563EB&color=fff`} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 flex flex-col z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                      <p className="text-[10px] font-bold tracking-wider text-blue-600 uppercase mt-2">{user?.role}</p>
                    </div>
                    {user?.role === 'USER' && (
                      <Link 
                        to="/user/dashboard" 
                        state={{ openEdit: true }} // <--- ADDED STATE HERE
                        onClick={() => setIsProfileOpen(false)} 
                        className="px-4 py-2 mt-1 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FaEdit className="text-gray-400" /> Edit Profile
                      </Link>
                    )}
                    <button onClick={handleLogout} className="px-4 py-2 mb-1 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 w-full text-left transition-colors">
                      <FaSignOutAlt className="text-red-400" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">Log in</Link>
                <Link to="/register" className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 shadow-md transition">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}