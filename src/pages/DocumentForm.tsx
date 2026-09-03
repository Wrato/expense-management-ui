import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { expenseDocuments } from "../mocks/expenseDocuments";
import { issuerCompanies } from "../mocks/issuerCompanies";
import { projects } from "../mocks/projects";
import { users } from "../mocks/users";

import { DocumentStatus } from "../models/DocumentStatus";
import { UserRole } from "../models/UserRole";
import { useAuth } from "../hooks/useAuth";

export default function DocumentForm() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [issuerCompanyId, setIssuerCompanyId] =
    useState<number | "">("");

  const [projectId, setProjectId] =
    useState<number | "">("");

  const [employeeId, setEmployeeId] =
    useState<number | "">(
      user?.role === UserRole.Employee
        ? user.id
        : ""
    );

  const [issueDate, setIssueDate] =
    useState("");

  const [documentNumber, setDocumentNumber] =
    useState("");

  const [total, setTotal] =
    useState("");

  const [imageUrl, setImageUrl] =
    useState("");

  const handleSave = () => {
    if (
      issuerCompanyId === "" ||
      projectId === "" ||
      employeeId === "" ||
      !issueDate ||
      !documentNumber.trim() ||
      !total.trim() ||
      !imageUrl.trim()
    ) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    const numericTotal = Number(
      total
        .replace(/\./g, "")
        .replace(",", ".")
    );

    if (
      Number.isNaN(numericTotal) ||
      numericTotal <= 0
    ) {
      alert("Ingresa un total válido.");
      return;
    }

    const newId =
      Math.max(
        0,
        ...expenseDocuments.map(
          document => document.id
        )
      ) + 1;

    const issuerCompany =
      issuerCompanies.find(
        company =>
          company.id === issuerCompanyId
      );

    expenseDocuments.push({
      id: newId,
      sourcePhone: null,
      issuerCompanyId,
      issuerCompanyRut:
        issuerCompany?.rut ?? null,
      projectId,
      employeeId,
      expenseClaimId: null,
      issueDate,
      sentAt: new Date().toISOString(),
      total: numericTotal,
      imageUrl: imageUrl.trim(),
      documentNumber:
        documentNumber.trim(),
      duplicateOfDocumentId: null,
      status: DocumentStatus.Pending
    });

    alert("Documento creado correctamente.");
    navigate("/documents");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 3
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/documents")}
        >
          Volver
        </Button>

        <Typography variant="h4">
          Agregar Documento
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 3,
          maxWidth: 700
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3
          }}
        >
          <TextField
            label="URL del documento"
            value={imageUrl}
            onChange={event =>
              setImageUrl(event.target.value)
            }
            required
            fullWidth
            placeholder="https://..."
            helperText="Pega aquí el enlace al documento almacenado externamente"
          />

          <FormControl
            fullWidth
            required
          >
            <InputLabel>
              Empresa emisora
            </InputLabel>

            <Select
              value={issuerCompanyId}
              label="Empresa emisora"
              onChange={event =>
                setIssuerCompanyId(
                  Number(event.target.value)
                )
              }
            >
              {issuerCompanies
                .filter(
                  company => company.active
                )
                .map(company => (
                  <MenuItem
                    key={company.id}
                    value={company.id}
                  >
                    {company.name} -{" "}
                    {company.rut}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            required
          >
            <InputLabel>
              Proyecto
            </InputLabel>

            <Select
              value={projectId}
              label="Proyecto"
              onChange={event =>
                setProjectId(
                  Number(event.target.value)
                )
              }
            >
              {projects.map(project => (
                <MenuItem
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            required
          >
            <InputLabel>
              Trabajador
            </InputLabel>

            <Select
              value={employeeId}
              label="Trabajador"
              disabled={
                user?.role ===
                UserRole.Employee
              }
              onChange={event =>
                setEmployeeId(
                  Number(event.target.value)
                )
              }
            >
              {users
                .filter(
                  user =>
                    user.role ===
                    UserRole.Employee
                )
                .map(employee => (
                  <MenuItem
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            label="Fecha de emisión"
            type="date"
            value={issueDate}
            onChange={event =>
              setIssueDate(
                event.target.value
              )
            }
            slotProps={{
              inputLabel: {
                shrink: true
              }
            }}
            required
            fullWidth
          />

          <TextField
            label="N° documento"
            value={documentNumber}
            onChange={event =>
              setDocumentNumber(
                event.target.value
              )
            }
            required
            fullWidth
          />

          <TextField
            label="Total"
            value={total}
            onChange={event =>
              setTotal(
                event.target.value
              )
            }
            required
            fullWidth
            placeholder="35000"
            helperText="Ingresa el monto total del documento"
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 2
            }}
          >
            <Button
              variant="outlined"
              onClick={() =>
                navigate("/documents")
              }
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}