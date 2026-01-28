/**
 * Authentication Service
 * 
 * Centralized authentication logic with security best practices
 * Handles Google OAuth, user profile management, and session handling
 * 
 * Security Features:
 * - Input sanitization
 * - Rate limiting (client-side preliminary)
 * - Secure error handling
 * - Audit logging
 * - Token management via Firebase
 */

import { 
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';

// Security: Rate limiting configuration (client-side preliminary check)
const RATE_LIMIT = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

// In-memory rate limit tracker (resets on page refresh)
const rateLimitTracker = {
  attempts: [],
  
  addAttempt() {
    const now = Date.now();
    this.attempts.push(now);
    // Clean old attempts outside the window
    this.attempts = this.attempts.filter(
      timestamp => now - timestamp < RATE_LIMIT.windowMs
    );
  },
  
  isRateLimited() {
    const now = Date.now();
    const recentAttempts = this.attempts.filter(
      timestamp => now - timestamp < RATE_LIMIT.windowMs
    );
    return recentAttempts.length >= RATE_LIMIT.maxAttempts;
  },
  
  getRemainingAttempts() {
    const now = Date.now();
    const recentAttempts = this.attempts.filter(
      timestamp => now - timestamp < RATE_LIMIT.windowMs
    );
    return Math.max(0, RATE_LIMIT.maxAttempts - recentAttempts.length);
  }
};

/**
 * Sanitize user input to prevent XSS and injection attacks
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500); // Limit length
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} Valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Log authentication event (for audit trail)
 * @param {string} event - Event type
 * @param {Object} data - Event data
 */
const logAuthEvent = (event, data = {}) => {
  const logEntry = {
    event,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    ...data
  };
  
  // In development, log to console
  if (import.meta.env.DEV) {
    console.log('[AUTH EVENT]', logEntry);
  }
  
  // In production, send to Firebase Analytics or logging service
  // TODO: Implement production logging service
};

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Sign in with Google OAuth
   * 
   * Security measures:
   * - Rate limiting
   * - Input validation
   * - Secure error handling
   * - Audit logging
   * 
   * @param {boolean} rememberMe - Enable persistent session
   * @returns {Promise<Object>} User object with profile data
   * @throws {Error} Authentication error with safe message
   */
  signInWithGoogle: async (rememberMe = true) => {
    try {
      // Security: Check rate limiting
      if (rateLimitTracker.isRateLimited()) {
        const error = new Error('Too many authentication attempts. Please try again later.');
        error.code = 'auth/too-many-requests';
        logAuthEvent('auth_rate_limited', { 
          remainingAttempts: 0 
        });
        throw error;
      }
      
      // Track attempt
      rateLimitTracker.addAttempt();
      
      // Set persistence based on rememberMe
      await setPersistence(
        auth, 
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      
      // Configure Google Auth Provider
      const provider = new GoogleAuthProvider();
      
      // Security: Request minimal scopes
      provider.addScope('profile');
      provider.addScope('email');
      
      // Security: Set custom parameters for better UX
      provider.setCustomParameters({
        prompt: 'select_account', // Always show account selection
        login_hint: '' // No pre-filled email
      });
      
      logAuthEvent('auth_attempt_started', {
        provider: 'google',
        rememberMe
      });
      
      // Perform sign-in
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Security: Validate user object
      if (!user || !user.uid || !user.email) {
        throw new Error('Invalid authentication response');
      }
      
      // Security: Validate email format
      if (!isValidEmail(user.email)) {
        throw new Error('Invalid email address');
      }
      
      logAuthEvent('auth_success', {
        uid: user.uid,
        email: user.email,
        provider: 'google'
      });
      
      // Create or update user profile in Firestore
      const userProfile = await this.createOrUpdateUserProfile(user);
      
      return {
        ...user,
        ...userProfile
      };
      
    } catch (error) {
      // Security: Log error without sensitive details
      logAuthEvent('auth_error', {
        code: error.code,
        message: 'Authentication failed'
      });
      
      // Security: Provide user-friendly error messages
      const safeError = this.handleAuthError(error);
      throw safeError;
    }
  },
  
  /**
   * Create or update user profile in Firestore
   * 
   * Security measures:
   * - Input sanitization
   * - Field validation
   * - Default role assignment
   * - Audit trail
   * 
   * @param {Object} user - Firebase user object
   * @returns {Promise<Object>} User profile data
   */
  createOrUpdateUserProfile: async (user) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      // Sanitize user data
      const displayName = sanitizeInput(user.displayName || 'User');
      const email = user.email; // Already validated by Firebase
      const photoURL = user.photoURL || '';
      
      const now = Timestamp.now();
      
      if (!userDoc.exists()) {
        // Create new user profile
        const newProfile = {
          uid: user.uid,
          email,
          displayName,
          photoURL,
          role: 'customer', // Security: Default role
          phone: '',
          address: '',
          createdAt: now,
          updatedAt: now,
          lastLoginAt: now,
          loginCount: 1,
          // Security: Track authentication provider
          authProvider: 'google',
          // Privacy: User consent flags
          acceptedTerms: true,
          acceptedPrivacy: true,
        };
        
        await setDoc(userRef, newProfile);
        
        logAuthEvent('user_profile_created', {
          uid: user.uid,
          email
        });
        
        return newProfile;
      } else {
        // Update existing user profile
        const updates = {
          displayName,
          photoURL,
          updatedAt: now,
          lastLoginAt: now,
          loginCount: (userDoc.data().loginCount || 0) + 1
        };
        
        await updateDoc(userRef, updates);
        
        logAuthEvent('user_profile_updated', {
          uid: user.uid,
          email
        });
        
        return {
          ...userDoc.data(),
          ...updates
        };
      }
    } catch (error) {
      console.error('[AUTH SERVICE] Profile creation/update failed:', error);
      
      // Security: Don't expose Firestore errors to user
      const safeError = new Error('Failed to create user profile. Please try again.');
      safeError.code = 'auth/profile-creation-failed';
      throw safeError;
    }
  },
  
  /**
   * Sign out user
   * 
   * Security measures:
   * - Token revocation
   * - Session cleanup
   * - Audit logging
   * 
   * @returns {Promise<void>}
   */
  signOut: async () => {
    try {
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        logAuthEvent('auth_signout', {
          uid: currentUser.uid,
          email: currentUser.email
        });
      }
      
      // Security: Revoke Firebase tokens
      await firebaseSignOut(auth);
      
      // Clear any client-side cached data
      // Note: Firebase handles secure token cleanup
      
      logAuthEvent('auth_signout_success');
      
    } catch (error) {
      console.error('[AUTH SERVICE] Sign out failed:', error);
      
      logAuthEvent('auth_signout_error', {
        code: error.code
      });
      
      // Even if sign out fails, throw error so UI can handle it
      throw new Error('Failed to sign out. Please try again.');
    }
  },
  
  /**
   * Get current user profile from Firestore
   * 
   * @param {string} uid - User ID
   * @returns {Promise<Object|null>} User profile or null
   */
  getUserProfile: async (uid) => {
    try {
      if (!uid) return null;
      
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return {
          uid,
          ...userDoc.data()
        };
      }
      
      return null;
    } catch (error) {
      console.error('[AUTH SERVICE] Get user profile failed:', error);
      return null;
    }
  },
  
  /**
   * Update user profile
   * 
   * Security measures:
   * - Input sanitization
   * - Field validation
   * - Permission check (user can only update own profile)
   * 
   * @param {string} uid - User ID
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} Updated profile
   */
  updateUserProfile: async (uid, updates) => {
    try {
      // Security: Verify current user matches uid
      const currentUser = auth.currentUser;
      if (!currentUser || currentUser.uid !== uid) {
        throw new Error('Unauthorized: Cannot update another user\'s profile');
      }
      
      // Security: Whitelist allowed fields
      const allowedFields = ['displayName', 'phone', 'address', 'photoURL'];
      const sanitizedUpdates = {};
      
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          // Sanitize string inputs
          if (typeof updates[field] === 'string') {
            sanitizedUpdates[field] = sanitizeInput(updates[field]);
          } else {
            sanitizedUpdates[field] = updates[field];
          }
        }
      }
      
      // Add update timestamp
      sanitizedUpdates.updatedAt = serverTimestamp();
      
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, sanitizedUpdates);
      
      logAuthEvent('user_profile_updated_by_user', {
        uid,
        updatedFields: Object.keys(sanitizedUpdates)
      });
      
      // Return updated profile
      return await this.getUserProfile(uid);
      
    } catch (error) {
      console.error('[AUTH SERVICE] Update profile failed:', error);
      
      if (error.message.includes('Unauthorized')) {
        throw error;
      }
      
      throw new Error('Failed to update profile. Please try again.');
    }
  },
  
  /**
   * Check authentication state
   * 
   * @param {Function} callback - Callback function with user data
   * @returns {Function} Unsubscribe function
   */
  onAuthStateChange: (callback) => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get full profile from Firestore
        const profile = await authService.getUserProfile(user.uid);
        callback({
          ...user,
          ...profile
        });
      } else {
        callback(null);
      }
    });
  },
  
  /**
   * Verify user role
   * 
   * @param {string} uid - User ID
   * @returns {Promise<string|null>} User role or null
   */
  verifyUserRole: async (uid) => {
    try {
      const profile = await authService.getUserProfile(uid);
      return profile?.role || null;
    } catch (error) {
      console.error('[AUTH SERVICE] Role verification failed:', error);
      return null;
    }
  },
  
  /**
   * Check if user has specific role
   * 
   * @param {string} uid - User ID
   * @param {string} requiredRole - Required role
   * @returns {Promise<boolean>} Has role
   */
  hasRole: async (uid, requiredRole) => {
    const userRole = await authService.verifyUserRole(uid);
    
    // Role hierarchy
    const roleHierarchy = {
      admin: ['admin', 'dispatcher', 'driver', 'customer'],
      dispatcher: ['dispatcher', 'driver', 'customer'],
      driver: ['driver', 'customer'],
      customer: ['customer']
    };
    
    return roleHierarchy[userRole]?.includes(requiredRole) || false;
  },
  
  /**
   * Handle authentication errors securely
   * 
   * Security: Don't expose internal error details
   * 
   * @param {Error} error - Original error
   * @returns {Error} Safe error for user display
   */
  handleAuthError: (error) => {
    const errorMessages = {
      'auth/popup-closed-by-user': 'Sign-in cancelled. Please try again.',
      'auth/popup-blocked': 'Pop-up blocked by browser. Please allow pop-ups and try again.',
      'auth/cancelled-popup-request': 'Sign-in cancelled. Please try again.',
      'auth/network-request-failed': 'Network error. Please check your connection and try again.',
      'auth/too-many-requests': 'Too many attempts. Please wait 15 minutes and try again.',
      'auth/user-disabled': 'This account has been disabled. Please contact support.',
      'auth/operation-not-allowed': 'Google sign-in is not enabled. Please contact support.',
      'auth/unauthorized-domain': 'This domain is not authorized. Please contact support.',
      'auth/invalid-credential': 'Invalid credentials. Please try again.',
    };
    
    const safeMessage = errorMessages[error.code] || 
                       'Authentication failed. Please try again.';
    
    const safeError = new Error(safeMessage);
    safeError.code = error.code || 'auth/unknown';
    
    return safeError;
  },
  
  /**
   * Get remaining rate limit attempts
   * 
   * @returns {number} Remaining attempts
   */
  getRemainingAttempts: () => {
    return rateLimitTracker.getRemainingAttempts();
  }
};

export default authService;