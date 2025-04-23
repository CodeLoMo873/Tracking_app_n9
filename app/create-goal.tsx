import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, ScrollView, Switch, Platform, Modal, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router';

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

export default function CreateGoalScreen() {
  const { category } = useLocalSearchParams();
  const categoryColor = categoryColors[category] || '#0a7ea4';
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalType, setGoalType] = useState('daily'); // daily, weekly, monthly
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Default to 1 week from now
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [reminder, setReminder] = useState(false);
  
  // New state for color and icon
  const [selectedColor, setSelectedColor] = useState(categoryColor);
  const [selectedIcon, setSelectedIcon] = useState(goalIcons[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  
  const handleSave = () => {
    // Here you would save the goal to your database or state management
    console.log({
      title,
      description,
      category,
      goalType,
      startDate,
      endDate,
      reminder,
      color: selectedColor,
      icon: selectedIcon
    });
    
    // Navigate back to the goals list
    router.push({
      pathname: '/goal-list',
      params: { category }
    });
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
            onPress={() => router.push({
              pathname: '/goal-list',
              params: { category }
            })}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <ThemedText style={styles.headerTitle}>Tạo mục tiêu mới</ThemedText>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <ThemedText style={styles.saveButtonText}>Lưu</ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Form */}
        <ThemedView style={styles.formContainer}>
          {/* Category */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Danh mục</ThemedText>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
              <ThemedText style={styles.categoryText}>{category}</ThemedText>
            </View>
          </View>
          
          {/* Title */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Đặt tên mục tiêu</ThemedText>
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
            <ThemedText style={styles.label}>Mô tả</ThemedText>
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
          
          {/* Goal Type */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Loại mục tiêu</ThemedText>
            <View style={styles.goalTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.goalTypeButton,
                  goalType === 'daily' && [styles.activeGoalType, { borderColor: categoryColor }]
                ]}
                onPress={() => setGoalType('daily')}
              >
                <ThemedText style={[
                  styles.goalTypeText,
                  goalType === 'daily' && { color: categoryColor, fontWeight: 'bold' }
                ]}>Hàng ngày</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.goalTypeButton,
                  goalType === 'weekly' && [styles.activeGoalType, { borderColor: categoryColor }]
                ]}
                onPress={() => setGoalType('weekly')}
              >
                <ThemedText style={[
                  styles.goalTypeText,
                  goalType === 'weekly' && { color: categoryColor, fontWeight: 'bold' }
                ]}>Hàng tuần</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.goalTypeButton,
                  goalType === 'monthly' && [styles.activeGoalType, { borderColor: categoryColor }]
                ]}
                onPress={() => setGoalType('monthly')}
              >
                <ThemedText style={[
                  styles.goalTypeText,
                  goalType === 'monthly' && { color: categoryColor, fontWeight: 'bold' }
                ]}>Hàng tháng</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Date Range */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Thời gian</ThemedText>
            
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
          
          {/* Reminder */}
          <View style={styles.formGroup}>
            <View style={styles.switchContainer}>
              <ThemedText style={styles.label}>Nhắc nhở</ThemedText>
              <Switch
                value={reminder}
                onValueChange={setReminder}
                trackColor={{ false: '#d3d3d3', true: categoryColor }}
                thumbColor={Platform.OS === 'ios' ? '#fff' : reminder ? '#fff' : '#f4f3f4'}
              />
            </View>
            <ThemedText style={styles.helperText}>
              Bạn sẽ nhận được thông báo nhắc nhở về mục tiêu này
            </ThemedText>
          </View>
          
          {/* Color and Icon Selection */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Màu sắc và biểu tượng</ThemedText>
            <View style={styles.colorIconContainer}>
              <TouchableOpacity 
                style={[styles.colorPreview, { backgroundColor: selectedColor }]}
                onPress={() => setShowColorPicker(true)}
              >
                <ThemedText style={styles.colorPreviewText}>Màu sắc</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.iconPreview, { backgroundColor: selectedColor }]}
                onPress={() => setShowIconPicker(true)}
              >
                {selectedIcon && renderIcon(selectedIcon, 28)}
              </TouchableOpacity>
            </View>
          </View>
        </ThemedView>

        {/* Date Picker Modals */}
        <Modal
          visible={showStartDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowStartDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {renderSimpleDatePicker(
                startDate, 
                setStartDate, 
                () => setShowStartDatePicker(false)
              )}
            </View>
          </View>
        </Modal>

        <Modal
          visible={showEndDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowEndDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {renderSimpleDatePicker(
                endDate, 
                setEndDate, 
                () => setShowEndDatePicker(false)
              )}
            </View>
          </View>
        </Modal>

        {/* Color Picker Modal */}
        <Modal
          visible={showColorPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowColorPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ThemedText style={styles.modalTitle}>Chọn màu sắc</ThemedText>
              
              <FlatList
                data={goalColors}
                numColumns={5}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.colorOption,
                      { backgroundColor: item },
                      selectedColor === item && styles.selectedColorOption
                    ]}
                    onPress={() => {
                      setSelectedColor(item);
                      setShowColorPicker(false);
                    }}
                  />
                )}
                style={styles.colorGrid}
              />
            </View>
          </View>
        </Modal>

        {/* Icon Picker Modal */}
        <Modal
          visible={showIconPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowIconPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ThemedText style={styles.modalTitle}>Chọn biểu tượng</ThemedText>
              
              <FlatList
                data={goalIcons}
                numColumns={4}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.iconOption,
                      (selectedIcon && selectedIcon.name === item.name && selectedIcon.type === item.type) && 
                      [styles.selectedIconOption, { borderColor: selectedColor }]
                    ]}
                    onPress={() => {
                      setSelectedIcon(item);
                      setShowIconPicker(false);
                    }}
                  >
                    {renderIcon(item, 28, '#333')}
                  </TouchableOpacity>
                )}
                style={styles.iconGrid}
              />
            </View>
          </View>
        </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
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