import { useState, useEffect, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import authService from '../services/auth.service';

/**
 * Custom hook for Firebase Authentication
 * 
 * Enhanced with Google OAuth, security features, and role-based access control
 * 
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({
              ...firebaseUser,
              ...userDoc.data()
            });
          } else {
            setUser(firebaseUser);
          }
        } catch (err) {
          console.error('[useAuth] Error fetching user data:', err);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Sign in with Google OAuth
   * 
   * @param {boolean} rememberMe - Enable persistent session
   * @returns {Promise<Object>} User object
   */
  const signInWithGoogle = useCallback(async (rememberMe = true) => {
    try {
      setError(null);
      setLoading(true);
      
      const userData = await authService.signInWithGoogle(rememberMe);
      
      // User state will be updated by onAuthStateChanged
      return userData;
    } catch (err) {
      console.error('[useAuth] Google sign-in error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sign in with email and password (existing method)
   * 
   * @param {string} email - Email address
   * @param {string} password - Password
   * @returns {Promise<Object>} User object
   */
  const signIn = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      console.error('[useAuth] Email sign-in error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sign up with email and password (existing method)
   * 
   * @param {string} email - Email address
   * @param {string} password - Password
   * @param {string} displayName - Display name
   * @returns {Promise<Object>} User object
   */
  const signUp = useCallback(async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(result.user, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email,
        displayName,
        role: 'customer',
        phone: '',
        address: '',
        photoURL: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authProvider: 'email',
        acceptedTerms: true,
        acceptedPrivacy: true
      });
      
      return result.user;
    } catch (err) {
      console.error('[useAuth] Sign-up error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sign out user
   * 
   * @returns {Promise<void>}
   */
  const signOut = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      await authService.signOut();
      
      // User state will be updated by onAuthStateChanged
    } catch (err) {
      console.error('[useAuth] Sign-out error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset password (existing method)
   * 
   * @param {string} email - Email address
   * @returns {Promise<void>}
   */
  const resetPassword = useCallback(async (email) => {
    try {
      setError(null);
      setLoading(true);
      
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      console.error('[useAuth] Password reset error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update user profile
   * 
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} Updated user profile
   */
  const updateUserProfile = useCallback(async (updates) => {
    try {
      setError(null);
      setLoading(true);
      
      if (!user?.uid) {
        throw new Error('No authenticated user');
      }
      
      const updatedProfile = await authService.updateUserProfile(user.uid, updates);
      
      // Update local state
      setUser(prev => ({
        ...prev,
        ...updatedProfile
      }));
      
      return updatedProfile;
    } catch (err) {
      console.error('[useAuth] Update profile error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Check if user is authenticated
   * 
   * @returns {boolean} Is authenticated
   */
  const isAuthenticated = useCallback(() => {
    return !!user && !!user.uid;
  }, [user]);

  /**
   * Check if user has specific role
   * 
   * @param {string} role - Required role
   * @returns {boolean} Has role
   */
  const hasRole = useCallback((role) => {
    if (!user?.role) return false;
    
    // Role hierarchy
    const roleHierarchy = {
      admin: ['admin', 'dispatcher', 'driver', 'customer'],
      dispatcher: ['dispatcher', 'driver', 'customer'],
      driver: ['driver', 'customer'],
      customer: ['customer']
    };
    
    return roleHierarchy[user.role]?.includes(role) || false;
  }, [user]);

  /**
   * Check if user is admin
   * 
   * @returns {boolean} Is admin
   */
  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  /**
   * Check if user is dispatcher
   * 
   * @returns {boolean} Is dispatcher
   */
  const isDispatcher = useCallback(() => {
    return user?.role === 'dispatcher' || user?.role === 'admin';
  }, [user]);

  /**
   * Check if user is driver
   * 
   * @returns {boolean} Is driver
   */
  const isDriver = useCallback(() => {
    return ['driver', 'dispatcher', 'admin'].includes(user?.role);
  }, [user]);

  /**
   * Check if user has permission for specific action
   * 
   * @param {string} permission - Required permission
   * @returns {boolean} Has permission
   */
  const checkPermission = useCallback((permission) => {
    if (!user) return false;
    
    // Permission matrix
    const permissions = {
      // Customer permissions
      'view_products': ['customer', 'driver', 'dispatcher', 'admin'],
      'place_order': ['customer', 'driver', 'dispatcher', 'admin'],
      'view_own_orders': ['customer', 'driver', 'dispatcher', 'admin'],
      
      // Driver permissions
      'view_all_orders': ['driver', 'dispatcher', 'admin'],
      'update_delivery_status': ['driver', 'dispatcher', 'admin'],
      
      // Dispatcher permissions
      'assign_orders': ['dispatcher', 'admin'],
      'manage_drivers': ['dispatcher', 'admin'],
      
      // Admin permissions
      'manage_products': ['admin'],
      'manage_users': ['admin'],
      'view_analytics': ['admin'],
      'manage_roles': ['admin']
    };
    
    return permissions[permission]?.includes(user.role) || false;
  }, [user]);

  /**
   * Refresh user data from Firestore
   * 
   * @returns {Promise<Object>} Updated user data
   */
  const refreshUser = useCallback(async () => {
    try {
      if (!user?.uid) return null;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const updatedUser = {
          ...user,
          ...userDoc.data()
        };
        setUser(updatedUser);
        return updatedUser;
      }
      
      return user;
    } catch (err) {
      console.error('[useAuth] Refresh user error:', err);
      return user;
    }
  }, [user]);

  /**
   * Get remaining authentication attempts
   * 
   * @returns {number} Remaining attempts
   */
  const getRemainingAttempts = useCallback(() => {
    return authService.getRemainingAttempts();
  }, []);

  return {
    // State
    user,
    loading,
    error,
    initializing,
    
    // Authentication methods
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    
    // Profile management
    updateUserProfile,
    refreshUser,
    
    // Permission checks
    isAuthenticated,
    hasRole,
    isAdmin,
    isDispatcher,
    isDriver,
    checkPermission,
    
    // Utility
    getRemainingAttempts,
    
    // Clear error
    clearError: () => setError(null)
  };
};