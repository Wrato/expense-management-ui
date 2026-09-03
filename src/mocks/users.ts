import type { User } from "../models/User";
import { UserRole } from "../models/UserRole";

export const users: User[] = [
  {
    id: 1,
    username: "admin",
    password: "1234",
    name: "Admin",
    role: UserRole.Admin,
    companyId: null,
    phone: null
  },
  {
    id: 2,
    username: "marcos",
    password: "1234",
    name: "Marcos",
    role: UserRole.Employee,
    companyId: 1,
    phone: "56911111111"
  },
  {
    id: 3,
    username: "fernando",
    password: "1234",
    name: "Fernando",
    role: UserRole.Employee,
    companyId: 1,
    phone: "56922222222"
  },
  {
    id: 4,
    username: "maria",
    password: "1234",
    name: "María",
    role: UserRole.Accountant,
    companyId: 1,
    phone: null
  }
];