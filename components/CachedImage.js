import React, { useState, useEffect } from 'react';
import { Image, ActivityIndicator, View } from 'react-native';
import { getCachedImage, cacheImage } from '../utils/imageCache';
import { globalStyles } from '../styles/globalStyles';

const CachedImage = ({ 
    source, 
    style, 
    placeholder = null,
    onLoad,
    onError,
    resizeMode = 'cover',
    ...props 
}) => {
    const [imageUri, setImageUri] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        
        const loadImage = async () => {
            if (!source?.uri) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setHasError(false);

                // Check cache first
                let cachedUri = await getCachedImage(source.uri);
                
                if (cachedUri) {
                    // Use cached image
                    if (isMounted) {
                        setImageUri(cachedUri);
                        setIsLoading(false);
                    }
                } else {
                    // Download and cache image
                    if (isMounted) {
                        setImageUri(source.uri);
                        setIsLoading(false);
                    }
                    
                    // Cache the image in background
                    try {
                        await cacheImage(source.uri, source.uri);
                    } catch (cacheError) {
                        // Cache error is not critical, just log it
                        if (__DEV__) {
                            console.warn('Failed to cache image:', cacheError);
                        }
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setHasError(true);
                    setIsLoading(false);
                    if (onError) {
                        onError(error);
                    }
                }
            }
        };

        loadImage();

        return () => {
            isMounted = false;
        };
    }, [source?.uri]);

    const handleLoad = (event) => {
        setIsLoading(false);
        if (onLoad) {
            onLoad(event);
        }
    };

    const handleError = (error) => {
        setHasError(true);
        setIsLoading(false);
        if (onError) {
            onError(error);
        }
    };

    if (hasError && placeholder) {
        return (
            <View style={[style, globalStyles.placeholderContainer]}>
                {placeholder}
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={[style, globalStyles.imageLoadingContainer]}>
                <ActivityIndicator size="small" color="#666" />
            </View>
        );
    }

    return (
        <Image
            source={{ uri: imageUri }}
            style={style}
            resizeMode={resizeMode}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
        />
    );
};

export default CachedImage;
