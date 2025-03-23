import React, { useState, useEffect } from 'react';
import { View, Text, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Camera, CameraView } from 'expo-camera';
import Column from '../../components/atoms/Column';
import H1 from '../../components/atoms/H1';
import MyInput from '../../components/molecules/MyInput';
import MyButton from '../../components/molecules/MyButton';
import Row from '../../components/atoms/Row';

import { useTranslation } from 'react-i18next';
import i18n from '../../services/i18n';
import { useJoinSocialThingScreenLogic } from './JoinSocialThingScreen.logic';
import { useThemedStyles } from '../../hooks/useThemedStyles';


const JoinSocialThingScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const isHungarian = i18n.language === 'hu';

  const { handleCancel, handleJoinSocialThing, joinCode, setJoinCode } = useJoinSocialThingScreenLogic(navigation);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const styles = useThemedStyles();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setJoinCode(data);
    setIsScanning(false);
    handleJoinSocialThing();
  };

  return (
    <ScrollView>
      <Column
        styles={{
          paddingTop: 30,
          paddingVertical: 20,
          paddingHorizontal: 23,
          gap: 30,
          justifyContent: 'space-between',
          flex: 1
        }}
      >
        <H1>
          {isHungarian ? (
            <>
              {t('Join')} <H1 accent>{t('MySocialThing')}</H1>
            </>
          ) : (
            <>
              {t('Join')}{' '}
              <H1 accent>
                {t('Social')} {t('Thing')}
              </H1>
            </>
          )}
        </H1>
        <MyInput
          text={joinCode.length < 10 ? joinCode.toLowerCase() : joinCode.toLowerCase().substring(0, 10)}
          setText={setJoinCode}
          placeholder={'Enter social thing code'}
        />
        <Row
          styles={{
            alignItems: 'center',
            justifyContent: 'space-evenly'
          }}
        >
          <MyButton text={'Cancel'} onPress={handleCancel} />
          <MyButton text={'Join'} onPress={handleJoinSocialThing} accent />
        </Row>
        <Row styles={{ alignItems: 'center', justifyContent: 'center' }}>
          <MyButton text={'Scan QR Code'} onPress={() => setIsScanning(true)} />
        </Row>
      </Column>
      {isScanning && hasPermission !== null && (
        <Modal animationType="slide" transparent={false} visible={isScanning}>
          <View
            style={{
              flex: 1,
              backgroundColor: styles.container.backgroundColor,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {hasPermission === true ? (
              <CameraView
                style={{ width: '90%', height: '70%', borderRadius: 10, overflow: 'hidden' }}
                onBarcodeScanned={handleBarCodeScanned}
              />
            ) : (
              <Text style={{ color: styles.text.color, marginBottom: 20 }}>No access to camera</Text>
            )}
            <MyButton text={'Close'} onPress={() => setIsScanning(false)} />
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

export default JoinSocialThingScreen;
