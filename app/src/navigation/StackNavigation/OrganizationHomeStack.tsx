import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../Screens/HomeScreen/HomeScreen';
import CreateThingScreen from '../../Screens/CreateThingScreen/CreateThingScreen';
import SetTimeIntervals from '../../Screens/CreateThingScreen/SetTimeIntervals';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import SocialThingDetailsScreen from '../../Screens/SocialThingDetailsScreen/SocialThingDetailsScreen';
import OrganizationThings from '../../Screens/OrganizationThings/OrganizationThings';
import CameraScreen from '../../Screens/CameraScreen/CameraScreen';
import CreateSocialThingScreen from '../../Screens/CreateSocialThingScreen/CreateSocialThingScreen';
import SetSocialTimeIntervals from '../../Screens/CreateSocialThingScreen/SetSocialTimeIntervals';

const OrganizationHomeStack = createStackNavigator();

export const OrganizationHomeStackNavigation = () => {
  const styles = useThemedStyles();
  return (
    <OrganizationHomeStack.Navigator
      screenOptions={{
        cardStyle: styles.container,
        headerShown: false
      }}
    >
      <OrganizationHomeStack.Screen name="Home" component={OrganizationThings} />
      <OrganizationHomeStack.Screen name="CreateSocialThing" component={CreateSocialThingScreen} />
      <OrganizationHomeStack.Screen name="SetSocialTime" component={SetSocialTimeIntervals} />
      <OrganizationHomeStack.Screen name="SocialDetails" component={SocialThingDetailsScreen} />
      <OrganizationHomeStack.Screen name="Camera" component={CameraScreen} />
    </OrganizationHomeStack.Navigator>
  );
};
