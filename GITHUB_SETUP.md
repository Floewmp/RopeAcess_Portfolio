# 🚀 Configuration GitHub - RopeAccess Portfolio

## 📋 Étapes pour publier sur GitHub

### 1. Créer un repository GitHub

1. Allez sur [GitHub.com](https://github.com)
2. Cliquez sur "New repository"
3. Nom du repository : `RopeAccess_Portfolio`
4. Description : `Application mobile React Native/Expo pour la gestion de portfolio de travaux d'accès par corde`
5. **IMPORTANT** : Laissez-le **Public** (pour le partage)
6. **NE PAS** initialiser avec README (nous en avons déjà un)
7. Cliquez sur "Create repository"

### 2. Configurer le remote GitHub

```bash
# Ajouter le remote GitHub (remplacez YOUR_USERNAME par votre nom d'utilisateur)
git remote add origin https://github.com/YOUR_USERNAME/RopeAccess_Portfolio.git

# Vérifier que le remote est bien configuré
git remote -v
```

### 3. Pousser le code vers GitHub

```bash
# Pousser la branche main
git push -u origin main

# Vérifier que tout est bien uploadé
git status
```

### 4. Configuration GitHub Pages (Optionnel)

Si vous voulez une page web pour présenter le projet :

1. Allez dans Settings > Pages
2. Source : "Deploy from a branch"
3. Branch : `main`
4. Folder : `/ (root)`
5. Cliquez sur "Save"

## 🔐 Sécurité Vérifiée

### ✅ Fichiers sécurisés
- `app.config.js` contient vos vraies clés (local uniquement)
- `app.config.example.js` contient des placeholders (sécurisé pour GitHub)
- `.gitignore` exclut les fichiers sensibles

### ✅ Clés API protégées
- Firebase keys : Utilisez EAS Secrets en production
- EAS Project ID : Remplacez par le vôtre
- Pas de clés sensibles dans le code public

## 📱 Prochaines étapes

### Pour les développeurs
1. Fork le repository
2. Suivez `SETUP_GUIDE.md` pour la configuration
3. Remplacez les clés dans `app.config.js`

### Pour la distribution
1. Suivez `DISTRIBUTION_GUIDE.md`
2. Build APK avec EAS
3. Publiez sur le Play Store

## 🎯 Repository prêt

Votre repository GitHub contient maintenant :
- ✅ Code source complet
- ✅ Documentation détaillée
- ✅ Configuration sécurisée
- ✅ Guides de setup et test
- ✅ Icônes Android optimisées
- ✅ Export PDF optimisé
- ✅ Permissions Android 13+

## 🔗 Liens utiles

- **Repository** : `https://github.com/YOUR_USERNAME/RopeAccess_Portfolio`
- **Issues** : Pour signaler des bugs ou demander des fonctionnalités
- **Wiki** : Pour la documentation détaillée (optionnel)

---

*Configuration GitHub le ${new Date().toLocaleDateString('fr-FR')}*
