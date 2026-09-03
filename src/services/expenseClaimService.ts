import type { ExpenseClaim } from "../models/ExpenseClaim";
import { ExpenseClaimStatus } from "../models/ExpenseClaimStatus";

import type { ExpenseClaimDocument } from "../models/ExpenseClaimDocument";
import type { User } from "../models/User";
import { UserRole } from "../models/UserRole";
import { DocumentStatus } from "../models/DocumentStatus";

import { users } from "../mocks/users";
import { expenseClaims } from "../mocks/expenseClaims";
import { expenseDocuments } from "../mocks/expenseDocuments";
import { expenseClaimDocuments } from "../mocks/expenseClaimDocuments";


interface CreateExpenseClaimRequest {
  employeeId: number;
  createdBy: number;
  title: string;
  projectId: number | null;
  documentIds: number[];
}


export async function getExpenseClaims(): Promise<ExpenseClaim[]> {
  return expenseClaims;
}


/*
 * Crea una nueva rendición.
 *
 * Los documentos deben estar:
 *
 *   PENDING
 *
 * Un documento rechazado debe ser corregido
 * antes de poder volver a utilizarse.
 */
export async function createExpenseClaim(
  request: CreateExpenseClaimRequest
): Promise<ExpenseClaim> {

  /*
   * Buscamos todos los documentos seleccionados.
   */
  const selectedDocuments = expenseDocuments.filter(
    document =>
      request.documentIds.includes(document.id)
  );


  /*
   * Verificamos que todos los documentos existan.
   */
  if (
    selectedDocuments.length !==
    request.documentIds.length
  ) {

    throw new Error(
      "Uno o más documentos seleccionados no existen"
    );

  }


  /*
   * Solo se pueden agregar documentos pendientes.
   */
  const invalidDocument = selectedDocuments.find(
    document =>
      document.status !== DocumentStatus.Pending
  );

  if (invalidDocument) {

    throw new Error(
      "Solo se pueden agregar documentos pendientes a una rendición"
    );

  }


  /*
   * Los documentos no pueden pertenecer
   * a otra rendición.
   */
  const alreadyAssignedDocument = selectedDocuments.find(
    document =>
      document.expenseClaimId !== null
  );

  if (alreadyAssignedDocument) {

    throw new Error(
      "Uno o más documentos ya pertenecen a otra rendición"
    );

  }


  /*
   * Generamos el nuevo ID.
   */
  const newId =
    Math.max(
      0,
      ...expenseClaims.map(claim => claim.id)
    ) + 1;


  /*
   * Creamos la rendición.
   */
  const newClaim: ExpenseClaim = {

    id: newId,

    title: request.title,

    employeeId: request.employeeId,

    projectId: request.projectId,

    createdBy: request.createdBy,

    createdAt: new Date().toISOString(),

    status: ExpenseClaimStatus.Draft,

    reviewedBy: null,

    reviewedAt: null

  };


  /*
   * Guardamos la rendición.
   */
  expenseClaims.push(newClaim);


  /*
   * Asociamos los documentos.
   */
  selectedDocuments.forEach(document => {

    document.expenseClaimId =
      newClaim.id;


    const newExpenseClaimDocument: ExpenseClaimDocument = {

      id:
        Math.max(
          0,
          ...expenseClaimDocuments.map(
            item => item.id
          )
        ) + 1,

      expenseClaimId:
        newClaim.id,

      documentId:
        document.id,

      assignedAt:
        new Date().toISOString(),

      assignedBy:
        request.createdBy

    };


    expenseClaimDocuments.push(
      newExpenseClaimDocument
    );

  });


  return newClaim;
}


/*
 * Actualiza una rendición.
 */
export async function updateExpenseClaim(
  updatedClaim: ExpenseClaim
): Promise<ExpenseClaim> {

  const index =
    expenseClaims.findIndex(
      claim =>
        claim.id === updatedClaim.id
    );


  if (index === -1) {

    throw new Error(
      "Rendición no encontrada"
    );

  }


  expenseClaims[index] =
    updatedClaim;


  return expenseClaims[index];
}


/*
 * Actualiza los documentos asociados
 * a una rendición.
 *
 * Los documentos nuevos deben estar PENDING.
 *
 * Los documentos APPROVED no pueden reutilizarse.
 *
 * El histórico ExpenseClaimDocument
 * nunca se elimina.
 */
export async function updateExpenseClaimDocuments(
  claimId: number,
  documentIds: number[],
  assignedBy: number
): Promise<ExpenseClaim> {

  const claim =
    expenseClaims.find(
      claim =>
        claim.id === claimId
    );


  if (!claim) {

    throw new Error(
      "Rendición no encontrada"
    );

  }


  /*
   * Documentos actualmente asociados.
   */
  const currentDocuments =
    expenseDocuments.filter(
      document =>
        document.expenseClaimId === claimId
    );


  /*
   * Documentos seleccionados.
   */
  const selectedDocuments =
    expenseDocuments.filter(
      document =>
        documentIds.includes(document.id)
    );


  /*
   * Todos los IDs deben existir.
   */
  if (
    selectedDocuments.length !==
    documentIds.length
  ) {

    throw new Error(
      "Uno o más documentos seleccionados no existen"
    );

  }


  /*
   * Validamos cada documento seleccionado.
   *
   * Un documento que ya pertenece a esta rendición
   * puede mantenerse.
   *
   * Un documento nuevo debe estar PENDING.
   */
  const invalidDocument =
    selectedDocuments.find(document => {

      const alreadyBelongsToClaim =
        document.expenseClaimId === claimId;


      if (alreadyBelongsToClaim) {
        return false;
      }


      return (
        document.status !==
        DocumentStatus.Pending
      );

    });


  if (invalidDocument) {

    throw new Error(
      "Solo se pueden agregar documentos pendientes a una rendición"
    );

  }


  /*
   * Un documento no puede pertenecer
   * a otra rendición.
   */
  const belongsToAnotherClaim =
    selectedDocuments.find(document => {

      return (
        document.expenseClaimId !== null &&
        document.expenseClaimId !== claimId
      );

    });


  if (belongsToAnotherClaim) {

    throw new Error(
      "Uno o más documentos ya pertenecen a otra rendición"
    );

  }


  /*
   * Liberamos las asociaciones actuales
   * que ya no fueron seleccionadas.
   *
   * El histórico NO se elimina.
   */
  currentDocuments
    .filter(
      document =>
        !documentIds.includes(document.id)
    )
    .forEach(document => {

      document.expenseClaimId =
        null;

    });


  /*
   * Asociamos los documentos seleccionados.
   */
  selectedDocuments.forEach(document => {

    document.expenseClaimId =
      claimId;


    /*
     * Solo registramos una nueva asociación
     * si el documento no estaba asociado previamente
     * a esta rendición.
     */
    const alreadyAssociated =
      currentDocuments.some(
        currentDocument =>
          currentDocument.id === document.id
      );


    if (!alreadyAssociated) {

      expenseClaimDocuments.push({

        id:
          Math.max(
            0,
            ...expenseClaimDocuments.map(
              item => item.id
            )
          ) + 1,

        expenseClaimId:
          claimId,

        documentId:
          document.id,

        assignedAt:
          new Date().toISOString(),

        assignedBy

      });

    }

  });


  return claim;
}


/*
 * Envía una rendición para revisión.
 *
 * Estados permitidos:
 *
 *   DRAFT -> SUBMITTED
 *   RETURNED -> SUBMITTED
 *
 * Los documentos NO necesitan estar aprobados
 * previamente.
 *
 * Basta con que la rendición tenga
 * al menos un documento asociado.
 */
export async function submitExpenseClaim(
  claimId: number,
  user: User
): Promise<ExpenseClaim> {

  const claim =
    expenseClaims.find(
      claim =>
        claim.id === claimId
    );


  if (!claim) {

    throw new Error(
      "Rendición no encontrada"
    );

  }


  /*
   * Una rendición nueva o devuelta
   * puede enviarse.
   */
  if (
    claim.status !== ExpenseClaimStatus.Draft &&
    claim.status !== ExpenseClaimStatus.Returned
  ) {

    throw new Error(
      "Solo se pueden enviar rendiciones en estado borrador o devuelta"
    );

  }


  /*
   * Buscamos al trabajador dueño
   * de la rendición.
   */
  const employee =
    users.find(
      user =>
        user.id === claim.employeeId
    );


  if (!employee) {

    throw new Error(
      "La rendición no tiene un trabajador válido asociado"
    );

  }


  /*
   * Validación de permisos.
   */
  if (user.role === UserRole.Employee) {

    if (claim.employeeId !== user.id) {

      throw new Error(
        "No tienes permisos para enviar esta rendición"
      );

    }

  } else if (user.role === UserRole.Accountant) {

    if (
      user.companyId === null ||
      employee.companyId !== user.companyId
    ) {

      throw new Error(
        "No tienes permisos para enviar rendiciones de esta empresa"
      );

    }

  } else if (user.role !== UserRole.Admin) {

    throw new Error(
      "No tienes permisos para enviar rendiciones"
    );

  }


  /*
   * Verificamos que existan documentos asociados.
   */
  const claimDocuments =
    expenseDocuments.filter(
      document =>
        document.expenseClaimId === claimId
    );


  if (claimDocuments.length === 0) {

    throw new Error(
      "La rendición debe tener al menos un documento asociado"
    );

  }


  /*
   * Enviamos la rendición.
   *
   * Los documentos permanecen PENDING
   * mientras la rendición está en revisión.
   */
  claim.status =
    ExpenseClaimStatus.Submitted;


  /*
   * Limpiamos la información de revisión.
   */
  claim.reviewedBy = null;

  claim.reviewedAt = null;


  return claim;
}

export async function returnExpenseClaim(
  claimId: number,
  reviewedBy: number
): Promise<ExpenseClaim> {
  const claim =
    expenseClaims.find(
      claim => claim.id === claimId
    );

  if (!claim) {
    throw new Error(
      "Rendición no encontrada"
    );
  }

  if (
    claim.status !== ExpenseClaimStatus.Submitted
  ) {
    throw new Error(
      "Solo se pueden devolver rendiciones enviadas"
    );
  }

  claim.status =
    ExpenseClaimStatus.Returned;

  claim.reviewedBy =
    reviewedBy;

  claim.reviewedAt =
    new Date().toISOString();

  return claim;
}

/*
 * Revisa una rendición.
 *
 * El revisor SOLO indica qué documentos
 * deben ser rechazados.
 *
 * Todos los documentos que NO sean rechazados
 * serán aprobados automáticamente.
 *
 * Flujo:
 *
 *   Documento rechazado:
 *     PENDING -> REJECTED
 *     expenseClaimId -> null
 *
 *   Documento no rechazado:
 *     PENDING -> APPROVED
 *
 *   Rendición:
 *     SUBMITTED -> APPROVED
 */
export async function reviewExpenseClaim(
  claimId: number,
  rejectedDocumentIds: number[],
  reviewedBy: number
): Promise<ExpenseClaim> {

  const claim =
    expenseClaims.find(
      claim =>
        claim.id === claimId
    );


  if (!claim) {

    throw new Error(
      "Rendición no encontrada"
    );

  }


  if (
    claim.status !== ExpenseClaimStatus.Submitted
  ) {

    throw new Error(
      "Solo se pueden revisar rendiciones enviadas"
    );

  }


  /*
   * Documentos actualmente asociados
   * a la rendición.
   */
  const claimDocuments =
    expenseDocuments.filter(
      document =>
        document.expenseClaimId === claimId
    );


  if (claimDocuments.length === 0) {

    throw new Error(
      "La rendición no tiene documentos asociados"
    );

  }


  /*
   * Verificamos que todos los documentos
   * rechazados realmente pertenezcan
   * a esta rendición.
   */
  const invalidRejectedDocument =
    rejectedDocumentIds.find(
      documentId =>
        !claimDocuments.some(
          document =>
            document.id === documentId
        )
    );


  if (invalidRejectedDocument !== undefined) {

    throw new Error(
      "Uno o más documentos rechazados no pertenecen a la rendición"
    );

  }


  /*
   * Procesamos cada documento.
   *
   * Si está marcado como rechazado:
   *
   *   PENDING -> REJECTED
   *   expenseClaimId -> null
   *
   * En caso contrario:
   *
   *   PENDING -> APPROVED
   */
  claimDocuments.forEach(document => {

    const rejected =
      rejectedDocumentIds.includes(
        document.id
      );


    if (rejected) {

      document.status =
        DocumentStatus.Rejected;

      document.expenseClaimId =
        null;

    } else {

      document.status =
        DocumentStatus.Approved;

      /*
       * El documento aprobado mantiene
       * su asociación con la rendición.
       */
      document.expenseClaimId =
        claimId;

    }

  });


  /*
   * Guardamos quién y cuándo realizó
   * la revisión.
   */
  claim.reviewedBy =
    reviewedBy;

  claim.reviewedAt =
    new Date().toISOString();


  /*
   * La rendición queda aprobada.
   *
   * Incluso si hubo documentos rechazados,
   * los demás documentos quedan aprobados.
   */
  claim.status =
    ExpenseClaimStatus.Approved;


  return claim;
}