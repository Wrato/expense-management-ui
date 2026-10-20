
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
  useLocation
} from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import { issuerCompanies } from "../mocks/issuerCompanies";
import { categories } from "../mocks/categories";
import { costTypes } from "../mocks/costTypes";

import type { ExpenseDocument } from "../models/ExpenseDocument";
import { DocumentStatus } from "../models/DocumentStatus";

import {
  getDocuments,
  updateDocument
} from "../services/expenseDocumentService";

export default function DocumentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo =
    location.state?.returnTo ?? `/documents/${id}`;

  const [document, setDocument] =
    useState<ExpenseDocument | null>(null);

  const [documentNumber, setDocumentNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [total, setTotal] = useState("");
  const [issuerCompanyId, setIssuerCompanyId] = useState("");
  const [issuerCompanyRut, setIssuerCompanyRut] = useState("");

  const [costTypeLevel1Id, setCostTypeLevel1Id] =
    useState<number | "">("");

  const [costTypeLevel2Id, setCostTypeLevel2Id] =
    useState<number | "">("");

  const [costTypeLevel3Id, setCostTypeLevel3Id] =
    useState<number | "">("");

  useEffect(() => {
    async function loadDocument() {
      const documentId = Number(id);
      const response = await getDocuments();

      const selectedDocument = response.find(
        item => item.id === documentId
      );

      if (!selectedDocument) {
        setDocument(null);
        return;
      }

      if (selectedDocument.status === DocumentStatus.Approved) {
        navigate(
          `/documents/${selectedDocument.id}`,
          { state: { returnTo } }
        );
        return;
      }

      setDocument(selectedDocument);

      setDocumentNumber(selectedDocument.documentNumber ?? "");
      setIssueDate(selectedDocument.issueDate ?? "");
      setTotal(selectedDocument.total?.toString() ?? "");
      setIssuerCompanyId(
        selectedDocument.issuerCompanyId?.toString() ?? ""
      );
      setIssuerCompanyRut(selectedDocument.issuerCompanyRut ?? "");

      // Reconstruir la jerarquía desde el nivel guardado.
      const selectedCostType = costTypes.find(
        item => item.id === selectedDocument.costTypeId
      );

      // Limpiar primero los selectores para evitar valores anteriores.
      setCostTypeLevel1Id("");
      setCostTypeLevel2Id("");
      setCostTypeLevel3Id("");

      if (!selectedCostType) {
        return;
      }

      if (selectedCostType.level === 1) {
        // Por ejemplo, un documento pendiente con Operacional.
        setCostTypeLevel1Id(selectedCostType.id);
        return;
      }

      if (selectedCostType.level === 2) {
        const parentLevel1 = costTypes.find(
          item =>
            item.id === selectedCostType.parentId &&
            item.level === 1
        );

        if (parentLevel1) {
          setCostTypeLevel1Id(parentLevel1.id);
          setCostTypeLevel2Id(selectedCostType.id);
        }

        return;
      }

      if (selectedCostType.level === 3) {
        const parentLevel2 = costTypes.find(
          item =>
            item.id === selectedCostType.parentId &&
            item.level === 2
        );

        const parentLevel1 = parentLevel2
          ? costTypes.find(
              item =>
                item.id === parentLevel2.parentId &&
                item.level === 1
            )
          : undefined;

        if (parentLevel1 && parentLevel2) {
          setCostTypeLevel1Id(parentLevel1.id);
          setCostTypeLevel2Id(parentLevel2.id);
          setCostTypeLevel3Id(selectedCostType.id);
        }
      }
    }

    loadDocument();
  }, [id, navigate, returnTo]);

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

  if (!document) {
    return <Typography>Documento no encontrado</Typography>;
  }

  if (document.status === DocumentStatus.Approved) {
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
            onClick={() => navigate(returnTo)}
          >
            Volver
          </Button>

          <Typography variant="h4">
            Documento #{document.id}
          </Typography>
        </Box>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Documento aprobado
          </Typography>

          <Typography color="text.secondary">
            Este documento ya fue aprobado y no puede ser modificado.
          </Typography>
        </Paper>
      </>
    );
  }

  const handleSave = async () => {
    // Guardar el nivel más específico seleccionado.
    // Si solo está seleccionado el nivel 1, se conserva ese ID.
    const selectedCostTypeId =
      costTypeLevel3Id !== ""
        ? costTypeLevel3Id
        : costTypeLevel2Id !== ""
          ? costTypeLevel2Id
          : costTypeLevel1Id !== ""
            ? costTypeLevel1Id
            : null;

    const updatedDocument: ExpenseDocument = {
      ...document,

      documentNumber: documentNumber.trim() || null,
      issueDate: issueDate || null,

      total: total.trim()
        ? Number(total)
        : null,

      issuerCompanyId: issuerCompanyId
        ? Number(issuerCompanyId)
        : null,

      issuerCompanyRut: issuerCompanyRut.trim() || null,

      costTypeId: selectedCostTypeId,

      status: DocumentStatus.Pending
    };

    try {
      await updateDocument(updatedDocument);

      alert(
        document.status === DocumentStatus.Rejected
          ? "Documento corregido correctamente y quedó pendiente."
          : "Documento actualizado correctamente."
      );

      navigate(returnTo);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "No fue posible actualizar el documento."
      );
    }
  };

  const selectedCompany = issuerCompanies.find(
    company => company.id.toString() === issuerCompanyId
  );

  const selectedCategory = selectedCompany
    ? categories.find(
        category => category.id === selectedCompany.categoryId
      )
    : null;

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
          onClick={() => navigate(returnTo)}
        >
          Cancelar
        </Button>

        <Typography variant="h4">
          Editar Documento #{document.id}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)"
            },
            gap: 3
          }}
        >
          <TextField
            label="Número de documento"
            value={documentNumber}
            onChange={event => setDocumentNumber(event.target.value)}
            fullWidth
          />

          <TextField
            label="Fecha de emisión"
            type="date"
            value={issueDate}
            onChange={event => setIssueDate(event.target.value)}
            slotProps={{
              inputLabel: { shrink: true }
            }}
            fullWidth
          />

          <TextField
            label="Fecha de envío"
            value={
              document.sentAt
                ? new Date(document.sentAt).toLocaleString("es-CL")
                : "-"
            }
            disabled
            fullWidth
          />

          <TextField
            label="Total"
            type="number"
            value={total}
            onChange={event => setTotal(event.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="issuer-company-label">
              Empresa emisora
            </InputLabel>

            <Select
              labelId="issuer-company-label"
              label="Empresa emisora"
              value={issuerCompanyId}
              onChange={event => setIssuerCompanyId(event.target.value)}
            >
              <MenuItem value="">
                <em>Sin asignar</em>
              </MenuItem>

              {issuerCompanies
                .filter(company => company.active)
                .map(company => (
                  <MenuItem
                    key={company.id}
                    value={company.id.toString()}
                  >
                    {company.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            label="RUT empresa emisora"
            value={issuerCompanyRut}
            onChange={event => setIssuerCompanyRut(event.target.value)}
            fullWidth
          />

          <TextField
            label="Categoría"
            value={selectedCategory?.name ?? "Sin asignar"}
            fullWidth
            disabled
          />

          <Box
            sx={{
              gridColumn: "1 / -1",
              display: "flex",
              flexDirection: "column",
              gap: 3
            }}
          >
            <Typography variant="h6">
              Tipo de costo
            </Typography>

            <FormControl fullWidth>
              <InputLabel id="cost-level-1-label">
                Tipo de costo - Nivel 1
              </InputLabel>

              <Select
                labelId="cost-level-1-label"
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

            <FormControl
              fullWidth
              disabled={costTypeLevel1Id === ""}
            >
              <InputLabel id="cost-level-2-label">
                Tipo de costo - Nivel 2
              </InputLabel>

              <Select
                labelId="cost-level-2-label"
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

            <FormControl
              fullWidth
              disabled={costTypeLevel2Id === ""}
            >
              <InputLabel id="cost-level-3-label">
                Tipo de costo - Nivel 3
              </InputLabel>

              <Select
                labelId="cost-level-3-label"
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
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 3,
            gap: 2
          }}
        >
          <Button onClick={() => navigate(returnTo)}>
            Cancelar
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Guardar cambios
          </Button>
        </Box>
      </Paper>
    </>
  );
}
