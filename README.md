# 📱 RopeAccess Portfolio

React Native/Expo mobile app for rope access work portfolio management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g @expo/cli`
- Firebase account (free)
- Expo/EAS account (free)

### Installation
```bash
# Clone the repository
git clone https://github.com/Floewmp/RopeAcess_Portfolio.git
cd RopeAcess_Portfolio

# Install dependencies
npm install

# Configuration
cp app.config.example.js app.config.js
# Edit app.config.js with your Firebase keys
```

### Local Development
```bash
expo start
```

### Build APK
```bash
# Production build
eas build --platform android --profile production

# Or use provided scripts:
# Windows: build-apk.bat
# Linux/Mac: ./build-apk.sh
```

## 📋 Features

- ✅ Job and project management
- ✅ On-site photo capture
- ✅ Optimized PDF export (3-5x faster)
- ✅ Firebase synchronization
- ✅ Modern intuitive interface
- ✅ Optimized Android icons
- ✅ Android 13+ permissions (READ_MEDIA_IMAGES)
- ✅ Robust error handling

## 🔐 Security

**⚠️ IMPORTANT**: This repository does NOT contain real API keys.

### Required Configuration
1. **Firebase**: Create your project and add keys to `app.config.js`
2. **EAS**: Configure your EAS project for builds
3. **Production**: Use EAS Secrets for sensitive keys

## 📁 Structure

```
├── assets/
│   ├── icons/          # Optimized Android icons
│   ├── icon.svg        # Original logo
│   └── splash-icon.png # Splash screen
├── components/         # React Native components
├── screens/           # App screens
├── hooks/             # Custom hooks
├── utils/             # Utilities (optimized export)
├── config/            # Firebase configuration
└── contexts/          # React contexts (Auth, Session)
```

## 🔧 Configuration

- **app.config.js** : Expo configuration (create from app.config.example.js)
- **eas.json** : EAS Build configuration
- **package.json** : Dependencies

## 🚀 Recent Optimizations

### Export Performance
- ✅ Automatic image compression
- ✅ 4 images per session limit
- ✅ Batch processing
- ✅ 30-second timeout
- ✅ Progress feedback
- ✅ Optimized CSS without external dependencies

### Android 13+ Permissions
- ✅ `READ_MEDIA_IMAGES` instead of `READ_EXTERNAL_STORAGE`
- ✅ French permission messages
- ✅ Permission denial handling
- ✅ Configured expo-image-picker plugin

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Create a Pull Request

## 📄 License

MIT License - see the `LICENSE` file for details.

---

*Built with React Native and Expo*
