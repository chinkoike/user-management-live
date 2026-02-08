import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    email: string;
    password: string;
    role: "user" | "admin";
  }) => void;
}

export default function CreateUser({ open, onClose, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">สร้างผู้ใช้ใหม่</h2>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-400 rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-400 rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="w-full border border-gray-400 rounded px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "admin")}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            ยกเลิก
          </button>

          <button
            onClick={() => onSubmit({ email, password, role })}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            สร้าง
          </button>
        </div>
      </div>
    </div>
  );
}
