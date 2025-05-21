import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
  View,
  TextInput,
  ScrollView,
  Alert,
  Text // Add Text import here
} from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { styles } from './profile.styles'

export default function ProfileScreen() {
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)
  const [personalInfoModalVisible, setPersonalInfoModalVisible] = useState(false)
  const [contactModalVisible, setContactModalVisible] = useState(false)
  const [userName, setUserName] = useState('Nguyễn Văn An')
  const stats = {
    awards: 3,
    completedGoals: 41,
    totalGoals: 60
  }
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
    phone: '0912345678',
    password: '' // Add password field
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('isLoggedIn')
      router.replace('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }
  const handleMenuPress = (screen: string) => {
    if (screen === 'personal-info') {
      setPersonalInfoModalVisible(true)
    } else if (screen === 'contact') {
      setContactModalVisible(true)
    } else {
      console.log(`Navigate to ${screen}`)
    }
  }
  const toggleNotificationSetting = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    })
  }

  const saveNotificationSettings = async () => {
    try {
      await AsyncStorage.setItem(
        'notificationSettings',
        JSON.stringify(notificationSettings)
      )
      setNotificationModalVisible(false)
    } catch (error) {
      console.error('Error saving notification settings:', error)
    }
  }
  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo({
      ...personalInfo,
      [field]: value
    })
  }
  const savePersonalInfo = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData')
      if (userDataString) {
        const userData = JSON.parse(userDataString)
        const updatedUserData = {
          ...userData,
          user_name: personalInfo.name,
          email: personalInfo.email,
          phone_number: personalInfo.phone
        }
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData))        
        setUser(updatedUserData)
        setUserName(personalInfo.name)
      }
      await AsyncStorage.setItem('personalInfo', JSON.stringify(personalInfo))
      setPersonalInfoModalVisible(false)
      
      Alert.alert('Thành công', 'Thông tin cá nhân đã được cập nhật')
    } catch (error) {
      console.error('Error saving personal info:', error)
      Alert.alert('Lỗi', 'Không thể lưu thông tin cá nhân')
    }
  }

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

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData')
        if (userData) {
          const parsedUserData = JSON.parse(userData)
          setUser(parsedUserData)
          
          // Update the userName and personalInfo with the user data
          setUserName(parsedUserData.user_name || 'User')
          setPersonalInfo({
            name: parsedUserData.user_name || '',
            email: parsedUserData.email || '',
            phone: parsedUserData.phone_number || '',
            password: parsedUserData.pass_word || '' // Add password from user data
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [])

  if (!user) {
    return <Text>Đang tải thông tin...</Text>
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

        {renderSettingsModal()}

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
              <ScrollView style={styles.modalContent}>
                <View style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>Tên</ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={personalInfo.name}
                    onChangeText={text => handlePersonalInfoChange('name', text)}
                    placeholder="Nhập tên"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>Email</ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={personalInfo.email}
                    onChangeText={text => handlePersonalInfoChange('email', text)}
                    placeholder="Nhập email"
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>Số điện thoại</ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={personalInfo.phone}
                    onChangeText={text => handlePersonalInfoChange('phone', text)}
                    placeholder="Nhập số điện thoại"
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>Mật khẩu</ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={personalInfo.password}
                    onChangeText={text => handlePersonalInfoChange('password', text)}
                    placeholder="Nhập mật khẩu mới"
                    secureTextEntry
                  />
                </View>
              </ScrollView>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={savePersonalInfo}
              >
                <ThemedText style={styles.saveButtonText}>Lưu</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </View>
        </Modal>

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
      Alert.alert('Success', 'Avatar updated successfully!')
    }
  } catch (error) {
    console.error('Error picking image:', error)
    Alert.alert('Error', 'Failed to update avatar. Please try again.')
  }
}