import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Column from '../atoms/Column';
import H4 from '../atoms/H4';
import H3 from '../atoms/H3';
import { Camera } from 'react-native-feather';

type MyButtonProps = {
  text: string;
  onPress: () => void;
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
          styles.button,
          accent ? styles.accent : styles.button,
          backgroundColor ? { backgroundColor } : styles.button,
          borderColor ? { borderColor } : styles.button
        ]}
      >
        {icon && <Camera color={'#16a34a'} style={{ marginRight: 10 }} />}
        {!smalltext ? <H4 accent={accent}>{text}</H4> : <H3 accent={accent}>{text}</H3>}
      </Column>
    </Pressable>
  );
};

export default MyButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  accent: {
    borderWidth: 2,
    borderColor: '#16a34a'
  }
});
