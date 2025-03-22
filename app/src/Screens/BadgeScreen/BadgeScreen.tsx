import React, { useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import Icon from 'react-native-remix-icon';
import Label from '../../components/atoms/Label';
import Column from '../../components/atoms/Column';
import H1 from '../../components/atoms/H1';
import { useBadgeScreenLogic } from './BadgeScreen.logic';
import { MasonryFlashList } from '@shopify/flash-list';

const BadgeScreen = ({ navigation }: any) => {
  const styles = useThemedStyles();
  const logic = useBadgeScreenLogic();

  useEffect(() => {
    logic.getBadges();
  }, []);

  const renderBadgeItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('BadgeDetailsScreen', { badge: item })}>
      <Column
        styles={{
          gap: 5,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: styles.column.backgroundColor,
          padding: 10,
          borderRadius: 10,
          borderColor: item.earned ? styles.accent.backgroundColor : styles.column.borderColor,
          borderWidth: 1,
          width: 80
        }}
      >
        {item.icon ? (
          <Icon name={item.icon as any} color={item.earned ? styles.accent.backgroundColor : 'gray'} />
        ) : (
          <Text>No icon for this badge: {item.icon}</Text>
        )}
        {item.name.split(' ').map((word: string, index: number) => (
          <Label key={index} text={word} />
        ))}
      </Column>
    </TouchableOpacity>
  );

  return (
    <Column
      scrollable
      refreshing={logic.refreshing}
      getData={async () => {
        await logic.getBadges();
      }}
      styles={{
        flex: 1,
        paddingTop: 30,
        paddingVertical: 20,
        paddingHorizontal: 23
      }}
    >
      <H1>
        My <H1 accent>Badges</H1>
      </H1>

      {/* separator */}
      <View style={{ height: 25 }} />
      <MasonryFlashList
        data={logic.badges}
        numColumns={4}
        estimatedItemSize={100}
        keyExtractor={(item) => item.id.toString()}
        renderItem={(info) => <View style={[{ padding: 3, flex: 1 }]}>{renderBadgeItem(info)}</View>}
      />
    </Column>
  );
};

export default BadgeScreen;
