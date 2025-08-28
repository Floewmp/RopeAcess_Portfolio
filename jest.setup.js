// Jest setup file for global mocks and configuration

// Mock React Native polyfills to avoid TypeScript parsing issues
jest.mock('@react-native/js-polyfills/error-guard', () => ({
  setGlobalErrorHandler: jest.fn(),
  getGlobalErrorHandler: jest.fn(),
}));

jest.mock('@react-native/js-polyfills/console', () => ({
  polyfillConsole: jest.fn(),
}));

// Mock React Native components that might not be available in test environment
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock expo modules
jest.mock('expo-file-system', () => ({
    cacheDirectory: '/mock/cache/',
    documentDirectory: '/mock/documents/',
    makeDirectoryAsync: jest.fn(),
    getInfoAsync: jest.fn(),
    copyAsync: jest.fn(),
    deleteAsync: jest.fn(),
    readAsStringAsync: jest.fn(),
    writeAsStringAsync: jest.fn(),
    EncodingType: {
        Base64: 'base64',
        UTF8: 'utf8'
    }
}));

jest.mock('expo-image-picker', () => ({
    MediaTypeOptions: {
        Images: 'images',
        Videos: 'videos'
    },
    launchImageLibraryAsync: jest.fn(),
    launchCameraAsync: jest.fn(),
    getCameraPermissionsAsync: jest.fn(),
    getMediaLibraryPermissionsAsync: jest.fn(),
    requestCameraPermissionsAsync: jest.fn(),
    requestMediaLibraryPermissionsAsync: jest.fn()
}));

jest.mock('expo-location', () => ({
    requestForegroundPermissionsAsync: jest.fn(),
    getCurrentPositionAsync: jest.fn(),
    watchPositionAsync: jest.fn(),
    reverseGeocodeAsync: jest.fn(),
    Accuracy: {
        High: 'high',
        Medium: 'medium',
        Low: 'low'
    }
}));

jest.mock('expo-print', () => ({
    printAsync: jest.fn(),
    printToFileAsync: jest.fn()
}));

jest.mock('expo-sharing', () => ({
    shareAsync: jest.fn(),
    isAvailableAsync: jest.fn()
}));

jest.mock('expo-mail-composer', () => ({
    composeAsync: jest.fn(),
    isAvailableAsync: jest.fn()
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
}));

// Mock Firebase
jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    onAuthStateChanged: jest.fn(),
    updatePassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    updateEmail: jest.fn(),
    signOut: jest.fn(),
    initializeAuth: jest.fn(),
    getReactNativePersistence: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    doc: jest.fn(),
    getDocs: jest.fn(),
    setDoc: jest.fn(),
    deleteDoc: jest.fn(),
    getDoc: jest.fn()
}));

jest.mock('firebase/storage', () => ({
    getStorage: jest.fn(),
    ref: jest.fn(),
    uploadBytesResumable: jest.fn(),
    getDownloadURL: jest.fn()
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
    NavigationContainer: ({ children }) => children,
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
        setOptions: jest.fn()
    }),
    useRoute: () => ({
        params: {}
    })
}));

jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: () => ({
        Navigator: ({ children }) => children,
        Screen: ({ children }) => children
    })
}));

// Mock Constants
jest.mock('expo-constants', () => ({
    expoConfig: {
        extra: {
            firebaseApiKey: 'test-api-key',
            firebaseAuthDomain: 'test-domain',
            firebaseProjectId: 'test-project',
            firebaseStorageBucket: 'test-bucket',
            firebaseMessagingSenderId: 'test-sender',
            firebaseAppId: 'test-app-id',
            firebaseMeasurementId: 'test-measurement'
        }
    }
}));

// Global test utilities
global.__DEV__ = true;

// Suppress console warnings in tests
const originalWarn = console.warn;
console.warn = (...args) => {
    if (args[0]?.includes?.('Warning:') || args[0]?.includes?.('Deprecation')) {
        return;
    }
    originalWarn(...args);
};

// Suppress console errors in tests (but allow them to be caught)
const originalError = console.error;
console.error = (...args) => {
    if (args[0]?.includes?.('Warning:') || args[0]?.includes?.('Deprecation')) {
        return;
    }
    originalError(...args);
};
