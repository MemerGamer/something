import React from 'react';
import { Text, View } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import Column from '../../components/atoms/Column';
import H1 from '../../components/atoms/H1';
import Icon from 'react-native-remix-icon';

const BadgeDetailsScreen = ({ route }: any) => {
  const styles = useThemedStyles();
  const { badge } = route.params;

  const calculatePointPercentage = (progress: any) => {
    // If the badge is already earned, return 100%
    console.log('badge.progress', progress);
    if (progress === 1) {
      return 100;
    }

    // If there's no progress data, return 0%
    if (!progress) {
      return 0;
    }

    const required = 1;

    // Ensure we don't exceed 100% or go below 0%
    const percentage = Math.min(100, Math.max(0, (progress / required) * 100));

    // Return percentage, default to 0 if it's NaN
    return isNaN(percentage) ? 0 : percentage;
  };

  // Calculate the width percentage as a number
  const progressWidth = calculatePointPercentage(badge.progress);

  return (
    <Column
      styles={{
        flex: 1,
        paddingTop: 30,
        paddingVertical: 20,
        paddingHorizontal: 23
      }}
    >
      <H1>{badge.name}</H1>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20
        }}
      >
        {badge.icon ? (
          <Icon name={badge.icon as any} color={badge.earned ? styles.accent.backgroundColor : 'gray'} size={100} />
        ) : (
          <Text>No icon for this badge: {badge.icon}</Text>
        )}
      </View>
      <Text style={{ marginTop: 20, textAlign: 'center', color: styles.text.color }}>{badge.description}</Text>
      {/* Progress bar */}
      <Column
        styles={{
          marginTop: 20,
          width: '100%',
          height: 5,
          backgroundColor: styles.column.backgroundColor,
          borderRadius: 20,
          alignItems: 'flex-start',
          justifyContent: 'center'
        }}
      >
        <Column
          styles={{
            height: '100%',
            width: `${progressWidth}%`,
            backgroundColor: styles.accent.backgroundColor,
            borderRadius: 20
          }}
        />
      </Column>

      {/* Optional: Display progress text */}
      {badge.progress !== undefined && !badge.earned && (
        <Text style={{ marginTop: 10, textAlign: 'center', color: styles.text.color }}>
          Progress: {Math.round(badge.progress * 100)}%
        </Text>
      )}

      {badge.earned && (
        <Text style={{ marginTop: 10, textAlign: 'center', color: styles.accent.backgroundColor }}>Badge Earned!</Text>
      )}
    </Column>
  );
};

export default BadgeDetailsScreen;
