import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import type { ExpenseDocument } from "../models/ExpenseDocument";

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
}


export default function DocumentTable({
  documents
}: DocumentTableProps) {

  const navigate = useNavigate();


  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2
      }}
    >

      <Table>

        <TableHead>

          <TableRow>

            <TableCell
              sx={{
                fontWeight: "bold"
              }}
            >
              Fecha
            </TableCell>


            <TableCell
              sx={{
                fontWeight: "bold"
              }}
            >
              Trabajador
            </TableCell>


            <TableCell
              sx={{
                fontWeight: "bold"
              }}
            >
              Empresa
            </TableCell>


            <TableCell
              sx={{
                fontWeight: "bold"
              }}
            >
              Proyecto
            </TableCell>


            <TableCell
              sx={{
                fontWeight: "bold"
              }}
              align="right"
            >
              Total
            </TableCell>


            <TableCell
              sx={{
                fontWeight: "bold"
              }}
            >
              Estado
            </TableCell>


            <TableCell
              sx={{
                fontWeight: "bold"
              }}
            >
              Rendición
            </TableCell>


            <TableCell
              sx={{
                fontWeight: "bold"
              }}
            >
              Acciones
            </TableCell>

          </TableRow>

        </TableHead>


        <TableBody>

          {documents.map(document => {

            const company =
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


            const employee =
              users.find(
                user =>
                  user.id ===
                  document.employeeId
              );


            const project =
              projects.find(
                project =>
                  project.id ===
                  document.projectId
              );


            const canEdit =
              document.status !==
              "APPROVED";


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
                  {document.issueDate ?? "-"}
                </TableCell>


                <TableCell>
                  {employee?.name ??
                    "Sin asignar"}
                </TableCell>


                <TableCell>
                  {company?.name ??
                    "Sin asignar"}
                </TableCell>


                <TableCell>
                  {project?.name ??
                    "Sin proyecto"}
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
                    label={
                      getDocumentStatusLabel(
                        document.status
                      )
                    }
                    color={
                      getDocumentStatusColor(
                        document.status
                      )
                    }
                    size="small"
                  />

                </TableCell>


                <TableCell>

                  {expenseClaim?.title ??
                    "-"}

                </TableCell>


                <TableCell>

                  {canEdit && (

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={event => {

                        event.stopPropagation();

                        navigate(
                          `/documents/${document.id}/edit`
                        );

                      }}
                    >
                      Editar
                    </Button>

                  )}


                  {!canEdit && (
                    "Bloqueado"
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