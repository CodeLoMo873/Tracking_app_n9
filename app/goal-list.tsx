import { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useUser } from '@/hooks/useUser'; // Add this import

const categoryColors = {
  'Sức khoẻ': '#FF6B6B',
  'Công việc': '#4ECDC4',
  'Tài chính': '#FFD166',
  'Học tập': '#6A0572',
  'Sở thích': '#1A535C',
};

export default function GoalListScreen() {
  const { goal_type_id, color, goal_type_name } = useLocalSearchParams();
  const [goals, setGoals] = useState([]);
  const [activeFilter, setActiveFilter] = useState('newest'); // Default filter

  // Add these lines to fix the error
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalTasks, setGoalTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Filter function
  const applyFilter = (goalsList, filter) => {
    switch (filter) {
      case 'newest':
        return [...goalsList].sort((a, b) => new Date(b.end_date) - new Date(a.end_date));
      case 'oldest':
        return [...goalsList].sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
      default:
        return goalsList;
    }
  };

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch(`http://192.168.69.105:3000/api/goals/type/${goal_type_id}`);
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setGoals(applyFilter(result.data, activeFilter));
        } else {
          setGoals([]);
        }
      } catch (error) {
        setGoals([]);
      }
    };
    fetchGoals();
  }, [goal_type_id, activeFilter]);

  // Filter buttons
  const renderFilterButtons = () => {
    const filters = [
      { id: 'newest', label: 'Mới nhất', color: '#A1CEDC' },
      { id: 'oldest', label: 'Cũ nhất', color: '#D8B5E3' },
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

  // Render each goal item
  const renderGoalItem = ({ item }) => {
    const today = new Date();
    const deadline = new Date(item.end_date);
    const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    return (
      <TouchableOpacity
        style={styles.goalItem}
        onPress={() => handleOpenDetail(item)}
      >
        <View style={styles.goalHeader}>
          <ThemedText style={styles.goalTitle}>{item.goal_name}</ThemedText>
        </View>
        <View style={styles.goalInfo}>
          <ThemedText style={styles.goalDetail}>{item.goal_detail}</ThemedText>
          <ThemedText style={styles.deadlineText}>
            {daysRemaining > 0
              ? `Còn ${daysRemaining} ngày`
              : daysRemaining === 0
                ? 'Đến hạn hôm nay'
                : 'Đã quá hạn'}
          </ThemedText>
          <ThemedText style={styles.deadlineText}>
            Bắt đầu: {new Date(item.start_date).toLocaleDateString()} - Kết thúc: {new Date(item.end_date).toLocaleDateString()}
          </ThemedText>
        </View>
        <View style={styles.goalFooter}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => handleOpenDetail(item)}
          >
            <ThemedText style={styles.detailButtonText}>Chi tiết</ThemedText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Open modal and fetch tasks for the selected goal
  const handleOpenDetail = async (goal) => {
    setSelectedGoal(goal);
    setDetailModalVisible(true);
    setLoadingTasks(true);
    try {
      const res = await fetch(`http://192.168.69.105:3000/api/tasks/goal/${goal.goal_id}`);
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setGoalTasks(result.data);
      } else {
        setGoalTasks([]);
      }
    } catch {
      setGoalTasks([]);
    }
    setLoadingTasks(false);
  };

  // Add this function to handle task deletion
  const handleDeleteTask = async (task_id) => {
    try {
      const res = await fetch(`http://192.168.69.105:3000/api/tasks/${task_id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        setGoalTasks(prev => prev.filter(task => task.task_id !== task_id));
        Alert.alert('Thành công', 'Đã xoá task!');
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể xoá task');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi xoá task');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={<Image />}
      >
        <ThemedView style={styles.container}>
          <ThemedView style={styles.header}>
            // Determine header color
            const headerColor = color || '#0a7ea4';
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push('/quanlimuctieu')}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>
              {goal_type_name ? `Danh sách mục tiêu: ${goal_type_name}` : 'Danh sách mục tiêu'}
            </ThemedText>
            {/* Removed the add button */}
          </ThemedView>
          {renderFilterButtons()}
          {goals.length > 0 ? (
            <View style={styles.listContainer}>
              {goals.map(goal => (
                <View key={goal._id}>
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
              {/* Removed the "Thêm mục tiêu mới" button */}
            </ThemedView>
          )}
        </ThemedView>
      </ParallaxScrollView>

      {/* Goal Detail Modal */}
      <Modal
        visible={detailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            width: '90%',
            maxHeight: '80%',
          }}>
            <ScrollView>
              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginBottom: 8 }}
                onPress={() => setDetailModalVisible(false)}
              >
                <Ionicons name="close" size={28} color="#0a7ea4" />
              </TouchableOpacity>
              {selectedGoal && (
                <>
                  <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                    Thông tin mục tiêu
                  </ThemedText>
                  <ThemedText style={{ fontWeight: 'bold' }}>Tên mục tiêu:</ThemedText>
                  <ThemedText>{selectedGoal.goal_name}</ThemedText>
                  <ThemedText style={{ fontWeight: 'bold', marginTop: 8 }}>Mô tả:</ThemedText>
                  <ThemedText>{selectedGoal.goal_detail}</ThemedText>
                  <ThemedText style={{ fontWeight: 'bold', marginTop: 8 }}>Thời gian:</ThemedText>
                  <ThemedText>
                    {new Date(selectedGoal.start_date).toLocaleDateString()} - {new Date(selectedGoal.end_date).toLocaleDateString()}
                  </ThemedText>
                  <ThemedText style={{ fontWeight: 'bold', marginTop: 8 }}>Trạng thái:</ThemedText>
                  <ThemedText>
                    {selectedGoal.status === 1 ? 'Hoàn thành' : 'Đang thực hiện'}
                  </ThemedText>
                  {/* Add "Tạo mới task" button here */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#0a7ea4',
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 8,
                      alignSelf: 'flex-start',
                      marginTop: 16,
                      marginBottom: 8,
                    }}
                    onPress={() => {
                      setDetailModalVisible(false);
                      router.push({
                        pathname: '/create-task',
                        params: { goal_id: selectedGoal.goal_id }
                      });
                    }}
                  >
                    <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Tạo mới task</ThemedText>
                  </TouchableOpacity>
                  <ThemedText style={{ fontWeight: 'bold', marginTop: 8 }}>Danh sách task:</ThemedText>
                  {loadingTasks ? (
                    <ActivityIndicator size="small" color="#0a7ea4" style={{ marginTop: 8 }} />
                  ) : (
                    goalTasks.length > 0 ? (
                      goalTasks.map(task => (
                        <View key={task._id} style={{
                          backgroundColor: '#f5f5f5',
                          borderRadius: 8,
                          padding: 12,
                          marginTop: 8,
                          marginBottom: 4,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          <View style={{ flex: 1 }}>
                            <ThemedText style={{ fontWeight: 'bold' }}>{task.task_name}</ThemedText>
                            <ThemedText>{task.task_detail}</ThemedText>
                            <ThemedText>
                              Ngày đến hạn: {new Date(task.due_date).toLocaleDateString()}
                            </ThemedText>
                            <ThemedText>
                              Thời gian: {task.start_time || '-'} - {task.end_time || '-'}
                            </ThemedText>
                            <ThemedText>
                              Trạng thái: {task.status === 1 ? 'Hoàn thành' : 'Chưa hoàn thành'}
                            </ThemedText>
                          </View>
                          <TouchableOpacity
                            style={{ marginLeft: 12, padding: 4 }}
                            onPress={() => handleDeleteTask(task.task_id)}
                          >
                            <Ionicons name="trash" size={22} color="#e74c3c" />
                          </TouchableOpacity>
                        </View>
                      ))
                    ) : (
                      <ThemedText style={{ color: '#888', fontStyle: 'italic', marginTop: 8 }}>
                        Chưa có task nào
                      </ThemedText>
                    )
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#0a7ea4',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
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
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  goalInfo: {
    marginTop: 4,
    marginBottom: 8,
  },
  goalDetail: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  deadlineText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  detailButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#0a7ea4',
  },
  detailButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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
    backgroundColor: '#0a7ea4',
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
});