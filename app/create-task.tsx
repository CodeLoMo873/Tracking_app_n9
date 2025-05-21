import { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function CreateTaskScreen() {
  const { goal_id } = useLocalSearchParams(); // goal_id from params
  const [taskName, setTaskName] = useState('');
  const [taskDetail, setTaskDetail] = useState('');
  const [dueDate, setDueDate] = useState(''); // Only due date
  const [startTime, setStartTime] = useState(''); // Start time string
  const [endTime, setEndTime] = useState(''); // End time string

  // Picker state
  const [pickerMode, setPickerMode] = useState<'date' | 'time' | null>(null);
  const [pickerField, setPickerField] = useState<'due' | 'startTime' | 'endTime' | null>(null);
  const [isPickerVisible, setPickerVisible] = useState(false);

  const showPicker = (field) => {
    if (field === 'due') {
      setPickerMode('date');
    } else if (field === 'startTime' || field === 'endTime') {
      setPickerMode('time');
    }
    setPickerField(field);
    setPickerVisible(true);
  };

  const hidePicker = () => {
    setPickerVisible(false);
    setPickerMode(null);
    setPickerField(null);
  };

  const handleConfirm = (date) => {
    if (pickerField === 'due') {
      setDueDate(date.toISOString().split('T')[0]);
    } else if (pickerField === 'startTime') {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      setStartTime(`${hours}:${minutes}`);
    } else if (pickerField === 'endTime') {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      setEndTime(`${hours}:${minutes}`);
    }
    hidePicker();
  };

  const handleSave = async () => {
    if (!taskName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên task');
      return;
    }
    if (!dueDate) {
      Alert.alert('Lỗi', 'Vui lòng chọn ngày đến hạn');
      return;
    }
    try {
      const task_id = Date.now();
      const payload = {
        task_id,
        task_name: taskName,
        goal_id: Number(goal_id),
        task_detail: taskDetail,
        status: 0,
        due_date: dueDate,
        start_time: startTime || null, // <-- use startTime string from picker
        end_time: endTime || null,     // <-- use endTime string from picker
      };

      const response = await fetch('http://192.168.69.105:3000/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert('Thành công', 'Đã thêm task mới!');
        router.back();
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể thêm task');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi thêm task');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0a7ea4" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Thêm mới task</ThemedText>
      </ThemedView>
      <View style={styles.container}>
        <ThemedText style={styles.label}>Tên task</ThemedText>
        <TextInput
          style={styles.input}
          value={taskName}
          onChangeText={setTaskName}
          placeholder="Nhập tên task"
        />

        <ThemedText style={styles.label}>Chi tiết</ThemedText>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={taskDetail}
          onChangeText={setTaskDetail}
          placeholder="Mô tả chi tiết"
          multiline
        />

        <ThemedText style={styles.label}>Ngày đến hạn</ThemedText>
        <TouchableOpacity style={styles.dateInput} onPress={() => showPicker('due')}>
          <ThemedText style={styles.dateInputText}>
            {dueDate ? dueDate : 'Chọn ngày đến hạn'}
          </ThemedText>
          <Ionicons name="calendar-outline" size={20} color="#0a7ea4" />
        </TouchableOpacity>

        <ThemedText style={styles.label}>Thời gian bắt đầu</ThemedText>
        <TouchableOpacity style={styles.dateInput} onPress={() => showPicker('startTime')}>
          <ThemedText style={styles.dateInputText}>
            {startTime ? startTime : 'Chọn giờ bắt đầu'}
          </ThemedText>
          <Ionicons name="time-outline" size={20} color="#0a7ea4" />
        </TouchableOpacity>

        <ThemedText style={styles.label}>Thời gian kết thúc</ThemedText>
        <TouchableOpacity style={styles.dateInput} onPress={() => showPicker('endTime')}>
          <ThemedText style={styles.dateInputText}>
            {endTime ? endTime : 'Chọn giờ kết thúc'}
          </ThemedText>
          <Ionicons name="time-outline" size={20} color="#0a7ea4" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <ThemedText style={styles.saveButtonText}>Lưu</ThemedText>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode={pickerMode || 'date'}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        headerTextIOS={
          pickerField === 'due'
            ? 'Chọn ngày đến hạn'
            : pickerField === 'startTime'
            ? 'Chọn giờ bắt đầu'
            : 'Chọn giờ kết thúc'
        }
        confirmTextIOS="Xác nhận"
        cancelTextIOS="Huỷ"
        locale="vi"
        minimumDate={pickerField === 'due' ? new Date() : undefined} // Prevent past dates for due date
      />
    </>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
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
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateInputText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});