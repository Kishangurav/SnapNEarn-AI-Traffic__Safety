import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import locationService from '../../services/locationService';
import { setCurrentLocation, setPermissionGranted, setError } from '../../store/slices/locationSlice';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentLocation } = useSelector((state) => state.location);
  const [isRefreshingStations, setIsRefreshingStations] = useState(false);
  const [riderMode, setRiderMode] = useState(true);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [userStats, setUserStats] = useState({
    reports: 0,
    verified: 0,
    earned: 0
  });

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const locationPulseAnim = useRef(new Animated.Value(1)).current;

  const refreshPoliceStations = async () => {
    if (!currentLocation) return;

    setIsRefreshingStations(true);
    try {
      const stations = await locationService.findNearbyPoliceStations(
        currentLocation.latitude,
        currentLocation.longitude,
        10000
      );
      setNearbyStations(stations);
    } catch (error) {
      console.error('Error refreshing police stations:', error);
      Alert.alert('Error', 'Failed to refresh police stations');
    } finally {
      setIsRefreshingStations(false);
    }
  };

  const handleRiderModeToggle = () => {
    setRiderMode(!riderMode);
  };

  // Memoize expensive calculations for better performance
  const memoizedStyles = useMemo(() => ({
    container: {
      flex: 1,
    },
    gradient: ['#0F172A', '#1E293B', '#334155'], // Darker gradient
    buttonGradient: ['#3B82F6', '#1D4ED8', '#1E40AF'],
    cardGradient: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
  }), []);

  useEffect(() => {
    console.log('🎨 HomeScreen: Starting enhanced animations...');

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => console.log('✅ Fade animation completed'));

    // Scale animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start(() => console.log('✅ Scale animation completed'));

    // Pulse animation for location
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(locationPulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(locationPulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    console.log('🔄 Pulse animation started');

    let watchSub = null;
    let locationRefreshTimer = null;

    const initLocation = async () => {
      try {
        console.log('📍 HomeScreen: Requesting location permissions...');
        const granted = await locationService.requestPermissions();
        dispatch(setPermissionGranted(granted));
        if (!granted) {
          dispatch(setError('Location permission denied. Please enable location services in settings.'));
          return;
        }

        console.log('✅ Location permissions granted');

        // Get initial location
        const loc = await locationService.getCurrentLocation();
        if (loc) {
          console.log('📍 Got location:', loc.latitude, loc.longitude);
          dispatch(setCurrentLocation(loc));

          // Load nearby police stations
          try {
            console.log('🏢 Loading nearby police stations...');
            const stations = await locationService.findNearbyPoliceStations(
              loc.latitude,
              loc.longitude,
              10000 // 10km radius
            );
            setNearbyStations(stations);
            console.log('✅ Found', stations.length, 'police stations');
          } catch (stationError) {
            console.error('❌ Error loading police stations:', stationError);
            dispatch(setError('Failed to load nearby police stations'));
          }

          // Start watching location changes
          watchSub = await locationService.startWatchingLocation(async (newLoc) => {
            console.log('📍 Location updated:', newLoc.latitude, newLoc.longitude);
            dispatch(setCurrentLocation(newLoc));

            // Refresh police stations every 30 seconds or on significant location change
            if (locationRefreshTimer) {
              clearTimeout(locationRefreshTimer);
            }
            locationRefreshTimer = setTimeout(async () => {
              try {
                const stations = await locationService.findNearbyPoliceStations(
                  newLoc.latitude,
                  newLoc.longitude,
                  10000
                );
                setNearbyStations(stations);
              } catch (refreshError) {
                console.error('Error refreshing police stations:', refreshError);
              }
            }, 30000); // Refresh every 30 seconds
          });
        }
      } catch (e) {
        console.error('❌ Location initialization error:', e);
        dispatch(setError(e?.message || 'Failed to initialize location services'));
      }
    };

    initLocation();

    return () => {
      locationService.stopWatchingLocation();
      if (watchSub && watchSub.remove) {
        watchSub.remove();
      }
      if (locationRefreshTimer) {
        clearTimeout(locationRefreshTimer);
      }
      pulseAnimation.stop();
      console.log('🛑 HomeScreen cleanup completed');
    };
  }, [dispatch, fadeAnim, scaleAnim, locationPulseAnim]);

  return (
    <LinearGradient
      colors={memoizedStyles.gradient}
      style={memoizedStyles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Debug Animation Indicator - Remove this after testing */}
      <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.7)', padding: 5, borderRadius: 5, zIndex: 1000 }}>
        <Text style={{ color: 'white', fontSize: 10 }}>
          Fade: {fadeAnim.__getValue()?.toFixed(2) || '0.00'} |
          Scale: {scaleAnim.__getValue()?.toFixed(2) || '0.00'} |
          Pulse: {locationPulseAnim.__getValue()?.toFixed(2) || '0.00'}
        </Text>
      </View>

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header */}
        <Animated.View style={[styles.header, { transform: [{ scale: locationPulseAnim }] }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.appName}>SnapNEarn</Text>
              <Text style={styles.tagline}>Report • Verify • Earn</Text>
            </View>

            <View style={styles.headerRight}>
              {/* Enhanced Profile Button */}
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile', {
                  userStats,
                  user: user || { name: 'Demo User', age: 25, vehicleNumber: 'KA01AB1234' }
                })}
              >
                <Animated.View style={[styles.profileIconContainer, { transform: [{ scale: locationPulseAnim }] }]}>
                  <Ionicons name="person-circle" size={32} color="#3B82F6" />
                  {userStats.reports > 0 && (
                    <Animated.View style={[styles.notificationBadge, { transform: [{ scale: locationPulseAnim }] }]}>
                      <Text style={styles.badgeText}>{userStats.reports}</Text>
                    </Animated.View>
                  )}
                </Animated.View>
              </TouchableOpacity>

              {/* Enhanced Rider Mode Toggle */}
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
        </Animated.View>

        {/* Enhanced Live Location & Nearby Police */}
        <Animated.View style={[styles.locationCard, { transform: [{ scale: locationPulseAnim }] }]}>
          <View style={styles.locationHeader}>
            <Animated.View style={{ transform: [{ scale: locationPulseAnim }] }}>
              <Ionicons name="location" size={18} color="#3B82F6" />
            </Animated.View>
            <Text style={styles.locationTitle}>Live Location</Text>
          </View>
          {currentLocation ? (
            <Animated.Text style={[styles.locationText, { transform: [{ scale: locationPulseAnim }] }]}>
              Lat: {currentLocation.latitude.toFixed(5)}  Lon: {currentLocation.longitude.toFixed(5)}
            </Animated.Text>
          ) : (
            <Animated.Text style={[styles.locationText, { transform: [{ scale: locationPulseAnim }] }]}>
              Fetching location…
            </Animated.Text>
          )}

          <View style={styles.stationsHeader}>
            <Animated.View style={{ transform: [{ scale: locationPulseAnim }] }}>
              <Ionicons name="shield" size={16} color="#10B981" />
            </Animated.View>
            <Text style={styles.stationsTitle}>Nearby Police Stations</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={refreshPoliceStations}
              disabled={isRefreshingStations}
            >
              <Animated.View style={{ transform: [{ rotate: isRefreshingStations ? '360deg' : '0deg' }] }}>
                <Ionicons
                  name={isRefreshingStations ? "refresh" : "refresh-outline"}
                  size={16}
                  color={isRefreshingStations ? "#999" : "#10B981"}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
          {nearbyStations.length === 0 ? (
            <Animated.Text style={[styles.noStationsText, { transform: [{ scale: locationPulseAnim }] }]}>
              No police stations found nearby. Pull down to refresh or check your location.
            </Animated.Text>
          ) : (
            nearbyStations.slice(0, 3).map((s, index) => (
              <Animated.View
                key={s.id}
                style={[
                  styles.stationRow,
                  {
                    transform: [{ scale: locationPulseAnim }],
                    opacity: fadeAnim,
                    marginBottom: index === nearbyStations.slice(0, 3).length - 1 ? 0 : 8
                  }
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.stationName}>{s.name}</Text>
                  <Text style={styles.stationAddress}>{s.address}</Text>
                  <Text style={styles.stationDistance}>{Math.round(s.distance)}m away</Text>
                </View>
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => {
                    const phoneNumber = s.phone.replace(/[^\d+]/g, '');
                    Alert.alert(
                      'Contact Police Station',
                      `${s.name}\n${s.phone}`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Call', onPress: () => console.log(`Calling ${phoneNumber}`) }
                      ]
                    );
                  }}
                >
                  <Ionicons name="call" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </Animated.View>

        {/* Enhanced Stats Cards */}
        <View style={styles.statsContainer}>
          {[
            { icon: '📄', value: userStats.reports, label: 'Reports', color: '#3B82F6' },
            { icon: '✅', value: userStats.verified, label: 'Verified', color: '#10B981' },
            { icon: '💰', value: `₹${userStats.earned}`, label: 'Earned', color: '#F59E0B' }
          ].map((stat, index) => (
            <Animated.View
              key={index}
              style={[
                styles.statCard,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: fadeAnim,
                  backgroundColor: `rgba(${stat.color === '#3B82F6' ? '59, 130, 246' : stat.color === '#10B981' ? '16, 185, 129' : '245, 158, 11'}, 0.1)`,
                  borderColor: stat.color,
                  borderWidth: 2,
                  shadowColor: stat.color,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }
              ]}
            >
              <Text style={[styles.statIcon, { color: stat.color }]}>{stat.icon}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: stat.color }]}>{stat.label}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Enhanced Main Action Button */}
        <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Capture')}>
          <LinearGradient
            colors={memoizedStyles.buttonGradient}
            style={styles.mainButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View style={{ transform: [{ scale: locationPulseAnim }] }}>
              <Text style={styles.mainButtonIcon}>📸</Text>
            </Animated.View>
            <Text style={styles.mainButtonText}>Capture Evidence</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Enhanced Quick Actions */}
        <View style={styles.quickActions}>
          {[
            { icon: '📋', text: 'My Reports', onPress: () => navigation.navigate('MyReports') },
            { icon: '❓', text: 'Help', onPress: () => Alert.alert('Help', 'Contact support for assistance') }
          ].map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.quickActionButton,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: fadeAnim,
                  backgroundColor: index === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  borderColor: index === 0 ? '#3B82F6' : '#10B981',
                  borderWidth: 1,
                }
              ]}
              onPress={action.onPress}
            >
              <Text style={[styles.quickActionIcon, { color: index === 0 ? '#3B82F6' : '#10B981' }]}>{action.icon}</Text>
              <Text style={[styles.quickActionText, { color: index === 0 ? '#3B82F6' : '#10B981' }]}>{action.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Enhanced App Features */}
        <View style={[styles.featuresCard, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
          <Text style={styles.featuresTitle}>📱 App Features</Text>
          {[
            'Easy photo and video capture',
            'Simple violation reporting',
            'Track your contributions',
            'Earn rewards for reports',
            'Clean and intuitive interface'
          ].map((feature, index) => (
            <Text key={index} style={styles.featureItem}>• {feature}</Text>
          ))}
        </View>

        {/* Enhanced App Info */}
        <View style={[styles.appInfo, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
          <Text style={styles.appInfoTitle}>SnapNEarn</Text>
          <Text style={styles.appInfoText}>
            Simple and clean traffic violation reporting app. Capture evidence, report violations, and earn rewards.
          </Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </Animated.ScrollView>
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
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC',
    textShadowColor: 'rgba(59, 130, 246, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  profileButton: {
    padding: 5,
    borderRadius: 25,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
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
    borderWidth: 2,
    borderColor: '#F8FAFC',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  riderModeContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  riderModeLabel: {
    fontSize: 12,
    color: '#94A3B8',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
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
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  mainButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    fontWeight: '500',
  },
  featuresCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
    lineHeight: 20,
  },
  appInfo: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  locationCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  locationGradient: {
    padding: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginLeft: 8,
  },
  locationInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 13,
    color: '#F8FAFC',
    marginBottom: 4,
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  accuracyText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    fontStyle: 'italic',
  },
  stationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    flex: 1,
    marginLeft: 6,
  },
  refreshButton: {
    padding: 4,
  },
  noStationsText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 12,
  },
  stationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    flex: 1,
    marginLeft: 8,
  },
  refreshButton: {
    padding: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 8,
  },
  noStationsContainer: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  noStationsText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  noStationsSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  stationsContainer: {
    marginTop: 8,
  },
  stationCard: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  stationGradient: {
    padding: 16,
  },
  stationInfo: {
    flex: 1,
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stationName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F8FAFC',
    marginLeft: 8,
    flex: 1,
  },
  stationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationDistance: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 4,
    fontWeight: '500',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationPhone: {
    fontSize: 12,
    color: '#8B5CF6',
    marginLeft: 4,
    fontWeight: '500',
  },
  moreStationsText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
