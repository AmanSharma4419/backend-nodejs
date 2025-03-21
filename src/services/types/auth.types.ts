export interface IUserCredentials {
  email: string;
  password: string;
}

export interface ISignupData extends IUserCredentials {
  name: string;
}

export interface IAuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface IAuthService {
  signup(data: ISignupData): Promise<IAuthResponse>;
  login(credentials: IUserCredentials): Promise<IAuthResponse>;
} 