import { useEffect, useState } from "react";
import { getTasks } from "../api/task.api";
import type { Task } from "../types/task";
import TaskForm from "../components/Tasks/TaskForm";
import TaskList from "../components/Tasks/TaskList";
import TaskPagination from "../components/Tasks/TaskPagination";
import LogoutButton from "../components/Logout";
import TaskSkeleton from "../components/TaskSkeleton";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 🔹 โหลดข้อมูลตอน mount / เปลี่ยนหน้า
  useEffect(() => {
    let cancelled = false;

    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const result = await getTasks(page);

        if (!cancelled) {
          setTasks(result.tasks);
          setTotalPages(result.totalPages);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchTasks();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const refreshTasks = async () => {
    const result = await getTasks(page);
    setTasks(result.tasks);
    setTotalPages(result.totalPages);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      {isLoading && <TaskSkeleton />}

      {/* Title */}

      <h1 className="text-3xl font-bold text-gray-800 mb-6">จัดการงานของฉัน</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <TaskForm onSuccess={refreshTasks} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-75">
          <TaskList tasks={tasks} onChange={refreshTasks} />
        </div>

        <div className="flex justify-center pt-4">
          <TaskPagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </div>
        <div className="flex justify-end">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
