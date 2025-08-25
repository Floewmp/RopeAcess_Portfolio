import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { useSession } from '../contexts/SessionContext';
import { globalStyles } from '../styles/globalStyles';
import { TopBar, FloatingBack, Metric, Card } from '../components/Common';
import { EditIcon, DeleteIcon } from '../components/Icons';

const SessionViewScreen = ({ navigation, route }) => {
    const { sessions, deleteSession } = useSession();
    const { sessionId } = route.params;
    
    const session = useMemo(() => 
        sessions.find(s => s.id === sessionId), 
        [sessions, sessionId]
    );
    
    if (!session) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}>
                <Text>Session not found.</Text>
            </View>
        );
    }
    
    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 96 }}>
                <TopBar title={session.name} />
                
                <Card>
                    <View style={globalStyles.sessionHeader}>
                        <Text style={globalStyles.itemSubtitle}>
                            Date: {new Date(session.startedAt).toLocaleString('en-US', { 
                                dateStyle: 'full', 
                                timeStyle: 'short' 
                            })}
                        </Text>
                        <View style={globalStyles.itemActions}>
                            <Pressable 
                                onPress={() => navigation.navigate('EditJob', { sessionId: session.id })} 
                                style={globalStyles.editButton}
                            >
                                <EditIcon />
                            </Pressable>
                            <Pressable 
                                onPress={() => { 
                                    deleteSession(session.id); 
                                    navigation.goBack(); 
                                }} 
                                style={globalStyles.deleteButton}
                            >
                                <DeleteIcon />
                            </Pressable>
                        </View>
                    </View>
                    
                    {session.lastModified && (
                        <Metric 
                            label="Last Modified" 
                            value={new Date(session.lastModified).toLocaleString('en-US', { 
                                dateStyle: 'full', 
                                timeStyle: 'short' 
                            })} 
                        />
                    )}
                    
                    <Metric label="Employer" value={session.employer || 'N/A'} />
                    <Metric label="Methods Employed" value={session.methods || 'N/A'} />
                    <Metric label="Coworkers" value={session.coworkers || 'N/A'} />
                    <Metric label="Notes" value={session.notes || 'N/A'} />
                    <Metric label="Height" value={`${session.height || 0} m`} />
                    <Metric label="Hours Worked" value={`${session.hours || 0} h`} />
                    <Metric label="Location" value={session.location || 'N/A'} />
                </Card>
                
                <Card>
                    <Text style={globalStyles.cardTitle}>Photos</Text>
                    {session.photos && session.photos.length > 0 ? (
                        <View style={globalStyles.photoGrid}>
                            {session.photos.map((uri, index) => (
                                <Image key={index} source={{ uri }} style={globalStyles.fullImage} />
                            ))}
                        </View>
                    ) : (
                        <Text>No photos for this session.</Text>
                    )}
                </Card>
            </ScrollView>
            <FloatingBack onPress={() => navigation.goBack()} />
        </View>
    );
};

export default SessionViewScreen;
