import { error } from 'console';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTranslation } from 'react-i18next';

type MyInputProps = {
  text: string;
  setText: (text: string) => void;
  placeholder: string;
  secure?: boolean;
  multiline?: boolean;
  error?: boolean;
};

const MyInput = ({ text, setText, placeholder, secure, error: inputError, multiline }: MyInputProps) => {
  const { t } = useTranslation();
  const styles = useThemedStyles();
  return (
    <TextInput
      placeholder={t(placeholder)}
      style={[
        styles.input,
        inputError && styles.error,
        multiline && { verticalAlign: 'top' },
        { color: styles.text.color }
      ]}
      onChangeText={setText}
      value={t(text)}
      secureTextEntry={secure}
      multiline={multiline}
    />
  );
};

export default MyInput;
