// Centralized error handling utility
import { Alert } from 'react-native';

// Error categories for better user experience
export const ERROR_CATEGORIES = {
    NETWORK: 'network',
    AUTHENTICATION: 'authentication',
    PERMISSIONS: 'permissions',
    STORAGE: 'storage',
    VALIDATION: 'validation',
    UNKNOWN: 'unknown'
};

// User-friendly error messages
export const USER_FRIENDLY_MESSAGES = {
    [ERROR_CATEGORIES.NETWORK]: {
        title: 'Connection Issue',
        message: 'Please check your internet connection and try again.',
        action: 'Retry'
    },
    [ERROR_CATEGORIES.AUTHENTICATION]: {
        title: 'Authentication Error',
        message: 'There was an issue with your login. Please try again.',
        action: 'OK'
    },
    [ERROR_CATEGORIES.PERMISSIONS]: {
        title: 'Permission Required',
        message: 'This feature requires permission. Please enable it in your device settings.',
        action: 'Open Settings'
    },
    [ERROR_CATEGORIES.STORAGE]: {
        title: 'Storage Issue',
        message: 'Unable to save your data. Please try again.',
        action: 'Retry'
    },
    [ERROR_CATEGORIES.VALIDATION]: {
        title: 'Invalid Input',
        message: 'Please check your input and try again.',
        action: 'OK'
    },
    [ERROR_CATEGORIES.UNKNOWN]: {
        title: 'Something Went Wrong',
        message: 'An unexpected error occurred. Please try again.',
        action: 'OK'
    }
};

// Firebase error mapping
const FIREBASE_ERROR_MAP = {
    'auth/user-not-found': ERROR_CATEGORIES.AUTHENTICATION,
    'auth/wrong-password': ERROR_CATEGORIES.AUTHENTICATION,
    'auth/email-already-in-use': ERROR_CATEGORIES.VALIDATION,
    'auth/weak-password': ERROR_CATEGORIES.VALIDATION,
    'auth/invalid-email': ERROR_CATEGORIES.VALIDATION,
    'auth/network-request-failed': ERROR_CATEGORIES.NETWORK,
    'auth/too-many-requests': ERROR_CATEGORIES.AUTHENTICATION,
    'storage/unauthorized': ERROR_CATEGORIES.PERMISSIONS,
    'storage/quota-exceeded': ERROR_CATEGORIES.STORAGE,
    'storage/object-not-found': ERROR_CATEGORIES.STORAGE,
    'firestore/permission-denied': ERROR_CATEGORIES.PERMISSIONS,
    'firestore/unavailable': ERROR_CATEGORIES.NETWORK
};

// Categorize error based on error code or message
export const categorizeError = (error) => {
    if (!error) return ERROR_CATEGORIES.UNKNOWN;
    
    // Check for Firebase error codes
    if (error.code && FIREBASE_ERROR_MAP[error.code]) {
        return FIREBASE_ERROR_MAP[error.code];
    }
    
    // Check error message for keywords
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('network') || message.includes('connection') || message.includes('timeout')) {
        return ERROR_CATEGORIES.NETWORK;
    }
    
    if (message.includes('permission') || message.includes('access')) {
        return ERROR_CATEGORIES.PERMISSIONS;
    }
    
    if (message.includes('storage') || message.includes('save') || message.includes('upload')) {
        return ERROR_CATEGORIES.STORAGE;
    }
    
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
        return ERROR_CATEGORIES.VALIDATION;
    }
    
    if (message.includes('auth') || message.includes('login') || message.includes('password')) {
        return ERROR_CATEGORIES.AUTHENTICATION;
    }
    
    return ERROR_CATEGORIES.UNKNOWN;
};

// Show user-friendly error alert
export const showUserFriendlyError = (error, customMessage = null) => {
    const category = categorizeError(error);
    const errorInfo = USER_FRIENDLY_MESSAGES[category];
    
    Alert.alert(
        errorInfo.title,
        customMessage || errorInfo.message,
        [
            {
                text: errorInfo.action,
                style: 'default'
            }
        ]
    );
};

// Handle errors with custom actions
export const handleError = (error, options = {}) => {
    const {
        showAlert = true,
        customMessage = null,
        onError = null,
        fallback = null
    } = options;
    
    // Log error for debugging (only in development)
    if (__DEV__) {
        console.error('Error occurred:', error);
    }
    
    // Call custom error handler if provided
    if (onError) {
        onError(error);
    }
    
    // Show user-friendly alert if requested
    if (showAlert) {
        showUserFriendlyError(error, customMessage);
    }
    
    // Return fallback value or throw error
    if (fallback !== undefined) {
        return fallback;
    }
    
    throw error;
};

// Async error wrapper for better error handling
export const withErrorHandling = (asyncFunction, options = {}) => {
    return async (...args) => {
        try {
            return await asyncFunction(...args);
        } catch (error) {
            return handleError(error, options);
        }
    };
};
