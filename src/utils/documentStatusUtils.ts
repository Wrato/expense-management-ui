import { DocumentStatus } from "../models/DocumentStatus";

export function getDocumentStatusLabel(
  status: DocumentStatus
): string {

  switch (status) {

    case DocumentStatus.Pending:
      return "Pendiente";

    case DocumentStatus.Rejected:
      return "Rechazado";

    case DocumentStatus.Approved:
      return "Aprobado";

    default:
      return "Desconocido";
  }
}


export function getDocumentStatusColor(
  status: DocumentStatus
): "warning" | "info" | "success" | "error" | "default" {

  switch (status) {

    case DocumentStatus.Pending:
      return "warning";

    case DocumentStatus.Rejected:
      return "error";

    case DocumentStatus.Approved:
      return "success";

    default:
      return "default";
  }
}