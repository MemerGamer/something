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
  const { theme, colors } = useContext(ThemeContext);

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
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background, // Ensure tab bar follows theme
          borderTopColor: theme === 'dark' ? '#444' : '#ccc'
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: theme === 'dark' ? '#aaa' : '#555'
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigation}
        options={({ route }) => ({
          tabBarStyle: (() => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';
            if (['Camera', 'CreateThing', 'Details', 'SetTime'].includes(routeName)) {
              return { display: 'none' };
            }
            return { backgroundColor: colors.background };
          })(),
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} />
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
            return { backgroundColor: colors.background };
          })(),
          title: 'Social',
          tabBarIcon: ({ color }) => <Users color={color} />
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
            return { backgroundColor: colors.background };
          })(),
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} />
        })}
      />
    </Tab.Navigator>
  );
};
