import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { useAuth } from "../hooks/useAuth";

import type { ExpenseClaim } from "../models/ExpenseClaim";
import type { ExpenseDocument } from "../models/ExpenseDocument";
import { ExpenseClaimStatus } from "../models/ExpenseClaimStatus";
import type { Project } from "../models/Project";
import { UserRole } from "../models/UserRole";

import { users } from "../mocks/users";

import {
  getExpenseClaims,
  submitExpenseClaim
} from "../services/expenseClaimService";

import { getDocuments } from "../services/expenseDocumentService";
import { getProjects } from "../services/projectService";

import {
  getExpenseClaimStatusColor,
  getExpenseClaimStatusLabel
} from "../utils/expenseClaimStatusUtils";

export default function Expenses() {
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
  const [documents, setDocuments] = useState<ExpenseDocument[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const { user } = useAuth();

  const navigate = useNavigate();

  const isEmployee = user?.role === UserRole.Employee;

  useEffect(() => {
    async function loadData() {
      const claimsResponse = await getExpenseClaims();
      const documentsResponse = await getDocuments();
      const projectsResponse = await getProjects();

      setClaims(claimsResponse);
      setDocuments(documentsResponse);
      setProjects(projectsResponse);
    }

    loadData();
  }, []);

  const visibleClaims = isEmployee
    ? claims.filter(
        claim => claim.employeeId === user?.id
      )
    : claims;

  const getClaimTotal = (claimId: number) => {
    return documents
      .filter(
        document =>
          document.expenseClaimId === claimId
      )
      .reduce(
        (sum, document) =>
          sum + (document.total ?? 0),
        0
      );
  };

  const canSubmitClaim = (claim: ExpenseClaim) => {
    if (!user) {
      return false;
    }

    if (
      claim.status !== ExpenseClaimStatus.Draft &&
      claim.status !== ExpenseClaimStatus.Returned
    ) {
      return false;
    }

    const claimDocuments = documents.filter(
      document =>
        document.expenseClaimId === claim.id
    );

    return claimDocuments.length > 0;
  };

  const goToNewExpense = () => {
    navigate("/new-expense");
  };

  const getProjectName = (
    projectId: number | null
  ) => {
    if (projectId === null) {
      return "-";
    }

    return (
      projects.find(
        project => project.id === projectId
      )?.name ?? "-"
    );
  };

  const handleSubmitClaim = async (
    event: React.MouseEvent,
    claim: ExpenseClaim
  ) => {
    event.stopPropagation();

    if (!user) {
      return;
    }

    try {
      const updatedClaim =
        await submitExpenseClaim(
          claim.id,
          user
        );

      setClaims(currentClaims =>
        currentClaims.map(currentClaim =>
          currentClaim.id === updatedClaim.id
            ? updatedClaim
            : currentClaim
        )
      );

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
        <Typography variant="h4">
          {isEmployee
            ? "Mis Rendiciones"
            : "Rendiciones"}
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={goToNewExpense}
        >
          Nueva Rendición
        </Button>
      </Box>

      <TextField
        label="Buscar"
        size="small"
        fullWidth
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Rendición</TableCell>

              {!isEmployee && (
                <TableCell>
                  Trabajador
                </TableCell>
              )}

              <TableCell>Proyecto</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleClaims.map(claim => {
              const employee = users.find(
                user =>
                  user.id === claim.employeeId
              );

              return (
                <TableRow
                  key={claim.id}
                  hover
                  onClick={() =>
                    navigate(
                      `/expenses/${claim.id}`
                    )
                  }
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>
                    {claim.createdAt}
                  </TableCell>

                  <TableCell>
                    {claim.title}
                  </TableCell>

                  {!isEmployee && (
                    <TableCell>
                      {employee?.name ?? "-"}
                    </TableCell>
                  )}

                  <TableCell>
                    {getProjectName(
                      claim.projectId
                    )}
                  </TableCell>

                  <TableCell>
                    $
                    {getClaimTotal(
                      claim.id
                    ).toLocaleString("es-CL")}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getExpenseClaimStatusLabel(
                        claim.status
                      )}
                      color={getExpenseClaimStatusColor(
                        claim.status
                      )}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    {canSubmitClaim(claim) && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={event =>
                          handleSubmitClaim(
                            event,
                            claim
                          )
                        }
                      >
                        Enviar a revisión
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}