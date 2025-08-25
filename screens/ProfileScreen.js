import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword, validateRequired } from '../utils/validation';
import { globalStyles } from '../styles/globalStyles';
import { TopBar, FloatingBack } from '../components/Common';
import Button from '../components/Button';

const ProfileScreen = ({ navigation }) => {
    const { user, updateProfile, updatePassword } = useAuth();
    
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        idNumber: user?.idNumber || '',
        phone: user?.phone || ''
    });
    
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!user) {
            navigation.navigate('Home');
        }
    }, [user, navigation]);

    const updateProfileField = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const updatePasswordField = (field, value) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateProfileForm = () => {
        const newErrors = {};
        
        const nameValidation = validateRequired(profileData.name, 'User name');
        if (!nameValidation.isValid) {
            newErrors.name = nameValidation.message;
        }
        
        const emailValidation = validateEmail(profileData.email);
        if (!emailValidation.isValid) {
            newErrors.email = emailValidation.message;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePasswordForm = () => {
        const newErrors = {};
        
        if (!passwordData.newPassword) {
            newErrors.newPassword = 'Password cannot be empty';
        } else {
            const passwordValidation = validatePassword(passwordData.newPassword);
            if (!passwordValidation.isValid) {
                newErrors.newPassword = passwordValidation.message;
            }
        }
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfileUpdate = async () => {
        if (!validateProfileForm()) {
            return;
        }
        
        setProfileLoading(true);
        try {
            await updateProfile(profileData);
        } catch (error) {
            // Error is already handled in the context
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!validatePasswordForm()) {
            return;
        }
        
        setPasswordLoading(true);
        try {
            await updatePassword(passwordData.newPassword);
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } catch (error) {
            // Error is already handled in the context
        } finally {
            setPasswordLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 96 }}>
                <TopBar title="My Profile" />
                
                <View style={globalStyles.card}>
                    <Text style={globalStyles.cardTitle}>Edit Information</Text>
                    
                    <Text style={globalStyles.label}>User Name</Text>
                    <TextInput 
                        style={[
                            globalStyles.input, 
                            errors.name && { borderColor: '#e11d48' }
                        ]} 
                        value={profileData.name} 
                        onChangeText={(text) => updateProfileField('name', text)} 
                    />
                    {errors.name && (
                        <Text style={{ color: '#e11d48', fontSize: 12, marginTop: 4 }}>
                            {errors.name}
                        </Text>
                    )}
                    
                    <Text style={globalStyles.label}>Email</Text>
                    <TextInput 
                        style={[
                            globalStyles.input, 
                            errors.email && { borderColor: '#e11d48' }
                        ]} 
                        value={profileData.email} 
                        onChangeText={(text) => updateProfileField('email', text)} 
                        keyboardType="email-address" 
                        autoCapitalize="none" 
                    />
                    {errors.email && (
                        <Text style={{ color: '#e11d48', fontSize: 12, marginTop: 4 }}>
                            {errors.email}
                        </Text>
                    )}
                    
                    <Text style={globalStyles.label}>IRATA / SPRAT Number</Text>
                    <TextInput 
                        style={globalStyles.input} 
                        value={profileData.idNumber} 
                        onChangeText={(text) => updateProfileField('idNumber', text)} 
                    />
                    
                    <Text style={globalStyles.label}>Phone</Text>
                    <TextInput 
                        style={globalStyles.input} 
                        value={profileData.phone} 
                        onChangeText={(text) => updateProfileField('phone', text)} 
                        keyboardType="phone-pad" 
                    />
                    
                    <View style={{height: 16}} />
                    <Button 
                        label="Save Profile Changes" 
                        onPress={handleProfileUpdate} 
                        loading={profileLoading} 
                    />
                </View>
                
                <View style={globalStyles.card}>
                    <Text style={globalStyles.cardTitle}>Change Password</Text>
                    
                    <Text style={globalStyles.label}>New Password</Text>
                    <TextInput 
                        style={[
                            globalStyles.input, 
                            errors.newPassword && { borderColor: '#e11d48' }
                        ]} 
                        value={passwordData.newPassword} 
                        onChangeText={(text) => updatePasswordField('newPassword', text)} 
                        secureTextEntry 
                    />
                    {errors.newPassword && (
                        <Text style={{ color: '#e11d48', fontSize: 12, marginTop: 4 }}>
                            {errors.newPassword}
                        </Text>
                    )}
                    
                    <Text style={globalStyles.label}>Confirm New Password</Text>
                    <TextInput 
                        style={[
                            globalStyles.input, 
                            errors.confirmPassword && { borderColor: '#e11d48' }
                        ]} 
                        value={passwordData.confirmPassword} 
                        onChangeText={(text) => updatePasswordField('confirmPassword', text)} 
                        secureTextEntry 
                    />
                    {errors.confirmPassword && (
                        <Text style={{ color: '#e11d48', fontSize: 12, marginTop: 4 }}>
                            {errors.confirmPassword}
                        </Text>
                    )}
                    
                    <View style={{height: 16}} />
                    <Button 
                        label="Update Password" 
                        onPress={handlePasswordUpdate} 
                        loading={passwordLoading} 
                    />
                </View>
            </ScrollView>
            <FloatingBack onPress={() => navigation.goBack()} />
        </View>
    );
};

export default ProfileScreen;
