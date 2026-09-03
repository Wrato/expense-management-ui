import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { ExpenseClaim } from "../models/ExpenseClaim";
import type { ExpenseDocument } from "../models/ExpenseDocument";
import type { Project } from "../models/Project";

import {
  getExpenseClaims,
  reviewExpenseClaim,
  returnExpenseClaim
} from "../services/expenseClaimService";

import { getDocuments } from "../services/expenseDocumentService";
import { getProjects } from "../services/projectService";

import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../models/UserRole";

import {
  getExpenseClaimStatusColor,
  getExpenseClaimStatusLabel
} from "../utils/expenseClaimStatusUtils";

import {
  getDocumentStatusLabel,
  getDocumentStatusColor
} from "../utils/documentStatusUtils";

export default function ExpenseReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [claim, setClaim] =
    useState<ExpenseClaim | null>(null);

  const [documents, setDocuments] =
    useState<ExpenseDocument[]>([]);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [rejectedDocumentIds, setRejectedDocumentIds] =
    useState<number[]>([]);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    async function loadData() {
      const claimId = Number(id);

      const claimsResponse =
        await getExpenseClaims();

      const documentsResponse =
        await getDocuments();

      const projectsResponse =
        await getProjects();

      const selectedClaim =
        claimsResponse.find(
          claim => claim.id === claimId
        );

      if (!selectedClaim) {
        return;
      }

      setClaim(selectedClaim);
      setProjects(projectsResponse);

      const claimDocuments =
        documentsResponse.filter(
          document =>
            document.expenseClaimId === claimId
        );

      setDocuments(claimDocuments);
      setRejectedDocumentIds([]);
    }

    loadData();
  }, [id]);

  if (!claim) {
    return (
      <Typography>
        Rendición no encontrada
      </Typography>
    );
  }

  const project =
    projects.find(
      project => project.id === claim.projectId
    );

  const total =
    documents.reduce(
      (sum, document) =>
        sum + (document.total ?? 0),
      0
    );

  const approvedTotal =
    documents
      .filter(
        document =>
          !rejectedDocumentIds.includes(
            document.id
          )
      )
      .reduce(
        (sum, document) =>
          sum + (document.total ?? 0),
        0
      );

  const rejectedTotal =
    documents
      .filter(
        document =>
          rejectedDocumentIds.includes(
            document.id
          )
      )
      .reduce(
        (sum, document) =>
          sum + (document.total ?? 0),
        0
      );

  const handleToggleRejected = (
    documentId: number
  ) => {
    setRejectedDocumentIds(current => {
      if (current.includes(documentId)) {
        return current.filter(
          id => id !== documentId
        );
      }

      return [
        ...current,
        documentId
      ];
    });
  };

  const handleReturn = async () => {
    if (!user) {
      alert(
        "No se pudo identificar al usuario"
      );
      return;
    }

    if (
      user.role !== UserRole.Admin &&
      user.role !== UserRole.Accountant
    ) {
      alert(
        "No tienes permisos para devolver rendiciones"
      );
      return;
    }

    try {
      setSaving(true);

      await returnExpenseClaim(
        claim.id,
        user.id
      );

      alert(
        "La rendición fue devuelta para corrección."
      );

      navigate(
        `/expenses/${claim.id}`
      );
    } catch (error) {
      console.error(error);

      alert(
        "No fue posible devolver la rendición."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReview = async () => {
    if (!user) {
      alert(
        "No se pudo identificar al usuario"
      );
      return;
    }

    if (
      user.role !== UserRole.Admin &&
      user.role !== UserRole.Accountant
    ) {
      alert(
        "No tienes permisos para revisar rendiciones"
      );
      return;
    }

    try {
      setSaving(true);

      await reviewExpenseClaim(
        claim.id,
        rejectedDocumentIds,
        user.id
      );

      if (
        rejectedDocumentIds.length > 0
      ) {
        alert(
          `La rendición fue aprobada. ${rejectedDocumentIds.length} documento(s) fueron rechazados y quedaron disponibles para corrección.`
        );
      } else {
        alert(
          "La rendición y todos sus documentos fueron aprobados correctamente."
        );
      }

      navigate(
        `/expenses/${claim.id}`
      );
    } catch (error) {
      console.error(error);
      alert(
        "No fue posible procesar la revisión."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* HEADER */}
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
          onClick={() =>
            navigate(
              `/expenses/${claim.id}`
            )
          }
        >
          Volver
        </Button>

        <Typography variant="h4">
          Revisar Rendición
        </Typography>
      </Box>

      {/* INFORMACIÓN DE LA RENDICIÓN */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ mb: 3 }}
        >
          Información de la rendición
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(4, 1fr)"
            },
            gap: 3
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Rendición
            </Typography>

            <Typography>
              {claim.title}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Fecha de creación
            </Typography>

            <Typography>
              {new Date(
                claim.createdAt
              ).toLocaleDateString(
                "es-CL"
              )}
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
              label={getExpenseClaimStatusLabel(
                claim.status
              )}
              size="small"
              color={getExpenseClaimStatusColor(
                claim.status
              )}
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>
      </Paper>

      {/* DOCUMENTOS */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ mb: 1 }}
        >
          Documentos a revisar
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Revisa los documentos y marca
          solamente aquellos que tengan
          algún problema. Los documentos
          que no marques serán aprobados
          automáticamente.
        </Typography>

        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold" }}
                >
                  ID
                </TableCell>

                <TableCell
                  sx={{ fontWeight: "bold" }}
                >
                  Fecha
                </TableCell>

                <TableCell
                  sx={{ fontWeight: "bold" }}
                >
                  N° documento
                </TableCell>

                <TableCell
                  sx={{ fontWeight: "bold" }}
                  align="right"
                >
                  Total
                </TableCell>

                <TableCell
                  sx={{ fontWeight: "bold" }}
                >
                  Estado actual
                </TableCell>

                <TableCell
                  sx={{ fontWeight: "bold" }}
                >
                  Resultado
                </TableCell>

                <TableCell
                  sx={{ fontWeight: "bold" }}
                  align="center"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {documents.map(document => {
                const isRejected =
                  rejectedDocumentIds.includes(
                    document.id
                  );

                return (
                  <TableRow
                    key={document.id}
                    hover
                  >
                    <TableCell>
                      {document.id}
                    </TableCell>

                    <TableCell>
                      {document.issueDate ??
                        "-"}
                    </TableCell>

                    <TableCell>
                      {document.documentNumber ??
                        "-"}
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
                      <Chip
                        icon={
                          isRejected
                            ? <BlockIcon />
                            : <CheckIcon />
                        }
                        label={
                          isRejected
                            ? "Será rechazado"
                            : "Será aprobado"
                        }
                        color={
                          isRejected
                            ? "error"
                            : "success"
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "center",
                          gap: 1
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            navigate(
                              `/documents/${document.id}`,
                              {
                                state: {
                                  returnTo:
                                    `/expenses/${claim.id}/review`
                                }
                              }
                            )
                          }
                        >
                          Ver
                        </Button>

                        <Button
                          size="small"
                          variant={
                            isRejected
                              ? "contained"
                              : "outlined"
                          }
                          color="error"
                          startIcon={
                            <BlockIcon />
                          }
                          onClick={() =>
                            handleToggleRejected(
                              document.id
                            )
                          }
                        >
                          {isRejected
                            ? "Desmarcar"
                            : "Rechazar"}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* TOTALES Y PROCESAR */}
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)"
            },
            gap: 3,
            mb: 3
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Total original
            </Typography>

            <Typography variant="h6">
              ${total.toLocaleString(
                "es-CL"
              )}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Total aprobado
            </Typography>

            <Typography variant="h6">
              ${approvedTotal.toLocaleString(
                "es-CL"
              )}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Total rechazado
            </Typography>

            <Typography variant="h6">
              ${rejectedTotal.toLocaleString(
                "es-CL"
              )}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2
          }}
        >
          <Button
            variant="outlined"
            color="warning"
            onClick={handleReturn}
            disabled={saving}
          >
            Devolver rendición
          </Button>

          <Button
            variant="contained"
            startIcon={<CheckIcon />}
            onClick={handleReview}
            disabled={
              saving ||
              documents.length === 0
            }
          >
            Procesar revisión
          </Button>
        </Box>
      </Paper>
    </>
  );
}