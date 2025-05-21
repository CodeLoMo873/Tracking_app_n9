import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Mock data for goals - in a real app, this would come from an API or database
const mockGoals = {
  'Sức khoẻ': [
    { id: '1', title: 'Chạy bộ 5km mỗi ngày', deadline: '2023-12-31', progress: 60, priority: 'high', type: 'daily', target: '5km' },
    { id: '2', title: 'Uống 2 lít nước mỗi ngày', deadline: '2023-12-31', progress: 80, priority: 'medium', type: 'daily', target: '2 lít' },
    { id: '3', title: 'Ngủ đủ 8 tiếng mỗi ngày', deadline: '2023-12-31', progress: 40, priority: 'low', type: 'daily', target: '8 giờ' },
    { id: '4', title: 'Tập gym 3 lần/tuần', deadline: '2023-12-31', progress: 100, priority: 'high', type: 'weekly', target: '3 lần' },
    { id: '5', title: 'Giảm 5kg', deadline: '2023-12-31', progress: 23, priority: 'high', type: 'monthly', target: '5kg' },
    { id: '6', title: 'Tăng 5cm chiều cao', deadline: '2023-12-31', progress: 30, priority: 'medium', type: 'monthly', target: '5cm' },
  ],
  'Công việc': [
    { id: '1', title: 'Hoàn thành dự án A', deadline: '2023-11-30', progress: 75, priority: 'high' },
    { id: '2', title: 'Học kỹ năng mới', deadline: '2023-12-15', progress: 30, priority: 'medium' },
    { id: '3', title: 'Tham gia khóa học online', deadline: '2023-12-31', progress: 100, priority: 'low' },
  ],
  'Tài chính': [
    { id: '1', title: 'Tiết kiệm 20% thu nhập', deadline: '2023-12-31', progress: 45, priority: 'high' },
    { id: '2', title: 'Đầu tư vào cổ phiếu', deadline: '2023-11-15', progress: 100, priority: 'medium' },
  ],
  'Học tập': [
    { id: '1', title: 'Học tiếng Anh mỗi ngày', deadline: '2023-12-31', progress: 65, priority: 'high' },
    { id: '2', title: 'Đọc 2 sách mỗi tháng', deadline: '2023-11-30', progress: 50, priority: 'medium' },
    { id: '3', title: 'Hoàn thành khóa học online', deadline: '2023-12-15', progress: 100, priority: 'high' },
  ],
  'Sở thích': [
    { id: '1', title: 'Học chơi đàn guitar', deadline: '2023-12-31', progress: 20, priority: 'low' },
    { id: '2', title: 'Tham gia lớp nấu ăn', deadline: '2023-11-15', progress: 90, priority: 'medium' },
    { id: '3', title: 'Tập vẽ mỗi tuần', deadline: '2023-12-31', progress: 100, priority: 'low' },
  ],
};

// Color mapping for categories
const categoryColors = {
  'Sức khoẻ': '#5BD8E5',
  'Công việc': '#4ECDC4',
  'Tài chính': '#FFD166',
  'Học tập': '#6A0572',
  'Sở thích': '#1A535C',
};

// Progress bar colors
const progressColors = {
  low: '#FF6B6B',    // Red for low progress
  medium: '#FFD166', // Yellow for medium progress
  high: '#A5E8B7',   // Green for high progress
};

export default function GoalStatsScreen() {
  const { category } = useLocalSearchParams();
  
  // Default mock data for statistics
  const defaultGoals = [
    { id: '1', title: 'Chạy bộ 5km mỗi ngày', deadline: '2023-12-31', progress: 60, priority: 'high', type: 'daily', target: '5km' },
    { id: '2', title: 'Uống 2 lít nước mỗi ngày', deadline: '2023-12-31', progress: 80, priority: 'medium', type: 'daily', target: '2 lít' },
    { id: '3', title: 'Ngủ đủ 8 tiếng mỗi ngày', deadline: '2023-12-31', progress: 40, priority: 'low', type: 'daily', target: '8 giờ' },
    { id: '4', title: 'Tập gym 3 lần/tuần', deadline: '2023-12-31', progress: 100, priority: 'high', type: 'weekly', target: '3 lần' },
    { id: '5', title: 'Giảm 5kg', deadline: '2023-12-31', progress: 23, priority: 'high', type: 'monthly', target: '5kg' },
    { id: '6', title: 'Tăng 5cm chiều cao', deadline: '2023-12-31', progress: 30, priority: 'medium', type: 'monthly', target: '5cm' },
  ];
  
  const [goals, setGoals] = useState(defaultGoals);
  const [stats, setStats] = useState({
    completed: defaultGoals.filter(goal => goal.progress === 100).length,
    total: defaultGoals.length,
    completionRate: defaultGoals.length > 0
      ? (defaultGoals.filter(goal => goal.progress === 100).length / defaultGoals.length) * 100
      : 0,
    dailyGoals: defaultGoals.filter(goal => goal.type === 'daily'),
    weeklyGoals: defaultGoals.filter(goal => goal.type === 'weekly'),
    monthlyGoals: defaultGoals.filter(goal => goal.type === 'monthly'),
  });
  
  const categoryColor = categoryColors[category] || '#0a7ea4';
  
  useEffect(() => {
    // If you want to fetch from API, do it here and update setGoals/setStats.
    // If no data is returned, keep the defaultGoals.
    // Example:
    // fetchData().then(data => {
    //   if (data && data.length > 0) {
    //     setGoals(data);
    //     // ...calculate and setStats...
    //   }
    // });
  }, [category]);

  // Circular progress indicator
  const CircularProgress = ({ percentage }) => {
    const size = 150;
    const strokeWidth = 15;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <View style={styles.progressContainer}>
        <Svg width={size} height={size}>
          {/* Background Circle */}
          <Circle
            stroke="#E6E6E6"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Progress Circle */}
          <Circle
            stroke={categoryColor}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.progressTextContainer}>
          <ThemedText style={styles.progressPercentage}>
            {stats.completionRate.toFixed(1)}%
          </ThemedText>
        </View>
      </View>
    );
  };

  // Goal progress bar component
  const GoalProgressBar = ({ goal }) => {
    let progressColor;
    if (goal.progress < 30) progressColor = progressColors.low;
    else if (goal.progress < 70) progressColor = progressColors.medium;
    else progressColor = progressColors.high;
    
    return (
      <View style={styles.goalProgressItem}>
        <View style={styles.goalProgressHeader}>
          <ThemedText style={styles.goalProgressTitle}>{goal.title}</ThemedText>
          <ThemedText style={styles.goalProgressPercentage}>{goal.progress}%</ThemedText>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${goal.progress}%`, backgroundColor: progressColor }
              ]} 
            />
          </View>
          <TouchableOpacity style={styles.detailButton}>
            <Ionicons name="information-circle-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render goal section by type
  const renderGoalSection = (title, goals) => {
    if (goals.length === 0) return null;
    
    return (
      <View style={styles.goalSection}>
        <ThemedText style={styles.goalSectionTitle}>{title}</ThemedText>
        {goals.map(goal => (
          <GoalProgressBar key={goal.id} goal={goal} />
        ))}
      </View>
    );
  };

  return (
    <>
      {/* Add this to hide the default header */}
      <Stack.Screen options={{ headerShown: false }} />
      
      <ParallaxScrollView
        headerBackgroundColor={{ light: categoryColor, dark: categoryColor }}
        headerImage={<View style={{height: 100, backgroundColor: categoryColor}} />}
      >
        <ThemedView style={styles.container}>
          {/* Header */}
          <ThemedView style={[styles.header, { backgroundColor: categoryColor }]}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.push('/quanlimuctieu')}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            {/* Removed the header title */}
            
            <View style={styles.placeholder} />
          </ThemedView>
          
          {/* Circular Progress Card */}
          <ThemedView style={styles.progressCard}>
            <CircularProgress percentage={stats.completionRate} />
            <ThemedText style={styles.completionText}>
              Bạn đã hoàn thành {stats.completed} trong số {stats.total} mục tiêu
            </ThemedText>
          </ThemedView>
          
          {/* Goal Types Section */}
          <ThemedView style={styles.goalTypesContainer}>
            <ThemedText style={styles.sectionTitle}>Mục tiêu</ThemedText>
            
            <View style={styles.goalTypesRow}>
              <TouchableOpacity style={styles.goalTypeButton}>
                <ThemedText style={styles.goalTypeText}>Hàng ngày</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.goalTypeButton}>
                <ThemedText style={styles.goalTypeText}>Hàng tuần</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.goalTypeButton}>
                <ThemedText style={styles.goalTypeText}>Hàng tháng</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
          
          {/* Goal Progress Sections */}
          <ThemedView style={styles.goalProgressContainer}>
            {renderGoalSection("Hàng ngày", stats.dailyGoals)}
            {renderGoalSection("Hàng tuần", stats.weeklyGoals)}
            {renderGoalSection("Hàng tháng", stats.monthlyGoals)}
            
            {goals.length === 0 && (
              <ThemedView style={styles.emptyContainer}>
                <Ionicons name="clipboard-outline" size={64} color="#ccc" />
                <ThemedText style={styles.emptyText}>
                  Chưa có mục tiêu nào trong danh mục này
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  completionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  goalTypesContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  goalTypesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalTypeButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  goalTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  goalProgressContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  goalSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  goalProgressItem: {
    marginBottom: 16,
  },
  goalProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalProgressTitle: {
    fontSize: 14,
    flex: 1,
  },
  goalProgressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  detailButton: {
    marginLeft: 8,
  },
  emptyContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});