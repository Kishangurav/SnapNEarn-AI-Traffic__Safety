import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const LayoutContainer = ({ 
  children, 
  navigation, 
  showHeader = true, 
  headerTitle = "SnapNEarn",
  showProfileIcon = true 
}) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {showHeader && (
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>{headerTitle}</Text>
              {showProfileIcon && (
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
              )}
            </View>
          </View>
        )}
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {children}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0E1A',
  },
  container: {
    flex: 1,
    minHeight: '100vh',
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default LayoutContainer;
