export type Role = "user" | "admin";
export type UserStatus = "active" | "banned";
export interface JwtPayload {
  userId: number;
  email: string;
  role: Role;
  status: UserStatus;
}

export interface LoginBody {
  email: string;
  password: string;
  role?: Role;
}

export interface RegisterBody {
  email: string;
  password: string;
  role?: Role;
}
