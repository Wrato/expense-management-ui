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

import { users } from "../mocks/users";
import { issuerCompanies } from "../mocks/issuerCompanies";
import { expenseClaims } from "../mocks/expenseClaims";

import {
  getDocumentStatusColor,
  getDocumentStatusLabel
} from "../utils/documentStatusUtils";

interface Props {
  documents: ExpenseDocument[];
  showEmployee?: boolean;
}

export default function ExpenseDocumentTable({
  documents,
  showEmployee = true
}: Props) {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>

            {showEmployee && (
              <TableCell>Empleado</TableCell>
            )}

            <TableCell>Empresa emisora</TableCell>
            <TableCell>Fecha emisión</TableCell>
            <TableCell>N° documento</TableCell>
            <TableCell>Rendición</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showEmployee ? 9 : 8}
                align="center"
              >
                No existen documentos para mostrar.
              </TableCell>
            </TableRow>
          ) : (
            documents.map(document => {
              const employee = users.find(
                user =>
                  user.id === document.employeeId
              );

              const issuerCompany =
                issuerCompanies.find(
                  company =>
                    company.id ===
                    document.issuerCompanyId
                );

              const expenseClaim =
                expenseClaims.find(
                  claim =>
                    claim.id ===
                    document.expenseClaimId
                );

              const canEdit =
                document.status !==
                DocumentStatus.Approved;

              return (
                <TableRow
                  key={document.id}
                  hover
                >
                  <TableCell>
                    {document.id}
                  </TableCell>

                  {showEmployee && (
                    <TableCell>
                      {employee?.name ?? "-"}
                    </TableCell>
                  )}

                  <TableCell>
                    {issuerCompany?.name ?? "-"}
                  </TableCell>

                  <TableCell>
                    {document.issueDate ?? "-"}
                  </TableCell>

                  <TableCell>
                    {document.documentNumber ?? "-"}
                  </TableCell>

                  <TableCell>
                    {expenseClaim?.title ?? "-"}
                  </TableCell>

                  <TableCell>
                    $
                    {(document.total ?? 0).toLocaleString(
                      "es-CL"
                    )}
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
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}