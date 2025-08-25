# 🚀 Guide de Configuration - RopeAccess Portfolio

## 📋 Prérequis

- Node.js 18+ installé
- Expo CLI installé : `npm install -g @expo/cli`
- Compte Expo/EAS (gratuit)
- Compte Firebase (gratuit)

## 🔧 Configuration Initiale

### 1. Cloner le repository
```bash
git clone https://github.com/votre-username/RopeAccess_Portfolio.git
cd RopeAccess_Portfolio
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration Firebase

#### Créer un projet Firebase
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet
3. Activez Authentication (Email/Password)
4. Activez Firestore Database
5. Activez Storage

#### Récupérer les clés Firebase
1. Dans Firebase Console > Paramètres du projet > Général
2. Copiez les informations de configuration
3. Créez un fichier `app.config.js` basé sur `app.config.example.js`
4. Remplacez les valeurs `YOUR_*` par vos vraies clés Firebase

### 4. Configuration EAS (Expo Application Services)

#### Login EAS
```bash
eas login
```

#### Initialiser EAS
```bash
eas build:configure
```

#### Créer un projet EAS
```bash
eas project:init
```

#### Mettre à jour app.config.js
Remplacez `YOUR_EAS_PROJECT_ID` par l'ID de votre projet EAS.

## 🔐 Sécurité

### Variables d'environnement (Recommandé)
Pour la production, utilisez EAS Secrets :

```bash
# Configurer les secrets Firebase
eas secret:create --scope project --name FIREBASE_API_KEY --value "votre-api-key"
eas secret:create --scope project --name FIREBASE_AUTH_DOMAIN --value "votre-projet.firebaseapp.com"
eas secret:create --scope project --name FIREBASE_PROJECT_ID --value "votre-project-id"
eas secret:create --scope project --name FIREBASE_STORAGE_BUCKET --value "votre-projet.firebasestorage.app"
eas secret:create --scope project --name FIREBASE_MESSAGING_SENDER_ID --value "votre-sender-id"
eas secret:create --scope project --name FIREBASE_APP_ID --value "votre-app-id"
eas secret:create --scope project --name FIREBASE_MEASUREMENT_ID --value "votre-measurement-id"
```

### Configuration locale (Développement uniquement)
Pour le développement, vous pouvez utiliser directement les clés dans `app.config.js`, mais **NE COMMITTEZ JAMAIS** ce fichier avec les vraies clés.

## 🧪 Test Local

### Démarrer l'application
```bash
expo start
```

### Tester sur appareil
1. Installez Expo Go sur votre téléphone
2. Scannez le QR code affiché
3. Testez les fonctionnalités principales

## 📱 Build APK

### Build de développement
```bash
eas build --platform android --profile development
```

### Build de production
```bash
eas build --platform android --profile production
```

### Scripts fournis
- **Windows** : `build-apk.bat`
- **Linux/Mac** : `./build-apk.sh`

## 🎯 Fonctionnalités

- ✅ Gestion des sessions de travail
- ✅ Prise de photos sur site
- ✅ Export PDF optimisé
- ✅ Synchronisation Firebase
- ✅ Permissions Android 13+
- ✅ Interface moderne

## 🐛 Dépannage

### Problèmes courants

#### Firebase non configuré
```
Error: Missing required Firebase configuration
```
**Solution** : Configurez Firebase selon l'étape 3.

#### Permissions refusées
```
Permission denied for camera/gallery
```
**Solution** : Vérifiez `MANUAL_TEST_GUIDE.md` pour les tests de permissions.

#### Export lent
```
Export takes too long
```
**Solution** : L'export a été optimisé avec compression d'images et limites.

### Logs de débogage
```bash
# Voir les logs en temps réel
expo start --clear

# Logs Android
adb logcat
```

## 📚 Documentation

- `README.md` - Vue d'ensemble du projet
- `MANUAL_TEST_GUIDE.md` - Guide de test détaillé
- `DISTRIBUTION_GUIDE.md` - Guide de publication
- `assets/icons/ICON_PACK_README.md` - Documentation des icônes

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature : `git checkout -b feature/nouvelle-fonctionnalite`
3. Committez vos changements : `git commit -am 'Ajout nouvelle fonctionnalité'`
4. Push vers la branche : `git push origin feature/nouvelle-fonctionnalite`
5. Créez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

*Configuration mise à jour le ${new Date().toLocaleDateString('fr-FR')}*
