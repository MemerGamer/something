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

const SettingsScreen = ({ navigation }: any) => {
  const styles = useThemedStyles();
  const logic = useSettingsScreenLogic();
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const handleStartEditing = () => {
    setIsEditingUsername(true); // Show the input when button is pressed
    logic.setNewUsername(logic.newUsername);
  };

  const handleCancelEditing = () => {
    setIsEditingUsername(false); // Hide the input if user cancels
    logic.setNewUsername(logic.username);
  };

  if (logic.loading) {
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
      refreshing={logic.refreshing}
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
            value={logic.newUsername}
            onChangeText={logic.setNewUsername}
          />
          <Row styles={{ justifyContent: 'space-between' }}>
            <MyButton accent smalltext text="Cancel" onPress={handleCancelEditing} />
            <MyButton
              accent
              smalltext
              text="Save"
              onPress={logic.handleChangeUsername}
              disabled={logic.newUsername.trim().length < 5}
            />
          </Row>
        </Column>
      )}
      {logic.userType === 'user' && (
        <MyButton
          accent
          smalltext
          text={logic.requestSent ? 'Organization Request Sent' : 'Request Organization Role'}
          onPress={logic.handleRequestOrganizationRole}
          disabled={logic.requestSent}
        />
      )}
      <Row styles={{ justifyContent: 'space-between', alignItems: 'center', gap: 5 }}>
        <MyButton accent smalltext text="Light" onPress={logic.handleToggleTheme} />
        <MyButton accent smalltext text="Dark" onPress={logic.handleToggleTheme} />
        <MyButton accent smalltext text="System" onPress={logic.handleToggleTheme} />
      </Row>
      <Column
        styles={{
          bottom: 0
        }}
      >
        <MyButton accent smalltext text="Log out" onPress={logic.handleLogout} />
      </Column>
    </Column>
  );
};

const styles = StyleSheet.create({});
export default SettingsScreen;
