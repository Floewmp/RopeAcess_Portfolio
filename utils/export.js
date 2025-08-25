import * as FileSystem from "expo-file-system";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { compressImage } from './storage';

// Performance configuration
const EXPORT_CONFIG = {
    MAX_IMAGES_PER_SESSION: 4, // Limit images per session
    MAX_IMAGE_SIZE: 800, // Max size in pixels
    IMAGE_QUALITY: 0.7, // Compression quality
    BATCH_SIZE: 3, // Process sessions in batches
    TIMEOUT_MS: 30000 // 30 second timeout
};

// Optimized image conversion function
const imageToHtml = async (uri, index = 0) => {
    try {
        // Limit images per session
        if (index >= EXPORT_CONFIG.MAX_IMAGES_PER_SESSION) {
            return '';
        }

        // For local images, compress first
        if (uri.startsWith('file://')) {
            try {
                // Compress image to reduce size
                const compressedUri = await compressImage(uri, EXPORT_CONFIG.IMAGE_QUALITY);
                
                // Read as base64 with limited size
                const base64 = await FileSystem.readAsStringAsync(compressedUri, { 
                    encoding: FileSystem.EncodingType.Base64 
                });
                
                return `<img src="data:image/jpeg;base64,${base64}" style="max-width: 100%; height: auto;" />`;
            } catch (e) {
                console.warn('Image compression failed, using original:', e);
                // Fallback to original image
                const base64 = await FileSystem.readAsStringAsync(uri, { 
                    encoding: FileSystem.EncodingType.Base64 
                });
                return `<img src="data:image/jpeg;base64,${base64}" style="max-width: 100%; height: auto;" />`;
            }
        }
        
        // For Firebase images, use directly
        return `<img src="${uri}" style="max-width: 100%; height: auto;" />`;
    } catch (e) {
        console.warn('Image processing failed:', e);
        return '<p><i>Image not available</i></p>';
    }
};

// Function to process sessions in batches
const processSessionsBatch = async (sessions, startIndex, batchSize, onProgress) => {
    const endIndex = Math.min(startIndex + batchSize, sessions.length);
    const batch = sessions.slice(startIndex, endIndex);
    
    let batchHtml = '';
    
    for (let i = 0; i < batch.length; i++) {
        const s = batch[i];
        const sessionIndex = startIndex + i;
        
        // Update progress
        if (onProgress) {
            onProgress(sessionIndex + 1, sessions.length);
        }
        
        // Process photos with limit
        const photos = s.photos || [];
        const limitedPhotos = photos.slice(0, EXPORT_CONFIG.MAX_IMAGES_PER_SESSION);
        
        const photoPromises = limitedPhotos.map((uri, index) => imageToHtml(uri, index));
        const photoHtmls = await Promise.all(photoPromises);
        
        // Add message if photos were truncated
        const truncatedMessage = photos.length > EXPORT_CONFIG.MAX_IMAGES_PER_SESSION 
            ? `<p><i>... and ${photos.length - EXPORT_CONFIG.MAX_IMAGES_PER_SESSION} more photos</i></p>`
            : '';
        
        batchHtml += `
            <div class="session">
                <div class="session-header">
                    <h3>${s.name}</h3>
                    <span>${new Date(s.startedAt).toLocaleDateString('en-US')}</span>
                </div>
                <div class="details-grid">
                    <p><b>Employer:</b> ${s.employer || 'N/A'}</p>
                    <p><b>Location:</b> ${s.location || 'N/A'}</p>
                    <p><b>Hours:</b> ${s.hours || 0}h</p>
                    <p><b>Height:</b> ${s.height || 0}m</p>
                    <p class="full-width"><b>Methods:</b> ${s.methods || 'N/A'}</p>
                    <p class="full-width"><b>Coworkers:</b> ${s.coworkers || 'N/A'}</p>
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
        return Alert.alert("Export", "No sessions to export.");
    }
    
    // Timeout to avoid blocking
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Export timeout')), EXPORT_CONFIG.TIMEOUT_MS);
    });
    
    try {
        // Calculate totals
        const totalHours = sessionsToExport.reduce((acc, s) => acc + (Number(s.hours) || 0), 0);
        const totalImages = sessionsToExport.reduce((acc, s) => acc + (s.photos?.length || 0), 0);
        
        // Warn if many images
        if (totalImages > 20) {
            const shouldContinue = await new Promise((resolve) => {
                Alert.alert(
                    "Export with many images",
                    `This export contains ${totalImages} images and may take time. Continue?`,
                    [
                        { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
                        { text: "Continue", onPress: () => resolve(true) }
                    ]
                );
            });
            
            if (!shouldContinue) return;
        }
        
        // Process by batch with progress
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
            
            // Small pause to avoid blocking UI
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Optimized CSS without external dependencies
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
                        <h1>Rope Access Portfolio</h1>
                        <p><strong>Technician:</strong> ${user?.name || 'N/A'}</p>
                        <p><strong>Export Date:</strong> ${new Date().toLocaleDateString('en-US')}</p>
                    </div>
                    <div class="summary">
                        <p><b>Total Hours:</b> ${totalHours}h</p>
                        <p><b>Number of Sessions:</b> ${sessionsToExport.length}</p>
                    </div>
                    ${sessionsHtml}
                </body>
            </html>
        `;
        
        // Create PDF with timeout
        const pdfPromise = Print.printToFileAsync({ html });
        const { uri } = await Promise.race([pdfPromise, timeoutPromise]);
        
        // Share file
        await Sharing.shareAsync(uri, { 
            mimeType: 'application/pdf', 
            dialogTitle: 'Export Portfolio' 
        });
        
    } catch (error) {
        console.error('Export error:', error);
        
        if (error.message === 'Export timeout') {
            Alert.alert(
                "Export interrupted", 
                "Export took too long. Try with fewer sessions or images."
            );
        } else {
            Alert.alert(
                "Export failed", 
                "Could not create or share PDF. Check storage space."
            );
        }
    }
};
