import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    dispatch(loginStart());
    
    try {
      // TODO: Replace with actual API call
      setTimeout(() => {
        // Mock successful login
        dispatch(loginSuccess({
          user: {
            id: '1',
            name: 'Test User',
            email: identifier.includes('@') ? identifier : 'test@example.com',
            phone: identifier.includes('@') ? '9876543210' : identifier,
            isVerified: true,
          },
          token: 'mock-jwt-token'
        }));
      }, 1000);
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  return (
    <LinearGradient
      colors={['#0B0E1A', '#1A1F2E', '#0B0E1A']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Animated Background Elements */}
          <View style={styles.backgroundElements}>
            <View style={[styles.glowOrb, styles.glowOrb1]} />
            <View style={[styles.glowOrb, styles.glowOrb2]} />
            <View style={[styles.glowOrb, styles.glowOrb3]} />
          </View>

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoGlow}>
                <Ionicons name="shield-checkmark" size={60} color="#00E5FF" />
              </View>
            </View>
            <Text style={styles.greeting}>SnapNEarn</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Initialize secure connection</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputContainer}>
              <View style={styles.inputGlow}>
                <Ionicons name="person-outline" size={20} color="#00E5FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username or Email"
                  placeholderTextColor="#6B7B8C"
                  value={identifier}
                  onChangeText={setIdentifier}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputGlow}>
                <Ionicons name="lock-closed-outline" size={20} color="#00E5FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#6B7B8C"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#2A3441', '#2A3441'] : ['#00E5FF', '#7C4DFF']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'CONNECTING...' : 'INITIALIZE ACCESS'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Reset Account?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>
              Need neural access? <Text style={styles.linkTextBold}>Create Link</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  glowOrb: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  glowOrb1: {
    width: 200,
    height: 200,
    backgroundColor: '#00E5FF',
    top: '10%',
    right: '-10%',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 50,
  },
  glowOrb2: {
    width: 150,
    height: 150,
    backgroundColor: '#7C4DFF',
    bottom: '20%',
    left: '-5%',
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
  },
  glowOrb3: {
    width: 100,
    height: 100,
    backgroundColor: '#00BFA5',
    top: '50%',
    left: '80%',
    shadowColor: '#00BFA5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGlow: {
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#00E5FF',
    marginBottom: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '300',
  },
  title: {
    fontSize: 32,
    fontWeight: '200',
    color: '#E8F4FD',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7B8C',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  formCard: {
    backgroundColor: 'rgba(26, 31, 46, 0.7)',
    borderRadius: 24,
    padding: 32,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    backdropFilter: 'blur(20px)',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputGlow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(42, 52, 65, 0.6)',
    borderRadius: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  inputIcon: {
    marginRight: 16,
  },
  input: {
    flex: 1,
    color: '#E8F4FD',
    fontSize: 16,
    paddingVertical: 18,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  button: {
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#0B0E1A',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 12,
  },
  forgotPasswordText: {
    color: '#6B7B8C',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 32,
  },
  linkText: {
    color: '#6B7B8C',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  linkTextBold: {
    color: '#00E5FF',
    fontWeight: '500',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
