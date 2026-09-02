import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../models/UserRole";

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleRoute({
  children,
  allowedRoles
}: RoleRouteProps) {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}