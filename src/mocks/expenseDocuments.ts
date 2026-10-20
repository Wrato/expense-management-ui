
import type { ExpenseDocument } from "../models/ExpenseDocument";
import { DocumentStatus } from "../models/DocumentStatus";

export const expenseDocuments: ExpenseDocument[] = [
  // RENDICIÓN 1 - APPROVED

  {
    id: 1,
    sourcePhone: "56911111111",
    issuerCompanyId: 1,
    issuerCompanyRut: "76.123.456-7",
    projectId: null,
    employeeId: 2,
    expenseClaimId: 1,
    costTypeId: 3, // Transporte > Taxi
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
    projectId: null,
    employeeId: 2,
    expenseClaimId: 1,
    costTypeId: 6, // Alimentación > Restaurante
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
    projectId: null,
    employeeId: 2,
    expenseClaimId: 1,
    costTypeId: 4, // Transporte > Combustible
    issueDate: "2026-08-12",
    sentAt: "2026-08-12T12:20:00",
    total: 18500,
    imageUrl: "https://mock/boleta3.jpg",
    documentNumber: "100003",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Approved
  },

  // DOCUMENTO DISPONIBLE PARA FERNANDO

  {
    id: 4,
    sourcePhone: "56911111111",
    issuerCompanyId: 3,
    issuerCompanyRut: "78.345.678-9",
    projectId: null,
    employeeId: 2,
    expenseClaimId: null,
    costTypeId: 1,
    issueDate: "2026-08-20",
    sentAt: "2026-08-20T11:05:00",
    total: 95600,
    imageUrl: "https://mock/boleta4.jpg",
    documentNumber: "100004",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Pending
  },

  // DOCUMENTO RECHAZADO

  {
    id: 5,
    sourcePhone: "56911111111",
    issuerCompanyId: 4,
    issuerCompanyRut: "79.456.789-0",
    projectId: null,
    employeeId: 2,
    expenseClaimId: null,
    costTypeId: 3,
    issueDate: "2026-08-19",
    sentAt: "2026-08-19T14:30:00",
    total: 5400,
    imageUrl: "https://mock/boleta5.jpg",
    documentNumber: "100005",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Rejected
  },

  // RENDICIÓN 3 - SUBMITTED

  {
    id: 6,
    sourcePhone: "56933333333",
    issuerCompanyId: 1,
    issuerCompanyRut: "76.123.456-7",
    projectId: null,
    employeeId: 3,
    expenseClaimId: 3,
    costTypeId: 1,
    issueDate: "2026-08-15",
    sentAt: "2026-08-15T09:30:00",
    total: 42000,
    imageUrl: "https://mock/boleta6.jpg",
    documentNumber: "100006",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Pending
  },

  // DOCUMENTO RECHAZADO DURANTE LA REVISIÓN

  {
    id: 7,
    sourcePhone: "56933333333",
    issuerCompanyId: 3,
    issuerCompanyRut: "78.345.678-9",
    projectId: null,
    employeeId: 3,
    expenseClaimId: null,
    costTypeId: 6,
    issueDate: "2026-08-16",
    sentAt: "2026-08-16T17:25:00",
    total: 8000,
    imageUrl: "https://mock/boleta7.jpg",
    documentNumber: "100007",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Rejected
  },

  // DOCUMENTO PENDIENTE SIN RENDICIÓN - MARCOS

  {
    id: 8,
    sourcePhone: "56933333333",
    issuerCompanyId: 2,
    issuerCompanyRut: "77.234.567-8",
    projectId: null,
    employeeId: 3,
    expenseClaimId: null,
    costTypeId: 1,
    issueDate: "2026-08-21",
    sentAt: "2026-08-21T13:45:00",
    total: 12500,
    imageUrl: "https://mock/boleta8.jpg",
    documentNumber: "100008",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Pending
  },

  // DOCUMENTO SIN EMPLEADO ASIGNADO

  {
    id: 9,
    sourcePhone: "56922222222",
    issuerCompanyId: null,
    issuerCompanyRut: null,
    projectId: null,
    employeeId: null,
    expenseClaimId: null,
    costTypeId: 1,
    issueDate: null,
    sentAt: "2026-08-22T09:20:00",
    total: null,
    imageUrl: "https://mock/boleta9.jpg",
    documentNumber: null,
    duplicateOfDocumentId: null,
    status: DocumentStatus.Pending
  },

  // DOCUMENTOS ADICIONALES - FERNANDO

  {
    id: 10,
    sourcePhone: "56911111111",
    issuerCompanyId: 1,
    issuerCompanyRut: "76.123.456-7",
    projectId: null,
    employeeId: 2,
    expenseClaimId: null,
    costTypeId: 1,
    issueDate: "2026-08-23",
    sentAt: "2026-08-23T10:20:00",
    total: 18750,
    imageUrl: "https://mock/boleta10.jpg",
    documentNumber: "100010",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Pending
  },

  {
    id: 11,
    sourcePhone: "56911111111",
    issuerCompanyId: 2,
    issuerCompanyRut: "77.234.567-8",
    projectId: null,
    employeeId: 2,
    expenseClaimId: null,
    costTypeId: 1,
    issueDate: "2026-08-24",
    sentAt: "2026-08-24T15:10:00",
    total: 32600,
    imageUrl: "https://mock/boleta11.jpg",
    documentNumber: "100011",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Pending
  },

  // DOCUMENTOS ADICIONALES - MARCOS

  {
    id: 12,
    sourcePhone: "56933333333",
    issuerCompanyId: 1,
    issuerCompanyRut: "76.123.456-7",
    projectId: null,
    employeeId: 3,
    expenseClaimId: null,
    costTypeId: 1,
    issueDate: "2026-08-23",
    sentAt: "2026-08-23T11:40:00",
    total: 22100,
    imageUrl: "https://mock/boleta12.jpg",
    documentNumber: "100012",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Pending
  },

  {
    id: 13,
    sourcePhone: "56933333333",
    issuerCompanyId: 3,
    issuerCompanyRut: "78.345.678-9",
    projectId: null,
    employeeId: 3,
    expenseClaimId: null,
    costTypeId: 1,
    issueDate: "2026-08-24",
    sentAt: "2026-08-24T16:25:00",
    total: 47800,
    imageUrl: "https://mock/boleta13.jpg",
    documentNumber: "100013",
    duplicateOfDocumentId: null,
    status: DocumentStatus.Pending
  }
];
