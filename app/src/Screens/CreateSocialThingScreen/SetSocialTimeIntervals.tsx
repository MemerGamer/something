import { Pressable, StyleSheet, Text } from 'react-native';
import React, { useState } from 'react';
import Column from '../../components/atoms/Column';
import Row from '../../components/atoms/Row';
import MyButton from '../../components/molecules/MyButton';
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import BigText from '../../components/atoms/BigText';
import { useAppDispatch } from '../../hooks/hooks';
import { NewThingDTO, setScheduleForNewPersonalThing } from '../../redux/thing/ThingStack';
import { DateTime } from 'luxon';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useTranslation } from 'react-i18next';
import i18n from '../../services/i18n';

const SetSocialTimeIntervals = ({ navigation }: any) => {
  const { t } = useTranslation();
  const isHungarian = i18n.language === 'hu';

  const dispatch = useAppDispatch();

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  const [startTime, setStartTime] = useState(new Date(Date.now()));
  const [endTime, setEndTime] = useState(new Date(new Date(Date.now()).setHours(startTime.getHours() + 1)));

  const [repeatType, setRepeatType] = useState<'every' | 'once'>('once');
  const [repeat, setRepeat] = useState<NewThingDTO['schedule']['repeat']>('daily');

  const [weekday, setWeekday] = useState(daysOfWeek[new Date(Date.now()).getDay()]);
  const [specificDate, setSpecificDate] = useState(new Date());

  const onSave = () => {
    const schedule = {
      startTime: DateTime.fromJSDate(startTime).toUTC().toFormat('HH:mm'),
      endTime: DateTime.fromJSDate(endTime).toUTC().toFormat('HH:mm'),
      repeat: 'once',
      specificDate: DateTime.fromJSDate(specificDate).toUTC().startOf('day').toISO()
    } as const;

    dispatch(setScheduleForNewPersonalThing(schedule));

    navigation.pop();
  };

  const onStartTimeChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate;
    setStartTime(currentDate ?? new Date(Date.now()));

    if (endTime < currentDate!) {
      Toast.show({
        type: ALERT_TYPE.INFO,
        title: 'End time will be after midnight'
      });
    }
  };

  const onEndTimeChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate;
    setEndTime(currentDate ?? new Date(Date.now()));

    if (currentDate! < startTime) {
      Toast.show({
        type: ALERT_TYPE.INFO,
        title: 'End time will be after midnight'
      });
    }
  };

  const showTimepicker = (value: any, onChange: (item: any) => void) => {
    DateTimePickerAndroid.open({
      value,
      onChange,
      mode: 'time',
      is24Hour: true
    });
  };

  const onSpecificDateChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate;
    setSpecificDate(currentDate ?? new Date(Date.now()));
  };

  const showDateicker = (value: any, onChange: (item: any) => void) => {
    DateTimePickerAndroid.open({
      value,
      onChange,
      mode: 'date',
      minimumDate: new Date()
    });
  };

  const formatTime = (date: Date) => {
    return DateTime.fromJSDate(date).toFormat('HH : mm');
  };

  const formatDate = (date: Date) => {
    return DateTime.fromJSDate(date).toLocaleString({
      month: 'long',
      day: 'numeric'
    });
  };

  const TimeSelectRow = () => (
    <Row styles={{ alignItems: 'center' }}>
      {/* START HOUR */}
      <Pressable onPress={() => showTimepicker(startTime, onStartTimeChange)}>
        <BigText accent underLine>
          {formatTime(startTime)}
        </BigText>
      </Pressable>

      <BigText>{t(' to ')}</BigText>

      {/* END HOUR */}
      <Pressable onPress={() => showTimepicker(endTime, onEndTimeChange)}>
        <BigText accent underLine>
          {formatTime(endTime)}
        </BigText>
      </Pressable>

      {isHungarian && <BigText> {t('between')}</BigText>}
    </Row>
  );

  const RepeatTypeRow = () => (
    <Row styles={{ gap: 10 }}>
      {repeatType === 'once' && <BigText>{'on  '}</BigText>}
      {repeatType === 'once' && (
        <Pressable onPress={() => showDateicker(specificDate, onSpecificDateChange)}>
          <BigText accent underLine>
            {formatDate(specificDate)}
          </BigText>
        </Pressable>
      )}
    </Row>
  );

  const ActionsRow = () => (
    <Row
      styles={{
        alignItems: 'center',
        justifyContent: 'space-evenly'
      }}
    >
      <MyButton text={'Cancel'} onPress={() => navigation.pop()} />
      <MyButton text={'Save'} accent onPress={onSave} />
    </Row>
  );

  return (
    <Column
      styles={{
        flex: 1,
        padding: 16,
        justifyContent: 'space-between'
      }}
    >
      <Column styles={{ gap: 20 }}>
        <BigText>
          This <BigText accent>social Thing</BigText> will take place from
        </BigText>

        <TimeSelectRow />

        <RepeatTypeRow />
      </Column>

      <ActionsRow />
    </Column>
  );
};

export default SetSocialTimeIntervals;

const styles = StyleSheet.create({
  dropdown: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedTextStyle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#16a34a',
    textDecorationLine: 'underline',
    borderColor: 'red',
    // borderWidth: 1,
    height: 43
  },
  iconStyle: {
    display: 'none'
  }
});
