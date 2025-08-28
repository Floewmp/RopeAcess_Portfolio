import {
    imageCache,
    getCachedImage,
    cacheImage,
    removeCachedImage,
    clearImageCache,
    getImageCacheStats
} from '../../utils/imageCache';

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
    cacheDirectory: '/mock/cache/',
    makeDirectoryAsync: jest.fn(),
    getInfoAsync: jest.fn(),
    copyAsync: jest.fn(),
    deleteAsync: jest.fn(),
    EncodingType: {
        Base64: 'base64'
    }
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn()
}));

describe('Image Cache', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset the singleton instance
        imageCache.metadata = new (require('../../utils/imageCache').CacheMetadata)();
        imageCache.isInitialized = false;
    });

    describe('CacheMetadata', () => {
        test('should add and remove entries correctly', () => {
            const metadata = new (require('../../utils/imageCache').CacheMetadata)();
            
            metadata.addEntry('test-key', 1024, Date.now());
            expect(metadata.totalSize).toBe(1024);
            expect(metadata.entries.size).toBe(1);
            
            metadata.removeEntry('test-key');
            expect(metadata.totalSize).toBe(0);
            expect(metadata.entries.size).toBe(0);
        });

        test('should serialize and deserialize correctly', () => {
            const metadata = new (require('../../utils/imageCache').CacheMetadata)();
            metadata.addEntry('test-key', 1024, Date.now());
            
            const json = metadata.toJSON();
            const restored = require('../../utils/imageCache').CacheMetadata.fromJSON(json);
            
            expect(restored.totalSize).toBe(metadata.totalSize);
            expect(restored.entries.size).toBe(metadata.entries.size);
        });
    });

    describe('generateCacheKey', () => {
        test('should generate consistent keys', () => {
            const url1 = 'https://example.com/image.jpg';
            const url2 = 'https://example.com/image.jpg';
            const url3 = 'https://example.com/different.jpg';
            
            const key1 = imageCache.generateCacheKey(url1);
            const key2 = imageCache.generateCacheKey(url2);
            const key3 = imageCache.generateCacheKey(url3);
            
            expect(key1).toBe(key2);
            expect(key1).not.toBe(key3);
        });

        test('should handle special characters', () => {
            const url = 'https://example.com/image with spaces & symbols.jpg';
            const key = imageCache.generateCacheKey(url);
            
            expect(key).not.toContain(' ');
            expect(key).not.toContain('&');
            expect(key.length).toBeLessThanOrEqual(100);
        });
    });

    describe('getCachedImage', () => {
        test('should return null for non-existent cache entry', async () => {
            const { getInfoAsync } = require('expo-file-system');
            getInfoAsync.mockResolvedValue({ exists: false });
            
            const result = await getCachedImage('https://example.com/image.jpg');
            expect(result).toBeNull();
        });

        test('should return cached image path when available', async () => {
            const { getInfoAsync } = require('expo-file-system');
            getInfoAsync.mockResolvedValue({ exists: true });
            
            // Mock metadata with an entry
            imageCache.metadata.addEntry('test_key', 1024, Date.now());
            
            const result = await getCachedImage('https://example.com/image.jpg');
            expect(result).toContain('test_key');
        });
    });

    describe('cacheImage', () => {
        test('should cache image successfully', async () => {
            const { copyAsync, getInfoAsync } = require('expo-file-system');
            copyAsync.mockResolvedValue();
            getInfoAsync.mockResolvedValue({ size: 1024 });
            
            const { setItem } = require('@react-native-async-storage/async-storage');
            setItem.mockResolvedValue();
            
            const result = await cacheImage('https://example.com/image.jpg', 'file://local/image.jpg');
            
            expect(copyAsync).toHaveBeenCalled();
            expect(setItem).toHaveBeenCalled();
            expect(result).toContain('image_cache');
        });

        test('should handle cache errors gracefully', async () => {
            const { copyAsync } = require('expo-file-system');
            copyAsync.mockRejectedValue(new Error('Copy failed'));
            
            await expect(cacheImage('https://example.com/image.jpg', 'file://local/image.jpg'))
                .rejects.toThrow('Copy failed');
        });
    });

    describe('removeCachedImage', () => {
        test('should remove cached image', async () => {
            const { deleteAsync } = require('expo-file-system');
            deleteAsync.mockResolvedValue();
            
            const { setItem } = require('@react-native-async-storage/async-storage');
            setItem.mockResolvedValue();
            
            // Add an entry first
            imageCache.metadata.addEntry('test_key', 1024, Date.now());
            
            await removeCachedImage('https://example.com/image.jpg');
            
            expect(deleteAsync).toHaveBeenCalled();
            expect(setItem).toHaveBeenCalled();
            expect(imageCache.metadata.entries.size).toBe(0);
        });
    });

    describe('clearCache', () => {
        test('should clear all cached images', async () => {
            const { deleteAsync, makeDirectoryAsync } = require('expo-file-system');
            deleteAsync.mockResolvedValue();
            makeDirectoryAsync.mockResolvedValue();
            
            const { setItem } = require('@react-native-async-storage/async-storage');
            setItem.mockResolvedValue();
            
            // Add some entries
            imageCache.metadata.addEntry('key1', 1024, Date.now());
            imageCache.metadata.addEntry('key2', 2048, Date.now());
            
            await clearImageCache();
            
            expect(deleteAsync).toHaveBeenCalled();
            expect(makeDirectoryAsync).toHaveBeenCalled();
            expect(setItem).toHaveBeenCalled();
            expect(imageCache.metadata.entries.size).toBe(0);
            expect(imageCache.metadata.totalSize).toBe(0);
        });
    });

    describe('getCacheStats', () => {
        test('should return cache statistics', async () => {
            // Add some entries
            imageCache.metadata.addEntry('key1', 1024, Date.now());
            imageCache.metadata.addEntry('key2', 2048, Date.now());
            
            const stats = await getImageCacheStats();
            
            expect(stats.totalSize).toBe(3072);
            expect(stats.entryCount).toBe(2);
            expect(stats.maxSize).toBe(100 * 1024 * 1024); // 100MB
            expect(stats.lastCleanup).toBeDefined();
        });
    });

    describe('ensureCacheSpace', () => {
        test('should remove old entries when cache is full', async () => {
            const { deleteAsync } = require('expo-file-system');
            deleteAsync.mockResolvedValue();
            
            const { setItem } = require('@react-native-async-storage/async-storage');
            setItem.mockResolvedValue();
            
            // Add entries to exceed cache limit
            const largeSize = 60 * 1024 * 1024; // 60MB each
            imageCache.metadata.addEntry('old1', largeSize, Date.now() - 10000);
            imageCache.metadata.addEntry('old2', largeSize, Date.now() - 5000);
            imageCache.metadata.addEntry('new1', largeSize, Date.now());
            
            await imageCache.ensureCacheSpace();
            
            expect(deleteAsync).toHaveBeenCalled();
            expect(setItem).toHaveBeenCalled();
        });
    });
});
