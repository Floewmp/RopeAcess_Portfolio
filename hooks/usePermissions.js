import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking, Platform } from 'react-native';
import { ERROR_MESSAGES } from '../utils/constants';

export const usePermissions = () => {
    const [cameraPermission, setCameraPermission] = useState(null);
    const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check permissions on mount
    useEffect(() => {
        checkPermissions();
    }, []);

    const checkPermissions = async () => {
        try {
            setIsLoading(true);
            const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
            const mediaStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
            
            setCameraPermission(cameraStatus.status);
            setMediaLibraryPermission(mediaStatus.status);
        } catch (error) {
            console.warn('Error checking permissions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openSettings = async () => {
        try {
            if (Platform.OS === 'ios') {
                await Linking.openURL('app-settings:');
            } else {
                await Linking.openSettings();
            }
        } catch (error) {
            console.warn('Error opening settings:', error);
            // Fallback: try to open general settings
            await Linking.openURL('package:com.yourcompany.ropeaccessportfolio');
        }
    };

    const requestCameraPermission = async () => {
        try {
            console.log('Requesting camera permission...');
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            console.log('Camera permission status:', status);
            setCameraPermission(status);
            
            if (status !== 'granted') {
                Alert.alert(
                    "Permission Caméra Requise",
                    "Cette application a besoin d'accéder à votre caméra pour prendre des photos de vos travaux. Veuillez autoriser l'accès dans les paramètres.",
                    [
                        { text: "Annuler", style: "cancel" },
                        { text: "Paramètres", onPress: openSettings }
                    ]
                );
            }
            
            return status === 'granted';
        } catch (error) {
            console.warn('Error requesting camera permission:', error);
            Alert.alert(
                "Erreur de Permission",
                "Impossible de demander la permission caméra. Veuillez vérifier les paramètres de votre appareil.",
                [
                    { text: "Annuler", style: "cancel" },
                    { text: "Paramètres", onPress: openSettings }
                ]
            );
            return false;
        }
    };

    const requestMediaLibraryPermission = async () => {
        try {
            console.log('Requesting media library permission...');
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            console.log('Media library permission status:', status);
            setMediaLibraryPermission(status);
            
            if (status !== 'granted') {
                Alert.alert(
                    "Permission Galerie Requise",
                    "Cette application a besoin d'accéder à votre galerie pour sélectionner des photos. Veuillez autoriser l'accès dans les paramètres.",
                    [
                        { text: "Annuler", style: "cancel" },
                        { text: "Paramètres", onPress: openSettings }
                    ]
                );
            }
            
            return status === 'granted';
        } catch (error) {
            console.warn('Error requesting media library permission:', error);
            Alert.alert(
                "Erreur de Permission",
                "Impossible de demander la permission galerie. Veuillez vérifier les paramètres de votre appareil.",
                [
                    { text: "Annuler", style: "cancel" },
                    { text: "Paramètres", onPress: openSettings }
                ]
            );
            return false;
        }
    };

    const ensureCameraPermission = async () => {
        try {
            console.log('Ensuring camera permission...');
            // Always check current status first
            const currentStatus = await ImagePicker.getCameraPermissionsAsync();
            console.log('Current camera status:', currentStatus.status);
            
            if (currentStatus.status === 'granted') {
                setCameraPermission('granted');
                return true;
            }
            
            if (currentStatus.status === 'denied') {
                setCameraPermission('denied');
                Alert.alert(
                    "Permission Caméra Refusée",
                    "L'accès à la caméra a été refusé. Veuillez l'activer dans les paramètres de votre appareil pour prendre des photos.",
                    [
                        { text: "Annuler", style: "cancel" },
                        { text: "Paramètres", onPress: openSettings }
                    ]
                );
                return false;
            }
            
            if (currentStatus.status === 'undetermined') {
                return await requestCameraPermission();
            }
            
            return false;
        } catch (error) {
            console.warn('Error ensuring camera permission:', error);
            return false;
        }
    };

    const ensureMediaLibraryPermission = async () => {
        try {
            console.log('Ensuring media library permission...');
            // Always check current status first
            const currentStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
            console.log('Current media library status:', currentStatus.status);
            
            if (currentStatus.status === 'granted') {
                setMediaLibraryPermission('granted');
                return true;
            }
            
            if (currentStatus.status === 'denied') {
                setMediaLibraryPermission('denied');
                Alert.alert(
                    "Permission Galerie Refusée",
                    "L'accès à la galerie a été refusé. Veuillez l'activer dans les paramètres de votre appareil pour sélectionner des photos.",
                    [
                        { text: "Annuler", style: "cancel" },
                        { text: "Paramètres", onPress: openSettings }
                    ]
                );
                return false;
            }
            
            if (currentStatus.status === 'undetermined') {
                return await requestMediaLibraryPermission();
            }
            
            return false;
        } catch (error) {
            console.warn('Error ensuring media library permission:', error);
            return false;
        }
    };

    const requestAllPermissions = async () => {
        try {
            console.log('Requesting all permissions...');
            const cameraGranted = await ensureCameraPermission();
            const mediaGranted = await ensureMediaLibraryPermission();
            
            return {
                camera: cameraGranted,
                mediaLibrary: mediaGranted,
                allGranted: cameraGranted && mediaGranted
            };
        } catch (error) {
            console.warn('Error requesting all permissions:', error);
            return {
                camera: false,
                mediaLibrary: false,
                allGranted: false
            };
        }
    };

    return {
        cameraPermission,
        mediaLibraryPermission,
        isLoading,
        checkPermissions,
        requestCameraPermission,
        requestMediaLibraryPermission,
        ensureCameraPermission,
        ensureMediaLibraryPermission,
        requestAllPermissions,
        openSettings
    };
};
