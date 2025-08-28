# Testing Guide

This directory contains comprehensive tests for the RopeAccess Portfolio app.

## Test Structure

```
__tests__/
├── components/          # Component tests
│   ├── Button.test.js
│   └── ...
├── utils/              # Utility function tests
│   ├── validation.test.js
│   ├── errorHandler.test.js
│   ├── imageCache.test.js
│   └── ...
└── README.md           # This file
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Continuous Integration
```bash
npm run test:ci
```

## Test Categories

### 1. Unit Tests
- **Validation Utils** (`utils/validation.test.js`)
  - Email validation
  - Password validation (8+ characters)
  - Required field validation
  - Number validation
  - Session data validation

- **Error Handler** (`utils/errorHandler.test.js`)
  - Error categorization
  - User-friendly error messages
  - Firebase error mapping
  - Error handling utilities

- **Image Cache** (`utils/imageCache.test.js`)
  - Cache metadata management
  - Image caching and retrieval
  - Cache cleanup and space management
  - Cache statistics

### 2. Component Tests
- **Button Component** (`components/Button.test.js`)
  - Rendering with different props
  - User interactions
  - Loading states
  - Disabled states

## Test Coverage Goals

- **Minimum Coverage**: 80%
- **Critical Paths**: 100%
- **User-facing Features**: 90%

## Writing New Tests

### Component Test Example
```javascript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
    test('should render correctly', () => {
        const { getByText } = render(<MyComponent />);
        expect(getByText('Expected Text')).toBeTruthy();
    });

    test('should handle user interaction', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(<MyComponent onPress={mockOnPress} />);
        
        fireEvent.press(getByText('Button'));
        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
});
```

### Utility Test Example
```javascript
import { myUtilityFunction } from '../../utils/myUtility';

describe('myUtilityFunction', () => {
    test('should handle valid input', () => {
        const result = myUtilityFunction('valid input');
        expect(result).toBe('expected output');
    });

    test('should handle invalid input', () => {
        expect(() => myUtilityFunction('')).toThrow('Invalid input');
    });
});
```

## Mocking Strategy

### External Dependencies
- **Firebase**: Mocked to avoid network calls
- **Expo Modules**: Mocked for consistent test environment
- **React Navigation**: Mocked to avoid navigation complexity

### File System
- **AsyncStorage**: Mocked for data persistence
- **FileSystem**: Mocked for file operations

## Best Practices

1. **Test Naming**: Use descriptive test names that explain the expected behavior
2. **Arrange-Act-Assert**: Structure tests with clear sections
3. **Mock External Dependencies**: Don't test third-party libraries
4. **Test Edge Cases**: Include error conditions and boundary values
5. **Keep Tests Fast**: Avoid unnecessary async operations
6. **Isolate Tests**: Each test should be independent

## Continuous Integration

Tests are automatically run on:
- Pull requests
- Main branch commits
- Release builds

## Debugging Tests

### Verbose Output
```bash
npm test -- --verbose
```

### Single Test File
```bash
npm test -- Button.test.js
```

### Watch Mode with Coverage
```bash
npm test -- --watch --coverage
```

## Common Issues

### Mock Not Working
- Ensure mocks are defined in `jest.setup.js`
- Check import paths are correct
- Verify mock is called before the test

### Async Test Failures
- Use `async/await` for async operations
- Add proper error handling
- Check for unhandled promise rejections

### Component Not Rendering
- Check for missing props
- Verify component exports
- Ensure all dependencies are mocked
