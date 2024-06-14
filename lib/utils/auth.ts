// import AsyncStorage from '@react-native-async-storage/async-storage'; // Thay thế cho Cookies
// import { useState, useEffect } from 'react'; // Quản lý state React
// import { ITokenInfo } from '@/types/modal/auth'; // Interface token
// // Enum cho các khóa lưu trữ (không thay đổi)
// export enum KEYS {
//   ACCESS_TOKEN = "dana_expert_access_token",
//   REFRESH_TOKEN = "dana_expert_refresh_token",
//   EXPIRES_IN = "dana_expert_expiration_time",
//   USER = "dana_expert_user" // Giả sử bạn vẫn cần lưu thông tin người dùng
// }

// // Custom hook để lấy và đặt token
// export function useToken() {
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const [refreshToken, setRefreshToken] = useState<string | null>(null);
//   const [expiresIn, setExpiresIn] = useState<number | null>(null);

//   // Tải token khi component được mount
//   useEffect(() => {
//     const loadTokens = async () => {
//       const tokenValues = await AsyncStorage.multiGet([
//         KEYS.ACCESS_TOKEN, KEYS.REFRESH_TOKEN, KEYS.EXPIRES_IN
//       ]);

//       setAccessToken(tokenValues[0][1]); // AsyncStorage trả về mảng [key, value]
//       setRefreshToken(tokenValues[1][1]);
//       setExpiresIn(tokenValues[2][1] ? parseInt(tokenValues[2][1], 10) : null);
//     };
//     loadTokens();
//   }, []); // Chỉ chạy một lần khi mount

//   const getToken = () => ({ accessToken, refreshToken, expiresIn });

//   const setToken = async (tokenInfo: ITokenInfo) => { 

//     const createdAt = new Date(tokenInfo.created_at);
//     const expirationTime = new Date(createdAt.getTime() + 7200 * 1000);

//     await AsyncStorage.multiSet([
//       [KEYS.ACCESS_TOKEN, tokenInfo.access_token],
//       [KEYS.REFRESH_TOKEN, tokenInfo.refresh_token],
//       [KEYS.EXPIRES_IN, expirationTime.getTime().toString()]
//     ]);

//     setAccessToken(tokenInfo.access_token);
//     setRefreshToken(tokenInfo.refresh_token);
//     setExpiresIn(expirationTime.getTime());
//   }; 

//   const removeToken = async () => {
//     await AsyncStorage.multiRemove([
//       KEYS.ACCESS_TOKEN, KEYS.REFRESH_TOKEN, KEYS.EXPIRES_IN
//     ]);

//     setAccessToken(null);
//     setRefreshToken(null);
//     setExpiresIn(null);
//   };

//   return { getToken, setToken, removeToken }; 
// }
// export function getAccessToken() {
//   return accessToken;
// }
// // Hàm formatToken không thay đổi
// export const formatToken = (token: string): string => {
//   return "Bearer " + token;
// };

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '@/stores/modules/user';
import type { ITokenInfo } from '@/types/modal/auth';

export enum KEYS {
  ACCESS_TOKEN = "danaexperts_access_token",
  REFRESH_TOKEN = "danaexperts_refresh_token",
  EXPIRES_IN = "danaexperts_expiration_time",
  USER = "danaexperts_user"
}

async function setItem(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting ${key} in AsyncStorage`, error);
  }
}

async function getItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting ${key} from AsyncStorage`, error);
    return null;
  }
}

async function removeItem(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from AsyncStorage`, error);
  }
}

export async function getToken(): Promise<{ accessToken: string | null, refreshToken: string | null, expires: string | null }> {
  return {
    accessToken: await getAccessToken(),
    refreshToken: await getRefreshToken(),
    expires: await getExpiresIn()
  }
}

export async function getAccessToken(): Promise<string | null> {
  return await getItem(KEYS.ACCESS_TOKEN);
}

export async function getRefreshToken(): Promise<string | null> {
  return await getItem(KEYS.REFRESH_TOKEN);
}

export async function getExpiresIn(): Promise<string | null> {
  return await getItem(KEYS.EXPIRES_IN);
}

export async function setToken(tokenInfo: ITokenInfo) {
  console.log('setToken', tokenInfo);

  await setItem(KEYS.ACCESS_TOKEN, tokenInfo.access_token);
  await setItem(KEYS.REFRESH_TOKEN, tokenInfo.refresh_token);

  let createdAt = new Date(tokenInfo.created_at);
  let expirationTime = new Date(createdAt.getTime() + 7200 * 1000);
  console.log('createdAt', createdAt, expirationTime, expirationTime.getTime());

  await setItem(KEYS.EXPIRES_IN, expirationTime.getTime().toString());
}

export async function removeToken() {
  await removeItem(KEYS.ACCESS_TOKEN);
  await removeItem(KEYS.REFRESH_TOKEN);
  await removeItem(KEYS.EXPIRES_IN);
}

export const formatToken = (token: string): string => {
  return "Bearer " + token;
};
