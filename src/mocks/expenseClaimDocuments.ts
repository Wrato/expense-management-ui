import type { ExpenseClaimDocument } from "../models/ExpenseClaimDocument";

export const expenseClaimDocuments: ExpenseClaimDocument[] = [
  // ─────────────────────────────────────────
  // RENDICIÓN 1
  // Documentos actualmente aprobados
  // ─────────────────────────────────────────

  {
    id: 1,
    expenseClaimId: 1,
    documentId: 1,
    assignedAt: "2026-08-08T10:35:00",
    assignedBy: 2
  },

  {
    id: 2,
    expenseClaimId: 1,
    documentId: 2,
    assignedAt: "2026-08-08T10:35:00",
    assignedBy: 2
  },

  {
    id: 3,
    expenseClaimId: 1,
    documentId: 3,
    assignedAt: "2026-08-08T10:35:00",
    assignedBy: 2
  },

  // ─────────────────────────────────────────
  // RENDICIÓN 3
  // El documento 6 sigue asociado.
  // El documento 7 fue rechazado y separado,
  // pero mantenemos el registro histórico.
  // ─────────────────────────────────────────

  {
    id: 4,
    expenseClaimId: 3,
    documentId: 6,
    assignedAt: "2026-08-12T15:00:00",
    assignedBy: 3
  },

  {
    id: 5,
    expenseClaimId: 3,
    documentId: 7,
    assignedAt: "2026-08-12T15:00:00",
    assignedBy: 3
  }
];