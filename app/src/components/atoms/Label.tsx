import { Text, StyleSheet } from 'react-native';
import React from 'react';
import { useThemedStyles } from '../../hooks/useThemedStyles';

type LabelProps = {
  text: string;
};

const Label = ({ text }: LabelProps) => {
  const styles = useThemedStyles();
  return <Text style={styles.label}>{text}</Text>;
};

export default Label;
