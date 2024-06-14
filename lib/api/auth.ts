import { http } from "@/utils/http";

import type { DataResponse } from "@/types/common";
import type { ITokenInfo, ILoginRequest } from "@/types/modal/auth";

export const getLogin = (data: ILoginRequest) => {
  return http.request<DataResponse<ITokenInfo>>("post", "/oauth/token", { data });
};

export const refreshTokenApi = (refresh_token: string) => {
  return http.request<DataResponse<ITokenInfo>>("post", "/oauth/refresh-token", { data: { refresh_token } });
}

export const logout = () => {
  return http.request<DataResponse<null>>("post", "/oauth/revoke");
}