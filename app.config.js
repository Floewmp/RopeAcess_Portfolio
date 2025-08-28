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
      bundleIdentifier: "com.ropeaccess.portfolio",
      infoPlist: {
        NSCameraUsageDescription: "This app needs camera access to take photos of your rope access work for your portfolio.",
        NSPhotoLibraryUsageDescription: "This app needs photo library access to select photos for your portfolio.",
        NSLocationWhenInUseUsageDescription: "This app uses location to automatically tag your work locations.",
        NSMicrophoneUsageDescription: "This app needs microphone access to record videos for your portfolio."
      }
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
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.VIBRATE",
        "android.permission.WAKE_LOCK",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION"
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
          "photosPermission": "This app needs access to your photos to let you select them for your portfolio.",
          "cameraPermission": "This app needs access to your camera to let you take photos for your portfolio.",
          "microphonePermission": "This app needs access to your microphone to record videos for your portfolio."
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "This app uses location to automatically tag your work locations."
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
