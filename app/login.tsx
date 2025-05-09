import { useState } from 'react'
import {
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  View
} from 'react-native'
import { router, Stack } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

export default function LoginScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    // Simple validation
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên đăng nhập và mật khẩu')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        'http://192.168.22.123:3000/api/user/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_code: username,
            pass_word: password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại')
      }

      // Store user data and authentication token if provided by the API
      await AsyncStorage.setItem('isLoggedIn', 'true')

      // If the API returns user data, store it
      if (data.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(data.user))
      }

      // If the API returns a token, store it
      if (data.token) {
        await AsyncStorage.setItem('authToken', data.token)
      }

      console.log('Login successful!')

      // Navigate to home tab
      router.replace('/(tabs)/home')
    } catch (error) {
      console.error('Login error:', error)
      Alert.alert(
        'Lỗi',
        error.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToRegister = () => {
    router.push('/register')
  }

  const navigateToForgotPassword = () => {
    router.push('/forgot-password')
  }

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
            placeholder="Tên đăng nhập"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <ThemedText style={styles.loginButtonText}>Đăng nhập</ThemedText>
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={navigateToForgotPassword}>
              <ThemedText style={styles.linkText}>Quên mật khẩu?</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <ThemedText>Chưa có tài khoản? </ThemedText>
            <TouchableOpacity onPress={navigateToRegister}>
              <ThemedText style={styles.registerLink}>Đăng ký ngay</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  logo: {
    width: 300,
    marginBottom: 10
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  formContainer: {
    width: '100%'
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16
  },
  loginButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 20
  },
  linkText: {
    color: '#0a7ea4',
    fontSize: 14
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  registerLink: {
    color: '#0a7ea4',
    fontWeight: 'bold'
  }
})
