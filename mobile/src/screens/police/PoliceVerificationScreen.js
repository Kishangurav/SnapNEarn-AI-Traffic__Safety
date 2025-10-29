import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import helmetDetectionService from '../../services/helmetDetectionService';

export default function PoliceVerificationScreen({ navigation }) {
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingReportId, setVerifyingReportId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [fineAmount, setFineAmount] = useState('500');
  const [remarks, setRemarks] = useState('');
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    loadPendingReports();
  }, []);

  const loadPendingReports = async () => {
    try {
      setLoading(true);
      const reports = await helmetDetectionService.getPendingReports();
      setPendingReports(reports);
    } catch (error) {
      console.error('Error loading pending reports:', error);
      Alert.alert('Error', 'Failed to load pending reports');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReport = async (reportId, status) => {
    try {
      setVerifyingReportId(reportId);
      
      const fineAmountNum = status === 'verified' ? parseInt(fineAmount) || 500 : 0;
      
      const result = await helmetDetectionService.verifyReport(
        reportId,
        status,
        fineAmountNum,
        user?.id || 'POLICE001',
        remarks
      );

      if (status === 'verified') {
        // Issue challan
        const challanDetails = await helmetDetectionService.issueChallan(
          reportId,
          fineAmountNum,
          user?.id || 'POLICE001',
          {
            violation_type: 'no_helmet',
            plate_text: selectedReport?.plate_text || 'UNKNOWN',
            location: selectedReport?.location || 'Unknown'
          }
        );

        Alert.alert(
          'Challan Issued Successfully!',
          `Challan Number: ${challanDetails.challan_number}\n` +
          `Fine Amount: ₹${challanDetails.fine_amount}\n` +
          `Reporter Reward: ₹${challanDetails.reporter_reward} (10%)`,
          [
            {
              text: 'OK',
              onPress: () => {
                setSelectedReport(null);
                loadPendingReports();
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Report Rejected',
          'The violation report has been rejected.',
          [
            {
              text: 'OK',
              onPress: () => {
                setSelectedReport(null);
                loadPendingReports();
              }
            }
          ]
        );
      }

    } catch (error) {
      console.error('Error verifying report:', error);
      Alert.alert('Error', 'Failed to verify report. Please try again.');
    } finally {
      setVerifyingReportId(null);
    }
  };

  const renderReportCard = (report) => (
    <TouchableOpacity
      key={report.report_id}
      style={styles.reportCard}
      onPress={() => setSelectedReport(report)}
    >
      <View style={styles.reportHeader}>
        <View style={styles.reportInfo}>
          <Text style={styles.reportId}>Report #{report.report_id}</Text>
          <Text style={styles.reportTime}>
            {new Date(report.timestamp).toLocaleString()}
          </Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: '#FF9800' }
        ]}>
          <Text style={styles.statusText}>Pending</Text>
        </View>
      </View>

      <View style={styles.reportDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.detailText}>{report.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="car" size={16} color="#666" />
          <Text style={styles.detailText}>Plate: {report.plate_text}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="analytics" size={16} color="#666" />
          <Text style={styles.detailText}>
            Confidence: {Math.round(report.confidence * 100)}%
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.reviewButton}>
        <Text style={styles.reviewButtonText}>Review & Verify</Text>
        <Ionicons name="chevron-forward" size={16} color="#2196F3" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderVerificationModal = () => {
    if (!selectedReport) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verify Violation Report</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedReport(null)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Report Details */}
            <View style={styles.reportDetailsSection}>
              <Text style={styles.sectionTitle}>Report Details</Text>
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Report ID:</Text>
                <Text style={styles.detailValue}>{selectedReport.report_id}</Text>
              </View>
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{selectedReport.location}</Text>
              </View>
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Number Plate:</Text>
                <Text style={styles.detailValue}>{selectedReport.plate_text}</Text>
              </View>
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Detection Confidence:</Text>
                <Text style={styles.detailValue}>
                  {Math.round(selectedReport.confidence * 100)}%
                </Text>
              </View>
            </View>

            {/* Fine Amount Input */}
            <View style={styles.fineSection}>
              <Text style={styles.sectionTitle}>Fine Amount</Text>
              <TextInput
                style={styles.fineInput}
                value={fineAmount}
                onChangeText={setFineAmount}
                placeholder="Enter fine amount"
                keyboardType="numeric"
              />
              <Text style={styles.rewardText}>
                Reporter will receive: ₹{Math.round((parseInt(fineAmount) || 0) * 0.1)} (10%)
              </Text>
            </View>

            {/* Remarks */}
            <View style={styles.remarksSection}>
              <Text style={styles.sectionTitle}>Remarks (Optional)</Text>
              <TextInput
                style={styles.remarksInput}
                value={remarks}
                onChangeText={setRemarks}
                placeholder="Add any remarks..."
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleVerifyReport(selectedReport.report_id, 'rejected')}
                disabled={verifyingReportId === selectedReport.report_id}
              >
                {verifyingReportId === selectedReport.report_id ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="close-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.verifyButton]}
                onPress={() => handleVerifyReport(selectedReport.report_id, 'verified')}
                disabled={verifyingReportId === selectedReport.report_id}
              >
                {verifyingReportId === selectedReport.report_id ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Verify & Issue Challan</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* Header */}
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Police Verification</Text>
            <Text style={styles.headerSubtitle}>Review violation reports</Text>
          </View>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={loadPendingReports}
          >
            <Ionicons name="refresh" size={24} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Loading pending reports...</Text>
          </View>
        ) : pendingReports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            <Text style={styles.emptyTitle}>All Clear!</Text>
            <Text style={styles.emptyText}>
              No pending reports for verification at the moment.
            </Text>
          </View>
        ) : (
          <View style={styles.reportsContainer}>
            <Text style={styles.reportsTitle}>
              Pending Reports ({pendingReports.length})
            </Text>
            {pendingReports.map(renderReportCard)}
          </View>
        )}
      </ScrollView>

      {/* Verification Modal */}
      {renderVerificationModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  reportsContainer: {
    paddingVertical: 20,
  },
  reportsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  reportTime: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  reportDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    maxHeight: '90%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 4,
  },
  reportDetailsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  detailCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  fineSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fineInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  rewardText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '500',
  },
  remarksSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#F8F9FA',
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
