import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import type {
  ExpenseClaim
} from "../models/ExpenseClaim";

import {
  ExpenseClaimStatus
} from "../models/ExpenseClaimStatus";

import type {
  ExpenseDocument
} from "../models/ExpenseDocument";

import type {
  Project
} from "../models/Project";

import {
  UserRole
} from "../models/UserRole";


import {
  getExpenseClaims,
  submitExpenseClaim
} from "../services/expenseClaimService";

import {
  getDocuments
} from "../services/expenseDocumentService";

import {
  getProjects
} from "../services/projectService";


import {
  useAuth
} from "../hooks/useAuth";


import {
  getExpenseClaimStatusColor,
  getExpenseClaimStatusLabel
} from "../utils/expenseClaimStatusUtils";

import {
  getDocumentStatusColor,
  getDocumentStatusLabel
} from "../utils/documentStatusUtils";


export default function ExpenseDetail() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();


  const [claim, setClaim] =
    useState<ExpenseClaim | null>(null);

  const [documents, setDocuments] =
    useState<ExpenseDocument[]>([]);

  const [projects, setProjects] =
    useState<Project[]>([]);


  useEffect(() => {

    async function loadData() {

      const claimId =
        Number(id);


      const claimsResponse =
        await getExpenseClaims();

      const documentsResponse =
        await getDocuments();

      const projectsResponse =
        await getProjects();


      const selectedClaim =
        claimsResponse.find(
          claim =>
            claim.id === claimId
        );


      const claimDocuments =
        documentsResponse.filter(
          document =>
            document.expenseClaimId ===
            claimId
        );


      setClaim(
        selectedClaim ?? null
      );

      setDocuments(
        claimDocuments
      );

      setProjects(
        projectsResponse
      );

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


  const total =
    documents.reduce(
      (sum, document) =>
        sum + (document.total ?? 0),
      0
    );


  const getProjectName = (
    projectId: number | null
  ) => {

    if (projectId === null) {
      return "Sin proyecto";
    }


    return projects.find(
      project =>
        project.id === projectId
    )?.name ?? "Proyecto no encontrado";

  };


  /*
   * Una rendición solamente puede
   * modificarse mientras está en
   * Draft o Returned.
   */
  const canEdit =
    claim.status ===
      ExpenseClaimStatus.Draft ||
    claim.status ===
      ExpenseClaimStatus.Returned;


  /*
   * Accountant y Admin pueden revisar
   * una rendición enviada.
   */
  const canReview =
    (
      user?.role === UserRole.Accountant ||
      user?.role === UserRole.Admin
    ) &&
    claim.status ===
      ExpenseClaimStatus.Submitted;


  /*
   * Una rendición puede enviarse a revisión
   * cuando:
   *
   * - está en Draft o Returned
   * - tiene al menos un documento
   *
   * Los documentos NO necesitan estar
   * previamente validados.
   */
  const canSubmit =
    user !== null &&
    (
      user.role === UserRole.Employee ||
      user.role === UserRole.Accountant ||
      user.role === UserRole.Admin
    ) &&
    (
      claim.status ===
        ExpenseClaimStatus.Draft ||
      claim.status ===
        ExpenseClaimStatus.Returned
    ) &&
    documents.length > 0;


  const handleSubmit = async () => {

    if (!user) {

      alert(
        "No se pudo identificar al usuario."
      );

      return;
    }


    try {

      const updatedClaim =
        await submitExpenseClaim(
          claim.id,
          user
        );


      /*
       * Actualizamos el estado local
       * en lugar de recargar toda la página.
       *
       * Esto evita perder la sesión,
       * ya que el login está actualmente
       * almacenado en memoria.
       */
      setClaim({
        ...updatedClaim
      });


      alert(
        "Rendición enviada a revisión correctamente."
      );

    } catch (error) {

      console.error(error);


      const message =
        error instanceof Error
          ? error.message
          : "No fue posible enviar la rendición.";


      alert(message);

    }

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
            onClick={() =>
              navigate("/expenses")
            }
            aria-label="Volver a rendiciones"
            sx={{
              border: 1,
              borderColor: "divider"
            }}
          >
            <ArrowBackIcon />
          </IconButton>


          <Typography variant="h4">
            {claim.title}
          </Typography>


          {canEdit && (

            <Button
              variant="outlined"
              onClick={() =>
                navigate(
                  `/expenses/${claim.id}/edit`
                )
              }
            >
              Editar
            </Button>

          )}


          {canSubmit && (

            <Button
              variant="contained"
              onClick={handleSubmit}
            >
              Enviar a revisión
            </Button>

          )}


          {canReview && (

            <Button
              variant="contained"
              onClick={() =>
                navigate(
                  `/expenses/${claim.id}/review`
                )
              }
            >
              Revisar
            </Button>

          )}

        </Box>


        <Chip
          label={
            getExpenseClaimStatusLabel(
              claim.status
            )
          }
          size="small"
          color={
            getExpenseClaimStatusColor(
              claim.status
            )
          }
        />

      </Box>


      <Paper
        sx={{
          p: 3,
          mb: 4
        }}
      >

        <Typography
          variant="h6"
          sx={{
            mb: 3
          }}
        >
          Información de la rendición
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
              Fecha de creación
            </Typography>


            <Typography variant="body1">
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


            <Typography variant="body1">
              {getProjectName(
                claim.projectId
              )}
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
              label={
                getExpenseClaimStatusLabel(
                  claim.status
                )
              }
              size="small"
              color={
                getExpenseClaimStatusColor(
                  claim.status
                )
              }
              sx={{
                mt: 0.5
              }}
            />

          </Box>

        </Box>

      </Paper>


      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2
        }}
      >

        <Typography variant="h5">
          Documentos asociados
        </Typography>


        <Typography variant="h6">
          Total: $
          {total.toLocaleString(
            "es-CL"
          )}
        </Typography>

      </Box>


      <TableContainer
        component={Paper}
      >

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Documento
              </TableCell>

              <TableCell>
                Fecha
              </TableCell>

              <TableCell align="right">
                Total
              </TableCell>

              <TableCell>
                Estado
              </TableCell>

              <TableCell>
                Acciones
              </TableCell>

            </TableRow>

          </TableHead>


          <TableBody>

            {documents.map(
              document => (

                <TableRow
                  key={document.id}
                  hover
                >

                  <TableCell>
                    {document.documentNumber ??
                      "-"}
                  </TableCell>


                  <TableCell>
                    {document.issueDate ??
                      "-"}
                  </TableCell>


                  <TableCell align="right">
                    $
                    {(document.total ?? 0)
                      .toLocaleString(
                        "es-CL"
                      )}
                  </TableCell>


                  <TableCell>

                    <Chip
                      label={
                        getDocumentStatusLabel(
                          document.status
                        )
                      }
                      size="small"
                      color={
                        getDocumentStatusColor(
                          document.status
                        )
                      }
                    />

                  </TableCell>


                  <TableCell>

                    <Button
                      size="small"
                      onClick={() =>
                        navigate(
                          `/documents/${document.id}`,
                          {
                            state: {
                              returnTo:
                                `/expenses/${claim.id}`
                            }
                          }
                        )
                      }
                    >
                      Ver documento
                    </Button>

                  </TableCell>

                </TableRow>

              )
            )}

          </TableBody>

        </Table>

      </TableContainer>

    </>
  );
}