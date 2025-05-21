import { useState } from 'react';
import { StyleSheet, Image, TextInput, TouchableOpacity, Alert, View } from 'react-native';
import { router, Stack } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [userCode, setUserCode] = useState(''); // Added for login username
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Simple validation
    if (!username || !userCode || !email || !phoneNumber || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }


    // Validate user code (no spaces)
    if (userCode.includes(' ')) {
      Alert.alert('Lỗi', 'Tên đăng nhập không được chứa khoảng trắng');
      return;
    }

    if (!email.endsWith('@gmail.com') || email.includes(' ')) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }

    console.log('Register button pressed');

    
    // Validate phone number (Vietnamese format)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 8 ký tự');
      return;   
    }    

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }


    setIsLoading(true);
    
    try {
      console.log('Sending registration request...');
      // Call the registration API
      const response = await fetch('http://192.168.69.105:3000/api/user/reg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: username,
          user_code: userCode,
          pass_word: password,
          email: email,
          phone_number: phoneNumber
        }),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }
      
      // Registration successful
      Alert.alert(
        'Thành công', 
        'Đăng ký tài khoản thành công!', 
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Lỗi', error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
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
            placeholder="Tên người dùng"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="words"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Tên đăng nhập"
            value={userCode}
            onChangeText={setUserCode}
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
    
          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            <ThemedText style={styles.registerButtonText}>
              {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
            </ThemedText>
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
            <ThemedText>Đã có tài khoản? </ThemedText>
            <TouchableOpacity onPress={() => router.back()}>
              <ThemedText style={styles.loginLink}>Đăng nhập</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ThemedView>
    </>
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
  registerButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginLink: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
});