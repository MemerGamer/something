import { StyleSheet } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const useThemedStyles = () => {
  const { colors } = useContext(ThemeContext);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      color: colors.text
    },
    text: {
      color: colors.text
    },
    button: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 8
    },
    accent: {
      color: colors.accent,
      backgroundColor: colors.accent,
      borderColor: colors.accent
    },
    streakChip: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 10,
      backgroundColor: colors.accent
    },
    streakChipText: {
      color: colors.alwaysWhite,
      fontWeight: '600'
    },
    column: {
      backgroundColor: colors.secondary,
      borderColor: colors.secondaryBorder
    },
    image: {
      backgroundColor: colors.imageBackground
    },
    cardContainer: {
      backgroundColor: colors.secondary,
      borderColor: colors.secondaryBorder,
      color: colors.text,
      borderWidth: 1,
      borderRadius: 8,
      padding: 16
    },
    cardTime: {
      fontSize: 12,
      color: colors.smallNBigText
    },
    H1: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.smallNBigText,
      textAlign: 'center'
    },
    H2: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.smallNBigText
    },
    H3: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.smallNBigText
    },
    H4: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.smallNBigText
    },
    camera: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      zIndex: 2,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: 50
    },
    shutter: {
      width: 70,
      height: 70,
      borderRadius: 100,
      borderWidth: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 50,
      marginRight: 20,
      marginLeft: 50
    },
    send: {
      width: 100,
      height: 50,
      flexDirection: 'row',
      gap: 10,
      borderWidth: 2,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 50,
      marginRight: 20
    },
    retake: {
      width: 100,
      height: 50,
      flexDirection: 'row',
      gap: 10,
      borderWidth: 2,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 50,
      marginRight: 20,
      marginLeft: 20
    },
    change: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10
    },
    cameraContainer: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    cameraButton: {
      marginTop: 20
    },
    socialThingContainer: {
      flex: 1,
      paddingTop: 30,
      paddingVertical: 20,
      paddingHorizontal: 23
    },
    underLine: {
      textDecorationLine: 'underline'
    },
    bigText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.smallNBigText
    },
    cursive: {
      fontFamily: 'Caveat',
      fontWeight: 'normal',
      fontSize: 26
    },
    headerAccent: {
      color: colors.accent
    },
    label: {
      color: colors.smallNBigText,
      fontWeight: '500',
      fontSize: 12
    },
    row: {
      flexDirection: 'row'
    },
    myButton: {
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderColor: colors.accent,
      borderWidth: 2
    },
    myButtonAccent: {
      borderWidth: 2,
      borderColor: colors.accent
    },
    input: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: colors.secondary,
      paddingVertical: 8,
      paddingHorizontal: 12
    },
    error: {
      borderColor: colors.error,
      color: colors.error
    },
    homeContainer: {
      flex: 1,
      paddingTop: 30,
      paddingVertical: 20,
      paddingHorizontal: 23
    },
    alwaysWhiteText: {
      color: colors.alwaysWhite
    },
    loadingOverlayContainer: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    loadingOverlayInnerContainer: {
      borderRadius: 10,
      alignItems: 'center',
      padding: 20
    },
    loadingOverlayIndicator: {
      marginBottom: 15
    },
    loadingOverlayMessage: {
      color: '#fff',
      fontSize: 24,
      fontWeight: '400'
    },
    disabledButton: {
      borderWidth: 2,
      borderColor: colors.disabledBorder,
      backgroundColor: colors.disabledBackground,
      color: colors.disabledText
    }
  });
};
