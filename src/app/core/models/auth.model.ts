export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  role?: string;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  role?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  expiresInMins?: number;
}
