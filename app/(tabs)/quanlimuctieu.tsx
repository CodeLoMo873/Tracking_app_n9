import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router'; // Add this import
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  // Fetch categories from API instead of using hardcoded array
  const [categories, setCategories] = useState([]);
  const [goalCounts, setGoalCounts] = useState({}); // { [goal_type_id]: count }

  const fetchCategoriesAndCounts = async () => {
    try {
      const response = await fetch('http://192.168.69.105:3000/api/goal-types/all');
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const mappedCategories = result.data.map(item => ({
          name: item.goal_type_name,
          icon: item.goal_type_icon,
          color: item.goal_type_color,
          iconType: item.icon_type,
          goal_type_id: item.goal_type_id,
        }));
        setCategories(mappedCategories);

        // Fetch goal counts for each category
        mappedCategories.forEach(async (cat) => {
          try {
            const res = await fetch(`http://192.168.69.105:3000/api/goals/type/${cat.goal_type_id}`);
            const data = await res.json();
            setGoalCounts(prev => ({
              ...prev,
              [cat.goal_type_id]: data.count ?? 0
            }));
          } catch {
            setGoalCounts(prev => ({
              ...prev,
              [cat.goal_type_id]: 0
            }));
          }
        });
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategoriesAndCounts();
    }, [])
  );

  const handleCategoryPress = (category) => {
    // Pass goal_type_id, color, and goal_type_name
    router.navigate({
      pathname: '/goal-list',
      params: { 
        goal_type_id: category.goal_type_id, 
        color: category.color,
        goal_type_name: category.name // Pass the name
      }
    });
  };

  const handleStatsPress = (category) => {
    router.navigate({
      pathname: '/goal-stats',
      params: { goal_type_id: category.goal_type_id }
    });
  };

  const renderIcon = (category) => {
    const size = 50;
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
        <ThemedText type="title">Quản lí mục tiêu</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <View key={category.goal_type_id || index} style={styles.categoryWrapper}>
            <View style={[styles.categoryBox, { backgroundColor: category.color }]}>
              <View style={styles.categoryContent}>
                <ThemedView style={styles.iconContainer}>
                  {renderIcon(category)}
                </ThemedView>
                <ThemedView style={styles.textContainer}>
                  <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
                  <ThemedText style={styles.goalCount}>
                    {goalCounts[category.goal_type_id] ?? 0} mục tiêu
                  </ThemedText>
                </ThemedView>
              </View>
              
              <View style={styles.categoryContent}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleStatsPress(category)} // Pass the whole category object to get goal_type_id
                >
                  <Ionicons name="stats-chart" size={24} color="white" />
                  <ThemedText style={styles.actionButtonText}>Thống kê</ThemedText>
                </TouchableOpacity>                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleCategoryPress(category)} // Pass goal_type_id and color
                >
                  <Ionicons name="list" size={24} color="white" />
                  <ThemedText style={styles.actionButtonText}>Chi tiết</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
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
    marginBottom: 5,
    backgroundColor: 'rgba(91, 185, 225, 0.5)',
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 10,
  },
  categoriesContainer: {
    paddingHorizontal: 0,
    gap: 5,
  },
  categoryWrapper: {
    marginBottom: 10,
  },
  categoryBox: {
    width: '100%',
    borderRadius: 16,
    padding: 0,
    marginBottom: 8,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  goalCount: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: '48%',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
