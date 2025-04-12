import { Image, StyleSheet, TouchableOpacity, Modal, Switch, View, TextInput } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [personalInfoModalVisible, setPersonalInfoModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    goalReminders: true,
    weeklyReports: true,
    achievements: true,
  });
  
  // Personal info state
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    phone: '0912345678',
  });
  
  // Change password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
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
    if (screen === 'notifications') {
      setNotificationModalVisible(true);
    } else if (screen === 'personal-info') {
      setPersonalInfoModalVisible(true);
    } else if (screen === 'change-password') {
      setChangePasswordModalVisible(true);
    } else if (screen === 'contact') {
      setContactModalVisible(true);
    } else {
      // Navigate to respective screens (to be implemented)
      console.log(`Navigate to ${screen}`);
    }
  };

  const toggleNotificationSetting = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  const saveNotificationSettings = async () => {
    try {
      // Save notification settings to AsyncStorage
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      setNotificationModalVisible(false);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
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
        <ThemedText style={styles.userName}>Nguyễn Văn An</ThemedText>
        <ThemedText style={styles.userEmail}>nguyenvanan@gmail.com</ThemedText>
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
      
      {/* Notification Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={notificationModalVisible}
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContainer}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Cài đặt thông báo</ThemedText>
              <TouchableOpacity onPress={() => setNotificationModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.modalContent}>
              {/* Push Notifications */}
              <ThemedView style={styles.settingItem}>
                <ThemedView style={styles.settingTextContainer}>
                  <ThemedText style={styles.settingTitle}>Thông báo đẩy</ThemedText>
                  <ThemedText style={styles.settingDescription}>Nhận thông báo từ ứng dụng</ThemedText>
                </ThemedView>
                <Switch
                  value={notificationSettings.pushNotifications}
                  onValueChange={() => toggleNotificationSetting('pushNotifications')}
                  trackColor={{ false: '#d3d3d3', true: '#a1cedc' }}
                  thumbColor={notificationSettings.pushNotifications ? '#0a7ea4' : '#f4f3f4'}
                />
              </ThemedView>

              {/* Goal Reminders */}
              <ThemedView style={styles.settingItem}>
                <ThemedView style={styles.settingTextContainer}>
                  <ThemedText style={styles.settingTitle}>Nhắc nhở mục tiêu</ThemedText>
                  <ThemedText style={styles.settingDescription}>Nhận thông báo về mục tiêu sắp đến hạn</ThemedText>
                </ThemedView>
                <Switch
                  value={notificationSettings.goalReminders}
                  onValueChange={() => toggleNotificationSetting('goalReminders')}
                  trackColor={{ false: '#d3d3d3', true: '#a1cedc' }}
                  thumbColor={notificationSettings.goalReminders ? '#0a7ea4' : '#f4f3f4'}
                />
              </ThemedView>

              {/* Weekly Reports */}
              <ThemedView style={styles.settingItem}>
                <ThemedView style={styles.settingTextContainer}>
                  <ThemedText style={styles.settingTitle}>Báo cáo hàng tuần</ThemedText>
                  <ThemedText style={styles.settingDescription}>Nhận báo cáo tổng kết tiến độ hàng tuần</ThemedText>
                </ThemedView>
                <Switch
                  value={notificationSettings.weeklyReports}
                  onValueChange={() => toggleNotificationSetting('weeklyReports')}
                  trackColor={{ false: '#d3d3d3', true: '#a1cedc' }}
                  thumbColor={notificationSettings.weeklyReports ? '#0a7ea4' : '#f4f3f4'}
                />
              </ThemedView>

              {/* Achievements */}
              <ThemedView style={styles.settingItem}>
                <ThemedView style={styles.settingTextContainer}>
                  <ThemedText style={styles.settingTitle}>Thành tựu</ThemedText>
                  <ThemedText style={styles.settingDescription}>Nhận thông báo khi đạt được thành tựu mới</ThemedText>
                </ThemedView>
                <Switch
                  value={notificationSettings.achievements}
                  onValueChange={() => toggleNotificationSetting('achievements')}
                  trackColor={{ false: '#d3d3d3', true: '#a1cedc' }}
                  thumbColor={notificationSettings.achievements ? '#0a7ea4' : '#f4f3f4'}
                />
              </ThemedView>
            </ThemedView>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveNotificationSettings}
            >
              <ThemedText style={styles.saveButtonText}>Lưu thay đổi</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
      
      {/* Personal Information Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={personalInfoModalVisible}
        onRequestClose={() => setPersonalInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContainer}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Thông tin cá nhân</ThemedText>
              <TouchableOpacity onPress={() => setPersonalInfoModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.modalContent}>
              <ThemedView style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>Họ và tên</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={personalInfo.name}
                  onChangeText={(text) => handlePersonalInfoChange('name', text)}
                  placeholder="Nhập họ và tên"
                />
              </ThemedView>
              
              <ThemedView style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>Email</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={personalInfo.email}
                  onChangeText={(text) => handlePersonalInfoChange('email', text)}
                  placeholder="Nhập email"
                  keyboardType="email-address"
                />
              </ThemedView>
              
              <ThemedView style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>Số điện thoại</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={personalInfo.phone}
                  onChangeText={(text) => handlePersonalInfoChange('phone', text)}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                />
              </ThemedView>
            </ThemedView>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={savePersonalInfo}
            >
              <ThemedText style={styles.saveButtonText}>Lưu thay đổi</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
      
      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePasswordModalVisible}
        onRequestClose={() => setChangePasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContainer}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Đổi mật khẩu</ThemedText>
              <TouchableOpacity onPress={() => setChangePasswordModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.modalContent}>
              <ThemedView style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>Mật khẩu hiện tại</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={passwordData.currentPassword}
                  onChangeText={(text) => handlePasswordChange('currentPassword', text)}
                  placeholder="Nhập mật khẩu hiện tại"
                  secureTextEntry
                />
              </ThemedView>
              
              <ThemedView style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>Mật khẩu mới</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={passwordData.newPassword}
                  onChangeText={(text) => handlePasswordChange('newPassword', text)}
                  placeholder="Nhập mật khẩu mới"
                  secureTextEntry
                />
              </ThemedView>
              
              <ThemedView style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>Xác nhận mật khẩu mới</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={passwordData.confirmPassword}
                  onChangeText={(text) => handlePasswordChange('confirmPassword', text)}
                  placeholder="Nhập lại mật khẩu mới"
                  secureTextEntry
                />
              </ThemedView>
            </ThemedView>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveNewPassword}
            >
              <ThemedText style={styles.saveButtonText}>Đổi mật khẩu</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
      
      {/* Contact Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={contactModalVisible}
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContainer}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Liên hệ</ThemedText>
              <TouchableOpacity onPress={() => setContactModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.modalContent}>
              <ThemedView style={styles.contactItem}>
                <Feather name="mail" size={24} color="#0a7ea4" style={styles.contactIcon} />
                <ThemedView style={styles.contactTextContainer}>
                  <ThemedText style={styles.contactTitle}>Email</ThemedText>
                  <ThemedText style={styles.contactValue}>support@goalapp.com</ThemedText>
                </ThemedView>
              </ThemedView>
              
              <ThemedView style={styles.contactItem}>
                <Feather name="phone" size={24} color="#0a7ea4" style={styles.contactIcon} />
                <ThemedView style={styles.contactTextContainer}>
                  <ThemedText style={styles.contactTitle}>Hotline</ThemedText>
                  <ThemedText style={styles.contactValue}>1900 1234</ThemedText>
                </ThemedView>
              </ThemedView>
              
              <ThemedView style={styles.contactItem}>
                <Feather name="clock" size={24} color="#0a7ea4" style={styles.contactIcon} />
                <ThemedView style={styles.contactTextContainer}>
                  <ThemedText style={styles.contactTitle}>Giờ làm việc</ThemedText>
                  <ThemedText style={styles.contactValue}>
                    Thứ 2 - Thứ 6: 8:00 - 17:30
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={() => setContactModalVisible(false)}
            >
              <ThemedText style={styles.saveButtonText}>Đóng</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    backgroundColor: '#A1CEDC',
    width: '100%',
    height: 200,
    justifyContent: 'center',
    borderRadius: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  contactIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: '#666',
  },
});

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo({
      ...personalInfo,
      [field]: value
    });
  };
  
  const savePersonalInfo = async () => {
    try {
      // Save personal info to AsyncStorage
      await AsyncStorage.setItem('personalInfo', JSON.stringify(personalInfo));
      setPersonalInfoModalVisible(false);
    } catch (error) {
      console.error('Error saving personal info:', error);
    }
  };
  
  const handlePasswordChange = (field, value) => {
    setPasswordData({
      ...passwordData,
      [field]: value
    });
  };
  
  const saveNewPassword = async () => {
    // Validate passwords
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới không khớp');
      return;
    }
    
    try {
      // Here you would typically call an API to change the password
      // For now, we'll just simulate success
      alert('Đổi mật khẩu thành công');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setChangePasswordModalVisible(false);
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };
