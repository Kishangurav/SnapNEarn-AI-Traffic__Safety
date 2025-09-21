import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user } = useSelector((state) => state.auth);
  const [riderMode, setRiderMode] = useState(true);
  const [userStats, setUserStats] = useState({
    reports: 0,
    verified: 0,
    earned: 0,
    rating: 0.0
  });

  const handleRiderModeToggle = () => {
    setRiderMode(!riderMode);
  };

  // Memoize expensive calculations for better performance
  const memoizedStyles = useMemo(() => ({
    container: {
      flex: 1,
    },
    gradient: ['#F8FAFC', '#E2E8F0'],
    buttonGradient: ['#3B82F6', '#1D4ED8'],
  }), []);

  return (
    <LinearGradient
      colors={memoizedStyles.gradient}
      style={memoizedStyles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.appName}>SnapNEarn</Text>
              <Text style={styles.tagline}>Report • Verify • Earn</Text>
            </View>

            <View style={styles.headerRight}>
              {/* Profile Button */}
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile', { 
                  userStats, 
                  user: user || { name: 'Demo User', age: 25, vehicleNumber: 'KA01AB1234' }
                })}
              >
                <View style={styles.profileIconContainer}>
                  <Ionicons name="person-circle" size={32} color="#3B82F6" />
                  {userStats.reports > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.badgeText}>{userStats.reports}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {/* Rider Mode Toggle */}
              <View style={styles.riderModeContainer}>
                <Text style={styles.riderModeLabel}>
                  {riderMode ? '🏍️ Rider Mode' : '🚗 Non-Rider'}
                </Text>
                <Switch
                  value={riderMode}
                  onValueChange={handleRiderModeToggle}
                  trackColor={{ false: '#767577', true: '#3B82F6' }}
                  thumbColor={riderMode ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📄</Text>
            <Text style={styles.statValue}>{userStats.reports}</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statValue}>{userStats.verified}</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statValue}>₹{userStats.earned}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{userStats.rating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Main Action Button */}
        <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Capture')}>
          <LinearGradient
            colors={memoizedStyles.buttonGradient}
            style={styles.mainButtonGradient}
          >
            <Text style={styles.mainButtonIcon}>📸</Text>
            <Text style={styles.mainButtonText}>Capture Evidence</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('MyReports')}
          >
            <Text style={styles.quickActionIcon}>📋</Text>
            <Text style={styles.quickActionText}>My Reports</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => Alert.alert('Help', 'Contact support for assistance')}
          >
            <Text style={styles.quickActionIcon}>❓</Text>
            <Text style={styles.quickActionText}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* App Features */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>📱 App Features</Text>
          <Text style={styles.featureItem}>• Easy photo and video capture</Text>
          <Text style={styles.featureItem}>• Simple violation reporting</Text>
          <Text style={styles.featureItem}>• Track your contributions</Text>
          <Text style={styles.featureItem}>• Earn rewards for reports</Text>
          <Text style={styles.featureItem}>• Clean and intuitive interface</Text>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>SnapNEarn</Text>
          <Text style={styles.appInfoText}>
            Simple and clean traffic violation reporting app. Capture evidence, report violations, and earn rewards.
          </Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: height * 0.06,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  tagline: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  profileButton: {
    padding: 5,
  },
  profileIconContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  riderModeContainer: {
    alignItems: 'center',
  },
  riderModeLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  mainButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mainButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mainButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  featuresCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
    lineHeight: 20,
  },
  appInfo: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 8,
  },
  appInfoText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
