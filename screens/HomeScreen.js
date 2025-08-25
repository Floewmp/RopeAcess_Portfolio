import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { globalStyles } from '../styles/globalStyles';
import Button from '../components/Button';
import { SettingsIcon } from '../components/Icons';
import Logo from '../components/Logo';

const HomeScreen = ({ navigation }) => {
    const { user, logout, goOnline } = useAuth();

    return (
        <View style={globalStyles.homeContainer}>
            {/* Top Section */}
            <View>
                <Text style={globalStyles.brand}>ROPE ACCESS PORTFOLIO</Text>
                
                {/* Logo under the title */}
                <View style={globalStyles.logoContainer}>
                    <Logo size={80} />
                </View>
                
                {user ? (
                    <View style={globalStyles.userContainer}>
                        <Text style={globalStyles.userInfo}>Connected as: {user.name}</Text>
                        <Button label="Logout" onPress={logout} kind="danger" />
                    </View>
                ) : (
                    <View style={globalStyles.userContainer}>
                        <Text style={globalStyles.userInfo}>Offline Mode</Text>
                        <Button label="Connect" onPress={goOnline} kind="secondary" />
                    </View>
                )}
            </View>

            {/* Middle Section (Main Actions) */}
            <View style={globalStyles.homeActions}>
                <Button 
                    label="Start New Job" 
                    onPress={() => navigation.navigate("NewJob")} 
                    full 
                />
                <View style={{ height: 16 }} />
                <Button 
                    label="View Portfolio" 
                    onPress={() => navigation.navigate("Portfolio")} 
                    kind="secondary" 
                    full 
                />
            </View>

            {/* Bottom Section (Footer Actions) */}
            <View style={globalStyles.homeFooter}>
                {user && (
                    <Pressable 
                        onPress={() => navigation.navigate('Profile')} 
                        style={globalStyles.footerButton}
                    >
                        <SettingsIcon />
                        <Text style={globalStyles.footerButtonText}>My Profile</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
};

export default HomeScreen;
