import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Column from '../../components/atoms/Column';
import H2 from '../../components/atoms/H2';
import Label from '../../components/atoms/Label';
import { LinearGradient } from 'expo-linear-gradient';
import H3 from '../../components/atoms/H3';
import { Bell, BellOff, Lock, Plus, Users } from 'react-native-feather';
import Row from '../../components/atoms/Row';
import MyButton from '../../components/molecules/MyButton';
import { useSocialThingsLogic } from './SocialThings.logic';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import ApiService from '../../services/ApiService';
import LoadingOverlay from '../../components/organisms/LoadingOverlay';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTranslation } from 'react-i18next';

const api = new ApiService();

const ImageView = ({ url }: { url: string }) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    (async () => {
      const filename = url.split('/')[4];
      const response = await api.call(api.client.images[':filename'].$get, { param: { filename } });
      if (response.ok) {
        const data = await response.blob();
        const fileReaderInstance = new FileReader();
        fileReaderInstance.readAsDataURL(data);
        fileReaderInstance.onload = () => {
          const base64data = fileReaderInstance.result as string;
          setImage(base64data);
        };
      }
    })();
  }, []);

  if (!image) {
    return <></>;
  }

  return <Image key={url} style={{ height: '100%', width: '100%' }} source={{ uri: image }} />;
};

const SocialThings = ({ navigation }: any) => {
  const { t } = useTranslation();
  const styles = useThemedStyles();
  const logic = useSocialThingsLogic();
  useEffect(() => {
    logic.getSocialThings();
  }, []);

  const parseDate = (date: string) => {
    return DateTime.fromSQL(date, { zone: 'utc' }).toLocal().toLocaleString({
      month: 'long',
      day: 'numeric'
    });
  };

  const parseTime = (time: string) => {
    return DateTime.fromFormat(time, 'hh:mm:ss', { zone: 'utc' })
      .toLocal()
      .toLocaleString({ hour: 'numeric', minute: 'numeric' });
  };

  const renderSocialThings = () => (
    <FlatList
      data={logic.socialThings}
      scrollEnabled={false}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate('SocialDetails', { thingId: item.id, userCount: item.userCount })}
        >
          <Column key={item.id}>
            <Column
              styles={{
                backgroundColor: styles.column.backgroundColor,
                borderColor: styles.column.borderColor,
                borderWidth: 1,
                borderRadius: 8,
                padding: 16,
                marginTop: 20
              }}
            >
              {/* IMAGE */}
              <View style={{ height: 200, borderRadius: 8, overflow: 'hidden' }}>
                <ImageView url={item.coverImage} />
                <LinearGradient
                  colors={['#21212100', '#212121']}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 8
                  }}
                >
                  <View
                    style={{
                      height: '100%',
                      justifyContent: 'flex-end',
                      padding: 16
                    }}
                  >
                    <H3 white>{item.name}</H3>
                    <Text style={{ color: 'white' }}>
                      {parseDate(item.date)} {parseTime(item.startTime)} - {parseTime(item.endTime)} @ {item.location}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
              {/* IMAGE */}

              <Row styles={{ justifyContent: 'space-between', marginTop: 20 }}>
                <Row styles={{ gap: 5, alignItems: 'center' }}>
                  {item?.joinCode && <Lock color={styles.accent.color} />}
                  <Users color={styles.accent.color} />
                  <Text style={{ color: styles.accent.color, fontWeight: 'bold' }}>{item.userCount}</Text>
                </Row>
                <Pressable onPress={() => logic.toggleNotifications(item.id)}>
                  <Row
                    styles={{
                      paddingVertical: 8,
                      paddingHorizontal: 24,
                      paddingLeft: 18,
                      borderRadius: 5,
                      borderWidth: 2,
                      borderColor: styles.accent.borderColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 16
                    }}
                  >
                    {!item.notified && (
                      <>
                        <Bell color={styles.accent.color} />
                        <Text style={{ color: styles.accent.color, fontWeight: 'bold' }}>{t('Get notified')}</Text>
                      </>
                    )}
                    {item.notified && (
                      <>
                        <BellOff color={styles.accent.color} />
                        <Text style={{ color: styles.accent.color, fontWeight: 'bold' }}>{t('Unsubscribe')}</Text>
                      </>
                    )}
                  </Row>
                </Pressable>
              </Row>
            </Column>
          </Column>
        </Pressable>
      )}
    />
  );

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
            navigation.push('JoinSocialThing');
          }}
        />
      </Column>
    );
  };

  return (
    <Column styles={{ flex: 1 }}>
      <LoadingOverlay visible={logic.loading} />
      <ScrollView
        style={styles.socialThingContainer}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={logic.refreshing} onRefresh={logic.getSocialThings} />}
      >
        <H2>
          {t('Social')} <H2 accent>{t('Things')}</H2>
        </H2>
        {renderSocialThings()}
      </ScrollView>
      {renderButton()}
    </Column>
  );
};

export default SocialThings;
