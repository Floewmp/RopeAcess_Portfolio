import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';
import { globalStyles } from '../../styles/globalStyles';
import Button from '../../components/Button';
import Logo from '../../components/Logo';

const SignUpScreen = ({ navigation }) => {
    const { signUp } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        idNumber: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Required fields
        const nameValidation = validateRequired(formData.name, 'User name');
        if (!nameValidation.isValid) {
            newErrors.name = nameValidation.message;
        }
        
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
            newErrors.email = emailValidation.message;
        }
        
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.message;
        }
        
        // Confirm password
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async () => {
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        try {
            const profileData = { 
                name: formData.name, 
                idNumber: formData.idNumber, 
                phone: formData.phone 
            };
            await signUp(formData.email, formData.password, profileData);
        } catch (error) {
            // Error is already handled in the context
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <Text style={globalStyles.brand}>Subscribe</Text>
                
                {/* Logo under the title */}
                <View style={globalStyles.logoContainer}>
                    <Logo size={80} />
                </View>
                
                <View style={globalStyles.card}>
                    <Text style={globalStyles.label}>User Name *</Text>
                    <TextInput 
                        style={[globalStyles.input, errors.name && { borderColor: '#e11d48' }]} 
                        value={formData.name} 
                        onChangeText={(text) => updateFormData('name', text)} 
                        placeholder="John Doe" 
                        autoCapitalize="words" 
                    />
                    {errors.name && <Text style={{ color: '#e11d48', fontSize: 12, marginTop: 4 }}>{errors.name}</Text>}
                    
                    <Text style={globalStyles.label}>Email *</Text>
                    <TextInput 
                        style={[globalStyles.input, errors.email && { borderColor: '#e11d48' }]} 
                        value={formData.email} 
                        onChangeText={(text) => updateFormData('email', text)} 
                        placeholder="your@email.com" 
                        autoCapitalize="none" 
                        keyboardType="email-address" 
                    />
                    {errors.email && <Text style={{ color: '#e11d48', fontSize: 12, marginTop: 4 }}>{errors.email}</Text>}
                    
                    <Text style={globalStyles.label}>Password *</Text>
                    <TextInput 
                        style={[globalStyles.input, errors.password && { borderColor: '#e11d48' }]} 
                        value={formData.password} 
                        onChangeText={(text) => updateFormData('password', text)} 
                        placeholder="At least 6 characters" 
                        secureTextEntry 
                    />
                    {errors.password && <Text style={{ color: '#e11d48', fontSize: 12, marginTop: 4 }}>{errors.password}</Text>}
                    
                    <Text style={globalStyles.label}>Confirm Password *</Text>
                    <TextInput 
                        style={[globalStyles.input, errors.confirmPassword && { borderColor: '#e11d48' }]} 
                        value={formData.confirmPassword} 
                        onChangeText={(text) => updateFormData('confirmPassword', text)} 
                        placeholder="Repeat password" 
                        secureTextEntry 
                    />
                    {errors.confirmPassword && <Text style={{ color: '#e11d48', fontSize: 12, marginTop: 4 }}>{errors.confirmPassword}</Text>}
                    
                    <Text style={globalStyles.label}>IRATA / SPRAT / CQP Number (Optional)</Text>
                    <TextInput 
                        style={globalStyles.input} 
                        value={formData.idNumber} 
                        onChangeText={(text) => updateFormData('idNumber', text)} 
                        placeholder="12345" 
                    />
                    
                    <Text style={globalStyles.label}>Phone (Optional)</Text>
                    <TextInput 
                        style={globalStyles.input} 
                        value={formData.phone} 
                        onChangeText={(text) => updateFormData('phone', text)} 
                        placeholder="+1234567890" 
                        keyboardType="phone-pad" 
                    />
                    
                    <View style={{height: 16}} />
                    <Button label="Subscribe" onPress={handleSignUp} loading={loading} />
                    
                    <Pressable onPress={() => navigation.navigate('Login')}>
                        <Text style={globalStyles.linkText}>Already have an account? Login</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
};

export default SignUpScreen;
