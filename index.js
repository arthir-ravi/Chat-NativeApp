import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background FCM message:', remoteMessage);
  
  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'New Message',
    body: remoteMessage.notification?.body || '',
    android: {
      channelId: 'default',
    },
  });
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { pressAction } = detail;
  if (type === EventType.ACTION_PRESS) {
    console.log('User tapped notification:', pressAction);
  }
});

AppRegistry.registerComponent(appName, () => App);
