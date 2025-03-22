import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Column from '../atoms/Column';
import H3 from '../atoms/H3';
import Row from '../atoms/Row';
import StreakChip from '../atoms/StreakChip';
import { DateTime } from 'luxon';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import UserChip from '../atoms/UserChip';
import { LinearGradient } from 'react-native-svg';
import { ReactElement } from 'react';
import ApiService from '../../services/ApiService';
import { Users } from 'react-native-feather';

type OrganizationThingCardProps = {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  users: number;
  id: string;
  navigation?: any;
  location?: string;
  coverImage?: string;
};

const api = new ApiService();

const ImageView = ({ url }: { url: string }) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    (async () => {
      const filename = url.split('/')[4];
      const response = await api.call(api.client.images[':filename'].$get, { param: { filename } });
      if (response.ok) {
        const data = await response.blob();
        const fileReaderInstance = new FileReader();
        fileReaderInstance.readAsDataURL(data);
        fileReaderInstance.onload = () => {
          const base64data = fileReaderInstance.result as string;
          setImage(base64data);
        };
      }
    })();
  }, []);

  if (!image) {
    return <></>;
  }

  return <Image style={{ height: '100%', width: '100%' }} source={{ uri: image }} />;
};

const OrganizationThingCard = ({
  navigation,
  name,
  date,
  startTime,
  endTime,
  users,
  id,
  location,
  coverImage
}: OrganizationThingCardProps) => {
  const styles = useThemedStyles();
  startTime = DateTime.fromFormat(startTime, 'hh:mm:ss', { zone: 'utc' })
    .toLocal()
    .toLocaleString({ hour: 'numeric', minute: 'numeric' });
  endTime = DateTime.fromFormat(endTime, 'hh:mm:ss', { zone: 'utc' })
    .toLocal()
    .toLocaleString({ hour: 'numeric', minute: 'numeric' });

  function parseDate(dateValue: string): string {
    return DateTime.fromISO(dateValue).toLocaleString(DateTime.DATE_MED);
  }

  function parseTime(time: string): string {
    return DateTime.fromFormat(time, 'hh:mm:ss', { zone: 'utc' }).toLocal().toLocaleString(DateTime.TIME_SIMPLE);
  }

  return (
    <>
      <Pressable
        onPress={() => {
          navigation && navigation.navigate('SocialDetails', { thingId: id, userCount: users });
        }}
      >
        <Column>
          <Column
            styles={{
              backgroundColor: styles.column.backgroundColor,
              borderColor: styles.column.borderColor,
              borderWidth: 1,
              borderRadius: 8,
              padding: 16,
              marginTop: 20
            }}
          >
            <View style={{ height: 200, borderRadius: 8, overflow: 'hidden' }}>
              <ImageView url={coverImage || ''} />
              <View
                style={{
                  height: '100%',
                  justifyContent: 'flex-end',
                  padding: 16
                }}
              >
                <H3 white>{name}</H3>
                <Text style={{ color: 'white' }}>
                  {parseDate(date)} {startTime} - {endTime} @ {location}
                </Text>
              </View>
            </View>

            <Row styles={{ justifyContent: 'space-between', marginTop: 20 }}>
              <Row styles={{ gap: 5, alignItems: 'center' }}>
                <Users color={styles.accent.color} />
                <Text style={{ color: styles.accent.color, fontWeight: 'bold' }}>{users}</Text>
              </Row>
            </Row>
          </Column>
        </Column>
      </Pressable>
    </>
  );
};

export default OrganizationThingCard;
