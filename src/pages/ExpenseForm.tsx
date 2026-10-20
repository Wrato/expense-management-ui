import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { ExpenseDocument } from "../models/ExpenseDocument";
import { DocumentStatus } from "../models/DocumentStatus";
import { UserRole } from "../models/UserRole";

import { users } from "../mocks/users";
import { issuerCompanies } from "../mocks/issuerCompanies";

import { getDocuments } from "../services/expenseDocumentService";
import { createExpenseClaim } from "../services/expenseClaimService";

import { useAuth } from "../hooks/useAuth";

import {
  canCreateExpenseClaim
} from "../utils/permissions";

import {
  getDocumentStatusColor,
  getDocumentStatusLabel
} from "../utils/documentStatusUtils";

export default function ExpenseForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const canCreate =
    user !== null &&
    canCreateExpenseClaim(user.role);

  const [title, setTitle] = useState("");

  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState<number | null>(
      user?.role === UserRole.Employee
        ? user.id
        : null
    );

  const [documents, setDocuments] =
    useState<ExpenseDocument[]>([]);

  const [selectedDocuments, setSelectedDocuments] =
    useState<number[]>([]);

  const isEmployee =
    user?.role === UserRole.Employee;

  const employees = users.filter(employee => {
    if (employee.role !== UserRole.Employee) {
      return false;
    }

    if (user?.role === UserRole.Admin) {
      return true;
    }

    return employee.companyId === user?.companyId;
  });

  useEffect(() => {
    async function loadDocuments() {
      if (!selectedEmployeeId) {
        setDocuments([]);
        return;
      }

      const response = await getDocuments();

      const availableDocuments = response.filter(
        document =>
          document.employeeId === selectedEmployeeId &&
          document.expenseClaimId === null &&
          document.status === DocumentStatus.Pending
      );

      setDocuments(availableDocuments);
    }

    loadDocuments();
  }, [selectedEmployeeId]);

  if (!user || !canCreate) {
    return (
      <Typography>
        No tienes permisos para crear una rendición.
      </Typography>
    );
  }

  const handleEmployeeChange = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    setSelectedDocuments([]);
    setDocuments([]);
  };

  const selectedEmployee = users.find(
    employee => employee.id === selectedEmployeeId
  );

  const handleToggleDocument = (documentId: number) => {
    const document = documents.find(
      document => document.id === documentId
    );

    if (!document) {
      return;
    }

    if (document.status !== DocumentStatus.Pending) {
      return;
    }

    setSelectedDocuments(current => {
      if (current.includes(documentId)) {
        return current.filter(id => id !== documentId);
      }

      return [...current, documentId];
    });
  };

  const selectedTotal = documents
    .filter(document =>
      selectedDocuments.includes(document.id)
    )
    .reduce(
      (total, document) =>
        total + (document.total ?? 0),
      0
    );

  const handleCreateExpense = async () => {
    if (!title.trim()) {
      alert("Debes ingresar un título para la rendición");
      return;
    }

    if (!selectedEmployeeId) {
      alert("Debes seleccionar un empleado");
      return;
    }

    if (selectedDocuments.length === 0) {
      alert("Debes seleccionar al menos un documento");
      return;
    }

    try {
      await createExpenseClaim({
        title: title.trim(),
        employeeId: selectedEmployeeId,
        createdBy: user.id,
        projectId: null,
        documentIds: selectedDocuments
      });

      alert("Rendición creada correctamente");

      navigate("/expenses");
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "No fue posible crear la rendición.";

      alert(message);
    }
  };

  return (
    <>
      <Typography
        variant="h4"
        sx={{ mb: 3 }}
      >
        Nueva Rendición
      </Typography>

      <TextField
        label="Título de la rendición"
        value={title}
        onChange={event =>
          setTitle(event.target.value)
        }
        fullWidth
        sx={{ mb: 3 }}
      />

      {isEmployee && selectedEmployee && (
        <TextField
          label="Empleado"
          value={selectedEmployee.name}
          fullWidth
          disabled
          sx={{ mb: 3 }}
        />
      )}

      {!isEmployee && (
        <FormControl
          fullWidth
          sx={{ mb: 3 }}
        >
          <InputLabel>Empleado</InputLabel>

          <Select
            value={selectedEmployeeId ?? ""}
            label="Empleado"
            onChange={event =>
              handleEmployeeChange(
                Number(event.target.value)
              )
            }
          >
            {employees.map(employee => (
              <MenuItem
                key={employee.id}
                value={employee.id}
              >
                {employee.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2 }}
        >
          Documentos disponibles
        </Typography>

        {documents.length === 0 ? (
          <Typography color="text.secondary">
            No tienes documentos pendientes disponibles
            para esta rendición.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" />

                  <TableCell>
                    Documento
                  </TableCell>

                  <TableCell>
                    Fecha
                  </TableCell>

                  <TableCell>
                    Empresa emisora
                  </TableCell>

                  <TableCell align="right">
                    Total
                  </TableCell>

                  <TableCell>
                    Estado
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {documents.map(document => {
                  const issuerCompany =
                    issuerCompanies.find(
                      company =>
                        company.id ===
                        document.issuerCompanyId
                    );

                  const isSelected =
                    selectedDocuments.includes(
                      document.id
                    );

                  return (
                    <TableRow
                      key={document.id}
                      hover
                      selected={isSelected}
                      onClick={() =>
                        handleToggleDocument(
                          document.id
                        )
                      }
                      sx={{
                        cursor: "pointer"
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={() =>
                            handleToggleDocument(
                              document.id
                            )
                          }
                          onClick={event =>
                            event.stopPropagation()
                          }
                        />
                      </TableCell>

                      <TableCell>
                        {document.documentNumber ??
                          document.id}
                      </TableCell>

                      <TableCell>
                        {document.issueDate ?? "-"}
                      </TableCell>

                      <TableCell>
                        {issuerCompany?.name ?? "-"}
                      </TableCell>

                      <TableCell align="right">
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 3
          }}
        >
          <Typography variant="h6">
            Total seleccionado: $
            {selectedTotal.toLocaleString("es-CL")}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 3
          }}
        >
          <Button
            variant="outlined"
            onClick={() =>
              navigate("/expenses")
            }
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateExpense}
          >
            Crear Rendición
          </Button>
        </Box>
      </Paper>
    </>
  );
}