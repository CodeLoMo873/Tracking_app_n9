import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

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

  const handleMenuPress = (screen: string) => {
    // Navigate to respective screens (to be implemented)
    console.log(`Navigate to ${screen}`);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image/>}>
      
      {/* Profile Header with Avatar and Name */}
      <ThemedView style={styles.profileHeader}>
        <Image 
          source={require('@/assets/images/icon.png')} 
          style={styles.avatar}
        />
        <ThemedText style={styles.userName}>Nguyễn Văn A</ThemedText>
        <ThemedText style={styles.userEmail}>nguyenvana@example.com</ThemedText>
      </ThemedView>
      
      {/* Menu Options */}
      <ThemedView style={styles.menuContainer}>
        {/* Notification Settings */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuPress('notifications')}
        >
          <Feather name="bell" size={24} color="#0a7ea4" style={styles.menuIcon} />
          <ThemedText style={styles.menuText}>Cài đặt thông báo</ThemedText>
          <Feather name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        
        {/* Personal Information */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuPress('personal-info')}
        >
          <Feather name="user" size={24} color="#0a7ea4" style={styles.menuIcon} />
          <ThemedText style={styles.menuText}>Thông tin cá nhân</ThemedText>
          <Feather name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        
        {/* Change Password */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuPress('change-password')}
        >
          <Feather name="lock" size={24} color="#0a7ea4" style={styles.menuIcon} />
          <ThemedText style={styles.menuText}>Đổi mật khẩu</ThemedText>
          <Feather name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        
        {/* Contact */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleMenuPress('contact')}
        >
          <MaterialIcons name="contact-support" size={24} color="#0a7ea4" style={styles.menuIcon} />
          <ThemedText style={styles.menuText}>Liên hệ</ThemedText>
          <Feather name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
      </ThemedView>
      
      {/* Logout Button */}
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
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
