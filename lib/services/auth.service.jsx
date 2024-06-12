import axiosApiInstance from '../context/AxiosContext'
import axios from 'axios'

axios.defaults.baseURL = "http://10.0.2.2:8101/api/v1"

export const loginApi = async (data) => {
  return await axiosApiInstance.post(`/oauth/token`, data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'no-cors',
  })
}
export const registerApi = async (data) => {
  return await axiosApiInstance.post(`/user/sign-up`, data)
}
export const getInfo = async () => {
  return await axiosApiInstance.get(`/user`)
}
