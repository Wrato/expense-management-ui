import { DocumentStatus } from "./DocumentStatus";

export interface ExpenseDocument {
  id: number;
  sourcePhone: string | null;
  issuerCompanyId: number | null;
  issuerCompanyRut: string | null;
  projectId: number | null;
  employeeId: number | null;
  expenseClaimId: number | null;
  issueDate: string | null;
  sentAt: string;
  total: number | null;
  imageUrl: string;
  documentNumber: string | null;
  duplicateOfDocumentId: number | null;
  status: DocumentStatus;
}