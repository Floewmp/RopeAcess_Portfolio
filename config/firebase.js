import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Firebase configuration using environment variables
// In production, these MUST be set via Expo EAS Secrets
const firebaseConfig = {
    apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
    authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
    projectId: Constants.expoConfig?.extra?.firebaseProjectId,
    storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
    messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
    appId: Constants.expoConfig?.extra?.firebaseAppId,
    measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId
};

// Validate required configuration
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field]);

if (missingFields.length > 0) {
    const errorMessage = `Missing required Firebase configuration: ${missingFields.join(', ')}. Please set these via environment variables or Expo EAS Secrets.`;
    
    if (__DEV__) {
        // In development, log warning but continue with offline mode
        console.warn(`⚠️ ${errorMessage}`);
        console.warn('📖 See FIREBASE_SETUP.md for setup instructions.');
        console.warn('🔧 Development mode: App will run in offline mode only.');
    } else {
        throw new Error(errorMessage);
    }
}

// Initialize Firebase
let app, auth, db, storage;

try {
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
    db = getFirestore(app);
    storage = getStorage(app);
} catch (error) {
    if (__DEV__) {
        // In development, provide mock objects for offline functionality
        console.warn('🔧 Firebase initialization failed, using mock services for offline development:', error.message);
        app = null;
        auth = null;
        db = null;
        storage = null;
    } else {
        console.error('Firebase initialization failed:', error);
        throw error;
    }
}

export { app, auth, db, storage };
