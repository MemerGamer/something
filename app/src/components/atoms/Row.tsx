import { ViewStyle, StyleSheet, View } from 'react-native';
import React from 'react';
import { useThemedStyles } from '../../hooks/useThemedStyles';

type RowProps = {
  children?: React.ReactNode;
  styles?: ViewStyle;
};

const Row = ({ children, styles }: RowProps) => {
  const styless = useThemedStyles();
  return <View style={[styless.row, styles]}>{children}</View>;
};

export default Row;
