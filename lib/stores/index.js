import { useAuthStore } from './auth.store'
import { getInfo } from '../services/auth.service'
import AsyncStorage from '@react-native-async-storage/async-storage'
import setAuthStoreData from './auth.store'

export const initAuthStore = async () => {
  const authStore = useAuthStore()
  if (await AsyncStorage.getItem('accessToken')) {
    try {
      const { data } = await getInfo()
      console.log(data)
      authStore.setAuthStoreData({
        user: data,
        isLoggedIn: true,
      })
    } catch (error) {
      console.log(error)
      AsyncStorage.removeItem('accessToken')
      AsyncStorage.removeItem('refreshToken')
    }
    console.log('initAuthStore', authStore)
  }
}