import { Dropdown } from 'react-native-element-dropdown';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

type DropDownProps = {
  data: { label: string; value: string }[];
  selectedValue: string | null;
  setSelectedValue: (value: string) => void;
};

const DropDown = ({ data, selectedValue, setSelectedValue }: DropDownProps) => {
  const { t } = useTranslation();
  const styles = useThemedStyles();
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      {isFocus || selectedValue ? (
        <Text style={[styles.label, isFocus && { color: styles.accent.color }]}>{t('Set visibility')}</Text>
      ) : null}

      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: styles.accent.color }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? t('Select item') : '...'}
        searchPlaceholder="Search..."
        value={selectedValue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setSelectedValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default DropDown;
