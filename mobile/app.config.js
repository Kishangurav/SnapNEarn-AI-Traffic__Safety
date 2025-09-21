export default {
  expo: {
    name: "SnapNEarn",
    slug: "snapnearn-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#3B82F6"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.snapnearn.mobile"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#3B82F6"
      },
      package: "com.snapnearn.mobile",
      permissions: [
        "CAMERA",
        "RECORD_AUDIO",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    plugins: [
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you capture evidence of traffic violations.",
          cameraPermission: "The app accesses your camera to let you capture evidence of traffic violations."
        }
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow SnapNEarn to use your location to tag violation reports."
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "snapnearn-mobile-app"
      }
    },
    // Performance optimizations
    jsEngine: "hermes",
    experiments: {
      turboModules: true
    }
  }
};
