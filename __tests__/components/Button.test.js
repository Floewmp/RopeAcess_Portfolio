import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../components/Button';

describe('Button Component', () => {
    test('should render with default props', () => {
        const { getByText } = render(<Button label="Test Button" onPress={() => {}} />);
        
        const button = getByText('Test Button');
        expect(button).toBeTruthy();
    });

    test('should call onPress when pressed', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(<Button label="Test Button" onPress={mockOnPress} />);
        
        const button = getByText('Test Button');
        fireEvent.press(button);
        
        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    test('should not call onPress when disabled', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(
            <Button label="Test Button" onPress={mockOnPress} disabled={true} />
        );
        
        const button = getByText('Test Button');
        fireEvent.press(button);
        
        expect(mockOnPress).not.toHaveBeenCalled();
    });

    test('should show loading state', () => {
        const { getByText } = render(
            <Button label="Test Button" onPress={() => {}} loading={true} />
        );
        
        // Should show loading text instead of label
        expect(() => getByText('Test Button')).toThrow();
        expect(() => getByText('Loading...')).not.toThrow();
    });

    test('should render with different kinds', () => {
        const { getByText, rerender } = render(
            <Button label="Primary Button" onPress={() => {}} kind="primary" />
        );
        
        expect(getByText('Primary Button')).toBeTruthy();
        
        rerender(<Button label="Secondary Button" onPress={() => {}} kind="secondary" />);
        expect(getByText('Secondary Button')).toBeTruthy();
        
        rerender(<Button label="Danger Button" onPress={() => {}} kind="danger" />);
        expect(getByText('Danger Button')).toBeTruthy();
    });

    test('should apply custom styles', () => {
        const customStyle = { backgroundColor: 'red' };
        const { getByText } = render(
            <Button label="Custom Button" onPress={() => {}} style={customStyle} />
        );
        
        const button = getByText('Custom Button');
        expect(button).toBeTruthy();
    });
});
