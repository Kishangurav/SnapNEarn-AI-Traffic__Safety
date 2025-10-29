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

      let location = null;
      try {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeout: 10000,
        });
      } catch (e) {
        // As a safe fallback, use last known position if available (no fabricated values)
        const lastKnown = await Location.getLastKnownPositionAsync();
        if (lastKnown) {
          location = lastKnown;
        } else {
          throw e;
        }
      }

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

  // Find nearby police stations using Overpass API (real data)
  async findNearbyPoliceStations(latitude, longitude, radius = 10000) {
    try {
      // Overpass API Query for police stations within radius (meters)
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="police"](around:${radius},${latitude},${longitude});
          way["amenity"="police"](around:${radius},${latitude},${longitude});
          relation["amenity"="police"](around:${radius},${latitude},${longitude});
        );
        out center;
      `;

      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.elements || data.elements.length === 0) {
        // Return an empty list when no real stations are found; do not fabricate
        return [];
      }

      const stations = data.elements
        .filter(element => {
          const lat = element.lat || element.center?.lat;
          const lon = element.lon || element.center?.lon;
          return lat && lon && element.tags?.name;
        })
        .map(element => {
          const lat = element.lat || element.center.lat;
          const lon = element.lon || element.center.lon;
          const distance = this.calculateDistance(latitude, longitude, lat, lon);

          return {
            id: `ps_${element.id || Math.random().toString(36).substr(2, 9)}`,
            name: element.tags.name || 'Police Station',
            address: element.tags['addr:full'] || element.tags.address || 'Address not available',
            phone: element.tags.phone || element.tags['contact:phone'] || 'Phone not available',
            latitude: lat,
            longitude: lon,
            distance: Math.round(distance),
          };
        })
        .filter(station => station.distance <= radius)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10); // Limit to 10 closest stations

      return stations;

    } catch (error) {
      console.error('Error fetching real police stations:', error);
      // On failure, return an empty list; do not generate mock/random data
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
