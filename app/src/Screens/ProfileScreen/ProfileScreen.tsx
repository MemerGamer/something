import { ActivityIndicator, Image, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Column from '../../components/atoms/Column';
import H1 from '../../components/atoms/H1';
import Row from '../../components/atoms/Row';
import H2 from '../../components/atoms/H2';
import { useProfileScreenLogic } from './ProfileScreen.logic';
import Label from '../../components/atoms/Label';
import Spacer from '../../components/atoms/Spacer';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-remix-icon';
import H3 from '../../components/atoms/H3';
import ThingCard from '../../components/molecules/ThingCard';
import { Settings } from 'react-native-feather';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import ImageViewer from '../../components/molecules/ImageViewer';
import { MasonryFlashList } from '@shopify/flash-list';

type NonUndefined<T> = T extends undefined ? never : T;
interface GalleryItem {
  createdAt: string;
  imageUrl: string;
  thingId: string;
  isSocial: boolean;
}

const ProfileScreen = ({ navigation }: any) => {
  const styles = useThemedStyles();
  const logic = useProfileScreenLogic();

  const [opened, setOpened] = useState(true);

  useEffect(() => {
    logic.getData();
  }, []);

  function calculatePointPercentage(data: NonUndefined<typeof logic.profile>) {
    const percentage =
      ((data.level.currentScore - data.level.currentLevel.minThreshold) /
        (data.level.nextLevel.minThreshold - data.level.currentLevel.minThreshold)) *
      100;
    return percentage + 1;
  }

  if (!logic.profile) {
    return (
      <Column
        styles={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator size={'large'} />
      </Column>
    );
  }

  const renderButton = () => {
    return (
      <Column
        styles={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 15,
          backgroundColor: styles.accent.backgroundColor,
          borderRadius: 15,
          position: 'absolute',
          right: 16,
          top: 20
        }}
      >
        <Settings
          color={'white'}
          onPress={() => {
            navigation.push('Settings');
          }}
        />
      </Column>
    );
  };

  const handleImagePress = (item: { isSocial: boolean; thingId: any }) => {
    const thing = logic.profile?.things.find((t) => t.id === item.thingId);
    const streak = thing?.streak ?? 0; // Default to 0 if undefined

    if (item.isSocial) {
      navigation.navigate('SocialThingDetailsScreen', {
        thingId: item.thingId,
        userCount: streak // You might want to fetch this data
      });
    } else {
      navigation.navigate('Details', {
        thingId: item.thingId,
        streakCount: streak // You might need to fetch this data
      });
    }
  };

  return (
    <Column
      scrollable
      refreshing={logic.refreshing}
      getData={logic.getData}
      styles={{
        flex: 1,
        paddingTop: 30,
        paddingVertical: 20,
        paddingHorizontal: 23
      }}
    >
      <H1>
        Profile <H1 accent>Things</H1>
      </H1>
      {renderButton()}
      <Column
        styles={{
          borderColor: styles.column.borderColor,
          borderWidth: 1,
          borderRadius: 8,
          padding: 16,
          marginTop: 16,
          width: '100%'
        }}
      >
        <Row styles={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <H2>@{logic.user?.username}</H2>
          <Text>{logic.profile?.level.currentScore} points</Text>
        </Row>
        <Spacer space={10} />
        <Row
          styles={{
            alignItems: 'center',
            gap: 5,
            justifyContent: 'space-between'
          }}
        >
          <Row
            styles={{
              alignItems: 'center',
              gap: 5
            }}
          >
            <Text style={{ color: styles.text.color }}>
              {logic.profile?.level.currentLevel.name} ({logic.profile?.level.currentLevel.minThreshold})
            </Text>
          </Row>
          <Text style={{ color: styles.text.color }}>
            {logic.profile?.level.nextLevel.name} ({logic.profile?.level.nextLevel.minThreshold})
          </Text>
        </Row>
        <Column
          styles={{
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
              width: `${calculatePointPercentage(logic.profile)}%`,
              backgroundColor: styles.accent.backgroundColor,
              borderRadius: 20
            }}
          />
        </Column>
        <Spacer space={15} />
        {/* <Text>Badges</Text> */}
        {/* <Spacer space={10} /> */}
        <FlatList
          data={logic.profile?.badges}
          horizontal
          contentContainerStyle={{ gap: 10, flexGrow: 1 }}
          renderItem={({ item }) => {
            return (
              <Column
                styles={{
                  gap: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: styles.column.backgroundColor,
                  padding: 10,
                  borderRadius: 10,
                  borderColor: styles.column.borderColor,
                  borderWidth: 1
                }}
              >
                {item.icon ? (
                  <Icon name={item.icon as any} color={styles.text.color} />
                ) : (
                  <Text>No icon for this badge: {item.icon}</Text>
                )}
                <Label text={item.name} />
              </Column>
            );
          }}
        />
      </Column>
      <Pressable
        onPress={() => {
          navigation.push('Leaderboard');
        }}
      >
        <Column
          styles={{
            borderColor: styles.column.borderColor,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: opened ? 16 : 5,
            marginTop: 16,
            width: '100%'
          }}
        >
          <H3>
            See <H3 accent>leaderboard</H3>
          </H3>
        </Column>
      </Pressable>
      <Column
        styles={{
          borderColor: styles.column.borderColor,
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: opened ? 16 : 5,
          marginTop: 16,
          width: '100%'
        }}
      >
        <H3 accent>My Things</H3>
        {/* TODO:Fix two children with same key problem which occurs, because things are shared */}
        <FlatList
          scrollEnabled={false}
          keyExtractor={(item) => item.id.toString()}
          data={opened ? logic.profile?.things : logic.profile?.things.slice(0, 3)}
          style={{ marginTop: 16 }}
          contentContainerStyle={{ gap: 5 }}
          renderItem={({ item }) => (
            <ThingCard
              name={item.name}
              startTime={item.startTime}
              endTime={item.endTime}
              streak={item.streak}
              id={item.id}
              navigation={navigation}
            />
          )}
        />
      </Column>
      <Column
        styles={{
          borderColor: styles.column.borderColor,
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: opened ? 16 : 5,
          marginTop: 16,
          marginBottom: 20,
          width: '100%'
        }}
      >
        <H3 accent>My Memories</H3>
        {logic.galleryImages && logic.galleryImages.length > 0 ? (
          <MasonryFlashList
            key={logic.galleryImages.length}
            data={logic.galleryImages}
            extraData={logic.galleryImages}
            numColumns={3}
            estimatedItemSize={20} // Improves performance
            keyExtractor={(item, index) => `${item.thingId}-${index}`}
            // space between items
            renderItem={({ item, index }) => (
              <View style={[{ padding: 3, flex: 1 }]}>
                <TouchableOpacity onPress={() => handleImagePress(item)}>
                  <ImageViewer
                    uri={item.imageUrl}
                    username={logic.user?.username as string}
                    createdAt={item.createdAt}
                    simple={true}
                    style={{ height: 150, width: '100%' }}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={{ marginTop: 16, color: styles.text.color, textAlign: 'center', padding: 20 }}>
            No memories captured yet
          </Text>
        )}
      </Column>
    </Column>
  );
};

export default ProfileScreen;
