import type { ExpenseClaim } from "../models/ExpenseClaim";
import { ExpenseClaimStatus } from "../models/ExpenseClaimStatus";

export const expenseClaims: ExpenseClaim[] = [
  {
    id: 1,
    title: "Rendición de agosto - Fernando",
    employeeId: 2,
    projectId: null,
    createdBy: 2,
    createdAt: "2026-08-08T10:30:00",
    status: ExpenseClaimStatus.Approved,
    reviewedBy: 1,
    reviewedAt: "2026-08-09T15:20:00"
  },

  {
    id: 2,
    title: "Rendición en borrador - Marcos",
    employeeId: 2,
    projectId: null,
    createdBy: 2,
    createdAt: "2026-08-12T09:15:00",
    status: ExpenseClaimStatus.Draft,
    reviewedBy: null,
    reviewedAt: null
  },

  {
    id: 3,
    title: "Rendición pendiente de aprobación",
    employeeId: 3,
    projectId: null,
    createdBy: 3,
    createdAt: "2026-09-28T14:40:00",
    status: ExpenseClaimStatus.Submitted,
    reviewedBy: null,
    reviewedAt: null
  },

  {
    id: 4,
    title: "Rendición devuelta para corrección",
    employeeId: 2,
    projectId: null,
    createdBy: 2,
    createdAt: "2026-08-06T11:20:00",
    status: ExpenseClaimStatus.Returned,
    reviewedBy: 1,
    reviewedAt: "2026-08-07T16:10:00"
  }
];