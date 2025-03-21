import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import Column from '../../components/atoms/Column';
import { useThingDetailsScreenLogic } from './SocialThingDetailsScreen.logic';
import Row from '../../components/atoms/Row';
import H1 from '../../components/atoms/H1';
import StreakChip from '../../components/atoms/StreakChip';
import H3 from '../../components/atoms/H3';
import H4 from '../../components/atoms/H4';
import { ChevronLeft, ChevronsLeft } from 'react-native-feather';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import ImageViewer from '../../components/molecules/ImageViewer';
import MyButton from '../../components/molecules/MyButton';
import { useThemedStyles } from '../../hooks/useThemedStyles';

const SocialThingDetailsScreen = ({ route, navigation }: any) => {
  const styles = useThemedStyles();
  const { getDetails, thing, refreshing } = useThingDetailsScreenLogic();
  const { thingId, userCount } = route.params;

  useEffect(() => {
    getDetails(thingId);
  }, [thingId]);

  if (!thing) {
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

  return (
    <Column
      scrollable
      refreshing={refreshing}
      getData={() => getDetails(thingId)}
      styles={{
        flex: 1,
        gap: 32,
        paddingTop: 30,
        paddingVertical: 20,
        paddingHorizontal: 23
      }}
    >
      <Row
        styles={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <H1>{thing.name}</H1>
      </Row>
      {thing.description && (
        <Column
          styles={{
            gap: 10
          }}
        >
          <H4>Description</H4>
          <Text>{thing.description}</Text>
        </Column>
      )}

      <Column
        styles={{
          gap: 10
        }}
      >
        <H4>People</H4>
        {thing.sharedWith.map((shared) => (
          <Column
            key={shared}
            styles={{
              paddingHorizontal: 10,
              paddingVertical: 8,
              backgroundColor: styles.accent.backgroundColor,
              borderRadius: 10,
              width: 'auto',
              alignSelf: 'flex-start'
            }}
          >
            <H3 key={shared} white>
              @{shared}
            </H3>
          </Column>
        ))}
      </Column>
      <Column>
        <Row
          styles={{
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <H4>Memories</H4>
          <MyButton
            smalltext
            icon
            accent
            text={'New'}
            onPress={() => {
              navigation.navigate('Camera', {
                name: thing.name,
                uuid: thingId
              });
            }}
          />
        </Row>
        <Column>
          <FlatList
            scrollEnabled={false}
            data={thing.images}
            keyExtractor={(item, index) => index.toString() + new Date()}
            style={{
              marginTop: 20
            }}
            contentContainerStyle={{
              gap: 16
            }}
            renderItem={({ item, index }) => (
              <ImageViewer
                key={index.toString()}
                uri={item.image}
                username={item.username}
                createdAt={item.createdAt}
              />
            )}
          />
        </Column>
      </Column>
    </Column>
  );
};

export default SocialThingDetailsScreen;
