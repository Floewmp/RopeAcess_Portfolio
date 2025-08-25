import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSession } from '../contexts/SessionContext';
import { globalStyles } from '../styles/globalStyles';
import { TopBar, FloatingBack } from '../components/Common';
import JobForm from '../components/JobForm';

const NewJobScreen = ({ navigation }) => {
    const { createSession } = useSession();

    const handleSubmit = (sessionData) => {
        createSession(sessionData);
        navigation.navigate('Portfolio');
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView 
                contentContainerStyle={{ padding: 16, paddingBottom: 96 }} 
                keyboardShouldPersistTaps="handled"
            >
                <TopBar title="New Job" />
                <JobForm onSubmit={handleSubmit} />
            </ScrollView>
            <FloatingBack onPress={() => navigation.goBack()} />
        </View>
    );
};

export default NewJobScreen;
