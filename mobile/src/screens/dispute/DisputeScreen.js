import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const DisputeScreen = ({ route, navigation }) => {
  const { disputeId } = route.params;
  const [disputeData, setDisputeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDisputeData();
  }, []);

  const loadDisputeData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/dispute-status/${disputeId}`);
      const result = await response.json();
      
      if (result.success) {
        setDisputeData(result.dispute);
      } else {
        Alert.alert('Error', 'Unable to load dispute information');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Unable to connect to the dispute service');
    } finally {
      setLoading(false);
    }
  };

  const submitDispute = async () => {
    setSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8080/create-dispute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dispute_id: disputeId,
          challan_data: {
            violation_type: 'helmet_violation',
            location: 'Sample Location',
            timestamp: new Date().toISOString(),
            reporter_id: 'user123',
            photo_data: 'sample_photo_data'
          },
          vehicle_owner_contact: '+919597400881'
        }),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert(
          '✅ Dispute Submitted',
          `Your dispute has been submitted successfully!\n\nDispute ID: ${disputeId}\nEstimated Resolution: ${result.estimated_resolution}\n\nOur AI system will analyze the evidence and forward it to the police for review.`,
          [
            {
              text: 'Track Status',
              onPress: () => loadDisputeData()
            }
          ]
        );
      } else {
        Alert.alert('Submission Failed', result.error || 'Unable to submit dispute');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Unable to submit dispute. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_AI_ANALYSIS': return '#FF9800';
      case 'PENDING_POLICE_REVIEW': return '#2196F3';
      case 'RESOLVED_GENUINE': return '#4CAF50';
      case 'RESOLVED_FAKE': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING_AI_ANALYSIS': return 'AI Analysis in Progress';
      case 'PENDING_POLICE_REVIEW': return 'Under Police Review';
      case 'RESOLVED_GENUINE': return 'Violation Confirmed';
      case 'RESOLVED_FAKE': return 'Marked as Fake Report';
      default: return 'Processing';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading dispute information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#2196F3', '#1976D2']}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dispute Violation</Text>
          <Ionicons name="shield-checkmark" size={28} color="#FFFFFF" />
        </LinearGradient>

        {/* Dispute Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚨 Dispute Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dispute ID:</Text>
              <Text style={styles.infoValue}>{disputeId}</Text>
            </View>
            
            {disputeData && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Status:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(disputeData.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(disputeData.status)}</Text>
                  </View>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Created:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(disputeData.created_at).toLocaleString()}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* AI Analysis Results */}
        {disputeData?.ai_analysis && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🤖 AI Analysis Results</Text>
            
            <View style={styles.analysisCard}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Fraud Risk Score</Text>
                <Text style={[
                  styles.scoreValue,
                  { color: disputeData.ai_analysis.overall_score >= 70 ? '#F44336' : 
                           disputeData.ai_analysis.overall_score >= 40 ? '#FF9800' : '#4CAF50' }
                ]}>
                  {disputeData.ai_analysis.overall_score}/100
                </Text>
              </View>
              
              <View style={styles.recommendationContainer}>
                <Text style={styles.recommendationLabel}>AI Recommendation:</Text>
                <Text style={[
                  styles.recommendationValue,
                  { color: disputeData.ai_analysis.recommendation === 'LIKELY_FAKE' ? '#F44336' :
                           disputeData.ai_analysis.recommendation === 'REQUIRES_INVESTIGATION' ? '#FF9800' : '#4CAF50' }
                ]}>
                  {disputeData.ai_analysis.recommendation.replace('_', ' ')}
                </Text>
              </View>

              {disputeData.ai_analysis.fraud_indicators?.length > 0 && (
                <View style={styles.indicatorsContainer}>
                  <Text style={styles.indicatorsTitle}>Fraud Indicators:</Text>
                  {disputeData.ai_analysis.fraud_indicators.map((indicator, index) => (
                    <View key={index} style={styles.indicatorItem}>
                      <Ionicons name="warning" size={16} color="#FF9800" />
                      <Text style={styles.indicatorText}>{indicator}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Police Decision */}
        {disputeData?.police_decision && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👮‍♂️ Police Decision</Text>
            
            <View style={styles.decisionCard}>
              <View style={styles.decisionHeader}>
                <Ionicons 
                  name={disputeData.police_decision.decision === 'APPROVE_VIOLATION' ? 'checkmark-circle' : 'close-circle'} 
                  size={24} 
                  color={disputeData.police_decision.decision === 'APPROVE_VIOLATION' ? '#4CAF50' : '#F44336'} 
                />
                <Text style={[
                  styles.decisionText,
                  { color: disputeData.police_decision.decision === 'APPROVE_VIOLATION' ? '#4CAF50' : '#F44336' }
                ]}>
                  {disputeData.police_decision.decision === 'APPROVE_VIOLATION' ? 
                    'Violation Confirmed' : 'Report Marked as Fake'}
                </Text>
              </View>
              
              <Text style={styles.decisionDetails}>
                Reviewed by Officer ID: {disputeData.police_decision.officer_id}
              </Text>
              <Text style={styles.decisionDetails}>
                Decision Date: {new Date(disputeData.police_decision.timestamp).toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {!disputeData ? (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitDispute}
              disabled={submitting}
            >
              <LinearGradient
                colors={['#F44336', '#D32F2F']}
                style={styles.submitGradient}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>Submit Dispute</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadDisputeData}
            >
              <LinearGradient
                colors={['#2196F3', '#1976D2']}
                style={styles.refreshGradient}
              >
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.refreshButtonText}>Refresh Status</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Information Footer */}
        <View style={styles.infoFooter}>
          <Text style={styles.infoFooterText}>
            ℹ️ Disputes are processed within 24 hours. Our AI system analyzes evidence for fraud detection, 
            and police officers make the final decision. False disputes may result in penalties.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  analysisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  recommendationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recommendationLabel: {
    fontSize: 14,
    color: '#666666',
  },
  recommendationValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  indicatorsContainer: {
    marginTop: 8,
  },
  indicatorsTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  indicatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  indicatorText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 8,
  },
  decisionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  decisionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  decisionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  decisionDetails: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  actionSection: {
    margin: 16,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  refreshButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  refreshGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoFooter: {
    margin: 16,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  infoFooterText: {
    fontSize: 12,
    color: '#1976D2',
    lineHeight: 18,
  },
});

export default DisputeScreen;
