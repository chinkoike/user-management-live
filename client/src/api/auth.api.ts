import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { useAuthStore } from "../auth/authStore";

const api = axios.create({
  baseURL: process.env.VITE_API_URL,
  withCredentials: true,
});

// REQUEST: ใส่ token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE: จัดการ Token หมดอายุ
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // 1. เช็คว่า Error 401 และยังไม่ได้พยายามรีเฟรช (ป้องกันลูป)
    // และต้องไม่ใช่การรีเฟรชที่ตัวมันเองล้มเหลว
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true; // ทำเครื่องหมายว่ากำลังพยายามรีเฟรช

      try {
        const res = await axios.post(
          "http://localhost:3000/auth/refresh",
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data.accessToken;
        const userData = res.data.user; // ถ้า Backend ส่ง user มาด้วย

        // 2. อัปเดต Zustand Store
        useAuthStore.getState().setAuth(newAccessToken, userData);

        // 3. ยิง Request เดิมซ้ำด้วย Token ใหม่
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 4. ถ้า Refresh ไม่สำเร็จ (เช่น Refresh Token หมดอายุ)
        useAuthStore.getState().clearAuth(); // ใช้ฟังก์ชันเคลียร์ค่า
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
