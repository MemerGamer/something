import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useThemedStyles } from '../../hooks/useThemedStyles';

type H2Props = {
  children?: React.ReactNode;
  accent?: boolean;
  cursive?: boolean;
};

const H2 = ({ children, accent, cursive }: H2Props) => {
  const styles = useThemedStyles();
  return <Text style={[styles.H2, accent && styles.headerAccent, cursive && styles.cursive]}>{children}</Text>;
};

export default H2;
