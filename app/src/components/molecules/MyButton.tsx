import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Column from '../atoms/Column';
import H4 from '../atoms/H4';
import H3 from '../atoms/H3';
import { Camera } from 'react-native-feather';
import { useThemedStyles } from '../../hooks/useThemedStyles';

type MyButtonProps = {
  text: string;
  onPress: (...args: any[]) => void;
  accent?: boolean;
  small?: boolean;
  subLine?: string;
  smalltext?: boolean;
  icon?: boolean;
  backgroundColor?: string;
  borderColor?: string;
};

const MyButton = ({
  text,
  onPress,
  accent,
  small,
  subLine,
  smalltext,
  icon,
  backgroundColor,
  borderColor
}: MyButtonProps) => {
  const styles = useThemedStyles();
  if (small) {
    return (
      <Pressable onPress={onPress}>
        <Column>
          <H4 accent={accent}>{text}</H4>
        </Column>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress}>
      <Column
        styles={[
          styles.myButton,
          accent ? styles.myButtonAccent : styles.myButton,
          backgroundColor ? { backgroundColor } : styles.myButton,
          borderColor ? { borderColor } : styles.myButton
        ]}
      >
        {icon && <Camera color={styles.accent.color} style={{ marginRight: 10 }} />}
        {!smalltext ? <H4 accent={accent}>{text}</H4> : <H3 accent={accent}>{text}</H3>}
      </Column>
    </Pressable>
  );
};

export default MyButton;
