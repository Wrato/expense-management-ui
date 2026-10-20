
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
import { users } from "../mocks/users";
import { expenseClaims } from "../mocks/expenseClaims";
import { costTypes } from "../mocks/costTypes";

import { DocumentStatus } from "../models/DocumentStatus";
import { ExpenseClaimStatus } from "../models/ExpenseClaimStatus";
import { UserRole } from "../models/UserRole";

import { useAuth } from "../hooks/useAuth";

export default function DocumentForm() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [issuerCompanyId, setIssuerCompanyId] =
    useState<number | "">("");

  const [employeeId, setEmployeeId] =
    useState<number | "">(
      user?.role === UserRole.Employee
        ? user.id
        : ""
    );

  const [expenseClaimId, setExpenseClaimId] =
    useState<number | "">("");

  const [costTypeLevel1Id, setCostTypeLevel1Id] =
    useState<number | "">("");

  const [costTypeLevel2Id, setCostTypeLevel2Id] =
    useState<number | "">("");

  const [costTypeLevel3Id, setCostTypeLevel3Id] =
    useState<number | "">("");

  const [issueDate, setIssueDate] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [total, setTotal] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const level1Types = costTypes.filter(
    item => item.level === 1
  );

  const level2Types = costTypes.filter(
    item =>
      item.level === 2 &&
      item.parentId === costTypeLevel1Id
  );

  const level3Types = costTypes.filter(
    item =>
      item.level === 3 &&
      item.parentId === costTypeLevel2Id
  );

  const availableExpenseClaims = expenseClaims.filter(
    claim =>
      claim.employeeId === employeeId &&
      (
        claim.status === ExpenseClaimStatus.Draft ||
        claim.status === ExpenseClaimStatus.Returned
      )
  );

  const handleSave = () => {
    if (
      issuerCompanyId === "" ||
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
        ...expenseDocuments.map(document => document.id)
      ) + 1;

    const issuerCompany = issuerCompanies.find(
      company => company.id === issuerCompanyId
    );

    expenseDocuments.push({
      id: newId,
      sourcePhone: null,
      issuerCompanyId,
      issuerCompanyRut: issuerCompany?.rut ?? null,
      projectId: null,
      employeeId,
      expenseClaimId:
        expenseClaimId === "" ? null : expenseClaimId,
      costTypeId:
        costTypeLevel3Id === ""
          ? null
          : costTypeLevel3Id,
      issueDate,
      sentAt: new Date().toISOString(),
      total: numericTotal,
      imageUrl: imageUrl.trim(),
      documentNumber: documentNumber.trim(),
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

      <Paper sx={{ p: 3, maxWidth: 700 }}>
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
            onChange={event => setImageUrl(event.target.value)}
            required
            fullWidth
            placeholder="https://..."
            helperText="Pega aquí el enlace al documento almacenado externamente"
          />

          <FormControl fullWidth required>
            <InputLabel>Empresa emisora</InputLabel>
            <Select
              value={issuerCompanyId}
              label="Empresa emisora"
              onChange={event =>
                setIssuerCompanyId(Number(event.target.value))
              }
            >
              {issuerCompanies
                .filter(company => company.active)
                .map(company => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name} - {company.rut}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Trabajador</InputLabel>
            <Select
              value={employeeId}
              label="Trabajador"
              disabled={user?.role === UserRole.Employee}
              onChange={event => {
                setEmployeeId(Number(event.target.value));
                setExpenseClaimId("");
              }}
            >
              {users
                .filter(employee => employee.role === UserRole.Employee)
                .map(employee => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Rendición</InputLabel>
            <Select
              value={expenseClaimId}
              label="Rendición"
              disabled={employeeId === ""}
              onChange={event =>
                setExpenseClaimId(
                  event.target.value === ""
                    ? ""
                    : Number(event.target.value)
                )
              }
            >
              <MenuItem value="">Sin rendición</MenuItem>

              {availableExpenseClaims.map(claim => (
                <MenuItem key={claim.id} value={claim.id}>
                  {claim.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="h6">
            Tipo de costo
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Tipo de costo - Nivel 1</InputLabel>
            <Select
              value={costTypeLevel1Id}
              label="Tipo de costo - Nivel 1"
              onChange={event => {
                const value = event.target.value;

                setCostTypeLevel1Id(
                  value === "" ? "" : Number(value)
                );
                setCostTypeLevel2Id("");
                setCostTypeLevel3Id("");
              }}
            >
              <MenuItem value="">
                <em>Sin asignar</em>
              </MenuItem>

              {level1Types.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.code} - {item.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={costTypeLevel1Id === ""}>
            <InputLabel>Tipo de costo - Nivel 2</InputLabel>
            <Select
              value={costTypeLevel2Id}
              label="Tipo de costo - Nivel 2"
              onChange={event => {
                const value = event.target.value;

                setCostTypeLevel2Id(
                  value === "" ? "" : Number(value)
                );
                setCostTypeLevel3Id("");
              }}
            >
              <MenuItem value="">
                <em>Sin asignar</em>
              </MenuItem>

              {level2Types.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.code} - {item.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={costTypeLevel2Id === ""}>
            <InputLabel>Tipo de costo - Nivel 3</InputLabel>
            <Select
              value={costTypeLevel3Id}
              label="Tipo de costo - Nivel 3"
              onChange={event =>
                setCostTypeLevel3Id(
                  event.target.value === ""
                    ? ""
                    : Number(event.target.value)
                )
              }
            >
              <MenuItem value="">
                <em>Sin asignar</em>
              </MenuItem>

              {level3Types.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.code} - {item.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Fecha de emisión"
            type="date"
            value={issueDate}
            onChange={event => setIssueDate(event.target.value)}
            slotProps={{
              inputLabel: { shrink: true }
            }}
            required
            fullWidth
          />

          <TextField
            label="N° documento"
            value={documentNumber}
            onChange={event => setDocumentNumber(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Total"
            value={total}
            onChange={event => setTotal(event.target.value)}
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
              onClick={() => navigate("/documents")}
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
