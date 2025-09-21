import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreenNew({ navigation }) {
  const { user } = useSelector((state) => state.auth);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>SnapNEarn</Text>
          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={() => navigation.navigate('Profile')}
          >
            <LinearGradient
              colors={['#00E5FF', '#7C4DFF']}
              style={styles.profileGradient}
            >
              <Text style={styles.profileInitial}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.userName}>Agent {user?.name || 'Unknown'}</Text>
            <Text style={styles.tagline}>Report • Verify • Earn</Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="document-text" size={24} color="#00E5FF" />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Reports</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color="#00BFA5" />
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Verified</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="cash" size={24} color="#7C4DFF" />
              <Text style={styles.statValue}>₹420</Text>
              <Text style={styles.statLabel}>Earned</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          {/* Main Action Button */}
          <TouchableOpacity 
            style={styles.mainActionButton}
            onPress={() => navigation.navigate('Report')}
          >
            <LinearGradient
              colors={['#00E5FF', '#7C4DFF']}
              style={styles.mainActionGradient}
            >
              <Ionicons name="camera" size={32} color="#0B0E1A" />
              <Text style={styles.mainActionText}>Report Violation</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('MyReports')}
            >
              <Ionicons name="list" size={20} color="#00E5FF" />
              <Text style={styles.quickActionText}>My Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person" size={20} color="#00E5FF" />
              <Text style={styles.quickActionText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E1A',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(26, 31, 46, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 229, 255, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00E5FF',
    letterSpacing: 1,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  profileGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B0E1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#E8F4FD',
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00E5FF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#6B7B8C',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(26, 31, 46, 0.6)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
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
  },
  mainActionButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
  },
  mainActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  mainActionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B0E1A',
    marginLeft: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(26, 31, 46, 0.7)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    marginHorizontal: 8,
  },
  quickActionText: {
    color: '#E8F4FD',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});
