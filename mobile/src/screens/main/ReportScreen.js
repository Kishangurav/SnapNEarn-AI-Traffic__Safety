import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Animated,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import locationService from '../../services/locationService';
import { addReport } from '../../store/slices/reportSlice';
import { setCurrentLocation, setAddress } from '../../store/slices/locationSlice';


export default function ReportScreen({ navigation }) {
  const dispatch = useDispatch();
  const { currentLocation, address } = useSelector((state) => state.location);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [nearbyPoliceStations, setNearbyPoliceStations] = useState([]);
  const [selectedPoliceStation, setSelectedPoliceStation] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [violationType, setViolationType] = useState('no_helmet');
  const [detectionMode, setDetectionMode] = useState('photo'); // 'photo' or 'video'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [videoFrames, setVideoFrames] = useState([]);
  const [recordingVideo, setRecordingVideo] = useState(false);

  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  const handleLocationPermission = async () => {
    setLoading(true);
    try {
      const location = await locationService.getCurrentLocation();
      if (location) {
        setLocationData(location);
        dispatch(setCurrentLocation(location));

        // Get address
        const addressData = await locationService.getAddressFromCoordinates(
          location.latitude,
          location.longitude
        );
        if (addressData) {
          dispatch(setAddress(addressData.formattedAddress));
        }

        // Find nearby police stations
        const stations = await locationService.findNearbyPoliceStations(
          location.latitude,
          location.longitude
        );
        setNearbyPoliceStations(stations);
        if (stations && stations.length > 0) {
          setSelectedPoliceStation(stations[0]); // Auto-select nearest station
        } else {
          setSelectedPoliceStation(null);
        }

        setStep(2);
      }
    } catch (error) {
      Alert.alert('Location Error', 'Unable to get your location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setStep(3);
      } else {
        Alert.alert(
          'Camera Permission Required',
          'CACHE needs camera access to capture violation photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => ImagePicker.requestCameraPermissionsAsync() }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Permission Error', 'Unable to request camera permission.');
    }
  };

  const analyzeImage = async (imageUri) => {
    try {
      setIsAnalyzing(true);

      // Simulate analysis delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock analysis result - randomly detect violations for demo
      const hasViolation = Math.random() > 0.6; // 40% chance of violation

      if (hasViolation) {
        const violations = ['No Helmet', 'Traffic Signal Violation'];
        const randomViolation = violations[Math.floor(Math.random() * violations.length)];

        return {
          success: true,
          violations: [randomViolation],
          estimated_fine: randomViolation === 'No Helmet' ? 500 : 1000,
          confidence: Math.floor(Math.random() * 20) + 80, // 80-99% confidence
          message: `Detected: ${randomViolation}`
        };
      } else {
        return {
          success: true,
          violations: [],
          estimated_fine: 0,
          confidence: 95,
          message: 'No violations detected'
        };
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      return {
        success: false,
        violations: [],
        estimated_fine: 0,
        confidence: 0,
        message: 'Analysis failed'
      };
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0]);

        // Analyze the image for helmet detection
        try {
          const analysis = await analyzeImage(result.assets[0].uri);
          setAnalysisResult(analysis);

          if (analysis.success && analysis.violations.length > 0) {
            Alert.alert(
              '🚨 Violations Detected!',
              `Found ${analysis.violations.length} violation(s): ${analysis.violations.join(', ')}\nEstimated Fine: ₹${analysis.estimated_fine}`,
              [{ text: 'Continue', onPress: () => setStep(4) }]
            );
          } else {
            Alert.alert(
              '✅ No Violations Detected',
              'The image analysis did not detect any traffic violations.',
              [{ text: 'Continue Anyway', onPress: () => setStep(4) }]
            );
          }
        } catch (error) {
          Alert.alert(
            '⚠️ Analysis Failed',
            'Could not analyze the image. You can still submit the report manually.',
            [{ text: 'Continue', onPress: () => setStep(4) }]
          );
        }
      }
    } catch (error) {
      Alert.alert('Camera Error', 'Unable to capture photo. Please try again.');
    }
  };

  const handleVideoRecording = async () => {
    try {
      if (recordingVideo) {
        // Stop recording
        setRecordingVideo(false);
        Alert.alert('Video Recording', 'Video recording stopped. Processing frames...');

        // Process video frames (mock implementation)
        if (videoFrames.length > 0) {
          setIsAnalyzing(true);

          try {
            const apiResponse = await fetch('http://localhost:5001/detect/video', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                frames: videoFrames
              })
            });

            const result = await apiResponse.json();
            setAnalysisResult(result);

            if (result.success && result.summary.unique_violations.length > 0) {
              Alert.alert(
                '🎥 Video Analysis Complete!',
                `Analyzed ${result.total_frames} frames\nViolations: ${result.summary.unique_violations.join(', ')}\nEstimated Fine: ₹${result.summary.estimated_fine}`,
                [{ text: 'Continue', onPress: () => setStep(4) }]
              );
            } else {
              Alert.alert(
                '✅ Video Analysis Complete',
                'No violations detected in the video.',
                [{ text: 'Continue', onPress: () => setStep(4) }]
              );
            }
          } catch (error) {
            Alert.alert('Analysis Error', 'Failed to analyze video. You can still submit manually.');
            setStep(4);
          } finally {
            setIsAnalyzing(false);
          }
        }
      } else {
        // Start recording
        setRecordingVideo(true);
        setVideoFrames([]);
        Alert.alert('Video Recording', 'Recording started. Tap again to stop.');

        // Mock video frame capture (in real app, this would capture actual frames)
        const mockFrames = [];
        for (let i = 0; i < 5; i++) {
          // This would be actual frame data in a real implementation
          mockFrames.push('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=');
        }
        setVideoFrames(mockFrames);
      }
    } catch (error) {
      Alert.alert('Video Error', 'Unable to record video. Please try again.');
      setRecordingVideo(false);
    }
  };

  const handleSubmitReport = async () => {
    setLoading(true);
    try {
      const reportData = {
        id: Date.now().toString(),
        type: violationType,
        location: locationData,
        address: address,
        policeStation: selectedPoliceStation,
        image: capturedImage,
        status: 'pending',
        createdAt: new Date().toISOString(),
        reward: 0,
      };

      dispatch(addReport(reportData));

      Alert.alert(
        'Report Submitted Successfully! 🎉',
        `Your violation report has been sent to ${selectedPoliceStation?.name}. You'll be notified once it's verified.`,
        [
          {
            text: 'View My Reports',
            onPress: () => navigation.navigate('MyReports')
          },
          {
            text: 'Report Another',
            onPress: () => {
              setStep(1);
              setCapturedImage(null);
              setLocationData(null);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Submission Error', 'Unable to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        {/* Enhanced Header - Black Theme */}
        <View style={styles.header}>
          <Animated.View
            style={[
              styles.headerContent,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Text style={styles.title}>SnapNEarn</Text>
            <Text style={styles.subtitle}>Report • Verify • Earn</Text>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              {[1, 2, 3, 4].map((stepNum) => (
                <View
                  key={stepNum}
                  style={[
                    styles.progressDot,
                    step >= stepNum && styles.progressDotActive
                  ]}
                />
              ))}
            </View>
          </Animated.View>
        </View>

        {step === 1 && (
          <Animated.View
            style={[
              styles.stepContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              style={styles.stepGradient}
            >
              <Text style={styles.stepIcon}>📍</Text>
              <Text style={styles.stepTitle}>Step 1: Enable Location</Text>
              <Text style={styles.stepDescription}>
                We need to verify your location to ensure accurate reporting and find the nearest police station.
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={handleLocationPermission}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>📍 Enable GPS Location</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View
            style={[
              styles.stepContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.stepGradient}
            >
              <Text style={styles.stepIcon}>✅</Text>
              <Text style={styles.stepTitle}>Location Verified!</Text>
              <Text style={styles.stepDescription}>
                📍 {address || 'Location captured successfully'}
              </Text>
              {selectedPoliceStation && (
                <View style={styles.policeStationInfo}>
                  <Text style={styles.policeStationTitle}>🚔 Nearest Police Station:</Text>
                  <Text style={styles.policeStationName}>{selectedPoliceStation.name}</Text>
                  <Text style={styles.policeStationDistance}>
                    📏 {selectedPoliceStation.distance}m away
                  </Text>
                </View>
              )}
            </LinearGradient>

            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              style={[styles.stepGradient, { marginTop: 20 }]}
            >
              <Text style={styles.stepIcon}>📷</Text>
              <Text style={styles.stepTitle}>Step 2: Camera Access</Text>
              <Text style={styles.stepDescription}>
                Allow camera access to capture violation photos with clear number plate visibility.
              </Text>
              <TouchableOpacity style={styles.button} onPress={handleCameraPermission}>
                <Text style={styles.buttonText}>📷 Enable Camera</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View
            style={[
              styles.stepContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.stepGradient}
            >
              <Text style={styles.stepIcon}>🚨</Text>
              <Text style={styles.stepTitle}>Step 3: AI-Powered Detection</Text>
              <Text style={styles.stepDescription}>
                Use our advanced AI to detect helmet violations, triple riding, and more. Choose photo or video mode.
              </Text>

              {/* Detection Mode Selection */}
              <View style={styles.detectionModeContainer}>
                <Text style={styles.violationTypeTitle}>Choose Detection Mode:</Text>
                <View style={styles.modeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.modeButton,
                      detectionMode === 'photo' && styles.modeButtonActive
                    ]}
                    onPress={() => setDetectionMode('photo')}
                  >
                    <Ionicons
                      name="camera"
                      size={24}
                      color={detectionMode === 'photo' ? '#fff' : '#8b5cf6'}
                    />
                    <Text style={[
                      styles.modeButtonText,
                      detectionMode === 'photo' && styles.modeButtonTextActive
                    ]}>
                      📸 Photo Mode
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modeButton,
                      detectionMode === 'video' && styles.modeButtonActive
                    ]}
                    onPress={() => setDetectionMode('video')}
                  >
                    <Ionicons
                      name="videocam"
                      size={24}
                      color={detectionMode === 'video' ? '#fff' : '#8b5cf6'}
                    />
                    <Text style={[
                      styles.modeButtonText,
                      detectionMode === 'video' && styles.modeButtonTextActive
                    ]}>
                      🎥 Video Mode
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.violationTypeContainer}>
                <Text style={styles.violationTypeTitle}>AI Can Detect:</Text>
                <View style={styles.violationTypes}>
                  {[
                    { key: 'no_helmet', label: '🪖 No Helmet', color: '#ef4444' },
                    { key: 'triple_riding', label: '👥 Triple Riding', color: '#f59e0b' },
                    { key: 'red_light', label: '🚦 Red Light', color: '#dc2626' },
                    { key: 'overspeeding', label: '⚡ Overspeeding', color: '#8b5cf6' },
                    { key: 'mobile_use', label: '📱 Mobile Use', color: '#06b6d4' },
                    { key: 'no_license', label: '📄 No License', color: '#84cc16' },
                  ].map((type) => (
                    <TouchableOpacity
                      key={type.key}
                      style={[
                        styles.violationTypeButton,
                        violationType === type.key && { backgroundColor: type.color }
                      ]}
                      onPress={() => setViolationType(type.key)}
                    >
                      <Text style={[
                        styles.violationTypeText,
                        violationType === type.key && { color: '#fff' }
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {detectionMode === 'photo' ? (
                  <TouchableOpacity
                    style={[styles.button, isAnalyzing && styles.buttonDisabled]}
                    onPress={handleTakePhoto}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <View style={styles.buttonContent}>
                        <ActivityIndicator color="#fff" size="small" />
                        <Text style={styles.buttonText}>🔍 Analyzing...</Text>
                      </View>
                    ) : (
                      <Text style={styles.buttonText}>📸 Capture & Analyze</Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      recordingVideo && styles.recordingButton,
                      isAnalyzing && styles.buttonDisabled
                    ]}
                    onPress={handleVideoRecording}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <View style={styles.buttonContent}>
                        <ActivityIndicator color="#fff" size="small" />
                        <Text style={styles.buttonText}>🔍 Processing Video...</Text>
                      </View>
                    ) : recordingVideo ? (
                      <Text style={styles.buttonText}>⏹️ Stop Recording</Text>
                    ) : (
                      <Text style={styles.buttonText}>🎥 Start Video Recording</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>

              {/* AI Features Info */}
              <View style={styles.aiInfoContainer}>
                <Text style={styles.aiInfoTitle}>🤖 AI Features:</Text>
                <Text style={styles.aiInfoText}>• Real-time helmet detection</Text>
                <Text style={styles.aiInfoText}>• Person counting for triple riding</Text>
                <Text style={styles.aiInfoText}>• Number plate extraction</Text>
                <Text style={styles.aiInfoText}>• Multi-violation analysis</Text>
                <Text style={styles.aiInfoText}>• Confidence scoring</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {step === 4 && (
          <Animated.View
            style={[
              styles.stepContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.stepGradient}
            >
              <Text style={styles.stepIcon}>✅</Text>
              <Text style={styles.stepTitle}>Step 4: Review & Submit</Text>
              <Text style={styles.stepDescription}>
                Review your violation report before submission.
              </Text>

              {capturedImage && (
                <View style={styles.imagePreview}>
                  <Image source={{ uri: capturedImage.uri }} style={styles.previewImage} />
                  <Text style={styles.imageLabel}>📸 Captured Evidence</Text>
                </View>
              )}

              {/* AI Analysis Results */}
              {analysisResult && (
                <View style={styles.analysisResults}>
                  <Text style={styles.analysisTitle}>🤖 AI Analysis Results:</Text>

                  {analysisResult.success ? (
                    <>
                      <View style={styles.analysisSection}>
                        <Text style={styles.analysisSectionTitle}>🚨 Violations Detected:</Text>
                        {analysisResult.violations && analysisResult.violations.length > 0 ? (
                          analysisResult.violations.map((violation, index) => (
                            <Text key={index} style={styles.violationItem}>
                              • {violation.replace('_', ' ').toUpperCase()}
                            </Text>
                          ))
                        ) : (
                          <Text style={styles.noViolationText}>✅ No violations detected</Text>
                        )}
                      </View>

                      {analysisResult.helmet_detection && (
                        <View style={styles.analysisSection}>
                          <Text style={styles.analysisSectionTitle}>🪖 Helmet Detection:</Text>
                          <Text style={styles.analysisItem}>
                            Status: {analysisResult.helmet_detection.helmet_detected ? '✅ Helmet Detected' : '❌ No Helmet'}
                          </Text>
                          <Text style={styles.analysisItem}>
                            Confidence: {(analysisResult.helmet_detection.confidence * 100).toFixed(1)}%
                          </Text>
                        </View>
                      )}

                      {analysisResult.triple_riding_detection && (
                        <View style={styles.analysisSection}>
                          <Text style={styles.analysisSectionTitle}>👥 Person Count:</Text>
                          <Text style={styles.analysisItem}>
                            People: {analysisResult.triple_riding_detection.person_count}
                          </Text>
                          <Text style={styles.analysisItem}>
                            Triple Riding: {analysisResult.triple_riding_detection.is_triple_riding ? '❌ Yes' : '✅ No'}
                          </Text>
                        </View>
                      )}

                      {analysisResult.number_plate && (
                        <View style={styles.analysisSection}>
                          <Text style={styles.analysisSectionTitle}>🔢 Number Plate:</Text>
                          <Text style={styles.analysisItem}>
                            Plate: {analysisResult.number_plate.number_plate}
                          </Text>
                          <Text style={styles.analysisItem}>
                            Confidence: {(analysisResult.number_plate.confidence * 100).toFixed(1)}%
                          </Text>
                        </View>
                      )}

                      <View style={styles.analysisSection}>
                        <Text style={styles.analysisSectionTitle}>💰 Fine Estimation:</Text>
                        <Text style={styles.fineAmount}>₹{analysisResult.estimated_fine || 0}</Text>
                        <Text style={styles.rewardAmount}>
                          Your Reward: ₹{Math.floor((analysisResult.estimated_fine || 0) * 0.1)}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <Text style={styles.analysisError}>
                      ⚠️ Analysis failed: {analysisResult.error || 'Unknown error'}
                    </Text>
                  )}
                </View>
              )}

              <View style={styles.reportSummary}>
                <Text style={styles.summaryTitle}>📋 Report Summary:</Text>
                <Text style={styles.summaryItem}>📍 Location: {address || 'GPS Location Verified'}</Text>
                <Text style={styles.summaryItem}>🚔 Police Station: {selectedPoliceStation?.name}</Text>
                <Text style={styles.summaryItem}>⚠️ Violation: {violationType.replace('_', ' ').toUpperCase()}</Text>
                <Text style={styles.summaryItem}>📸 Evidence: {detectionMode === 'video' ? 'Video Recorded' : 'Photo Captured'}</Text>
                <Text style={styles.summaryItem}>🤖 AI Analysis: {analysisResult ? 'Completed' : 'Manual Report'}</Text>
                <Text style={styles.summaryItem}>💰 Potential Reward: ₹{analysisResult ? Math.floor((analysisResult.estimated_fine || 0) * 0.1) : '50-500'}</Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmitReport}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>🚀 Submit Report</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Important Guidelines:</Text>
          <Text style={styles.infoText}>• Only report genuine violations</Text>
          <Text style={styles.infoText}>• Ensure your safety first</Text>
          <Text style={styles.infoText}>• Take clear, original photos</Text>
          <Text style={styles.infoText}>• Number plate must be visible</Text>
          <Text style={styles.infoText}>• Earn 10% of fine amount for verified reports</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#00D4FF',
  },
  stepContainer: {
    margin: 20,
  },
  stepGradient: {
    padding: 25,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  stepIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 15,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 25,
    lineHeight: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  policeStationInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  policeStationTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  policeStationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  policeStationDistance: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  violationTypeContainer: {
    marginBottom: 20,
  },
  violationTypeTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
    textAlign: 'center',
  },
  violationTypes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  violationTypeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  violationTypeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  imagePreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 15,
    marginBottom: 10,
  },
  imageLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  reportSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryItem: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    paddingLeft: 10,
  },
  infoContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#92400e',
    marginBottom: 4,
  },
  // New styles for enhanced functionality
  detectionModeContainer: {
    marginBottom: 20,
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  modeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 120,
  },
  modeButtonActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  modeButtonText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  actionButtons: {
    marginTop: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  recordingButton: {
    backgroundColor: '#ef4444',
  },
  aiInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  aiInfoTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aiInfoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 3,
  },
  analysisResults: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  analysisSection: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  analysisSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: 8,
  },
  analysisItem: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    paddingLeft: 10,
  },
  violationItem: {
    fontSize: 13,
    color: '#ef4444',
    marginBottom: 4,
    paddingLeft: 10,
    fontWeight: '600',
  },
  noViolationText: {
    fontSize: 13,
    color: '#10b981',
    paddingLeft: 10,
    fontWeight: '600',
  },
  fineAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
    textAlign: 'center',
    marginVertical: 5,
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
  },
  analysisError: {
    fontSize: 14,
    color: '#f59e0b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
