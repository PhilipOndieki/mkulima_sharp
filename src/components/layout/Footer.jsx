import { Link } from 'react-router-dom';
import { 
  
  HiMail, 
  HiPhone, 
  HiLocationMarker 
} from 'react-icons/hi';
import { 
  FaFacebook,
  FaInstagram, 
  FaWhatsapp, 
  FaYoutube 
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    products: [
      { label: 'Day-Old Chicks', path: '/products?category=chicks' },
      { label: 'Poultry Feeds', path: '/products?category=feeds' },
      { label: 'Equipment', path: '/products?category=equipment' },
      { label: 'Supplements', path: '/products?category=supplements' },
    ],
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Services', path: '/services' },
      { label: 'Contact', path: '/contact' },
      { label: 'Help Center', path: '/help' },
    ],
    learning: [
      { label: 'Mkulima Sharp Academy', path: '/academy' },
      { label: 'Business Builder', path: '/business-builder' },
      { label: 'Training Programs', path: '/services#training' },
      { label: 'Success Stories', path: '/about#success-stories' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div>
            <img 
              src="/logo-white.svg" 
              alt="Mkulima Sharp" 
              className="h-10 mb-4"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <h3 
              className="text-white font-display text-xl font-bold mb-4"
              style={{ display: 'none' }}
            >
              Mkulima Sharp
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering Kenyan farmers with quality products, expert training, and reliable support for profitable poultry farming.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/mkulimasharp"
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com/mkulimasharp"
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-6 h-6" />
              </a>
              <a
                href="https://youtube.com/@mkulimasharp"
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Products Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Products
            </h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info & Learning */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Learning
            </h4>
            <ul className="space-y-3 mb-6">
              {footerLinks.learning.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-white font-semibold text-lg mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <HiPhone className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                <a 
                  href="tel:+254700000000"
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                >
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <HiMail className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                <a 
                  href="mailto:info@mkulimasharp.co.ke"
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                >
                  info@mkulimasharp.co.ke
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <HiLocationMarker className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                <span className="text-gray-400">
                  Nairobi, Kenya
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Mkulima Sharp. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-primary-500 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="text-gray-400 hover:text-primary-500 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/shipping-policy"
                className="text-gray-400 hover:text-primary-500 transition-colors"
              >
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
