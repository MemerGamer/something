import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

type BigTextProps = {
  children: React.ReactNode;
  accent?: boolean;
  underLine?: boolean;
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

const BigText = ({ children, accent, underLine }: BigTextProps) => {
  const { t } = useTranslation();
  const styles = useThemedStyles();
  return (
    <Text style={[styles.bigText, accent && styles.headerAccent, underLine && styles.underLine]}>
      {translateChildren(children, t)}
    </Text>
  );
};

export default BigText;
