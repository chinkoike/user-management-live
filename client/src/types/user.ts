export type User = {
  id: number;
  email: string;
  role: "admin" | "user";
  status: "active" | "banned";
  createdAt: string;
};
