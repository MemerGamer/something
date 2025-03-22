import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Row from './Row';
import { useThemedStyles } from '../../hooks/useThemedStyles';

type UserChipProps = {
  users: number;
};

const UserChip = ({ users }: UserChipProps) => {
  const styles = useThemedStyles();
  return (
    <Row styles={styles.userChip}>
      <Text style={styles.userChipText}>{users}</Text>
    </Row>
  );
};

export default UserChip;
