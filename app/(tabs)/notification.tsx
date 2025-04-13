import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Mock data for notifications
const mockNotifications = [
  {
    id: '1',
    type: 'encouragement',
    message: 'Chúc mừng bạn đã hoàn thành 5 mục tiêu trong tuần này!',
    time: '1 giờ trước',
    icon: 'trending-up',
    color: '#4ECDC4'
  },
  {
    id: '2',
    type: 'encouragement',
    message: 'Mỗi bước chạy hôm nay là một bước tiến gần hơn đến phiên bản khỏe mạnh nhất của bạn!',
    time: '3 giờ trước',
    icon: 'walk',
    color: '#FFD166'
  },
  {
    id: '3',
    type: 'reminder',
    message: 'Cơ thể của bạn xứng đáng được chăm sóc. Hãy tiếp tục duy trì thói quen tốt nhé!',
    time: 'một ngày trước',
    icon: 'heart',
    color: '#FF6B6B'
  },
  {
    id: '4',
    type: 'reminder',
    message: 'Hãy uống đủ nước và nghỉ ngơi hợp lý để cơ thể luôn tràn đầy năng lượng!',
    time: '2 ngày trước',
    icon: 'water',
    color: '#5B9AE8'
  },
  {
    id: '5',
    type: 'encouragement',
    message: 'Bạn đã hoàn thành 80% mục tiêu tháng này. Cố lên!',
    time: '3 ngày trước',
    icon: 'stats-chart',
    color: '#6A0572'
  },
];

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');
  const [filteredNotifications, setFilteredNotifications] = useState(notifications);
  
  useEffect(() => {
    // Update badge count in the tab bar
    updateBadgeCount(notifications.length);
    
    // Filter notifications based on active tab
    if (activeTab === 'all') {
      setFilteredNotifications(notifications);
    } else {
      setFilteredNotifications(notifications.filter(item => item.type === activeTab));
    }
  }, [activeTab, notifications]);
  
  const updateBadgeCount = (count) => {
    // In a real app, you would update the tab bar badge here
    // This is a placeholder for the implementation
    console.log('Badge count updated:', count);
  };
  
  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(item => item.id !== id);
    setNotifications(updatedNotifications);
  };
  
  const deleteAllNotifications = () => {
    setNotifications([]);
  };
  
  const renderRightActions = (progress, dragX, id) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });
    
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNotification(id)}
      >
        <Animated.View
          style={[
            styles.deleteButtonContent,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <Ionicons name="trash-outline" size={24} color="white" />
          <ThemedText style={styles.deleteButtonText}>Xóa</ThemedText>
        </Animated.View>
      </TouchableOpacity>
    );
  };
  
  const renderNotificationItem = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) => 
        renderRightActions(progress, dragX, item.id)
      }
    >
      <ThemedView style={styles.notificationItem}>
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={24} color="white" />
        </View>
        <View style={styles.notificationContent}>
          <ThemedText style={styles.notificationMessage}>{item.message}</ThemedText>
          <ThemedText style={styles.notificationTime}>{item.time}</ThemedText>
        </View>
      </ThemedView>
    </Swipeable>
  );
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<View style={{height: 100, backgroundColor: '#A1CEDC'}} />}
    >
      <ThemedView style={styles.container}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title">Thông báo</ThemedText>
          
          {notifications.length > 0 && (
            <TouchableOpacity
              style={styles.deleteAllButton}
              onPress={deleteAllNotifications}
            >
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
              <ThemedText style={styles.deleteAllText}>Xóa tất cả</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
        
        {/* Category Tabs */}
        <ThemedView style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'all' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('all')}
          >
            <ThemedText style={[
              styles.tabText,
              activeTab === 'all' && styles.activeTabText
            ]}>Tất cả</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'encouragement' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('encouragement')}
          >
            <ThemedText style={[
              styles.tabText,
              activeTab === 'encouragement' && styles.activeTabText
            ]}>Khích lệ</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'reminder' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('reminder')}
          >
            <ThemedText style={[
              styles.tabText,
              activeTab === 'reminder' && styles.activeTabText
            ]}>Nhắc nhở</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(item => (
            <Swipeable
              key={item.id}
              renderRightActions={(progress, dragX) => 
                renderRightActions(progress, dragX, item.id)
              }
            >
              <ThemedView style={styles.notificationItem}>
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={24} color="white" />
                </View>
                <View style={styles.notificationContent}>
                  <ThemedText style={styles.notificationMessage}>{item.message}</ThemedText>
                  <ThemedText style={styles.notificationTime}>{item.time}</ThemedText>
                </View>
              </ThemedView>
            </Swipeable>
          ))
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
            <ThemedText style={styles.emptyText}>
              Không có thông báo nào
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  deleteAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  deleteAllText: {
    color: '#FF6B6B',
    marginLeft: 4,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  activeTabButton: {
    backgroundColor: '#A1CEDC',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  notificationList: {
    // We can remove paddingTop since ParallaxScrollView handles this
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 100,
    height: '100%',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
  },
});
