import React, { useContext, useEffect, useState } from "react";
import { GuardContext, GuardProvider } from "./src/GuardContext";
import MainNavigation from "./src/navigation/MainNavigation";
import messaging from "@react-native-firebase/messaging";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Platform,
  AppState,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Audio, InterruptionModeAndroid,
  InterruptionModeIOS, } from 'expo-av';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

// Define a background task identifier
const BACKGROUND_NOTIFICATION_TASK = 'background-notification-task';

// Register the task that will handle background notifications
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Background task error:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
  
  // Play sound in background if there's notification data
  if (data && data.notification) {
    await playBackgroundSound();
  }
  
  return BackgroundFetch.BackgroundFetchResult.NewData;
});
const setupAudioMode = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      // Use numeric values for interruption modes as a safer approach
      interruptionModeIOS: 1, // DUCK_OTHERS = 1, DO_NOT_MIX = 2, MIX_WITH_OTHERS = 0
      shouldDuckAndroid: true,
      interruptionModeAndroid: 1, // DUCK_OTHERS = 1, DO_NOT_MIX = 2, MIX_WITH_OTHERS = 0
      playThroughEarpieceAndroid: true,
    });
    console.log("Audio mode configured successfully");
  } catch (error) {
    console.error("Error configuring audio mode:", error);
  }
};
// Function to play sound in background
const playBackgroundSound = async () => {
  try {
    // Configure audio first
    await setupAudioMode();
    
    // Then play the sound
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/notification1.mp3'),
      { shouldPlay: true }
    );
    
    // Unload sound after playing to prevent memory leaks
    sound.setOnPlaybackStatusUpdate(status => {
      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('Error playing background sound:', error);
  }
};

// Register background fetch task (for iOS)
async function registerBackgroundFetchAsync() {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
      minimumInterval: 60, // minimum 60 seconds between fetches
      stopOnTerminate: false, // continue in background
      startOnBoot: true, // auto-start on device boot
    });
    console.log("Background fetch task registered");
  } catch (err) {
    console.log("Background fetch registration error:", err);
  }
}

// Configure notifications for background behavior
async function configureNotifications() {
  // Set notification handler for when app is in background
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  
  // Configure notification categories or channels
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FFCC00',
      sound: './assets/notification1.mp3', // Reference sound file
      enableVibrate: true,
    });
  }
}

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

    
    const timer = setTimeout(() => {
      dismissNotification();
    }, 10000);

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
      </TouchableOpacity>
    </Animated.View>
  );
};

// FCMHandler component
const FCMHandler = () => {
  const { user } = useContext(GuardContext);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [sound, setSound] = useState();
  const [appState, setAppState] = useState(AppState.currentState);

  // Send FCM token to backend
  const sendTokenToBackend = async (token) => {
    try {
      // Check if user is logged in
      if (!user || !user._id) {
        // Store token locally to send later when user logs in
        await AsyncStorage.setItem("fcmToken", token);
        return;
      }

      console.log("Sending FCM token to backend for guard");

      // Store device identifier to associate with the token
      let deviceId = await AsyncStorage.getItem("deviceId");
      if (!deviceId) {
        // Generate a unique device ID if not exists
        const newDeviceId = `device_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 9)}`;
          deviceId = newDeviceId;
        await AsyncStorage.setItem("deviceId", newDeviceId);
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/auth/update-fcm-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`, // If you use auth token
          },
          body: JSON.stringify({
            userId: user._id,
            token: token,
            deviceId: deviceId,
            isGuard: true, // Set to true for guard users
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        console.log("Guard FCM token updated successfully");
      } else {
        console.error("Failed to update guard FCM token:", result.message);
      }
    } catch (error) {
      console.error("Error updating guard FCM token:", error);
    }
  };

  const requestUserPermission = async () => {
    // Request Firebase messaging permission
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
    // Also request Expo notification permissions
    await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });

    return enabled;
  };

  // Play notification sound
  const playNotificationSound = async () => {
    try {
      // Configure audio for foreground playback
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: InterruptionModeIOS.DuckOthers,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        playThroughEarpieceAndroid: true,
      });
      
      // Load and play sound
      const { sound: notificationSound } = await Audio.Sound.createAsync(
        require('./assets/notification1.mp3')
      );
      
      setSound(notificationSound);
      await notificationSound.playAsync();
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  // Configure notification handling in background
  useEffect(() => {
    // App state change handler
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground, check for notifications
        console.log('App has come to the foreground!');
      }
      setAppState(nextAppState);
    };
    
    // Subscribe to app state changes
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Register background tasks and configure notifications
    const setupBackgroundTasks = async () => {
      await configureNotifications();
      
      // Register background fetch task (mainly for iOS)
      if (Platform.OS === 'ios') {
        await registerBackgroundFetchAsync();
      }
    };
    
    setupBackgroundTasks();
    
    return () => {
      appStateSubscription.remove();
    };
  }, [appState]);
  
  // Clean up function for sound
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Show fancy in-app notification
  const showFancyNotification = (title, body) => {
    setCurrentNotification({ title, body });
    setNotificationVisible(true);
    
    // Play notification sound
    playNotificationSound();

    // Auto hide after 5 seconds
    setTimeout(() => {
      setNotificationVisible(false);
    }, 5000);
  };

  useEffect(() => {
    const setup = async () => {
      // Initialize audio
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS:InterruptionModeIOS.DuckOthers,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      });
      
      // Request permission
      const enabled = await requestUserPermission();

      if (enabled) {
        console.log("Authorization status: enabled");

        // Get token and send to backend
        const token = await messaging().getToken();
        console.log("Guard FCM Token:", token);
        console.log("Guard User:", user);
        sendTokenToBackend(token);

        // Handle token refresh
        return messaging().onTokenRefresh((newToken) => {
          console.log("Guard FCM token refreshed:", newToken);
          sendTokenToBackend(newToken);
        });
      } else {
        console.log("Permission not granted");
      }
    };

    setup();

    // Configure Firebase handling for background messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
      
      // Play sound even when app is in background
      await playBackgroundSound();
      
      // Trigger background task with notification data
      BackgroundFetch.scheduleTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
        notification: remoteMessage.notification,
      });
      
      // Create local notification that will play sound in background
      if (Platform.OS === 'android') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: remoteMessage.notification?.title || "New Notification",
            body: remoteMessage.notification?.body || "You have a new notification",
            sound: 'notification1.mp3', // Reference audio file
            priority: Notifications.AndroidNotificationPriority.MAX,
          },
          trigger: null,
        });
      }
    });

    // Handle notification that opened the app from background state
    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log(
          "Notification caused app to open from background state:",
          remoteMessage.notification
        );
        // Navigate based on notification type
      }
    );

    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage) => {
        console.log("A new FCM message arrived!", remoteMessage);

        // Show fancy in-app notification
        showFancyNotification(
          remoteMessage.notification?.title || "New Notification",
          remoteMessage.notification?.body || "You have a new notification"
        );
      }
    );

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });

    return () => {
      unsubscribeForeground();
      if (unsubscribeOpenedApp) {
        unsubscribeOpenedApp();
      }
    };
  }, [user]);

  // Return the fancy notification component if it's visible
  return notificationVisible && currentNotification ? (
    <FancyNotification
      title={currentNotification.title}
      body={currentNotification.body}
      onClose={() => setNotificationVisible(false)}
      onPress={() => {
        console.log("Notification pressed");
        setNotificationVisible(false);
      }}
    />
  ) : null;
};

// Styles for the fancy notification
const styles = StyleSheet.create({
  notificationContainer: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  notificationContent: {
    flexDirection: "row",
    backgroundColor: "#EAB308", // Yellow color you requested
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF3C7", // Light yellow background for icon
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000", // Dark brown color for better contrast on yellow
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: "#000", // Darker brown for body text
  },
});

export default function App() {
  // Initialize background notification setup when app first launches
  useEffect(() => {
    const setupInitialConfig = async () => {
      // Request all necessary permissions at app startup
      try {
        // Request notification permissions early
        await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
        });

        // For iOS, set these badge-related settings
        await Notifications.setBadgeCountAsync(0);
        
        // Configure initial audio settings
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS:InterruptionModeIOS.DuckOthers,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          playThroughEarpieceAndroid: true,
        });
        
        // Set up notification channels for Android
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FFCC00',
            sound: './assets/notification1.mp3',
            enableVibrate: true,
          });
        }
      } catch (error) {
        console.error('Error setting up initial notification config:', error);
      }
    };
    
    setupInitialConfig();
  }, []);

  return (
    <GuardProvider>
      <FCMHandler />
      <MainNavigation />
    </GuardProvider>
  );
}