import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../api/api';
import { useNavigation } from '@react-navigation/native';
import { styles } from './style';

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        setCurrentUserId(userId);

        const res = await api.get('/user');
        const responseData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];
        const filteredUsers = responseData.filter((u: User) => u._id !== userId);
        setUsers(filteredUsers);
      } catch (err: any) {
        console.error('Fetch users error:', err);
        Alert.alert('Error', 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'userId']);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/image copy.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chats</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() =>
                navigation.navigate('ChatRoom', {
                  receiverId: item._id,
                  receiverName: item.name,
                })
              }
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.userName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No users found</Text>}
        />
      </View>
    </ImageBackground>
  );
}
