export const UserRole = {
  Admin: "ADMIN",
  Accountant: "ACCOUNTANT",
  Employee: "EMPLOYEE"
} as const;

export type UserRole =
  (typeof UserRole)[keyof typeof UserRole];