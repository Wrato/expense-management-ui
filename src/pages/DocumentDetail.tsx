
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Button
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  useNavigate,
  useParams,
  useLocation
} from "react-router-dom";

import { useEffect, useState } from "react";

import type { ExpenseDocument } from "../models/ExpenseDocument";
import { DocumentStatus } from "../models/DocumentStatus";

import { getDocuments } from "../services/expenseDocumentService";

import { issuerCompanies } from "../mocks/issuerCompanies";
import { projects } from "../mocks/projects";
import { costTypes } from "../mocks/costTypes";

import {
  getDocumentStatusLabel,
  getDocumentStatusColor
} from "../utils/documentStatusUtils";

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [document, setDocument] =
    useState<ExpenseDocument | null>(null);

  useEffect(() => {
    async function loadDocument() {
      const documentId = Number(id);
      const response = await getDocuments();

      const selectedDocument = response.find(
        item => item.id === documentId
      );

      setDocument(selectedDocument ?? null);
    }

    loadDocument();
  }, [id]);

  if (!document) {
    return <Typography>Documento no encontrado</Typography>;
  }

  const issuerCompany = issuerCompanies.find(
    company => company.id === document.issuerCompanyId
  );

  const project = projects.find(
    item => item.id === document.projectId
  );

  // costTypeId representa el nivel más específico asignado.
  const selectedCostType = costTypes.find(
    item => item.id === document.costTypeId
  );

  const costTypeLevel3 =
    selectedCostType?.level === 3
      ? selectedCostType
      : undefined;

  const costTypeLevel2 = costTypeLevel3
    ? costTypes.find(
        item =>
          item.id === costTypeLevel3.parentId &&
          item.level === 2
      )
    : selectedCostType?.level === 2
      ? selectedCostType
      : undefined;

  const costTypeLevel1 = costTypeLevel2
    ? costTypes.find(
        item =>
          item.id === costTypeLevel2.parentId &&
          item.level === 1
      )
    : selectedCostType?.level === 1
      ? selectedCostType
      : undefined;

  const canEdit =
    document.status === DocumentStatus.Pending ||
    document.status === DocumentStatus.Rejected;

  const handleBack = () => {
    const returnTo = location.state?.returnTo;

    if (returnTo) {
      navigate(returnTo);
      return;
    }

    navigate("/documents");
  };

  const formatCostType = (
    item: typeof selectedCostType
  ) => item ? `${item.code} - ${item.description}` : "Sin asignar";

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap"
          }}
        >
          <IconButton
            onClick={handleBack}
            aria-label="Volver a documentos"
            sx={{
              border: 1,
              borderColor: "divider"
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h4">
            Documento #{document.id}
          </Typography>

          {canEdit && (
            <Button
              variant="outlined"
              onClick={() =>
                navigate(`/documents/${document.id}/edit`, {
                  state: {
                    returnTo: location.state?.returnTo
                  }
                })
              }
            >
              Editar
            </Button>
          )}
        </Box>

        <Chip
          label={getDocumentStatusLabel(document.status)}
          color={getDocumentStatusColor(document.status)}
        />
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Información del documento
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)"
            },
            gap: 3
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Número de documento
            </Typography>
            <Typography>{document.documentNumber ?? "-"}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Fecha de emisión
            </Typography>
            <Typography>{document.issueDate ?? "-"}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Fecha de envío
            </Typography>
            <Typography>
              {document.sentAt
                ? new Date(document.sentAt).toLocaleString("es-CL")
                : "-"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
            <Typography>
              ${(document.total ?? 0).toLocaleString("es-CL")}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Teléfono de origen
            </Typography>
            <Typography>{document.sourcePhone ?? "-"}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Empresa emisora
            </Typography>
            <Typography>{issuerCompany?.name ?? "Sin asignar"}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              RUT empresa emisora
            </Typography>
            <Typography>
              {document.issuerCompanyRut ?? "Sin registrar"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Proyecto
            </Typography>
            <Typography>{project?.name ?? "Sin proyecto"}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Estado
            </Typography>
            <Chip
              label={getDocumentStatusLabel(document.status)}
              color={getDocumentStatusColor(document.status)}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Tipo de costo
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)"
              },
              gap: 3
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Tipo de costo - Nivel 1
              </Typography>
              <Typography>
                {formatCostType(costTypeLevel1)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Tipo de costo - Nivel 2
              </Typography>
              <Typography>
                {formatCostType(costTypeLevel2)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Tipo de costo - Nivel 3
              </Typography>
              <Typography>
                {formatCostType(costTypeLevel3)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
