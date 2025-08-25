import * as FileSystem from "expo-file-system";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { compressImage } from './storage';

// Configuration des performances
const EXPORT_CONFIG = {
    MAX_IMAGES_PER_SESSION: 4, // Limite le nombre d'images par session
    MAX_IMAGE_SIZE: 800, // Taille max en pixels
    IMAGE_QUALITY: 0.7, // Qualité de compression
    BATCH_SIZE: 3, // Traite les sessions par batch
    TIMEOUT_MS: 30000 // Timeout de 30 secondes
};

// Fonction optimisée pour convertir les images
const imageToHtml = async (uri, index = 0) => {
    try {
        // Limite le nombre d'images par session
        if (index >= EXPORT_CONFIG.MAX_IMAGES_PER_SESSION) {
            return '';
        }

        // Pour les images locales, on les compresse d'abord
        if (uri.startsWith('file://')) {
            try {
                // Compresser l'image pour réduire la taille
                const compressedUri = await compressImage(uri, EXPORT_CONFIG.IMAGE_QUALITY);
                
                // Lire en base64 avec une taille limitée
                const base64 = await FileSystem.readAsStringAsync(compressedUri, { 
                    encoding: FileSystem.EncodingType.Base64 
                });
                
                return `<img src="data:image/jpeg;base64,${base64}" style="max-width: 100%; height: auto;" />`;
            } catch (e) {
                console.warn('Image compression failed, using original:', e);
                // Fallback vers l'image originale
                const base64 = await FileSystem.readAsStringAsync(uri, { 
                    encoding: FileSystem.EncodingType.Base64 
                });
                return `<img src="data:image/jpeg;base64,${base64}" style="max-width: 100%; height: auto;" />`;
            }
        }
        
        // Pour les images Firebase, on les utilise directement
        return `<img src="${uri}" style="max-width: 100%; height: auto;" />`;
    } catch (e) {
        console.warn('Image processing failed:', e);
        return '<p><i>Image non disponible</i></p>';
    }
};

// Fonction pour traiter les sessions par batch
const processSessionsBatch = async (sessions, startIndex, batchSize, onProgress) => {
    const endIndex = Math.min(startIndex + batchSize, sessions.length);
    const batch = sessions.slice(startIndex, endIndex);
    
    let batchHtml = '';
    
    for (let i = 0; i < batch.length; i++) {
        const s = batch[i];
        const sessionIndex = startIndex + i;
        
        // Mise à jour du progrès
        if (onProgress) {
            onProgress(sessionIndex + 1, sessions.length);
        }
        
        // Traitement des photos avec limite
        const photos = s.photos || [];
        const limitedPhotos = photos.slice(0, EXPORT_CONFIG.MAX_IMAGES_PER_SESSION);
        
        const photoPromises = limitedPhotos.map((uri, index) => imageToHtml(uri, index));
        const photoHtmls = await Promise.all(photoPromises);
        
        // Ajouter un message si des photos ont été tronquées
        const truncatedMessage = photos.length > EXPORT_CONFIG.MAX_IMAGES_PER_SESSION 
            ? `<p><i>... et ${photos.length - EXPORT_CONFIG.MAX_IMAGES_PER_SESSION} autres photos</i></p>`
            : '';
        
        batchHtml += `
            <div class="session">
                <div class="session-header">
                    <h3>${s.name}</h3>
                    <span>${new Date(s.startedAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <div class="details-grid">
                    <p><b>Employeur:</b> ${s.employer || 'N/A'}</p>
                    <p><b>Lieu:</b> ${s.location || 'N/A'}</p>
                    <p><b>Heures:</b> ${s.hours || 0}h</p>
                    <p><b>Hauteur:</b> ${s.height || 0}m</p>
                    <p class="full-width"><b>Méthodes:</b> ${s.methods || 'N/A'}</p>
                    <p class="full-width"><b>Collègues:</b> ${s.coworkers || 'N/A'}</p>
                    <p class="full-width"><b>Notes:</b> ${s.notes || 'N/A'}</p>
                </div>
                <div class="photos">${photoHtmls.join('')}${truncatedMessage}</div>
            </div>
        `;
    }
    
    return batchHtml;
};

export const exportPortfolio = async (sessionsToExport, user, onProgress) => {
    if (sessionsToExport.length === 0) {
        return Alert.alert("Export", "Aucune session à exporter.");
    }
    
    // Timeout pour éviter les blocages
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Export timeout')), EXPORT_CONFIG.TIMEOUT_MS);
    });
    
    try {
        // Calculer les totaux
        const totalHours = sessionsToExport.reduce((acc, s) => acc + (Number(s.hours) || 0), 0);
        const totalImages = sessionsToExport.reduce((acc, s) => acc + (s.photos?.length || 0), 0);
        
        // Avertir si beaucoup d'images
        if (totalImages > 20) {
            const shouldContinue = await new Promise((resolve) => {
                Alert.alert(
                    "Export avec beaucoup d'images",
                    `Cet export contient ${totalImages} images et peut prendre du temps. Continuer ?`,
                    [
                        { text: "Annuler", style: "cancel", onPress: () => resolve(false) },
                        { text: "Continuer", onPress: () => resolve(true) }
                    ]
                );
            });
            
            if (!shouldContinue) return;
        }
        
        // Traitement par batch avec progrès
        let sessionsHtml = '';
        const batchSize = EXPORT_CONFIG.BATCH_SIZE;
        
        for (let i = 0; i < sessionsToExport.length; i += batchSize) {
            const batchHtml = await processSessionsBatch(
                sessionsToExport, 
                i, 
                batchSize, 
                onProgress
            );
            sessionsHtml += batchHtml;
            
            // Petite pause pour éviter de bloquer l'UI
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // CSS optimisé sans dépendances externes
        const css = `
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                margin: 20px; 
                color: #333; 
                line-height: 1.4;
            }
            .header { 
                text-align: center; 
                border-bottom: 2px solid #eee; 
                padding-bottom: 10px; 
                margin-bottom: 20px; 
            }
            .header h1 { margin: 0; color: #000; font-size: 24px; }
            .header p { margin: 2px 0; color: #666; }
            .session { 
                page-break-inside: avoid; 
                border: 1px solid #ddd; 
                margin-bottom: 20px; 
                padding: 15px; 
                border-radius: 8px; 
                box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
            }
            .session-header { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                border-bottom: 1px solid #eee; 
                padding-bottom: 10px; 
                margin-bottom: 10px; 
            }
            .session-header h3 { margin: 0; font-size: 18px; }
            .session-header span { color: #555; font-size: 14px; }
            .details-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 5px 15px; 
                margin-bottom: 15px;
            }
            .details-grid p { margin: 2px 0; font-size: 14px; }
            .details-grid .full-width { grid-column: 1 / -1; }
            .photos { 
                display: flex; 
                flex-wrap: wrap; 
                margin-top: 15px; 
                gap: 10px; 
            }
            .photos img { 
                width: 48%; 
                border-radius: 4px; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .summary { 
                text-align: center; 
                font-size: 18px; 
                margin-bottom: 20px; 
                padding: 15px; 
                background-color: #f9f9f9; 
                border-radius: 8px; 
                border: 1px solid #eee; 
            }
            @media print {
                .session { page-break-inside: avoid; }
                body { margin: 10px; }
            }
        `;
        
        const html = `
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>${css}</style>
                </head>
                <body>
                    <div class="header">
                        <h1>Portfolio Accès par Corde</h1>
                        <p><strong>Technicien:</strong> ${user?.name || 'N/A'}</p>
                        <p><strong>Date d'export:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div class="summary">
                        <p><b>Total des heures:</b> ${totalHours}h</p>
                        <p><b>Nombre de sessions:</b> ${sessionsToExport.length}</p>
                    </div>
                    ${sessionsHtml}
                </body>
            </html>
        `;
        
        // Créer le PDF avec timeout
        const pdfPromise = Print.printToFileAsync({ html });
        const { uri } = await Promise.race([pdfPromise, timeoutPromise]);
        
        // Partager le fichier
        await Sharing.shareAsync(uri, { 
            mimeType: 'application/pdf', 
            dialogTitle: 'Exporter le Portfolio' 
        });
        
    } catch (error) {
        console.error('Export error:', error);
        
        if (error.message === 'Export timeout') {
            Alert.alert(
                "Export interrompu", 
                "L'export a pris trop de temps. Essayez avec moins de sessions ou d'images."
            );
        } else {
            Alert.alert(
                "Échec de l'export", 
                "Impossible de créer ou partager le PDF. Vérifiez l'espace de stockage."
            );
        }
    }
};
