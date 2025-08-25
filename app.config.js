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
      // For development, using direct values
      firebaseApiKey: "AIzaSyAXtoxseliZR9JY3CUwtXNOqRhOXrZcLsE",
      firebaseAuthDomain: "rope-access-logs.firebaseapp.com",
      firebaseProjectId: "rope-access-logs",
      firebaseStorageBucket: "rope-access-logs.firebasestorage.app",
      firebaseMessagingSenderId: "935811582399",
      firebaseAppId: "1:935811582399:web:d48c950e4f03a2b3fe790a",
      firebaseMeasurementId: "G-CPZVN6HNJM",
      // EAS Project ID
      eas: {
        projectId: "c7d50506-a5c7-4d5d-a8cf-a6eb4e8870ad"
      }
    },
  },
};
