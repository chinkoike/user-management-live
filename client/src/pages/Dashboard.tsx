import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/auth.api";
import LogoutButton from "../components/Logout";
import type { DashboardResponse, DashboardStats } from "../types/dashboard";
import type { User } from "../types/user";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-6">
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <StatCard title="Users" value={stats.users} />
          <StatCard title="Tasks" value={stats.tasks} />
          <StatCard title="Pending" value={stats.pendingTasks} />
        </div>
      )}

      <UserTable users={users} onChangeRole={handleChangeRole} />
      <LogoutButton />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function UserTable({
  users,
  onChangeRole,
}: {
  users: User[];
  onChangeRole: (userId: number, role: "admin" | "user") => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="px-4 py-2">{u.email}</td>

              <td className="px-4 py-2 text-center">
                <select
                  value={u.role}
                  onChange={(e) =>
                    onChangeRole(u.id, e.target.value as "admin" | "user")
                  }
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>

              <td className="px-4 py-2 text-center">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
