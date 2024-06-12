import { useState } from 'react';

export const useAuthStore = () => {
    const [authStore, setAuthStore] = useState({
        user: null,
        isLoggedIn: false,
    })

    const setAuthStoreData = (data) => {
        setAuthStore(data);
    };
    return {
        authStore,
        setAuthStoreData,
    }
}