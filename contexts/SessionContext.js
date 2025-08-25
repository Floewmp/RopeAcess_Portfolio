import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from "expo-file-system";
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const SessionContext = createContext();
const SESSIONS_PATH = FileSystem.documentDirectory + "sessions.json";

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};

export const SessionProvider = ({ children }) => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadSessions = useCallback(async () => {
        setIsLoading(true);
        try {
            let sessionList = [];
            
            // Always load from local storage first
            const info = await FileSystem.getInfoAsync(SESSIONS_PATH);
            if (info.exists) {
                sessionList = JSON.parse(await FileSystem.readAsStringAsync(SESSIONS_PATH));
            }
            
            // If user is online, sync with Firebase
            if (user && db) {
                try {
                    const sessionsCol = collection(db, "users", user.uid, "sessions");
                    const sessionSnapshot = await getDocs(sessionsCol);
                    const firebaseSessions = sessionSnapshot.docs.map(doc => doc.data());
                    
                    // Merge local and Firebase sessions
                    const mergedSessions = [...sessionList];
                    
                    firebaseSessions.forEach(firebaseSession => {
                        const localIndex = mergedSessions.findIndex(s => s.id === firebaseSession.id);
                        if (localIndex === -1) {
                            // New session from Firebase
                            mergedSessions.push(firebaseSession);
                        } else {
                            // Update local session with Firebase data if it's newer
                            const localSession = mergedSessions[localIndex];
                            if (firebaseSession.lastModified > localSession.lastModified) {
                                mergedSessions[localIndex] = firebaseSession;
                            }
                        }
                    });
                    
                    sessionList = mergedSessions;
                    
                    // Save merged sessions locally
                    await FileSystem.writeAsStringAsync(SESSIONS_PATH, JSON.stringify(sessionList));
                    
                } catch (firebaseError) {
                    if (__DEV__) {
                        console.warn("Firebase sync failed, using local data:", firebaseError.message);
                    }
                    // Continue with local data if Firebase fails
                }
            }
            
            setSessions(sessionList.sort((a, b) => b.startedAt - a.startedAt));
        } catch (error) {
            console.error("Failed to load sessions:", error);
            Alert.alert("Error", "Could not load your sessions.");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    const persistSession = useCallback(async (session) => {
        // Always save locally first
        const info = await FileSystem.getInfoAsync(SESSIONS_PATH);
        let allSessions = [];
        if (info.exists) {
            allSessions = JSON.parse(await FileSystem.readAsStringAsync(SESSIONS_PATH));
        }
        const existingIndex = allSessions.findIndex(s => s.id === session.id);
        if (existingIndex > -1) {
            allSessions[existingIndex] = session;
        } else {
            allSessions.unshift(session);
        }
        await FileSystem.writeAsStringAsync(SESSIONS_PATH, JSON.stringify(allSessions));
        
        // If user is online, also save to Firebase
        if (user && db) {
            try {
                const sessionRef = doc(db, "users", user.uid, "sessions", session.id);
                await setDoc(sessionRef, session, { merge: true });
            } catch (firebaseError) {
                if (__DEV__) {
                    console.warn("Firebase save failed, but session saved locally:", firebaseError.message);
                }
                // Session is already saved locally, so we continue
            }
        }
    }, [user]);

    const sessionApi = useMemo(() => ({
        sessions,
        isLoading,
        createSession: async (sessionData) => {
            const id = Date.now().toString();
            const newSession = { id, ...sessionData };
            const newSessions = [newSession, ...sessions].sort((a, b) => b.startedAt - a.startedAt);
            setSessions(newSessions);
            await persistSession(newSession);
        },
        updateSession: async (sessionData) => {
            const newSessions = sessions.map(s => s.id === sessionData.id ? sessionData : s).sort((a, b) => b.startedAt - a.startedAt);
            setSessions(newSessions);
            await persistSession(sessionData);
        },
        deleteSession: async (sessionId) => {
            Alert.alert("Delete Session", "Are you sure you want to delete this session?", [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive", onPress: async () => {
                        const newSessions = sessions.filter(s => s.id !== sessionId);
                        setSessions(newSessions);
                        
                        // Always delete locally first
                        await FileSystem.writeAsStringAsync(SESSIONS_PATH, JSON.stringify(newSessions));
                        
                        // If user is online, also delete from Firebase
                        if (user && db) {
                            try {
                                const sessionRef = doc(db, "users", user.uid, "sessions", sessionId);
                                await deleteDoc(sessionRef);
                                                    } catch (firebaseError) {
                            if (__DEV__) {
                                console.warn("Firebase delete failed, but session deleted locally:", firebaseError.message);
                            }
                            // Session is already deleted locally, so we continue
                        }
                        }
                    }
                }
            ]);
        },
        clearLogbook: async () => {
            Alert.alert("Confirm", "Delete all sessions?", [
                { text: "Cancel" }, 
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        // Always clear locally first
                        await FileSystem.deleteAsync(SESSIONS_PATH, { idempotent: true });
                        setSessions([]);
                        
                        // If user is online, also clear from Firebase
                        if (user && db) {
                            try {
                                const deletePromises = sessions.map(s => deleteDoc(doc(db, "users", user.uid, "sessions", s.id)));
                                await Promise.all(deletePromises);
                                                    } catch (firebaseError) {
                            if (__DEV__) {
                                console.warn("Firebase clear failed, but sessions cleared locally:", firebaseError.message);
                            }
                            // Sessions are already cleared locally, so we continue
                        }
                        }
                    }
                }
            ]);
        },
        refreshSessions: loadSessions,
    }), [sessions, user, persistSession, loadSessions]);

    return <SessionContext.Provider value={sessionApi}>{children}</SessionContext.Provider>;
};
