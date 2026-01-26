import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiMenu, HiX, HiShoppingCart, HiUser } from 'react-icons/hi';
import { useScrollPosition } from '../../hooks/useScrollReveal';
import { useAuth } from '../../hooks/useAuth';
import clsx from 'clsx';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollPosition } = useScrollPosition();
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0); // TODO: Connect to cart store

  // Calculate dynamic scroll effect (Kenchic-style)
  const scrollOffset = Math.min(scrollPosition * 0.1, 20);
  const isScrolled = scrollPosition > 100;

  // Close mobile menu when route changes
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/academy', label: 'Academy' },
    { path: '/business-builder', label: 'Business Builder' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav 
        className={clsx(
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-500 ease-in-out',
          'bg-white',
          isScrolled ? 'shadow-lg' : 'border-b border-gray-200'
        )}
        style={{
          transform: `translateY(${scrollOffset}px)`
        }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 flex-shrink-0"
              onClick={handleLinkClick}
            >
              <img 
                src="/logo.svg" 
                alt="Mkulima Sharp" 
                className="h-10 md:h-12 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span 
                className="font-display font-bold text-xl md:text-2xl text-primary-700"
                style={{ display: 'none' }}
              >
                Mkulima Sharp
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    clsx(
                      'px-4 py-2 rounded-lg font-medium transition-all duration-200',
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
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative touch-target text-gray-700 hover:text-primary-700 transition-colors"
                onClick={handleLinkClick}
              >
                <HiShoppingCart className="w-6 h-6 md:w-7 md:h-7" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Icon */}
              <Link
                to={user ? '/dashboard' : '/login'}
                className="touch-target text-gray-700 hover:text-primary-700 transition-colors hidden md:flex"
                onClick={handleLinkClick}
              >
                <HiUser className="w-6 h-6 md:w-7 md:h-7" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden touch-target text-gray-700 hover:text-primary-700"
                aria-label="Toggle menu"
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
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={clsx(
          'fixed inset-0 bg-black transition-opacity duration-300 z-40 lg:hidden',
          mobileMenuOpen
            ? 'bg-opacity-50 pointer-events-auto'
            : 'bg-opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={clsx(
            'fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl',
            'transform transition-transform duration-300 ease-in-out overflow-y-auto',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/" onClick={handleLinkClick}>
                <img 
                  src="/logo.svg" 
                  alt="Mkulima Sharp" 
                  className="h-10 w-auto"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="touch-target text-gray-700"
                aria-label="Close menu"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    clsx(
                      'block px-4 py-3 rounded-lg font-medium transition-all duration-200',
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
              
              {/* User Account Link for Mobile */}
              <NavLink
                to={user ? '/dashboard' : '/login'}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  clsx(
                    'block px-4 py-3 rounded-lg font-medium transition-all duration-200',
                    'hover:bg-primary-50 hover:text-primary-700',
                    isActive
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-700'
                  )
                }
              >
                {user ? 'My Account' : 'Sign In'}
              </NavLink>
            </nav>

            {/* Mobile Menu Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Need help? Contact us
              </p>
              <a 
                href="tel:+254700000000" 
                className="block text-primary-700 font-semibold mb-2"
              >
                +254 700 000 000
              </a>
              <a 
                href="mailto:info@mkulimasharp.co.ke" 
                className="block text-primary-700 font-semibold"
              >
                info@mkulimasharp.co.ke
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Navbar;
