import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SessionProvider } from './contexts/SessionContext';

// Screens
import LoginScreen from './screens/auth/LoginScreen';
import SignUpScreen from './screens/auth/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import NewJobScreen from './screens/NewJobScreen';
import EditJobScreen from './screens/EditJobScreen';
import PortfolioScreen from './screens/PortfolioScreen';
import SessionViewScreen from './screens/SessionViewScreen';

// Components
import { LoadingScreen } from './components/Common';

// Styles
import { globalStyles } from './styles/globalStyles';

const Stack = createNativeStackNavigator();

// Auth Stack
const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
);

// Main App Stack
const AppStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="NewJob" component={NewJobScreen} />
        <Stack.Screen name="EditJob" component={EditJobScreen} />
        <Stack.Screen name="Portfolio" component={PortfolioScreen} />
        <Stack.Screen name="SessionView" component={SessionViewScreen} />
    </Stack.Navigator>
);

// Root Navigator
const RootNavigator = () => {
    const { user, isLoading, isOffline } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            {(user || isOffline) ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

// Main App Component
export default function App() {
    return (
        <AuthProvider>
            <SessionProvider>
                <SafeAreaView style={globalStyles.container}>
                    <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
                    <RootNavigator />
                </SafeAreaView>
            </SessionProvider>
        </AuthProvider>
    );
}
