import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/auth.api";
import LogoutButton from "../components/Logout";
import type { DashboardResponse, DashboardStats } from "../types/dashboard";
import type { User } from "../types/user";
import TaskSkeleton from "../components/TaskSkeleton";
import { useAuthStore } from "../auth/authStore";
import { StatCard } from "../components/Dashboard/StatCard";
import { UserTable } from "../components/Dashboard/UserTable";
import CreateUser from "../components/Dashboard/CreateUser";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { user } = useAuthStore();
  useEffect(() => {
    api
      .get<DashboardResponse>("/dashboard")
      .then((res) => {
        setStats(res.data.stats);
        setUsers(res.data.users);
      })
      .catch(() => navigate("/403"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChangeRole = async (userId: number, role: "admin" | "user") => {
    const res = await api.patch(`/dashboard/${userId}/role`, { role });

    setUsers((prev) => prev.map((u) => (u.id === userId ? res.data : u)));
  };

  const handleChangeStatus = async (
    userId: number,
    status: "active" | "banned",
  ) => {
    const res = await api.patch(`/dashboard/${userId}/status`, { status });

    setUsers((prev) => prev.map((u) => (u.id === userId ? res.data : u)));
  };

  const handleCreateUser = async (data: {
    email: string;
    password: string;
    role: "user" | "admin";
  }) => {
    try {
      const res = await api.post("/dashboard/user", data);

      // ✅ เพิ่ม user ใหม่เข้า state
      setUsers((prev) => [res.data.user, ...prev]);

      setOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <TaskSkeleton />;

  return (
    <div className=" p-6 space-y-6">
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <StatCard title="Users" value={stats.users} />
          <StatCard title="Tasks" value={stats.tasks} />
          <StatCard title="Pending" value={stats.pendingTasks} />
        </div>
      )}
      <div className="flex  justify-center items-center ">
        <input
          type="text"
          placeholder="ค้นหา email ผู้ใช้..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-400 rounded px-3 py-2 w-full md:w-4xl text-gray-700 "
        />
      </div>
      <UserTable
        users={filteredUsers}
        onChangeRole={handleChangeRole}
        onChangeStatus={handleChangeStatus}
        currentAdminId={user?.id || 0}
      />
      <div className="flex justify-between items-center">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
        >
          + เพิ่มผู้ใช้
        </button>
        <LogoutButton />
      </div>
      <CreateUser
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
}
