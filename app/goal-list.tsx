import { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, FlatList, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Mock data for goals - in a real app, this would come from an API or database
const mockGoals = {
  'Sức khoẻ': [
    { id: '1', title: 'Chạy bộ 5km mỗi ngày', deadline: '2023-12-31', progress: 60},
    { id: '2', title: 'Uống 2 lít nước mỗi ngày', deadline: '2023-12-31', progress: 80},
    { id: '3', title: 'Ngủ đủ 8 tiếng mỗi ngày', deadline: '2023-12-31', progress: 40},
  ],
  'Công việc': [
    { id: '1', title: 'Hoàn thành dự án A', deadline: '2023-11-30', progress: 75},
    { id: '2', title: 'Học kỹ năng mới', deadline: '2023-12-15', progress: 30},
  ],
  'Tài chính': [
    { id: '1', title: 'Tiết kiệm 20% thu nhập', deadline: '2023-12-31', progress: 45},
    { id: '2', title: 'Đầu tư vào cổ phiếu', deadline: '2023-11-15', progress: 100},
  ],
  'Học tập': [
    { id: '1', title: 'Học tiếng Anh mỗi ngày', deadline: '2023-12-31', progress: 65},
    { id: '2', title: 'Đọc 2 sách mỗi tháng', deadline: '2023-11-30', progress: 50},
  ],
  'Sở thích': [
    { id: '1', title: 'Học chơi đàn guitar', deadline: '2023-12-31', progress: 20},
    { id: '2', title: 'Tham gia lớp nấu ăn', deadline: '2023-11-15', progress: 90},
  ],
};

// Color mapping for categories
const categoryColors = {
  'Sức khoẻ': '#FF6B6B',
  'Công việc': '#4ECDC4',
  'Tài chính': '#FFD166',
  'Học tập': '#6A0572',
  'Sở thích': '#1A535C',
};

// Icon mapping for categories
const categoryIcons = {
  'Sức khoẻ': { name: 'heart', type: 'ionicons' },
  'Công việc': { name: 'briefcase', type: 'ionicons' },
  'Tài chính': { name: 'wallet', type: 'ionicons' },
  'Học tập': { name: 'book', type: 'font-awesome' },
  'Sở thích': { name: 'gamepad-variant', type: 'material' },
};

export default function GoalListScreen() {
  const { category } = useLocalSearchParams();
  const [goals, setGoals] = useState([]);
  const categoryColor = categoryColors[category] || '#0a7ea4';
  const [activeFilter, setActiveFilter] = useState('newest'); // Default filter
  
  useEffect(() => {
    // In a real app, you would fetch goals from an API here
    let filteredGoals = mockGoals[category] || [];
    
    // Apply filters
    filteredGoals = applyFilter(filteredGoals, activeFilter);
    
    setGoals(filteredGoals);
  }, [category, activeFilter]);

  // Function to apply filters
  const applyFilter = (goalsList, filter) => {
    switch(filter) {
      case 'newest':
        return [...goalsList].sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
      case 'oldest':
        return [...goalsList].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      case 'completed':
        return goalsList.filter(goal => goal.progress === 100);
      case 'incomplete':
        return goalsList.filter(goal => goal.progress < 100);
      default:
        return goalsList;
    }
  };

  // Function to render filter buttons
  const renderFilterButtons = () => {
    const filters = [
      { id: 'newest', label: 'Mới nhất', color: '#A1CEDC' },
      { id: 'oldest', label: 'Cũ nhất', color: '#D8B5E3' },
      { id: 'completed', label: 'Hoàn thành', color: '#A5E8B7' },
      { id: 'incomplete', label: 'Chưa hoàn thành', color: '#FFB6A8' },
    ];

    return (
      <View style={styles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              { backgroundColor: filter.color },
              activeFilter === filter.id && styles.activeFilterButton
            ]}
            onPress={() => setActiveFilter(filter.id)}
          >
            <ThemedText style={styles.filterButtonText}>{filter.label}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCategoryIcon = () => {
    const iconInfo = categoryIcons[category];
    const size = 24;
    
    if (!iconInfo) return null;
    
    switch(iconInfo.type) {
      case 'ionicons':
        return <Ionicons name={iconInfo.name} size={size} color="white" />;
      case 'material':
        return <MaterialCommunityIcons name={iconInfo.name} size={size} color="white" />;
      case 'font-awesome':
        return <FontAwesome5 name={iconInfo.name} size={size} color="white" />;
      default:
        return <Ionicons name={iconInfo.name} size={size} color="white" />;
    }
  };

  const renderGoalItem = ({ item }) => {
    // Calculate days remaining
    const today = new Date();
    const deadline = new Date(item.deadline);
    const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    const isCompleted = item.progress === 100;
    
    return (
      <TouchableOpacity 
        style={[styles.goalItem, isCompleted && styles.completedGoalItem]}
        onPress={() => {
          // Navigate to goal detail screen (to be implemented)
          console.log(`Navigate to goal detail for ${item.title}`);
        }}
      >
        <View style={styles.goalHeader}>
          <ThemedText style={styles.goalTitle}>{item.title}</ThemedText>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: isCompleted ? '#A5E8B7' : '#FFB6A8' }
          ]}>
            <ThemedText style={styles.statusText}>
              {isCompleted ? 'Hoàn thành' : 'Chưa hoàn thành'}
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.goalInfo}>
          <ThemedText style={styles.deadlineText}>
            {daysRemaining > 0 
              ? `Còn ${daysRemaining} ngày` 
              : daysRemaining === 0 
                ? 'Đến hạn hôm nay' 
                : 'Đã quá hạn'}
          </ThemedText>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${item.progress}%`, backgroundColor: categoryColor }
                ]} 
              />
            </View>
            <ThemedText style={styles.progressText}>{item.progress}%</ThemedText>
          </View>
        </View>
        
        {/* Status badge and detail button */}
        <View style={styles.goalFooter}>
          <TouchableOpacity 
            style={[styles.detailButton, { backgroundColor: categoryColor }]}
            onPress={() => {
              // Navigate to goal detail screen
              router.push({
                pathname: '/goal-detail',
                params: { 
                  id: item.id,
                  category: category
                }
              });
            }}
          >
            <ThemedText style={styles.detailButtonText}>Chi tiết</ThemedText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* Add this to hide the default header */}
      <Stack.Screen options={{ headerShown: false }} />
      
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={<Image />}
      >
        <ThemedView style={styles.container}>
          {/* Header */}
          <ThemedView style={[styles.header, { backgroundColor: categoryColor }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push('/')}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
    
            <View style={styles.headerTitleContainer}>
              <View style={styles.headerIconContainer}>
                {renderCategoryIcon()}
              </View>
              <ThemedText style={styles.headerTitle}>{category}</ThemedText>
            </View>
    
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                router.push({
                  pathname: '/create-goal',
                  params: { category }
                });
              }}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </ThemedView>
          
          {/* Rest of your component remains the same */}
        {renderFilterButtons()}
  
        {/* Goal List */}
        {goals.length > 0 ? (
          <View style={styles.listContainer}>
            {goals.map(goal => (
              <View key={goal.id}>
                {renderGoalItem({ item: goal })}
              </View>
            ))}
          </View>
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={64} color="#ccc" />
            <ThemedText style={styles.emptyText}>
              Bạn chưa có mục tiêu nào trong danh mục này
            </ThemedText>
            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: categoryColor }]}
              onPress={() => {
                console.log(`Add new goal for ${category}`);
              }}
            >
              <ThemedText style={styles.emptyButtonText}>Thêm mục tiêu mới</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ThemedView>
    </ParallaxScrollView>
    </>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  goalItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  goalInfo: {
    marginTop: 8,
  },
  deadlineText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: '22%',
    width: '48%',
    alignItems: 'center',
  },
  activeFilterButton: {
    borderWidth: 2,
    borderColor: '#0a7ea4',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  completedGoalItem: {
    borderLeftWidth: 5,
    borderLeftColor: '#A5E8B7',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});