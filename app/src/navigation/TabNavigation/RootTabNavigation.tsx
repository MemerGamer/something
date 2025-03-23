// RootTabNavigation.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStackNavigation } from '../StackNavigation/HomeStack';
import { useRootNavigationLogic } from '../RootNavigation.logic';
import SplashScreen from '../../Screens/SplashScreen/SplashScreen';
import { AuthStackNavigation } from '../StackNavigation/AuthStack';
import { Home, User, Users } from 'react-native-feather';
import { getFocusedRouteNameFromRoute, Route } from '@react-navigation/core';
import { ProfileStackNavigation } from '../StackNavigation/ProfileStack';
import { useContext, useEffect, useState } from 'react';
import { SocialStackNavigation } from '../StackNavigation/SocialStack';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useProfileScreenLogic } from '../../Screens/ProfileScreen/ProfileScreen.logic';
import { OrganizationHomeStackNavigation } from '../StackNavigation/OrganizationHomeStack';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { authSelector } from '../../redux/auth/AuthSlice';
import ApiService from '../../services/ApiService';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

export const RootTabNavigation = () => {
  const { t } = useTranslation();
  const { loading, user, userType, signInSilently } = useRootNavigationLogic();
  const { theme, colors } = useContext(ThemeContext);

  useEffect(() => {
    signInSilently();
  }, []);

  if (loading && !user) {
    return <SplashScreen />;
  }

  if (!user) {
    return <AuthStackNavigation />;
  }

  // Common tab bar style function
  const getTabBarStyle = (route: Partial<Route<string>>, hiddenRoutes: string[]) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    if (hiddenRoutes.includes(routeName)) {
      return { display: 'none' as const };
    }
    return { backgroundColor: colors.background, borderTopColor: theme === 'dark' ? '#444' : '#ccc' };
  };

  // Screen options common for all tabs
  const screenOptions = {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: colors.background,
      borderTopColor: theme === 'dark' ? '#444' : '#ccc'
    },
    tabBarActiveTintColor: colors.accent,
    tabBarInactiveTintColor: theme === 'dark' ? '#aaa' : '#555'
  };

  // Only conditionally render Home tab if we know the user type
  // If userType is still loading/null, show all tabs as default
  const isOrganization = userType === 'organization';

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      {!isOrganization ? (
        <>
          <Tab.Screen
            name="HomeStack"
            component={HomeStackNavigation}
            options={({ route }) => ({
              tabBarStyle: getTabBarStyle(route, ['Camera', 'CreateThing', 'Details', 'SetTime']),
              title: t('Home'),
              tabBarIcon: ({ color }) => <Home color={color} />
            })}
          />
          <Tab.Screen
            name="SocialStack"
            component={SocialStackNavigation}
            options={({ route }) => ({
              tabBarStyle: getTabBarStyle(route, ['Camera', 'CreateSocialThing', 'SocialDetails', 'SetSocialTime']),
              title: t('Social'),
              tabBarIcon: ({ color }) => <Users color={color} />
            })}
          />
          <Tab.Screen
            name="ProfileStack"
            component={ProfileStackNavigation}
            options={({ route }) => ({
              tabBarStyle: getTabBarStyle(route, ['Leaderboard', 'Details', 'BadgeScreen']),
              title: t('Profile'),
              tabBarIcon: ({ color }) => <User color={color} />
            })}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="SocialStack"
            component={OrganizationHomeStackNavigation}
            options={({ route }) => ({
              tabBarStyle: getTabBarStyle(route, ['Camera', 'CreateSocialThing', 'SocialDetails', 'SetSocialTime']),
              title: t('Home'),
              tabBarIcon: ({ color }) => <Home color={color} />
            })}
          />
          <Tab.Screen
            name="ProfileStack"
            component={ProfileStackNavigation}
            options={({ route }) => ({
              tabBarStyle: getTabBarStyle(route, ['Leaderboard', 'Details', 'BadgeScreen']),
              title: t('Profile'),
              tabBarIcon: ({ color }) => <User color={color} />
            })}
          />
        </>
      )}
    </Tab.Navigator>
  );
};
