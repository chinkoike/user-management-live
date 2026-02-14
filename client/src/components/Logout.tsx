import { useAuthStore } from "../auth/authStore";
import { useNavigate } from "react-router-dom";
import api from "../api/auth.api";

export default function LogoutButton() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1️ แจ้ง backend ให้ clear refreshToken (cookie)
      await api.post("/auth/logout");
    } catch (err) {
      //  ต่อให้ backend พัง ก็ logout ฝั่ง client ต่อ
      console.warn("Logout API failed", err);
    } finally {
      // 2️ เคลียร์ client state
      clearAuth();

      // 3️ กลับหน้า login
      navigate("/login", { replace: true });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-2 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700"
    >
      Logout
    </button>
  );
}
