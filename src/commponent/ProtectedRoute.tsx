import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

export const ProtectedRoute = () => {
  const token = useAppSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};