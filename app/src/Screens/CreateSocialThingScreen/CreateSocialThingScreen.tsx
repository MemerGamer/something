import { Image, ScrollView, StyleSheet, Text } from 'react-native';
import React, { useState } from 'react';
import Column from '../../components/atoms/Column';
import H1 from '../../components/atoms/H1';
import MyButton from '../../components/molecules/MyButton';
import Row from '../../components/atoms/Row';
import LabeledInput from '../../components/organisms/TextInputWithLabel';
import ActionRow from '../../components/molecules/ActionRow';
import { useCreateThingScreenLogic } from './CreateSocialThingsScreen.logic';
import * as ImagePicker from 'expo-image-picker';
import { DateTime } from 'luxon';
import LoadingOverlay from '../../components/organisms/LoadingOverlay';
import { LinearGradient } from 'expo-linear-gradient';
import ErrorText from '../../components/atoms/ErrorText';
import { extractError } from '../../services/ApiService';
import DropDown from '../../components/atoms/DropDown';

const CreateSocialThingScreen = ({ navigation }: any) => {
  const {
    thingName,
    setThingName,
    thingDescription,
    setThingDescription,
    newThing,
    handleCreateThing,
    handleCanel,
    loading,
    error,
    thingLocation,
    setThingLocation,
    setUri,
    uri,
    setVisibility,
    visibility
  } = useCreateThingScreenLogic(navigation);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.canceled) {
      setUri(result.assets[0].uri);
    }
  };

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
    <ScrollView>
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
          Create a <H1 accent>social Thing</H1>
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
            <LabeledInput
              multiline
              label={'Description'}
              placeholder={'Thing description'}
              value={thingDescription}
              onChangeText={setThingDescription}
            />
          </Column>

          {/* EDIT AND SEE SCHEDULE */}
          <ActionRow label={scheduleText()} action={() => navigation.push('SetSocialTime')} />
          <Row>
            <ErrorText>{extractError(error, ['schedule'])}</ErrorText>
          </Row>

          {/* Location */}
          <LabeledInput
            label={'Location'}
            placeholder={'Location of the thing'}
            value={thingLocation}
            onChangeText={setThingLocation}
            error={error}
            path={['Location']}
          />
          <DropDown
            data={[
              { label: 'Private', value: 'private' },
              { label: 'Public', value: 'public' }
            ]}
            selectedValue={visibility}
            setSelectedValue={setVisibility}
          />

          {/* Cover image */}
          <MyButton text={'Select cover image'} onPress={pickImage} />
          {uri && <Image source={{ uri }} style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 5 }} />}
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
    </ScrollView>
  );
};

export default CreateSocialThingScreen;

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
