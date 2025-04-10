import { Image, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const handleLogout = async () => {
    try {
      // Clear authentication state
      await AsyncStorage.removeItem('isLoggedIn');
      
      // Navigate back to login
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image/>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My Profile</ThemedText>
      </ThemedView>
      
      {/* Add logout button */}
      <ThemedView style={styles.section}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <ThemedText style={styles.logoutButtonText}>Đăng xuất</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  section: {
    padding: 16,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
