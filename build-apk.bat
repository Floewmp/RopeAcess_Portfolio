@echo off
echo 🚀 Démarrage du build APK...

REM Vérifier que EAS CLI est installé
eas --version >nul 2>&1
if errorlevel 1 (
    echo ❌ EAS CLI n'est pas installé. Installation...
    npm install -g @expo/eas-cli
)

REM Login EAS si nécessaire
echo 🔐 Vérification de la connexion EAS...
eas whoami

REM Build APK de production
echo 🏗️  Build APK de production...
eas build --platform android --profile production

echo ✅ Build terminé !
echo 📱 L'APK sera disponible dans votre dashboard EAS
echo 🔗 https://expo.dev/accounts/[votre-compte]/projects/ropeaccess-portfolio/builds

pause
