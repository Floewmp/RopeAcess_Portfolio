// Validation utilities for form inputs
import { APP_CONFIG, ERROR_MESSAGES } from './constants';

export const validateEmail = (email) => {
    if (!email || !email.trim()) {
        return { isValid: false, message: ERROR_MESSAGES.VALIDATION.EMAIL_REQUIRED };
    }
    if (!APP_CONFIG.VALIDATION.EMAIL_REGEX.test(email)) {
        return { isValid: false, message: ERROR_MESSAGES.VALIDATION.EMAIL_INVALID };
    }
    return { isValid: true, message: '' };
};

export const validatePassword = (password) => {
    if (!password || password.length < APP_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH) {
        return { isValid: false, message: ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT };
    }
    return { isValid: true, message: '' };
};

export const validateRequired = (value, fieldName) => {
    if (!value || !value.trim()) {
        return { isValid: false, message: `${fieldName} ${ERROR_MESSAGES.VALIDATION.FIELD_REQUIRED.toLowerCase()}` };
    }
    return { isValid: true, message: '' };
};

export const validateNumber = (value, fieldName, min = APP_CONFIG.VALIDATION.NUMBER_MIN) => {
    const num = Number(value);
    if (isNaN(num)) {
        return { isValid: false, message: `${fieldName} ${ERROR_MESSAGES.VALIDATION.NUMBER_INVALID.toLowerCase()}` };
    }
    if (num < min) {
        return { isValid: false, message: `${fieldName} ${ERROR_MESSAGES.VALIDATION.NUMBER_TOO_SMALL.toLowerCase()} ${min}` };
    }
    return { isValid: true, message: '' };
};

export const validateSessionData = (sessionData) => {
    const errors = {};

    // Required fields
    const nameValidation = validateRequired(sessionData.name, 'Job name');
    if (!nameValidation.isValid) errors.name = nameValidation.message;

    const employerValidation = validateRequired(sessionData.employer, 'Employer');
    if (!employerValidation.isValid) errors.employer = employerValidation.message;

    const locationValidation = validateRequired(sessionData.location, 'Location');
    if (!locationValidation.isValid) errors.location = locationValidation.message;

    // Optional numeric fields
    if (sessionData.height) {
        const heightValidation = validateNumber(sessionData.height, 'Height', 0);
        if (!heightValidation.isValid) errors.height = heightValidation.message;
    }

    if (sessionData.hours) {
        const hoursValidation = validateNumber(sessionData.hours, 'Hours', 0);
        if (!hoursValidation.isValid) errors.hours = hoursValidation.message;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
