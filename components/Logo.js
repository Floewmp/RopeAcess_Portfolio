import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = ({ size = 60, style }) => {
    return (
        <Image
            source={require('../assets/icons/adaptive-icon-main.png')}
            style={[
                styles.logo,
                { width: size, height: size },
                style
            ]}
            resizeMode="contain"
        />
    );
};

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
    },
});

export default Logo;
