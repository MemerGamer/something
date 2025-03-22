import { ActivityIndicator, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import Column from '../../components/atoms/Column';
import { useSocialThingDetailsScreenLogic } from './SocialThingDetailsScreen.logic';
import Row from '../../components/atoms/Row';
import H1 from '../../components/atoms/H1';
import H3 from '../../components/atoms/H3';
import H4 from '../../components/atoms/H4';
import { Copy } from 'react-native-feather';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import ImageViewer from '../../components/molecules/ImageViewer';
import MyButton from '../../components/molecules/MyButton';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { DateTime } from 'luxon';
import Clipboard from '@react-native-clipboard/clipboard';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

const SocialThingDetailsScreen = ({ route, navigation }: any) => {
  const styles = useThemedStyles();
  const { getDetails, thing, refreshing } = useSocialThingDetailsScreenLogic();
  const [userCount, setUserCount] = useState(0);
  const { thingId } = route.params;

  useEffect(() => {
    getDetails(thingId);
  }, [thingId]);

  useEffect(() => {
    setUserCount(thing?.sharedWith.length ?? 0);
  }, [thing]);

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      textBody: 'Copied to clipboard'
    });
  };

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
      <Column>
        <Row styles={{ gap: 5 }}>
          <H4>Visibility:</H4>
          <H4 accent>{thing.visibility?.charAt(0).toUpperCase().concat(thing.visibility.slice(1))}</H4>
        </Row>
        {thing.visibility === 'private' && (
          <Row styles={{ gap: 5 }}>
            <H4>Join Code:</H4>
            <H4 accent>{thing.joinCode}</H4>
            <TouchableOpacity onPress={() => copyToClipboard(thing.joinCode ?? '')}>
              <Copy stroke={styles.accent.backgroundColor} width={20} height={20} />
            </TouchableOpacity>
          </Row>
        )}
      </Column>
      <Column>
        <H4>Schedule</H4>
        <Text style={{ marginTop: 10, color: styles.text.color }}>{scheduleText()}</Text>
      </Column>
      <Column
        styles={{
          gap: 10
        }}
      >
        <H4>People Joined ({userCount})</H4>
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
      {thing.description && (
        <Column
          styles={{
            gap: 10
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

export default SocialThingDetailsScreen;
