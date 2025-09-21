import * as Location from 'expo-location';
import { Alert } from 'react-native';

class LocationService {
  constructor() {
    this.currentLocation = null;
    this.watchId = null;
  }

  // Request location permissions
  async requestPermissions() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'CACHE needs location access to verify violation reports and find nearby police stations.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  // Get current location
  async getCurrentLocation() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
      });

      this.currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };

      return this.currentLocation;
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  // Get address from coordinates
  async getAddressFromCoordinates(latitude, longitude) {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        return {
          street: address.street || '',
          city: address.city || '',
          region: address.region || '',
          postalCode: address.postalCode || '',
          country: address.country || '',
          formattedAddress: `${address.street || ''}, ${address.city || ''}, ${address.region || ''} ${address.postalCode || ''}`.trim(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  }

  // Find nearby police stations (mock implementation)
  async findNearbyPoliceStations(latitude, longitude, radius = 5000) {
    try {
      // Mock police stations data - in real app, this would call a police stations API
      const mockPoliceStations = [
        {
          id: 'ps_001',
          name: 'MG Road Police Station',
          address: 'MG Road, Bangalore, Karnataka 560001',
          phone: '+91-80-22942222',
          latitude: latitude + 0.01,
          longitude: longitude + 0.01,
          distance: 1200,
        },
        {
          id: 'ps_002',
          name: 'Brigade Road Police Station',
          address: 'Brigade Road, Bangalore, Karnataka 560025',
          phone: '+91-80-22943333',
          latitude: latitude - 0.01,
          longitude: longitude - 0.01,
          distance: 1800,
        },
        {
          id: 'ps_003',
          name: 'Commercial Street Police Station',
          address: 'Commercial Street, Bangalore, Karnataka 560001',
          phone: '+91-80-22944444',
          latitude: latitude + 0.005,
          longitude: longitude - 0.005,
          distance: 900,
        },
      ];

      // Sort by distance and return closest stations
      return mockPoliceStations
        .filter(station => station.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Error finding nearby police stations:', error);
      return [];
    }
  }

  // Calculate distance between two coordinates
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  // Start watching location changes
  async startWatchingLocation(callback) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          this.currentLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp,
          };
          
          if (callback) {
            callback(this.currentLocation);
          }
        }
      );

      return this.watchId;
    } catch (error) {
      console.error('Error starting location watch:', error);
      return null;
    }
  }

  // Stop watching location changes
  stopWatchingLocation() {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
    }
  }

  // Check if location services are enabled
  async isLocationEnabled() {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch (error) {
      console.error('Error checking location services:', error);
      return false;
    }
  }

  // Get location accuracy status
  getLocationAccuracy() {
    if (!this.currentLocation) return null;
    
    const accuracy = this.currentLocation.accuracy;
    if (accuracy <= 5) return 'excellent';
    if (accuracy <= 10) return 'good';
    if (accuracy <= 20) return 'fair';
    return 'poor';
  }
}

export default new LocationService();
