import React, { useState, useMemo } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    FlatList, 
    Image, 
    Pressable 
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import { exportPortfolio } from '../utils/export';
import { globalStyles } from '../styles/globalStyles';
import { TopBar, FloatingBack, Metric } from '../components/Common';
import { EditIcon, DeleteIcon } from '../components/Icons';
import Button from '../components/Button';

const PortfolioScreen = ({ navigation }) => {
    const { user } = useAuth();
    const { sessions, clearLogbook, deleteSession, updateSession, isLoading } = useSession();
    
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'gallery'
    const [showFilters, setShowFilters] = useState(false);
    const [selectedPhotos, setSelectedPhotos] = useState(new Set()); // Track selected photos for deletion
    const [filters, setFilters] = useState({ 
        employer: '', 
        name: '', 
        height: '', 
        date: '', 
        methods: '', 
        coworkers: '' 
    });
    const [exporting, setExporting] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const filteredSessions = useMemo(() => {
        return sessions.filter(s => {
            const employerMatch = s.employer?.toLowerCase().includes(filters.employer.toLowerCase());
            const nameMatch = s.name?.toLowerCase().includes(filters.name.toLowerCase());
            const heightMatch = filters.height ? (Number(s.height) >= Number(filters.height)) : true;
            const dateMatch = filters.date ? (new Date(s.startedAt).toLocaleDateString('en-US') === new Date(filters.date).toLocaleDateString('en-US')) : true;
            const methodsMatch = s.methods?.toLowerCase().includes(filters.methods.toLowerCase());
            const coworkersMatch = s.coworkers?.toLowerCase().includes(filters.coworkers.toLowerCase());
            return employerMatch && nameMatch && heightMatch && dateMatch && methodsMatch && coworkersMatch;
        });
    }, [sessions, filters]);

    const allPhotos = useMemo(() => 
        sessions.flatMap(s => (s.photos || []).map(photo => ({ uri: photo, sessionId: s.id }))), 
        [sessions]
    );

    const totalHours = useMemo(() => {
        return filteredSessions.reduce((acc, session) => acc + (Number(session.hours) || 0), 0);
    }, [filteredSessions]);

    const handleExport = async () => {
        setExporting(true);
        await exportPortfolio(filteredSessions, user);
        setExporting(false);
    };

    const handleConfirmDate = (date) => {
        setFilters(f => ({...f, date: date}));
        setDatePickerVisibility(false);
    };

    const updateFilter = (field, value) => {
        setFilters(f => ({...f, [field]: value}));
    };

    if (isLoading) return null;

    const renderSessionItem = ({ item }) => (
        <View style={globalStyles.itemContainer}>
            <Pressable 
                onPress={() => navigation.navigate('SessionView', { sessionId: item.id })} 
                style={globalStyles.itemContent}
            >
                <Text style={globalStyles.itemTitle}>{item.name}</Text>
                <Text style={globalStyles.itemSubtitle}>
                    {new Date(item.startedAt).toLocaleDateString('en-US', { dateStyle: 'full' })}
                </Text>
                <Text style={globalStyles.itemText} numberOfLines={1} ellipsizeMode="tail">
                    <Text style={{fontWeight: 'bold'}}>Location:</Text> {item.location} · 
                    <Text style={{fontWeight: 'bold'}}>Hours:</Text> {item.hours || 0}h
                </Text>
            </Pressable>
            <View style={globalStyles.itemActions}>
                <Pressable 
                    onPress={() => navigation.navigate('EditJob', { sessionId: item.id })} 
                    style={globalStyles.editButton}
                >
                    <EditIcon />
                </Pressable>
                <Pressable 
                    onPress={() => deleteSession(item.id)} 
                    style={globalStyles.deleteButton}
                >
                    <DeleteIcon />
                </Pressable>
            </View>
        </View>
    );

    const togglePhotoSelection = (photoUri) => {
        setSelectedPhotos(prev => {
            const newSet = new Set(prev);
            if (newSet.has(photoUri)) {
                newSet.delete(photoUri);
            } else {
                newSet.add(photoUri);
            }
            return newSet;
        });
    };

    const deleteSelectedPhotos = async () => {
        if (selectedPhotos.size === 0) return;
        
        Alert.alert(
            "Delete Photos", 
            `Are you sure you want to delete ${selectedPhotos.size} photo(s)?`, 
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        // Group photos by session for efficient updates
                        const photosBySession = {};
                        allPhotos.forEach(photo => {
                            if (selectedPhotos.has(photo.uri)) {
                                if (!photosBySession[photo.sessionId]) {
                                    photosBySession[photo.sessionId] = [];
                                }
                                photosBySession[photo.sessionId].push(photo.uri);
                            }
                        });

                        // Update each session by removing the selected photos
                        for (const [sessionId, photosToRemove] of Object.entries(photosBySession)) {
                            const session = sessions.find(s => s.id === sessionId);
                            if (session) {
                                const updatedPhotos = session.photos.filter(photo => !photosToRemove.includes(photo));
                                await updateSession({ ...session, photos: updatedPhotos });
                            }
                        }

                        setSelectedPhotos(new Set());
                    }
                }
            ]
        );
    };

    const renderGalleryItem = ({ item }) => (
        <Pressable 
            onLongPress={() => togglePhotoSelection(item.uri)}
            style={[
                globalStyles.galleryImageContainer,
                selectedPhotos.has(item.uri) && globalStyles.selectedPhoto
            ]}
        >
            <Image source={{ uri: item.uri }} style={globalStyles.galleryImage} />
            {selectedPhotos.has(item.uri) && (
                <View style={globalStyles.photoSelectionOverlay}>
                    <Text style={globalStyles.photoSelectionText}>✓</Text>
                </View>
            )}
        </Pressable>
    );

    return (
        <View style={{ flex: 1 }}>
            <TopBar title="Portfolio" />
            
            <View style={globalStyles.portfolioActions}>
                <Button 
                    label={showFilters ? "Hide Filters" : "Show Filters"} 
                    onPress={() => setShowFilters(v => !v)} 
                    kind="secondary" 
                />
                <Button 
                    label="Export" 
                    onPress={handleExport} 
                    kind="secondary" 
                    loading={exporting} 
                />
            </View>
            
            {showFilters && (
                <View style={globalStyles.filterContainer}>
                    <TextInput 
                        style={globalStyles.filterInput} 
                        placeholder="Filter by job name..." 
                        value={filters.name} 
                        onChangeText={t => updateFilter('name', t)} 
                    />
                    <TextInput 
                        style={globalStyles.filterInput} 
                        placeholder="Filter by employer..." 
                        value={filters.employer} 
                        onChangeText={t => updateFilter('employer', t)} 
                    />
                    <TextInput 
                        style={globalStyles.filterInput} 
                        placeholder="Filter by methods..." 
                        value={filters.methods} 
                        onChangeText={t => updateFilter('methods', t)} 
                    />
                    <TextInput 
                        style={globalStyles.filterInput} 
                        placeholder="Filter by coworkers..." 
                        value={filters.coworkers} 
                        onChangeText={t => updateFilter('coworkers', t)} 
                    />
                    <TextInput 
                        style={globalStyles.filterInput} 
                        placeholder="Min height..." 
                        value={filters.height} 
                        onChangeText={t => updateFilter('height', t)} 
                        keyboardType="numeric" 
                    />
                    <Pressable onPress={() => setDatePickerVisibility(true)}>
                        <TextInput 
                            style={globalStyles.filterInput} 
                            placeholder="Filter by date..." 
                            value={filters.date ? new Date(filters.date).toLocaleDateString('en-US') : ''} 
                            editable={false} 
                        />
                    </Pressable>
                    <DateTimePickerModal 
                        isVisible={isDatePickerVisible} 
                        mode="date" 
                        onConfirm={handleConfirmDate} 
                        onCancel={() => setDatePickerVisibility(false)} 
                    />
                </View>
            )}

            <View style={globalStyles.viewToggleContainer}>
                <Pressable 
                    onPress={() => setViewMode('list')} 
                    style={[
                        globalStyles.viewToggleButton, 
                        viewMode === 'list' && globalStyles.viewToggleButtonActive
                    ]}
                >
                    <Text style={[
                        globalStyles.viewToggleText, 
                        viewMode === 'list' && globalStyles.viewToggleTextActive
                    ]}>
                        List
                    </Text>
                </Pressable>
                <Pressable 
                    onPress={() => setViewMode('gallery')} 
                    style={[
                        globalStyles.viewToggleButton, 
                        viewMode === 'gallery' && globalStyles.viewToggleButtonActive
                    ]}
                >
                    <Text style={[
                        globalStyles.viewToggleText, 
                        viewMode === 'gallery' && globalStyles.viewToggleTextActive
                    ]}>
                        Gallery
                    </Text>
                </Pressable>
            </View>

            {viewMode === 'gallery' && (
                <View style={globalStyles.portfolioActions}>
                    {selectedPhotos.size > 0 && (
                        <Button 
                            label={`Delete ${selectedPhotos.size} Photo(s)`} 
                            onPress={deleteSelectedPhotos} 
                            kind="danger" 
                        />
                    )}
                    <Button 
                        label="Clear Selection" 
                        onPress={() => setSelectedPhotos(new Set())} 
                        kind="secondary" 
                        disabled={selectedPhotos.size === 0}
                    />
                </View>
            )}

            {viewMode === 'list' ? (
                <>
                    <View style={globalStyles.summaryCard}>
                        <Text style={globalStyles.summaryLabel}>Total Hours Logged</Text>
                        <Text style={globalStyles.summaryValue}>{totalHours}h</Text>
                    </View>
                    <FlatList
                        data={filteredSessions}
                        keyExtractor={(item) => String(item.id)}
                        ListEmptyComponent={
                            <Text style={globalStyles.emptyText}>No sessions found.</Text>
                        }
                        renderItem={renderSessionItem}
                        ListFooterComponent={
                            <View style={globalStyles.bottomActions}>
                                <Button 
                                    label="Delete All" 
                                    onPress={clearLogbook} 
                                    kind="danger" 
                                />
                            </View>
                        }
                    />
                </>
            ) : (
                <FlatList
                    data={allPhotos}
                    keyExtractor={(item, index) => item.uri + index}
                    numColumns={3}
                    ListEmptyComponent={
                        <Text style={globalStyles.emptyText}>
                            No photos found. Long press on photos to select them for deletion.
                        </Text>
                    }
                    renderItem={renderGalleryItem}
                />
            )}
            
            <FloatingBack onPress={() => navigation.navigate("Home")} />
        </View>
    );
};

export default PortfolioScreen;
