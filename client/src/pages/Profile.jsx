import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '../components/common/AnimatedSection';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { HiCamera, HiUser, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

/**
 * Profile Page Component
 * 
 * User profile management with edit functionality
 * Mobile-first responsive design
 * 
 * Security Features:
 * - Input validation and sanitization
 * - Update confirmation
 * - Error handling
 */
const Profile = () => {
  const { user, updateUserProfile, signOut, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    address: ''
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages
    setError(null);
    setSuccess(false);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      setSuccess(false);
      setIsSaving(true);

      // Validate inputs
      if (formData.displayName.trim().length < 2) {
        throw new Error('Display name must be at least 2 characters');
      }

      if (formData.phone && !/^[0-9+\s()-]{10,20}$/.test(formData.phone)) {
        throw new Error('Please enter a valid phone number');
      }

      // Update profile
      await updateUserProfile({
        displayName: formData.displayName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim()
      });

      // Refresh user data
      await refreshUser();

      setSuccess(true);
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error('[Profile] Update failed:', err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Cancel editing
   */
  const handleCancel = () => {
    // Reset form to original user data
    setFormData({
      displayName: user.displayName || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(false);
    setError(null);
    setSuccess(false);
  };

  /**
   * Handle sign out
   */
  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      try {
        await signOut();
        navigate('/');
      } catch (error) {
        console.error('[Profile] Sign out failed:', error);
        setError('Failed to sign out. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container-custom max-w-4xl">
        <AnimatedSection animation="fade-up">
          <div className="mb-6">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your account information and preferences
            </p>
          </div>
        </AnimatedSection>

        {/* Success Message */}
        {success && (
          <AnimatedSection animation="fade-up">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-700 font-medium">
                  Profile updated successfully!
                </p>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Error Message */}
        {error && (
          <AnimatedSection animation="fade-up">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection animation="fade-up" delay={200}>
          <Card>
            {/* Profile Picture Section */}
            <div className="text-center mb-8 pb-8 border-b border-gray-200">
              <div className="relative inline-block mb-4">
                <img
                  src={user?.photoURL || '/default-avatar.png'}
                  alt={user?.displayName || 'User'}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary-100 shadow-lg"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
                {/* TODO: Add photo upload functionality */}
                <button 
                  className="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors shadow-lg"
                  title="Change photo (coming soon)"
                  disabled
                >
                  <HiCamera className="w-5 h-5" />
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user?.displayName || 'User'}
              </h2>
              <p className="text-gray-600 mb-2">{user?.email}</p>
              
              {user?.role && (
                <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                  {user.role}
                </span>
              )}
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Display Name */}
                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <HiUser className="w-5 h-5 mr-2 text-gray-400" />
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    disabled={!isEditing || isSaving}
                    required
                    minLength={2}
                    maxLength={100}
                    className="input-field"
                    placeholder="Your name"
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <HiMail className="w-5 h-5 mr-2 text-gray-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input-field bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <HiPhone className="w-5 h-5 mr-2 text-gray-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing || isSaving}
                    pattern="[0-9+\s()-]{10,20}"
                    maxLength={20}
                    className="input-field"
                    placeholder="+254 700 000 000"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <HiLocationMarker className="w-5 h-5 mr-2 text-gray-400" />
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing || isSaving}
                    rows={3}
                    maxLength={500}
                    className="textarea-field"
                    placeholder="Your delivery address"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  {!isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => setIsEditing(true)}
                        fullWidth
                        className="sm:w-auto"
                      >
                        Edit Profile
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                        fullWidth
                        className="sm:w-auto"
                      >
                        Back to Dashboard
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSaving}
                        loading={isSaving}
                        fullWidth
                        className="sm:w-auto"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                        fullWidth
                        className="sm:w-auto"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </Card>
        </AnimatedSection>

        {/* Account Management */}
        <AnimatedSection animation="fade-up" delay={300}>
          <Card className="mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Account Management
            </h3>
            
            <div className="space-y-4">
              {/* Sign Out */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Sign Out</h4>
                  <p className="text-sm text-gray-600">
                    Sign out from your account on this device
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="whitespace-nowrap ml-4"
                >
                  Sign Out
                </Button>
              </div>

              {/* Delete Account (Future) */}
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Delete Account</h4>
                  <p className="text-sm text-red-700">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled
                  className="whitespace-nowrap ml-4 opacity-50 cursor-not-allowed"
                  title="Contact support to delete account"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </Card>
        </AnimatedSection>

        {/* Account Info */}
        <AnimatedSection animation="fade-up" delay={400}>
          <Card className="mt-6 bg-primary-50 border border-primary-200">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-primary-900 mb-1">
                  Privacy & Security
                </h4>
                <p className="text-sm text-primary-700">
                  Your data is encrypted and secure. We never share your information without your consent.
                  Read our <a href="/privacy-policy" className="underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Profile;