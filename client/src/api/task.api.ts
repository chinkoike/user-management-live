// src/api/task.api.ts
import api from "./auth.api"; // หรือ path ที่คุณเก็บไฟล์ api ตัวนี้ไว้
import type { Task } from "../types/task";

export const getTasks = async (page: number) => {
  const res = await api.get(`/tasks?page=${page}`);

  return res.data;
};

export const createTask = (title: string) =>
  api.post<Task>("/tasks", { title }).then((res) => res.data);

export const updateTask = (id: number, data: Partial<Task>) =>
  api.put<Task>(`/tasks/${id}`, data).then((res) => res.data);

export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);
