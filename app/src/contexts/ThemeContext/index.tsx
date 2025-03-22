import { Appearance } from 'react-native';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

const lightColors = {
  background: '#ffffff',
  text: '#000000',
  accent: '#16a34a',
  primary: '#1E88E5',
  secondary: '#f5f5f5',
  secondaryBorder: '#e0e0e0',
  imageBackground: '#a5d1b5',
  smallNBigText: '#404040',
  error: '#d60202',
  alwaysWhite: '#ffffff',
  disabledBorder: '#999999',
  disabledBackground: '#cccccc',
  disabledText: '$666666'
};

const darkColors = {
  background: '#000000',
  text: '#ffffff',
  accent: '#16a34a',
  primary: '#BB86FC',
  secondary: '#424242',
  secondaryBorder: '#878787',
  imageBackground: '#5a7062',
  smallNBigText: '#bababa',
  error: '#d60202',
  alwaysWhite: '#ffffff',
  disabledBorder: '#999999',
  disabledBackground: '#cccccc',
  disabledText: '$666666'
};

interface ThemeContextType {
  theme: 'light' | 'dark' | null;
  colors: typeof lightColors;
  useDeviceTheme: boolean;
  toggleTheme: (mode: 'light' | 'dark' | 'system') => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: lightColors,
  useDeviceTheme: true,
  toggleTheme: () => {}
});

export const ThemeConsumer = ({ children }: any) => (
  <ThemeContext.Consumer>
    {(context) => {
      if (context === undefined) {
        throw new Error('ThemeConsumer must be used within a ThemeProvider');
      }
      return children;
    }}
  </ThemeContext.Consumer>
);

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(Appearance.getColorScheme() || 'light');
  const [useDeviceTheme, setUseDeviceTheme] = useState(true);

  const themeChangeListener = useCallback(() => {
    if (useDeviceTheme) {
      setTheme(Appearance.getColorScheme() || 'light');
    }
  }, [useDeviceTheme]);

  useEffect(() => {
    const themeListener = Appearance.addChangeListener(themeChangeListener);
    return () => themeListener.remove();
  }, [themeChangeListener]);

  const toggleTheme = () => {
    if (useDeviceTheme) {
      setUseDeviceTheme(false);
      setTheme(theme === 'light' ? 'dark' : 'light'); // Manual override
    } else {
      setUseDeviceTheme(true);
      setTheme(Appearance.getColorScheme() || 'light'); // Reset to system
    }
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  const MemoizedValue = useMemo(
    () => ({
      theme,
      colors,
      useDeviceTheme,
      toggleTheme
    }),
    [theme, useDeviceTheme]
  );

  return <ThemeContext.Provider value={MemoizedValue}>{children}</ThemeContext.Provider>;
};
