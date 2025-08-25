# 🎨 Pack d'Icônes Android - RopeAccess Portfolio

## ✅ Pack d'icônes intégré

Votre projet utilise maintenant un pack d'icônes Android professionnel et complet !

### 📱 Icônes disponibles

#### Icônes principales
- **icon-main.png** - Icône principale (512x512px)
- **adaptive-icon-main.png** - Icône adaptative foreground
- **favicon-main.png** - Favicon web

#### Densités Android
- **mipmap-mdpi** - 48x48px
- **mipmap-hdpi** - 72x72px
- **mipmap-xhdpi** - 96x96px
- **mipmap-xxhdpi** - 144x144px
- **mipmap-xxxhdpi** - 192x192px

### 🎯 Caractéristiques

#### ✅ Design professionnel
- **Style noir et blanc** - Look moderne et épuré
- **Icônes adaptatives** - Compatible Android 8.0+
- **Toutes les densités** - Optimisé pour tous les appareils
- **Icône Play Store** - Prête pour la publication

#### ✅ Compatibilité
- ✅ Android (toutes versions)
- ✅ Adaptive Icons (Android 8.0+)
- ✅ Play Store
- ✅ Web (favicon)

### 🔧 Configuration

#### app.config.js
```javascript
{
  expo: {
    icon: "./assets/icons/icon-main.png",
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icons/adaptive-icon-main.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./assets/icons/favicon-main.png"
    }
  }
}
```

### 📁 Structure des fichiers

```
assets/
├── android_icon_pack_black_white/          # Pack d'icônes original
│   └── android_icon_output_black_on_white/
│       ├── playstore/
│       │   └── ic_playstore_512.png
│       ├── mipmap-mdpi/
│       ├── mipmap-hdpi/
│       ├── mipmap-xhdpi/
│       ├── mipmap-xxhdpi/
│       └── mipmap-xxxhdpi/
├── icons/
│   ├── icon-main.png                       # Icône principale
│   ├── adaptive-icon-main.png              # Icône adaptative
│   ├── favicon-main.png                    # Favicon web
│   └── README.md                           # Documentation
└── android/                                # Dossiers de densité copiés
    └── app/src/main/res/
        ├── mipmap-mdpi/
        ├── mipmap-hdpi/
        ├── mipmap-xhdpi/
        ├── mipmap-xxhdpi/
        └── mipmap-xxxhdpi/
```

### 🚀 Utilisation

#### Build APK
Les icônes sont automatiquement utilisées par Expo/EAS Build.

#### Build natif Android
Les dossiers de densité sont disponibles dans `android/app/src/main/res/`.

### 🎨 Personnalisation

#### Modifier les icônes
1. Modifiez les fichiers dans `assets/android_icon_pack_black_white/`
2. Régénérez le pack d'icônes
3. Relancez l'intégration

#### Changer la couleur de fond
Modifiez `backgroundColor` dans `app.config.js` :
- `"#FFFFFF"` - Blanc (actuel)
- `"#000000"` - Noir
- `"#4A90E2"` - Bleu

---

*Pack d'icônes intégré le 20 janvier 2024*
