import React from 'react';
import { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Mock data for daily tasks
const mockTasks = [
  { 
    id: '1', 
    startTime: '6:00', 
    endTime: '6:30', 
    date: '16/04/2025',
    title: 'Đạp xe',
    description: 'Đạp xe quanh Hồ Tây',
    icon: 'heartbeat',
    iconType: 'fontawesome',
    color: '#F48FB1',
    completed: false
  },
  { 
    id: '2', 
    startTime: '7:00', 
    endTime: '7:30', 
    date: '16/04/2025',
    title: 'Đọc sách',
    description: 'Đọc sách Tuổi trẻ đáng giá bao nhiêu',
    icon: 'book',
    iconType: 'fontawesome',
    color: '#81D4FA',
    completed: false
  },
  { 
    id: '3', 
    startTime: '18:00', 
    endTime: '18:30', 
    date: '16/04/2025',
    title: 'Chạy bộ',
    description: 'Chạy bộ quanh công viên',
    icon: 'heartbeat',
    iconType: 'fontawesome',
    color: '#F48FB1',
    completed: false
  },  
  { 
    id: '4', 
    startTime: '20:00', 
    endTime: '21:30', 
    date: '16/04/2025',
    title: 'Đọc sách',
    description: 'Đọc sách Tuổi trẻ đáng giá bao nhiêu',
    icon: 'book',
    iconType: 'fontawesome',
    color: '#81D4FA',
    completed: false
  },
  { 
    id: '5', 
    startTime: '22:00', 
    endTime: '22:30', 
    date: '16/04/2025',
    title: 'Làm bài tập',
    description: 'Làm bài tập về nhà',
    icon: 'book',
    iconType: 'fontawesome',
    color: '#81D4FA',
    completed: false
  },
];

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userName, setUserName] = useState('Nguyễn Văn An');

  // Format selectedDate to dd/MM/yyyy
  const formatSelectedDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // State for tasks for the selected date (with checkin capability)
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState(
    mockTasks.map(task => ({
      ...task,
      date: formatSelectedDate(new Date())
    }))
  );

  // Update tasks when selectedDate changes
  React.useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time part for accurate comparison
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    setTasksForSelectedDate(
      mockTasks.map(task => ({
        ...task,
        date: formatSelectedDate(selectedDate),
        completed: selected < today ? true : task.completed
      }))
    );
  }, [selectedDate]);

  // Handle checkin
  const handleCheckin = (taskId) => {
    setTasksForSelectedDate(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
  };

  // Generate dates for the date picker (2 days before, current day, 2 days after)
  const generateDates = () => {
    const dates = [];
    for (let i = -2; i <= 2; i++) {
      const date = new Date(selectedDate);
      date.setDate(selectedDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };
  
  const dates = generateDates();
  
  // Format date to display day of month
  const formatDay = (date) => {
    return date.getDate();
  };
  
  // Format date to display day of week
  const formatDayOfWeek = (date) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  };
  
  // Check if a date is the selected date
  const isSelectedDate = (date) => {
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  // Render task icon based on type
  const renderTaskIcon = (task) => {
    if (task.iconType === 'fontawesome') {
      return <FontAwesome5 name={task.icon} size={24} color="black" />;
    }
    return <Ionicons name={task.icon || 'checkmark-circle'} size={24} color="black" />;
  };
  
  // Render a task item
  const renderTaskItem = ({ item }) => {
    return (
      <View style={[styles.taskItem, { backgroundColor: item.color }]}>
        <View style={styles.taskTimeContainer}>
          <ThemedText style={styles.taskTime}>{item.startTime} - {item.endTime}</ThemedText>
          <ThemedText style={styles.taskDate}>{item.date}</ThemedText>
        </View>
        <View style={styles.taskContent}>
          <View style={styles.taskIconContainer}>
            {renderTaskIcon(item)}
          </View>
          <View style={styles.taskTextContainer}>
            <ThemedText style={styles.taskTitle}>{item.title}</ThemedText>
            <ThemedText style={styles.taskDescription}>{item.description}</ThemedText>
          </View>
          <View style={styles.taskStatusContainer}>
            {item.completed ? (
              <Ionicons name="checkmark-circle" size={28} color="green" />
            ) : (
              <>
                <Ionicons name="close-circle" size={28} color="red" />
                <TouchableOpacity
                  style={{
                    marginTop: 8,
                    backgroundColor: '#26C6DA',
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderRadius: 6,
                  }}
                  onPress={() => handleCheckin(item.id)}
                >
                  <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Checkin</ThemedText>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image />}
    >
      <ThemedView style={styles.container}>
        {/* User greeting */}
        <View style={styles.greetingContainer}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={50} color="#A1CEDC" />
          </View>
          <View>
            <ThemedText style={styles.greeting}>Xin chào!</ThemedText>
            <ThemedText style={styles.userName}>{userName}</ThemedText>
          </View>
        </View>
        
        {/* Date picker */}
        <View style={styles.datePickerContainer}>
          {dates.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateItem,
                isSelectedDate(date) && styles.selectedDateItem
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <ThemedText style={styles.dateDay}>{formatDay(date)}</ThemedText>
              <ThemedText style={styles.dateDayOfWeek}>{formatDayOfWeek(date)}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Tasks list */}
        <View style={styles.tasksContainer}>
          {tasksForSelectedDate.map(task => (
            <View key={task.id}>
              {renderTaskItem({ item: task })}
            </View>
          ))}
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateItem: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  selectedDateItem: {
    backgroundColor: '#26C6DA',
  },
  dateDay: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateDayOfWeek: {
    fontSize: 14,
  },
  tasksContainer: {
    gap: 16,
  },
  taskItem: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  taskTimeContainer: {
    padding: 8,
    paddingHorizontal: 16,
  },
  taskTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDate: {
    fontSize: 14,
  },
  taskContent: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
  },
  taskIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
  },
  taskStatusContainer: {
    marginLeft: 8,
  },
});