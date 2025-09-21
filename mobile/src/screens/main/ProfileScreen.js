import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';


export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => dispatch(logout()) }
      ]
    );
  };

  const profileOptions = [
    { title: 'Edit Profile', icon: '✏️', onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available soon!') },
    { title: 'Notification Settings', icon: '🔔', onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon!') },
    { title: 'Payment History', icon: '💰', onPress: () => Alert.alert('Coming Soon', 'Payment history will be available soon!') },
    { title: 'Help & Support', icon: '❓', onPress: () => Alert.alert('Coming Soon', 'Help & support will be available soon!') },
    { title: 'Terms & Conditions', icon: '📄', onPress: () => Alert.alert('Coming Soon', 'Terms & conditions will be available soon!') },
    { title: 'Privacy Policy', icon: '🔒', onPress: () => Alert.alert('Coming Soon', 'Privacy policy will be available soon!') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          <Text style={styles.userPhone}>{user?.phone || '+91 9876543210'}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Total Reports</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Verified</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>₹450</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>95%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>CACHE v1.0.0</Text>
          <Text style={styles.appInfoText}>Making roads safer together</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E1A',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  profileHeader: {
    backgroundColor: 'rgba(26, 31, 46, 0.7)',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 229, 255, 0.2)',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#00E5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00E5FF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E8F4FD',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7B8C',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 16,
    color: '#bfdbfe',
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  optionsSection: {
    padding: 20,
  },
  optionItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  optionArrow: {
    fontSize: 20,
    color: '#9ca3af',
  },
  logoutSection: {
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  appInfo: {
    padding: 20,
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
});
