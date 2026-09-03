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

      const response =
        await getDocuments();

      const selectedDocument =
        response.find(
          document =>
            document.id === documentId
        );

      setDocument(
        selectedDocument ?? null
      );
    }

    loadDocument();
  }, [id]);

  if (!document) {
    return (
      <Typography>
        Documento no encontrado
      </Typography>
    );
  }

  const issuerCompany =
    issuerCompanies.find(
      company =>
        company.id ===
        document.issuerCompanyId
    );

  const project =
    projects.find(
      project =>
        project.id ===
        document.projectId
    );

  const canEdit =
    document.status ===
      DocumentStatus.Pending ||
    document.status ===
      DocumentStatus.Rejected;

  const handleBack = () => {
    const returnTo =
      location.state?.returnTo;

    if (returnTo) {
      navigate(returnTo);
      return;
    }

    navigate("/documents");
  };

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
            gap: 1
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
                navigate(
                  `/documents/${document.id}/edit`,
                  {
                    state: {
                      returnTo:
                        location.state?.returnTo
                    }
                  }
                )
              }
            >
              Editar
            </Button>
          )}
        </Box>

        <Chip
          label={getDocumentStatusLabel(
            document.status
          )}
          color={getDocumentStatusColor(
            document.status
          )}
        />
      </Box>

      <Paper
        sx={{
          p: 3
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3
          }}
        >
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
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Número de documento
            </Typography>

            <Typography>
              {document.documentNumber ?? "-"}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Fecha de emisión
            </Typography>

            <Typography>
              {document.issueDate ?? "-"}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Fecha de envío
            </Typography>

            <Typography>
              {document.sentAt
                ? new Date(
                    document.sentAt
                  ).toLocaleString("es-CL")
                : "-"}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Total
            </Typography>

            <Typography>
              $
              {(document.total ?? 0)
                .toLocaleString("es-CL")}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Teléfono de origen
            </Typography>

            <Typography>
              {document.sourcePhone}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Empresa emisora
            </Typography>

            <Typography>
              {issuerCompany?.name ??
                "Sin asignar"}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              RUT empresa emisora
            </Typography>

            <Typography>
              {document.issuerCompanyRut ??
                "Sin registrar"}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Proyecto
            </Typography>

            <Typography>
              {project?.name ??
                "Sin proyecto"}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Estado
            </Typography>

            <Chip
              label={getDocumentStatusLabel(
                document.status
              )}
              color={getDocumentStatusColor(
                document.status
              )}
              size="small"
              sx={{
                mt: 0.5
              }}
            />
          </Box>
        </Box>
      </Paper>
    </>
  );
}