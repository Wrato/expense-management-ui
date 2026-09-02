import type { ExpenseClaimStatus } from "./ExpenseClaimStatus";

export interface ExpenseClaim {
  id: number;
  title: string;

  employeeId: number | null;
  projectId: number | null;

  createdBy: number;

  createdAt: string;

  status: ExpenseClaimStatus;

  reviewedBy: number | null;
  reviewedAt: string | null;
}