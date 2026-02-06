import type { User } from "./user";

export type DashboardStats = {
  users: number;
  tasks: number;
  pendingTasks: number;
};

export type DashboardResponse = {
  stats: DashboardStats;
  admin: {
    id: number;
    role: "admin";
  };
  users: User[];
};
