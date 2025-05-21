import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Modal } from 'react-native';

export default function GoalDetailScreen() {
  const { id, category } = useLocalSearchParams();
  const [goal, setGoal] = useState(null);

  // State for task detail popup
  const [taskDetailModalVisible, setTaskDetailModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    // In a real app, fetch goal detail from API using id and category
    // For now, use mock data from mockGoals (you can refactor to fetch from a shared source)
    // You may want to move mockGoals to a shared file if needed
    const mockGoals = {
      'Sức khoẻ': [
        {
          id: '1',
          title: 'Chạy bộ 5km mỗi ngày',
          deadline: '2023-12-31',
          progress: 60,
          description: 'Chạy bộ mỗi sáng để tăng sức khoẻ.',
          tasks: [
            {
              id: 't1',
              task_name: 'Khởi động',
              task_detail: 'Khởi động kỹ trước khi chạy',
              start_date: '2023-12-01',
              end_date: '2023-12-01',
              do_time: '06:00',
            },
            {
              id: 't2',
              task_name: 'Chạy 3km',
              task_detail: 'Chạy với tốc độ vừa phải',
              start_date: '2023-12-01',
              end_date: '2023-12-01',
              do_time: '06:15',
            },
          ],
        },
        { id: '2', title: 'Uống 2 lít nước mỗi ngày', deadline: '2023-12-31', progress: 80, description: 'Uống đủ nước mỗi ngày.' },
        { id: '3', title: 'Ngủ đủ 8 tiếng mỗi ngày', deadline: '2023-12-31', progress: 40, description: 'Ngủ đủ giấc để phục hồi sức khoẻ.' },
      ],
      'Công việc': [
        { id: '1', title: 'Hoàn thành dự án A', deadline: '2023-11-30', progress: 75, description: 'Hoàn thành các task của dự án A.' },
        { id: '2', title: 'Học kỹ năng mới', deadline: '2023-12-15', progress: 30, description: 'Học React Native.' },
      ],
      'Tài chính': [
        { id: '1', title: 'Tiết kiệm 20% thu nhập', deadline: '2023-12-31', progress: 45, description: 'Tiết kiệm mỗi tháng.' },
        { id: '2', title: 'Đầu tư vào cổ phiếu', deadline: '2023-11-15', progress: 100, description: 'Đầu tư vào các mã cổ phiếu tiềm năng.' },
      ],
      'Học tập': [
        { id: '1', title: 'Học tiếng Anh mỗi ngày', deadline: '2023-12-31', progress: 65, description: 'Luyện nghe nói tiếng Anh.' },
        { id: '2', title: 'Đọc 2 sách mỗi tháng', deadline: '2023-11-30', progress: 50, description: 'Đọc sách phát triển bản thân.' },
      ],
      'Sở thích': [
        { id: '1', title: 'Học chơi đàn guitar', deadline: '2023-12-31', progress: 20, description: 'Tập luyện guitar mỗi tuần.' },
        { id: '2', title: 'Tham gia lớp nấu ăn', deadline: '2023-11-15', progress: 90, description: 'Học các món ăn mới.' },
      ],
    };
    const found = (mockGoals[category] || []).find(g => g.id === id);
    setGoal(found || null);
  }, [id, category]);

  if (!goal) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Không tìm thấy mục tiêu.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0a7ea4" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Chi tiết mục tiêu</ThemedText>
      </ThemedView>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText style={styles.label}>Tên mục tiêu</ThemedText>
        <TextInput style={styles.input} value={goal.title} editable={false} />

        <ThemedText style={styles.label}>Danh mục</ThemedText>
        <TextInput style={styles.input} value={category} editable={false} />

        <ThemedText style={styles.label}>Mô tả</ThemedText>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={goal.description || ''}
          editable={false}
          multiline
        />

        <ThemedText style={styles.label}>Hạn hoàn thành</ThemedText>
        <TextInput style={styles.input} value={goal.deadline} editable={false} />

        <ThemedText style={styles.label}>Tiến độ</ThemedText>
        <TextInput style={styles.input} value={goal.progress + '%'} editable={false} />

        {/* Task List */}
        <ThemedText style={[styles.label, { marginTop: 24 }]}>Danh sách task</ThemedText>
        {goal.tasks && goal.tasks.length > 0 ? (
          goal.tasks.map(task => (
            <View key={task.id} style={styles.taskRow}>
              <ThemedText style={styles.taskName}>{task.task_name}</ThemedText>
              <TouchableOpacity
                style={styles.taskDetailButton}
                onPress={() => {
                  setSelectedTask(task);
                  setTaskDetailModalVisible(true);
                }}
              >
                <ThemedText style={styles.taskDetailButtonText}>Xem chi tiết</ThemedText>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <ThemedText style={{ color: '#888', fontStyle: 'italic' }}>Chưa có task nào</ThemedText>
        )}

        {/* Thêm mới task button */}
        <TouchableOpacity
          style={{
            marginTop: 24,
            backgroundColor: '#0a7ea4',
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: 'center'
          }}
          onPress={() => {
            router.push({
              pathname: '/create-task',
              params: { goalId: goal.id, category }
            });
          }}
        >
          <ThemedText style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            Thêm mới task
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>

      {/* Task Detail Modal */}
      <Modal
        visible={taskDetailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTaskDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
              Chi tiết task
            </ThemedText>
            {selectedTask && (
              <>
                <ThemedText style={styles.label}>Tên task</ThemedText>
                <TextInput style={styles.input} value={selectedTask.task_name} editable={false} />

                <ThemedText style={styles.label}>Chi tiết</ThemedText>
                <TextInput
                  style={[styles.input, { height: 60 }]}
                  value={selectedTask.task_detail || ''}
                  editable={false}
                  multiline
                />

                <ThemedText style={styles.label}>Ngày bắt đầu</ThemedText>
                <TextInput style={styles.input} value={selectedTask.start_date} editable={false} />

                <ThemedText style={styles.label}>Ngày kết thúc</ThemedText>
                <TextInput style={styles.input} value={selectedTask.end_date} editable={false} />

                <ThemedText style={styles.label}>Thời gian thực hiện</ThemedText>
                <TextInput style={styles.input} value={selectedTask.do_time} editable={false} />
              </>
            )}
            <TouchableOpacity
              style={{
                marginTop: 24,
                backgroundColor: '#0a7ea4',
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center'
              }}
              onPress={() => setTaskDetailModalVisible(false)}
            >
              <ThemedText style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                Đóng
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  content: {
    padding: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'space-between',
  },
  taskName: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  taskDetailButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 12,
  },
  taskDetailButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
});