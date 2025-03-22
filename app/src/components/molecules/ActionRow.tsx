import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Row from '../atoms/Row';
import Label from '../atoms/Label';
import { ChevronRight } from 'react-native-feather';
import Column from '../atoms/Column';

type ActionRowProps = {
  label: string;
  action: () => void;
};

const ActionRow = ({ label, action }: ActionRowProps) => {
  return (
    <Column
      styles={{
        justifyContent: 'space-between',
        gap: 5
      }}
    >
      <Label text={'Schedule'} />
      <Pressable onPress={action}>
        <Row
          styles={{
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
            borderWidth: 1,
            borderColor: 'gray',
            // marginHorizontal: 16,
            borderRadius: 5
          }}
        >
          <Label text={label} />
          <ChevronRight color={'black'} />
        </Row>
      </Pressable>
    </Column>
  );
};

export default ActionRow;
