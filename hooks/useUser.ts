import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserData = {
  user_name: string;
  user_code: string;
  _id: number;
};

export function useUser() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          setUserData(JSON.parse(userDataString));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  // Add this function to set and persist user data
  const setUser = async (user: UserData | null) => {
    if (user) {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      setUserData(user);
    } else {
      await AsyncStorage.removeItem('userData');
      setUserData(null);
    }
  };

  return { userData, loading, setUser };
}