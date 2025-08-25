#!/bin/bash

echo "🚀 Démarrage du build APK..."

# Vérifier que EAS CLI est installé
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI n'est pas installé. Installation..."
    npm install -g @expo/eas-cli
fi

# Login EAS si nécessaire
echo "🔐 Vérification de la connexion EAS..."
eas whoami

# Build APK de production
echo "🏗️  Build APK de production..."
eas build --platform android --profile production

echo "✅ Build terminé !"
echo "📱 L'APK sera disponible dans votre dashboard EAS"
echo "🔗 https://expo.dev/accounts/[votre-compte]/projects/ropeaccess-portfolio/builds"
