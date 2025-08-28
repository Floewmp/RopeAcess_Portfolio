import React, { useState, useCallback, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Pressable, 
    ScrollView, 
    Image, 
    ActivityIndicator, 
    Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAuth } from '../contexts/AuthContext';
import { useSensors } from '../hooks/useSensors';
import { usePermissions } from '../hooks/usePermissions';
import { uploadImageAsync } from '../utils/storage';
import { validateSessionData } from '../utils/validation';
import { globalStyles } from '../styles/globalStyles';
import Button from './Button';
import { LocationIcon } from './Icons';
import { APP_CONFIG, ERROR_MESSAGES } from '../utils/constants';

const JobForm = ({ initialData = {}, onSubmit, isEdit = false }) => {
    const { user } = useAuth();
    const { coords, getCurrentLocation, reverseGeocode } = useSensors();
    const { ensureCameraPermission, ensureMediaLibraryPermission, openSettings } = usePermissions();
    
    const [form, setForm] = useState({
        name: initialData.name || "",
        employer: initialData.employer || "",
        methods: initialData.methods || "",
        coworkers: initialData.coworkers || "",
        notes: initialData.notes || "",
        height: initialData.height || "",
        hours: initialData.hours || "",
        photos: initialData.photos || [],
        location: initialData.location || "",
    });
    
    const [date, setDate] = useState(initialData.startedAt || Date.now());
    const [isPinning, setIsPinning] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [manualLocation, setManualLocation] = useState(!!initialData.location);
    const [errors, setErrors] = useState({});

    const pinLocation = useCallback(async () => {
        setIsPinning(true);
        try {
            const location = await getCurrentLocation();
            const address = await reverseGeocode(location);
            
            if (address) {
                const { street, city, postalCode } = address;
                const locationString = `${street || ''}, ${city || ''} ${postalCode || ''}`.replace(/ ,/g,',').trim();
                setForm(prev => ({ ...prev, location: locationString }));
                setManualLocation(false);
            }
        } catch (error) {
            Alert.alert("Location Error", ERROR_MESSAGES.PERMISSIONS.LOCATION);
        } finally {
            setIsPinning(false);
        }
    }, [getCurrentLocation, reverseGeocode]);

    useEffect(() => {
        if (!isEdit && !form.location && !manualLocation) {
            pinLocation();
        }
    }, [isEdit, form.location, pinLocation, manualLocation]);

    const handleFormChange = useCallback((field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    }, [errors]);

    const pickImage = async (useCamera) => {
        try {
            // Ensure permissions are granted
            const hasPermission = useCamera 
                ? await ensureCameraPermission()
                : await ensureMediaLibraryPermission();
                
            if (!hasPermission) {
                return;
            }

            const action = useCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
            
            const result = await action({ 
                mediaTypes: ImagePicker.MediaTypeOptions.Images, 
                allowsEditing: false, 
                quality: APP_CONFIG.IMAGE.QUALITY 
            });
            
            if (result.canceled) return;

            // Always add photo locally first
            const newPhotoUri = result.assets[0].uri;
            handleFormChange('photos', [...form.photos, newPhotoUri]);
            
            // If user is online, try to upload to Firebase
            if (user) {
                setIsUploading(true);
                try {
                    const uploadUrl = await uploadImageAsync(newPhotoUri, user.uid);
                    if (uploadUrl) {
                        // Replace local URI with Firebase URL
                        const updatedPhotos = form.photos.map(photo => 
                            photo === newPhotoUri ? uploadUrl : photo
                        );
                        handleFormChange('photos', [...updatedPhotos, uploadUrl]);
                    }
                } catch (error) {
                    if (__DEV__) {
                        console.error('Upload failed, but photo saved locally:', error);
                    }
                    // Photo is already saved locally, so we continue
                } finally {
                    setIsUploading(false);
                }
            }
        } catch (error) {
            if (__DEV__) {
                console.error('Image picker error:', error);
            }
            
            // Check if it's a permission error
            if (error.message && error.message.includes('permission')) {
                Alert.alert(
                    "Permission Required", 
                    useCamera 
                        ? "Camera access is required to take photos. Please grant permission in settings."
                        : "Photo library access is required to select photos. Please grant permission in settings.",
                    [
                        { text: "Cancel", style: "cancel" },
                        { 
                            text: "Settings", 
                            onPress: openSettings
                        }
                    ]
                );
            } else {
                Alert.alert(
                    "Error", 
                    "Could not access camera or photo library. Please check your permissions.",
                    [
                        { text: "Cancel", style: "cancel" },
                        { text: "Try Again", onPress: () => pickImage(useCamera) }
                    ]
                );
            }
        }
    };
    
    const removePhoto = (uri) => {
        handleFormChange('photos', form.photos.filter(p => p !== uri));
    };

    const handleSubmit = () => {
        const validation = validateSessionData(form);
        if (!validation.isValid) {
            setErrors(validation.errors);
            Alert.alert("Validation Error", "Please fix the errors in the form.");
            return;
        }

        const sessionData = { 
            ...initialData, 
            ...form, 
            coords, 
            startedAt: date,
        };
        
        if (isEdit) {
            sessionData.lastModified = Date.now();
        }
        
        onSubmit(sessionData);
    };

    const handleConfirmDate = (selectedDate) => {
        setDate(selectedDate.getTime());
        setDatePickerVisibility(false);
    };

    return (
        <View style={globalStyles.card}>
            <Text style={globalStyles.label}>Date</Text>
            <Pressable onPress={() => setDatePickerVisibility(true)}>
                <TextInput 
                    style={[globalStyles.input, globalStyles.inputDisabled]} 
                    value={new Date(date).toLocaleDateString('en-US')} 
                    editable={false} 
                />
            </Pressable>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={() => setDatePickerVisibility(false)}
                date={new Date(date)}
            />

            <Text style={globalStyles.label}>Location</Text>
            <Text style={globalStyles.helperText}>Enter manually or use GPS</Text>
            <View style={globalStyles.locationContainer}>
                <TextInput 
                    style={[
                        globalStyles.input, 
                        {flex: 1}, 
                        errors.location && { borderColor: '#e11d48' }
                    ]} 
                    value={form.location} 
                    onChangeText={(t) => {
                        handleFormChange('location', t);
                        setManualLocation(true);
                    }} 
                    placeholder="Enter address or city..." 
                />
                <Pressable 
                    onPress={pinLocation} 
                    style={globalStyles.pinButton} 
                    disabled={isPinning}
                >
                    {isPinning ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <LocationIcon />
                    )}
                </Pressable>
            </View>
            {errors.location && (
                <Text style={{ color: '#e11d48', fontSize: 12, marginTop: 4 }}>
                    {errors.location}
                </Text>
            )}

            <Text style={globalStyles.label}>Job Name / Description</Text>
            <TextInput 
                style={[
                    globalStyles.input, 
                    errors.name && { borderColor: '#e11d48' }
                ]} 
                value={form.name} 
                onChangeText={(t) => handleFormChange('name', t)} 
                placeholder="Ex: North face cleaning, window washing..." 
            />
            {errors.name && (
                <Text style={{ color: '#e11d48', fontSize: 12, marginTop: 4 }}>
                    {errors.name}
                </Text>
            )}

            <Text style={globalStyles.label}>Employer</Text>
            <TextInput 
                style={[
                    globalStyles.input, 
                    errors.employer && { borderColor: '#e11d48' }
                ]} 
                value={form.employer} 
                onChangeText={(t) => handleFormChange('employer', t)} 
                placeholder="Ex: Rope Access Inc." 
            />
            {errors.employer && (
                <Text style={{ color: '#e11d48', fontSize: 12, marginTop: 4 }}>
                    {errors.employer}
                </Text>
            )}

            <Text style={globalStyles.label}>Methods Employed</Text>
            <TextInput 
                style={globalStyles.input} 
                value={form.methods} 
                onChangeText={(t) => handleFormChange('methods', t)} 
                placeholder="Ex: Rope to rope transfer, aid climbing..." 
            />

            <Text style={globalStyles.label}>Collaborators / Coworkers</Text>
            <TextInput 
                style={globalStyles.input} 
                value={form.coworkers} 
                onChangeText={(t) => handleFormChange('coworkers', t)} 
                placeholder="Ex: John Doe, Jane Smith..." 
            />

            <Text style={globalStyles.label}>Notes / Observations</Text>
            <TextInput 
                style={[globalStyles.input, {height: 100, textAlignVertical: 'top'}]} 
                value={form.notes} 
                onChangeText={(t) => handleFormChange('notes', t)} 
                placeholder="Ex: Specific safety measures, equipment used..." 
                multiline 
            />

            <View style={{flexDirection: 'row', gap: 8}}>
                <View style={{flex: 1}}>
                    <Text style={globalStyles.label}>Working Height (m)</Text>
                    <TextInput 
                        style={[
                            globalStyles.input, 
                            errors.height && { borderColor: '#e11d48' }
                        ]} 
                        value={String(form.height)} 
                        onChangeText={(t) => handleFormChange('height', t)} 
                        keyboardType="numeric" 
                        placeholder="Ex: 45" 
                    />
                    {errors.height && (
                        <Text style={{ color: '#e11d48', fontSize: 12, marginTop: 4 }}>
                            {errors.height}
                        </Text>
                    )}
                </View>
                <View style={{flex: 1}}>
                    <Text style={globalStyles.label}>Hours Worked</Text>
                    <TextInput 
                        style={[
                            globalStyles.input, 
                            errors.hours && { borderColor: '#e11d48' }
                        ]} 
                        value={String(form.hours)} 
                        onChangeText={(t) => handleFormChange('hours', t)} 
                        keyboardType="numeric" 
                        placeholder="Ex: 8" 
                    />
                    {errors.hours && (
                        <Text style={{ color: '#e11d48', fontSize: 12, marginTop: 4 }}>
                            {errors.hours}
                        </Text>
                    )}
                </View>
            </View>

            <Text style={globalStyles.label}>Photos</Text>
            <View style={globalStyles.row}>
                <Button 
                    label="Take Photo" 
                    onPress={() => pickImage(true)} 
                    kind="secondary" 
                />
                <Button 
                    label="Choose Photo" 
                    onPress={() => pickImage(false)} 
                    kind="secondary" 
                />
            </View>
            
            {isUploading && <ActivityIndicator style={{ marginVertical: 10 }} />}
            
            <ScrollView horizontal style={{marginTop: 12}}>
                {form.photos.map((uri, index) => (
                    <Pressable key={index} onLongPress={() => removePhoto(uri)}>
                        <Image source={{ uri }} style={globalStyles.thumbnail} />
                    </Pressable>
                ))}
            </ScrollView>
            
            <View style={{ height: 24 }} />
            <Button 
                label={isEdit ? "Save Changes" : "Create & Start"} 
                onPress={handleSubmit} 
            />
        </View>
    );
};

export default JobForm;
