import { UserRole } from "../models/UserRole";
import { ExpenseClaimStatus } from "../models/ExpenseClaimStatus";

/**
 * Determina si un rol puede crear rendiciones.
 */
export function canCreateExpenseClaim(
  role: UserRole
): boolean {
  return (
    role === UserRole.Employee ||
    role === UserRole.Accountant ||
    role === UserRole.Admin
  );
}

/**
 * Determina si un rol puede editar rendiciones.
 *
 * Esta validación considera solamente el rol.
 * La propiedad de la rendición y la empresa
 * deben validarse también en el servicio.
 */
export function canEditExpenseClaim(
  role: UserRole
): boolean {
  return (
    role === UserRole.Employee ||
    role === UserRole.Accountant ||
    role === UserRole.Admin
  );
}

/**
 * Determina si el estado permite editar una rendición.
 */
export function canEditExpenseClaimStatus(
  status: ExpenseClaimStatus
): boolean {
  return (
    status === ExpenseClaimStatus.Draft ||
    status === ExpenseClaimStatus.Returned
  );
}

/**
 * Determina si un rol puede enviar rendiciones
 * a revisión.
 *
 * La autorización sobre una rendición específica
 * debe validarse en el servicio.
 */
export function canSubmitExpenseClaim(
  role: UserRole
): boolean {
  return (
    role === UserRole.Employee ||
    role === UserRole.Accountant ||
    role === UserRole.Admin
  );
}

export function canManageUsers(
  role: UserRole
): boolean {
  return role === UserRole.Admin;
}

export function canManageCompanies(
  role: UserRole
): boolean {
  return role === UserRole.Admin;
}

export function canManageCategories(
  role: UserRole
): boolean {
  return role === UserRole.Admin;
}

/**
 * Determina si un rol puede revisar rendiciones.
 */
export function canApproveExpenseClaim(
  role: UserRole
): boolean {
  return (
    role === UserRole.Admin ||
    role === UserRole.Approver
  );
}
