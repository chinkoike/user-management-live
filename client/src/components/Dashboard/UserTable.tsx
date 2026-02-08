import type { User } from "../../types/user";

export function UserTable({
  users,
  onChangeRole,
  onChangeStatus,
  currentAdminId,
}: {
  users: User[];
  onChangeRole: (userId: number, role: "admin" | "user") => void;
  onChangeStatus: (userId: number, status: "active" | "banned") => void;
  currentAdminId: number;
}) {
  return (
    <div className=" bg-white rounded-xl  shadow overflow-x-auto">
      <table className="w-full text-sm justify-center ">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-center">Role</th>
            <th className="px-4 py-2 text-center">Status</th>
            <th className="px-4 py-2 text-center">Created</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => {
            const isSelf = u.id === currentAdminId;
            const isBanned = u.status === "banned";

            return (
              <tr key={u.id} className="border-t border-gray-200">
                {/* Email */}
                <td className="px-4 py-2">{u.email}</td>

                {/* Role */}
                <td className="px-4 py-2 text-center">
                  <select
                    value={u.role}
                    disabled={isBanned}
                    onChange={(e) =>
                      onChangeRole(u.id, e.target.value as "admin" | "user")
                    }
                    className="border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                {/* Status */}
                <td className="px-4 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                ${
                  isBanned
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
                  >
                    {u.status}
                  </span>
                </td>

                {/* Created */}
                <td className="px-4 py-2 text-center">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>

                {/* Action */}
                <td className="px-4 py-2 text-center">
                  {!isSelf && (
                    <button
                      onClick={() =>
                        onChangeStatus(u.id, isBanned ? "active" : "banned")
                      }
                      className={`px-3 py-1 rounded text-xs font-medium
                  ${
                    isBanned
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                    >
                      {isBanned ? "Unban" : "Ban"}
                    </button>
                  )}

                  {isSelf && <span className="text-gray-400 text-xs">You</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
