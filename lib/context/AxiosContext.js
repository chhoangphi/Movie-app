import axios from 'axios'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
const excludeUrls = ['/oauth/token', '/refresh_tokens']
import { refreshAccessToken } from '../services/token.service'

const axiosApiInstance = axios.create()

axiosApiInstance.defaults.baseURL = "http:///10.0.2.2:8101/api/v1"

axiosApiInstance.interceptors.request.use(
  
  async (config) => {
    const accessToken = await AsyncStorage.getItem('accessToken')
    console.log(accessToken)
    if (config.authorization !== false) {
      config.headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      }
    }
    return config
  },
  (error) => {
   
    Promise.reject(error)
  }
)
// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
  
  (response) => {
    console.log(response)
    return response
  },
  async function (error) {
    const originalRequest = error.config
    console.log(excludeUrls.includes(originalRequest.url))
    if (
      // error.response &&
      error.response?.status === 403 &&
      !originalRequest._retry &&
      !excludeUrls.includes(originalRequest.url)
    ) {
      console.log('sdfsfsf')
      originalRequest._retry = true
      try {
        const token = await refreshAccessToken()
        console.log(token)
        await AsyncStorage.setItem('accessToken', token.data.access_token)
        await AsyncStorage.setItem('refreshToken', token.data.refresh_token)
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token.data.access_token
        return axiosApiInstance(originalRequest)
      } catch (error) {
        router.push('/sign-in')
      }
    }
    return Promise.reject(error)
  }
)

export default axiosApiInstance
