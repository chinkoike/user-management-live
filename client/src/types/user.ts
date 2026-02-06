export type User = {
  id: number;
  email: string;
  role: "admin" | "user";
  createdAt: string;
};
export type AuthContextType = {
  user: User | null;
  loading: boolean;
};
