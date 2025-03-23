import { ScrollView } from 'react-native-gesture-handler';
import Column from '../../components/atoms/Column';
import H1 from '../../components/atoms/H1';
import MyInput from '../../components/molecules/MyInput';
import MyButton from '../../components/molecules/MyButton';
import { useJoinSocialThingScreenLogic } from './JoinSocialThingScreen.logic';
import Row from '../../components/atoms/Row';
import { useTranslation } from 'react-i18next';
import i18n from '../../services/i18n';

const JoinSocialThingScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const isHungarian = i18n.language === 'hu';

  const { handleCancel, handleJoinSocialThing, joinCode, setJoinCode } = useJoinSocialThingScreenLogic(navigation);

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
      </Column>
    </ScrollView>
  );
};

export default JoinSocialThingScreen;
