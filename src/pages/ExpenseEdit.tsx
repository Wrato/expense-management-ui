import {
    Box,
    Typography,
    Button,
    Paper,
    Checkbox,
    FormControlLabel,
    TextField,
    Chip
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../models/UserRole";

import type { ExpenseClaim } from "../models/ExpenseClaim";
import { ExpenseClaimStatus } from "../models/ExpenseClaimStatus";

import type { ExpenseDocument } from "../models/ExpenseDocument";
import { DocumentStatus } from "../models/DocumentStatus";

import type { Project } from "../models/Project";

import {
    getExpenseClaims,
    updateExpenseClaimDocuments,
    updateExpenseClaim
} from "../services/expenseClaimService";

import { getDocuments } from "../services/expenseDocumentService";
import { getProjects } from "../services/projectService";

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

    const [title, setTitle] = useState("");

    const [claim, setClaim] =
        useState<ExpenseClaim | null>(null);

    const [projects, setProjects] =
        useState<Project[]>([]);

    const [documents, setDocuments] =
        useState<ExpenseDocument[]>([]);

    const [selectedDocuments, setSelectedDocuments] =
        useState<number[]>([]);

    const { user } = useAuth();


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

            setTitle(selectedClaim.title);

            setProjects(projectsResponse);


            /*
             * Documentos actualmente asociados
             * a la rendición.
             */
            const assignedDocuments =
                documentsResponse.filter(
                    document =>
                        document.expenseClaimId === claimId
                );


            const assignedDocumentIds =
                assignedDocuments.map(
                    document => document.id
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
             * - pertenecer al mismo proyecto
             * - pertenecer al trabajador actual
             *
             * Los documentos APPROVED o REJECTED
             * no pueden agregarse.
             */
            const availableDocuments =
                documentsResponse.filter(document => {

                    const isAssigned =
                        document.expenseClaimId === claimId;


                    const isFree =
                        document.expenseClaimId === null;


                    /*
                     * Si pertenece a otra rendición,
                     * no está disponible.
                     */
                    if (!isFree && !isAssigned) {
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
                     * Debe pertenecer al mismo proyecto.
                     */
                    if (
                        document.projectId !==
                        selectedClaim.projectId
                    ) {
                        return false;
                    }


                    /*
                     * Admin puede agregar cualquier
                     * documento que cumpla las reglas.
                     */
                    if (
                        user?.role === UserRole.Admin
                    ) {
                        return true;
                    }


                    /*
                     * Los demás usuarios solamente
                     * pueden agregar sus propios documentos.
                     */
                    return (
                        document.employeeId ===
                        user?.id
                    );
                });


            /*
             * Mostramos:
             *
             * 1. Documentos ya asociados.
             * 2. Documentos PENDING disponibles.
             *
             * Eliminamos duplicados por seguridad.
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

    }, [id, user?.id, user?.role]);


    /*
     * Marca o desmarca un documento.
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
         * Los documentos APPROVED están bloqueados.
         */
        if (
            document.status ===
            DocumentStatus.Approved
        ) {
            return;
        }


        setSelectedDocuments(current => {

            if (
                current.includes(documentId)
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

        });

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
                    sum + (document.total ?? 0),
                0
            );


    const handleSave = async () => {

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
         *
         * Lo mantenemos temporalmente porque
         * Returned todavía existe en el modelo.
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


    const project =
        projects.find(
            project =>
                project.id === claim.projectId
        );


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
                            md: "repeat(3, 1fr)"
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
                    Puedes agregar documentos pendientes
                    o quitar documentos de esta rendición.
                    Los documentos aprobados están bloqueados.
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


                {documents.map(document => {

                    const isApproved =
                        document.status ===
                        DocumentStatus.Approved;


                    const isSelected =
                        selectedDocuments.includes(
                            document.id
                        );


                    return (

                        <Box
                            key={document.id}
                            sx={{
                                borderBottom: 1,
                                borderColor: "divider",
                                py: 1
                            }}
                        >

                            <FormControlLabel

                                control={

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
                                                Documento:{" "}
                                                {document.documentNumber ??
                                                    "-"}
                                            </Typography>


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

                                        </Box>


                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Fecha:{" "}
                                            {document.issueDate ??
                                                "-"}
                                            {" — "}
                                            Total: $
                                            {(document.total ??
                                                0
                                            ).toLocaleString(
                                                "es-CL"
                                            )}
                                        </Typography>

                                    </Box>

                                }

                            />

                        </Box>

                    );

                })}

            </Paper>


            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >

                <Typography variant="h6">
                    Total:{" "}
                    $
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