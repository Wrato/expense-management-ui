import {
  Box,
  Typography,
  Button,
  Paper,
  FormControlLabel,
  Checkbox,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { ExpenseDocument } from "../models/ExpenseDocument";
import { DocumentStatus } from "../models/DocumentStatus";
import { UserRole } from "../models/UserRole";

import { users } from "../mocks/users";
import { projects } from "../mocks/projects";

import { getDocuments } from "../services/expenseDocumentService";
import { createExpenseClaim } from "../services/expenseClaimService";

import { useAuth } from "../hooks/useAuth";

import {
  getDocumentStatusColor,
  getDocumentStatusLabel
} from "../utils/documentStatusUtils";

export default function ExpenseForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");

  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState<number | null>(
      user?.role === UserRole.Employee
        ? user.id
        : null
    );

  const [selectedProjectId, setSelectedProjectId] =
    useState<number | null>(null);

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
      if (!selectedEmployeeId || !selectedProjectId) {
        setDocuments([]);
        return;
      }

      const response = await getDocuments();

      const availableDocuments = response.filter(
        document =>
          document.employeeId === selectedEmployeeId &&
          document.projectId === selectedProjectId &&
          document.expenseClaimId === null &&
          document.status === DocumentStatus.Pending
      );

      setDocuments(availableDocuments);
    }

    loadDocuments();
  }, [selectedEmployeeId, selectedProjectId]);

  const handleEmployeeChange = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    setSelectedProjectId(null);
    setSelectedDocuments([]);
    setDocuments([]);
  };

  const selectedEmployee = users.find(
    employee => employee.id === selectedEmployeeId
  );

  const availableProjects = projects.filter(
    project =>
      project.companyId === selectedEmployee?.companyId
  );

  const handleToggleDocument = (documentId: number) => {
    const document = documents.find(
      document => document.id === documentId
    );

    if (!document) {
      return;
    }

    // Seguridad adicional en la interfaz.
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
    if (!user) {
      return;
    }

    if (!title.trim()) {
      alert("Debes ingresar un título para la rendición");
      return;
    }

    if (!selectedEmployeeId) {
      alert("Debes seleccionar un empleado");
      return;
    }

    if (!selectedProjectId) {
      alert("Debes seleccionar un proyecto");
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
        projectId: selectedProjectId,
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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr"
          },
          gap: 2,
          mb: 3
        }}
      >
        {!isEmployee && (
          <FormControl fullWidth>
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

        <FormControl fullWidth>
          <InputLabel>Proyecto</InputLabel>

          <Select
            value={selectedProjectId ?? ""}
            label="Proyecto"
            disabled={!selectedEmployeeId}
            onChange={event => {
              setSelectedProjectId(
                Number(event.target.value)
              );

              setSelectedDocuments([]);
            }}
          >
            {availableProjects.map(project => (
              <MenuItem
                key={project.id}
                value={project.id}
              >
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

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
          documents.map(document => (
            <Box key={document.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedDocuments.includes(
                      document.id
                    )}
                    onChange={() =>
                      handleToggleDocument(
                        document.id
                      )
                    }
                  />
                }
                label={
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                      }}
                    >
                      <Typography>
                        Documento{" "}
                        {document.documentNumber ??
                          document.id}
                      </Typography>

                      <Chip
                        label={getDocumentStatusLabel(
                          document.status
                        )}
                        size="small"
                        color={getDocumentStatusColor(
                          document.status
                        )}
                      />
                    </Box>
                  </Box>
                }
              />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 4 }}
              >
                Fecha: {document.issueDate ?? "-"} |
                Total: $
                {(document.total ?? 0)
                  .toLocaleString("es-CL")}
              </Typography>

              <Divider sx={{ my: 1 }} />
            </Box>
          ))
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