export interface ExpenseClaimDocument {
  id: number;
  expenseClaimId: number;
  documentId: number;
  assignedAt: string;
  assignedBy: number;
}