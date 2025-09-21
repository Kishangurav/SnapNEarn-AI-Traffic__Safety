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

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          'Success', 
          'Account created successfully! Please verify your phone number.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Registration failed. Please try again.');
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
          <View>
            <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoGlow}>
                <Ionicons name="person-add-outline" size={60} color="#00E5FF" />
              </View>
            </View>
            <Text style={styles.greeting}>Neural Registration</Text>
            <Text style={styles.title}>Create Neural Link</Text>
            <Text style={styles.subtitle}>Initialize new agent profile</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputContainer}>
              <View style={styles.inputGlow}>
                <Ionicons name="person-outline" size={20} color="#00E5FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Agent Name"
                  placeholderTextColor="#6B7B8C"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputGlow}>
                <Ionicons name="mail-outline" size={20} color="#00E5FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Neural Email"
                  placeholderTextColor="#6B7B8C"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputGlow}>
                <Ionicons name="call-outline" size={20} color="#00E5FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contact Frequency"
                  placeholderTextColor="#6B7B8C"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputGlow}>
                <Ionicons name="lock-closed-outline" size={20} color="#00E5FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Access Code"
                  placeholderTextColor="#6B7B8C"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputGlow}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#00E5FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Access Code"
                  placeholderTextColor="#6B7B8C"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#2A3441', '#2A3441'] : ['#00E5FF', '#7C4DFF']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'ESTABLISHING LINK...' : 'INITIALIZE NEURAL LINK'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>
              Neural link exists? <Text style={styles.linkTextBold}>Connect</Text>
            </Text>
          </TouchableOpacity>
          </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#888',
    fontSize: 14,
  },
  linkTextBold: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
