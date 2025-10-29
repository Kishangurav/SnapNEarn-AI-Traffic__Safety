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

const PoliceDisputeScreen = ({ route, navigation }) => {
  const { disputeId } = route.params;
  const [disputeData, setDisputeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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

  const makeDecision = async (decision) => {
    const decisionText = decision === 'APPROVE_VIOLATION' ? 'approve this violation' : 'mark this report as fake';
    
    Alert.alert(
      'Confirm Decision',
      `Are you sure you want to ${decisionText}?\n\nThis decision will be final and will affect the reporter's trust score.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: decision === 'APPROVE_VIOLATION' ? 'default' : 'destructive',
          onPress: () => submitDecision(decision)
        }
      ]
    );
  };

  const submitDecision = async (decision) => {
    setProcessing(true);
    
    try {
    const response = await fetch('http://localhost:8080/police-decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dispute_id: disputeId,
          decision: decision,
          officer_id: 'OFFICER_001' // In production, get from auth context
        }),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert(
          '✅ Decision Recorded',
          result.message,
          [
            {
              text: 'OK',
              onPress: () => {
                loadDisputeData();
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Unable to record decision');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Unable to submit decision. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'LIKELY_FAKE': return '#F44336';
      case 'REQUIRES_INVESTIGATION': return '#FF9800';
      case 'LIKELY_GENUINE': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const getRecommendationIcon = (recommendation) => {
    switch (recommendation) {
      case 'LIKELY_FAKE': return 'close-circle';
      case 'REQUIRES_INVESTIGATION': return 'warning';
      case 'LIKELY_GENUINE': return 'checkmark-circle';
      default: return 'help-circle';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading dispute case...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!disputeData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#F44336" />
          <Text style={styles.errorText}>Dispute case not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#1976D2', '#1565C0']}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Police Review</Text>
          <Ionicons name="shield" size={28} color="#FFFFFF" />
        </LinearGradient>

        {/* Case Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Case Information</Text>
          
          <View style={styles.caseCard}>
            <View style={styles.caseRow}>
              <Text style={styles.caseLabel}>Dispute ID:</Text>
              <Text style={styles.caseValue}>{disputeId}</Text>
            </View>
            
            <View style={styles.caseRow}>
              <Text style={styles.caseLabel}>Vehicle:</Text>
              <Text style={styles.caseValue}>
                {disputeData.challan_data?.number_plate || 'Not Available'}
              </Text>
            </View>
            
            <View style={styles.caseRow}>
              <Text style={styles.caseLabel}>Location:</Text>
              <Text style={styles.caseValue}>
                {disputeData.challan_data?.location || 'Not Available'}
              </Text>
            </View>
            
            <View style={styles.caseRow}>
              <Text style={styles.caseLabel}>Reported:</Text>
              <Text style={styles.caseValue}>
                {new Date(disputeData.created_at).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* AI Analysis */}
        {disputeData.ai_analysis && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🤖 AI Analysis</Text>
            
            <View style={styles.analysisCard}>
              {/* Fraud Score */}
              <View style={styles.scoreSection}>
                <Text style={styles.scoreTitle}>Fraud Risk Assessment</Text>
                <View style={styles.scoreContainer}>
                  <View style={styles.scoreCircle}>
                    <Text style={[
                      styles.scoreText,
                      { color: disputeData.ai_analysis.overall_score >= 70 ? '#F44336' : 
                               disputeData.ai_analysis.overall_score >= 40 ? '#FF9800' : '#4CAF50' }
                    ]}>
                      {disputeData.ai_analysis.overall_score}
                    </Text>
                    <Text style={styles.scoreSubtext}>/ 100</Text>
                  </View>
                  <View style={styles.scoreDescription}>
                    <Text style={styles.scoreDescText}>
                      {disputeData.ai_analysis.overall_score >= 70 ? 'High Risk' :
                       disputeData.ai_analysis.overall_score >= 40 ? 'Medium Risk' : 'Low Risk'}
                    </Text>
                    <Text style={styles.scoreDescSubtext}>
                      {disputeData.ai_analysis.overall_score >= 70 ? 'Likely fraudulent report' :
                       disputeData.ai_analysis.overall_score >= 40 ? 'Requires investigation' : 'Appears genuine'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* AI Recommendation */}
              <View style={styles.recommendationSection}>
                <Text style={styles.recommendationTitle}>AI Recommendation</Text>
                <View style={styles.recommendationContainer}>
                  <Ionicons 
                    name={getRecommendationIcon(disputeData.ai_analysis.recommendation)} 
                    size={24} 
                    color={getRecommendationColor(disputeData.ai_analysis.recommendation)} 
                  />
                  <Text style={[
                    styles.recommendationText,
                    { color: getRecommendationColor(disputeData.ai_analysis.recommendation) }
                  ]}>
                    {disputeData.ai_analysis.recommendation.replace('_', ' ')}
                  </Text>
                </View>
              </View>

              {/* Fraud Indicators */}
              {disputeData.ai_analysis.fraud_indicators?.length > 0 && (
                <View style={styles.indicatorsSection}>
                  <Text style={styles.indicatorsTitle}>⚠️ Fraud Indicators</Text>
                  {disputeData.ai_analysis.fraud_indicators.map((indicator, index) => (
                    <View key={index} style={styles.indicatorItem}>
                      <Ionicons name="warning-outline" size={16} color="#FF9800" />
                      <Text style={styles.indicatorText}>{indicator}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Evidence Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 Evidence</Text>
          
          <View style={styles.evidenceCard}>
            <Text style={styles.evidenceText}>
              Original photo and metadata analysis would be displayed here in a production system.
            </Text>
            <View style={styles.evidencePlaceholder}>
              <Ionicons name="image" size={48} color="#CCCCCC" />
              <Text style={styles.evidencePlaceholderText}>Evidence Photo</Text>
            </View>
          </View>
        </View>

        {/* Decision Buttons */}
        {!disputeData.police_decision && (
          <View style={styles.decisionSection}>
            <Text style={styles.decisionTitle}>👮‍♂️ Your Decision</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => makeDecision('APPROVE_VIOLATION')}
                disabled={processing}
              >
                <LinearGradient
                  colors={['#4CAF50', '#388E3C']}
                  style={styles.decisionGradient}
                >
                  {processing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                      <Text style={styles.decisionButtonText}>Approve Violation</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => makeDecision('REJECT_AS_FAKE')}
                disabled={processing}
              >
                <LinearGradient
                  colors={['#F44336', '#D32F2F']}
                  style={styles.decisionGradient}
                >
                  {processing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="close-circle" size={20} color="#FFFFFF" />
                      <Text style={styles.decisionButtonText}>Mark as Fake</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Decision Already Made */}
        {disputeData.police_decision && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ Decision Made</Text>
            
            <View style={styles.decisionMadeCard}>
              <View style={styles.decisionMadeHeader}>
                <Ionicons 
                  name={disputeData.police_decision.decision === 'APPROVE_VIOLATION' ? 'checkmark-circle' : 'close-circle'} 
                  size={32} 
                  color={disputeData.police_decision.decision === 'APPROVE_VIOLATION' ? '#4CAF50' : '#F44336'} 
                />
                <Text style={[
                  styles.decisionMadeText,
                  { color: disputeData.police_decision.decision === 'APPROVE_VIOLATION' ? '#4CAF50' : '#F44336' }
                ]}>
                  {disputeData.police_decision.decision === 'APPROVE_VIOLATION' ? 
                    'Violation Approved' : 'Report Marked as Fake'}
                </Text>
              </View>
              
              <Text style={styles.decisionMadeDetails}>
                Decision by: {disputeData.police_decision.officer_id}
              </Text>
              <Text style={styles.decisionMadeDetails}>
                Date: {new Date(disputeData.police_decision.timestamp).toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Guidelines */}
        <View style={styles.guidelinesSection}>
          <Text style={styles.guidelinesTitle}>📖 Decision Guidelines</Text>
          <Text style={styles.guidelinesText}>
            • Consider AI analysis as guidance, not absolute truth{'\n'}
            • Look for inconsistencies in location, timing, and photo quality{'\n'}
            • Approve if violation appears genuine despite some AI concerns{'\n'}
            • Mark as fake only if clear evidence of fraud exists{'\n'}
            • When in doubt, approve the violation to protect genuine reporters
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#666666',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  headerBackButton: {
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
  caseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  caseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  caseLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  caseValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
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
  scoreSection: {
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreSubtext: {
    fontSize: 12,
    color: '#666666',
  },
  scoreDescription: {
    flex: 1,
  },
  scoreDescText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  scoreDescSubtext: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  recommendationSection: {
    marginBottom: 20,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  recommendationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  indicatorsSection: {
    marginTop: 8,
  },
  indicatorsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  indicatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  indicatorText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 8,
    flex: 1,
  },
  evidenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  evidenceText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  evidencePlaceholder: {
    height: 200,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  evidencePlaceholderText: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 8,
  },
  decisionSection: {
    margin: 16,
  },
  decisionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  approveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rejectButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  decisionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  decisionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  decisionMadeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  decisionMadeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  decisionMadeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  decisionMadeDetails: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  guidelinesSection: {
    margin: 16,
    padding: 16,
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  guidelinesText: {
    fontSize: 12,
    color: '#2E7D32',
    lineHeight: 18,
  },
});

export default PoliceDisputeScreen;
