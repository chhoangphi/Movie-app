import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
axios.defaults.baseURL = "http://10.0.2.2:8101/api/v1"

export const refreshAccessToken = async () => {
    const refreshToken = await AsyncStorage.getItem('refreshToken')
    // console.log(refreshToken)
    const data = {
      refresh_token: refreshToken,
    }
    return await axios.post(`/refresh_tokens`, data)
  }