import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useThemedStyles } from '../../hooks/useThemedStyles';

type H3Props = {
  children?: React.ReactNode;
  accent?: boolean;
  white?: boolean;
};

const H3 = ({ children, accent, white }: H3Props) => {
  const styles = useThemedStyles();
  return <Text style={[styles.H3, accent && styles.headerAccent, white && styles.alwaysWhiteText]}>{children}</Text>;
};

export default H3;
