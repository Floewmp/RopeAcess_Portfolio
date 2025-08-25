import { useState, useEffect } from 'react';
import * as Location from "expo-location";
import { APP_CONFIG } from '../utils/constants';

export const useSensors = () => {
    const [coords, setCoords] = useState(null);
    const [locationPermission, setLocationPermission] = useState(null);

    useEffect(() => {
        let isMounted = true;
        let sub = null;
        
        const setupGPS = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                setLocationPermission(status);
                
                if (status !== "granted" || !isMounted) return;
                
                sub = await Location.watchPositionAsync(
                    { 
                        accuracy: Location.Accuracy.High, 
                        timeInterval: APP_CONFIG.GPS.TIME_INTERVAL, 
                        distanceInterval: APP_CONFIG.GPS.DISTANCE_INTERVAL 
                    }, 
                    (loc) => {
                        if (isMounted && loc.coords) {
                            setCoords({ 
                                lat: Number(loc.coords.latitude.toFixed(APP_CONFIG.GPS.COORDINATE_PRECISION)), 
                                lon: Number(loc.coords.longitude.toFixed(APP_CONFIG.GPS.COORDINATE_PRECISION)) 
                            });
                        }
                    }
                );
            } catch (error) { 
                if (__DEV__) {
                    console.error('GPS setup error:', error); 
                }
            }
        };
        
        setupGPS();
        
        return () => { 
            isMounted = false; 
            sub?.remove(); 
        };
    }, []);

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                throw new Error('Location permission denied');
            }
            
            const location = await Location.getCurrentPositionAsync({});
            return location.coords;
        } catch (error) {
            console.error('Get current location error:', error);
            throw error;
        }
    };

    const reverseGeocode = async (coords) => {
        try {
            const address = await Location.reverseGeocodeAsync(coords);
            return address && address[0] ? address[0] : null;
        } catch (error) {
            console.error('Reverse geocode error:', error);
            return null;
        }
    };

    return { 
        coords, 
        locationPermission, 
        getCurrentLocation, 
        reverseGeocode 
    };
};
