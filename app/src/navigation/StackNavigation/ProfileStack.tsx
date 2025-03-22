import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../../Screens/ProfileScreen/ProfileScreen';
import Leaderboard from '../../Screens/Leaderboard/Leaderboard';
import ThingDetailsScreen from '../../Screens/ThingDetailsScreen/ThingDetailsScreen';
import SettingsScreen from '../../Screens/SettingsScreen/SettingsScreen';
import { BadgeStackNavigation } from './BadgeStackNavigation';
import BadgeScreen from '../../Screens/BadgeScreen/BadgeScreen';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import SocialThingDetailsScreen from '../../Screens/SocialThingDetailsScreen/SocialThingDetailsScreen';

const ProfileStack = createStackNavigator();

export const ProfileStackNavigation = () => {
  const styles = useThemedStyles();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        cardStyle: styles.container,
        headerShown: false
      }}
    >
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Leaderboard" component={Leaderboard} />
      <ProfileStack.Screen name="Details" component={ThingDetailsScreen} />
      <ProfileStack.Screen name="BadgeScreen" component={BadgeStackNavigation} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen name="SocialDetails" component={SocialThingDetailsScreen} />
    </ProfileStack.Navigator>
  );
};
