/* eslint-disable no-alert */
import { useEffect, useRef, useState } from 'react';
import { AppState, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { defineTask } from 'expo-task-manager';
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  AndroidImportance,
  getExpoPushTokenAsync,
  getNotificationChannelsAsync,
  getPermissionsAsync,
  Notification,
  NotificationChannel,
  NotificationResponse,
  registerTaskAsync,
  removeNotificationSubscription,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
  Subscription,
  useLastNotificationResponse
} from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

const navigate = (name: string, params?: Record<string, any>) => {
  import('../navigation/RootNavigation').then((module) => {
    module.navigate(name, params);
  });
};

export async function getExpoPushToken() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification');
      return;
    }

    if (Platform.OS === 'android') {
      await setNotificationChannelAsync('default', {
        name: 'default',
        importance: AndroidImportance.MAX
      });

      console.log('Set notification channel');
    }

    token = await getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId
    });
  } else {
    alert('Must be using a physical device for Push notifications');
  }

  return token;
}

// https://github.com/expo/expo/tree/main/packages/expo-notifications#api
// setNotificationHandler -- sets the handler function responsible for deciding what to do with a notification that is received when the app is in foreground
// Foreground
setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

// Background task
// Reacts to data only notifications
// https://github.com/expo/expo/issues/29622#issuecomment-2166499879
// EXAMPLE: Send only "to" and "data" parameters
//  {
//    to: pushToken,
//    data: { someLocalData: 'goes here' },
//  }
// https://github.com/expo/expo/tree/main/packages/expo-notifications#handling-incoming-notifications-when-the-app-is-not-in-the-foreground-not-supported-in-expo-go
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';
defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  console.log(`${Platform.OS} BACKGROUND-NOTIFICATION-TASK: App in ${AppState.currentState} state.`);

  if (error) {
    console.log(`${Platform.OS} BACKGROUND-NOTIFICATION-TASK: Error! ${JSON.stringify(error)}`);

    return;
  }

  if (AppState.currentState.match(/inactive|background/) === null) {
    console.log(`${Platform.OS} BACKGROUND-NOTIFICATION-TASK: App not in background state, skipping task.`);

    return;
  }

  console.log(
    `${Platform.OS} BACKGROUND-NOTIFICATION-TASK: Received a notification in the background! ${JSON.stringify(
      data,
      null,
      2
    )}`
  );
});

// Background task
// Reacts to data only notifications
// https://github.com/expo/expo/issues/29622#issuecomment-2166499879
// EXAMPLE: Send only "to" and "data" parameters
//  {
//    to: pushToken,
//    data: { someLocalData: 'goes here' },
//  }
registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)
  .then(() => {
    console.log(`${Platform.OS} Notifications.registerTaskAsync success: ${BACKGROUND_NOTIFICATION_TASK}`);
  })
  .catch((reason) => {
    console.log(`${Platform.OS} Notifications registerTaskAsync failed: ${reason}`);
  });

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    console.log(`${Platform.OS} Set channel default setNotificationChannelAsync`);

    // https://github.com/expo/expo/tree/main/packages/expo-notifications#api
    // setNotificationChannelAsync -- saves a notification channel configuration
    if (Platform.OS === 'android') {
      await setNotificationChannelAsync('default', {
        name: 'default',
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C'
      });
    }
  }

  // https://github.com/expo/expo/tree/main/packages/expo-notifications#api
  // getPermissionsAsync -- fetches current permission settings related to notifications
  const { status: existingStatus } = await getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    // https://github.com/expo/expo/tree/main/packages/expo-notifications#api
    // requestPermissionsAsync -- requests permissions related to notifications
    const { status } = await requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    handleRegistrationError('Permission not granted to get push token for push notification!');
    return;
  }

  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

  if (!projectId) {
    handleRegistrationError('Project ID not found');
  }

  try {
    const pushTokenString =
      // https://github.com/expo/expo/tree/main/packages/expo-notifications#api
      // getExpoPushTokenAsync -- resolves with an Expo push token
      (
        await getExpoPushTokenAsync({
          projectId
        })
      ).data;

    console.log(`${Platform.OS} Got Expo push token ${pushTokenString}`);

    return pushTokenString;
  } catch (e: unknown) {
    handleRegistrationError(`${e}`);
  }
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [forceFcmv1, setForceFcmv1] = useState(false);
  const [notification, setNotification] = useState<Notification | undefined>(undefined);
  const [response, setResponse] = useState<NotificationResponse | undefined>(undefined);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    console.log(`${Platform.OS} Getting Expo Token with registerForPushNotificationsAsync`);
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    getNotificationChannelsAsync().then((value) => setChannels(value ?? []));
  }, []);

  useEffect(() => {
    // https://github.com/expo/expo/tree/main/packages/expo-notifications#api
    // addNotificationResponseReceivedListener -- adds a listener called whenever user interacts with a notification
    // Foreground & Background & Killed
    console.log(`${Platform.OS} Creating responseListener`);
    responseListener.current = addNotificationResponseReceivedListener((notificationResponse) => {
      setResponse(notificationResponse);
      const data = notificationResponse.notification.request.content.data;
      console.log('[Notifications responseListener] %s', JSON.stringify(data, null, 2));
      navigate('Camera', data);
    });

    console.log(`${Platform.OS} added listeners`);

    return () => {
      // https://github.com/expo/expo/tree/main/packages/expo-notifications#api
      // removeNotificationSubscription -- removes the listener registered with addNotificationReceivedListener()
      console.log(`${Platform.OS} Removing notificationListener`);
      notificationListener.current && removeNotificationSubscription(notificationListener.current);

      // https://github.com/expo/expo/tree/main/packages/expo-notifications#api
      // removeNotificationSubscription -- removes the listener registered with addNotification*Listener()
      console.log(`${Platform.OS} Removing responseListener`);
      responseListener.current && removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // https://github.com/expo/expo/tree/main/packages/expo-notifications#api
  // useLastNotificationResponse -- a React hook returning the most recently received notification response
  // Foreground & Background
  const lastNotificationResponse = useLastNotificationResponse();
  useEffect(() => {
    if (lastNotificationResponse === undefined || lastNotificationResponse === null) {
      console.log(
        `${Platform.OS} lastNotificationResponse is undefined or null [useLastNotificationResponse] ${JSON.stringify(lastNotificationResponse, null, 2)}`
      );

      return;
    }

    const data = lastNotificationResponse.notification.request.content.data;
    console.log('[Notifications lastNotificationResponse] %s', JSON.stringify(data, null, 2));
    if (data) {
      navigate('Camera', data);
    }
  }, [lastNotificationResponse]); // <!--- this bit is important

  // https://reactnative.dev/docs/appstate#basic-usage
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      console.log(`${Platform.OS} App state changed to ${nextAppState}`);
    });

    return () => {
      subscription.remove();
    };
  }, []);
};
