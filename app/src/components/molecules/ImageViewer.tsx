import { DimensionValue, Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Column from '../atoms/Column';
import H2 from '../atoms/H2';
import H4 from '../atoms/H4';
import ApiService from '../../services/ApiService';
import Row from '../atoms/Row';
import { DateTime } from 'luxon';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTranslation } from 'react-i18next';

type ImageViewerProps = {
  uri: string;
  name?: string;
  username: string;
  createdAt: string;
  simple?: boolean;
  style?: {
    width?: number | string;
    height?: number | string;
  };
};

const api = new ApiService();

const ImageViewer = ({ uri, createdAt, name, username, simple = false, style }: ImageViewerProps) => {
  const { t } = useTranslation();
  const styles = useThemedStyles();
  const [image, setImage] = useState('');
  // console.log('createdAt', createdAt);
  // console.log(
  //   'createdAt DateTime',
  //   DateTime.fromSQL(createdAt, { zone: 'utc' }).toJSDate().toLocaleString()
  // );
  const date = DateTime.fromSQL(createdAt, { zone: 'utc' }).toLocal().toLocaleString({
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });

  useEffect(() => {
    (async () => {
      const filename = uri.split('/')[4];
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

  if (simple) {
    return (
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: image }}
          style={{
            width: (style?.width as DimensionValue) ?? '100%',
            height: (style?.height as DimensionValue) ?? 150,
            resizeMode: 'contain',
            backgroundColor: styles.image.backgroundColor,
            borderRadius: 5
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: 8,
            borderRadius: 0
          }}
        >
          <Text style={{ color: 'white', fontSize: 10 }}>{t(date)}</Text>
        </View>
      </View>
    );
  }

  return (
    <Column
      styles={{
        backgroundColor: styles.column.backgroundColor,
        borderColor: styles.column.borderColor,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 16
      }}
    >
      <Image
        source={{ uri: image }}
        style={{
          width: '100%',
          height: 417,
          resizeMode: 'contain',
          backgroundColor: styles.image.backgroundColor,
          borderRadius: 5,
          marginBottom: 16
        }}
      />
      <Row styles={{ justifyContent: 'space-between', width: '100%', alignItems: 'flex-end' }}>
        <Column styles={{ gap: 5 }}>
          {name && <H2 cursive>{name}</H2>}
          <H4 cursive accent>
            @{username}
          </H4>
        </Column>
        <Column>
          <H2 cursive>
            {date} {}
          </H2>
        </Column>
      </Row>
    </Column>
  );
};

export default ImageViewer;
