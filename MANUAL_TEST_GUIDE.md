# 🧪 Guide de Test Manuel - RopeAccess Portfolio

## 📱 Installation Manuelle

### 1. Préparation
- Téléchargez l'APK depuis le dashboard EAS
- Transférez l'APK sur votre appareil Android
- Activez "Sources inconnues" dans les paramètres

### 2. Installation
- Ouvrez le fichier APK
- Suivez les instructions d'installation
- **IMPORTANT** : Désinstallez toute version précédente pour éviter les conflits de permissions

## 🔍 Tests à Effectuer

### ✅ Test de Base
- [ ] L'app se lance sans crash
- [ ] L'écran de connexion s'affiche
- [ ] Navigation entre les écrans fonctionne
- [ ] Les icônes s'affichent correctement

### ✅ Test des Permissions (CRITIQUE)
**Testez sur un appareil Android 13+ si possible**

- [ ] **Permission caméra** : Prenez une photo dans un nouveau job
- [ ] **Permission galerie** : Sélectionnez une photo existante
- [ ] **Messages de permission** : Vérifiez que les messages sont en français
- [ ] **Gestion du refus** : Testez le refus de permission et la redirection vers les paramètres

### ✅ Test des Fonctionnalités
- [ ] Connexion/déconnexion
- [ ] Ajout d'un nouveau job
- [ ] Modification d'un job existant
- [ ] **Prise de photos** (test critique)
- [ ] **Sélection de photos depuis la galerie** (test critique)
- [ ] Export des données
- [ ] Gestion des sessions

### ✅ Test de Performance
- [ ] Temps de chargement acceptable
- [ ] Animations fluides
- [ ] Pas de crash lors de l'utilisation
- [ ] Gestion mémoire correcte

## 🐛 Dépannage des Permissions

### Problèmes courants sur Android 13+
1. **Photos ne s'affichent pas après sélection**
   - Vérifiez que `READ_MEDIA_IMAGES` est bien déclarée
   - Redémarrez l'app après avoir accordé la permission

2. **Caméra ne fonctionne pas**
   - Vérifiez que `CAMERA` est bien déclarée
   - Testez sur un appareil Android 13+ pour valider

3. **Permissions refusées définitivement**
   - Désinstallez complètement l'APK
   - Réinstallez et testez à nouveau

### Vérification des permissions système
1. Allez dans **Paramètres > Applications > RopeAccess Portfolio > Permissions**
2. Vérifiez que les permissions suivantes sont accordées :
   - **Caméra** ✅
   - **Photos et vidéos** ✅ (Android 13+)
   - **Stockage** ✅ (si applicable)

### Test spécifique Android 13+
```bash
# Vérifiez la version Android
Settings > About phone > Android version

# Si Android 13+ :
# - Utilise le Photo Picker système
# - Pas besoin de READ_EXTERNAL_STORAGE
# - READ_MEDIA_IMAGES suffit
```

## 📞 Support

En cas de problème persistant :
1. Notez les étapes qui causent le problème
2. Prenez une capture d'écran de l'erreur
3. Vérifiez la version d'Android
4. Testez sur un autre appareil si possible
5. Vérifiez les logs avec `adb logcat`

## 🔧 Configuration des Permissions

### Permissions déclarées dans app.config.js :
- `android.permission.CAMERA` - Pour prendre des photos
- `android.permission.READ_MEDIA_IMAGES` - Pour sélectionner des photos (Android 13+)
- `android.permission.INTERNET` - Pour la synchronisation
- `android.permission.ACCESS_NETWORK_STATE` - Pour vérifier la connectivité

### Plugin expo-image-picker configuré :
- Messages de permission en français
- Gestion automatique des permissions Android 13+
