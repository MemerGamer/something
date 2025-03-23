import React from 'react';
import Label from '../atoms/Label';
import Column from '../atoms/Column';
import MyInput from '../molecules/MyInput';
import { ApiError, extractError } from '../../services/ApiService';
import ErrorText from '../atoms/ErrorText';
import { useTranslation } from 'react-i18next';

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secure?: boolean;
  error?: ApiError;
  path?: (string | number)[];
  multiline?: boolean;
};

const LabeledInput = ({ label, placeholder, value, onChangeText, secure, error, path, multiline }: Props) => {
  const { t } = useTranslation();
  return (
    <Column styles={{ gap: 5 }}>
      <Label text={t(label)} />
      <MyInput
        secure={secure}
        text={t(value)}
        setText={onChangeText}
        placeholder={t(placeholder + (multiline ? '\n\n\n' : ''))}
        error={!!extractError(error, path ?? [])}
        multiline={multiline}
      />
      <ErrorText>{extractError(error, path ?? [])}</ErrorText>
    </Column>
  );
};

export default LabeledInput;
