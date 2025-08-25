import React, { useMemo } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useSession } from '../contexts/SessionContext';
import { globalStyles } from '../styles/globalStyles';
import { TopBar, FloatingBack } from '../components/Common';
import JobForm from '../components/JobForm';

const EditJobScreen = ({ navigation, route }) => {
    const { sessions, updateSession } = useSession();
    const { sessionId } = route.params;
    
    const sessionToEdit = useMemo(() => 
        sessions.find(s => s.id === sessionId), 
        [sessions, sessionId]
    );
    
    if (!sessionToEdit) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Session not found.</Text>
            </View>
        );
    }

    const handleSubmit = (sessionData) => {
        updateSession(sessionData);
        navigation.navigate('Portfolio');
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView 
                contentContainerStyle={{ padding: 16, paddingBottom: 96 }} 
                keyboardShouldPersistTaps="handled"
            >
                <TopBar title="Edit Job" />
                <JobForm 
                    initialData={sessionToEdit} 
                    onSubmit={handleSubmit} 
                    isEdit 
                />
            </ScrollView>
            <FloatingBack onPress={() => navigation.goBack()} />
        </View>
    );
};

export default EditJobScreen;
