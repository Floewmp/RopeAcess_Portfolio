import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    updatePassword as updateFbPassword, 
    sendPasswordResetEmail, 
    updateEmail as updateFbEmail, 
    signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Check if Firebase auth is available
        if (!auth) {
            if (__DEV__) {
                console.warn('Firebase auth not available, running in offline mode');
            }
            setIsLoading(false);
            setIsOffline(true);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setIsLoading(true);
            if (firebaseUser) {
                try {
                    const userDocRef = doc(db, "users", firebaseUser.uid);
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists()) {
                        setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...docSnap.data() });
                    } else {
                        setUser({ uid: firebaseUser.uid, email: firebaseUser.email, name: 'New User' });
                    }
                    setIsOffline(false);
                } catch (error) {
                    if (__DEV__) {
                        console.error("Auth state change error:", error);
                    }
                    Alert.alert("Authentication Error", "Could not verify your session.");
                    setUser(null);
                }
            } else {
                setUser(null);
                setIsOffline(false);
            }
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);

    const authApi = useMemo(() => ({
        user,
        isLoading,
        isOffline,
        login: async (email, password) => {
            if (!auth) {
                Alert.alert("Offline Mode", "Authentication is not available in offline mode.");
                throw new Error("Firebase auth not available");
            }
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (error) {
                Alert.alert("Login Failed", error.message);
                throw error;
            }
        },
        signUp: async (email, password, profileData) => {
            if (!auth || !db) {
                Alert.alert("Offline Mode", "Registration is not available in offline mode.");
                throw new Error("Firebase services not available");
            }
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;
                await setDoc(doc(db, "users", firebaseUser.uid), profileData);
                setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...profileData });
            } catch (error) {
                Alert.alert("Sign Up Failed", error.message);
                throw error;
            }
        },
        logout: () => {
            signOut(auth);
            setIsOffline(false);
        },
        continueOffline: () => {
            setUser(null);
            setIsOffline(true);
        },
        goOnline: () => {
            setIsOffline(false);
        },
        updateProfile: async (profileData) => {
            if (!user) return;
            try {
                if (profileData.email !== user.email) {
                    await updateFbEmail(auth.currentUser, profileData.email);
                }
                const userDocRef = doc(db, "users", user.uid);
                await setDoc(userDocRef, profileData, { merge: true });
                setUser(prev => ({ ...prev, ...profileData }));
                Alert.alert("Success", "Profile updated successfully.");
            } catch (error) {
                Alert.alert("Error", "Could not update profile. You may need to log out and log back in to change your email.");
                throw error;
            }
        },
        updatePassword: async (newPassword) => {
            if (!auth.currentUser) return;
            try {
                await updateFbPassword(auth.currentUser, newPassword);
                Alert.alert("Success", "Password updated successfully.");
            } catch (error) {
                Alert.alert("Error", error.message);
                throw error;
            }
        },
        passwordReset: (email) => {
            if (!email.trim()) {
                return Alert.alert("Password Reset", "Please enter your email address first.");
            }
            sendPasswordResetEmail(auth, email.trim())
                .then(() => Alert.alert("Password Reset", "A password reset link has been sent to your email."))
                .catch((error) => Alert.alert("Error", error.message));
        },
    }), [user, isLoading, isOffline]);

    return <AuthContext.Provider value={authApi}>{children}</AuthContext.Provider>;
};
