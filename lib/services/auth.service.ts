import { fetchWrapper } from '@/http/fetch-wrapper';
import type { IUser } from '@/types/IUser';

const baseUrl = 'http://10.0.2.2:8101/api/v1';

interface UserResponse {
    data: IUser;
    status: string;
}
export const loginApi = async (email: string, password: string): Promise<any> => {
    return fetchWrapper.post(`${baseUrl}/user/auth/login`, {
        email,
        password,
        role: 'USER'
    });
};
