import { createContext} from "react";

import type { User } from "../models/User";

interface AuthContextType {
    user: User | null;
    login(user: User): void;
    logout(): void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
