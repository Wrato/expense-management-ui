import {
  Box,
  Typography,
  Button,
  Paper,
  Checkbox,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import type { ExpenseClaim } from "../models/ExpenseClaim";
import { ExpenseClaimStatus } from "../models/ExpenseClaimStatus";

import type { ExpenseDocument } from "../models/ExpenseDocument";
import { DocumentStatus } from "../models/DocumentStatus";

import { users } from "../mocks/users";

import {
  getExpenseClaims,
  updateExpenseClaimDocuments,
  updateExpenseClaim
} from "../services/expenseClaimService";

import { getDocuments } from "../services/expenseDocumentService";

import {
  getExpenseClaimStatusColor,
  getExpenseClaimStatusLabel
} from "../utils/expenseClaimStatusUtils";

import {
  getDocumentStatusColor,
  getDocumentStatusLabel
} from "../utils/documentStatusUtils";

export default function ExpenseEdit() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [title, setTitle] = useState("");

  const [claim, setClaim] =
    useState<ExpenseClaim | null>(null);

  const [documents, setDocuments] =
    useState<ExpenseDocument[]>([]);

  const [selectedDocuments, setSelectedDocuments] =
    useState<number[]>([]);


  useEffect(() => {

    async function loadData() {

      const claimId =
        Number(id);

      const claimsResponse =
        await getExpenseClaims();

      const documentsResponse =
        await getDocuments();

      const selectedClaim =
        claimsResponse.find(
          claim =>
            claim.id === claimId
        );

      if (!selectedClaim) {
        return;
      }

      setClaim(
        selectedClaim
      );

      setTitle(
        selectedClaim.title
      );


      /*
       * Documentos actualmente asociados
       * a la rendición.
       */
      const assignedDocuments =
        documentsResponse.filter(
          document =>
            document.expenseClaimId ===
            claimId
        );

      const assignedDocumentIds =
        assignedDocuments.map(
          document =>
            document.id
        );

      setSelectedDocuments(
        assignedDocumentIds
      );


      /*
       * Documentos disponibles para agregar.
       *
       * Un documento nuevo debe:
       *
       * - estar libre
       * - estar PENDING
       * - pertenecer al mismo trabajador
       *   de la rendición
       */
      const availableDocuments =
        documentsResponse.filter(
          document => {

            const isAssigned =
              document.expenseClaimId ===
              claimId;

            const isFree =
              document.expenseClaimId ===
              null;


            /*
             * Si pertenece a otra rendición,
             * no está disponible.
             */
            if (
              !isFree &&
              !isAssigned
            ) {
              return false;
            }


            /*
             * Los documentos que ya están
             * en esta rendición siempre aparecen.
             */
            if (isAssigned) {
              return true;
            }


            /*
             * Los documentos nuevos deben
             * estar PENDING.
             */
            if (
              document.status !==
              DocumentStatus.Pending
            ) {
              return false;
            }


            /*
             * Todos los documentos nuevos
             * deben pertenecer al trabajador
             * de la rendición.
             */
            return (
              document.employeeId ===
              selectedClaim.employeeId
            );

          }
        );


      /*
       * Documentos que mostraremos:
       *
       * 1. Los actualmente asociados.
       * 2. Los PENDING disponibles del trabajador.
       */
      const documentsForEdition = [
        ...assignedDocuments,
        ...availableDocuments.filter(
          available =>
            !assignedDocumentIds.includes(
              available.id
            )
        )
      ];


      setDocuments(
        documentsForEdition
      );

    }


    loadData();

  }, [
    id
  ]);


  /*
   * Documentos que pueden ser seleccionados.
   *
   * Los APPROVED están bloqueados.
   */
  const selectableDocuments =
    documents.filter(
      document =>
        document.status ===
        DocumentStatus.Pending
    );


  const selectableDocumentIds =
    selectableDocuments.map(
      document =>
        document.id
    );


  const selectedSelectableIds =
    selectableDocumentIds.filter(
      documentId =>
        selectedDocuments.includes(
          documentId
        )
    );


  const allSelectableSelected =
    selectableDocumentIds.length > 0 &&
    selectedSelectableIds.length ===
      selectableDocumentIds.length;


  const someSelectableSelected =
    selectedSelectableIds.length > 0 &&
    selectedSelectableIds.length <
      selectableDocumentIds.length;


  /*
   * Seleccionar / deseleccionar todos
   * los documentos modificables.
   */
  const handleToggleAll = () => {

    if (
      allSelectableSelected
    ) {

      setSelectedDocuments(
        current =>
          current.filter(
            documentId =>
              !selectableDocumentIds.includes(
                documentId
              )
          )
      );

      return;
    }


    setSelectedDocuments(
      current =>
        Array.from(
          new Set([
            ...current,
            ...selectableDocumentIds
          ])
        )
    );

  };


  /*
   * Seleccionar / deseleccionar
   * un documento.
   */
  const handleToggleDocument = (
    documentId: number
  ) => {

    const document =
      documents.find(
        document =>
          document.id === documentId
      );

    if (!document) {
      return;
    }


    /*
     * Los documentos APPROVED
     * no pueden modificarse.
     */
    if (
      document.status ===
      DocumentStatus.Approved
    ) {
      return;
    }


    setSelectedDocuments(
      current => {

        if (
          current.includes(
            documentId
          )
        ) {

          return current.filter(
            id =>
              id !== documentId
          );

        }


        return [
          ...current,
          documentId
        ];

      }
    );

  };


  const selectedTotal =
    documents
      .filter(
        document =>
          selectedDocuments.includes(
            document.id
          )
      )
      .reduce(
        (sum, document) =>
          sum +
          (document.total ?? 0),
        0
      );


  const handleSave =
    async () => {

      if (!claim) {
        return;
      }


      if (!user) {

        alert(
          "No se pudo identificar al usuario"
        );

        return;
      }


      if (
        selectedDocuments.length === 0
      ) {

        alert(
          "Debes seleccionar al menos un documento"
        );

        return;
      }


      /*
       * Si la rendición fue devuelta,
       * al modificarla vuelve a Draft.
       */
      const updatedClaim: ExpenseClaim = {
        ...claim,

        title,

        status:
          claim.status ===
          ExpenseClaimStatus.Returned
            ? ExpenseClaimStatus.Draft
            : claim.status
      };


      try {

        await updateExpenseClaimDocuments(
          claim.id,
          selectedDocuments,
          user.id
        );


        await updateExpenseClaim(
          updatedClaim
        );


        alert(
          "Rendición actualizada correctamente"
        );


        navigate(
          `/expenses/${claim.id}`
        );

      } catch (error) {

        console.error(error);


        alert(
          error instanceof Error
            ? error.message
            : "No fue posible actualizar la rendición"
        );

      }

    };


  if (!claim) {

    return (
      <Typography>
        Rendición no encontrada
      </Typography>
    );

  }


  /*
   * Una rendición aprobada no puede modificarse.
   */
  if (
    claim.status ===
    ExpenseClaimStatus.Approved
  ) {

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
            startIcon={
              <ArrowBackIcon />
            }
            onClick={() =>
              navigate(
                `/expenses/${claim.id}`
              )
            }
          >
            Volver
          </Button>


          <Typography variant="h4">
            Rendición #{claim.id}
          </Typography>

        </Box>


        <Paper sx={{ p: 3 }}>

          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            Rendición aprobada
          </Typography>


          <Typography
            color="text.secondary"
          >
            Esta rendición ya fue aprobada
            y no puede ser modificada.
          </Typography>

        </Paper>

      </>
    );

  }


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
          startIcon={
            <ArrowBackIcon />
          }
          onClick={() =>
            navigate(
              `/expenses/${claim.id}`
            )
          }
        >
          Cancelar
        </Button>


        <Typography variant="h4">
          Editar Rendición
        </Typography>

      </Box>


      <Paper
        sx={{
          p: 3,
          mb: 3
        }}
      >

        <Typography
          variant="h6"
          sx={{ mb: 3 }}
        >
          Información de la rendición
        </Typography>


        <TextField
          label="Título de la rendición"
          value={title}
          onChange={event =>
            setTitle(
              event.target.value
            )
          }
          fullWidth
          sx={{ mb: 3 }}
        />


        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)"
            },
            gap: 3,
            mb: 4
          }}
        >

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
              sx={{ mt: 0.5 }}
            />

          </Box>

        </Box>


        <Typography
          variant="h6"
          sx={{ mb: 2 }}
        >
          Documentos
        </Typography>


        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Selecciona los documentos que forman
          parte de esta rendición. Los documentos
          aprobados están bloqueados.
        </Typography>


        {documents.length === 0 && (

          <Typography
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            No hay documentos disponibles
            para esta rendición.
          </Typography>

        )}


        {documents.length > 0 && (

          <TableContainer
            component={Paper}
            variant="outlined"
          >

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell
                    padding="checkbox"
                  >
                    <Checkbox
                      checked={
                        allSelectableSelected
                      }
                      indeterminate={
                        someSelectableSelected
                      }
                      onChange={
                        handleToggleAll
                      }
                      disabled={
                        selectableDocuments.length ===
                        0
                      }
                    />
                  </TableCell>


                  <TableCell>
                    ID
                  </TableCell>


                  <TableCell>
                    Trabajador
                  </TableCell>


                  <TableCell>
                    Fecha
                  </TableCell>


                  <TableCell>
                    N° documento
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
                  document => {

                    const isApproved =
                      document.status ===
                      DocumentStatus.Approved;


                    const isSelected =
                      selectedDocuments.includes(
                        document.id
                      );


                    return (

                      <TableRow
                        key={document.id}
                        hover
                      >

                        <TableCell
                          padding="checkbox"
                        >

                          <Checkbox
                            checked={
                              isSelected
                            }
                            disabled={
                              isApproved
                            }
                            onChange={() =>
                              handleToggleDocument(
                                document.id
                              )
                            }
                          />

                        </TableCell>


                        <TableCell>
                          {document.id}
                        </TableCell>


                        <TableCell>
                          {users.find(
                            user => user.id === document.employeeId
                          )?.name ?? "-"}
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
                          $
                          {(
                            document.total ??
                            0
                          ).toLocaleString(
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

                          <Tooltip title="Ver documento">

                            <IconButton
                              size="small"
                              onClick={() =>
                                navigate(
                                  `/documents/${document.id}`,
                                  {
                                    state: {
                                      returnTo:
                                        `/expenses/${claim.id}/edit`
                                    }
                                  }
                                )
                              }
                            >
                              <VisibilityIcon
                                fontSize="small"
                              />
                            </IconButton>

                          </Tooltip>


                          {!isApproved && (

                            <Tooltip title="Editar documento">

                              <IconButton
                                size="small"
                                onClick={() =>
                                  navigate(
                                    `/documents/${document.id}/edit`,
                                    {
                                      state: {
                                        returnTo:
                                          `/expenses/${claim.id}/edit`
                                      }
                                    }
                                  )
                                }
                              >
                                <EditIcon
                                  fontSize="small"
                                />
                              </IconButton>

                            </Tooltip>

                          )}

                        </TableCell>

                      </TableRow>

                    );

                  }
                )}

              </TableBody>

            </Table>

          </TableContainer>

        )}


      </Paper>


      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center"
        }}
      >

        <Typography variant="h6">
          Total: $
          {selectedTotal.toLocaleString(
            "es-CL"
          )}
        </Typography>


        <Button
          variant="contained"
          startIcon={
            <SaveIcon />
          }
          onClick={handleSave}
        >
          Guardar cambios
        </Button>

      </Box>

    </>
  );
}