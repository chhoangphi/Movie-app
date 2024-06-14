// refactor user store
import { defineStore } from "react-mise"
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { IUser } from '@/types/IUser';
import { getInforApi } from '@/services/user.service';

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: null as IUser | null,
        token: {
            access: '',
        },
        returnUrl: '',
    }),
    actions: {
        setUser(user: IUser) {
            this.user = user;
        },
        async getInfo() {
            return getInforApi();
        },
        setToken(access: string) {
            if (access) {
                this.token.access = access;
                AsyncStorage.setItem('access_token', access);
            }
        },
    },
});
