import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from '../../Screens/CameraScreen/CameraScreen';
import SocialThings from '../../Screens/SocialThings/SocialThings';
import CreateSocialThingScreen from '../../Screens/CreateSocialThingScreen/CreateSocialThingScreen';
import SetSocialTimeIntervals from '../../Screens/CreateSocialThingScreen/SetSocialTimeIntervals';
import SocialThingDetailsScreen from '../../Screens/SocialThingDetailsScreen/SocialThingDetailsScreen';
import { useTheme } from '../../hooks/hooks';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import JoinSocialThingScreen from '../../Screens/JoinSocialThingScreen/JoinSocialThingScreen';

const HomeStack = createStackNavigator();

export const SocialStackNavigation = () => {
  const styles = useThemedStyles();

  return (
    <HomeStack.Navigator
      screenOptions={{
        cardStyle: styles.container,
        headerShown: false
      }}
    >
      <HomeStack.Screen name="SocialThings" component={SocialThings} />
      <HomeStack.Screen name="JoinSocialThing" component={JoinSocialThingScreen} />
      <HomeStack.Screen name="SetSocialTime" component={SetSocialTimeIntervals} />
      <HomeStack.Screen name="Camera" component={CameraScreen} />
      <HomeStack.Screen name="SocialDetails" component={SocialThingDetailsScreen} />
    </HomeStack.Navigator>
  );
};
