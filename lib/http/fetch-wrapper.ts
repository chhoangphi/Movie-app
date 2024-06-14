import { useAuthStore, useUserStore } from '@/stores';
import 'dotenv/config'

import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = 'http://localhost:8101/api/v1';

export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE'),
    patch: request('PATCH'),
};

function request(method: string) {
    return async (url: string, body?: any) => {
        const requestOptions: any = {
            method,
            headers: authHeader(url),
        };
        if (body) {
            if (body instanceof FormData) {
                requestOptions.body = body;
                // Don't set Content-Type for FormData, browser will set it automatically
            } else {
                requestOptions.headers['Content-Type'] = 'application/json';
                requestOptions.body = JSON.stringify(body);
            }
        }
        const response = await fetch(url, requestOptions);
        return handleResponse({ url, requestOptions }, response);
    };
}

// Helper functions

function authHeader(url: string) {
    const [ token ] = useUserStore();
    const isLoggedIn = true; // Assuming the user is logged in for now
    const isApiUrl = url.startsWith(baseUrl);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${token.token.access}` };
    } else {
        return {};
    }
}

async function handleResponse(request: any, response: any) {
    const text = await response.text();
    const data = text && JSON.parse(text);

    if (!response.ok) {
        const [ userStore ] = useUserStore();
        const [ logout ] = useAuthStore();
        let responseT: any = null;

        if ([401, 403].includes(response.status)) {
            const refresh_token =await AsyncStorage.getItem('refresh_token') as string;
            if (!refresh_token) {
                console.log('LOG: Refresh token not found.');
                logout.logout();
            } else {
                try {
                    responseT = await fetch(`${baseUrl}/user/refresh_tokens`, {
                        method: 'POST',
                        body: JSON.stringify({ refresh_token }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const refreshData = await getRawResponse(responseT);
                    await AsyncStorage.setItem('refresh_token', refreshData.data.refresh_token);
                    userStore.setToken(refreshData.data.access_token);

                    if (responseT.ok) {
                        const newOption = {
                            ...request.requestOptions,
                            headers: authHeader(request.url),
                        };
                        const retryResponse = await fetch(request.url, newOption);
                        return handleResponse(null, retryResponse);
                    }
                } catch (error) {
                    logout.logout();
                    return Promise.reject(error);
                }
            }
        }

        if (responseT && [401, 403].includes(responseT.status)) {
            logout.logout();
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }

    console.log('fetchWrapper', data);
    return data;
}

async function getRawResponse(response: any) {
    const text = await response.text();
    const data = text && JSON.parse(text);
    return data;
}
