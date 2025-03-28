import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useContext } from 'react';
import Column from '../../components/atoms/Column';
import H2 from '../../components/atoms/H2';
import { FlatList } from 'react-native-gesture-handler';
import ThingCard from '../../components/molecules/ThingCard';
import Spacer from '../../components/atoms/Spacer';
import { useHomeScreenLogic } from './HomeScreen.logic';
import { Plus } from 'react-native-feather';
import ImageViewer from '../../components/molecules/ImageViewer';
import { useNotifications } from '../../hooks/notifications';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTranslation } from 'react-i18next';
import i18n from '../../services/i18n';

const HomeScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const isHungarian = i18n.language === 'hu';
  const styles = useThemedStyles();
  useNotifications();

  const logic = useHomeScreenLogic();

  useEffect(() => {
    logic.getHomeThings();
  }, []);

  const renderTodayThings = () => {
    if (logic.userThings.home.length === 0) {
      return <Text>{t('MyNoThingsForToday')}</Text>;
    }

    return (
      <FlatList
        data={logic.userThings.home}
        scrollEnabled={false}
        style={{ marginTop: 18 }}
        contentContainerStyle={{ gap: 14 }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <ThingCard
            id={item.id}
            navigation={navigation}
            name={item.name}
            startTime={item.startTime}
            endTime={item.endTime}
            streak={item.streak}
          />
        )}
      />
    );
  };

  const renderOtherThings = () => {
    if (logic.otherThings.home.length === 0) {
      return <Text style={styles.text}>{t('NoFriendUpload')}</Text>;
    }

    return (
      <FlatList
        data={logic.otherThings.home}
        scrollEnabled={false}
        keyExtractor={(_, index) => index.toString()}
        style={{ marginTop: 18, marginBottom: 50 }}
        contentContainerStyle={{ gap: 20 }}
        renderItem={({ item }) => (
          <ImageViewer uri={item.image} name={item.name} username={item.username} createdAt={item.createdAt} />
        )}
      />
    );
  };

  const renderButton = () => {
    return (
      <Column
        styles={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 15,
          backgroundColor: styles.accent.backgroundColor,
          borderRadius: 15,
          position: 'absolute',
          right: 16,
          bottom: 20
        }}
      >
        <Plus
          color={'white'}
          onPress={() => {
            navigation.push('CreateThing');
          }}
        />
      </Column>
    );
  };

  return (
    <Column styles={{ flex: 1 }}>
      <ScrollView
        style={styles.homeContainer}
        refreshControl={<RefreshControl refreshing={logic.refreshing} onRefresh={logic.getHomeThings} />}
      >
        <H2>
          {isHungarian ? (
            <H2 accent>{t('MyTodaysLatestThings')}</H2>
          ) : (
            <>
              {t('Todays')} {t('Latest')} <H2 accent>{t('Things')}</H2>
            </>
          )}
        </H2>
        {renderTodayThings()}
        <Spacer space={20} />
        <H2>
          {isHungarian ? (
            <H2 accent>{t('MyFriendsThings')}</H2>
          ) : (
            <>
              {t('Friends')} <H2 accent>{t('Things')}</H2>
            </>
          )}
        </H2>
        {renderOtherThings()}
      </ScrollView>
      {renderButton()}
    </Column>
  );
};

export default HomeScreen;
