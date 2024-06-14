import { fetchWrapper } from '@/http/fetch-wrapper';
const baseUrl = 'http://localhost:8101/api';

import type { IUser } from '@/types/IUser';

interface UserResponse {
    data: IUser;
}

export const getInforApi = async (): Promise<UserResponse> => {
    return fetchWrapper.get(`${baseUrl}/user`);
};
