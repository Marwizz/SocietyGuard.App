import React, { useContext, useEffect } from 'react';
import { GuardContext, GuardProvider } from './src/GuardContext';
import MainNavigation from './src/navigation/MainNavigation';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a component for FCM handling to use context
const FCMHandler = () => {
  const { user } = useContext(GuardContext); // Assuming you have user context in GuardContext

  // Send FCM token to backend
  const sendTokenToBackend = async (token) => {
    try {
      // Check if user is logged in
      if (!user || !user._id) {
        // Store token locally to send later when user logs in
        await AsyncStorage.setItem('fcmToken', token);
        return;
      }

      console.log("Sending FCM token to backend for guard");

      const response = await fetch(`${process.env.API_BASE_URL}/auth/update-fcm-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` // If you use auth token
        },
        body: JSON.stringify({
          userId: user._id,
          token: token,
          isGuard: true // Set to true for guard users
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log('Guard FCM token updated successfully');
      } else {
        console.error('Failed to update guard FCM token:', result.message);
      }
    } catch (error) {
      console.error('Error updating guard FCM token:', error);
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  };

  useEffect(() => {
    const setup = async () => {
      // Request permission
      const enabled = await requestUserPermission();

      if (enabled) {
        console.log('Authorization status: enabled');
        
        // Get token and send to backend
        const token = await messaging().getToken();
        console.log('Guard FCM Token:', token);
        console.log('Guard User:', user);
        sendTokenToBackend(token);
        
        // Handle token refresh
        return messaging().onTokenRefresh(newToken => {
          console.log('Guard FCM token refreshed:', newToken);
          sendTokenToBackend(newToken);
        });
      } else {
        console.log('Permission not granted');
      }
    };

    setup();

    // Handle notifications
    const unsubscribeBackground = messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Handle notification that opened the app from background state
    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage.notification);
      // Navigate based on notification type
    });

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      
      // Show in-app notification
      Alert.alert(
        remoteMessage.notification?.title || 'New Notification',
        remoteMessage.notification?.body || 'You have a new notification',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.notification);
        // Navigate to appropriate screen based on notification type
        // navigation.navigate(...) if needed
      }
    });

    return () => {
      unsubscribeForeground();
      if (unsubscribeOpenedApp) {
        unsubscribeOpenedApp();
      }
      // Note: Background handlers don't need to be unsubscribed
    };
  }, [user]); // Re-run when user changes

  return null; // This component doesn't render anything
};

export default function App() {
  return (
    <GuardProvider>
      <FCMHandler />
      <MainNavigation />
    </GuardProvider>
  );
}