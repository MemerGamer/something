import { ScrollView, StyleSheet, Text } from 'react-native';
import React from 'react';
import Column from '../../components/atoms/Column';
import H1 from '../../components/atoms/H1';
import MyButton from '../../components/molecules/MyButton';
import Row from '../../components/atoms/Row';
import LabeledInput from '../../components/organisms/TextInputWithLabel';
import ActionRow from '../../components/molecules/ActionRow';
import { useCreateThingScreenLogic } from './CreateThingsScreen.logic';
import H3 from '../../components/atoms/H3';
import MyInput from '../../components/molecules/MyInput';
import { X } from 'react-native-feather';
import { DateTime } from 'luxon';
import LoadingOverlay from '../../components/organisms/LoadingOverlay';
import { LinearGradient } from 'expo-linear-gradient';
import ErrorText from '../../components/atoms/ErrorText';
import { extractError } from '../../services/ApiService';

const CreateThingScreen = ({ navigation }: any) => {
  const {
    thingName,
    setThingName,
    thingDescription,
    setThingDescription,
    newThing,
    sharedUsernames,
    setSharedUsernames,
    currentSharedUsername,
    setCurrentSharedUsername,
    handleCreateThing,
    handleCanel,
    handleUsernameAdd,
    loading,
    error
  } = useCreateThingScreenLogic(navigation);

  const scheduleText = () => {
    if (!newThing?.schedule) {
      return 'Not set';
    }

    const startTime = DateTime.fromFormat(newThing!.schedule!.startTime, 'hh:mm', { zone: 'utc' })
      .toLocal()
      .toLocaleString({ hour: 'numeric', minute: 'numeric' });
    const endTime = DateTime.fromFormat(newThing!.schedule!.endTime, 'hh:mm', { zone: 'utc' })
      .toLocal()
      .toLocaleString({ hour: 'numeric', minute: 'numeric' });

    if (newThing?.schedule.repeat === 'once') {
      const readableDate = DateTime.fromISO(newThing!.schedule.specificDate!).toLocaleString({
        month: 'long',
        day: 'numeric'
      });
      return `Once on ${readableDate}, from ${startTime} to ${endTime}`;
    }
    if (newThing?.schedule.repeat === 'daily') {
      return `Every day, from ${startTime} to ${endTime}`;
    }
    if (newThing?.schedule.repeat === 'weekly') {
      return `Every week on ${newThing.schedule.dayOfWeek}, from ${startTime} to ${endTime}`;
    }

    return 'Not set';
  };

  return (
    <Column
      styles={{
        paddingTop: 30,
        paddingVertical: 20,
        paddingHorizontal: 23,
        gap: 30,
        justifyContent: 'space-between',
        flex: 1
      }}
    >
      <LoadingOverlay visible={loading} />
      <H1>
        Create a <H1 accent>new Thing</H1>
      </H1>

      <Column styles={{ justifyContent: 'flex-start' }}>
        {/* NAME AND DESCRIPTION */}
        <Column styles={{ gap: 16 }}>
          <LabeledInput
            label={'Name'}
            placeholder={'Thing name'}
            value={thingName}
            onChangeText={setThingName}
            error={error}
            path={['name']}
          />

          {/* EDIT AND SEE SCHEDULE */}
          <ActionRow label={scheduleText()} action={() => navigation.push('SetTime')} />
          <Row>
            <ErrorText>{extractError(error, ['schedule'])}</ErrorText>
          </Row>

          <LabeledInput
            multiline
            label={'Description'}
            placeholder={'Thing description'}
            value={thingDescription}
            onChangeText={setThingDescription}
          />
        </Column>

        {/* USERNAMES */}
        <Column>
          <Row
            styles={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginTop: 30
            }}
          >
            <Column
              styles={{
                flex: 1,
                height: 50,
                justifyContent: 'center'
              }}
            >
              <LabeledInput
                label="Friends"
                value={currentSharedUsername}
                onChangeText={setCurrentSharedUsername}
                placeholder={"Type your friend's username"}
              />
            </Column>
            <MyButton text={'Add'} onPress={handleUsernameAdd} />
          </Row>
          <LinearGradient
            pointerEvents="none"
            // Background Linear Gradient
            colors={['transparent', 'transparent', 'transparent', 'rgba(0,0,0,0.5)']}
            style={[sharedUsernames.length >= 4 && styles.background, { borderRadius: 5 }]}
          />
          <ScrollView style={{ height: 150, marginTop: 8 }}>
            <Column styles={{ gap: 10, paddingBottom: 10 }}>
              {sharedUsernames.map((username, index) => {
                return (
                  <Row
                    key={index}
                    styles={{
                      gap: 8,
                      alignItems: 'center',
                      padding: 8,
                      borderRadius: 5,
                      backgroundColor: '#16a34a'
                    }}
                  >
                    <X
                      color={'#fff'}
                      onPress={() => {
                        setSharedUsernames(sharedUsernames.filter((name) => name !== username));
                      }}
                    />
                    <H3 white>@{username}</H3>
                  </Row>
                );
              })}
            </Column>
          </ScrollView>
        </Column>
      </Column>

      {/* ACTIONS */}
      <Row
        styles={{
          alignItems: 'center',
          justifyContent: 'space-evenly'
        }}
      >
        <MyButton text={'Cancel'} onPress={handleCanel} />
        <MyButton text={'Save'} onPress={handleCreateThing} accent />
      </Row>
    </Column>
  );
};

export default CreateThingScreen;

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    zIndex: 10,
    left: 0,
    right: 0,
    bottom: 0,
    height: 150
  }
});
