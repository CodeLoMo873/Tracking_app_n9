import { useState } from 'react';
import { StyleSheet, Image, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [authorCode, setAuthorCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [authorCodeError, setAuthorCodeError] = useState('');

  const handleResetPassword = async () => {
    // Reset previous messages
    setAuthorCodeError('');
    
    // Simple validation
    if (!email) {
      setEmailError('Vui lòng nhập email');
      return;
    }

    if (!authorCode) {
      setAuthorCodeError('Vui lòng nhập Mã xác nhận');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just show success and navigate back
      router.back();
    } catch (error) {
      setAuthorCodeError('Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendAuthorCode = async () => {
    // Reset previous messages
    setEmailError('');
    setEmailSuccess('');
    
    // Simple validation
    if (!email) {
      setEmailError('Vui lòng nhập email');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to reset password screen with email
      router.push({
        pathname: '/reset-password',
        params: { email: email }
      });
    } catch (error) {
      setEmailError('Không thể gửi mã xác nhận đến email của bạn. Vui lòng thử lại.');
    } finally {
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/logo_goal.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </ThemedView>

      <ThemedView style={styles.formContainer}>     
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError('');
          }}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        {emailError ? (
          <ThemedText style={styles.errorText}>{emailError}</ThemedText>
        ) : emailSuccess ? (
          <ThemedText style={styles.successText}>{emailSuccess}</ThemedText>
        ) : null}

        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={sendAuthorCode}
          disabled={isLoading}
        >
          <ThemedText style={styles.resetButtonText}>
            Gửi mã xác nhận
          </ThemedText>
        </TouchableOpacity>    
        
        <View style={styles.loginContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText style={styles.loginLink}>Quay lại đăng nhập</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 300,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginLink: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  successText: {
    color: '#34c759',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
});