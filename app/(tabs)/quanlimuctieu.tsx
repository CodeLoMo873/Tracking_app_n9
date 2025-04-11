import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const categories = [
    { name: 'Sức khoẻ', icon: 'heart', color: '#FF6B6B', iconType: 'ionicons' },
    { name: 'Công việc', icon: 'briefcase', color: '#4ECDC4', iconType: 'ionicons' },
    { name: 'Tài chính', icon: 'wallet', color: '#FFD166', iconType: 'ionicons' },
    { name: 'Học tập', icon: 'book', color: '#6A0572', iconType: 'font-awesome' },
    { name: 'Sở thích', icon: 'gamepad-variant', color: '#1A535C', iconType: 'material' },
  ];

  const handleCategoryPress = (category) => {
    // Navigate to category detail page (to be implemented)
    console.log(`Navigate to ${category} goals`);
  };

  const renderIcon = (category) => {
    const size = 32;
    
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
          <TouchableOpacity 
            key={index}
            style={[styles.categoryBox, { backgroundColor: category.color }]}
            onPress={() => handleCategoryPress(category.name)}
          >
            <ThemedView style={styles.iconContainer}>
              {renderIcon(category)}
            </ThemedView>
            <ThemedView style={styles.textContainer}>
              <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
              <ThemedText style={styles.goalCount}>0 mục tiêu</ThemedText>
            </ThemedView>
            <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  categoryBox: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
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
});
