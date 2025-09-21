import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

const { width, height } = Dimensions.get('window');

export default function CaptureScreen({ navigation, route }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePhotoCapture = async () => {
    setIsProcessing(true);

    // Simulate photo capture
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        '📸 Photo Captured!',
        'Your photo evidence has been captured successfully.',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    }, 2000);
  };

  const handleVideoCapture = async () => {
    setIsProcessing(true);

    // Simulate video capture
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        '🎥 Video Recorded!',
        'Your video evidence has been recorded successfully.',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    }, 3000);
  };

  const handlePhotoUpload = async () => {
    setIsProcessing(true);

    // Simulate photo upload
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        '📁 Photo Uploaded!',
        'Your photo has been uploaded successfully.',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    }, 2000);
  };

  const handleVideoUpload = async () => {
    setIsProcessing(true);

    // Simulate video upload
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        '📁 Video Uploaded!',
        'Your video has been uploaded successfully.',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    }, 3000);
  };

  return (
    <LinearGradient
      colors={['#F8FAFC', '#E2E8F0']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Capture Evidence</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Ionicons name="information-circle" size={20} color="#3B82F6" />
          <Text style={styles.infoTitle}>Capture Instructions</Text>
        </View>
        <Text style={styles.infoText}>
          • Take clear photos or videos of traffic violations
        </Text>
        <Text style={styles.infoText}>
          • Ensure good lighting and visibility
        </Text>
        <Text style={styles.infoText}>
          • Include license plates when possible
        </Text>
      </View>

      {/* Capture Options */}
      <View style={styles.optionsContainer}>
        <Text style={styles.sectionTitle}>📸 Photo Options</Text>
        
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={handlePhotoCapture}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={styles.optionGradient}
          >
            <Ionicons name="camera" size={32} color="#FFFFFF" />
            <Text style={styles.optionTitle}>Capture Photo</Text>
            <Text style={styles.optionDesc}>Take a new photo with camera</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={handlePhotoUpload}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.optionGradient}
          >
            <Ionicons name="image" size={32} color="#FFFFFF" />
            <Text style={styles.optionTitle}>Upload Photo</Text>
            <Text style={styles.optionDesc}>Select from gallery</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>🎥 Video Options</Text>

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={handleVideoCapture}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            style={styles.optionGradient}
          >
            <Ionicons name="videocam" size={32} color="#FFFFFF" />
            <Text style={styles.optionTitle}>Record Video</Text>
            <Text style={styles.optionDesc}>Record up to 30 seconds</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={handleVideoUpload}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            style={styles.optionGradient}
          >
            <Ionicons name="film" size={32} color="#FFFFFF" />
            <Text style={styles.optionTitle}>Upload Video</Text>
            <Text style={styles.optionDesc}>Select from gallery</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Processing Indicator */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: height * 0.06,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  placeholder: {
    width: 40,
  },
  infoCard: {
    margin: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
    lineHeight: 20,
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginVertical: 16,
  },
  optionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionGradient: {
    padding: 20,
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingCard: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
});
