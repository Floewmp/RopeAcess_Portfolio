import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    // Container styles
    container: { 
        flex: 1, 
        backgroundColor: "#fff" 
    },
    
    // Card styles
    card: { 
        backgroundColor: "#fff", 
        borderRadius: 8, 
        padding: 16, 
        marginVertical: 8, 
        borderWidth: 1, 
        borderColor: "#eee", 
        width: '100%' 
    },
    cardTitle: { 
        fontSize: 18, 
        fontWeight: "700", 
        marginBottom: 8, 
        color: "#000" 
    },
    
    // Button styles
    btn: { 
        paddingVertical: 16, 
        paddingHorizontal: 20, 
        borderRadius: 8, 
        alignItems: "center", 
        justifyContent: 'center', 
        borderWidth: 1.5, 
        borderColor: "#000", 
        minHeight: 52 
    },
    btnFull: { width: "100%" },
    btnPrimary: { backgroundColor: "#000" },
    btnSecondary: { backgroundColor: "#fff" },
    btnDanger: { backgroundColor: "#e11d48", borderColor: "#e11d48" },
    btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    btnTextDark: { color: "#000", fontWeight: "700", fontSize: 16 },
    
    // Input styles
    input: { 
        backgroundColor: "#ffffff", 
        borderRadius: 8, 
        padding: 14, 
        borderWidth: 1, 
        borderColor: "#ddd", 
        color: "#000", 
        fontSize: 16, 
        minHeight: 52, 
        marginVertical: 4 
    },
    inputDisabled: { 
        backgroundColor: '#e9e9e9', 
        color: '#555' 
    },
    label: { 
        color: "#000", 
        fontWeight: "600", 
        marginBottom: 4, 
        marginTop: 12, 
        fontSize: 14 
    },
    helperText: { 
        fontSize: 12, 
        color: '#666', 
        marginBottom: 4 
    },
    
    // Layout styles
    row: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginTop: 8, 
        gap: 8 
    },
    
    // Navigation styles
    topbar: { 
        paddingVertical: 16, 
        alignItems: "center", 
        borderBottomWidth: 1, 
        borderColor: '#eee' 
    },
    topTitle: { 
        fontSize: 22, 
        fontWeight: "800", 
        color: "#000" 
    },
    
    // Floating action button
    fabBack: { 
        position: "absolute", 
        right: 20, 
        bottom: 20, 
        width: 56, 
        height: 56, 
        borderRadius: 8, 
        backgroundColor: "#fff", 
        borderWidth: 1.5, 
        borderColor: "#000", 
        alignItems: "center", 
        justifyContent: "center", 
        elevation: 4, 
        shadowColor: "#000", 
        shadowOpacity: 0.1, 
        shadowOffset: { width: 0, height: 2 }, 
        shadowRadius: 3 
    },
    
    // List item styles
    itemContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        borderBottomWidth: 1, 
        borderColor: '#eee' 
    },
    itemContent: { 
        padding: 16, 
        flex: 1 
    },
    itemActions: { 
        flexDirection: 'row', 
        paddingRight: 8 
    },
    itemTitle: { 
        fontSize: 18, 
        fontWeight: '600', 
        color: '#000' 
    },
    itemSubtitle: { 
        fontSize: 12, 
        color: '#666', 
        marginBottom: 4, 
        marginTop: 2 
    },
    itemText: { 
        fontSize: 14, 
        color: '#333', 
        marginTop: 4, 
        flexWrap: 'wrap' 
    },
    deleteButton: { 
        padding: 8 
    },
    editButton: { 
        padding: 8 
    },
    
    // Empty state
    emptyText: { 
        textAlign: 'center', 
        marginTop: 40, 
        color: '#666' 
    },
    
    // Image styles
    thumbnail: { 
        width: 80, 
        height: 80, 
        borderRadius: 8, 
        marginRight: 8, 
        borderWidth: 1, 
        borderColor: '#ddd' 
    },
    photoGrid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: 8 
    },
    fullImage: { 
        width: '100%', 
        height: 200, 
        borderRadius: 8, 
        marginBottom: 8, 
        backgroundColor: '#eee' 
    },
    
    // Metric styles
    metricRow: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginVertical: 6, 
        paddingVertical: 6, 
        borderBottomWidth: 1, 
        borderColor: '#f0f0f0' 
    },
    metricLabel: { 
        color: "#555", 
        fontSize: 14, 
        fontWeight: '500' 
    },
    metricValue: { 
        fontSize: 14, 
        color: "#000", 
        flex: 1, 
        textAlign: 'right', 
        marginLeft: 16 
    },
    
    // Link styles
    linkText: { 
        color: '#007BFF', 
        textAlign: 'center', 
        marginTop: 16, 
        padding: 8 
    },
    
    // Portfolio styles
    portfolioActions: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        padding: 8, 
        borderBottomWidth: 1, 
        borderColor: '#eee' 
    },
    filterContainer: { 
        padding: 16, 
        backgroundColor: '#f9f9f9' 
    },
    filterInput: { 
        backgroundColor: '#fff', 
        borderRadius: 8, 
        padding: 10, 
        borderWidth: 1, 
        borderColor: '#ddd', 
        marginBottom: 8 
    },
    sessionHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottomWidth: 1, 
        borderColor: '#f0f0f0', 
        paddingBottom: 8, 
        marginBottom: 8 
    },
    bottomActions: { 
        padding: 16, 
        borderTopWidth: 1, 
        borderColor: '#eee', 
        alignItems: 'center' 
    },
    
    // Location styles
    locationContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8 
    },
    pinButton: { 
        padding: 14, 
        borderWidth: 1.5, 
        borderColor: '#000', 
        borderRadius: 8, 
        backgroundColor: '#fff', 
        justifyContent: 'center' 
    },
    
    // Summary styles
    summaryCard: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd'
    },
    summaryLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555'
    },
    summaryValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#000',
        marginTop: 4
    },
    
    // View toggle styles
    viewToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 8,
        backgroundColor: '#eee',
        borderRadius: 8,
        marginHorizontal: 40,
    },
    viewToggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    viewToggleButtonActive: {
        backgroundColor: '#000',
    },
    viewToggleText: {
        fontWeight: '700',
        color: '#000'
    },
    viewToggleTextActive: {
        color: '#fff'
    },
    
    // Gallery styles
    galleryImageContainer: {
        width: '31%',
        aspectRatio: 1,
        margin: '1.15%',
        borderRadius: 4,
        position: 'relative',
    },
    galleryImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    selectedPhoto: {
        borderWidth: 3,
        borderColor: '#007BFF',
        borderRadius: 4,
    },
    photoSelectionOverlay: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    photoSelectionText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    
    // Home screen styles
    homeContainer: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 24,
        paddingTop: 48,
        backgroundColor: '#f5f5f5',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    brand: {
        fontSize: 28,
        fontWeight: "900",
        letterSpacing: 1,
        color: "#000",
        textAlign: 'center',
        marginBottom: 24,
    },
    userContainer: {
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        width: '100%',
        gap: 8,
    },
    userInfo: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500'
    },
    homeActions: {
        width: '100%',
        paddingVertical: 20,
    },
    homeFooter: {
        width: '100%',
        alignItems: 'center',
        minHeight: 56,
    },
    footerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
    },
    footerButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    
    // Loading styles
    loadingContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
});
