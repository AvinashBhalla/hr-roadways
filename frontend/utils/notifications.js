import * as Notifications from 'expo-notifications';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const scheduleWakeUpAlert = async (stopName, userName) => {
  if (Platform.OS === 'web') {
    console.log(`[WEB ALERT] Wake up, ${userName}! Your stop ${stopName} is next.`);
    alert(`Wake up, ${userName}! Your stop ${stopName} is next!`);
    return;
  }

  // 1. Push Notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Wake up! 🛑",
      body: `Your stop ${stopName} is next!`,
      data: { type: 'WAKE_UP' },
    },
    trigger: null, 
  });

  // 2. TTS
  const text = `Wake up, ${userName}! Your stop is next: ${stopName}.`;
  Speech.speak(text, { language: 'en', rate: 0.9 });
};
