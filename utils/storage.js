import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../config/firebase';
import { APP_CONFIG, ERROR_MESSAGES } from './constants';

export const uploadImageAsync = async (uri, userId) => {
    try {
        // Check if Firebase storage is available
        if (!storage) {
            throw new Error(ERROR_MESSAGES.STORAGE.UNAVAILABLE);
        }

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () { 
                resolve(xhr.response); 
            };
            xhr.onerror = function (e) { 
                reject(new TypeError("Network request failed")); 
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        const fileRef = ref(storage, `${APP_CONFIG.FIREBASE.STORAGE_PATH}/${userId}/${Date.now()}`);
        const result = await uploadBytesResumable(fileRef, blob);
        blob.close();
        return await getDownloadURL(result.ref);
    } catch (error) {
        if (__DEV__) {
            console.error('Image upload error:', error);
        }
        
        // Provide more specific error messages
        if (error.code === 'storage/unauthorized') {
            throw new Error(ERROR_MESSAGES.STORAGE.UNAUTHORIZED);
        } else if (error.code === 'storage/quota-exceeded') {
            throw new Error(ERROR_MESSAGES.STORAGE.QUOTA_EXCEEDED);
        } else if (error.code === 'storage/unauthenticated') {
            throw new Error(ERROR_MESSAGES.STORAGE.UNAUTHENTICATED);
        } else {
            throw new Error(`${ERROR_MESSAGES.STORAGE.UPLOAD_FAILED}: ${error.message}`);
        }
    }
};

export const compressImage = async (uri, quality = 0.8) => {
    // For now, we'll use the original image
    // In a production app, you might want to use a library like react-native-image-compression
    return uri;
};
