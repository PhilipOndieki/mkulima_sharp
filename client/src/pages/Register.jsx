import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import AnimatedSection from '../components/common/AnimatedSection';
import { HiShieldCheck, HiLockClosed, HiEye, HiEyeOff, HiCheckCircle } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';

/**
 * Register Page Component
 * 
 * Professional sign-up interface with:
 * - Email/Password registration
 * - Google OAuth
 * - Password strength indicator
 * - Form validation
 * - Terms acceptance
 * - Mobile-first responsive design
 */
const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    signInWithGoogle,
    signUp,
    isAuthenticated, 
    loading, 
    error, 
    clearError,
    initializing
  } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: ''
  });

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (!initializing && isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, initializing]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  /**
   * Calculate password strength
   */
  const calculatePasswordStrength = (password) => {
    if (!password) {
      return { score: 0, label: '', color: '' };
    }

    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    // Determine label and color
    let label, color;
    if (score <= 2) {
      label = 'Weak';
      color = 'bg-red-500';
    } else if (score <= 4) {
      label = 'Fair';
      color = 'bg-yellow-500';
    } else if (score <= 5) {
      label = 'Good';
      color = 'bg-green-500';
    } else {
      label = 'Strong';
      color = 'bg-green-600';
    }

    return { score, label, color };
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Update password strength if password field
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const errors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Terms acceptance
    if (!acceptTerms) {
      errors.terms = 'You must accept the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle Email/Password Sign-Up
   */
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    
    try {
      // Clear previous errors
      setAuthError(null);
      clearError();

      // Validate form
      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      // Perform sign-up
      await signUp(formData.email, formData.password, formData.fullName);

      // Success - navigation will happen via useEffect
      
    } catch (err) {
      console.error('[Register] Email sign-up failed:', err);
      setAuthError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Google Sign-Up
   */
  const handleGoogleSignUp = async () => {
    try {
      // Clear previous errors
      setAuthError(null);
      clearError();

      // Check terms acceptance
      if (!acceptTerms) {
        setValidationErrors({ terms: 'You must accept the terms and conditions' });
        return;
      }

      setIsLoading(true);

      // Perform sign-up with Google
      await signInWithGoogle(true);

      // Success - navigation will happen via useEffect
      
    } catch (err) {
      console.error('[Register] Google sign-up failed:', err);
      setAuthError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Render error message
   */
  const renderError = () => {
    const errorMessage = authError || error;
    if (!errorMessage) return null;

    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render password strength indicator
   */
  const renderPasswordStrength = () => {
    if (!formData.password) return null;

    const widthPercentage = (passwordStrength.score / 6) * 100;

    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600">Password strength:</span>
          <span className={`text-xs font-medium ${
            passwordStrength.label === 'Weak' ? 'text-red-600' :
            passwordStrength.label === 'Fair' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {passwordStrength.label}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
            style={{ width: `${widthPercentage}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-600 space-y-1">
          <p className="flex items-center">
            <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
              {formData.password.length >= 8 ? '✓' : '○'}
            </span>
            <span className="ml-2">At least 8 characters</span>
          </p>
          <p className="flex items-center">
            <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
              {/[A-Z]/.test(formData.password) ? '✓' : '○'}
            </span>
            <span className="ml-2">Uppercase letter</span>
          </p>
          <p className="flex items-center">
            <span className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
              {/[a-z]/.test(formData.password) ? '✓' : '○'}
            </span>
            <span className="ml-2">Lowercase letter</span>
          </p>
          <p className="flex items-center">
            <span className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
              {/[0-9]/.test(formData.password) ? '✓' : '○'}
            </span>
            <span className="ml-2">Number</span>
          </p>
        </div>
      </div>
    );
  };

  // Show loading state while checking authentication
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <AnimatedSection animation="fade-up">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo.svg"
              alt="Mkulima Sharp"
              className="h-16 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <h1
              className="text-primary-700 font-display text-3xl font-bold"
              style={{ display: 'none' }}
            >
              Mkulima Sharp
            </h1>
          </div>

          {/* Welcome Message */}
          <h2 className="text-center text-3xl font-display font-bold text-gray-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Join thousands of farmers growing their business
          </p>
        </AnimatedSection>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <AnimatedSection animation="fade-up" delay={200}>
          <div className="bg-white py-8 px-4 shadow-card rounded-2xl sm:px-10">
            
            {/* Error Message */}
            {renderError()}

            {/* Google Sign-Up Button (Priority) */}
            <div className="mb-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleGoogleSignUp}
                disabled={isLoading || loading}
                className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border-2 border-gray-300"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <FcGoogle className="w-6 h-6" />
                    <span className="font-semibold text-gray-700">
                      Continue with Google
                    </span>
                  </>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or sign up with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-5">
              {/* Full Name Input */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={isLoading || loading}
                  className={`appearance-none block w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    validationErrors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
                {validationErrors.fullName && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.fullName}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading || loading}
                  className={`appearance-none block w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading || loading}
                    className={`appearance-none block w-full px-4 py-3 pr-12 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      validationErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    disabled={isLoading || loading}
                  >
                    {showPassword ? (
                      <HiEyeOff className="h-5 w-5" />
                    ) : (
                      <HiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
                )}
                {renderPasswordStrength()}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={isLoading || loading}
                    className={`appearance-none block w-full px-4 py-3 pr-12 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    disabled={isLoading || loading}
                  >
                    {showConfirmPassword ? (
                      <HiEyeOff className="h-5 w-5" />
                    ) : (
                      <HiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.confirmPassword}</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="mt-1 flex items-center text-xs text-green-600">
                    <HiCheckCircle className="w-4 h-4 mr-1" />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div>
                <div className="flex items-start">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      if (validationErrors.terms) {
                        setValidationErrors(prev => ({ ...prev, terms: '' }));
                      }
                    }}
                    className={`h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer ${
                      validationErrors.terms ? 'border-red-500' : ''
                    }`}
                    disabled={isLoading || loading}
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="ml-3 block text-sm text-gray-700 cursor-pointer"
                  >
                    I agree to the{' '}
                    <Link
                      to="/terms-of-service"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                      target="_blank"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      to="/privacy-policy"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {validationErrors.terms && (
                  <p className="mt-1 text-xs text-red-600 ml-7">{validationErrors.terms}</p>
                )}
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isLoading || loading}
                loading={isLoading}
                className="mt-6"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            {/* Benefits Section */}
            <div className="mt-6 bg-primary-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-primary-900 mb-3">
                Join Mkulima Sharp and enjoy:
              </h4>
              <ul className="space-y-2 text-xs text-primary-700">
                <li className="flex items-start">
                  <HiCheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5 mr-2" />
                  <span>Access to quality poultry products at farm-gate prices</span>
                </li>
                <li className="flex items-start">
                  <HiCheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5 mr-2" />
                  <span>Expert farming advice and resources</span>
                </li>
                <li className="flex items-start">
                  <HiCheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5 mr-2" />
                  <span>Secure payments with M-Pesa integration</span>
                </li>
                <li className="flex items-start">
                  <HiCheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5 mr-2" />
                  <span>Track orders and manage your farm business</span>
                </li>
              </ul>
            </div>

            {/* Security Features */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3 mb-3">
                <HiShieldCheck className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Your Data is Protected
                  </h4>
                  <p className="text-xs text-gray-700">
                    We use industry-standard encryption to keep your information safe.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <HiLockClosed className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    No Spam, Ever
                  </h4>
                  <p className="text-xs text-gray-700">
                    We respect your inbox and only send relevant updates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Help Link */}
          <div className="mt-4 text-center">
            <Link
              to="/help"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Need help? Contact support
            </Link>
          </div>
        </AnimatedSection>
      </div>

      {/* Trust Indicators */}
      <AnimatedSection animation="fade-up" delay={400}>
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500 mb-4">
            Join over 5,000 farmers already using Mkulima Sharp
          </p>
          <div className="flex justify-center items-center space-x-6 text-gray-400">
            <div className="flex items-center space-x-2">
              <HiShieldCheck className="w-5 h-5" />
              <span className="text-xs">256-bit SSL</span>
            </div>
            <div className="flex items-center space-x-2">
              <HiLockClosed className="w-5 h-5" />
              <span className="text-xs">Secure Payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <HiCheckCircle className="w-5 h-5" />
              <span className="text-xs">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Register;