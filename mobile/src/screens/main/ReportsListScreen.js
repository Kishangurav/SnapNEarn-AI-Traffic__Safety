import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LayoutContainer from '../../components/LayoutContainer';


const mockReports = [
  {
    id: '1',
    type: 'No Helmet',
    location: 'MG Road, Bangalore',
    status: 'verified',
    reward: '₹50',
    date: '2024-01-15',
    numberPlate: 'KA01AB1234'
  },
  {
    id: '2',
    type: 'Signal Jump',
    location: 'Brigade Road, Bangalore',
    status: 'under_review',
    reward: '₹0',
    date: '2024-01-14',
    numberPlate: 'KA02CD5678'
  },
  {
    id: '3',
    type: 'No Helmet',
    location: 'Commercial Street, Bangalore',
    status: 'verified',
    reward: '₹45',
    date: '2024-01-13',
    numberPlate: 'KA03EF9012'
  },
];

export default function ReportsListScreen({ navigation }) {
  const { reports } = useSelector((state) => state.reports);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'under_review': return '#3b82f6';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'verified': return 'Verified ✅';
      case 'pending': return 'Pending 🔍';
      case 'under_review': return 'Under Review 🔍';
      case 'rejected': return 'Rejected ❌';
      default: return 'Pending';
    }
  };

  const renderReportItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.reportCard,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            })
          }]
        }
      ]}
    >
      <LinearGradient
        colors={['#fff', '#f8fafc']}
        style={styles.reportCardGradient}
      >
        <View style={styles.reportHeader}>
          <View style={styles.reportTypeContainer}>
            <Text style={styles.reportTypeIcon}>
              {item.type === 'no_helmet' ? '🪖' :
               item.type === 'signal_jump' ? '🚦' :
               item.type === 'wrong_side' ? '↔️' : '⚠️'}
            </Text>
            <Text style={styles.reportType}>
              {item.type?.replace('_', ' ').toUpperCase() || item.type}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <Text style={styles.location}>📍 {item.address || item.location}</Text>
        {item.policeStation && (
          <Text style={styles.policeStation}>🚔 {item.policeStation.name}</Text>
        )}
        <Text style={styles.date}>📅 {new Date(item.createdAt || item.date).toLocaleDateString()}</Text>

        {item.image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image.uri }} style={styles.reportImage} />
            <Text style={styles.imageLabel}>📸 Evidence Photo</Text>
          </View>
        )}

        <View style={styles.rewardContainer}>
          <Text style={styles.rewardLabel}>Reward:</Text>
          <Text style={[
            styles.rewardAmount,
            { color: item.status === 'verified' ? '#10b981' : '#6b7280' }
          ]}>
            ₹{item.reward || 0}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // Use actual reports data or fallback to mock data for demo
  const displayReports = reports.length > 0 ? reports : mockReports;

  return (
    <LayoutContainer navigation={navigation} headerTitle="My Reports">
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="document-text" size={24} color="#00E5FF" />
              <Text style={styles.statValue}>{displayReports.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color="#00BFA5" />
              <Text style={styles.statValue}>
                {displayReports.filter(r => r.status === 'verified').length}
              </Text>
              <Text style={styles.statLabel}>Verified</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="cash" size={24} color="#7C4DFF" />
              <Text style={styles.statValue}>
                ₹{displayReports.reduce((sum, r) => sum + (r.reward || 0), 0)}
              </Text>
              <Text style={styles.statLabel}>Earned</Text>
            </View>
          </View>
        </View>

        {/* Reports List */}
        {displayReports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>No Reports Yet</Text>
            <Text style={styles.emptySubtitle}>Start reporting violations to make roads safer!</Text>
            <TouchableOpacity
              style={styles.startReportingButton}
              onPress={() => navigation.navigate('Report')}
            >
              <LinearGradient
                colors={['#00E5FF', '#7C4DFF']}
                style={styles.startReportingGradient}
              >
                <Ionicons name="add-circle-outline" size={24} color="#0B0E1A" />
                <Text style={styles.startReportingText}>Start Reporting</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.reportsList}>
            {displayReports.slice(0, 4).map((item, index) => (
              <View key={item.id}>
                {renderReportItem({ item, index })}
              </View>
            ))}
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Report')}
            >
              <Text style={styles.viewAllText}>Report New Violation</Text>
              <Ionicons name="arrow-forward" size={20} color="#00E5FF" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </LayoutContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  statsContainer: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(26, 31, 46, 0.6)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E8F4FD',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7B8C',
    textAlign: 'center',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E8F4FD',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7B8C',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  startReportingButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  startReportingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  startReportingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B0E1A',
    marginLeft: 8,
  },
  reportsList: {
    paddingVertical: 20,
  },
  reportCard: {
    backgroundColor: 'rgba(26, 31, 46, 0.6)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.15)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportType: {
    fontSize: 18,
    fontWeight: '300',
    color: '#E8F4FD',
    letterSpacing: 0.5,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  location: {
    fontSize: 14,
    color: '#6B7B8C',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  numberPlate: {
    fontSize: 14,
    color: '#6B7B8C',
    marginBottom: 16,
    letterSpacing: 0.5,
    fontFamily: 'monospace',
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 229, 255, 0.1)',
    paddingTop: 16,
  },
  date: {
    fontSize: 12,
    color: '#6B7B8C',
    letterSpacing: 0.5,
  },
  reward: {
    fontSize: 16,
    fontWeight: '500',
    color: '#00BFA5',
    letterSpacing: 0.5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26, 31, 46, 0.6)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00E5FF',
    marginRight: 8,
  },
});
