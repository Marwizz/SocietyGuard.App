import React, { useContext, useEffect, useState } from 'react';
import { GuardContext, GuardProvider } from './src/GuardContext';
import MainNavigation from './src/navigation/MainNavigation';
import messaging from '@react-native-firebase/messaging';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';

// Custom Notification Component
const FancyNotification = ({ title, body, onClose, onPress }) => {
  const slideAnim = new Animated.Value(-100);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    // Animation to slide in
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      dismissNotification();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const dismissNotification = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  };

  return (
    <Animated.View
      style={[
        styles.notificationContainer,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.notificationContent}
        onPress={() => {
          if (onPress) onPress();
          dismissNotification();
        }}
      >
        <View style={styles.iconContainer}>
          <View style={styles.icon}>
            <AntDesign name="notification" size={24} color="#78350F" />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={dismissNotification}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// NotificationManager to handle showing notifications
const NotificationManager = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (title, body) => {
    setNotification({ title, body });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return {
    showNotification,
    hideNotification,
    NotificationComponent: () => 
      notification ? (
        <FancyNotification
          title={notification.title}
          body={notification.body}
          onClose={hideNotification}
        />
      ) : null,
  };
};

// Create a component for FCM handling to use context
const FCMHandler = () => {
  const { user } = useContext(GuardContext);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

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

  // Show fancy in-app notification
  const showFancyNotification = (title, body) => {
    setCurrentNotification({ title, body });
    setNotificationVisible(true);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      setNotificationVisible(false);
    }, 5000);
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
      
      // Show fancy in-app notification instead of default Alert
      showFancyNotification(
        remoteMessage.notification?.title || 'New Notification',
        remoteMessage.notification?.body || 'You have a new notification'
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

  // Return the fancy notification component if it's visible
  return notificationVisible && currentNotification ? (
    <FancyNotification
      title={currentNotification.title}
      body={currentNotification.body}
      onClose={() => setNotificationVisible(false)}
      onPress={() => {
        // Handle notification press - e.g., navigate to a specific screen
        console.log('Notification pressed');
        setNotificationVisible(false);
      }}
    />
  ) : null;
};

// Styles for the fancy notification
const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  notificationContent: {
    flexDirection: 'row',
    backgroundColor: '#EAB308', // Yellow color you requested
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7', // Light yellow background for icon
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#78350F', // Dark brown color for better contrast on yellow
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: '#451A03', // Darker brown for body text
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEF3C7', // Light yellow background for close button
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#78350F', // Dark brown color for better contrast
    lineHeight: 20,
  },
});

export default function App() {
  return (
    <GuardProvider>
      <FCMHandler />
      <MainNavigation />
    </GuardProvider>
  );
}