import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseRepository from '../BaseRepository';
import ApiService, { ApiResponse } from '../../services/ApiService';

const api = new ApiService();

export default class CameraRepository extends BaseRepository {
  async uploadImage(image: string, uuid: string) {
    const body = new FormData();
    // @ts-ignore
    body.append('image', {
      uri: image,
      name: 'image.jpg',
      type: 'image/jpeg'
    });
    body.append('thingId', uuid);

    const data = await this.api.postFormData<ApiResponse<typeof api.client.images.upload.$post, 200>>('images/upload', {
      body,
      token: (await AsyncStorage.getItem('accessToken')) || ''
    });

    if (!data) {
      throw Error('No data from image upload');
    }

    return data;
  }
}
