import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, ScrollView, Switch, Platform, Modal, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Color mapping for categories
const categoryColors = {
  'Sức khoẻ': '#FF6B6B',
  'Công việc': '#4ECDC4',
  'Tài chính': '#FFD166',
  'Học tập': '#6A0572',
  'Sở thích': '#1A535C',
};

// Available colors for goals
const goalColors = [
  '#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#1A535C',
  '#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7',
  '#C7CEEA', '#F2D7EE', '#A2D2FF', '#BDE0FE', '#CDB4DB',
  '#FFC8DD', '#FFAFCC', '#FF5C8D', '#7BDFF2', '#B2F7EF'
];

// Available icons for goals
const goalIcons = [
  { name: 'bicycle', type: 'font-awesome' },
  { name: 'apple', type: 'font-awesome' },
  { name: 'book', type: 'font-awesome' },
  { name: 'car', type: 'font-awesome' },
  { name: 'paint-brush', type: 'font-awesome' },
  { name: 'basketball', type: 'ionicons' },
  { name: 'bed', type: 'font-awesome' },
  { name: 'book-open', type: 'font-awesome5' },
  { name: 'camera', type: 'font-awesome' },
  { name: 'briefcase', type: 'ionicons' },
  { name: 'camera', type: 'ionicons' },
  { name: 'home', type: 'font-awesome' },
  { name: 'car', type: 'font-awesome' },
  { name: 'football', type: 'ionicons' },
  { name: 'heart', type: 'ionicons' },
  { name: 'laptop', type: 'font-awesome' }
];

import { useUser } from '@/hooks/useUser'; // Import your user hook

export default function CreateGoalScreen() {
  const { goal_type_id, color, goal_type_name } = useLocalSearchParams();
  const categoryColor = color || '#0a7ea4'; // Use passed color or fallback

  // Get current user
  const { userData } = useUser();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalType, setGoalType] = useState('daily'); // daily, weekly, monthly
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Default to 1 week from now
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Fetch all goals to get the max goal_id
      let newGoalId = Date.now(); // fallback
      try {
        const res = await fetch('http://192.168.69.105:3000/api/goals/all');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const maxId = Math.max(...data.data.map(g => g.goal_id));
          newGoalId = maxId + 1;
        } else {
          newGoalId = 1;
        }
      } catch {
        // fallback to timestamp
      }

      const newGoal = {
        goal_id: newGoalId,
        user_id: userData?.user_id || 1,
        goal_type_id: Number(goal_type_id),
        goal_name: title,
        goal_detail: description,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      };

      const response = await fetch('http://192.168.69.105:3000/api/goals/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal),
      });

      const result = await response.json();
      console.log('API response:', result);
      if (result.success) {
        router.push('/add_new'); // Navigate to add-new after success
      } else {
        alert('Tạo mục tiêu thất bại!\n' + (result.message || JSON.stringify(result)));
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi tạo mục tiêu!');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN');
  };

  // Simple date picker using buttons instead of native DateTimePicker
  const renderSimpleDatePicker = (date, setDate, closeModal) => {
    const addDays = (days) => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + days);
      setDate(newDate);
    };

    return (
      <View style={styles.datePickerContainer}>
        <ThemedText style={styles.datePickerTitle}>Chọn ngày</ThemedText>
        
        <ThemedText style={styles.currentDateText}>{formatDate(date)}</ThemedText>
        
        <View style={styles.dateButtonsRow}>
          <TouchableOpacity style={styles.dateButton} onPress={() => addDays(-7)}>
            <ThemedText>-7 ngày</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.dateButton} onPress={() => addDays(-1)}>
            <ThemedText>-1 ngày</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.dateButton} onPress={() => setDate(new Date())}>
            <ThemedText>Hôm nay</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.dateButton} onPress={() => addDays(1)}>
            <ThemedText>+1 ngày</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.dateButton} onPress={() => addDays(7)}>
            <ThemedText>+7 ngày</ThemedText>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.confirmDateButton, { backgroundColor: categoryColor }]}
          onPress={closeModal}
        >
          <ThemedText style={styles.confirmDateButtonText}>Xác nhận</ThemedText>
        </TouchableOpacity>
      </View>
    );
  };
  
  // Render icon based on type
  const renderIcon = (icon, size = 24, color = 'white') => {
    switch(icon.type) {
      case 'ionicons':
        return <Ionicons name={icon.name} size={size} color={color} />;
      case 'material':
        return <MaterialIcons name={icon.name} size={size} color={color} />;
      case 'material-community':
        return <MaterialCommunityIcons name={icon.name} size={size} color={color} />;
      case 'font-awesome':
        return <FontAwesome name={icon.name} size={size} color={color} />;
      case 'font-awesome5':
        return <FontAwesome5 name={icon.name} size={size} color={color} />;
      default:
        return <Ionicons name="star" size={size} color={color} />;
    }
  };
  
  return (
    <>
      {/* Add this to hide the default header */}
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: categoryColor }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/add_new')} // Navigate to add-new on back
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <ThemedText style={styles.headerTitle}>Tạo mục tiêu mới</ThemedText>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            <ThemedText style={styles.saveButtonText}>{loading ? 'Đang lưu...' : 'Lưu'}</ThemedText>
          </TouchableOpacity>
        </View>
        {/* Form */}
        <ThemedView style={styles.formContainer}>
          {/* Goal Type Name */}
          <View style={styles.formGroup}>
            <ThemedText style={[styles.label, { color: categoryColor }]}>Loại mục tiêu</ThemedText>
            <ThemedText style={{ color: 'black', fontWeight: 'normal', fontSize: 16, marginBottom: 8 }}>
              {goal_type_name || 'Không xác định'}
            </ThemedText>
          </View>
          {/* Title */}
          <View style={styles.formGroup}>
            <ThemedText style={[styles.label, { color: categoryColor }]}>Tên mục tiêu</ThemedText>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Nhập tên mục tiêu"
              placeholderTextColor="#999"
            />
          </View>
          {/* Description */}
          <View style={styles.formGroup}>
            <ThemedText style={[styles.label, { color: categoryColor }]}>Mô tả</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Mô tả chi tiết về mục tiêu của bạn"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          {/* Date Range */}
          <View style={styles.formGroup}>
            <ThemedText style={[styles.label, { color: categoryColor }]}>Thời gian</ThemedText>
            
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowStartDatePicker(true)}
            >
              <ThemedText>Ngày bắt đầu: {formatDate(startDate)}</ThemedText>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowEndDatePicker(true)}
            >
              <ThemedText>Ngày kết thúc: {formatDate(endDate)}</ThemedText>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* DateTimePickerModals */}
        <DateTimePickerModal
          isVisible={showStartDatePicker}
          mode="date"
          date={startDate}
          minimumDate={new Date()} // Prevent selecting a date before today
          onConfirm={(date) => {
            setStartDate(date);
            setShowStartDatePicker(false);
          }}
          onCancel={() => setShowStartDatePicker(false)}
        />
        <DateTimePickerModal
          isVisible={showEndDatePicker}
          mode="date"
          date={endDate}
          minimumDate={new Date()} // Prevent selecting a date before today
          onConfirm={(date) => {
            setEndDate(date);
            setShowEndDatePicker(false);
          }}
          onCancel={() => setShowEndDatePicker(false)}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    // color will be overridden inline
    marginBottom: 8,
  },
  goalTypeName: {
    fontSize: 16,
    fontWeight: 'bold',
    // color will be overridden inline
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  goalTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  activeGoalType: {
    borderWidth: 2,
  },
  goalTypeText: {
    fontSize: 14,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  datePickerContainer: {
    alignItems: 'center',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  currentDateText: {
    fontSize: 16,
    marginBottom: 16,
  },
  dateButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    margin: 4,
  },
  confirmDateButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  confirmDateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Color and Icon styles
  colorIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  colorPreview: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPreviewText: {
    color: 'white',
    fontWeight: 'bold',
  },
  iconPreview: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  colorGrid: {
    marginBottom: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 7,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#333',
  },
  iconGrid: {
    marginBottom: 10,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 8,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  selectedIconOption: {
    borderWidth: 3,
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});