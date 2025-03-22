import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import Column from '../../components/atoms/Column';
import { useThingDetailsScreenLogic } from './ThingDetailsScreen.logic';
import Row from '../../components/atoms/Row';
import H1 from '../../components/atoms/H1';
import StreakChip from '../../components/atoms/StreakChip';
import H3 from '../../components/atoms/H3';
import H4 from '../../components/atoms/H4';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import ImageViewer from '../../components/molecules/ImageViewer';
import MyButton from '../../components/molecules/MyButton';
import { DateTime } from 'luxon';
import { useThemedStyles } from '../../hooks/useThemedStyles';

const ThingDetailsScreen = ({ route, navigation }: any) => {
  const styles = useThemedStyles();
  const { getDetails, thing, refreshing } = useThingDetailsScreenLogic();
  const { thingId, streakCount } = route.params;

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

  const scheduleText = () => {
    if (!thing?.schedule) {
      return 'Not set';
    }

    const startTime = DateTime.fromFormat(thing!.schedule!.startTime, 'hh:mm:ss', { zone: 'utc' })
      .toLocal()
      .toLocaleString({ hour: 'numeric', minute: 'numeric' });
    const endTime = DateTime.fromFormat(thing!.schedule!.endTime, 'hh:mm:ss', { zone: 'utc' })
      .toLocal()
      .toLocaleString({ hour: 'numeric', minute: 'numeric' });

    if (thing?.schedule.repeat === 'once') {
      const readableDate = DateTime.fromISO(thing!.schedule.specificDate!).toLocaleString({
        month: 'long',
        day: 'numeric'
      });
      return `Once on ${readableDate}, from ${startTime} to ${endTime}`;
    }
    if (thing?.schedule.repeat === 'daily') {
      return `Every day, from ${startTime} to ${endTime}`;
    }
    if (thing?.schedule.repeat === 'weekly') {
      return `Every week on ${thing.schedule.dayOfWeek}, from ${startTime} to ${endTime}`;
    }

    return 'Not set';
  };

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
      <Row styles={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <H4>Streak</H4>
        <StreakChip streak={streakCount} />
      </Row>
      <Column>
        <H4>Schedule</H4>
        <Text style={{ marginTop: 10, color: styles.text.color }}>{scheduleText()}</Text>
      </Column>
      {thing.sharedWith.length > 0 && (
        <Column
          styles={{
            gap: 10
          }}
        >
          <H4>Shared with</H4>
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
      )}
      {thing.description && (
        <Column
          styles={{
            gap: 16
          }}
        >
          <H4>Description</H4>
          <Text style={{ color: styles.text.color }}>{thing.description}</Text>
        </Column>
      )}
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

export default ThingDetailsScreen;

const styles = StyleSheet.create({});
