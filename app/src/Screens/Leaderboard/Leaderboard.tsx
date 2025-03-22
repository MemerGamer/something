import { StyleSheet, Switch, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import Column from '../../components/atoms/Column';
import { useLeaderboardLogic } from './Leaderboard.logic';
import { FlatList } from 'react-native-gesture-handler';
import Row from '../../components/atoms/Row';
import H1 from '../../components/atoms/H1';
import H4 from '../../components/atoms/H4';
import H3 from '../../components/atoms/H3';
import Label from '../../components/atoms/Label';
import H2 from '../../components/atoms/H2';
import { useThemedStyles } from '../../hooks/useThemedStyles';

const Leaderboard = () => {
  const { leaderBoard, getData, visibility, toggleVisibility, refreshing } = useLeaderboardLogic();
  const styles = useThemedStyles();

  useEffect(() => {
    getData();
  }, []);

  return (
    <Column
      scrollable
      refreshing={refreshing}
      getData={getData}
      styles={{
        height: '100%',
        position: 'relative',
        flex: 1,
        paddingTop: 30,
        paddingVertical: 20,
        paddingHorizontal: 23
      }}
    >
      <H1>
        Leaderboard <H1 accent>Thing</H1>
      </H1>
      <Row
        styles={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          marginTop: 10,
          marginBottom: 30
        }}
      >
        <Label text="Toggle online visibility" />
        <Switch
          trackColor={{ false: '#767577', true: '#78e3a0' }}
          thumbColor={visibility ? '#16a34a' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleVisibility}
          value={visibility}
        />
      </Row>
      <FlatList
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}
        scrollEnabled={false}
        data={leaderBoard}
        renderItem={({ item, index }) => {
          return (
            <Row
              styles={{
                gap: 5
              }}
            >
              <H2 accent>#{index + 1} </H2>
              <H2>{item.username}</H2>
              <Text
                style={{
                  fontSize: 20,
                  color: styles.text.color
                }}
              >
                {item.score} points
              </Text>
            </Row>
          );
        }}
      />

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
    </Column>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({});
