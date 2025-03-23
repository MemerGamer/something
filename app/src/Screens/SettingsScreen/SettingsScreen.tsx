import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Column from '../../components/atoms/Column';
import { useSettingsScreenLogic } from './SettingsScreen.logic';
import React, { useEffect, useState } from 'react';
import H1 from '../../components/atoms/H1';
import H3 from '../../components/atoms/H3';
import Row from '../../components/atoms/Row';
import MyButton from '../../components/molecules/MyButton';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import LabeledInput from '../../components/organisms/TextInputWithLabel';
import { useProfileScreenLogic } from '../ProfileScreen/ProfileScreen.logic';
import { Trans, useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../components/organisms/LanguageSwitcher';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }: any) => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = await AsyncStorage.getItem('language');
      if (storedLang) {
        i18n.changeLanguage(storedLang);
        setSelectedLanguage(storedLang);
      }
    };
    loadLanguage();
  }, []);

  const handleLanguageChange = async (lng: string) => {
    await i18n.changeLanguage(lng);
    await AsyncStorage.setItem('language', lng);
    setSelectedLanguage(lng);
  };

  const { t } = useTranslation();
  const isHungarian = i18n.language === 'hu';

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
        {isHungarian ? (
          <H1 accent>{t('MySetThings')}</H1>
        ) : (
          <>
            {t('Set')}-<H1 accent>{t('Things')}</H1>
          </>
        )}
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
      <LanguageSwitcher language={selectedLanguage} visible={true} onChange={handleLanguageChange} />
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
