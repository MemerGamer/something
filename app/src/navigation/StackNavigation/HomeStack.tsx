import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../Screens/HomeScreen/HomeScreen';
import CreateThingScreen from '../../Screens/CreateThingScreen/CreateThingScreen';
import SetTimeIntervals from '../../Screens/CreateThingScreen/SetTimeIntervals';
import CameraScreen from '../../Screens/CameraScreen/CameraScreen';
import ThingDetailsScreen from '../../Screens/ThingDetailsScreen/ThingDetailsScreen';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';

const HomeStack = createStackNavigator();

export const HomeStackNavigation = () => {
  const styles = useThemedStyles();
  return (
    <HomeStack.Navigator
      screenOptions={{
        cardStyle: styles.container,
        headerShown: false
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="CreateThing" component={CreateThingScreen} />
      <HomeStack.Screen name="SetTime" component={SetTimeIntervals} />
      <HomeStack.Screen name="Camera" component={CameraScreen} />
      <HomeStack.Screen name="Details" component={ThingDetailsScreen} />
    </HomeStack.Navigator>
  );
};
