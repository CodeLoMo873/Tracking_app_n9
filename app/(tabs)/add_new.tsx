import { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AddNewGoalScreen() {
  // Fetch categories from API
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://192.168.69.105:3000/api/goal-types/all');
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setCategories(result.data.map(item => ({
            name: item.goal_type_name,
            icon: item.goal_type_icon,
            color: item.goal_type_color,
            iconType: item.icon_type,
            goal_type_id: item.goal_type_id,
          })));
        } else {
          setCategories([]);
        }
      } catch (error) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = (category) => {
    router.push({
      pathname: '/create-goal',
      params: { 
        goal_type_id: category.goal_type_id,
        color: category.color,
        goal_type_name: category.name // Pass the goal type name
      }
    });
  };

  const renderIcon = (category) => {
    const size = 40;
    switch(category.iconType) {
      case 'ionicons':
        return <Ionicons name={category.icon} size={size} color="white" />;
      case 'material':
        return <MaterialCommunityIcons name={category.icon} size={size} color="white" />;
      case 'font-awesome':
        return <FontAwesome5 name={category.icon} size={size} color="white" />;
      default:
        return <Ionicons name={category.icon} size={size} color="white" />;
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image/>}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Thêm mới mục tiêu</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.instructionContainer}>
        <ThemedText style={styles.instructionText}>
          Chọn loại mục tiêu bạn muốn thêm mới:
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category.goal_type_id || index}
            style={[styles.categoryCard, { backgroundColor: category.color }]}
            onPress={() => handleCategorySelect(category)}
          >
            <View style={styles.iconContainer}>
              {renderIcon(category)}
            </View>
            <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
            <Ionicons name="chevron-forward" size={24} color="white" style={styles.arrowIcon} />
          </TouchableOpacity>
        ))}
      </ThemedView>
      
      <ThemedView style={styles.tipContainer}>
        <Ionicons name="bulb-outline" size={24} color="#FFD166" style={styles.tipIcon} />
        <ThemedText style={styles.tipText}>
          Mẹo: Bạn có thể tạo mục tiêu hàng ngày, hàng tuần hoặc hàng tháng trong bước tiếp theo.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    backgroundColor: 'rgba(91, 185, 225, 0.5)',
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 10,
  },
  instructionContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 209, 102, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    fontSize: 14,
    flex: 1,
  },
});
