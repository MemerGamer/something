import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Column from '../atoms/Column';
import H3 from '../atoms/H3';
import Row from '../atoms/Row';
import StreakChip from '../atoms/StreakChip';
import { DateTime } from 'luxon';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTranslation } from 'react-i18next';

type ThingCardProps = {
  name: string;
  startTime: string;
  endTime: string;
  streak: number;
  id: string;
  navigation?: any;
};

const ThingCard = ({ navigation, name, startTime, endTime, streak, id }: ThingCardProps) => {
  const { t } = useTranslation();
  const styles = useThemedStyles();
  startTime = DateTime.fromFormat(startTime, 'hh:mm:ss', { zone: 'utc' })
    .toLocal()
    .toLocaleString({ hour: 'numeric', minute: 'numeric' });
  endTime = DateTime.fromFormat(endTime, 'hh:mm:ss', { zone: 'utc' })
    .toLocal()
    .toLocaleString({ hour: 'numeric', minute: 'numeric' });

  return (
    <Pressable
      onPress={() => {
        navigation && navigation.navigate('Details', { thingId: id, streakCount: streak });
      }}
    >
      <Column styles={styles.cardContainer}>
        <Row styles={{ justifyContent: 'space-between' }}>
          <H3>{t(name)}</H3>
          <StreakChip streak={streak} />
        </Row>
        <Text style={styles.cardTime}>
          {startTime} - {endTime}
        </Text>
      </Column>
    </Pressable>
  );
};

export default ThingCard;
