import React from 'react';
import { Text, View } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import Column from '../../components/atoms/Column';
import H1 from '../../components/atoms/H1';
import Icon from 'react-native-remix-icon';

const BadgeDetailsScreen = ({ route }: any) => {
  const styles = useThemedStyles();
  const { badge } = route.params;

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
    </Column>
  );
};

export default BadgeDetailsScreen;
