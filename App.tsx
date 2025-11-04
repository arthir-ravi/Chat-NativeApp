import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createDefaultChannel,
  listenForNotifications,
  requestFCMPermission,
} from './src/firebase/firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/authentication/LoginScreen';
import RegisterScreen from './src/screens/authentication/RegisterScreen';
import ChatScreen from './src/screens/ChatScreen/ChatScreen';
import ChatRoom from './src/screens/ChatRoom/ChatRoom';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      await createDefaultChannel();
      listenForNotifications();

      const token = await AsyncStorage.getItem('token');

      if (token) {
        console.log('🔑 User already logged in');
        await requestFCMPermission(true);
        setInitialRoute('ChatList');
      } else {
        console.log('🚪 No token found — going to login');
        setInitialRoute('Login');
      }
    };

    init();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ChatList" component={ChatScreen} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
