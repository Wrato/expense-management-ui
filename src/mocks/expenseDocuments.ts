import type { ExpenseDocument } from "../models/ExpenseDocument";
import { DocumentStatus } from "../models/DocumentStatus";

export const expenseDocuments: ExpenseDocument[] = [
  // ─────────────────────────────────────────
  // RENDICIÓN 1 - APPROVED
  // Todos los documentos no rechazados
  // quedan aprobados cuando se aprueba la rendición.
  // ─────────────────────────────────────────

  {
    id: 1,
    sourcePhone: "56911111111",
    issuerCompanyId: 1,
    issuerCompanyRut: "76.123.456-7",
    projectId: 1,
    employeeId: 2,
    expenseClaimId: 1,
    issueDate: "2026-08-10",
    sentAt: "2026-08-10T10:15:00",
    total: 35000,
    imageUrl: "https://mock/boleta1.jpg",
    documentNumber: "100001",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Approved
  },

  {
    id: 2,
    sourcePhone: "56911111111",
    issuerCompanyId: 2,
    issuerCompanyRut: "77.234.567-8",
    projectId: 1,
    employeeId: 2,
    expenseClaimId: 1,
    issueDate: "2026-08-11",
    sentAt: "2026-08-11T16:40:00",
    total: 12890,
    imageUrl: "https://mock/boleta2.jpg",
    documentNumber: "100002",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Approved
  },

  {
    id: 3,
    sourcePhone: "56911111111",
    issuerCompanyId: 1,
    issuerCompanyRut: "76.123.456-7",
    projectId: 1,
    employeeId: 2,
    expenseClaimId: 1,
    issueDate: "2026-08-12",
    sentAt: "2026-08-12T12:20:00",
    total: 18500,
    imageUrl: "https://mock/boleta3.jpg",
    documentNumber: "100003",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Approved
  },

  // ─────────────────────────────────────────
  // DOCUMENTO DISPONIBLE
  // Pending puede agregarse directamente
  // a una nueva rendición.
  // ─────────────────────────────────────────

  {
    id: 4,
    sourcePhone: "56911111111",
    issuerCompanyId: 3,
    issuerCompanyRut: "78.345.678-9",
    projectId: 2,
    employeeId: 2,
    expenseClaimId: null,
    issueDate: "2026-08-20",
    sentAt: "2026-08-20T11:05:00",
    total: 95600,
    imageUrl: "https://mock/boleta4.jpg",
    documentNumber: "100004",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Pending
  },

  // ─────────────────────────────────────────
  // DOCUMENTO RECHAZADO
  // Puede corregirse y volver a Pending.
  // ─────────────────────────────────────────

  {
    id: 5,
    sourcePhone: "56911111111",
    issuerCompanyId: 4,
    issuerCompanyRut: "79.456.789-0",
    projectId: 2,
    employeeId: 2,
    expenseClaimId: null,
    issueDate: "2026-08-19",
    sentAt: "2026-08-19T14:30:00",
    total: 5400,
    imageUrl: "https://mock/boleta5.jpg",
    documentNumber: "100005",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Rejected
  },

  // ─────────────────────────────────────────
  // RENDICIÓN 3 - SUBMITTED
  // Los documentos todavía están Pending
  // porque la revisión ocurre a nivel de rendición.
  // ─────────────────────────────────────────

  {
    id: 6,
    sourcePhone: "56933333333",
    issuerCompanyId: 1,
    issuerCompanyRut: "76.123.456-7",
    projectId: 1,
    employeeId: 3,
    expenseClaimId: 3,
    issueDate: "2026-08-15",
    sentAt: "2026-08-15T09:30:00",
    total: 42000,
    imageUrl: "https://mock/boleta6.jpg",
    documentNumber: "100006",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Pending
  },

  // Este documento fue rechazado durante la revisión
  // de la rendición y por eso ya no pertenece a ella.
  {
    id: 7,
    sourcePhone: "56933333333",
    issuerCompanyId: 3,
    issuerCompanyRut: "78.345.678-9",
    projectId: 1,
    employeeId: 3,
    expenseClaimId: null,
    issueDate: "2026-08-16",
    sentAt: "2026-08-16T17:25:00",
    total: 8000,
    imageUrl: "https://mock/boleta7.jpg",
    documentNumber: "100007",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Rejected
  },

  // ─────────────────────────────────────────
  // DOCUMENTO PENDIENTE SIN RENDICIÓN
  // ─────────────────────────────────────────

  {
    id: 8,
    sourcePhone: "56933333333",
    issuerCompanyId: 2,
    issuerCompanyRut: "77.234.567-8",
    projectId: 1,
    employeeId: 3,
    expenseClaimId: null,
    issueDate: "2026-08-21",
    sentAt: "2026-08-21T13:45:00",
    total: 12500,
    imageUrl: "https://mock/boleta8.jpg",
    documentNumber: "100008",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Pending
  },

  // ─────────────────────────────────────────
  // DOCUMENTO SIN PROYECTO
  // ─────────────────────────────────────────

  {
    id: 9,
    sourcePhone: "56922222222",
    issuerCompanyId: null,
    issuerCompanyRut: null,
    projectId: null,
    employeeId: null,
    expenseClaimId: null,
    issueDate: null,
    sentAt: "2026-08-22T09:20:00",
    total: null,
    imageUrl: "https://mock/boleta9.jpg",
    documentNumber: null,
    duplicateOfDocumentId: null,
    status: DocumentStatus.Pending
  }
];