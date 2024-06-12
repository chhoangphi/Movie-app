export interface ILoginRequest {
    email: string;
    password: string;
  }
  
export interface ITokenInfo {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    created_at: number;
  }