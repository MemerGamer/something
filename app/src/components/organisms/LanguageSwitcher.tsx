import React from 'react';
import { Modal, FlatList, StyleSheet, Pressable, Text, View, Image } from 'react-native';
import { ImagesAssets } from '../../../assets/ImagesAssets';
import Row from '../atoms/Row';
import i18n, { languageResources } from '../../services/i18n';
import Column from '../atoms/Column';
import MyButton from '../molecules/MyButton';
import { useThemedStyles } from '../../hooks/useThemedStyles';

type Language = 'en' | 'hu';

interface LanguageSwitcherProps {
  visible: boolean;
  language?: Language | string;
  onChange: (lng: string) => void;
}

const flags = {
  en: ImagesAssets.enFlag,
  hu: ImagesAssets.huFlag
};

const languagesList = {
  en: {
    name: 'English',
    nativeName: 'English'
  },
  hu: {
    name: 'Hungarian',
    nativeName: 'Magyar'
  }
};

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ visible, onChange }) => {
  const changeLng = async (lng: string) => {
    i18n.changeLanguage(lng);
    onChange(lng);
  };

  const styles = useThemedStyles();

  const renderItem = ({ item }: { item: string }) => {
    return (
      <MyButton text={languagesList[item as keyof typeof languagesList].nativeName} onPress={() => changeLng(item)} />
    );
  };

  return (
    <Row styles={{ justifyContent: 'space-between' }}>
      {Object.keys(languageResources).map((item) => (
        <MyButton
          key={item}
          text={languagesList[item as keyof typeof languagesList].nativeName}
          onPress={() => changeLng(item)}
        />
      ))}
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  renderContainer: {
    marginVertical: 20
  },
  flagImage: {
    width: 30,
    height: 30,
    marginRight: 10
  },
  text: {
    fontSize: 30
  }
});
