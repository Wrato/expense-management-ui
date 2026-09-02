import { UserRole } from "./UserRole";

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  companyId: number | null;
}