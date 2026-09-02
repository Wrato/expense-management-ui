import type { ExpenseDocument } from "../models/ExpenseDocument";
import type { User } from "../models/User";
import { UserRole } from "../models/UserRole";
import { DocumentStatus } from "../models/DocumentStatus";

import { expenseDocuments } from "../mocks/expenseDocuments";
import { users } from "../mocks/users";


export async function getDocuments(): Promise<ExpenseDocument[]> {
  return expenseDocuments;
}


export async function updateDocument(
  updatedDocument: ExpenseDocument
): Promise<ExpenseDocument> {

  const index = expenseDocuments.findIndex(
    document => document.id === updatedDocument.id
  );

  if (index === -1) {
    throw new Error("Documento no encontrado");
  }

  /*
   * Los documentos aprobados quedan bloqueados.
   */
  if (
    expenseDocuments[index].status === DocumentStatus.Approved
  ) {
    throw new Error(
      "Los documentos aprobados no pueden modificarse"
    );
  }

  expenseDocuments[index] = updatedDocument;

  return expenseDocuments[index];
}


/*
 * Rechaza un documento.
 *
 * Estado:
 *
 * PENDING -> REJECTED
 *
 * Solo Accountant y Admin pueden realizar
 * esta operación.
 */
export async function rejectDocument(
  documentId: number,
  user: User
): Promise<ExpenseDocument> {

  const document = expenseDocuments.find(
    document => document.id === documentId
  );

  if (!document) {
    throw new Error("Documento no encontrado");
  }

  /*
   * Solo un documento pendiente
   * puede ser rechazado.
   */
  if (
    document.status !== DocumentStatus.Pending
  ) {
    throw new Error(
      "Solo se pueden rechazar documentos pendientes"
    );
  }

  /*
   * Buscamos al trabajador asociado.
   */
  const employee = users.find(
    user => user.id === document.employeeId
  );

  if (!employee) {
    throw new Error(
      "El documento no tiene un trabajador válido asociado"
    );
  }

  /*
   * Solo Accountant y Admin pueden rechazar.
   */
  if (user.role === UserRole.Accountant) {

    if (
      user.companyId === null ||
      employee.companyId !== user.companyId
    ) {
      throw new Error(
        "No tienes permisos para rechazar documentos de esta empresa"
      );
    }

  } else if (user.role !== UserRole.Admin) {

    throw new Error(
      "No tienes permisos para rechazar documentos"
    );
  }

  /*
   * Documento rechazado.
   */
  document.status = DocumentStatus.Rejected;

  /*
   * Un documento rechazado queda
   * fuera de cualquier rendición.
   */
  document.expenseClaimId = null;

  return document;
}