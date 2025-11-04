import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/api';
import notifee, { AndroidImportance } from '@notifee/react-native';

export async function createDefaultChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
  console.log('Notification channel created');
}

export async function requestFCMPermission(forceUpdate = false) {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted');
      await getFCMToken(forceUpdate);
    } else {
      console.log('Notification permission denied');
    }
  } catch (error) {
    console.error('Error requesting FCM permission:', error);
  }
}

export async function getFCMToken(forceUpdate = false) {
  try {
    const fcmToken = await messaging().getToken();
    if (!fcmToken) {
      console.warn('No FCM token received');
      return;
    }

    console.log('Received FCM token:', fcmToken);

    const savedToken = await AsyncStorage.getItem('fcmToken');
    const userToken = await AsyncStorage.getItem('token');

    if (forceUpdate || fcmToken !== savedToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
      console.log('Saving and sending FCM token to backend...');

      if (userToken) {
        await api.post(
          '/user/update-fcm',
          { fcmToken },
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        console.log('FCM token successfully updated on server');
      } else {
        console.warn('No user token found — cannot send to server');
      }
    } else {
      console.log('Token already up-to-date');
    }
  } catch (error) {
    console.error('Error fetching or updating FCM token:', error);
  }
}

export function listenForNotifications() {
  messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground message received:', remoteMessage);

    await notifee.displayNotification({
      title: remoteMessage.notification?.title || 'New Message',
      body: remoteMessage.notification?.body || 'You have a new notification',
      android: {
        channelId: 'default',
        pressAction: { id: 'default' },
      },
    });
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background message received:', remoteMessage);

    await notifee.displayNotification({
      title: remoteMessage.notification?.title || 'Background Message',
      body: remoteMessage.notification?.body || 'You received this in background',
      android: {
        channelId: 'default',
        pressAction: { id: 'default' },
      },
    });
  });
}
