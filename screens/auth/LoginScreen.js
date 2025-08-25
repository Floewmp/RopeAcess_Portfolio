import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validation';
import { globalStyles } from '../../styles/globalStyles';
import Button from '../../components/Button';
import Logo from '../../components/Logo';

const LoginScreen = ({ navigation }) => {
    const { login, passwordReset, continueOffline } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            newErrors.email = emailValidation.message;
        }
        
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.message;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            // Error is already handled in the context
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = () => {
        if (!email.trim()) {
            setErrors({ email: 'Please enter your email address first.' });
            return;
        }
        passwordReset(email);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
            <Text style={globalStyles.brand}>ROPE ACCESS PORTFOLIO</Text>
            
            {/* Logo under the title */}
            <View style={globalStyles.logoContainer}>
                <Logo size={80} />
            </View>
            
            <View style={globalStyles.card}>
                <Text style={globalStyles.cardTitle}>Login</Text>
                
                <Text style={globalStyles.label}>Email</Text>
                <TextInput 
                    style={[globalStyles.input, errors.email && { borderColor: '#e11d48' }]} 
                    value={email} 
                    onChangeText={(text) => {
                        setEmail(text);
                        if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                    }} 
                    placeholder="your@email.com" 
                    autoCapitalize="none" 
                    keyboardType="email-address" 
                />
                {errors.email && <Text style={{ color: '#e11d48', fontSize: 12, marginTop: 4 }}>{errors.email}</Text>}
                
                <Text style={globalStyles.label}>Password</Text>
                <TextInput 
                    style={[globalStyles.input, errors.password && { borderColor: '#e11d48' }]} 
                    value={password} 
                    onChangeText={(text) => {
                        setPassword(text);
                        if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                    }} 
                    placeholder="********" 
                    secureTextEntry 
                />
                {errors.password && <Text style={{ color: '#e11d48', fontSize: 12, marginTop: 4 }}>{errors.password}</Text>}
                
                <Pressable onPress={handlePasswordReset}>
                    <Text style={globalStyles.linkText}>Forgot Password?</Text>
                </Pressable>
                
                <View style={{height: 8}} />
                <Button label="Login" onPress={handleLogin} loading={loading} />
                
                <Pressable onPress={() => navigation.navigate('SignUp')}>
                    <Text style={globalStyles.linkText}>Don't have an account? Subscribe</Text>
                </Pressable>
                
                <View style={{height: 12}} />
                <Button label="Continue Offline" onPress={continueOffline} kind="secondary" />
            </View>
        </View>
    );
};

export default LoginScreen;
