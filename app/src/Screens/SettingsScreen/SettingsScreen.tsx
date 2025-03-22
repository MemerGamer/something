import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Column from '../../components/atoms/Column';
import { useSettingsScreenLogic } from './SettingsScreen.logic';
import { useEffect } from 'react';
import H1 from '../../components/atoms/H1';
import H3 from '../../components/atoms/H3';
import Row from '../../components/atoms/Row';
import MyButton from '../../components/molecules/MyButton';

const SettingsScreen = ({ navigation }: any) => {
  const logic = useSettingsScreenLogic();

  useEffect(() => {
    // logic.getData();
  }, []);

  //   if (!logic.settings) {
  //     return (
  //       <Column
  //         styles={{
  //           flex: 1,
  //           justifyContent: 'center',
  //           alignItems: 'center'
  //         }}
  //       >
  //         <ActivityIndicator size={'large'} />
  //       </Column>
  //     );
  //   }

  return (
    <Column
      scrollable
      styles={{
        flex: 1,
        paddingTop: 30,
        paddingVertical: 20,
        paddingHorizontal: 23,
        gap: 10
      }}
    >
      <H1>
        Set-<H1 accent>Things</H1>
      </H1>
      <MyButton accent smalltext text="Change Username" onPress={logic.handleChangeUsername} />
      <MyButton
        accent
        smalltext
        text={logic.requestSent ? 'Organization Request Sent' : 'Request Organization Role'}
        onPress={logic.handleRequestOrganizationRole}
        disabled={logic.requestSent}
      />
      <Row styles={{ justifyContent: 'space-between', alignItems: 'center', gap: 5 }}>
        <MyButton accent smalltext text="Light" onPress={logic.handleToggleTheme} />
        <MyButton accent smalltext text="Dark" onPress={logic.handleToggleTheme} />
        <MyButton accent smalltext text="System" onPress={logic.handleToggleTheme} />
      </Row>
      <Column
        styles={{
          bottom: 0
        }}
      >
        <MyButton accent smalltext text="Log out" onPress={logic.handleLogout} />
      </Column>
    </Column>
  );
};

const styles = StyleSheet.create({});
export default SettingsScreen;
