import { createStackNavigator } from '@react-navigation/stack';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import BadgeDetailsScreen from '../../Screens/BadgeDetailsScreen/BadgeDetailsScreen';
import BadgeScreen from '../../Screens/BadgeScreen/BadgeScreen';

const BadgeStack = createStackNavigator();

export const BadgeStackNavigation = () => {
  const styles = useThemedStyles();

  return (
    <BadgeStack.Navigator
      screenOptions={{
        cardStyle: styles.container,
        headerShown: false
      }}
    >
      <BadgeStack.Screen name="Badges" component={BadgeScreen} />
      <BadgeStack.Screen name="BadgeDetailsScreen" component={BadgeDetailsScreen} />
    </BadgeStack.Navigator>
  );
};
