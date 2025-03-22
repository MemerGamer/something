import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { RootNavigation } from './src/navigation/RootNavigation';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { navigationRef } from './src/navigation/RootNavigation';
import { useFonts } from 'expo-font';
// import { usePushNotifications } from './src/hooks/notifications';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { ThemeContext, ThemeProvider } from './src/contexts/ThemeContext';
import { useThemedStyles } from './src/hooks/useThemedStyles';
import { useContext } from 'react';

function AppContent() {
  const styles = useThemedStyles();
  const { theme } = useContext(ThemeContext);
  console.info(`Theme: ${theme}`);

  const [fontsLoaded] = useFonts({
    'Cursive-Regular': require('./assets/fonts/CedarvilleCursive-Regular.ttf'),
    Caveat: require('./assets/fonts/Caveat-VariableFont_wght.ttf')
  });

  return (
    <>
      <StatusBar
        translucent={false}
        backgroundColor={styles.container.backgroundColor}
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />

      <SafeAreaView style={styles.container}>
        <Provider store={store}>
          <NavigationContainer ref={navigationRef}>
            <AlertNotificationRoot>
              <RootNavigation />
            </AlertNotificationRoot>
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
