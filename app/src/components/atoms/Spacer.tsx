import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

type SpacerProps = {
  space: number;
};

const Spacer = ({ space }: SpacerProps) => {
  return <View style={{ height: space }} />;
};

export default Spacer;
