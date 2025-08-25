// Application constants and configuration

export const APP_CONFIG = {
    // Firebase configuration
    FIREBASE: {
        REQUIRED_FIELDS: ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'],
        STORAGE_PATH: 'images',
        COLLECTIONS: {
            USERS: 'users',
            SESSIONS: 'sessions'
        }
    },
    
    // File system paths
    PATHS: {
        SESSIONS: 'sessions.json'
    },
    
    // Image configuration
    IMAGE: {
        QUALITY: 0.8,
        MAX_WIDTH: 1920,
        MAX_HEIGHT: 1080
    },
    
    // Validation rules
    VALIDATION: {
        PASSWORD_MIN_LENGTH: 6,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        NUMBER_MIN: 0
    },
    
    // UI configuration
    UI: {
        GALLERY_COLUMNS: 3,
        THUMBNAIL_SIZE: 80,
        PHOTO_SELECTION_SIZE: 24
    },
    
    // GPS configuration
    GPS: {
        ACCURACY: 'high',
        TIME_INTERVAL: 5000,
        DISTANCE_INTERVAL: 10,
        COORDINATE_PRECISION: 6
    }
};

// Error messages
export const ERROR_MESSAGES = {
    FIREBASE: {
        CONFIG_MISSING: 'Missing required Firebase configuration. Please set environment variables.',
        INIT_FAILED: 'Firebase initialization failed.',
        AUTH_UNAVAILABLE: 'Firebase auth not available, running in offline mode',
        SYNC_FAILED: 'Firebase sync failed, using local data',
        SAVE_FAILED: 'Firebase save failed, but data saved locally',
        DELETE_FAILED: 'Firebase delete failed, but data deleted locally',
        CLEAR_FAILED: 'Firebase clear failed, but data cleared locally'
    },
    STORAGE: {
        UNAVAILABLE: 'Firebase Storage is not available. Please check your configuration.',
        UNAUTHORIZED: 'Storage access denied. Please check Firebase Storage rules.',
        QUOTA_EXCEEDED: 'Storage quota exceeded.',
        UNAUTHENTICATED: 'User not authenticated for storage access.',
        UPLOAD_FAILED: 'Failed to upload image'
    },
    PERMISSIONS: {
        CAMERA: 'Please allow camera access in your device settings to take photos.',
        PHOTO_LIBRARY: 'Please allow photo library access in your device settings to select photos.',
        LOCATION: 'Could not get current location. Please make sure GPS is enabled.'
    },
    VALIDATION: {
        EMAIL_REQUIRED: 'Email is required',
        EMAIL_INVALID: 'Please enter a valid email address',
        PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
        FIELD_REQUIRED: 'This field is required',
        NUMBER_INVALID: 'Must be a valid number',
        NUMBER_TOO_SMALL: 'Must be at least'
    }
};

// Success messages
export const SUCCESS_MESSAGES = {
    SESSION_CREATED: 'Session created successfully',
    SESSION_UPDATED: 'Session updated successfully',
    SESSION_DELETED: 'Session deleted successfully',
    PHOTO_UPLOADED: 'Photo uploaded successfully',
    PROFILE_UPDATED: 'Profile updated successfully'
};

// Colors (for consistency)
export const COLORS = {
    PRIMARY: '#000000',
    SECONDARY: '#007BFF',
    DANGER: '#e11d48',
    SUCCESS: '#22c55e',
    WARNING: '#f59e0b',
    INFO: '#3b82f6',
    LIGHT: '#f5f5f5',
    DARK: '#333333',
    BORDER: '#eee',
    TEXT: '#000000',
    TEXT_SECONDARY: '#666666'
};
