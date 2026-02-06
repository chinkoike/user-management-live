import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // นำเข้า AxiosError
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import api from "../api/auth.api";
import { useAuthStore } from "../auth/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    if (!token || !user) return;

    if (user.role === "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/tasks", { replace: true });
    }
  }, [token, user, navigate]);
  // ✅ แก้ไข: ระบุ Type ให้ชัดเจน และใช้ React.FormEvent
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("กรุณากรอก email และ password");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/login", { email, password });
      const { accessToken, user } = response.data;

      setAuth(accessToken, user);
      if (response.data.user.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/tasks", { replace: true });
      }
    } catch (err) {
      // ✅ แก้ไข: กำจัด 'any' โดยการเช็คว่าเป็น AxiosError หรือไม่
      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message;
        setError(serverMessage || "Email หรือ Password ไม่ถูกต้อง");
      } else {
        setError("เกิดข้อผิดพลาดที่ไม่รู้จัก");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <h1 className="text-center text-2xl font-bold">Login</h1>

        {error && (
          <p className="text-center text-sm text-red-500 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthButton text="Login" loading={loading} />
        <div className="text-center text-sm text-gray-600 pt-2">
          ยังไม่มีบัญชี?{" "}
          <Link
            to="/register"
            className="font-bold text-blue-600 hover:underline"
          >
            สมัครสมาชิกที่นี่
          </Link>
        </div>
      </form>
    </div>
  );
}
