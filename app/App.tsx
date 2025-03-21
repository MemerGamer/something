import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StyleSheet } from 'react-native';
import { RootNavigation } from './src/navigation/RootNavigation';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { navigationRef } from './src/navigation/RootNavigation';
import { useFonts } from 'expo-font';
// import { usePushNotifications } from './src/hooks/notifications';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import {ThemeProvider } from './src/contexts/ThemeContext';
import { useThemedStyles } from './src/hooks/useThemedStyles';

export default function App() {
  // const { expoPushToken, notification, lastNotificationResponse } = usePushNotifications();
  const styles = useThemedStyles();

  const [fontsLoaded] = useFonts({
    'Cursive-Regular': require('./assets/fonts/CedarvilleCursive-Regular.ttf'),
    Caveat: require('./assets/fonts/Caveat-VariableFont_wght.ttf')
  });

  return (
    <SafeAreaView style={styles.container}>
      <Provider store={store}>
        <ThemeProvider>
          <NavigationContainer ref={navigationRef}>
            <AlertNotificationRoot>
              <RootNavigation />
            </AlertNotificationRoot>
          </NavigationContainer>
        </ThemeProvider>
      </Provider>
    </SafeAreaView>
  );
}