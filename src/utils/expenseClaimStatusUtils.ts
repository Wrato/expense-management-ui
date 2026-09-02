import { ExpenseClaimStatus } from "../models/ExpenseClaimStatus";

export function getExpenseClaimStatusLabel(
  status: ExpenseClaimStatus
) {
  switch (status) {
    case ExpenseClaimStatus.Draft:
      return "Borrador";

    case ExpenseClaimStatus.Submitted:
      return "Enviada";

    case ExpenseClaimStatus.Approved:
      return "Aprobada";

    case ExpenseClaimStatus.Returned:
      return "Devuelta";

    default:
      return status;
  }
}

export function getExpenseClaimStatusColor(
  status: ExpenseClaimStatus
) {
  switch (status) {
    case ExpenseClaimStatus.Draft:
      return "default";

    case ExpenseClaimStatus.Submitted:
      return "warning";

    case ExpenseClaimStatus.Approved:
      return "success";

    case ExpenseClaimStatus.Returned:
      return "error";

    default:
      return "default";
  }
}