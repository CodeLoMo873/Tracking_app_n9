import { useState } from 'react';
import { StyleSheet, Image, TextInput, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams();
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const handleResetPassword = async () => {
    // Reset previous errors
    setCodeError('');
    setPasswordError('');
    setConfirmError('');
    
    // Validation
    let hasError = false;
    
    if (!verificationCode) {
      setCodeError('Vui lòng nhập mã xác nhận');
      hasError = true;
    }
    
    if (!newPassword) {
      setPasswordError('Vui lòng nhập mật khẩu mới');
      hasError = true;
    } else if (newPassword.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      hasError = true;
    }
    
    if (!confirmPassword) {
      setConfirmError('Vui lòng xác nhận mật khẩu');
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmError('Mật khẩu xác nhận không khớp');
      hasError = true;
    }
    
    if (hasError) return;

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to login with success message
      router.replace('/login');
    } catch (error) {
      setCodeError('Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
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
        <ThemedText style={styles.headerText}>Đặt lại mật khẩu</ThemedText>
        <ThemedText style={styles.emailText}>Email: {email}</ThemedText>
        
        <TextInput
          style={styles.input}
          placeholder="Mã xác nhận"
          value={verificationCode}
          onChangeText={(text) => {
            setVerificationCode(text);
            setCodeError('');
          }}
          autoCapitalize="none"
        />
        
        {codeError ? (
          <ThemedText style={styles.errorText}>{codeError}</ThemedText>
        ) : null}
        
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            setPasswordError('');
          }}
          secureTextEntry
        />
        
        {passwordError ? (
          <ThemedText style={styles.errorText}>{passwordError}</ThemedText>
        ) : null}
        
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setConfirmError('');
          }}
          secureTextEntry
        />
        
        {confirmError ? (
          <ThemedText style={styles.errorText}>{confirmError}</ThemedText>
        ) : null}

        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          <ThemedText style={styles.resetButtonText}>
            {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </ThemedText>
        </TouchableOpacity>
        
        <View style={styles.loginContainer}>
          <TouchableOpacity onPress={() => router.push('/login')}>
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
    marginBottom: 30,
  },
  logo: {
    width: 300,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
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
});