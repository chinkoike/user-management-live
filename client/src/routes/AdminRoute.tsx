import { Navigate } from "react-router-dom";
import { useAuthStore } from "../auth/authStore";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, user } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
