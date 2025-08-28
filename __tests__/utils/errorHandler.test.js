import {
    ERROR_CATEGORIES,
    USER_FRIENDLY_MESSAGES,
    categorizeError,
    showUserFriendlyError,
    handleError,
    withErrorHandling
} from '../../utils/errorHandler';

// Mock Alert
jest.mock('react-native', () => ({
    Alert: {
        alert: jest.fn()
    }
}));

describe('Error Handler Utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('ERROR_CATEGORIES', () => {
        test('should have all required categories', () => {
            expect(ERROR_CATEGORIES.NETWORK).toBe('network');
            expect(ERROR_CATEGORIES.AUTHENTICATION).toBe('authentication');
            expect(ERROR_CATEGORIES.PERMISSIONS).toBe('permissions');
            expect(ERROR_CATEGORIES.STORAGE).toBe('storage');
            expect(ERROR_CATEGORIES.VALIDATION).toBe('validation');
            expect(ERROR_CATEGORIES.UNKNOWN).toBe('unknown');
        });
    });

    describe('USER_FRIENDLY_MESSAGES', () => {
        test('should have messages for all categories', () => {
            Object.values(ERROR_CATEGORIES).forEach(category => {
                expect(USER_FRIENDLY_MESSAGES[category]).toBeDefined();
                expect(USER_FRIENDLY_MESSAGES[category].title).toBeDefined();
                expect(USER_FRIENDLY_MESSAGES[category].message).toBeDefined();
                expect(USER_FRIENDLY_MESSAGES[category].action).toBeDefined();
            });
        });
    });

    describe('categorizeError', () => {
        test('should categorize Firebase auth errors', () => {
            const authErrors = [
                { code: 'auth/user-not-found' },
                { code: 'auth/wrong-password' },
                { code: 'auth/too-many-requests' }
            ];

            authErrors.forEach(error => {
                expect(categorizeError(error)).toBe(ERROR_CATEGORIES.AUTHENTICATION);
            });
        });

        test('should categorize Firebase validation errors', () => {
            const validationErrors = [
                { code: 'auth/email-already-in-use' },
                { code: 'auth/weak-password' },
                { code: 'auth/invalid-email' }
            ];

            validationErrors.forEach(error => {
                expect(categorizeError(error)).toBe(ERROR_CATEGORIES.VALIDATION);
            });
        });

        test('should categorize network errors', () => {
            const networkErrors = [
                { code: 'auth/network-request-failed' },
                { code: 'firestore/unavailable' },
                { message: 'Network request failed' },
                { message: 'Connection timeout' }
            ];

            networkErrors.forEach(error => {
                expect(categorizeError(error)).toBe(ERROR_CATEGORIES.NETWORK);
            });
        });

        test('should categorize permission errors', () => {
            const permissionErrors = [
                { code: 'storage/unauthorized' },
                { code: 'firestore/permission-denied' },
                { message: 'Permission denied' },
                { message: 'Access denied' }
            ];

            permissionErrors.forEach(error => {
                expect(categorizeError(error)).toBe(ERROR_CATEGORIES.PERMISSIONS);
            });
        });

        test('should categorize storage errors', () => {
            const storageErrors = [
                { code: 'storage/quota-exceeded' },
                { code: 'storage/object-not-found' },
                { message: 'Storage error' },
                { message: 'Upload failed' }
            ];

            storageErrors.forEach(error => {
                expect(categorizeError(error)).toBe(ERROR_CATEGORIES.STORAGE);
            });
        });

        test('should return UNKNOWN for unrecognized errors', () => {
            const unknownErrors = [
                null,
                undefined,
                {},
                { code: 'unknown/error' },
                { message: 'Some random error' }
            ];

            unknownErrors.forEach(error => {
                expect(categorizeError(error)).toBe(ERROR_CATEGORIES.UNKNOWN);
            });
        });
    });

    describe('showUserFriendlyError', () => {
        test('should show alert with correct category message', () => {
            const { Alert } = require('react-native');
            const error = { code: 'auth/user-not-found' };

            showUserFriendlyError(error);

            expect(Alert.alert).toHaveBeenCalledWith(
                USER_FRIENDLY_MESSAGES[ERROR_CATEGORIES.AUTHENTICATION].title,
                USER_FRIENDLY_MESSAGES[ERROR_CATEGORIES.AUTHENTICATION].message,
                expect.any(Array)
            );
        });

        test('should show custom message when provided', () => {
            const { Alert } = require('react-native');
            const error = { code: 'auth/user-not-found' };
            const customMessage = 'Custom error message';

            showUserFriendlyError(error, customMessage);

            expect(Alert.alert).toHaveBeenCalledWith(
                USER_FRIENDLY_MESSAGES[ERROR_CATEGORIES.AUTHENTICATION].title,
                customMessage,
                expect.any(Array)
            );
        });
    });

    describe('handleError', () => {
        test('should show alert by default', () => {
            const { Alert } = require('react-native');
            const error = new Error('Test error');

            handleError(error);

            expect(Alert.alert).toHaveBeenCalled();
        });

        test('should not show alert when showAlert is false', () => {
            const { Alert } = require('react-native');
            const error = new Error('Test error');

            handleError(error, { showAlert: false });

            expect(Alert.alert).not.toHaveBeenCalled();
        });

        test('should call custom error handler when provided', () => {
            const customHandler = jest.fn();
            const error = new Error('Test error');

            handleError(error, { onError: customHandler });

            expect(customHandler).toHaveBeenCalledWith(error);
        });

        test('should return fallback value when provided', () => {
            const error = new Error('Test error');
            const fallback = 'fallback value';

            const result = handleError(error, { fallback, showAlert: false });

            expect(result).toBe(fallback);
        });

        test('should throw error when no fallback provided', () => {
            const error = new Error('Test error');

            expect(() => {
                handleError(error, { showAlert: false });
            }).toThrow(error);
        });
    });

    describe('withErrorHandling', () => {
        test('should wrap async function with error handling', async () => {
            const { Alert } = require('react-native');
            const asyncFunction = jest.fn().mockRejectedValue(new Error('Test error'));

            const wrappedFunction = withErrorHandling(asyncFunction);
            await wrappedFunction();

            expect(Alert.alert).toHaveBeenCalled();
        });

        test('should return function result when no error occurs', async () => {
            const expectedResult = 'success';
            const asyncFunction = jest.fn().mockResolvedValue(expectedResult);

            const wrappedFunction = withErrorHandling(asyncFunction);
            const result = await wrappedFunction();

            expect(result).toBe(expectedResult);
        });

        test('should handle errors with custom options', async () => {
            const { Alert } = require('react-native');
            const customHandler = jest.fn();
            const asyncFunction = jest.fn().mockRejectedValue(new Error('Test error'));

            const wrappedFunction = withErrorHandling(asyncFunction, {
                onError: customHandler,
                showAlert: false
            });

            await wrappedFunction();

            expect(customHandler).toHaveBeenCalled();
            expect(Alert.alert).not.toHaveBeenCalled();
        });
    });
});
