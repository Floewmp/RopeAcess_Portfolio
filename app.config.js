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
      backgroundColor: "#FFFFFF"
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
          "photosPermission": "The app accesses your photos to let you select them in your portfolio.",
          "cameraPermission": "The app accesses your camera to let you take photos for your portfolio."
        }
      ]
    ],
    extra: {
      // Firebase configuration - these MUST be set via Expo EAS Secrets in production
      // For development, using direct values
      firebaseApiKey: "¨PLACEHOLDER",
      firebaseAuthDomain: "PLACEHOLDER",
      firebaseProjectId: "PLACEHOLDERs",
      firebaseStorageBucket: "PLACEHOLDER",
      firebaseMessagingSenderId: "PLACEHOLDER",
      firebaseAppId: "PLACEHOLDER",
      firebaseMeasurementId: "PLACEHOLDER",
      // EAS Project ID
      eas: {
        projectId: "PLACEHOLDER"
      }
    },
  },
};
