import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Column from '../../components/atoms/Column';
import { useSettingsScreenLogic } from './SettingsScreen.logic';
import { useEffect, useState } from 'react';
import H1 from '../../components/atoms/H1';
import H3 from '../../components/atoms/H3';
import Row from '../../components/atoms/Row';
import MyButton from '../../components/molecules/MyButton';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import LabeledInput from '../../components/organisms/TextInputWithLabel';
import { useProfileScreenLogic } from '../ProfileScreen/ProfileScreen.logic';

const SettingsScreen = ({ navigation }: any) => {
  const styles = useThemedStyles();
  const settingsLogic = useSettingsScreenLogic();
  const profileLogic = useProfileScreenLogic();
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const handleStartEditing = () => {
    setIsEditingUsername(true);
    profileLogic.setNewUsername(profileLogic.newUsername);
  };

  const handleCancelEditing = () => {
    setIsEditingUsername(false);
    profileLogic.setNewUsername(profileLogic.username || profileLogic.user?.username || '');
  };

  if (profileLogic.loading) {
    return (
      <Column
        styles={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator size="large" />
      </Column>
    );
  }

  return (
    <Column
      scrollable
      refreshing={profileLogic.refreshing}
      styles={{
        flex: 1,
        paddingTop: 30,
        paddingVertical: 20,
        paddingHorizontal: 23,
        gap: 10
      }}
    >
      <H1>
        Set-<H1 accent>Things</H1>
      </H1>
      {isEditingUsername === false ? (
        <MyButton accent smalltext text="Change Username" onPress={handleStartEditing} />
      ) : (
        <Column>
          <LabeledInput
            label="Username"
            placeholder="Enter new Username"
            value={profileLogic.newUsername}
            onChangeText={profileLogic.setNewUsername}
          />
          <Row styles={{ justifyContent: 'space-between' }}>
            <MyButton accent smalltext text="Cancel" onPress={handleCancelEditing} />
            <MyButton
              accent
              smalltext
              text="Save"
              onPress={profileLogic.handleChangeUsername}
              disabled={profileLogic.newUsername.trim().length < 5}
            />
          </Row>
        </Column>
      )}
      {profileLogic.userType === 'user' && (
        <MyButton
          accent
          smalltext
          text={profileLogic.requestSent ? 'Organization Request Sent' : 'Request Organization Role'}
          onPress={profileLogic.handleRequestOrganizationRole}
          disabled={profileLogic.requestSent}
        />
      )}
      <Row styles={{ justifyContent: 'space-between', alignItems: 'center', gap: 5 }}>
        <MyButton accent smalltext text="Light" onPress={settingsLogic.handleToggleTheme} />
        <MyButton accent smalltext text="Dark" onPress={settingsLogic.handleToggleTheme} />
        <MyButton accent smalltext text="System" onPress={settingsLogic.handleToggleTheme} />
      </Row>
      <Column
        styles={{
          bottom: 0
        }}
      >
        <MyButton accent smalltext text="Log out" onPress={settingsLogic.handleLogout} />
      </Column>
    </Column>
  );
};

const styles = StyleSheet.create({});
export default SettingsScreen;
