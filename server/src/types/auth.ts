export type Role = "user" | "admin";
export type UserStatus = "active" | "banned";
export interface JwtPayload {
  userId: number;
  email: string;
  role: Role;
  status: UserStatus;
}
