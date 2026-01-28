import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HiMenu, HiX, HiShoppingCart, HiUser } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import clsx from 'clsx';
import { useScrollDirection } from '../../hooks/useScrollDirection';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [cartCount, _setCartCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // OBJECTIVE 3: Scroll behavior with direction detection
  const { scrollDirection, scrollPosition, isScrolled } = useScrollDirection(80);
  
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Determine if top tier should collapse
  const shouldCollapseTop = !prefersReducedMotion && 
                            scrollDirection === 'down' && 
                            scrollPosition > 100;

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  /**
   * Handle user sign out
   */
  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('[Navbar] Sign out failed:', error);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/academy', label: 'Academy' },
    { path: '/contact', label: 'Contact Us' },
  ];

  return (
    <>
      {/* NAVBAR - Fixed positioning with shadow when scrolled */}
      <nav 
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 bg-white',
          'transition-shadow duration-400 ease-in-out',
          isScrolled && 'shadow-md'
        )}
      >
        {/* TOP TIER - UTILITY BAR (Collapsible on scroll down) */}
        <div 
          className={clsx(
            "relative bg-white overflow-hidden",
            "transition-all duration-400 ease-in-out",
            // Collapse when scrolling down
            shouldCollapseTop 
              ? "h-0 opacity-0" 
              : "h-10 md:h-12 opacity-100"
          )}
        >
          <div className="container-custom px-8 md:px-10 lg:px-12">
            <div className="flex items-center justify-between h-10 md:h-12">
              {/* Left: Empty space for logo */}
              <div className="w-32 md:w-48 lg:w-56" />
              
              {/* Right: Tagline + Kenya Badge */}
              <div className="flex items-center gap-3 md:gap-6 text-sm">
                <span className="hidden md:inline text-gray-600 font-medium">
                  African Poultry Development
                </span>
                <div className="bg-primary-50 px-4 py-1.5 rounded-full">
                  <span className="text-primary-700 font-semibold text-sm">Kenya</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* DIVIDING LINE - Inset from edges */}
          <div 
            className={clsx(
              "absolute bottom-0 left-0 right-0 flex justify-center",
              "transition-opacity duration-400",
              shouldCollapseTop ? "opacity-0" : "opacity-100"
            )}
          >
            <div className="w-[calc(100%-8rem)] md:w-[calc(100%-12rem)] h-px bg-gray-200" />
          </div>
        </div>

        {/* BOTTOM TIER - MAIN NAVIGATION (Always visible) */}
        <div className="relative bg-white border-b border-gray-100">
          <div className="container-custom px-8 md:px-10 lg:px-12">
            <div className="flex items-center justify-between h-15 md:h-16 lg:h-20">
              
              {/* Left: LOGO - OBJECTIVE 2: Perfect fit within navbar */}
              <div className="relative flex items-center">
                <Link 
                  to="/" 
                  onClick={handleLinkClick}
                  aria-label="Mkulima Sharp Home"
                  className="flex items-center"
                >
                  {/* Full Logo - Perfectly fitted */}
                  <img 
                    src="/logo.png" 
                    alt="Mkulima Sharp - Premium Poultry Farming" 
                    className="h-20 md:h-24 lg:h-28 w-auto transition-all duration-300 ease-in-out"
                  />
                </Link>
              </div>

              {/* Center: DESKTOP NAVIGATION - OBJECTIVE 1: Kenchic-exact spacing */}
              <nav className="hidden lg:flex items-center justify-center flex-1 gap-7 xl:gap-8">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      clsx(
                        'px-5 xl:px-6 py-3 rounded-lg font-medium text-base transition-all duration-200',
                        'hover:bg-primary-50 hover:text-primary-700',
                        isActive
                          ? 'text-primary-700 bg-primary-50'
                          : 'text-gray-700'
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              {/* Right: ICONS + CTA BUTTONS + AUTH */}
              <div className="flex items-center gap-5 md:gap-6 lg:gap-7">
                {/* Cart Icon */}
                <Link
                  to="/cart"
                  className="relative touch-target text-gray-700 hover:text-primary-700 transition-colors hidden md:flex"
                  onClick={handleLinkClick}
                >
                  <HiShoppingCart className="w-8 h-8 lg:w-9 lg:h-9" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Authentication Section */}
                {!loading && (
                  <>
                    {isAuthenticated() ? (
                      /* Authenticated User - Avatar with Dropdown */
                      <div className="relative user-menu-container">
                        <button
                          onClick={() => setShowUserMenu(!showUserMenu)}
                          className="flex items-center space-x-2 touch-target focus:outline-none"
                          aria-label="User menu"
                        >
                          <img 
                            src={user?.photoURL || '/default-avatar.png'} 
                            alt={user?.displayName || 'User'}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-primary-600 object-cover"
                            onError={(e) => {
                              e.target.src = 'https://ui-avatars.com/api/?name=' + 
                                encodeURIComponent(user?.displayName || 'User') + 
                                '&background=16a34a&color=fff';
                            }}
                          />
                          {isAdmin() && (
                            <span className="hidden lg:inline-block bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                              Admin
                            </span>
                          )}
                        </button>
                        
                        {/* Dropdown Menu - Desktop */}
                        {showUserMenu && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-50">
                            {/* User Info Header */}
                            <div className="px-4 py-3 border-b border-gray-100">
                              <p className="font-semibold text-gray-900 truncate">
                                {user?.displayName || 'User'}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {user?.email}
                              </p>
                              {user?.role && (
                                <span className="inline-block mt-2 bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-semibold capitalize">
                                  {user.role}
                                </span>
                              )}
                            </div>
                            
                            {/* Menu Items */}
                            <div className="py-1">
                              <Link 
                                to="/dashboard" 
                                onClick={handleLinkClick}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                              >
                                Dashboard
                              </Link>
                              <Link 
                                to="/profile" 
                                onClick={handleLinkClick}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                              >
                                Profile Settings
                              </Link>
                              <Link 
                                to="/orders" 
                                onClick={handleLinkClick}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                              >
                                My Orders
                              </Link>
                              
                              {/* Admin Link */}
                              {isAdmin() && (
                                <>
                                  <hr className="my-1 border-gray-200" />
                                  <Link 
                                    to="/admin" 
                                    onClick={handleLinkClick}
                                    className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 font-semibold transition-colors"
                                  >
                                    Admin Panel
                                  </Link>
                                </>
                              )}
                              
                              {/* Sign Out */}
                              <hr className="my-1 border-gray-200" />
                              <button
                                onClick={handleSignOut}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Sign Out
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Not Authenticated - Login Button */
                      <Link
                        to="/login"
                        className="hidden md:flex px-6 py-3 bg-primary-600 text-white rounded-full 
                                   font-semibold text-sm hover:bg-primary-700 
                                   transition-all duration-200 shadow-md hover:shadow-lg
                                   hover:scale-105"
                        onClick={handleLinkClick}
                      >
                        Login
                      </Link>
                    )}
                  </>
                )}

                {/* OBJECTIVE 4: TWO CTA BUTTONS - Desktop */}
                <div className="hidden lg:flex items-center gap-4">
                  {/* PRIMARY CTA - Order Now */}
                  <Link
                    to="/products"
                    className="px-6 py-3 bg-primary-600 text-white rounded-full 
                               font-semibold text-sm hover:bg-primary-700 
                               transition-all duration-200 shadow-md hover:shadow-lg
                               hover:scale-105"
                    onClick={handleLinkClick}
                  >
                    Order Now
                  </Link>
                  
                  {/* SECONDARY CTA - Start Learning */}
                  <Link
                    to="/academy"
                    className="px-6 py-3 border-2 border-primary-600 text-primary-700 
                               bg-white rounded-full font-medium text-sm 
                               hover:bg-primary-50 transition-all duration-200"
                    onClick={handleLinkClick}
                  >
                    Start Learning
                  </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 text-gray-700 hover:text-primary-700 transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? (
                    <HiX className="w-7 h-7" />
                  ) : (
                    <HiMenu className="w-7 h-7" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* DYNAMIC SPACER - Adjusts based on navbar height */}
      <div 
        className="transition-all duration-400"
        style={{
          height: shouldCollapseTop ? '80px' : '128px'
        }}
      />

      {/* MOBILE MENU OVERLAY */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300',
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* MOBILE MENU PANEL */}
      <div
        className={clsx(
          'fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden',
          'transform transition-transform duration-300 ease-in-out',
          'shadow-2xl overflow-y-auto',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-6">
          {/* Mobile Menu Header with Kenya Badge */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <span className="text-xs text-gray-600 font-medium">
              African Poultry Development
            </span>
            <div className="bg-primary-50 px-3 py-1 rounded-full">
              <span className="text-primary-700 font-semibold text-xs">Kenya</span>
            </div>
          </div>

          {/* Logo + Close Button */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" onClick={handleLinkClick}>
              <img 
                src="/logo.svg" 
                alt="Mkulima Sharp" 
                className="h-16 w-auto"
              />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-700 hover:text-primary-700 transition-colors"
              aria-label="Close menu"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* User Info Section - Mobile */}
          {!loading && isAuthenticated() && (
            <div className="mb-6 p-4 bg-primary-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <img 
                  src={user?.photoURL || '/default-avatar.png'} 
                  alt={user?.displayName || 'User'}
                  className="w-12 h-12 rounded-full border-2 border-primary-600 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://ui-avatars.com/api/?name=' + 
                      encodeURIComponent(user?.displayName || 'User') + 
                      '&background=16a34a&color=fff';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {user?.email}
                  </p>
                  {user?.role && (
                    <span className="inline-block mt-1 bg-primary-600 text-white px-2 py-0.5 rounded text-xs font-semibold capitalize">
                      {user.role}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1 mb-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  clsx(
                    'block px-4 py-3 rounded-lg font-medium text-base transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Action Links */}
          {!loading && (
            <>
              {isAuthenticated() ? (
                /* Authenticated User Links */
                <div className="space-y-3 mb-6 pt-6 border-t border-gray-200">
                  <Link
                    to="/dashboard"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <HiUser className="w-6 h-6" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <HiUser className="w-6 h-6" />
                    <span className="font-medium">Profile Settings</span>
                  </Link>
                  <Link
                    to="/cart"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <HiShoppingCart className="w-6 h-6" />
                    <span className="font-medium">Cart</span>
                    {cartCount > 0 && (
                      <span className="ml-auto bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-4 py-3 text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors font-semibold"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Admin Panel</span>
                    </Link>
                  )}
                </div>
              ) : (
                /* Not Authenticated - Show Cart */
                <div className="space-y-3 mb-6 pt-6 border-t border-gray-200">
                  <Link
                    to="/cart"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <HiShoppingCart className="w-6 h-6" />
                    <span className="font-medium">Cart</span>
                    {cartCount > 0 && (
                      <span className="ml-auto bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              )}
            </>
          )}

          {/* OBJECTIVE 4: TWO CTA BUTTONS - Mobile */}
          <div className="space-y-3">
            {/* PRIMARY - Order Now */}
            <Link
              to="/products"
              onClick={handleLinkClick}
              className="block w-full px-5 py-3.5 bg-primary-600 text-white 
                         text-center rounded-full font-semibold text-base
                         hover:bg-primary-700 transition-colors shadow-md"
            >
              Order Now
            </Link>
            
            {/* SECONDARY - Start Learning */}
            <Link
              to="/academy"
              onClick={handleLinkClick}
              className="block w-full px-5 py-3 border-2 border-primary-600 
                         text-primary-700 text-center rounded-full font-medium
                         text-base hover:bg-primary-50 transition-colors"
            >
              Start Learning
            </Link>

            {/* Login/Logout Button */}
            {!loading && (
              <>
                {isAuthenticated() ? (
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-5 py-3 border-2 border-red-600 
                               text-red-600 text-center rounded-full font-medium
                               text-base hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={handleLinkClick}
                    className="block w-full px-5 py-3 border-2 border-gray-600 
                               text-gray-700 text-center rounded-full font-medium
                               text-base hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2026 Mkulima Sharp. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;