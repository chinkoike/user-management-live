export type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}
