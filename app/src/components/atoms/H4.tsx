import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useThemedStyles } from '../../hooks/useThemedStyles';

type H4Props = {
  children?: React.ReactNode;
  accent?: boolean;
  cursive?: boolean;
};

const H4 = ({ children, accent, cursive }: H4Props) => {
  const styles = useThemedStyles();
  return <Text style={[styles.H4, accent && styles.headerAccent, cursive && styles.cursive]}>{children}</Text>;
};

export default H4;
