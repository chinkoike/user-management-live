import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ใช้ Link สำหรับสลับไปหน้า Login
import axios from "axios";
import api from "../api/auth.api";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // 1. ตรวจสอบข้อมูลเบื้องต้น (Client-side Validation)
    if (!email || !password || !confirm) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (password !== confirm) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    try {
      setLoading(true);

      // 2. ส่งข้อมูลไปที่ Backend (Route: /auth/register)
      await api.post("/auth/register", {
        email,
        password,
        role: "user", // สามารถส่ง role เริ่มต้นไปได้เลย
      });

      // 3. ถ้าสำเร็จ ให้แจ้งเตือนและส่งไปหน้า Login
      alert("สมัครสมาชิกสำเร็จเรียบร้อยแล้ว!");
      navigate("/login");
    } catch (err) {
      // 4. จัดการ Error จาก Backend (เช่น อีเมลซ้ำ)
      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message;
        setError(serverMessage || "ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่");
      } else {
        setError("เกิดข้อผิดพลาดที่ไม่รู้จัก");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-3xl font-extrabold text-gray-800">
          Create Account
        </h1>
        <p className="text-center text-gray-500 text-sm">
          สมัครสมาชิกเพื่อเริ่มต้นใช้งาน
        </p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="text-xs text-red-600 font-medium">{error}</p>
          </div>
        )}

        <AuthInput
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <AuthButton text="Sign Up" loading={loading} />

        <div className="text-center text-sm text-gray-600 pt-2">
          มีบัญชีอยู่แล้ว?{" "}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            เข้าสู่ระบบที่นี่
          </Link>
        </div>
      </form>
    </div>
  );
}
