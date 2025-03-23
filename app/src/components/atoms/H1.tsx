import { StyleSheet, Text, TextStyle, View } from 'react-native';
import React from 'react';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

type H1Props = {
  children: React.ReactNode;
  accent?: boolean;
};

const translateChildren = (children: React.ReactNode, t: TFunction): React.ReactNode => {
  if (typeof children === 'string') {
    return t(children);
  }
  if (Array.isArray(children)) {
    return children.map((child) => translateChildren(child, t));
  }
  return children;
};

const H1 = ({ children, accent }: H1Props) => {
  const { t } = useTranslation();
  const styles = useThemedStyles();
  return (
    <Text style={[styles.H1, { color: styles.text.color }, accent && styles.headerAccent]}>
      {translateChildren(children, t)}
    </Text>
  );
};

export default H1;
