export const UserRole = {
  Admin: "ADMIN",
  Accountant: "ACCOUNTANT",
  Employee: "EMPLOYEE",
  Approver: "APPROVER"
} as const;

export type UserRole =
  (typeof UserRole)[keyof typeof UserRole];