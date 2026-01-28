import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import AnimatedSection from '../components/common/AnimatedSection';
import { HiShieldCheck, HiLockClosed } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';

/**
 * Login Page Component
 * 
 * Professional, secure login interface with Google OAuth
 * Mobile-first responsive design
 * 
 * Security Features:
 * - Rate limiting feedback
 * - Secure redirect handling
 * - Clear error messaging
 * - Loading states
 * - Terms acceptance
 */
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    signInWithGoogle, 
    isAuthenticated, 
    loading, 
    error, 
    clearError,
    getRemainingAttempts,
    initializing
  } = useAuth();

  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (!initializing && isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, initializing]);

  // Update remaining attempts
  useEffect(() => {
    setRemainingAttempts(getRemainingAttempts());
  }, [getRemainingAttempts]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  /**
   * Handle Google Sign-In
   */
  const handleGoogleSignIn = async () => {
    try {
      // Clear previous errors
      setAuthError(null);
      clearError();
      setIsLoading(true);

      // Check remaining attempts
      const attempts = getRemainingAttempts();
      if (attempts <= 0) {
        setAuthError('Too many attempts. Please wait 15 minutes and try again.');
        return;
      }

      // Perform sign-in
      await signInWithGoogle(rememberMe);

      // Success - navigation will happen via useEffect
      // No need to manually navigate here
      
    } catch (err) {
      console.error('[Login] Google sign-in failed:', err);
      setAuthError(err.message);
      
      // Update remaining attempts
      setRemainingAttempts(getRemainingAttempts());
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
          <div className="ml-3 flex-1">
            <p className="text-sm text-red-700">{errorMessage}</p>
            {remainingAttempts > 0 && remainingAttempts < 3 && (
              <p className="text-xs text-red-600 mt-1">
                {remainingAttempts} {remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining
              </p>
            )}
          </div>
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
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Sign in to your account to continue
          </p>
        </AnimatedSection>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <AnimatedSection animation="fade-up" delay={200}>
          <div className="bg-white py-8 px-4 shadow-card rounded-2xl sm:px-10">
            
            {/* Error Message */}
            {renderError()}

            {/* Google Sign-In Button */}
            <div className="space-y-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleGoogleSignIn}
                disabled={isLoading || loading || remainingAttempts <= 0}
                className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border-2 border-gray-300"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                    <span>Signing in...</span>
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

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Secure authentication
                  </span>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                    disabled={isLoading || loading}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700 cursor-pointer"
                  >
                    Keep me signed in
                  </label>
                </div>
              </div>

              {/* Security Features */}
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <HiShieldCheck className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-primary-900 mb-1">
                      Secure Authentication
                    </h4>
                    <p className="text-xs text-primary-700">
                      Your data is protected with industry-standard encryption and security measures.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <HiLockClosed className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-primary-900 mb-1">
                      Privacy First
                    </h4>
                    <p className="text-xs text-primary-700">
                      We only request essential information and never share your data without consent.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms and Privacy */}
              <div className="text-center">
                <p className="text-xs text-gray-600">
                  By signing in, you agree to our{' '}
                  <Link
                    to="/terms-of-service"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy-policy"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <span className="text-gray-700 font-medium">
                Sign in with Google to create one automatically
              </span>
            </p>
          </div>

          {/* Help Link */}
          <div className="mt-4 text-center">
            <Link
              to="/help"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Need help signing in?
            </Link>
          </div>
        </AnimatedSection>
      </div>

      {/* Trust Indicators */}
      <AnimatedSection animation="fade-up" delay={400}>
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500 mb-4">
            Trusted by over 5,000 farmers across Kenya
          </p>
          <div className="flex justify-center items-center space-x-6 text-gray-400">
            <div className="flex items-center space-x-2">
              <HiShieldCheck className="w-5 h-5" />
              <span className="text-xs">SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <HiLockClosed className="w-5 h-5" />
              <span className="text-xs">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Login;