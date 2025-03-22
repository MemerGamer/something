import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Row from './Row';
import { useThemedStyles } from '../../hooks/useThemedStyles';

type StreakChipProps = {
  streak: number;
};

const StreakChip = ({ streak }: StreakChipProps) => {
  const styles = useThemedStyles();
  return (
    <Row styles={styles.streakChip}>
      <Text style={styles.streakChipText}>{streak} 🔥</Text>
    </Row>
  );
};

export default StreakChip;
