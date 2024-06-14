import { defineStore } from 'react-mise';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router'

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        returnUrl: '',
    }),
    actions: {
        async login(email: string, password: string) {},
        logout() {
            AsyncStorage.removeItem('refresh_token');
            AsyncStorage.removeItem('access_token');
           
            router.push("/login")
        },
    },
});
