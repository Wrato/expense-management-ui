import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

import { useNavigate } from "react-router-dom";

import type { ExpenseDocument } from "../models/ExpenseDocument";
import { DocumentStatus } from "../models/DocumentStatus";

import { issuerCompanies } from "../mocks/issuerCompanies";
import { expenseClaims } from "../mocks/expenseClaims";
import { users } from "../mocks/users";
import { projects } from "../mocks/projects";

import {
  getDocumentStatusLabel,
  getDocumentStatusColor
} from "../utils/documentStatusUtils";

interface DocumentTableProps {
  documents: ExpenseDocument[];
  showEmployee?: boolean;
}

export default function DocumentTable({
  documents,
  showEmployee = true
}: DocumentTableProps) {
  const navigate = useNavigate();

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        width: "100%",
        overflowX: "auto"
      }}
    >
      <Table
        sx={{
          width: "100%"
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", width: 70 }}>
              ID
            </TableCell>

            <TableCell sx={{ fontWeight: "bold", width: 120 }}>
              Fecha emisión
            </TableCell>

            <TableCell sx={{ fontWeight: "bold", width: 120 }}>
              N° documento
            </TableCell>

            {showEmployee && (
              <TableCell sx={{ fontWeight: "bold" }}>
                Trabajador
              </TableCell>
            )}

            <TableCell sx={{ fontWeight: "bold" }}>
              Empresa emisora
            </TableCell>

            <TableCell sx={{ fontWeight: "bold" }}>
              Proyecto
            </TableCell>

            <TableCell
              sx={{ fontWeight: "bold" }}
              align="right"
            >
              Total
            </TableCell>

            <TableCell sx={{ fontWeight: "bold" }}>
              Estado
            </TableCell>

            <TableCell sx={{ fontWeight: "bold" }}>
              Rendición
            </TableCell>

            <TableCell sx={{ fontWeight: "bold" }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {documents.map(document => {
            const company = issuerCompanies.find(
              company =>
                company.id === document.issuerCompanyId
            );

            const expenseClaim = expenseClaims.find(
              claim =>
                claim.id === document.expenseClaimId
            );

            const employee = users.find(
              user =>
                user.id === document.employeeId
            );

            const project = projects.find(
              project =>
                project.id === document.projectId
            );

            const canEdit =
              document.status !==
              DocumentStatus.Approved;

            return (
              <TableRow
                key={document.id}
                hover
                onClick={() =>
                  navigate(
                    `/documents/${document.id}`
                  )
                }
                sx={{
                  cursor: "pointer"
                }}
              >
                <TableCell>
                  {document.id}
                </TableCell>

                <TableCell>
                  {document.issueDate ?? "-"}
                </TableCell>

                <TableCell>
                  {document.documentNumber ?? "-"}
                </TableCell>

                {showEmployee && (
                  <TableCell>
                    {employee?.name ?? "Sin asignar"}
                  </TableCell>
                )}

                <TableCell>
                  {company?.name ?? "Sin asignar"}
                </TableCell>

                <TableCell>
                  {project?.name ?? "Sin proyecto"}
                </TableCell>

                <TableCell align="right">
                  {document.total != null
                    ? `$${document.total.toLocaleString(
                        "es-CL"
                      )}`
                    : "-"}
                </TableCell>

                <TableCell>
                  <Chip
                    label={getDocumentStatusLabel(
                      document.status
                    )}
                    color={getDocumentStatusColor(
                      document.status
                    )}
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  {expenseClaim?.title ?? "-"}
                </TableCell>

                <TableCell align="center">
                  <Tooltip title="Ver detalle">
                    <IconButton
                      size="small"
                      aria-label="Ver detalle"
                      onClick={event => {
                        event.stopPropagation();

                        navigate(
                          `/documents/${document.id}`
                        );
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {canEdit && (
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        aria-label="Editar"
                        onClick={event => {
                          event.stopPropagation();

                          navigate(
                            `/documents/${document.id}/edit`
                          );
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}