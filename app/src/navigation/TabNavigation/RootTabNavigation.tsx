import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStackNavigation } from '../StackNavigation/HomeStack';
import { useRootNavigationLogic } from '../RootNavigation.logic';
import SplashScreen from '../../Screens/SplashScreen/SplashScreen';
import { AuthStackNavigation } from '../StackNavigation/AuthStack';
import { Home, User, Users } from 'react-native-feather';
import { getFocusedRouteNameFromRoute } from '@react-navigation/core';
import { ProfileStackNavigation } from '../StackNavigation/ProfileStack';
import { useContext, useEffect } from 'react';
import { SocialStackNavigation } from '../StackNavigation/SocialStack';
import { ThemeContext } from '../../contexts/ThemeContext';

const Tab = createBottomTabNavigator();

export const RootTabNavigation = () => {
  const { loading, user, signInSilently } = useRootNavigationLogic();
  const { theme, colors, setAppMode } = useContext(ThemeContext);

  useEffect(() => {
    signInSilently();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <AuthStackNavigation />;
  }

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigation}
        options={({ route }) => ({
          tabBarStyle: (() => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';
            if (['Camera', 'CreateThing', 'Details', 'SetTime'].includes(routeName)) {
              return { display: 'none' };
            }
            return;
          })(),
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} />
        })}
      />
      <Tab.Screen
        name="SocialStack"
        component={SocialStackNavigation}
        options={({ route }) => ({
          tabBarStyle: (() => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';
            if (['Camera', 'CreateSocialThing', 'SocialDetails', 'SetSocialTime'].includes(routeName)) {
              return { display: 'none' };
            }
            return;
          })(),
          title: 'Social',
          tabBarIcon: ({ color, size }) => <Users color={color} />
        })}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigation}
        options={({ route }) => ({
          tabBarStyle: (() => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';
            if (['Leaderboard', 'Details'].includes(routeName)) {
              return { display: 'none' };
            }
            return;
          })(),
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} />
        })}
      />
    </Tab.Navigator>
  );
};
