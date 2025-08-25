export default {
  expo: {
    name: "RopeAccess Portfolio",
    slug: "ropeaccess-portfolio",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icons/icon-main.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ropeaccess.portfolio"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icons/adaptive-icon-main.png",
        backgroundColor: "#FFFFFF"
      },
      edgeToEdgeEnabled: true,
      package: "com.ropeaccess.portfolio",
      permissions: [
        "android.permission.CAMERA",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.VIBRATE",
        "android.permission.WAKE_LOCK"
      ]
    },
    web: {
      favicon: "./assets/icons/favicon-main.png"
    },
    plugins: [
      "expo-mail-composer",
      [
        "expo-image-picker",
        {
          "photosPermission": "L'application accède à vos photos pour vous permettre de les sélectionner dans votre portfolio.",
          "cameraPermission": "L'application accède à votre caméra pour vous permettre de prendre des photos pour votre portfolio."
        }
      ]
    ],
    extra: {
      // Firebase configuration - these MUST be set via Expo EAS Secrets in production
      // For development, replace with your own Firebase project keys
      firebaseApiKey: "YOUR_FIREBASE_API_KEY",
      firebaseAuthDomain: "YOUR_PROJECT.firebaseapp.com",
      firebaseProjectId: "YOUR_PROJECT_ID",
      firebaseStorageBucket: "YOUR_PROJECT.firebasestorage.app",
      firebaseMessagingSenderId: "YOUR_SENDER_ID",
      firebaseAppId: "YOUR_APP_ID",
      firebaseMeasurementId: "YOUR_MEASUREMENT_ID",
      // EAS Project ID - replace with your own
      eas: {
        projectId: "YOUR_EAS_PROJECT_ID"
      }
    },
  },
};
