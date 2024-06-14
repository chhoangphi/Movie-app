import { useAuthStore } from './auth.store';
import { useUserStore } from './user.store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const initAuthStore = async () => {
    const [ userStore ] = useUserStore();
    const access_token = await AsyncStorage.getItem('access_token') as string;
    try {
        if (access_token) {
            userStore.setToken(access_token);
            //   try {
            const user = await userStore.getInfo();
            userStore.setUser(user.data);
            console.log('LOG: user', user);
            //     authStore.setAuthStore({
            //       user: data,
            //       isLoggedIn: true,
            //     })
            //   } catch (error) {
            //     console.log(error)
            //     localStorage.removeItem('access_token')
            //     localStorage.removeItem('refresh_token')
            //     window.location.reload()
            //   }
            //   console.log('initAuthStore', authStore)
            // }
        }
    } catch (error) {
        console.log(error);
    }
};

export { useAuthStore } from './auth.store';
export { useUserStore } from './user.store';
