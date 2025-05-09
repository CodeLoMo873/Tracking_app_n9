import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
  View,
  TextInput,
  ScrollView,
  Alert
} from 'react-native'
import { useState } from 'react'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  Ionicons,
  Feather,
  MaterialIcons,
  FontAwesome5
} from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'

import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

export default function ProfileScreen() {
  // Settings modal visibility
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)

  // Notification settings modal visibility
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false)
  const [personalInfoModalVisible, setPersonalInfoModalVisible] =
    useState(false)
  const [changePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false)
  const [contactModalVisible, setContactModalVisible] = useState(false)

  // User data
  const [userName, setUserName] = useState('Nguyễn Văn An')

  // Stats data
  const stats = {
    awards: 3,
    completedGoals: 41,
    totalGoals: 60
  }

  // Achievement data
  const achievements = [
    {
      id: '1',
      title: 'Vua Sức Bền',
      description: 'Duy trì hoạt động thể dục trong 1 tháng liên tục',
      icon: 'running',
      color: '#F8BBD0'
    },
    {
      id: '2',
      title: 'Ngọn Lửa Bền Bỉ',
      description: 'Duy trì đạt đủ 100% mục tiêu trong suốt 3 tháng',
      icon: 'fire',
      color: '#FFCC80'
    },
    {
      id: '3',
      title: 'Cơ Bắp Thép',
      description: 'Hoàn thành 50 buổi tập nặng trong suốt 6 tháng',
      icon: 'dumbbell',
      color: '#CE93D8'
    }
  ]

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    goalReminders: true,
    weeklyReports: true,
    achievements: true
  })

  // Personal info state
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    phone: '0912345678'
  })

  // Change password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear authentication state
      await AsyncStorage.removeItem('isLoggedIn')

      // Navigate back to login
      router.replace('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  // Handle menu press in settings
  const handleMenuPress = (screen: string) => {
    if (screen === 'notifications') {
      setNotificationModalVisible(true)
    } else if (screen === 'personal-info') {
      setPersonalInfoModalVisible(true)
    } else if (screen === 'change-password') {
      setChangePasswordModalVisible(true)
    } else if (screen === 'contact') {
      setContactModalVisible(true)
    } else {
      // Navigate to respective screens (to be implemented)
      console.log(`Navigate to ${screen}`)
    }
  }

  // Toggle notification settings
  const toggleNotificationSetting = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    })
  }

  // Save notification settings
  const saveNotificationSettings = async () => {
    try {
      // Save notification settings to AsyncStorage
      await AsyncStorage.setItem(
        'notificationSettings',
        JSON.stringify(notificationSettings)
      )
      setNotificationModalVisible(false)
    } catch (error) {
      console.error('Error saving notification settings:', error)
    }
  }

  // Handle personal info change
  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo({
      ...personalInfo,
      [field]: value
    })
  }

  // Save personal info
  const savePersonalInfo = async () => {
    try {
      // Save personal info to AsyncStorage
      await AsyncStorage.setItem('personalInfo', JSON.stringify(personalInfo))
      setPersonalInfoModalVisible(false)
    } catch (error) {
      console.error('Error saving personal info:', error)
    }
  }

  // Handle password change
  const handlePasswordChange = (field, value) => {
    setPasswordData({
      ...passwordData,
      [field]: value
    })
  }

  // Save new password
  const saveNewPassword = async () => {
    // Validate passwords
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới không khớp')
      return
    }

    try {
      // Here you would typically call an API to change the password
      // For now, we'll just simulate success
      alert('Đổi mật khẩu thành công')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setChangePasswordModalVisible(false)
    } catch (error) {
      console.error('Error changing password:', error)
    }
  }

  // Render settings modal (previously the main profile screen)
  // Add avatar state
  const [avatar, setAvatar] = useState(require('@/assets/images/icon.png'))

  const renderSettingsModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsModalVisible}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.settingsModalContainer}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                Cài đặt tài khoản
              </ThemedText>
              <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </ThemedView>

            <ScrollView style={styles.settingsModalContent}>
              {/* Profile Header with Avatar and Name */}
              <ThemedView style={styles.profileHeader}>
                <TouchableOpacity
                  style={styles.avatarContainer}
                  onPress={pickImage}
                >
                  <Image source={avatar} style={styles.avatar} />
                  <View style={styles.editAvatarButton}>
                    <Feather name="camera" size={16} color="white" />
                  </View>
                </TouchableOpacity>
                <ThemedText style={styles.userName}>
                  {personalInfo.name}
                </ThemedText>
                <ThemedText style={styles.userEmail}>
                  {personalInfo.email}
                </ThemedText>
              </ThemedView>

              {/* Menu Options */}
              <ThemedView style={styles.menuContainer}>
                {/* Notification Settings */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress('notifications')}
                >
                  <Feather
                    name="bell"
                    size={24}
                    color="#0a7ea4"
                    style={styles.menuIcon}
                  />
                  <ThemedText style={styles.menuText}>
                    Cài đặt thông báo
                  </ThemedText>
                  <Feather name="chevron-right" size={20} color="#999" />
                </TouchableOpacity>

                {/* Personal Information */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress('personal-info')}
                >
                  <Feather
                    name="user"
                    size={24}
                    color="#0a7ea4"
                    style={styles.menuIcon}
                  />
                  <ThemedText style={styles.menuText}>
                    Thông tin cá nhân
                  </ThemedText>
                  <Feather name="chevron-right" size={20} color="#999" />
                </TouchableOpacity>

                {/* Change Password */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress('change-password')}
                >
                  <Feather
                    name="lock"
                    size={24}
                    color="#0a7ea4"
                    style={styles.menuIcon}
                  />
                  <ThemedText style={styles.menuText}>Đổi mật khẩu</ThemedText>
                  <Feather name="chevron-right" size={20} color="#999" />
                </TouchableOpacity>

                {/* Contact */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress('contact')}
                >
                  <MaterialIcons
                    name="contact-support"
                    size={24}
                    color="#0a7ea4"
                    style={styles.menuIcon}
                  />
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
                  <ThemedText style={styles.logoutButtonText}>
                    Đăng xuất
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ScrollView>
          </ThemedView>
        </View>
      </Modal>
    )
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image />}
    >
      <ThemedView style={styles.container}>
        {/* Profile Header with Avatar and Name */}
        <ThemedView style={styles.achievementProfileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={avatar} style={styles.achievementAvatar} />
            <View style={styles.badgeContainer}>
              <FontAwesome5 name="star" size={16} color="#FFD700" />
            </View>
          </View>
          <ThemedText style={styles.achievementUserName}>{userName}</ThemedText>

          {/* Settings button */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setSettingsModalVisible(true)}
          >
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </ThemedView>

        {/* Statistics Section */}
        <ThemedText style={styles.sectionTitle}>Thống kê</ThemedText>
        <View style={styles.statsContainer}>
          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.awards}</ThemedText>
            <ThemedText style={styles.statLabel}>Giải thưởng</ThemedText>
            <FontAwesome5
              name="trophy"
              size={24}
              color="#FFD700"
              style={styles.statIcon}
            />
          </ThemedView>

          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statNumber}>
              {stats.completedGoals}/{stats.totalGoals}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Mục tiêu</ThemedText>
            <FontAwesome5
              name="bullseye"
              size={24}
              color="#FF6B6B"
              style={styles.statIcon}
            />
          </ThemedView>
        </View>

        {/* Achievements Section */}
        <ThemedText style={styles.sectionTitle}>Thành tích</ThemedText>
        <View style={styles.achievementsContainer}>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <View
                style={[
                  styles.achievementIconCircle,
                  { backgroundColor: achievement.color }
                ]}
              >
                <FontAwesome5 name={achievement.icon} size={20} color="#333" />
              </View>
              <ThemedText style={styles.achievementTitle}>
                {achievement.title}
              </ThemedText>
              <ThemedText style={styles.achievementDescription}>
                {achievement.description}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Settings Modal (previously the main profile screen) */}
        {renderSettingsModal()}

        {/* Notification Settings Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={notificationModalVisible}
          onRequestClose={() => setNotificationModalVisible(false)}
        >
          {/* Existing notification modal content */}
          <View style={styles.modalOverlay}>
            <ThemedView style={styles.modalContainer}>
              <ThemedView style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>
                  Cài đặt thông báo
                </ThemedText>
                <TouchableOpacity
                  onPress={() => setNotificationModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </ThemedView>

              <ThemedView style={styles.modalContent}>
                {/* Push Notifications */}
                <ThemedView style={styles.settingItem}>
                  <ThemedView style={styles.settingTextContainer}>
                    <ThemedText style={styles.settingTitle}>
                      Thông báo đẩy
                    </ThemedText>
                    <ThemedText style={styles.settingDescription}>
                      Nhận thông báo từ ứng dụng
                    </ThemedText>
                  </ThemedView>
                  <Switch
                    value={notificationSettings.pushNotifications}
                    onValueChange={() =>
                      toggleNotificationSetting('pushNotifications')
                    }
                    trackColor={{ false: '#d3d3d3', true: '#a1cedc' }}
                    thumbColor={
                      notificationSettings.pushNotifications
                        ? '#0a7ea4'
                        : '#f4f3f4'
                    }
                  />
                </ThemedView>

                {/* Other notification settings */}
                {/* ... existing notification settings ... */}
              </ThemedView>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveNotificationSettings}
              >
                <ThemedText style={styles.saveButtonText}>
                  Lưu thay đổi
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </View>
        </Modal>

        {/* Personal Info Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={personalInfoModalVisible}
          onRequestClose={() => setPersonalInfoModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ThemedView style={styles.modalContainer}>
              <ThemedView style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>
                  Thông tin cá nhân
                </ThemedText>
                <TouchableOpacity
                  onPress={() => setPersonalInfoModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </ThemedView>

              <ScrollView style={styles.modalContent}>
                {/* Name Input */}
                <ThemedView style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>Họ và tên</ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={personalInfo.name}
                    onChangeText={(text) =>
                      handlePersonalInfoChange('name', text)
                    }
                    placeholder="Nhập họ và tên"
                  />
                </ThemedView>

                {/* Email Input */}
                <ThemedView style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>Email</ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={personalInfo.email}
                    onChangeText={(text) =>
                      handlePersonalInfoChange('email', text)
                    }
                    placeholder="Nhập email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </ThemedView>

                {/* Phone Input */}
                <ThemedView style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>
                    Số điện thoại
                  </ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={personalInfo.phone}
                    onChangeText={(text) =>
                      handlePersonalInfoChange('phone', text)
                    }
                    placeholder="Nhập số điện thoại"
                    keyboardType="phone-pad"
                  />
                </ThemedView>
              </ScrollView>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={savePersonalInfo}
              >
                <ThemedText style={styles.saveButtonText}>
                  Lưu thay đổi
                </ThemedText>
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
                <TouchableOpacity
                  onPress={() => setChangePasswordModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </ThemedView>

              <ScrollView style={styles.modalContent}>
                {/* Current Password Input */}
                <ThemedView style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>
                    Mật khẩu hiện tại
                  </ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={passwordData.currentPassword}
                    onChangeText={(text) =>
                      handlePasswordChange('currentPassword', text)
                    }
                    placeholder="Nhập mật khẩu hiện tại"
                    secureTextEntry
                  />
                </ThemedView>

                {/* New Password Input */}
                <ThemedView style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>
                    Mật khẩu mới
                  </ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={passwordData.newPassword}
                    onChangeText={(text) =>
                      handlePasswordChange('newPassword', text)
                    }
                    placeholder="Nhập mật khẩu mới"
                    secureTextEntry
                  />
                </ThemedView>

                {/* Confirm Password Input */}
                <ThemedView style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>
                    Xác nhận mật khẩu mới
                  </ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={passwordData.confirmPassword}
                    onChangeText={(text) =>
                      handlePasswordChange('confirmPassword', text)
                    }
                    placeholder="Nhập lại mật khẩu mới"
                    secureTextEntry
                  />
                </ThemedView>
              </ScrollView>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveNewPassword}
              >
                <ThemedText style={styles.saveButtonText}>
                  Đổi mật khẩu
                </ThemedText>
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

              <ScrollView style={styles.modalContent}>
                {/* Email Contact */}
                <ThemedView style={styles.contactItem}>
                  <Feather
                    name="mail"
                    size={24}
                    color="#0a7ea4"
                    style={styles.contactIcon}
                  />
                  <ThemedView style={styles.contactTextContainer}>
                    <ThemedText style={styles.contactTitle}>
                      Email hỗ trợ
                    </ThemedText>
                    <ThemedText style={styles.contactValue}>
                      support@goalapp.com
                    </ThemedText>
                  </ThemedView>
                </ThemedView>

                {/* Phone Contact */}
                <ThemedView style={styles.contactItem}>
                  <Feather
                    name="phone"
                    size={24}
                    color="#0a7ea4"
                    style={styles.contactIcon}
                  />
                  <ThemedView style={styles.contactTextContainer}>
                    <ThemedText style={styles.contactTitle}>Hotline</ThemedText>
                    <ThemedText style={styles.contactValue}>
                      1900 1234
                    </ThemedText>
                  </ThemedView>
                </ThemedView>

                {/* Website Contact */}
                <ThemedView style={styles.contactItem}>
                  <Feather
                    name="globe"
                    size={24}
                    color="#0a7ea4"
                    style={styles.contactIcon}
                  />
                  <ThemedView style={styles.contactTextContainer}>
                    <ThemedText style={styles.contactTitle}>Website</ThemedText>
                    <ThemedText style={styles.contactValue}>
                      www.goalapp.com
                    </ThemedText>
                  </ThemedView>
                </ThemedView>

                {/* Address Contact */}
                <ThemedView style={styles.contactItem}>
                  <Feather
                    name="map-pin"
                    size={24}
                    color="#0a7ea4"
                    style={styles.contactIcon}
                  />
                  <ThemedView style={styles.contactTextContainer}>
                    <ThemedText style={styles.contactTitle}>Địa chỉ</ThemedText>
                    <ThemedText style={styles.contactValue}>
                      123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ScrollView>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => setContactModalVisible(false)}
              >
                <ThemedText style={styles.saveButtonText}>Đóng</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </View>
        </Modal>
      </ThemedView>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  // Achievement profile styles
  achievementProfileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    paddingTop: 20
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12
  },
  achievementAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#A1CEDC'
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A1CEDC'
  },
  achievementUserName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  settingsButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  statCard: {
    flex: 1,
    backgroundColor: '#E0F7FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    position: 'relative'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 14,
    color: '#666'
  },
  statIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  achievementItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20
  },
  achievementIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4
  },
  achievementDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },

  // Settings modal styles
  settingsModalContainer: {
    width: '90%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  settingsModalContent: {
    flex: 1
  },

  // Update profileHeader styles
  profileHeader: {
    backgroundColor: '#A1CEDC',
    width: '100%',
    height: 200,
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
    marginBottom: 20
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0a7ea4',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white'
  },

  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5
  },
  userEmail: {
    fontSize: 16,
    color: '#666'
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  menuIcon: {
    marginRight: 15
  },
  menuText: {
    fontSize: 16,
    flex: 1
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  section: {
    padding: 16,
    marginTop: 20
  },
  logoutButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center'
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
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
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  modalContent: {
    marginBottom: 20
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 10
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  settingDescription: {
    fontSize: 14,
    color: '#666'
  },
  saveButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center'
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  inputContainer: {
    marginBottom: 15
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500'
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20
  },
  contactIcon: {
    marginRight: 15,
    marginTop: 2
  },
  contactTextContainer: {
    flex: 1
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  contactValue: {
    fontSize: 14,
    color: '#666'
  }
})

// Add function to pick image from gallery
const pickImage = async () => {
  try {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Sorry, we need camera roll permissions to change your avatar.'
      )
      return
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Set the selected image as avatar
      setAvatar({ uri: result.assets[0].uri })

      // Here you would typically upload the image to a server
      // and update the user's profile with the new avatar URL

      Alert.alert('Success', 'Avatar updated successfully!')
    }
  } catch (error) {
    console.error('Error picking image:', error)
    Alert.alert('Error', 'Failed to update avatar. Please try again.')
  }
}
