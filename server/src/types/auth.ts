export type Role = "user" | "admin";

export interface JwtPayload {
  userId: number;
  email: string;
  role: Role;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface RefreshBody {
  refreshToken: string;
}
