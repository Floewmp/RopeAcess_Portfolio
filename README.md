# 📱 RopeAccess Portfolio

Application mobile React Native/Expo pour la gestion de portfolio de travaux d'accès par corde.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- Expo CLI : `npm install -g @expo/cli`
- Compte Firebase (gratuit)
- Compte Expo/EAS (gratuit)

### Installation
```bash
# Cloner le repository
git clone https://github.com/votre-username/RopeAccess_Portfolio.git
cd RopeAccess_Portfolio

# Installer les dépendances
npm install

# Configuration (voir SETUP_GUIDE.md)
cp app.config.example.js app.config.js
# Éditer app.config.js avec vos clés Firebase
```

### Test Local
```bash
# Démarrer l'app
expo start
```

### Build APK
```bash
# Build APK de production
eas build --platform android --profile production

# Ou utiliser les scripts fournis :
# Windows : build-apk.bat
# Linux/Mac : ./build-apk.sh
```

## 📋 Fonctionnalités

- ✅ Gestion des jobs et projets
- ✅ Prise de photos sur site
- ✅ Export PDF optimisé (performance améliorée)
- ✅ Synchronisation Firebase
- ✅ Interface moderne et intuitive
- ✅ Icônes Android optimisées
- ✅ Permissions Android 13+ (READ_MEDIA_IMAGES)
- ✅ Gestion des erreurs robuste

## 🔐 Sécurité

**⚠️ IMPORTANT** : Ce repository ne contient PAS les vraies clés API.

### Configuration requise
1. **Firebase** : Créez votre projet et ajoutez vos clés dans `app.config.js`
2. **EAS** : Configurez votre projet EAS pour les builds
3. **Production** : Utilisez EAS Secrets pour les clés sensibles

Voir `SETUP_GUIDE.md` pour la configuration complète.

## 📁 Structure

```
├── assets/
│   ├── icons/          # Icônes Android optimisées
│   ├── icon.svg        # Logo original
│   └── splash-icon.png # Écran de démarrage
├── components/         # Composants React Native
├── screens/           # Écrans de l'application
├── hooks/             # Hooks personnalisés
├── utils/             # Utilitaires (export optimisé)
├── config/            # Configuration Firebase
└── contexts/          # Contextes React (Auth, Session)
```

## 🔧 Configuration

- **app.config.js** : Configuration Expo (à créer depuis app.config.example.js)
- **eas.json** : Configuration EAS Build
- **package.json** : Dépendances

## 📞 Support

- **Configuration** : `SETUP_GUIDE.md`
- **Test** : `MANUAL_TEST_GUIDE.md`
- **Distribution** : `DISTRIBUTION_GUIDE.md`
- **Icônes** : `assets/icons/ICON_PACK_README.md`

## 🚀 Optimisations Récentes

### Performance Export
- ✅ Compression automatique des images
- ✅ Limite de 4 images par session
- ✅ Traitement par batch
- ✅ Timeout de 30 secondes
- ✅ Feedback de progression
- ✅ CSS optimisé sans dépendances externes

### Permissions Android 13+
- ✅ `READ_MEDIA_IMAGES` au lieu de `READ_EXTERNAL_STORAGE`
- ✅ Messages de permission en français
- ✅ Gestion des refus de permission
- ✅ Plugin expo-image-picker configuré

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature
3. Committez vos changements
4. Créez une Pull Request

## 📄 Licence

MIT License - voir le fichier `LICENSE` pour plus de détails.

---

*Développé avec React Native et Expo*
