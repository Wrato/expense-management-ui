import { useState } from "react";
import type { ReactNode } from "react";

import { AuthContext } from "./AuthContext";
import type { User } from "../models/User";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children
}: AuthProviderProps) {

  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}