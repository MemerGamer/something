import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useThemedStyles } from '../../hooks/useThemedStyles';

type BigTextProps = {
  children: React.ReactNode;
  accent?: boolean;
  underLine?: boolean;
};

const BigText = ({ children, accent, underLine }: BigTextProps) => {
  const styles = useThemedStyles();
  return <Text style={[styles.bigText, accent && styles.headerAccent, underLine && styles.underLine]}>{children}</Text>;
};

export default BigText;
