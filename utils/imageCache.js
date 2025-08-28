import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Cache configuration
const CACHE_CONFIG = {
    MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
    MAX_CACHE_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
    CACHE_DIR: `${FileSystem.cacheDirectory}image-cache/`,
    METADATA_KEY: 'image_cache_metadata'
};

// Cache metadata structure
class CacheMetadata {
    constructor() {
        this.entries = new Map();
        this.totalSize = 0;
        this.lastCleanup = Date.now();
    }

    addEntry(key, size, timestamp) {
        this.entries.set(key, { size, timestamp });
        this.totalSize += size;
    }

    removeEntry(key) {
        const entry = this.entries.get(key);
        if (entry) {
            this.totalSize -= entry.size;
            this.entries.delete(key);
        }
    }

    getEntry(key) {
        return this.entries.get(key);
    }

    getAllEntries() {
        return Array.from(this.entries.entries()).map(([key, value]) => ({
            key,
            ...value
        }));
    }

    clear() {
        this.entries.clear();
        this.totalSize = 0;
    }

    toJSON() {
        return {
            entries: Object.fromEntries(this.entries),
            totalSize: this.totalSize,
            lastCleanup: this.lastCleanup
        };
    }

    static fromJSON(data) {
        const metadata = new CacheMetadata();
        if (data.entries) {
            metadata.entries = new Map(Object.entries(data.entries));
        }
        metadata.totalSize = data.totalSize || 0;
        metadata.lastCleanup = data.lastCleanup || Date.now();
        return metadata;
    }
}

class ImageCache {
    constructor() {
        this.metadata = new CacheMetadata();
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            // Ensure cache directory exists
            await FileSystem.makeDirectoryAsync(CACHE_CONFIG.CACHE_DIR, { intermediates: true });
            
            // Load metadata from storage
            await this.loadMetadata();
            
            // Perform cleanup if needed
            await this.cleanup();
            
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize image cache:', error);
        }
    }

    async loadMetadata() {
        try {
            const metadataString = await AsyncStorage.getItem(CACHE_CONFIG.METADATA_KEY);
            if (metadataString) {
                const data = JSON.parse(metadataString);
                this.metadata = CacheMetadata.fromJSON(data);
            }
        } catch (error) {
            console.error('Failed to load cache metadata:', error);
            this.metadata = new CacheMetadata();
        }
    }

    async saveMetadata() {
        try {
            await AsyncStorage.setItem(CACHE_CONFIG.METADATA_KEY, JSON.stringify(this.metadata));
        } catch (error) {
            console.error('Failed to save cache metadata:', error);
        }
    }

    generateCacheKey(url) {
        // Create a hash-like key from URL
        return url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 100);
    }

    getCachePath(key) {
        return `${CACHE_CONFIG.CACHE_DIR}${key}`;
    }

    async getCachedImage(url) {
        await this.initialize();
        
        const key = this.generateCacheKey(url);
        const cachePath = this.getCachePath(key);
        const entry = this.metadata.getEntry(key);

        if (!entry) {
            return null;
        }

        // Check if file exists and is not expired
        try {
            const fileInfo = await FileSystem.getInfoAsync(cachePath);
            if (!fileInfo.exists) {
                this.metadata.removeEntry(key);
                await this.saveMetadata();
                return null;
            }

            const age = Date.now() - entry.timestamp;
            if (age > CACHE_CONFIG.MAX_CACHE_AGE) {
                await this.removeCachedImage(url);
                return null;
            }

            return cachePath;
        } catch (error) {
            console.error('Error checking cached image:', error);
            return null;
        }
    }

    async cacheImage(url, imageUri) {
        await this.initialize();
        
        const key = this.generateCacheKey(url);
        const cachePath = this.getCachePath(key);

        try {
            // Check if we need to clean up cache first
            await this.ensureCacheSpace();

            // Copy image to cache
            await FileSystem.copyAsync({
                from: imageUri,
                to: cachePath
            });

            // Get file size
            const fileInfo = await FileSystem.getInfoAsync(cachePath);
            const size = fileInfo.size || 0;

            // Update metadata
            this.metadata.addEntry(key, size, Date.now());
            await this.saveMetadata();

            return cachePath;
        } catch (error) {
            console.error('Failed to cache image:', error);
            // Clean up partial file if it exists
            try {
                await FileSystem.deleteAsync(cachePath, { idempotent: true });
            } catch (cleanupError) {
                // Ignore cleanup errors
            }
            throw error;
        }
    }

    async removeCachedImage(url) {
        const key = this.generateCacheKey(url);
        const cachePath = this.getCachePath(key);

        try {
            await FileSystem.deleteAsync(cachePath, { idempotent: true });
            this.metadata.removeEntry(key);
            await this.saveMetadata();
        } catch (error) {
            console.error('Failed to remove cached image:', error);
        }
    }

    async ensureCacheSpace() {
        if (this.metadata.totalSize <= CACHE_CONFIG.MAX_CACHE_SIZE) {
            return;
        }

        // Sort entries by timestamp (oldest first)
        const entries = this.metadata.getAllEntries()
            .sort((a, b) => a.timestamp - b.timestamp);

        // Remove oldest entries until we're under the limit
        for (const entry of entries) {
            if (this.metadata.totalSize <= CACHE_CONFIG.MAX_CACHE_SIZE * 0.8) {
                break; // Leave 20% buffer
            }

            await this.removeCachedImage(entry.key);
        }
    }

    async cleanup() {
        const now = Date.now();
        const entries = this.metadata.getAllEntries();

        for (const entry of entries) {
            const age = now - entry.timestamp;
            if (age > CACHE_CONFIG.MAX_CACHE_AGE) {
                await this.removeCachedImage(entry.key);
            }
        }

        this.metadata.lastCleanup = now;
        await this.saveMetadata();
    }

    async clearCache() {
        try {
            await FileSystem.deleteAsync(CACHE_CONFIG.CACHE_DIR, { idempotent: true });
            await FileSystem.makeDirectoryAsync(CACHE_CONFIG.CACHE_DIR, { intermediates: true });
            this.metadata.clear();
            await this.saveMetadata();
        } catch (error) {
            console.error('Failed to clear cache:', error);
        }
    }

    async getCacheStats() {
        await this.initialize();
        
        return {
            totalSize: this.metadata.totalSize,
            entryCount: this.metadata.entries.size,
            maxSize: CACHE_CONFIG.MAX_CACHE_SIZE,
            lastCleanup: this.metadata.lastCleanup
        };
    }
}

// Export singleton instance
export const imageCache = new ImageCache();

// Utility functions for easy use
export const getCachedImage = (url) => imageCache.getCachedImage(url);
export const cacheImage = (url, imageUri) => imageCache.cacheImage(url, imageUri);
export const removeCachedImage = (url) => imageCache.removeCachedImage(url);
export const clearImageCache = () => imageCache.clearCache();
export const getImageCacheStats = () => imageCache.getCacheStats();
