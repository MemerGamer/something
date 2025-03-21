import { StyleSheet, Text, TextStyle, View } from 'react-native';
import React from 'react';
import { useThemedStyles } from '../../hooks/useThemedStyles';

type H1Props = {
  children: React.ReactNode;
  accent?: boolean;
};

const H1 = ({ children, accent }: H1Props) => {
  const styles = useThemedStyles();
  return (
    <Text style={[styles.H1, { color: styles.alwaysWhiteText.color }, accent && styles.headerAccent]}>{children}</Text>
  );
};

export default H1;
