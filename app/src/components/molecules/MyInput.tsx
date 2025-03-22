import { error } from 'console';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useThemedStyles } from '../../hooks/useThemedStyles';

type MyInputProps = {
  text: string;
  setText: (text: string) => void;
  placeholder: string;
  secure?: boolean;
  multiline?: boolean;
  error?: boolean;
};

const MyInput = ({ text, setText, placeholder, secure, error: inputError, multiline }: MyInputProps) => {
  const styles = useThemedStyles();
  return (
    <TextInput
      placeholder={placeholder}
      style={[
        styles.input,
        inputError && styles.error,
        multiline && { verticalAlign: 'top' },
        { color: styles.text.color }
      ]}
      onChangeText={setText}
      value={text}
      secureTextEntry={secure}
      multiline={multiline}
    />
  );
};

export default MyInput;
