export const ExpenseClaimStatus = {
  Draft: "DRAFT",
  Submitted: "SUBMITTED",
  Approved: "APPROVED",
  Returned: "RETURNED"
} as const;

export type ExpenseClaimStatus =
  (typeof ExpenseClaimStatus)[keyof typeof ExpenseClaimStatus];