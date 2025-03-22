import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../Screens/LoginScreen/LoginScreen';
import RegisterScreen from '../../Screens/RegisterScreen/RegisterScreen';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';

const AuthStack = createStackNavigator();

export const AuthStackNavigation = () => {
  const styles = useThemedStyles();
  return (
    <AuthStack.Navigator
      screenOptions={{
        cardStyle: styles.container,
        headerShown: false
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};
